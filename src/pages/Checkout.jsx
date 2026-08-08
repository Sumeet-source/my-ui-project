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
      const orderRes = await axiosClient.post('/api/orders/create-razorpay-order', { amount: total });
      const { id: orderId, amount, currency } = orderRes.data;
      if (!orderId) throw new Error('Failed to create Razorpay order');

      const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) { showToast('Razorpay SDK failed to load.', 'error'); setLoading(false); return; }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_...',
        amount, currency, name: 'FORGE', description: 'Order Payment', order_id: orderId,
        handler: async (response) => {
          try {
            // 🟢 Pay Success: Backend me order save karo
            await axiosClient.post('/api/orders', {
              user: user?._id || user?.id || 'guest', 
              items: cart, 
              totalAmount: total,
              paymentMethod: 'Razorpay', shippingAddress: address,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature
            });
            
            showToast('Order placed successfully! 🎉', 'success');
            clearCart?.();
            clearDiscount?.();

            // 🔥 FIX: Razorpay popup band hone ke baad redirect
            setTimeout(() => {
              navigate('/dashboard'); 
            }, 300);

          } catch (saveError) {
            console.error('❌ Order save error:', saveError);
            // 🟡 Agar order save me error aata hai toh user ko dikhao
            alert('Payment successful, but failed to save order. Please contact support.\nError: ' + (saveError.response?.data?.message || saveError.message));
            showToast('Payment successful, but failed to save order.', 'error');
          }
        },
        prefill: { name: address.fullName, email: user?.email || '', contact: address.phone },
        theme: { color: '#000000' },
        modal: { ondismiss: () => { setLoading(false); showToast('Payment cancelled', 'info'); } }
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
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
        <div className="flex-1 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
          <div className="space-y-4">
            <div><label className="block text-sm font-semibold text-gray-700">Full Name</label><input type="text" name="fullName" value={address.fullName} onChange={handleChange} /></div>
            <div><label className="block text-sm font-semibold text-gray-700">Address</label><input type="text" name="street" value={address.street} onChange={handleChange} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-semibold text-gray-700">City</label><input type="text" name="city" value={address.city} onChange={handleChange} /></div>
              <div><label className="block text-sm font-semibold text-gray-700">Pincode</label><input type="text" name="pincode" value={address.pincode} onChange={handleChange} /></div>
            </div>
            <div><label className="block text-sm font-semibold text-gray-700">Phone Number</label><input type="text" name="phone" value={address.phone} onChange={handleChange} /></div>
          </div>
        </div>
        <div className="flex-1 bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          {!cart || cart.length === 0 ? (<p className="text-gray-500 py-4">Your cart is empty.</p>) : (
            <div className="space-y-4">
              {cart.map((item) => <div key={item.id} className="flex justify-between text-sm"><span>{item.title} x {item.quantity}</span><span>${(item.price * item.quantity).toFixed(2)}</span></div>)}
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Delivery</span><span className="text-green-600 font-medium">FREE</span></div>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
              <button onClick={handlePayment} disabled={loading} className="w-full mt-4 h-12 bg-black text-white font-semibold rounded disabled:opacity-70">
                {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}