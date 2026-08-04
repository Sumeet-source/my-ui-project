import { useState } from 'react'; // Add this
import { useAuth } from '../context/AuthContext'; // Assuming your path
import { useToast } from '../hooks/useToast'; // Assuming your path
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [name, setName] = useState(''); // 1. Create state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const signup = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(name, email, password);
    showToast("Account created successfully! Please log in.", "success");
    navigate('/login');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-10 bg-gray-50">
      {/* 2. Add the form tag and attach onSubmit */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-md relative">
        
        {/* Close Button */}
        <button onClick={() => navigate('/')} className="absolute top-4 right-4 text-gray-400 hover:text-black transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-2">Register</h1>
        <p className="text-sm text-gray-600 mb-6">Create an account to get exclusive benefits.</p>

        {/* 3. Add the Input Fields */}
        <div className="space-y-4 mb-4">
          <input 
            type="text" 
            placeholder="Full Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full border rounded-md p-2" 
            required 
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full border rounded-md p-2" 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full border rounded-md p-2" 
            required 
          />
        </div>

        {/* Benefits List (Your existing code) */}
        <div className="space-y-3 mb-6 text-sm text-gray-700">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Faster checkout</span>
          </div>
          <div className="flex items-center gap-3">
             <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
             </svg>
             <span>Easier returns and exchanges</span>
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-center">
          <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
          <label className="ml-2 text-sm text-gray-600">I agree to the terms and conditions</label>
        </div>

        <button type="submit" className="w-full py-2.5 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
          Sign Up
        </button>
      </form>
    </div>
  );
}