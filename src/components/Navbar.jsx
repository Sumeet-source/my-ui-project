import { useState } from 'react';
import { Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const searchTerm = searchParams.get('search') || '';
  const activeCategory = searchParams.get('category');

  const handleSearchChange = (e) => {
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

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      const targetSection = document.getElementById('new-arrivals');
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
        e.target.blur();
      }
    }
  };

  const getUnderlineSpanClasses = (isActive) =>
    `relative inline-block 
    after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white 
    after:transition-all after:duration-300 hover:after:w-full 
    ${isActive ? 'after:w-full' : ''}`;

  const isActiveHome = false; 
  const isActiveMen = location.pathname === '/men';
  const isActiveWomen = location.pathname === '/women';
  const isActiveShoes = location.pathname === '/shoes';
  const isActiveOutlet = location.pathname === '/outlet';
  const isActiveEcho = location.pathname === '/echo';

  const handleMobileNavigate = (path) => {
    window.location.href = path;
  };

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
            <Link to="/signup" className="cursor-pointer text-[14px] font-medium">Register</Link>
            <span className="text-[#4a4a4a] text-[14px]">|</span>
            <Link to="/login" className="cursor-pointer text-[14px] font-medium">Log In</Link>
          </div>
        </div>
      </div>

      {/* --- MAIN NAVIGATION BAR --- */}
      <div className="flex justify-between items-center px-4 py-3 md:px-6 md:py-5 max-w-[1600px] mx-auto relative">
        <div className="flex items-center gap-3 md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link to={user ? "/dashboard" : "/login"} className="text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </Link>
        </div>

        <Link to="/" className="block shrink-0 md:ml-8 lg:ml-16 md:mr-4 lg:mr-6">
          <svg width="44" height="26" viewBox="0 0 44 26" className="w-[44px] h-[26px] shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_115_2)">
              <path d="M15.918 15.0189C15.918 15.0189 13.006 8.56122 11.002 0C11.002 0 10.004 7.38122 7.848 15.0189H15.918Z" fill="white"/>
              <path d="M23.59 15.0189H7.848C7.848 15.0189 2.977 15.0189 0.142 15.0189C0.142 15.0189 2.929 22.0131 7.848 22.0131C12.767 22.0131 23.59 15.0189 23.59 15.0189Z" fill="white"/>
              <path d="M9.653 0C9.653 0 1.981 0 0 0C0 0 0.22 1.285 1.204 3.408C2.277 5.732 5.665 13.329 8.084 15.019H9.653V0Z" fill="white"/>
            </g>
            <defs>
              <clipPath id="clip0_115_2">
                <rect width="23.59" height="22.013" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </Link>

        <div className="flex items-center gap-4 md:hidden">
          <button onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)} className="text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <Link to="/wishlist" className="relative text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </Link>
          <Link to="/cart" className="relative text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cart.length > 0 && <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{cart.length}</span>}
          </Link>
        </div>

        {/* --- DESKTOP LINKS --- */}
        <div className="hidden md:flex justify-center flex-1 gap-20 text-[16px] font-bold items-center h-10">
          <Link to="/" className="relative h-full flex items-center cursor-pointer">
            <span className={getUnderlineSpanClasses(isActiveHome)}>New <span className="text-orange-500 text-sm">🔥</span></span>
          </Link>
          <div className="group h-full flex items-center">
            <Link to="/men" className="relative h-full flex items-center cursor-pointer"><span className={getUnderlineSpanClasses(isActiveMen)}>Men</span></Link>
          </div>
          <div className="group h-full flex items-center">
            <Link to="/women" className="relative h-full flex items-center cursor-pointer"><span className={getUnderlineSpanClasses(isActiveWomen)}>Women</span></Link>
          </div>
          <div className="group h-full flex items-center">
            <Link to="/shoes" className="relative h-full flex items-center cursor-pointer"><span className={getUnderlineSpanClasses(isActiveShoes)}>Shoes</span></Link>
          </div>
          <div className="group h-full flex items-center">
            <Link to="/outlet" className="relative h-full flex items-center cursor-pointer"><span className={getUnderlineSpanClasses(isActiveOutlet)}>Outlet</span></Link>
          </div>
          <Link to="/echo" className="relative h-full flex items-center cursor-pointer"><span className={getUnderlineSpanClasses(isActiveEcho)}>Echo</span></Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 border-b border-white/30 hover:border-white transition-colors pb-0.5 w-32">
            <input type="text" value={searchTerm} onChange={handleSearchChange} onKeyDown={handleSearchKeyDown} placeholder="Search" className="bg-transparent text-white text-[15px] placeholder-white/70 focus:outline-none w-full" />
            <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <Link to="/wishlist" className="relative"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></Link>
          <Link to="/cart" className="relative"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            {cart.length > 0 && <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{cart.length}</span>}
          </Link>
        </div>
      </div>

      {/* --- MOBILE SLIDE-DOWN SEARCH BAR --- */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileSearchOpen ? 'max-h-20 opacity-100 px-4 pb-4' : 'max-h-0 opacity-0 px-4'}`}>
        <div className="relative">
          <input 
            type="text" 
            value={searchTerm} 
            onChange={handleSearchChange} 
            onKeyDown={handleSearchKeyDown}
            placeholder="Search..." 
            className="w-full bg-[#1a1a1a] text-white border border-gray-700 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-white transition-all"
            autoFocus={isMobileSearchOpen}
          />
          <svg className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* --- MOBILE DRAWER --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[999] bg-white text-black md:hidden flex flex-col overflow-hidden">
          <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 shrink-0">
            <div className="flex-1"></div>
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block shrink-0">
              <svg width="44" height="26" viewBox="0 0 44 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_115_2_black)">
                  <path d="M15.918 15.0189C15.918 15.0189 13.006 8.56122 11.002 0C11.002 0 10.004 7.38122 7.848 15.0189H15.918Z" fill="black"/>
                  <path d="M23.59 15.0189H7.848C7.848 15.0189 2.977 15.0189 0.142 15.0189C0.142 15.0189 2.929 22.0131 7.848 22.0131C12.767 22.0131 23.59 15.0189 23.59 15.0189Z" fill="black"/>
                  <path d="M9.653 0C9.653 0 1.981 0 0 0C0 0 0.22 1.285 1.204 3.408C2.277 5.732 5.665 13.329 8.084 15.019H9.653V0Z" fill="black"/>
                </g>
                <defs>
                  <clipPath id="clip0_115_2_black">
                    <rect width="23.59" height="22.013" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </Link>
            <div className="flex-1 flex justify-end">
              <button onClick={() => setIsMenuOpen(false)} className="text-black p-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {!activeSubmenu && (
              <div className="flex flex-col">
                <button onClick={() => { window.location.href = '/#new-arrivals'; setIsMenuOpen(false); }} className="flex justify-between items-center py-4 border-b border-gray-100 text-[16px] font-bold text-left w-full">
                  <span>New <span className="text-orange-500 text-sm">🔥</span></span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
                
                <button onClick={() => { window.location.href = '/men'; setIsMenuOpen(false); }} className="flex justify-between items-center py-4 border-b border-gray-100 text-[16px] font-bold text-left w-full">
                  <span>Men</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
                
                {/* UPDATED: Women and Shoes now go directly to their pages */}
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
                
                <button onClick={() => { window.location.href = '/echo'; setIsMenuOpen(false); }} className="flex justify-between items-center py-4 border-b border-gray-100 text-[16px] font-bold text-left w-full">
                  <span>Echo</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
                
                <div className="flex justify-between items-center py-4 border-b border-gray-100 text-[16px] font-bold">
                  <span className="flex items-center gap-2">🇮🇳 IN</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}