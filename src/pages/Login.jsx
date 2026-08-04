import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [loginMode, setLoginMode] = useState('password'); // 'password' | 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginMode === 'password') {
      if (!email || !password) {
        alert('Please enter email and password');
        return;
      }
      console.log('Login with Password:', { email, password });
      navigate('/');
    } else {
      if (!mobile) {
        alert('Please enter mobile number');
        return;
      }
      console.log('Login with OTP:', { mobile });
      alert('OTP sent to your mobile!');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 tracking-tight">
          Log In
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign up for faster checkout &amp; easy returns
        </p>

        {/* Tabs - exactly as images: two options side by side */}
        <div className="mt-6 flex border-b border-gray-200">
          <button
            onClick={() => setLoginMode('password')}
            className={`flex-1 py-2 text-sm font-medium text-center border-b-2 transition ${
              loginMode === 'password'
                ? 'border-black text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Log In with Password
          </button>
          <button
            onClick={() => setLoginMode('otp')}
            className={`flex-1 py-2 text-sm font-medium text-center border-b-2 transition ${
              loginMode === 'otp'
                ? 'border-black text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Log In with OTP
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* Password mode fields */}
          {loginMode === 'password' && (
            <>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="mt-1 w-full h-12 px-4 text-base border border-gray-300 rounded-none focus:outline-none focus:border-gray-900 transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-900">
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-12 px-4 text-base border border-gray-300 rounded-none focus:outline-none focus:border-gray-900 transition pr-16"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-4 h-12 flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <a href="#" className="text-sm text-gray-700 hover:text-black underline">
                  Forgot Password?
                </a>
              </div>
            </>
          )}

          {/* OTP mode fields */}
          {loginMode === 'otp' && (
            <div>
              <label htmlFor="mobile" className="block text-sm font-semibold text-gray-900">
                Mobile Number
              </label>
              <div className="mt-1 flex">
                <span className="inline-flex items-center px-4 border border-r-0 border-gray-300 bg-gray-50 text-gray-600 text-base h-12">
                  +91
                </span>
                <input
                  id="mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Mobile Number"
                  className="w-full h-12 px-4 text-base border border-gray-300 rounded-none focus:outline-none focus:border-gray-900 transition"
                  required
                />
              </div>
            </div>
          )}

          {/* Login Button - Black */}
          <button
            type="submit"
            className="w-full h-12 flex items-center justify-center text-base font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition duration-200"
          >
            {loginMode === 'password' ? 'Sign In' : 'Login With OTP'}
          </button>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center">
            By logging in, you agree to the{' '}
            <a href="#" className="text-gray-900 underline hover:no-underline">Terms &amp; Conditions</a> and{' '}
            <a href="#" className="text-gray-900 underline hover:no-underline">Privacy Policy</a>.
          </p>

          {/* Register link */}
          <div className="text-center text-sm">
            <span className="text-gray-600">New to Forge? </span>
            <Link to="/signup" className="font-semibold text-black hover:underline">
              Register
            </Link>
          </div>

          {/* Out of stock note (like in the image) */}
          <p className="text-center text-xs text-red-600 border-t border-gray-200 pt-4 mt-2">
           
          </p>
        </form>
      </div>
    </div>
  );
}