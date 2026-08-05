import { useState, useRef } from 'react';
import { Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const inputRef = useRef(null);
  
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const searchTerm = searchParams.get('search') || '';
  const activeCategory = searchParams.get('category');

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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getUnderlineSpanClasses = (isActive) =>
    `relative inline-block 
    after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white 
    after:transition-all after:duration-300 hover:after:w-full 
    ${isActive ? 'after:w-full' : ''}`;

  const isActiveNew = location.pathname === '/new-arrivals';
  const isActiveMen = location.pathname === '/men';
  const isActiveWomen = location.pathname === '/women';
  const isActiveShoes = location.pathname === '/shoes';
  const isActiveOutlet = location.pathname === '/outlet';

  return (
    <nav className="bg-[#1d1d1d] text-white relative z-50">
      {/* --- TOP UTILITY BAR --- */}
      <div className="border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-6 py-1.5 hidden md:flex justify-between items-center tracking-wide font-medium">
          <div className="flex-1"></div>
          <Link to="/signup" className="uppercase flex-1 text-center cursor-pointer text-[13px]">
            SIGN UP FOR FASTER CHECKOUT & EASY RETURNS
          </Link>
          <div className="flex-1 flex justify-end items-center gap-2 pr-1">
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/dashboard" className="cursor-pointer text-[14px] font-medium hover:underline">Account</Link>
                <span className="text-[#4a4a4a] text-[14px]">|</span>
                <button onClick={handleLogout} className="cursor-pointer text-[14px] font-medium bg-transparent border-none text-white hover:underline">Logout</button>
              </div>
            ) : (
              <>
                <Link to="/signup" className="cursor-pointer text-[14px] font-medium hover:underline">Register</Link>
                <span className="text-[#4a4a4a] text-[14px]">|</span>
                <Link to="/login" className="cursor-pointer text-[14px] font-medium hover:underline">Log In</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- MAIN NAVIGATION BAR --- */}
      <div className="flex justify-between items-center px-4 py-3 md:px-6 md:py-5 max-w-[1600px] mx-auto relative">
        
        {/* Mobile Action Buttons */}
        <div className="flex items-center gap-3 md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <Link to={user ? "/dashboard" : "/login"} className="text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
          </Link>
        </div>

        {/* 🔥 UPDATED LOGO (Bada aur bold) */}
        <Link to="/" className="flex items-center md:ml-8 lg:ml-16 md:mr-4 lg:mr-6 shrink-0">
          <span className="text-3xl md:text-4xl font-black tracking-[0.2em] text-white">
            FORGE
          </span>
        </Link>

        {/* Mobile Right Icons */}
        <div className="flex items-center gap-4 md:hidden">
          <button onClick={() => setIsSearchOpen(true)} className="text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
          <Link to="/cart" className="relative text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            {cart.length > 0 && <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{cart.length}</span>}
          </Link>
        </div>

        {/* --- CLEAN DESKTOP LINKS (Gap aur Font badha diya) --- */}
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
          <div className="hidden sm:flex items-center gap-2 border-b border-white/30 hover:border-white transition-colors pb-0.5 w-32">
            <input type="text" value={searchTerm} onChange={handleDesktopSearch} onKeyDown={(e) => { if(e.key === 'Enter' && searchTerm.trim()) navigate(`/search?q=${searchTerm}`); }} placeholder="Search" className="bg-transparent text-white text-[15px] placeholder-white/70 focus:outline-none w-full" />
            <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <Link to="/cart" className="relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            {cart.length > 0 && <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{cart.length}</span>}
          </Link>
        </div>
      </div>

      {/* --- MOBILE FULL-SCREEN SEARCH OVERLAY --- */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col">
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
            <button onClick={() => setIsSearchOpen(false)} className="text-white p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="flex-1 mx-4">
              <input ref={inputRef} type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={handleSearchSubmit} placeholder="Search..." className="w-full bg-transparent text-white text-base border-b border-gray-600 focus:border-white focus:outline-none pb-1 transition-colors placeholder-gray-400" autoFocus />
            </div>
            <button onClick={() => setIsSearchOpen(false)} className="text-white text-sm font-medium">Cancel</button>
          </div>
          <div className="flex-1 flex items-center justify-center text-white/60 text-lg">
            {searchInput.trim() === '' ? <p className="text-gray-500">Type to start searching</p> : <p className="text-gray-500">No results found!</p>}
          </div>
        </div>
      )}

      {/* --- MOBILE DRAWER --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[999] bg-white text-black md:hidden flex flex-col overflow-hidden">
          <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 shrink-0">
            <div className="flex-1"></div>
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block shrink-0">
              <span className="text-xl font-black tracking-[0.2em] text-black">FORGE</span>
            </Link>
            <div className="flex-1 flex justify-end">
              <button onClick={() => setIsMenuOpen(false)} className="text-black p-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="flex flex-col">
              <button onClick={() => { window.location.href = '/new-arrivals'; setIsMenuOpen(false); }} className="flex justify-between items-center py-4 border-b border-gray-100 text-[16px] font-bold text-left w-full">
                <span>New <span className="text-orange-500 text-sm">🔥</span></span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
              <button onClick={() => { window.location.href = '/men'; setIsMenuOpen(false); }} className="flex justify-between items-center py-4 border-b border-gray-100 text-[16px] font-bold text-left w-full">
                <span>Men</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
              <button onClick={() => { window.location.href = '/women'; setIsMenuOpen(false); }} className="flex justify-between items-center py-4 border-b border-gray-100 text-[16px] font-bold text-left w-full">
                <span>Women</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
              <button onClick={() => { window.location.href = '/shoes'; setIsMenuOpen(false); }} className="flex justify-between items-center py-4 border-b border-gray-100 text-[16px] font-bold text-left w-full">
                <span>Shoes</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
              <button onClick={() => { window.location.href = '/outlet'; setIsMenuOpen(false); }} className="flex justify-between items-center py-4 border-b border-gray-100 text-[16px] font-bold text-left w-full">
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