import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useToast } from '../context/ToastContext.jsx';

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match!', 'error');
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post('/api/auth/reset-password', { token, newPassword });
      showToast('Password reset successfully!', 'success');
      navigate('/login');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to reset password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Reset Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="mt-1 w-full h-12 px-4 border border-gray-300 rounded focus:outline-none focus:border-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="mt-1 w-full h-12 px-4 border border-gray-300 rounded focus:outline-none focus:border-black"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-black text-white font-semibold hover:bg-gray-800 transition"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}