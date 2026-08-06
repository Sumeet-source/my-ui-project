import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#1d1d1d] text-white/80 border-t border-white/10 pt-12 md:pt-16 mt-0">
      <div className="max-w-[1600px] mx-auto px-6 py-8 md:py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Column 1: Brand */}
        <div className="space-y-4">
          <span className="text-2xl font-black tracking-[0.2em] text-white">FORGE</span>
          <p className="text-sm leading-relaxed">Premium athletic wear engineered for your peak performance.</p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/men" className="hover:text-white transition">Men</Link></li>
            <li><Link to="/women" className="hover:text-white transition">Women</Link></li>
            <li><Link to="/shoes" className="hover:text-white transition">Shoes</Link></li>
            <li><Link to="/outlet" className="hover:text-white transition">Outlet</Link></li>
          </ul>
        </div>

        {/* Column 3: Support */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="#" className="hover:text-white transition">Help Center</Link></li>
            <li><Link to="#" className="hover:text-white transition">Returns & Exchanges</Link></li>
            <li><Link to="#" className="hover:text-white transition">Shipping Info</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider">Contact Us</h4>
          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <span className="text-white">📞</span> 
              <span>+91 8700290497</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-white">✉️</span> 
              <span>support@forge.com</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="border-t border-white/10 bg-black/30 py-6">
        <div className="max-w-[1600px] mx-auto px-6 flex flex-col sm:flex-row justify-between items-center text-xs text-white/60">
          <p>&copy; 2026 FORGE. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}