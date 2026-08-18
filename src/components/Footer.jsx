import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white py-6 mt-auto">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col items-start gap-1 text-xs text-gray-500">
        
        {/* 1. Copyright Line (FORGE use kiya) */}
        <p>&copy; 2026 FORGE. All rights reserved.</p>
        
        {/* 2. Links (Vertically stacked, left aligned) */}
        <Link to="#" className="block hover:text-black transition-colors">
          Terms of Use
        </Link>
        <Link to="#" className="block hover:text-black transition-colors">
          FORGE Privacy Policy
        </Link>
        <Link to="#" className="block hover:text-black transition-colors">
          Store Claim Policy
        </Link>
        
      </div>
    </footer>
  );
}