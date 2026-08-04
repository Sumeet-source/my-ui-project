// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { useToast } from '../hooks/useToast';

export default function Login() {
  const [loginMode, setLoginMode] = useState('password'); // 'password' | 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  // const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginMode === 'password') {
      if (!email || !password) {
        alert('Please enter email and password');
        return;
      }
      console.log('Login with Password:', { email, password });
      // showToast('Logged in!', 'success');
      navigate('/');
    } else {
      if (!mobile) {
        alert('Please enter mobile number');
        return;
      }
      console.log('Login with OTP:', { mobile });
      // showToast('OTP sent!', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm sm:shadow-md p-6 sm:p-8 lg:p-10">
        
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900">
          Log In
        </h2>
        <p className="mt-1 text-center text-sm text-gray-600">
          Sign up for faster checkout &amp; easy returns
        </p>

        {/* Mode Tabs - responsive flex */}
        <div className="mt-6 grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => setLoginMode('password')}
            className={`py-2.5 text-sm font-medium rounded-lg transition ${
              loginMode === 'password'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Log In with Password
          </button>
          <button
            onClick={() => setLoginMode('otp')}
            className={`py-2.5 text-sm font-medium rounded-lg transition ${
              loginMode === 'otp'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Log In with OTP
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          {/* Password Mode Fields */}
          {loginMode === 'password' && (
            <>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="mt-1 w-full h-12 px-4 text-base border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-12 px-4 text-base border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition pr-16"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-4 h-12 flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <a href="#" className="text-sm text-indigo-600 hover:underline">
                  Forgot Password?
                </a>
              </div>
            </>
          )}

          {/* OTP Mode Fields */}
          {loginMode === 'otp' && (
            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <div className="mt-1 flex">
                <span className="inline-flex items-center px-4 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-gray-600 text-base h-12">
                  +91
                </span>
                <input
                  id="mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Mobile Number"
                  className="w-full h-12 px-4 text-base border border-gray-300 rounded-r-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  required
                />
              </div>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full h-12 flex items-center justify-center text-base font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition duration-200 shadow-sm"
          >
            {loginMode === 'password' ? 'Sign In' : 'Login With OTP'}
          </button>

          {/* Terms & Register */}
          <p className="text-xs text-gray-500 text-center">
            By logging in, you agree to the{' '}
            <a href="#" className="text-indigo-600 hover:underline">Terms &amp; Conditions</a> and{' '}
            <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>.
          </p>

          <div className="text-center text-sm">
            <span className="text-gray-600">New to Under Armour? </span>
            <Link to="/signup" className="font-medium text-indigo-600 hover:underline">
              Register
            </Link>
          </div>

          {/* Out of stock note (as shown in your images) */}
          <p className="text-center text-xs text-red-500 border-t border-gray-200 pt-4 mt-2">
            The requested product is out of stock at this time.
          </p>
        </form>
      </div>
    </div>
  );
}