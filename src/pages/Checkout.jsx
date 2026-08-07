import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import axiosClient from '../api/axiosClient';

export default function Checkout() {
  const { cart, getTotalPrice, clearCart, discount } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '', address: '', city: '', pincode: '', phone: ''
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user) fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const res = await axiosClient.get(`/api/addresses?userId=${user.id}`);
      setSavedAddresses(res.data);
      const defaultAddr = res.data.find(a => a.isDefault);
      if (defaultAddr) {
        setFormData({
          fullName: defaultAddr.recipient,
          address: defaultAddr.addressLine1 + (defaultAddr.addressLine2 ? ', ' + defaultAddr.addressLine2 : ''),
          city: defaultAddr.city,
          pincode: defaultAddr.pincode,
          phone: defaultAddr.phone
        });
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleAddressSelect = (e) => {
    const id = e.target.value;
    const addr = savedAddresses.find(a => a._id === id);
    if (addr) {
      setFormData({
        fullName: addr.recipient,
        address: addr.addressLine1 + (addr.addressLine2 ? ', ' + addr.addressLine2 : ''),
        city: addr.city,
        pincode: addr.pincode,
        phone: addr.phone
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) { showToast("Please login!", "error"); navigate('/login'); return; }
    if (!formData.fullName || !formData.address || !formData.city || !formData.pincode || !formData.phone) {
      showToast("Please fill in all shipping details!", "error"); return;
    }
    setIsProcessing(true);
    try {
      const subtotal = getTotalPrice();
      const deliveryCharge = subtotal > 50 ? 0 : 5.99;
      const totalAmount = subtotal + deliveryCharge - discount.amount; // 🟢 Discount subtract
      const totalInINR = Math.round(Math.max(0, totalAmount) * 83); // Ensure not negative

      const orderRes = await axiosClient.post('/api/orders/create-razorpay-order', { amount: totalInINR });
      const { id: razorpayOrderId, amount } = orderRes.data;

      if (typeof window.Razorpay === 'undefined') { showToast("Razorpay script not loaded.", "error"); setIsProcessing(false); return; }

      const options = {
        key: 'rzp_test_TMPiYtHOb57IVs',
        amount: amount,
        currency: 'INR',
        name: 'FORGE',
        description: 'Order Payment',
        order_id: razorpayOrderId,
        handler: async (response) => {
          const orderData = {
            user: user.id,
            items: cart.map(item => ({ productId: item.id, title: item.title, price: item.price, quantity: item.quantity, size: item.size, image: item.image })),
            totalAmount: totalAmount,
            paymentMethod: 'Razorpay',
            shippingAddress: formData
          };
          await axiosClient.post('/api/orders', orderData);
          clearCart();
          showToast("Payment successful! Order placed!", "success");
          setIsProcessing(false);
          navigate('/dashboard');
        },
        prefill: { name: formData.fullName, email: user.email, contact: formData.phone },
        theme: { color: '#000000' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      showToast("Failed to process payment", "error");
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) return <div className="text-center py-20">Cart is empty. <Link to="/" className="underline">Go back</Link></div>;

  const subtotal = getTotalPrice();
  const deliveryCharge = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + deliveryCharge - discount.amount;

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Delivery Address</h1>
          
          {user && savedAddresses.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Use a Saved Address</label>
              <select onChange={handleAddressSelect} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-black">
                <option value="">Choose a saved address...</option>
                {savedAddresses.map((addr) => (
                  <option key={addr._id} value={addr._id}>{addr.label}: {addr.recipient}, {addr.city}</option>
                ))}
              </select>
            </div>
          )}

          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label><input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-black" required /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Address</label><input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-black" required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-semibold text-gray-700 mb-1">City</label><input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-black" required /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1">Pincode</label><input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-black" required /></div>
            </div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label><input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-black" required /></div>
            <button type="submit" disabled={isProcessing} className={`w-full py-3 mt-4 rounded font-bold text-white transition ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`}>
              {isProcessing ? 'Processing...' : `Pay ₹${(Math.max(0, total) * 83).toFixed(0)}`}
            </button>
          </form>
        </div>
        <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-4 mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm text-gray-600">
            {cart.map((item, idx) => (
              <div key={idx} className="flex justify-between"><span>{item.title} x {item.quantity}</span><span>${(item.price * item.quantity).toFixed(2)}</span></div>
            ))}
          </div>
          <div className="border-t border-gray-200 mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Delivery</span><span>{deliveryCharge === 0 ? 'FREE' : `$${deliveryCharge.toFixed(2)}`}</span></div>
            {discount.amount > 0 && (
              <div className="flex justify-between text-green-600"><span>Discount ({discount.code})</span><span>-${discount.amount.toFixed(2)}</span></div>
            )}
            <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-200"><span>Total</span><span>${Math.max(0, total).toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}