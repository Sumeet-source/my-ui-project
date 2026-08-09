import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext.jsx';
import axiosClient from '../api/axiosClient'; 

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [view, setView] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const getDateFromObjectId = (id) => {
    if (!id) return 'N/A';
    try {
      const timestamp = parseInt(id.substring(0, 8), 16) * 1000;
      return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-500 text-white';
      case 'processing': return 'bg-blue-500 text-white';
      case 'shipped': return 'bg-purple-600 text-white';
      case 'delivered': return 'bg-green-600 text-white';
      case 'cancelled': return 'bg-red-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const effectiveUser = user || (() => {
    const stored = localStorage.getItem('user'); 
    return stored ? JSON.parse(stored) : null;
  })();

  useEffect(() => {
    if (effectiveUser) {
      fetchOrders();
    }
  }, [effectiveUser, view]);

  const fetchOrders = async () => {
    if (!effectiveUser) return;
    setLoadingOrders(true);
    try {
      const res = await axiosClient.get(`/api/orders/my-orders?userId=${effectiveUser.id}`);
      setOrders(res.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully.", "info");
    navigate('/');
  };

  if (!effectiveUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-10 bg-white rounded-xl shadow-lg">
          <p className="text-xl text-gray-600">Please log in to view your dashboard.</p>
          <Link to="/login" className="mt-4 inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition">Go to Login</Link>
        </div>
      </div>
    );
  }
  
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100 gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold shrink-0">
              {getInitials(effectiveUser.name)}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">Welcome back, {effectiveUser.name}!</h1>
              <p className="text-xs sm:text-sm text-gray-500">Member since {getDateFromObjectId(effectiveUser.id)}</p>
            </div>
          </div>
          
          {/* 🟢 PERFECT COMPACT LOGOUT BUTTON */}
          <button 
            onClick={handleLogout} 
            className="flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 transition text-sm font-medium w-max ml-auto sm:ml-0"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 border-b pb-2">Stats</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Total Orders</span>
                  <span className="font-bold text-black">{orders.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Member Since</span>
                  <span className="font-medium text-gray-800">{getDateFromObjectId(effectiveUser.id)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 border-b pb-2">Quick Actions</h3>
              <div className="space-y-2">
                <button onClick={() => setView('orders')} className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 transition">View Order History</button>
                <Link to="/wishlist" className="block w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 transition">My Wishlist</Link>
                {effectiveUser.isAdmin && (
                  <Link to="/admin" className="block w-full text-left px-3 py-2 text-sm font-medium text-white bg-black rounded hover:bg-gray-800 transition mt-2 text-center">
                    Go to Admin Panel
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[300px]">
            {view === 'profile' && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 border-b pb-2">My Profile Details</h3>
                <div className="space-y-3 text-gray-600 py-2">
                  <p><span className="font-medium text-gray-900">Email Address:</span> {effectiveUser.email}</p>
                  <p><span className="font-medium text-gray-900">Account Type:</span> {effectiveUser.isAdmin ? 'Administrator' : 'Customer'}</p>
                </div>
              </div>
            )}

            {view === 'orders' && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 border-b pb-2">Order History</h3>
                {loadingOrders ? (
                  <p className="text-gray-500 italic py-8 text-center">Loading your orders...</p>
                ) : orders.length === 0 ? (
                  <p className="text-gray-500 italic py-8 text-center">You haven't placed any orders yet. <Link to="/" className="text-black underline">Start shopping</Link></p>
                ) : (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {orders.map((order) => (
                      <div key={order._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 border-b border-gray-200 pb-2 gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-gray-900 text-sm">Order #{order._id.slice(-6)}</span>
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                              {order.status || 'Pending'}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="space-y-1 mb-2">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <Link key={idx} to={`/product/${item.productId}`} className="flex justify-between text-xs text-gray-600 hover:bg-gray-200 p-1 -mx-1 rounded transition">
                              <span>{item.title} {item.size ? `(Size: ${item.size})` : ''} <span className="font-bold">x{item.quantity}</span></span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </Link>
                          ))}
                          {order.items.length > 2 && <p className="text-xs text-gray-400">+ {order.items.length - 2} more items</p>}
                        </div>
                        {order.status?.toLowerCase() === 'shipped' && (
                          <div className="bg-purple-50 border border-purple-200 rounded p-2 mb-2 flex items-center gap-2">
                            <span className="text-purple-600 text-sm">🚚</span>
                            <span className="text-xs text-purple-700 font-medium">Your order will be delivered soon!</span>
                          </div>
                        )}
                        {order.status?.toLowerCase() === 'delivered' && (
                          <div className="bg-green-50 border border-green-200 rounded p-2 mb-2 flex items-center gap-2">
                            <span className="text-green-600 text-sm">✅</span>
                            <span className="text-xs text-green-700 font-medium">Delivered successfully.</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-sm text-gray-900 border-t border-gray-300 pt-2 mt-2">
                          <span>Total</span>
                          <span>${order.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}