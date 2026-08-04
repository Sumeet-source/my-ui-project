import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; // Icons for Show/Hide

export default function Login() {
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If OTP is selected, we treat the mobile number as the email (simulation for now)
    const loginEmail = loginMethod === 'otp' ? mobile : email;
    const loginPassword = loginMethod === 'otp' ? 'otp_dummy_password' : password;

    const result = await login(loginEmail, loginPassword);
    if (result.success) {
      showToast("Logged in successfully!", "success");
      navigate('/dashboard');
    } else {
      showToast(result.message || "Login failed. Please try again.", "error");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-10 bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md relative">
        
        {/* Close Button (X) - Visually matches the screenshot */}
        <button onClick={() => navigate('/')} className="absolute top-4 right-4 text-gray-400 hover:text-black">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-6">Log In</h1>
        
        {/* Radio Toggle */}
        <div className="flex gap-6 mb-6">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-900">
            <input 
              type="radio" 
              name="method" 
              value="password" 
              checked={loginMethod === 'password'}
              onChange={() => setLoginMethod('password')}
              className="w-5 h-5 border-gray-300 text-black focus:ring-black"
            />
            Log In with Password
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-900">
            <input 
              type="radio" 
              name="method" 
              value="otp" 
              checked={loginMethod === 'otp'}
              onChange={() => setLoginMethod('otp')}
              className="w-5 h-5 border-gray-300 text-black focus:ring-black"
            />
            Log In with OTP
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Password Mode Fields */}
          {loginMethod === 'password' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-black transition" 
                  placeholder="Your email address" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password *</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="w-full border border-gray-300 rounded-lg p-3 pr-12 focus:outline-none focus:border-black transition" 
                    placeholder="Enter your password" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <button type="button" className="text-sm text-gray-600 hover:underline">Forgot Password?</button>
                </div>
              </div>
            </>
          )}

          {/* OTP Mode Fields */}
          {loginMethod === 'otp' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number *</label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-black">
                <span className="bg-gray-100 px-3 py-3 text-gray-600 font-medium border-r border-gray-300">+91</span>
                <input 
                  type="tel" 
                  value={mobile} 
                  onChange={(e) => setMobile(e.target.value)} 
                  required 
                  className="flex-1 p-3 focus:outline-none" 
                  placeholder="Mobile Number" 
                />
              </div>
            </div>
          )}

          {/* Terms */}
          <div className="text-xs text-gray-500 text-center mt-2">
            By logging in, you agree to the <span className="underline cursor-pointer hover:text-black">Terms & Conditions</span> and <span className="underline cursor-pointer hover:text-black">Privacy Policy</span>.
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition mt-2 uppercase tracking-wider"
          >
            {loginMethod === 'password' ? 'Sign In' : 'Login With OTP'}
          </button>

          {/* Register Link */}
          <div className="text-center text-sm text-gray-600 mt-4">
            New to FORGE? <Link to="/signup" className="text-black font-semibold underline hover:no-underline">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
}