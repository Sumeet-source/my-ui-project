import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import ForgeLogo from './ForgeLogo';

// 🟢 MOBILE SCRAMBLE DECODE ANIMATION COMPONENT
const ScrambleLogo = ({ text = "FORGE", delay = 500 }) => {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    let interval = null;
    let iterations = 0;
    const maxIterations = 12; 
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        const originalLetters = text.split('');
        const scrambled = originalLetters.map((letter, index) => {
          const progress = iterations / maxIterations;
          const lockedIndex = Math.floor(progress * originalLetters.length);
          
          if (index < lockedIndex) return letter;
          return characters[Math.floor(Math.random() * characters.length)];
        }).join('');

        setDisplayText(scrambled);
        iterations++;

        if (iterations >= maxIterations) {
          clearInterval(interval);
          setDisplayText(text);
        }
      }, 70); 
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, delay]);

  return <span>{displayText}</span>;
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const inputRef = useRef(null);
  
  // 🟢 Cart and Auth
  const { cart, clearCart } = useCart(); 
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const searchTerm = searchParams.get('search') || '';
  const activeCategory = searchParams.get('category');

  // 🟢 Check karo ki current page Home hai ya nahi
  const isHome = location.pathname === '/';

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      navigate(`/search?q=${searchInput}`);
      setIsSearchOpen(false);
    }
  };

  const handleDesktopSearch = (e) => {
    const value = e.target.value;
    setSearchParams((prevParams) => {
      const params = new URLSearchParams(prevParams);
      if (value) {
        params.set('search', value);
      } else {
        params.delete('search');
      }
      return params;
    });
  };

  // 🟢 Logout Function
  const handleLogout = () => {
    clearCart(); 
    logout(); 
    navigate('/');
    showToast('Logged out successfully!', 'success');
  };

  const handleSearchClear = () => {
    setSearchInput('');
    if (inputRef.current) inputRef.current.focus();
  };

  const getUnderlineSpanClasses = (isActive) =>
    `relative inline-block 
    after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-black 
    after:transition-all after:duration-300 hover:after:w-full 
    ${isActive ? 'after:w-full' : ''}`;

  const isActiveNew = location.pathname === '/new-arrivals';
  const isActiveMen = location.pathname === '/men';
  const isActiveWomen = location.pathname === '/women';
  const isActiveShoes = location.pathname === '/shoes';
  const isActiveOutlet = location.pathname === '/outlet';

  return (
    // 🟢 CONDITIONALLY STICKY: Sirf Home par sticky, baaki par relative
    <nav className={`${isHome ? 'sticky top-0' : 'relative'} z-50 bg-white text-black shadow-sm border-b border-gray-200`}>
      
      {/* --- TOP UTILITY BAR --- */}
      <div className="border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-1.5 hidden md:flex justify-between items-center tracking-wide font-medium">
          <div className="flex-1"></div>
          <Link to="/signup" className="uppercase flex-1 text-center cursor-pointer text-[13px] text-black hover:text-gray-600">
            SIGN UP FOR FASTER CHECKOUT & EASY RETURNS
          </Link>
          <div className="flex-1 flex justify-end items-center gap-2 pr-1">
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/dashboard" className="cursor-pointer text-[14px] font-medium hover:text-gray-600">Account</Link>
                <span className="text-gray-300 text-[14px]">|</span>
                <button onClick={handleLogout} className="cursor-pointer text-[14px] font-medium bg-transparent border-none hover:text-gray-600">Logout</button>
              </div>
            ) : (
              <>
                <Link to="/signup" className="cursor-pointer text-[14px] font-medium hover:text-gray-600">Register</Link>
                <span className="text-gray-300 text-[14px]">|</span>
                <Link to="/login" className="cursor-pointer text-[14px] font-medium hover:text-gray-600">Log In</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- MAIN NAVIGATION BAR --- */}
      <div className="flex justify-between items-center px-4 md:px-10 py-3 md:py-5 max-w-[1280px] mx-auto relative">
        
        {/* Mobile Action Buttons */}
        <div className="flex items-center gap-3 md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-black p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <Link to={user ? "/dashboard" : "/login"} className="text-black">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
          </Link>
        </div>

        {/* LOGO SECTION */}
      
              
        <div className="flex items-center ml-0 shrink-0 flex-1 md:flex-none">
          {/* Desktop Logo */}
          <div className="hidden md:block">
            <ForgeLogo />
          </div>
          {/* 🟢 FIX: Mobile bhi same CSS class 'forge-logo' use karega */}
          <Link to="/" className="block md:hidden">
            <ScrambleLogo text="FORGE" className="forge-logo" />
          </Link>
        </div>
        {/* Mobile Right Icons */}
        <div className="flex items-center gap-4 md:hidden">
          <button onClick={() => setIsSearchOpen(true)} className="text-black">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
          <Link to="/cart" className="relative text-black">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            {cart.length > 0 && <span key={cart.length} className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{cart.length}</span>}
          </Link>
        </div>

        {/* --- DESKTOP LINKS --- */}
        <div className="hidden md:flex justify-center flex-1 gap-10 lg:gap-20 text-[17px] lg:text-[19px] font-bold items-center h-12">
          <Link to="/new-arrivals" className="relative h-full flex items-center cursor-pointer">
            <span className={getUnderlineSpanClasses(isActiveNew)}>New <span className="text-orange-500 text-sm">🔥</span></span>
          </Link>
          <Link to="/men" className="relative h-full flex items-center cursor-pointer">
            <span className={getUnderlineSpanClasses(isActiveMen)}>Men</span>
          </Link>
          <Link to="/women" className="relative h-full flex items-center cursor-pointer">
            <span className={getUnderlineSpanClasses(isActiveWomen)}>Women</span>
          </Link>
          <Link to="/shoes" className="relative h-full flex items-center cursor-pointer">
            <span className={getUnderlineSpanClasses(isActiveShoes)}>Shoes</span>
          </Link>
          <Link to="/outlet" className="relative h-full flex items-center cursor-pointer">
            <span className={getUnderlineSpanClasses(isActiveOutlet)}>Outlet</span>
          </Link>
        </div>

        {/* --- DESKTOP RIGHT ICONS --- */}
        <div className="hidden md:flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 border-b border-gray-300 hover:border-black transition-colors pb-0.5 w-32">
            <input type="text" value={searchTerm} onChange={handleDesktopSearch} onKeyDown={(e) => { if(e.key === 'Enter' && searchTerm.trim()) navigate(`/search?q=${searchTerm}`); }} placeholder="Search" className="bg-transparent text-black text-[15px] placeholder-gray-400 focus:outline-none w-full" />
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <Link to="/cart" className="relative text-black">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            {/* 🟢 FIXED: Desktop badge key add kiya */}
            {cart.length > 0 && <span key={cart.length} className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{cart.length}</span>}
          </Link>
        </div>
      </div>

      {/* --- MOBILE FULL-SCREEN SEARCH OVERLAY --- */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col">
          <div className="flex items-center px-4 py-4 border-b border-gray-200 shadow-sm">
            <button onClick={() => setIsSearchOpen(false)} className="text-gray-600 text-base font-medium pr-4 hover:text-black transition">
              Cancel
            </button>
            <div className="flex-1 min-w-0 flex items-center bg-gray-100 rounded-full px-4 py-2">
              <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input ref={inputRef} type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={handleSearchSubmit} placeholder="Search for products, brands and more..." className="w-full bg-transparent text-base text-gray-900 focus:outline-none ml-3 placeholder-gray-400" autoFocus />
              {searchInput.trim() !== '' && (
                <button onClick={handleSearchClear} className="text-gray-400 hover:text-gray-600 p-1 rounded-full transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                </button>
              )}
            </div>
            <button onClick={() => { if(searchInput.trim()) { navigate(`/search?q=${searchInput}`); setIsSearchOpen(false); } }} className="ml-3 text-sm font-semibold text-black hover:underline">
              Search
            </button>
          </div>
          <div className="flex-1 px-6 py-6 overflow-y-auto">
            {searchInput.trim() === '' ? (
              <>
                <h3 className="text-sm font-bold text-gray-900 mb-4">Trending on FORGE</h3>
                <div className="flex flex-wrap gap-2">
                  {['Men', 'Women', 'Shoes', 'Outlet', 'Hoodies', 'Leggings'].map((tag) => (
                    <button key={tag} onClick={() => { navigate(`/search?q=${tag}`); setIsSearchOpen(false); }} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition">
                      {tag}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-gray-500 text-sm">
                Press <span className="font-bold text-black">Search</span> or hit <span className="font-bold text-black">Enter</span> to find results for "{searchInput}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MOBILE DRAWER --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[999] bg-white text-black md:hidden flex flex-col overflow-hidden">
          <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 shrink-0">
            <div className="flex-1"></div>
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block shrink-0">
              <span className="text-xl font-black tracking-[0.2em] text-black">
                <ScrambleLogo text="FORGE" />
              </span>
            </Link>
            <div className="flex-1 flex justify-end">
              <button onClick={() => setIsMenuOpen(false)} className="text-black p-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="flex flex-col">
              <button onClick={() => { navigate('/new-arrivals'); setIsMenuOpen(false); }} className="flex justify-between items-center py-4 border-b border-gray-100 text-[16px] font-bold text-left w-full">
                <span>New <span className="text-orange-500 text-sm">🔥</span></span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
              <button onClick={() => { navigate('/men'); setIsMenuOpen(false); }} className="flex justify-between items-center py-4 border-b border-gray-100 text-[16px] font-bold text-left w-full">
                <span>Men</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
              <button onClick={() => { navigate('/women'); setIsMenuOpen(false); }} className="flex justify-between items-center py-4 border-b border-gray-100 text-[16px] font-bold text-left w-full">
                <span>Women</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
              <button onClick={() => { navigate('/shoes'); setIsMenuOpen(false); }} className="flex justify-between items-center py-4 border-b border-gray-100 text-[16px] font-bold text-left w-full">
                <span>Shoes</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
              <button onClick={() => { navigate('/outlet'); setIsMenuOpen(false); }} className="flex justify-between items-center py-4 border-b border-gray-100 text-[16px] font-bold text-left w-full">
                <span>Outlet</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}