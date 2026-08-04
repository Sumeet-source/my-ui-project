// src/pages/Signup.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useToast } from '../hooks/useToast'; // Uncomment if you have it

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();
  // const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !mobile || !password) {
      alert('Please fill all fields');
      return;
    }
    if (!agree) {
      alert('You must agree to the terms');
      return;
    }
    // TODO: API call
    console.log({ name, email, mobile, password });
    // showToast('Account created!', 'success');
    navigate('/login');
  };

  return (
    // Outer container: full min-height, centered on all screens
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Card: full width on mobile, max-width on desktop */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm sm:shadow-md p-6 sm:p-8 lg:p-10">
        
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900">
          Register
        </h2>
        <p className="mt-2 text-center text-sm sm:text-base text-gray-600">
          Create an account to get exclusive benefits.
        </p>

        {/* Benefits List - responsive spacing */}
        <ul className="mt-4 space-y-1 text-sm sm:text-base text-gray-600 list-disc list-inside">
          <li>Faster checkout</li>
          <li>Easier returns and exchanges</li>
          <li>Quick order information and tracking</li>
        </ul>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              // h-12 for big tap targets, text-base prevents zoom on mobile
              className="mt-1 w-full h-12 px-4 text-base border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              required
            />
          </div>

          {/* Email */}
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

          {/* Mobile Number with +91 prefix */}
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

          {/* Password with Show/Hide */}
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

          {/* Checkbox - properly aligned for mobile */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="agree"
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
              />
            </div>
            <label htmlFor="agree" className="ml-3 text-sm text-gray-700 cursor-pointer">
              I'd like to receive the latest news and promotions.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-12 flex items-center justify-center text-base font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition duration-200 shadow-sm"
          >
            Create An Account
          </button>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center px-2">
            By creating an account you agree to Under Armour's{' '}
            <a href="#" className="text-indigo-600 hover:underline">Terms &amp; Conditions</a> and{' '}
            <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>.
          </p>
        </form>
      </div>
    </div>
  );
}