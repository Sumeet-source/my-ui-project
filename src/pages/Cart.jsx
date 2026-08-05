import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart(); 
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [address, setAddress] = useState({ name: '', address: '' });

  const handlePlaceOrder = async () => {
    if (!upiId) {
      showToast("Please enter your UPI ID!", "error");
      return;
    }
    if (!address.name || !address.address) {
      showToast("Please fill in your name and address!", "error");
      return;
    }
    if (!user) {
      showToast("Please login to place an order!", "error");
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        user: user.id,
        items: cart.map(item => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          image: item.image
        })),
        totalAmount: getTotalPrice(),
        paymentMethod: 'UPI',
        upiId: upiId,
        shippingAddress: address
      };

      await axiosClient.post('https://forge-backend-production-1cef.up.railway.app/api/orders', orderData);
      
      clearCart();
      setIsModalOpen(false);
      setOrderPlaced(true);
      setIsProcessing(false);
      setUpiId('');
      setAddress({ name: '', address: '' });
      
      showToast("Payment successful! Order placed!", "success");
      setTimeout(() => setOrderPlaced(false), 4000);
      
    } catch (error) {
      console.error('Order Error Details:', error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to place order. Try again.";
      showToast(errorMessage, "error");
      setIsProcessing(false);
    }
  };

  // --- EMPTY CART UI ---
  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Register / Login Section (Sirf tabhi dikhega jab user logged out ho) */}
        {!user && (
          <div className="flex flex-col md:flex-row gap-6 mb-10 pb-8">
            <div className="flex-1">
              <p className="text-green-700 text-sm font-medium mb-4">Create an account to get exclusive benefits.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="flex-1 border border-black py-3 text-center font-medium hover:bg-gray-50 transition rounded">Register</Link>
                <Link to="/login" className="flex-1 border border-black py-3 text-center font-medium hover:bg-gray-50 transition rounded">Login</Link>
              </div>
            </div>
            <div className="flex-1 md:border-l md:border-gray-200 md:pl-6 flex flex-col justify-center gap-3 text-sm text-gray-600">
              {/* 🟢 UPDATED: SVGs instead of Emojis */}
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                Faster checkout
              </div>
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                Easier returns and exchanges
              </div>
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="M12 22V12"/><path d="m3.3 7 8.7 5 8.7-5"/></svg>
                Quick order information and tracking
              </div>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Bag</h1>
        
        {/* 🟢 FIXED: gap-12 ko gap-6 kar diya aur gap properly set kiya */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <p className="text-gray-900 font-medium text-lg">You have no items in your bag.</p>
            <p className="text-gray-500 mt-1 text-sm">Don't know where to start? Here's the gear everyone's after.</p>
            <Link to="/men" className="inline-block mt-6 bg-black text-white px-8 py-3 rounded font-medium hover:bg-gray-800 transition">Shop Best Sellers</Link>
            <Link to="/" className="block mt-4 text-sm text-gray-500 hover:text-black underline">Continue Shopping</Link>
          </div>
          
          {/* Right side placeholder (Grey box) */}
          <div className="hidden md:block flex-1 bg-gray-100 rounded-lg min-h-[250px]"></div>
        </div>
      </div>
    );
  }

  // --- CART WITH ITEMS UI (Same logic, clean layout) ---
  const subtotal = getTotalPrice();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {orderPlaced && (
        <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-sm">
          <p className="font-bold">✅ Order Placed Successfully!</p>
          <p className="text-sm">Your gear is on its way. Thanks for shopping!</p>
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Bag ({cart.length})</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="flex-1 space-y-4">
          {cart.map((item, index) => (
            <div key={index} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{item.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <button onClick={() => updateQuantity(item.title, -1)} className="w-6 h-6 border border-gray-300 rounded hover:bg-gray-100 flex items-center justify-center text-gray-600 transition">-</button>
                  <span className="text-gray-600 font-medium w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.title, 1)} className="w-6 h-6 border border-gray-300 rounded hover:bg-gray-100 flex items-center justify-center text-gray-600 transition">+</button>
                  <span className="text-gray-500 text-sm ml-2 font-medium">($ {(item.price * item.quantity).toFixed(2)})</span>
                </div>
                {item.size && <p className="text-xs text-gray-400">Size: {item.size}</p>}
              </div>
              <button onClick={() => removeFromCart(item.title)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Remove</button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3 bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-4">Order Summary</h2>
          <div className="flex justify-between text-gray-600 mb-2">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-4 mt-2">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="w-full bg-black text-white py-3 mt-6 rounded font-bold hover:bg-gray-800 transition uppercase tracking-wider">Checkout</button>
        </div>
      </div>

      {/* UPI Payment Modal (Same as before) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white max-w-md w-full rounded-xl shadow-2xl p-6 relative">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Payment</h2>
            <p className="text-gray-500 text-sm mb-6">Pay securely via UPI.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input type="text" value={address.name} onChange={(e) => setAddress({...address, name: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-black" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                <input type="text" value={address.address} onChange={(e) => setAddress({...address, address: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-black" placeholder="123 Main St" />
              </div>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4 flex items-center gap-2"><span className="text-2xl">📱</span><span className="text-sm text-blue-800 font-medium">UPI / QR Code Payment</span></div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Enter your UPI ID</label>
                <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-black" placeholder="e.g. merchant@upi" />
              </div>
              <div className="pt-4 space-y-2">
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className={`w-full py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Processing...
                    </>
                  ) : (
                    `Pay ₹${(subtotal * 83).toFixed(0)} via UPI`
                  )}
                </button>
                <button onClick={() => setIsModalOpen(false)} disabled={isProcessing} className="w-full text-gray-500 py-2 hover:text-black transition text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}