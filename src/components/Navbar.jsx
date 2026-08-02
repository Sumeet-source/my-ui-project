import { useState } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

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

  // --- Underline logic: perfectly flush with the text (bottom-0) ---
  const getUnderlineSpanClasses = (isActive) =>
    `relative inline-block 
    after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white 
    after:transition-all after:duration-300 hover:after:w-full 
    ${isActive ? 'after:w-full' : ''}`;

  // Determine if a page is active
  const isActiveHome = false; 
  const isActiveMen = location.pathname === '/' && activeCategory === 'men';
  const isActiveWomen = location.pathname === '/' && activeCategory === 'women';
  const isActiveShoes = location.pathname === '/' && activeCategory === 'footwear';
  const isActiveOutlet = location.pathname === '/outlet';
  const isActiveEcho = location.pathname === '/echo';

  return (
    <nav className="bg-[#1d1d1d] text-white relative z-50">
      
      {/* TOP UTILITY BAR */}
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

      {/* MAIN NAVIGATION BAR */}
      <div className="flex justify-between items-center px-6 py-5 max-w-[1600px] mx-auto">
        
        {/* Left: Logo */}
        <Link to="/" className="block shrink-0 ml-8 lg:ml-16 mr-4 lg:mr-6">
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

        {/* MIDDLE: Centered Links */}
        <div className="hidden md:flex justify-center flex-1 gap-20 text-[16px] font-bold items-center h-10">
          
          <Link to="/" className="relative h-full flex items-center cursor-pointer">
            <span className={getUnderlineSpanClasses(isActiveHome)}>
              New <span className="text-orange-500 text-sm">🔥</span>
            </span>
          </Link>

          {/* --- MEN MEGA MENU --- */}
          <div className="group h-full flex items-center">
            <Link to="/?category=men" className="relative h-full flex items-center cursor-pointer">
              <span className={getUnderlineSpanClasses(isActiveMen)}>Men</span>
            </Link>
            <div className="absolute left-1/2 top-full transform -translate-x-1/2 w-screen max-w-7xl bg-white text-black shadow-xl border-t border-gray-200 hidden group-hover:block z-50">
              {/* INVISIBLE BRIDGE FIX - Prevents the hover gap from causing a "boom" vanish */}
              <div className="absolute -top-4 left-0 right-0 h-4 bg-transparent"></div>
              <div className="w-full bg-white/90 backdrop-blur-sm pl-12 pr-6 py-10 flex justify-center gap-12">
                <div className="w-64 shrink-0 min-w-[16rem] min-h-[288px] rounded-lg overflow-hidden flex flex-col items-center">
                  <img src="https://images.unsplash.com/photo-1517466787929-bc90951d0975?auto=format&fit=crop&w=600&q=80" alt="Men's Gear" className="w-full h-72 object-cover" />
                  <div className="w-full p-4 text-left">
                    <Link to="/?category=men" className="block font-bold text-sm underline hover:no-underline underline-offset-0 text-black">Shop All Men</Link>
                    <Link to="/?category=men" className="mt-1 text-sm underline underline-offset-0 text-black hover:text-gray-600 transition">Shop Now</Link>
                  </div>
                </div>
                <div className="flex-1 max-w-5xl grid grid-cols-5 gap-6 text-left">
                  <div>
                    <h3 className="font-bold text-[16px] tracking-wide text-[#1d1d1d] mb-4">Featured</h3>
                    <Link to="/?category=men" className="block text-sm text-gray-700 hover:text-black py-1.5">Best Sellers</Link>
                    <Link to="/?category=men" className="block text-sm text-gray-700 hover:text-black py-1.5">New Arrivals</Link>
                    <Link to="/?category=men" className="block text-sm text-gray-700 hover:text-black py-1.5">eGift Cards</Link>
                  </div>
                  <div>
                    <h3 className="font-bold text-[16px] tracking-wide text-[#1d1d1d] mb-4">Shop by Category</h3>
                    <Link to="/?category=men" className="block text-sm text-gray-700 hover:text-black py-1.5">Tops & Hoodies</Link>
                    <Link to="/?category=men" className="block text-sm text-gray-700 hover:text-black py-1.5">Joggers & Pants</Link>
                    <Link to="/?category=men" className="block text-sm text-gray-700 hover:text-black py-1.5">Shorts</Link>
                    <Link to="/?category=men" className="block text-sm text-gray-700 hover:text-black py-1.5">Compression</Link>
                  </div>
                  <div>
                    <h3 className="font-bold text-[16px] tracking-wide text-[#1d1d1d] mb-4">Shop by Sport</h3>
                    <Link to="/?category=men" className="block text-sm text-gray-700 hover:text-black py-1.5">Running</Link>
                    <Link to="/?category=men" className="block text-sm text-gray-700 hover:text-black py-1.5">Training</Link>
                    <Link to="/?category=men" className="block text-sm text-gray-700 hover:text-black py-1.5">Basketball</Link>
                    <Link to="/?category=men" className="block text-sm text-gray-700 hover:text-black py-1.5">Golf</Link>
                  </div>
                  <div>
                    <h3 className="font-bold text-[16px] tracking-wide text-[#1d1d1d] mb-4">Collections</h3>
                    <Link to="/?category=men" className="block text-sm text-gray-700 hover:text-black py-1.5">Pro Training</Link>
                    <Link to="/?category=men" className="block text-sm text-gray-700 hover:text-black py-1.5">Cold Weather</Link>
                    <Link to="/?category=men" className="block text-sm text-gray-700 hover:text-black py-1.5">Tech Fleece</Link>
                  </div>
                  <div>
                    <h3 className="font-bold text-[16px] tracking-wide text-[#1d1d1d] mb-4">Accessories</h3>
                    <Link to="/?category=men" className="block text-sm text-gray-700 hover:text-black py-1.5">Bags & Backpacks</Link>
                    <Link to="/?category=men" className="block text-sm text-gray-700 hover:text-black py-1.5">Socks & Underwear</Link>
                    <Link to="/?category=men" className="block text-sm text-gray-700 hover:text-black py-1.5">Hats & Headbands</Link>
                    <Link to="/?category=men" className="block text-sm text-gray-700 hover:text-black py-1.5">Utility Cases</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- WOMEN MEGA MENU --- */}
          <div className="group h-full flex items-center">
            <Link to="/?category=women" className="relative h-full flex items-center cursor-pointer">
              <span className={getUnderlineSpanClasses(isActiveWomen)}>Women</span>
            </Link>
            <div className="absolute left-1/2 top-full transform -translate-x-1/2 w-screen max-w-7xl bg-white text-black shadow-xl border-t border-gray-200 hidden group-hover:block z-50">
              {/* INVISIBLE BRIDGE FIX */}
              <div className="absolute -top-4 left-0 right-0 h-4 bg-transparent"></div>
              <div className="w-full bg-white/90 backdrop-blur-sm pl-12 pr-6 py-10 flex justify-center gap-12">
                <div className="w-64 shrink-0 min-w-[16rem] min-h-[288px] rounded-lg overflow-hidden flex flex-col items-center">
                  <img src="https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=600&q=80" alt="Women's Gear" className="w-full h-72 object-cover" />
                  <div className="w-full p-4 text-left">
                    <Link to="/?category=women" className="mt-4 block font-bold text-sm underline hover:no-underline underline-offset-0 text-black">Shop All Women</Link>
                    <Link to="/?category=women" className="mt-1 text-sm underline underline-offset-0 text-black hover:text-gray-600 transition">Shop Now</Link>
                  </div>
                </div>
                <div className="flex-1 max-w-5xl grid grid-cols-5 gap-6 text-left">
                  <div>
                    <h3 className="font-bold text-[16px] tracking-wide text-[#1d1d1d] mb-4">Featured</h3>
                    <Link to="/?category=women" className="block text-sm text-gray-700 hover:text-black py-1.5">Best Sellers</Link>
                    <Link to="/?category=women" className="block text-sm text-gray-700 hover:text-black py-1.5">New Arrivals</Link>
                    <Link to="/?category=women" className="block text-sm text-gray-700 hover:text-black py-1.5">eGift Cards</Link>
                  </div>
                  <div>
                    <h3 className="font-bold text-[16px] tracking-wide text-[#1d1d1d] mb-4">Shop by Category</h3>
                    <Link to="/?category=women" className="block text-sm text-gray-700 hover:text-black py-1.5">Tops & Bras</Link>
                    <Link to="/?category=women" className="block text-sm text-gray-700 hover:text-black py-1.5">Leggings</Link>
                    <Link to="/?category=women" className="block text-sm text-gray-700 hover:text-black py-1.5">Joggers & Shorts</Link>
                    <Link to="/?category=women" className="block text-sm text-gray-700 hover:text-black py-1.5">Jackets</Link>
                  </div>
                  <div>
                    <h3 className="font-bold text-[16px] tracking-wide text-[#1d1d1d] mb-4">Shop by Sport</h3>
                    <Link to="/?category=women" className="block text-sm text-gray-700 hover:text-black py-1.5">Running</Link>
                    <Link to="/?category=women" className="block text-sm text-gray-700 hover:text-black py-1.5">Training</Link>
                    <Link to="/?category=women" className="block text-sm text-gray-700 hover:text-black py-1.5">Yoga</Link>
                    <Link to="/?category=women" className="block text-sm text-gray-700 hover:text-black py-1.5">Tennis</Link>
                  </div>
                  <div>
                    <h3 className="font-bold text-[16px] tracking-wide text-[#1d1d1d] mb-4">Collections</h3>
                    <Link to="/?category=women" className="block text-sm text-gray-700 hover:text-black py-1.5">Elevated Training</Link>
                    <Link to="/?category=women" className="block text-sm text-gray-700 hover:text-black py-1.5">Meridian</Link>
                    <Link to="/?category=women" className="block text-sm text-gray-700 hover:text-black py-1.5">Tech Fleece</Link>
                  </div>
                  <div>
                    <h3 className="font-bold text-[16px] tracking-wide text-[#1d1d1d] mb-4">Accessories</h3>
                    <Link to="/?category=women" className="block text-sm text-gray-700 hover:text-black py-1.5">Bags & Backpacks</Link>
                    <Link to="/?category=women" className="block text-sm text-gray-700 hover:text-black py-1.5">Socks & Underwear</Link>
                    <Link to="/?category=women" className="block text-sm text-gray-700 hover:text-black py-1.5">Hats & Headbands</Link>
                    <Link to="/?category=women" className="block text-sm text-gray-700 hover:text-black py-1.5">Utility Cases</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- SHOES MEGA MENU --- */}
          <div className="group h-full flex items-center">
            <Link to="/?category=footwear" className="relative h-full flex items-center cursor-pointer">
              <span className={getUnderlineSpanClasses(isActiveShoes)}>Shoes</span>
            </Link>
            <div className="absolute left-1/2 top-full transform -translate-x-1/2 w-screen max-w-7xl bg-white text-black shadow-xl border-t border-gray-200 hidden group-hover:block z-50">
              {/* INVISIBLE BRIDGE FIX */}
              <div className="absolute -top-4 left-0 right-0 h-4 bg-transparent"></div>
              <div className="w-full bg-white/90 backdrop-blur-sm pl-12 pr-6 py-10 flex justify-center gap-12">
                <div className="w-64 shrink-0 min-w-[16rem] min-h-[288px] rounded-lg overflow-hidden flex flex-col items-center">
                  <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80" alt="Shoes" className="w-full h-72 object-cover" />
                  <div className="w-full p-4 text-left">
                    <Link to="/?category=footwear" className="block font-bold text-sm underline hover:no-underline underline-offset-0 text-black">Shop All Shoes</Link>
                    <Link to="/?category=footwear" className="mt-1 text-sm underline underline-offset-0 text-black hover:text-gray-600 transition">Shop Now</Link>
                  </div>
                </div>
                <div className="flex-1 max-w-4xl grid grid-cols-4 gap-8 text-left">
                  <div><h3 className="font-bold text-[16px] tracking-wide text-[#1d1d1d] mb-4">Featured</h3><Link to="/?category=footwear" className="block text-sm text-gray-700 hover:text-black py-1.5">Best Sellers</Link><Link to="/?category=footwear" className="block text-sm text-gray-700 hover:text-black py-1.5">New Arrivals</Link></div>
                  <div><h3 className="font-bold text-[16px] tracking-wide text-[#1d1d1d] mb-4">Shop by Category</h3><Link to="/?category=footwear" className="block text-sm text-gray-700 hover:text-black py-1.5">Running Shoes</Link><Link to="/?category=footwear" className="block text-sm text-gray-700 hover:text-black py-1.5">Training Shoes</Link><Link to="/?category=footwear" className="block text-sm text-gray-700 hover:text-black py-1.5">Basketball Shoes</Link><Link to="/?category=footwear" className="block text-sm text-gray-700 hover:text-black py-1.5">Slides</Link></div>
                  <div><h3 className="font-bold text-[16px] tracking-wide text-[#1d1d1d] mb-4">Shop by Sport</h3><Link to="/?category=footwear" className="block text-sm text-gray-700 hover:text-black py-1.5">Running</Link><Link to="/?category=footwear" className="block text-sm text-gray-700 hover:text-black py-1.5">Training</Link><Link to="/?category=footwear" className="block text-sm text-gray-700 hover:text-black py-1.5">Basketball</Link></div>
                  <div><h3 className="font-bold text-[16px] tracking-wide text-[#1d1d1d] mb-4">Collections</h3><Link to="/?category=footwear" className="block text-sm text-gray-700 hover:text-black py-1.5">Phantom</Link><Link to="/?category=footwear" className="block text-sm text-gray-700 hover:text-black py-1.5">HOVR</Link></div>
                </div>
              </div>
            </div>
          </div>

          {/* --- OUTLET MEGA MENU --- */}
          <div className="group h-full flex items-center">
            <Link to="/outlet" className="relative h-full flex items-center cursor-pointer">
              <span className={getUnderlineSpanClasses(isActiveOutlet)}>Outlet</span>
            </Link>
            <div className="absolute left-1/2 top-full transform -translate-x-1/2 w-screen max-w-7xl bg-white text-black shadow-xl border-t border-gray-200 hidden group-hover:block z-50">
              {/* INVISIBLE BRIDGE FIX */}
              <div className="absolute -top-4 left-0 right-0 h-4 bg-transparent"></div>
              <div className="w-full pl-12 pr-6 py-10 flex justify-center gap-12 bg-white">
                <div className="w-80 shrink-0 h-[300px] relative rounded-lg overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1552674605-5b2c9491e7d2?auto=format&fit=crop&w=800&q=80" alt="Outlet Collection" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex flex-col justify-center items-start p-6">
                    <h3 className="text-white text-4xl font-extrabold uppercase leading-none">Outlet</h3>
                    <h3 className="text-white text-4xl font-extrabold uppercase leading-none">Collection</h3>
                    <button className="mt-4 bg-black text-white px-6 py-2 text-sm font-bold hover:bg-gray-800 transition">Shop Now</button>
                  </div>
                </div>
                <div className="flex-1 max-w-5xl grid grid-cols-3 gap-8 text-left">
                  <div>
                    <h3 className="font-bold text-[16px] tracking-wide text-[#1d1d1d] mb-4">Men</h3>
                    <Link to="/?category=men" className="block text-sm text-gray-700 hover:text-black py-1.5">Tops</Link>
                    <Link to="/?category=men" className="block text-sm text-gray-700 hover:text-black py-1.5">Pants & Leggings</Link>
                    <Link to="/?category=men" className="block text-sm text-gray-700 hover:text-black py-1.5">Shoes</Link>
                    <Link to="/?category=men" className="block text-sm text-gray-700 hover:text-black py-1.5">Innerwear</Link>
                    <Link to="/?category=men" className="block text-sm text-gray-700 hover:text-black py-1.5">Shorts</Link>
                    <Link to="/?category=men" className="block text-sm text-gray-700 hover:text-black py-1.5">Accessories</Link>
                    <Link to="/?category=men" className="block text-sm text-gray-700 hover:text-black py-1.5">Jackets & Vests</Link>
                    <Link to="/?category=men" className="block text-sm text-gray-700 hover:text-black py-1.5">Hoodies & Sweatshirt</Link>
                  </div>
                  <div>
                    <h3 className="font-bold text-[16px] tracking-wide text-[#1d1d1d] mb-4">Women</h3>
                    <Link to="/?category=women" className="block text-sm text-gray-700 hover:text-black py-1.5">Tops</Link>
                    <Link to="/?category=women" className="block text-sm text-gray-700 hover:text-black py-1.5">Pants & Leggings</Link>
                    <Link to="/?category=women" className="block text-sm text-gray-700 hover:text-black py-1.5">Shoes</Link>
                    <Link to="/?category=women" className="block text-sm text-gray-700 hover:text-black py-1.5">Innerwear</Link>
                    <Link to="/?category=women" className="block text-sm text-gray-700 hover:text-black py-1.5">Accessories</Link>
                    <Link to="/?category=women" className="block text-sm text-gray-700 hover:text-black py-1.5">Sports Bra</Link>
                    <Link to="/?category=women" className="block text-sm text-gray-700 hover:text-black py-1.5">Shorts</Link>
                    <Link to="/?category=women" className="block text-sm text-gray-700 hover:text-black py-1.5">Hoodies & Sweatshirt</Link>
                    <Link to="/?category=women" className="block text-sm text-gray-700 hover:text-black py-1.5">Jackets & Vests</Link>
                  </div>
                  <div>
                    <h3 className="font-bold text-[16px] tracking-wide text-[#1d1d1d] mb-4">Shoes</h3>
                    <Link to="/?category=footwear" className="block text-sm text-gray-700 hover:text-black py-1.5">Sandals & Slides</Link>
                    <Link to="/?category=footwear" className="block text-sm text-gray-700 hover:text-black py-1.5">Shoes</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* REGULAR LINKS (Echo) */}
          <Link to="/echo" className="relative h-full flex items-center cursor-pointer">
            <span className={getUnderlineSpanClasses(isActiveEcho)}>Echo</span>
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 border-b border-white/30 hover:border-white transition-colors pb-0.5 w-32">
            <input 
              type="text" 
              value={searchTerm} 
              onChange={handleSearchChange} 
              onKeyDown={handleSearchKeyDown}
              placeholder="Search" 
              className="bg-transparent text-white text-[15px] placeholder-white/70 focus:outline-none w-full" 
            />
            <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <Link to="/wishlist" className="relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </Link>
          <Link to="/cart" className="relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            {cart.length > 0 && <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{cart.length}</span>}
          </Link>
          <button className="md:hidden focus:outline-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}</svg>
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {isMenuOpen && (
        <div className="md:hidden bg-black text-white border-t border-zinc-800 flex flex-col items-center gap-4 py-6 shadow-lg">
          <Link to="/" className="text-white hover:text-gray-300 transition font-normal">New Arrivals</Link>
          <Link to="/?category=men" className="text-white hover:text-gray-300 transition font-normal">Men</Link>
          <Link to="/?category=women" className="text-white hover:text-gray-300 transition font-normal">Women</Link>
          <Link to="/?category=footwear" className="text-white hover:text-gray-300 transition font-normal">Shoes</Link>
          <Link to="/outlet" className="text-white hover:text-gray-300 transition font-normal">Outlet</Link>
          <Link to="/echo" className="text-white hover:text-gray-300 transition font-normal">Echo</Link>
          <Link to="/wishlist" className="text-white hover:text-gray-300 transition font-normal">Wishlist</Link>
          <Link to="/cart" className="text-white hover:text-gray-300 transition font-normal">Cart</Link>
        </div>
      )}
    </nav>
  );
}