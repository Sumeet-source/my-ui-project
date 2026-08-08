import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Auth import
import { useToast } from '../context/ToastContext'; // Toast import

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const { signup } = useAuth(); // Auth se signup function le liya
  const { showToast } = useToast(); // Toast function le liya

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !mobile || !password) {
      showToast('Please fill all fields', 'error');
      return;
    }
    if (!agree) {
      showToast('You must agree to the terms', 'error');
      return;
    }

    setLoading(true);

    try {
      // Backend API call using AuthContext
      const result = await signup(name, email, password);
      
      if (result.success) {
        showToast('Account created successfully!', 'success'); // ✅ Custom Toast
        navigate('/login');
      } else {
        showToast(result.message, 'error'); // ✅ Custom Toast
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
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Register
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Create an account to get exclusive benefits.
          </p>
        </div>

        {/* Benefits list */}
        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 px-2">
          <li>Faster checkout</li>
          <li>Easier returns and exchanges</li>
          <li>Quick order information and tracking</li>
        </ul>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-800 mb-1.5">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full h-12 px-4 text-base bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              required
            />
          </div>

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
              placeholder="Your email address"
              className="w-full h-12 px-4 text-base bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              required
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-800 mb-1.5">
              Mobile Number
            </label>
            <div className="flex mt-1">
              <span className="inline-flex items-center px-4 border border-r-0 border-gray-200 bg-gray-50 text-gray-600 text-base h-12 rounded-l-lg">
                +91
              </span>
              <input
                id="mobile"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Mobile Number"
                className="w-full h-12 px-4 text-base border border-gray-200 bg-gray-50 rounded-r-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                required
              />
            </div>
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

          {/* Checkbox */}
          <div className="flex items-center pt-1">
            <input
              id="agree"
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="h-4 w-4 accent-black rounded border-gray-300 focus:ring-black"
            />
            <label htmlFor="agree" className="ml-3 text-sm text-gray-700 cursor-pointer">
              I'd like to receive the latest news and promotions.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full h-12 flex items-center justify-center text-base font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition duration-200 rounded-lg shadow-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Creating Account...' : 'Create An Account'}
          </button>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center pt-2">
            By creating an account, you agree to Forge's{' '}
            <a href="#" className="text-gray-900 underline hover:no-underline">Terms &amp; Conditions</a> and{' '}
            <a href="#" className="text-gray-900 underline hover:no-underline">Privacy Policy</a>.
          </p>
        </form>
      </div>
    </div>
  );
}