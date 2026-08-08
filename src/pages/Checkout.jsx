import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();

  const { cart, clearCart, getTotalPrice, discount, clearDiscount } = useCart() || { 
    cart: [], 
    clearCart: () => {}, 
    getTotalPrice: () => 0, 
    discount: { amount: 0, code: '' },
    clearDiscount: () => {}
  };

  const subtotal = getTotalPrice(); 
  const deliveryFee = 0;
  const total = Math.max(0, subtotal - (discount?.amount || 0));

  const [address, setAddress] = useState({ fullName: '', street: '', city: '', pincode: '', phone: '' });
  const [loading, setLoading] = useState(false);
  // 🟢 NEW: Payment Method State
  const [paymentMethod, setPaymentMethod] = useState('Razorpay'); // Default is Razorpay

  useEffect(() => {
    const fetchDefaultAddress = async () => {
      try {
        const res = await axiosClient.get('/api/addresses');
        if (res.data && Array.isArray(res.data)) {
          const defaultAddr = res.data.find(addr => addr.isDefault === true);
          if (defaultAddr) {
            setAddress({
              fullName: defaultAddr.fullName || '', street: defaultAddr.street || '',
              city: defaultAddr.city || '', pincode: defaultAddr.pincode || '',
              phone: defaultAddr.phone || ''
            });
          }
        }
      } catch (error) { console.log('Address API error'); }
    };
    if (user) fetchDefaultAddress();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!address.fullName || !address.street || !address.city || !address.pincode || !address.phone) {
      showToast('Please fill all delivery address fields!', 'error');
      return;
    }
    if (!cart || cart.length === 0) {
      showToast('Your cart is empty!', 'warning');
      return;
    }

    setLoading(true);
    try {
      // Common order data for both COD and Razorpay
      const orderData = {
        user: user?._id || user?.id || 'guest',
        items: cart.map(item => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          image: item.image
        })),
        totalAmount: total,
        paymentMethod: paymentMethod,
        shippingAddress: address,
      };

      // 🟢 CASH ON DELIVERY LOGIC
      if (paymentMethod === 'Cash on Delivery') {
        await axiosClient.post('/api/orders', orderData);
        showToast('Order placed successfully! (Cash on Delivery) 🎉', 'success');
        clearCart?.();
        clearDiscount?.();
        setTimeout(() => navigate('/dashboard'), 300);
      } 
      // 🔵 RAZORPAY LOGIC (Existing)
      else {
        const orderRes = await axiosClient.post('/api/orders/create-razorpay-order', { amount: total });
        const { id: orderId, amount, currency } = orderRes.data;
        if (!orderId) throw new Error('Failed to create Razorpay order');

        if (!window.Razorpay) {
          showToast('Razorpay SDK is still loading. Please try again in a moment.', 'warning');
          setLoading(false);
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_...',
          amount, currency, name: 'FORGE', description: 'Order Payment', order_id: orderId,
          handler: async (response) => {
            try {
              // Save order with Razorpay details
              await axiosClient.post('/api/orders', {
                ...orderData,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature
              });
              
              showToast('Order placed successfully! 🎉', 'success');
              clearCart?.();
              clearDiscount?.();

              setTimeout(() => navigate('/dashboard'), 300);
            } catch (saveError) {
              console.error('❌ Order save error:', saveError);
              alert('Payment successful, but failed to save order.\nError: ' + (saveError.response?.data?.message || saveError.message));
              showToast('Payment successful, but failed to save order.', 'error');
            }
          },
          prefill: { name: address.fullName, email: user?.email || '', contact: address.phone },
          theme: { color: '#000000' },
          modal: { ondismiss: () => { setLoading(false); showToast('Payment cancelled', 'info'); } }
        };
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      console.error('Payment error:', error);
      showToast(error.response?.data?.message || 'Failed to initiate payment', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white min-h-screen">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Delivery Address */}
        <div className="flex-1 bg-white p-6 lg:p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-5">Delivery Address</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">Full Name</label>
              <input type="text" name="fullName" value={address.fullName} onChange={handleChange} placeholder="John Doe" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">Address</label>
              <input type="text" name="street" value={address.street} onChange={handleChange} placeholder="123 Main St" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1.5">City</label>
                <input type="text" name="city" value={address.city} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1.5">Pincode</label>
                <input type="text" name="pincode" value={address.pincode} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">Phone Number</label>
              <input type="text" name="phone" value={address.phone} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm" />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="flex-1 lg:max-w-md bg-white p-6 lg:p-8 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          {!cart || cart.length === 0 ? (<p className="text-gray-500 py-4">Your cart is empty.</p>) : (
            <div className="space-y-4">
              {cart.map((item) => <div key={item.id} className="flex justify-between text-sm"><span>{item.title} x {item.quantity}</span><span>${(item.price * item.quantity).toFixed(2)}</span></div>)}
              
              {/* 🟢 PAYMENT METHOD SELECTION */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-2">Payment Method</h3>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="Razorpay" 
                      checked={paymentMethod === 'Razorpay'} 
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 accent-black"
                    />
                    <span className="text-sm text-gray-700">Razorpay (Card / UPI / Netbanking)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="Cash on Delivery" 
                      checked={paymentMethod === 'Cash on Delivery'} 
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 accent-black"
                    />
                    <span className="text-sm text-gray-700">Cash on Delivery</span>
                  </label>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Delivery</span><span className="text-green-600 font-medium">FREE</span></div>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
              
              {/* 🟢 DYNAMIC BUTTON TEXT */}
              <button onClick={handlePayment} disabled={loading} className="w-full mt-5 h-12 flex items-center justify-center font-semibold text-white bg-black hover:bg-gray-800 transition rounded-lg shadow disabled:opacity-70">
                {loading ? 'Processing...' : paymentMethod === 'Cash on Delivery' ? `Place Order (COD)` : `Pay $${total.toFixed(2)}`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}