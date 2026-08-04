import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();

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
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 tracking-tight">
          Register
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create an account to get exclusive benefits.
        </p>

        {/* Benefits list */}
        <ul className="mt-4 space-y-1 text-sm text-gray-600 list-disc list-inside">
          <li>Faster checkout</li>
          <li>Easier returns and exchanges</li>
          <li>Quick order information and tracking</li>
        </ul>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="mt-1 w-full h-12 px-4 text-base border border-gray-300 rounded-none focus:outline-none focus:border-gray-900 transition"
              required
            />
          </div>

          {/* Email */}
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

          {/* Mobile Number */}
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

          {/* Password */}
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

          {/* Checkbox */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="agree"
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
              />
            </div>
            <label htmlFor="agree" className="ml-3 text-sm text-gray-700 cursor-pointer">
              I'd like to receive the latest news and promotions.
            </label>
          </div>

          {/* Submit Button - Black like Under Armour */}
          <button
            type="submit"
            className="w-full h-12 flex items-center justify-center text-base font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition duration-200"
          >
            Create An Account
          </button>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center">
            By creating an account, you agree to Under Armour's{' '}
            <a href="#" className="text-gray-900 underline hover:no-underline">Terms &amp; Conditions</a> and{' '}
            <a href="#" className="text-gray-900 underline hover:no-underline">Privacy Policy</a>.
          </p>
        </form>
      </div>
    </div>
  );
}