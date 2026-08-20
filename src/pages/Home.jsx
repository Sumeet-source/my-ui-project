import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function Home() {
  const navigate = useNavigate();
  
  const [allProducts, setAllProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [sportProducts, setSportProducts] = useState([]);
  const [loadingSport, setLoadingSport] = useState(false);
  const [selectedSport, setSelectedSport] = useState('Running');

  const bestsellerRef = useRef(null);
  const sportRef = useRef(null);
  const trendingRef = useRef(null);

  const scrollBestsellerLeft = () => {
    if (bestsellerRef.current) bestsellerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };
  const scrollBestsellerRight = () => {
    if (bestsellerRef.current) bestsellerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };
  const scrollSportLeft = () => {
    if (sportRef.current) sportRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };
  const scrollSportRight = () => {
    if (sportRef.current) sportRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };
  const scrollTrendingLeft = () => {
    if (trendingRef.current) trendingRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };
  const scrollTrendingRight = () => {
    if (trendingRef.current) trendingRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosClient.get('/api/products'); 
        let data = res.data;
        if (Array.isArray(data)) data = data;
        else if (data && data.products) data = data.products;
        else data = [];
        setAllProducts(data);
      } catch (err) {
        console.error("Error fetching home products", err);
        setAllProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const fetchSportProducts = async (sportName) => {
    console.log("🟢 fetchSportProducts CALLED for:", sportName);
    setLoadingSport(true);
    setSelectedSport(sportName);
    try {
      const res = await axiosClient.get(`/api/products?category=Sportswear&subCategory=${sportName}`);
      console.log("🟢 API RESPONSE:", res.data);

      const products = res.data?.products || [];
      setSportProducts(products);
    } catch (err) {
      console.error("❌ Error fetching sport products", err);
      setSportProducts([]);
    } finally {
      setLoadingSport(false);
    }
  };
  
  useEffect(() => {
    fetchSportProducts('Running');
  }, []);

  const bestsellers = allProducts.slice(0, 4);
  const trendingProducts = allProducts.slice(4, 9);

  // 🟢 NEW: reusable desktop-only floating arrow buttons (Nike-style).
  // Purely additive — hidden below md so mobile markup/behaviour is untouched.
  const DesktopArrow = ({ direction, onClick }) => (
    <button
      onClick={onClick}
      aria-label={direction === 'left' ? 'Scroll left' : 'Scroll right'}
      className={`hidden md:flex items-center justify-center absolute top-1/2 -translate-y-1/2 ${
        direction === 'left' ? 'left-0 md:left-1' : 'right-0 md:right-1'
      } z-10 w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-[#2A2A2A]/90 border border-gray-800 shadow-lg backdrop-blur-sm hover:bg-[#3A3A3A] hover:scale-105 transition-all duration-200`}
    >
      <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {direction === 'left' ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        )}
      </svg>
    </button>
  );

  return (
    // 🟢 FIX: w-full use kiya taaki pura screen cover kare
    <div className="min-h-screen bg-white md:bg-[#1A1A1A] pb-16 transition-colors duration-300 w-full overflow-x-hidden">
      
      {/* 🟢 FIX: Coupon bar full width */}
      <div className="w-full bg-[#F5F0E1] md:bg-[#2A2A2A] py-2.5 md:py-3 text-center border-b border-[#E8DEC5] md:border-gray-800">
        <p className="text-xs md:text-sm font-medium text-black md:text-white">
          Enjoy 15% Off On The FORGE App. Use: <span className="font-bold">APP15</span>
          <Link to="/" className="ml-2 underline decoration-1 underline-offset-2 hover:text-gray-600 md:hover:text-gray-300 transition">
            Download Now
          </Link> <span className="hidden sm:inline mx-2 text-gray-400">|</span>
          <span className="hidden sm:inline text-gray-600 md:text-gray-400 underline decoration-1 underline-offset-2 hover:text-black md:hover:text-white transition cursor-pointer">T&Cs</span>
        </p>
      </div>

      {/* --- VIDEO BANNER (Full Width Fix) --- */}
      <section className="relative w-full bg-black flex flex-col items-center justify-center overflow-hidden">
        {/* 🟢 FIX: Mobile par object-cover use kiya taaki full width cover kare */}
        <video 
          className="w-full h-auto max-h-[85vh] object-cover md:object-cover"
          style={{ objectPosition: 'center 15%', transform: 'scale(1.08)', transformOrigin: 'top center' }}
          autoPlay 
          loop 
          muted 
          playsInline
          webkit-playsInline
        >
          <source src="/videos/hero-banner.mp4" type="video/mp4" />
          <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1920&q=80" alt="Banner Fallback" className="w-full h-full object-cover" />
        </video>
        <div className="absolute inset-0 bg-white/20 mix-blend-overlay"></div>

        <div className="absolute bottom-4 left-4 md:bottom-10 md:left-10 flex flex-col items-start gap-2 md:gap-4">
          <Link 
            to="/men" 
            className="text-white text-xs md:text-base font-medium underline decoration-1 underline-offset-4 hover:opacity-70 transition-opacity"
          >
            Shop Men →
          </Link>
          <Link 
            to="/women" 
            className="text-white text-xs md:text-base font-medium underline decoration-1 underline-offset-4 hover:opacity-70 transition-opacity"
          >
            Shop Women →
          </Link>
        </div>
      </section>

      {/* --- BESTSELLERS --- */}
      {/* 🟢 FIX: max-w-[1600px] mx-auto add kiya — Navbar ke container se match karta hai,
          isliye heading/cards ab screen edge se chipke nahi, thoda center/andar shift ho gaye */}
      <section className="w-full max-w-[1600px] mx-auto px-4 md:px-10 py-6 md:py-14 relative">
        <div className="flex justify-between items-center mb-6 md:mb-8 w-full">
          <h2 className="text-xl md:text-3xl font-bold text-black md:text-white">Bestsellers</h2>
          {/* 🟢 FIX: md:hidden add kiya — arrows ab sirf mobile pe dikhenge, desktop pe gayab (desktop ab niche floating arrows use karta hai) */}
          <div className="flex gap-2 md:hidden">
            {/* 🟢 FIX: Mobile scroll arrows chhote aur transparent kiye */}
            <button onClick={scrollBestsellerLeft} className="bg-white/60 backdrop-blur-sm shadow border border-gray-200 rounded-full p-1 hover:bg-white transition">
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={scrollBestsellerRight} className="bg-white/60 backdrop-blur-sm shadow border border-gray-200 rounded-full p-1 hover:bg-white transition">
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
        {/* 🟢 FIX: outer wrapper justify-center karta hai jab items kam hon; 
            inner row w-fit + max-w-full hai isliye overflow hone par normal scroll bhi break nahi hota */}
        <div className="relative flex justify-center">
          <DesktopArrow direction="left" onClick={scrollBestsellerLeft} />
          <div ref={bestsellerRef} className="flex overflow-x-auto gap-4 md:gap-6 scroll-smooth hide-scrollbar pb-4 w-fit max-w-full">
            {loadingProducts ? (
              <p className="text-gray-500 text-sm">Loading bestsellers...</p>
            ) : bestsellers.length > 0 ? (
              bestsellers.map((product) => (
                // 🟢 FIX: min-w → w (fixed width) + shrink-0, taaki har card hamesha exact same size ho
                // (pehle min-w tha, jisse first card image ke natural size ke hisaab se bada ho jaata tha)
                <Link to={`/product/${product._id}`} key={product._id} className="w-[240px] md:w-[320px] lg:w-[360px] shrink-0 flex flex-col gap-2 md:gap-3 group cursor-pointer">
                  <div className="relative aspect-square overflow-hidden bg-gray-50 md:bg-gray-800 rounded-lg w-full">
                    <img src={product.images?.[0] || product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" onError={(e) => { e.target.src = 'https://placehold.co/600x600/f3f4f6/333333?text=No+Image'; }} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="font-bold text-sm md:text-base text-black md:text-white">{product.title}</p>
                    <p className="text-xs md:text-sm text-gray-500 md:text-gray-400">{product.category}</p>
                    <p className="font-bold text-sm md:text-base text-black md:text-white mt-0.5">₹{product.price}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No products found.</p>
            )}
          </div>
          <DesktopArrow direction="right" onClick={scrollBestsellerRight} />
        </div>
      </section>

      {/* --- SHOP BY SPORT --- */}
      <section className="w-full max-w-[1600px] mx-auto px-4 md:px-10 py-6 md:py-14 relative">
        <div className="flex justify-between items-center mb-6 md:mb-8 w-full">
          <h2 className="text-xl md:text-3xl font-bold text-black md:text-white">Shop By Sport</h2>
          <div className="flex gap-2 md:hidden">
            <button onClick={scrollSportLeft} className="bg-white/60 backdrop-blur-sm shadow border border-gray-200 rounded-full p-1 hover:bg-white transition">
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={scrollSportRight} className="bg-white/60 backdrop-blur-sm shadow border border-gray-200 rounded-full p-1 hover:bg-white transition">
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        {/* 🟢 FIX: justify-center add kiya taaki pills center me aayein;
            padding px-5→px-6 aur py-2→py-2.5 kiya taaki "perfect size" — thoda zyada breathing room */}
        <div className="flex justify-center gap-3 mb-6 md:mb-8 overflow-x-auto hide-scrollbar pb-2">
          {['Running', 'Training', 'Sportswear', 'Basketball', 'Football', 'Yoga'].map((sport) => (
            <button
              key={sport}
              onClick={() => fetchSportProducts(sport)}
              className={`px-6 py-2.5 md:px-8 md:py-3 rounded-full text-sm md:text-base font-bold tracking-wider transition-all duration-300 whitespace-nowrap ${
                selectedSport === sport
                  ? 'bg-black text-white'
                  : 'bg-gray-100 md:bg-[#2A2A2A] text-gray-600 md:text-gray-300 hover:bg-gray-200 md:hover:bg-[#3A3A3A]'
              }`}
            >
              {sport}
            </button>
          ))}
        </div>

        <div className="relative flex justify-center">
          <DesktopArrow direction="left" onClick={scrollSportLeft} />
          <div ref={sportRef} className="flex overflow-x-auto gap-4 md:gap-6 scroll-smooth hide-scrollbar pb-4 w-fit max-w-full">
            {loadingSport ? (
              <p className="text-gray-500 text-sm">Loading {selectedSport} products...</p>
            ) : sportProducts.length > 0 ? (
              sportProducts.map((product) => (
                // 🟢 FIX: same width fix yahan bhi — Shop By Sport ko Nike jaisa thoda portrait/lamba look diya (md+ only)
                <Link 
                  to={`/product/${product._id}`} 
                  key={product._id} 
                  className="w-[240px] md:w-[320px] lg:w-[380px] shrink-0 flex flex-col gap-2 md:gap-3 group cursor-pointer"
                >
                  <div className="relative aspect-square md:aspect-[4/5] overflow-hidden bg-gray-100 md:bg-gray-800 rounded-lg w-full group-hover:shadow-lg transition">
                    <img 
                      src={product.images?.[0] || product.imageUrl} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/600x600/f3f4f6/333333?text=No+Image";
                      }}
                    />
                  </div>
                  <div className="pt-1">
                    <h3 className="text-base md:text-lg font-bold text-black md:text-white leading-tight">
                      {product.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 md:text-gray-400 mt-0.5">
                      {product.category}
                    </p>
                    <p className="font-bold text-sm md:text-base text-black md:text-white mt-1">
                      ₹{product.price}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No products found for {selectedSport}.</p>
            )}
          </div>
          <DesktopArrow direction="right" onClick={scrollSportRight} />
        </div>
      </section>

      {/* --- TRENDING --- */}
      <section className="w-full max-w-[1600px] mx-auto px-4 md:px-10 py-6 md:py-14 relative">
        <div className="flex justify-between items-center mb-6 md:mb-8 w-full">
          <h2 className="text-xl md:text-3xl font-bold text-black md:text-white">Trending</h2>
          <div className="flex gap-2 md:hidden">
            <button onClick={scrollTrendingLeft} className="bg-white/60 backdrop-blur-sm shadow border border-gray-200 rounded-full p-1 hover:bg-white transition">
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={scrollTrendingRight} className="bg-white/60 backdrop-blur-sm shadow border border-gray-200 rounded-full p-1 hover:bg-white transition">
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        <div className="relative flex justify-center">
          <DesktopArrow direction="left" onClick={scrollTrendingLeft} />
          <div ref={trendingRef} className="flex overflow-x-auto gap-4 md:gap-6 scroll-smooth hide-scrollbar pb-4 w-fit max-w-full">
            {loadingProducts ? (
              <p className="text-gray-500 text-sm">Loading trending...</p>
            ) : trendingProducts.length > 0 ? (
              trendingProducts.map((product) => (
                // 🟢 FIX: same width fix yahan bhi
                <Link to={`/product/${product._id}`} key={product._id} className="w-[240px] md:w-[320px] lg:w-[360px] shrink-0 flex flex-col gap-2 md:gap-3 group cursor-pointer">
                  <div className="relative aspect-square overflow-hidden bg-gray-50 md:bg-gray-800 rounded-lg w-full">
                    <img src={product.images?.[0] || product.imageUrl} alt={product.title} className="w-full h-full object-contain group-hover:scale-105 transition duration-500" onError={(e) => { e.target.src = 'https://placehold.co/600x600/f3f4f6/333333?text=No+Image'; }} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="font-bold text-sm md:text-base text-black md:text-white">{product.title}</p>
                    <p className="text-xs md:text-sm text-gray-500 md:text-gray-400">{product.category}</p>
                    <p className="font-bold text-sm md:text-base text-black md:text-white mt-0.5">₹{product.price}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No trending products found.</p>
            )}
          </div>
          <DesktopArrow direction="right" onClick={scrollTrendingRight} />
        </div>
      </section>
    </div>
  );
}