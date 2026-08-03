import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext.jsx';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [view, setView] = useState('profile');

  // Fallback: try to load user from localStorage if context is missing
  const effectiveUser = user || (() => {
    const stored = localStorage.getItem('forge_user');
    return stored ? JSON.parse(stored) : null;
  })();

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully.", "info");
    navigate('/');
  };

  if (!effectiveUser) {
    return (
      <div className="text-center py-20 text-xl text-gray-600">
        Please log in to view your dashboard.
      </div>
    );
  }

  const orders = JSON.parse(localStorage.getItem(`orders_${effectiveUser.email}`) || '[]');

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome back, {effectiveUser.name}!</h1>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 space-y-4">
        <div className="border-b border-gray-200 pb-4 flex gap-4 mb-4">
          <button onClick={() => setView('profile')} className={`font-semibold transition ${view === 'profile' ? 'text-black border-b-2 border-black pb-1' : 'text-gray-500 hover:text-black'}`}>
            My Profile
          </button>
          <button onClick={() => setView('orders')} className={`font-semibold transition ${view === 'orders' ? 'text-black border-b-2 border-black pb-1' : 'text-gray-500 hover:text-black'}`}>
            Order History ({orders.length})
          </button>
        </div>

        {view === 'profile' && (
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <p className="text-gray-600"><span className="font-semibold">Email:</span> {effectiveUser.email}</p>
              <p className="text-gray-600"><span className="font-semibold">Member since:</span> {new Date(effectiveUser.id).toLocaleDateString()}</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={handleLogout} className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition">Log Out</button>
              {effectiveUser.email === 'admin@test.com' && (
                <Link to="/admin" className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition">Go to Admin Panel</Link>
              )}
            </div>
          </div>
        )}

        {view === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-gray-500 italic">You haven't placed any orders yet.</p>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-2 border-b border-gray-200 pb-2">
                      <span className="font-bold text-gray-900">Order #{order.id}</span>
                      <span className="text-sm text-gray-500">{order.date}</span>
                    </div>
                    <div className="space-y-2 mb-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm text-gray-600">
                          <span>{item.title} {item.size ? `(Size: ${item.size})` : ''} <span className="font-bold">x{item.quantity}</span></span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 border-t border-gray-300 pt-2">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}