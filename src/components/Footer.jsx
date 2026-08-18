import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto">
      
      {/* ================= MOBILE UI (Single Column, Left Aligned) ================= */}
      <div className="md:hidden bg-white py-6">
        <div className="max-w-[1280px] mx-auto px-4 flex flex-col items-start gap-3 text-sm text-gray-500">
          <p>&copy; 2026 FORGE. All rights reserved.</p>
          <Link to="#" className="block hover:text-black transition-colors">Terms of Use</Link>
          <Link to="#" className="block hover:text-black transition-colors">FORGE Privacy Policy</Link>
          <Link to="#" className="block hover:text-black transition-colors">Store Claim Policy</Link>
        </div>
      </div>

      {/* ================= DESKTOP UI (4-Column Grid) ================= */}
      <div className="hidden md:block bg-black text-white border-t border-white/10 pt-16 pb-10">
        <div className="max-w-[1600px] mx-auto px-6 grid grid-cols-4 gap-12">
          
          {/* Column 1: Brand & Quick Links */}
          <div className="space-y-6">
            <span className="text-2xl font-black tracking-[0.2em] text-white block">FORGE</span>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/men" className="hover:text-white transition-colors">Men</Link></li>
              <li><Link to="/women" className="hover:text-white transition-colors block">Women</Link></li>
              <li><Link to="/shoes" className="hover:text-white transition-colors block">Shoes</Link></li>
              <li><Link to="/outlet" className="hover:text-white transition-colors block">Outlet</Link></li>
            </ul>
          </div>

          {/* Column 2: Get Help */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Get Help</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="#" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Shipping Info</Link></li>
            </ul>
          </div>

          {/* Column 3: About FORGE */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">About FORGE</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="#" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Sustainability</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="text-white">📞</span> 
                <span>+91 8700290497</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-white">✉️</span> 
                <span>support@forge.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Desktop Copyright Strip */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
            <p>&copy; 2026 FORGE. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Store Claim Policy</a>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}