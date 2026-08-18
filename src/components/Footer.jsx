import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 md:py-6 mt-auto">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        
        {/* 🟢 Left Side: Copyright with FORGE */}
        <p className="mb-3 md:mb-0">&copy; 2026 FORGE. All rights reserved.</p>
        
        {/* 🟢 Right Side: Links */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <Link to="#" className="hover:text-black transition-colors">Terms of Use</Link>
          <Link to="#" className="hover:text-black transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-black transition-colors">Store Claim Policy</Link>
        </div>
        
      </div>
    </footer>
  );
}