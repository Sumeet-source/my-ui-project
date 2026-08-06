import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useToast } from '../context/ToastContext.jsx';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosClient.post('/api/auth/forgot-password', { email });
      showToast('Reset link sent to your email!', 'success');
      navigate('/login');
    } catch (error) {
      showToast(error.response?.data?.message || 'Something went wrong.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Forgot Password</h1>
        <p className="text-sm text-center text-gray-600 mb-6">Enter your email address and we'll send you a link to reset your password.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="mt-1 w-full h-12 px-4 border border-gray-300 rounded focus:outline-none focus:border-black"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-black text-white font-semibold hover:bg-gray-800 transition"
          >
            {loading ? 'Sending...' : 'Send Reset Email'}
          </button>
          <div className="text-center text-sm">
            <Link to="/login" className="text-gray-600 hover:text-black underline">Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}