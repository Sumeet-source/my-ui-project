import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter email and password', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        showToast('Logged in successfully!', 'success');
        
        // 🟢 STEP 4 (FINAL): YEH 2 LINES ADD KARO (Redirect handle karna)
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect') || '/';
        navigate(redirect);
        
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-5">
        
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Log In</h1>
          <p className="mt-2 text-sm text-gray-600">Sign in to manage your orders and wishlist.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1.5">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="abc@gmail.com"
              className="w-full h-12 px-4 text-base bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-1.5">
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-12 px-4 text-base bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all pr-16"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-4 h-12 flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-black transition-colors">
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full h-12 flex items-center justify-center text-base font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition duration-200 rounded-lg shadow-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center text-sm pt-2">
          <span className="text-gray-600">New to Forge? </span>
          <Link to="/signup" className="font-medium text-black hover:underline transition">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}