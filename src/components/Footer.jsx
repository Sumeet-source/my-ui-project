import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#f4f4f4] text-black mt-20 pt-16 pb-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Column 1: Newsletter */}
        <div>
          <h3 className="font-bold text-lg mb-2">Stay in the loop.</h3>
          <p className="text-sm text-gray-600 mb-6">Sign up for email updates today.</p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address" 
              required
              className="w-full border border-black px-4 py-3 bg-transparent placeholder-gray-500 focus:outline-none"
            />
            <button type="submit" className="bg-black text-white py-3 font-bold tracking-wider hover:bg-gray-800 transition">
              Sign Up
            </button>
          </form>
          {isSubscribed && <p className="mt-3 text-green-700 text-sm font-semibold">✅ Thanks for subscribing!</p>}
          <p className="mt-4 text-[10px] text-gray-500">By providing your email, you agree to the Terms of Use and Privacy Policy.</p>
        </div>

        {/* Column 2: Support Info */}
        <div>
          <h4 className="font-bold text-sm tracking-wider mb-4">Phone Support</h4>
          <p className="text-sm text-gray-600">1800-102-8343</p>
          <p className="text-xs text-gray-500 mt-1">Monday - Saturday (9 AM - 6 PM)</p>
          
          <h4 className="font-bold text-sm tracking-wider mt-6 mb-2">Email Support</h4>
          <p className="text-sm text-gray-600">care@forge.com</p>
          <p className="text-xs text-gray-500 mt-1">Monday - Saturday (9 AM - 6 PM)</p>
        </div>

        {/* Column 3: Customer Service & About */}
        <div>
          <h4 className="font-bold text-sm tracking-wider mb-4">Customer Service</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link to="#" className="hover:underline">Help & FAQ</Link></li>
            <li><Link to="#" className="hover:underline">Size Guide</Link></li>
            <li><Link to="#" className="hover:underline">Shipping & Delivery</Link></li>
            <li><Link to="#" className="hover:underline">Cancellation & Returns</Link></li>
            <li><Link to="#" className="hover:underline">Track Your Order</Link></li>
          </ul>
        </div>

        {/* Column 4: Socials & Legal */}
        <div>
          <h4 className="font-bold text-sm tracking-wider mb-4">FORGE Social</h4>
          <ul className="space-y-2 text-sm font-medium text-gray-700">
            <li><Link to="#" className="flex items-center gap-2 hover:underline"><span className="text-lg">📸</span> Instagram</Link></li>
            <li><Link to="#" className="flex items-center gap-2 hover:underline"><span className="text-lg">👤</span> Facebook</Link></li>
            <li><Link to="#" className="flex items-center gap-2 hover:underline"><span className="text-lg">▶</span> YouTube</Link></li>
          </ul>
          <div className="mt-8 flex gap-3 text-gray-600">
             <span className="border p-1 rounded text-xs">VISA</span>
             <span className="border p-1 rounded text-xs">MC</span>
             <span className="border p-1 rounded text-xs">AMEX</span>
          </div>
          <p className="mt-4 text-[10px] text-gray-500">© 2024 FORGE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}