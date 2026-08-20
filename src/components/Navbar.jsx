import AnimatedInfinityLogo from './AnimatedInfinityLogo';
import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import ForgeLogo from './ForgeLogo';
import axiosClient from '../api/axiosClient'; // 🟢 NEW: search suggestions ke liye

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

// 🟢 FIX: Ab sirf ek hi MegaMenu instance render hota hai (state-driven), isliye
// position hamesha poori nav-row ke center me fixed rehti hai — chahe Men/Women/Shoes/Outlet
// kisi pe bhi hover karo. Visibility ab parent ke `activeMenu` state se control hoti hai,
// isliye yahan se `hidden group-hover:block` hata diya gaya hai.
const MegaMenu = ({ items }) => {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[1100px] bg-[#1A1A1A] shadow-2xl border border-gray-800 py-8 px-6 z-50 rounded-b-lg">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Side: Sub-categories (3 Columns) */}
        <div className="flex-1 grid grid-cols-3 gap-x-6 gap-y-4">
          {items.map((col, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-2">{col.heading}</h4>
              {col.links.map((link, i) => (
                <Link key={i} to={link.path} className="text-sm text-gray-300 hover:text-white hover:underline transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        {/* Right Side: Featured Image/Offer */}
        <div className="hidden md:flex flex-col gap-4 w-[280px] shrink-0">
          <div className="relative h-[180px] bg-gray-800 rounded-lg overflow-hidden hover:shadow-md transition">
            <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=400&q=80" alt="Featured" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-white font-bold text-sm">New Arrivals</p>
              <p className="text-white text-xs">Shop the latest drops →</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  // 🟢 NEW: kaunsa mega menu abhi active/open hai, isse control hoga
  const [activeMenu, setActiveMenu] = useState(null);

  // 🟢 NEW: live search suggestions state (desktop + mobile dono ke liye)
  const [desktopSuggestions, setDesktopSuggestions] = useState([]);
  const [showDesktopSuggestions, setShowDesktopSuggestions] = useState(false);
  const [mobileSuggestions, setMobileSuggestions] = useState([]);
  const desktopDebounceRef = useRef(null);

  const inputRef = useRef(null);
  
  const { cart, clearCart } = useCart(); 
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const searchTerm = searchParams.get('search') || '';
  const activeCategory = searchParams.get('category');

  const isHome = location.pathname === '/';

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const handleDesktopSearch = (e) => {
    const value = e.target.value;

    // 🟢 ORIGINAL LOGIC (as-is): current page ke URL me 'search' param set karta hai —
    // isse agar koi aur page (jaise /men) is param ko read karke apne aap filter karta hai,
    // wo behavior bilkul waisa hi chalta rahega.
    // 🟢 FIX: {replace:true} add kiya taaki har keystroke pe naya browser-history entry na bane.
    setSearchParams((prevParams) => {
      const params = new URLSearchParams(prevParams);
      if (value) {
        params.set('search', value);
      } else {
        params.delete('search');
      }
      return params;
    }, { replace: true });

    // 🟢 NEW: debounced live suggestions fetch (Nike jaisa autosuggest)
    if (desktopDebounceRef.current) clearTimeout(desktopDebounceRef.current);

    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setDesktopSuggestions([]);
      setShowDesktopSuggestions(false);
      return;
    }

    desktopDebounceRef.current = setTimeout(async () => {
      try {
        const res = await axiosClient.get('/api/products', { params: { q: trimmed } });
        let data = res.data;
        if (Array.isArray(data)) {
          data = data;
        } else if (data && Array.isArray(data.products)) {
          data = data.products;
        } else if (data && Array.isArray(data.data)) {
          data = data.data;
        } else {
          data = [];
        }
        setDesktopSuggestions(data.slice(0, 6));
        setShowDesktopSuggestions(true);
      } catch (error) {
        console.error('Search suggestion error:', error);
        setDesktopSuggestions([]);
      }
    }, 300);
  };

  // 🟢 NEW: unmount pe pending debounce timer clear karo (memory-leak safe)
  useEffect(() => {
    return () => {
      if (desktopDebounceRef.current) clearTimeout(desktopDebounceRef.current);
    };
  }, []);

  // 🟢 NEW: mobile full-screen search overlay ke liye live suggestions (debounced)
  useEffect(() => {
    const trimmed = searchInput.trim();
    if (trimmed.length < 2) {
      setMobileSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await axiosClient.get('/api/products', { params: { q: trimmed } });
        let data = res.data;
        if (Array.isArray(data)) {
          data = data;
        } else if (data && Array.isArray(data.products)) {
          data = data.products;
        } else if (data && Array.isArray(data.data)) {
          data = data.data;
        } else {
          data = [];
        }
        setMobileSuggestions(data.slice(0, 8));
      } catch (error) {
        console.error('Mobile search suggestion error:', error);
        setMobileSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleLogout = () => {
    clearCart(); 
    logout(); 
    navigate('/');
    showToast('Logged out successfully!', 'success');
  };

  const handleSearchClear = () => {
    setSearchInput('');
    setMobileSuggestions([]); // 🟢 NEW
    if (inputRef.current) inputRef.current.focus();
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

  // 🟢 MEGA MENU DATA
  const menMenuItems = [
    { heading: "Shop By Category", links: [ { label: "T-Shirts & Tops", path: "/men?subCategory=T-Shirts" }, { label: "Hoodies & Sweatshirts", path: "/men?subCategory=Hoodies" }, { label: "Jackets & Vests", path: "/men?subCategory=Jackets" } ] },
    { heading: "Shop By Sport", links: [ { label: "Running", path: "/men?subCategory=Running" }, { label: "Training", path: "/men?subCategory=Training" }, { label: "Football", path: "/men?subCategory=Football" } ] },
    { heading: "Shop By Collection", links: [ { label: "New Arrivals", path: "/new-arrivals" }, { label: "Bestsellers", path: "/men?sort=newest" }, { label: "Sale", path: "/outlet" } ] }
  ];

  const womenMenuItems = [
    { heading: "Shop By Category", links: [ { label: "T-Shirts & Tops", path: "/women?subCategory=T-Shirts" }, { label: "Hoodies & Sweatshirts", path: "/women?subCategory=Hoodies" }, { label: "Leggings", path: "/women?subCategory=Leggings" } ] },
    { heading: "Shop By Sport", links: [ { label: "Running", path: "/women?subCategory=Running" }, { label: "Yoga", path: "/women?subCategory=Yoga" }, { label: "Training", path: "/women?subCategory=Training" } ] },
    { heading: "Shop By Collection", links: [ { label: "New Arrivals", path: "/new-arrivals" }, { label: "Bestsellers", path: "/women?sort=newest" }, { label: "Sale", path: "/outlet" } ] }
  ];

  const shoesMenuItems = [
    { heading: "Shop By Category", links: [ { label: "Running Shoes", path: "/shoes?subCategory=Running" }, { label: "Casual Shoes", path: "/shoes?subCategory=Casual" }, { label: "Boots", path: "/shoes?subCategory=Boots" } ] },
    { heading: "Shop By Sport", links: [ { label: "Football", path: "/shoes?subCategory=Football" }, { label: "Training", path: "/shoes?subCategory=Training" }, { label: "Outdoor", path: "/shoes?subCategory=Outdoor" } ] },
    { heading: "Shop By Collection", links: [ { label: "New Arrivals", path: "/new-arrivals" }, { label: "Best Sellers", path: "/shoes?sort=newest" }, { label: "Sale", path: "/outlet" } ] }
  ];

  const outletMenuItems = [
    { heading: "Shop By Category", links: [ { label: "All Outlet", path: "/outlet" }, { label: "Men's Outlet", path: "/outlet?category=Men" }, { label: "Women's Outlet", path: "/outlet?category=Women" } ] },
    { heading: "Shop By Price", links: [ { label: "Under ₹999", path: "/outlet?maxPrice=999" }, { label: "₹1000 - ₹1999", path: "/outlet?maxPrice=1999" }, { label: "₹2000 & Above", path: "/outlet?maxPrice=2000" } ] },
    { heading: "Shop By Collection", links: [ { label: "Clearance", path: "/outlet?sort=price_asc" }, { label: "Flash Sale", path: "/outlet" }, { label: "Last Chance", path: "/outlet" } ] }
  ];

  return (
    // 🟢 DESKTOP: Dark Grey (`bg-[#1A1A1A]`), MOBILE: White (`bg-white`) using Tailwind responsive classes
    <nav className={`${isHome ? 'sticky top-0' : 'relative'} z-50 bg-white md:bg-[#1A1A1A] text-black md:text-white shadow-sm border-b border-gray-200 md:border-gray-800`}>
      
      {/* --- TOP UTILITY BAR (Mobile White, Desktop Dark) --- */}
      <div className="border-b border-gray-200 md:border-gray-800">
        <div className="max-w-[1600px] mx-auto px-4 md:px-10 py-1.5 hidden md:flex justify-end items-center gap-4 text-[11px] font-medium text-gray-500 md:text-white tracking-wide">
          <Link to="/signup" className="uppercase hover:text-black md:hover:text-gray-300 transition">Sign Up</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-black md:hover:text-gray-300 transition">Account</Link>
              <button onClick={handleLogout} className="bg-transparent border-none text-gray-500 md:text-white hover:text-black md:hover:text-gray-300 transition">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-black md:hover:text-gray-300 transition">Log In</Link>
            </>
          )}
          <span className="uppercase cursor-pointer hover:text-black md:hover:text-gray-300 transition">Help</span>
          <span className="uppercase cursor-pointer hover:text-black md:hover:text-gray-300 transition">Find a Store</span>
        </div>
      </div>

      {/* --- MAIN NAVIGATION BAR --- */}
      {/* 🟢 onMouseLeave yahan add kiya — jab cursor poori row (links + dropdown) se bahar jaayega tabhi menu band hoga */}
      <div
        className="flex justify-between items-center px-4 md:px-10 py-2 md:py-3 max-w-[1600px] mx-auto relative"
        onMouseLeave={() => setActiveMenu(null)}
      >
        
        {/* Mobile Action Buttons */}
        <div className="flex items-center gap-3 md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-black p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <Link to={user ? "/dashboard" : "/login"} className="text-black">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
          </Link>
        </div>

        {/* LOGO SECTION: Mobile Black, Desktop White */}
        <div className="flex items-center flex-1 justify-center md:justify-start md:flex-none">
          <div className="hidden md:block">
            <ForgeLogo />
          </div>
          <Link to="/" className="block md:hidden flex items-center justify-center h-8 w-8">
            <AnimatedInfinityLogo className="w-full h-full" />
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

        {/* --- DESKTOP MEGA MENU LINKS --- */}
        {/* 🟢 Har trigger pe sirf onMouseEnter add kiya — ab yahan se MegaMenu render nahi hota, sirf state set hoti hai */}
        <div className="hidden md:flex justify-center flex-1 gap-8 lg:gap-12 text-[15px] font-bold items-center h-10">
          <div className="relative group h-full flex items-center cursor-pointer" onMouseEnter={() => setActiveMenu(null)}>
            <Link to="/new-arrivals" className="text-white transition-colors">
              <span className={getUnderlineSpanClasses(isActiveNew)}>New <span className="text-orange-500 text-sm font-medium ml-0.5">🔥</span></span>
            </Link>
          </div>

          <div className="relative group h-full flex items-center cursor-pointer" onMouseEnter={() => setActiveMenu('men')}>
            <Link to="/men" className="text-white transition-colors flex items-center gap-1">
              <span className={getUnderlineSpanClasses(isActiveMen)}>Men</span>
            </Link>
          </div>

          <div className="relative group h-full flex items-center cursor-pointer" onMouseEnter={() => setActiveMenu('women')}>
            <Link to="/women" className="text-white transition-colors">
              <span className={getUnderlineSpanClasses(isActiveWomen)}>Women</span>
            </Link>
          </div>

          <div className="relative group h-full flex items-center cursor-pointer" onMouseEnter={() => setActiveMenu('shoes')}>
            <Link to="/shoes" className="text-white transition-colors">
              <span className={getUnderlineSpanClasses(isActiveShoes)}>Shoes</span>
            </Link>
          </div>

          <div className="relative group h-full flex items-center cursor-pointer" onMouseEnter={() => setActiveMenu('outlet')}>
            <Link to="/outlet" className="text-white transition-colors">
              <span className={getUnderlineSpanClasses(isActiveOutlet)}>Outlet</span>
            </Link>
          </div>
        </div>

        {/* --- DESKTOP RIGHT ICONS --- */}
        <div className="hidden md:flex items-center gap-6">
          {/* 🟢 NEW: relative wrapper add kiya taaki neeche suggestions dropdown correctly position ho */}
          <div className="hidden sm:block relative">
            <div className="flex items-center gap-2 border-b border-gray-600 hover:border-white transition-colors pb-0.5 w-28 lg:w-36">
              <input
                type="text"
                value={searchTerm}
                onChange={handleDesktopSearch}
                onFocus={() => { if (desktopSuggestions.length > 0) setShowDesktopSuggestions(true); }}
                onBlur={() => setTimeout(() => setShowDesktopSuggestions(false), 150)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchTerm.trim()) {
                    navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
                    setShowDesktopSuggestions(false);
                  }
                }}
                placeholder="Search"
                className="bg-transparent text-white text-[14px] placeholder-gray-500 focus:outline-none w-full"
              />
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>

            {/* 🟢 NEW: Desktop live search suggestions dropdown (Nike jaisa "Top Suggestions") */}
            {showDesktopSuggestions && desktopSuggestions.length > 0 && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white text-black rounded-lg shadow-2xl border border-gray-200 py-2 z-[60] max-h-96 overflow-y-auto">
                {desktopSuggestions.map((product) => (
                  <button
                    key={product._id}
                    onMouseDown={() => {
                      navigate(`/product/${product._id}`);
                      setShowDesktopSuggestions(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 text-left transition"
                  >
                    <img
                      src={product.images?.[0] || 'https://placehold.co/60x60/333/fff?text=IMG'}
                      alt={product.title}
                      className="w-10 h-10 object-cover rounded shrink-0"
                    />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-medium truncate">{product.title}</span>
                      {product.price && <span className="text-xs text-gray-500">₹{product.price}</span>}
                    </div>
                  </button>
                ))}
                <button
                  onMouseDown={() => {
                    navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
                    setShowDesktopSuggestions(false);
                  }}
                  className="w-full text-center text-sm font-semibold text-black py-2 border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  View all results for "{searchTerm}"
                </button>
              </div>
            )}
          </div>
          <Link to="/cart" className="relative text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            {cart.length > 0 && <span key={cart.length} className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{cart.length}</span>}
          </Link>
        </div>

        {/* 🟢 SINGLE MegaMenu instance — hamesha isi outer row (relative container) ke center me khulta hai,
            content sirf activeMenu state ke hisaab se badalta hai, position kabhi nahi hilti */}
        {activeMenu === 'men' && <MegaMenu items={menMenuItems} />}
        {activeMenu === 'women' && <MegaMenu items={womenMenuItems} />}
        {activeMenu === 'shoes' && <MegaMenu items={shoesMenuItems} />}
        {activeMenu === 'outlet' && <MegaMenu items={outletMenuItems} />}
      </div>

      {/* --- MOBILE FULL-SCREEN SEARCH OVERLAY --- */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col">
          <div className="flex items-center px-4 py-4 border-b border-gray-200 shadow-sm">
            <button onClick={() => setIsSearchOpen(false)} className="text-gray-600 text-base font-medium pr-4 hover:text-black transition">Cancel</button>
            <div className="flex-1 min-w-0 flex items-center bg-gray-100 rounded-full px-4 py-2">
              <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input ref={inputRef} type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={handleSearchSubmit} placeholder="Search for products, brands and more..." className="w-full bg-transparent text-base text-gray-900 focus:outline-none ml-3 placeholder-gray-400" autoFocus />
              {searchInput.trim() !== '' && (
                <button onClick={handleSearchClear} className="text-gray-400 hover:text-gray-600 p-1 rounded-full transition"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg></button>
              )}
            </div>
            <button onClick={() => { if(searchInput.trim()) { navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`); setIsSearchOpen(false); } }} className="ml-3 text-sm font-semibold text-black hover:underline">Search</button>
          </div>
          <div className="flex-1 px-6 py-6 overflow-y-auto">
            {searchInput.trim() === '' ? (
              <>
                <h3 className="text-sm font-bold text-gray-900 mb-4">Trending on FORGE</h3>
                <div className="flex flex-wrap gap-2">
                  {['Men', 'Women', 'Shoes', 'Outlet', 'Hoodies', 'Leggings'].map((tag) => (
                    <button key={tag} onClick={() => { navigate(`/search?q=${encodeURIComponent(tag)}`); setIsSearchOpen(false); }} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition">{tag}</button>
                  ))}
                </div>
              </>
            ) : mobileSuggestions.length > 0 ? (
              // 🟢 NEW: mobile live suggestions list (Nike jaisa)
              <div className="flex flex-col divide-y divide-gray-100">
                {mobileSuggestions.map((product) => (
                  <button
                    key={product._id}
                    onClick={() => { navigate(`/product/${product._id}`); setIsSearchOpen(false); }}
                    className="flex items-center gap-3 py-3 text-left w-full"
                  >
                    <img
                      src={product.images?.[0] || 'https://placehold.co/60x60/333/fff?text=IMG'}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded shrink-0"
                    />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-medium text-gray-900 truncate">{product.title}</span>
                      {product.price && <span className="text-xs text-gray-500">₹{product.price}</span>}
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => { navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`); setIsSearchOpen(false); }}
                  className="py-4 text-center text-sm font-semibold text-black"
                >
                  View all results for "{searchInput}"
                </button>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500 text-sm">No matches yet — press <span className="font-bold text-black">Search</span> or hit <span className="font-bold text-black">Enter</span> to find results for "{searchInput}"</div>
            )}
          </div>
        </div>
      )}

      {/* --- MOBILE DRAWER --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[999] bg-white text-black md:hidden flex flex-col overflow-hidden">
          <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 shrink-0">
            <div className="flex-1"></div>
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block shrink-0"><span className="text-xl font-black tracking-[0.2em] text-black"><ScrambleLogo text="FORGE" /></span></Link>
            <div className="flex-1 flex justify-end"><button onClick={() => setIsMenuOpen(false)} className="text-black p-1"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button></div>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="flex flex-col">
              <button onClick={() => { navigate('/new-arrivals'); setIsMenuOpen(false); }} className="flex justify-between items-center py-4 border-b border-gray-100 text-[16px] font-bold text-left w-full"><span>New <span className="text-orange-500 text-sm">🔥</span></span><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button>
              <button onClick={() => { navigate('/men'); setIsMenuOpen(false); }} className="flex justify-between items-center py-4 border-b border-gray-100 text-[16px] font-bold text-left w-full"><span>Men</span><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button>
              <button onClick={() => { navigate('/women'); setIsMenuOpen(false); }} className="flex justify-between items-center py-4 border-b border-gray-100 text-[16px] font-bold text-left w-full"><span>Women</span><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button>
              <button onClick={() => { navigate('/shoes'); setIsMenuOpen(false); }} className="flex justify-between items-center py-4 border-b border-gray-100 text-[16px] font-bold text-left w-full"><span>Shoes</span><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button>
              <button onClick={() => { navigate('/outlet'); setIsMenuOpen(false); }} className="flex justify-between items-center py-4 border-b border-gray-100 text-[16px] font-bold text-left w-full"><span>Outlet</span><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}