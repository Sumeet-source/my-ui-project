import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import axiosClient from '../api/axiosClient';

export default function Cart() {
  const navigate = useNavigate(); 
  const { cart, addToCart, removeFromCart, updateQuantity, getTotalPrice, clearCart, discount, applyDiscount, clearDiscount } = useCart(); 
  
  // 🟢 FIX 1: 'loading' ko destructure kiya
  const { user, loading } = useAuth(); 
  const { showToast } = useToast();
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // 🟢 Login ke baad pending item restore karo
  useEffect(() => {
    const pendingItem = localStorage.getItem('pendingCartItem');
    if (pendingItem) {
      const item = JSON.parse(pendingItem);
      addToCart(item);
      localStorage.removeItem('pendingCartItem'); 
      showToast("Item added to your cart!", "success");
    }
  }, []); 

  // 🟢 FIX 2: Safety Check - Ab auth loading complete hone ke baad hi cart clear karega
  useEffect(() => {
    // 🔥 Jab tak loading true hai, wait karo. Jab loading complete ho aur user null ho, tab clear karo.
    if (!loading && !user) {
      clearCart();
    }
  }, [user, loading, clearCart]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      showToast('Please enter a coupon code.', 'error');
      return;
    }

    setApplyingCoupon(true);
    try {
      const subtotal = getTotalPrice();
      const res = await axiosClient.post('/api/coupons/apply', { 
        code: couponCode.trim(), 
        cartTotal: subtotal 
      });
      
      if (res.data.success) {
        applyDiscount(res.data.discountAmount, res.data.couponCode);
        showToast(`Coupon applied! You saved $${res.data.discountAmount}`, 'success');
        setCouponCode('');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid coupon code.';
      showToast(msg, 'error');
    } finally {
      setApplyingCoupon(false);
    }
  };

  // --- EMPTY CART UI ---
  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        {!user && (
          <div className="flex flex-col md:flex-row gap-6 mb-10 pb-8">
            <div className="flex-1">
              <p className="text-green-700 text-sm font-medium mb-4">Create an account to get exclusive benefits.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button type="button" onClick={() => navigate('/signup')} className="flex-1 border border-black py-3 text-center font-medium hover:bg-gray-50 transition rounded">Register</button>
                <button type="button" onClick={() => navigate('/login')} className="flex-1 border border-black py-3 text-center font-medium hover:bg-gray-50 transition rounded">Login</button>
              </div>
            </div>
            <div className="flex-1 md:border-l md:border-gray-200 md:pl-6 flex flex-col justify-center gap-3 text-sm text-gray-600">
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
        <div className={`flex flex-col ${!user ? 'md:flex-row gap-6' : ''}`}>
          <div className={!user ? 'flex-1' : ''}>
            <p className="text-gray-900 font-medium text-lg">You have no items in your bag.</p>
            <p className="text-gray-500 mt-1 text-sm">Don't know where to start? Here's the gear everyone's after.</p>
            <button type="button" onClick={() => navigate('/men')} className="inline-block mt-6 bg-black text-white px-8 py-3 rounded font-medium hover:bg-gray-800 transition">Shop Best Sellers</button>
            <button type="button" onClick={() => navigate('/')} className="block mt-4 text-sm text-gray-500 hover:text-black underline">Continue Shopping</button>
          </div>
          {!user && <div className="hidden md:block flex-1 bg-gray-100 rounded-lg min-h-[250px]"></div>}
        </div>
      </div>
    );
  }

  // --- CART WITH ITEMS UI ---
  const subtotal = getTotalPrice();
  const finalTotal = subtotal - discount.amount;

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
        <div className="flex-1 space-y-4">
          {cart.map((item, index) => (
            <div key={`${item.id}-${item.size}-${index}`} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{item.title} ({item.size})</h3>
                <div className="flex items-center gap-2 mt-1">
                  <button onClick={() => updateQuantity(item.id, item.size, -1)} className="w-6 h-6 border border-gray-300 rounded hover:bg-gray-100 flex items-center justify-center text-gray-600 transition">-</button>
                  <span className="text-gray-600 font-medium w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.size, 1)} className="w-6 h-6 border border-gray-300 rounded hover:bg-gray-100 flex items-center justify-center text-gray-600 transition">+</button>
                  <span className="text-gray-500 text-sm ml-2 font-medium">($ {(item.price * item.quantity).toFixed(2)})</span>
                </div>
                {item.size && <p className="text-xs text-gray-400">Size: {item.size}</p>}
              </div>
              <button onClick={() => removeFromCart(item.id, item.size)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Remove</button>
            </div>
          ))}
        </div>

        <div className="lg:w-1/3 bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-4">Order Summary</h2>
          <div className="flex justify-between text-gray-600 mb-2">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex gap-2 mt-2">
            <input 
              type="text" 
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Coupon Code"
              className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
            />
            <button 
              onClick={handleApplyCoupon}
              disabled={applyingCoupon}
              className="bg-black text-white px-3 py-2 text-sm font-medium rounded hover:bg-gray-800 transition disabled:opacity-50"
            >
              {applyingCoupon ? '...' : 'Apply'}
            </button>
          </div>

          {discount.amount > 0 && (
            <div className="flex justify-between text-green-600 text-sm mt-2">
              <span>Discount ({discount.code})</span>
              <span>-${discount.amount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-4 mt-2">
            <span>Total</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
          
          <button type="button" onClick={() => navigate('/checkout')} className="w-full bg-black text-white py-3 mt-6 rounded font-bold hover:bg-gray-800 transition uppercase tracking-wider text-center block">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}