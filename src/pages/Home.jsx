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

  return (
    <div className="min-h-screen bg-white md:bg-[#1A1A1A] pb-16 transition-colors duration-300">
      
      <div className="bg-[#F5F0E1] md:bg-[#2A2A2A] py-2.5 md:py-3 text-center border-b border-[#E8DEC5] md:border-gray-800">
        <p className="text-xs md:text-sm font-medium text-black md:text-white">
          Enjoy 15% Off On The FORGE App. Use: <span className="font-bold">APP15</span>
          <Link to="/" className="ml-2 underline decoration-1 underline-offset-2 hover:text-gray-600 md:hover:text-gray-300 transition">
            Download Now
          </Link> <span className="hidden sm:inline mx-2 text-gray-400">|</span>
          <span className="hidden sm:inline text-gray-600 md:text-gray-400 underline decoration-1 underline-offset-2 hover:text-black md:hover:text-white transition cursor-pointer">T&Cs</span>
        </p>
      </div>

      <section className="relative w-full min-h-[60dvh] md:min-h-[85vh] max-h-[900px] overflow-hidden bg-black">
        <video 
          className="w-full h-full object-cover"
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

        <div className="absolute bottom-0 left-0 w-full p-4 md:p-10 pb-6 md:pb-14 flex flex-col items-start gap-3 md:gap-4 text-black md:text-white">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/men" className="bg-white text-black border-2 border-black md:border-white px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-gray-100 transition rounded-sm text-center">
              Shop men →
            </Link>
            <Link to="/women" className="bg-white text-black border-2 border-black md:border-white px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-gray-100 transition rounded-sm text-center">
              Shop women →
            </Link>
          </div>
          <span className="inline-block text-xs md:text-sm font-bold uppercase tracking-wider border-b-2 border-black md:border-white pb-1 cursor-pointer hover:opacity-70 transition">
            Learn More →
          </span>
        </div>
      </section>

      {/* --- BESTSELLERS --- */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-10 py-6 md:py-10 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-black md:text-white">Bestsellers</h2>
          <div className="flex gap-2">
            <button onClick={scrollBestsellerLeft} className="bg-white md:bg-[#2A2A2A] shadow border border-gray-200 md:border-gray-800 rounded-full p-1.5 md:p-2 hover:bg-gray-50 md:hover:bg-[#3A3A3A] transition">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-black md:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={scrollBestsellerRight} className="bg-white md:bg-[#2A2A2A] shadow border border-gray-200 md:border-gray-800 rounded-full p-1.5 md:p-2 hover:bg-gray-50 md:hover:bg-[#3A3A3A] transition">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-black md:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
        <div ref={bestsellerRef} className="flex overflow-x-auto gap-4 scroll-smooth hide-scrollbar pb-4">
          {loadingProducts ? (
            <p className="text-gray-500 text-sm">Loading bestsellers...</p>
          ) : bestsellers.length > 0 ? (
            bestsellers.map((product) => (
              <Link to={`/product/${product._id}`} key={product._id} className="min-w-[240px] md:min-w-[300px] w-full flex-shrink-0 flex flex-col gap-2 group cursor-pointer">
                {/* 🟢 FIX: aspect-square ko aspect-[4/3] mein badal diya */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 md:bg-gray-800 rounded-lg">
                  <img src={product.images?.[0] || product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" onError={(e) => { e.target.src = 'https://placehold.co/600x600/f3f4f6/333333?text=No+Image'; }} />
                </div>
                <div className="flex flex-col gap-0.5 px-1">
                  <p className="font-bold text-sm text-black md:text-white">{product.title}</p>
                  <p className="text-xs text-gray-500 md:text-gray-400">{product.category}</p>
                  <p className="font-bold text-sm text-black md:text-white mt-0.5">₹{product.price}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No products found.</p>
          )}
        </div>
      </section>

      {/* --- SHOP BY SPORT --- */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-10 py-6 md:py-10 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-black md:text-white">Shop By Sport</h2>
          <div className="flex gap-2">
            <button onClick={scrollSportLeft} className="bg-white md:bg-[#2A2A2A] shadow border border-gray-200 md:border-gray-800 rounded-full p-1.5 md:p-2 hover:bg-gray-50 md:hover:bg-[#3A3A3A] transition">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-black md:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={scrollSportRight} className="bg-white md:bg-[#2A2A2A] shadow border border-gray-200 md:border-gray-800 rounded-full p-1.5 md:p-2 hover:bg-gray-50 md:hover:bg-[#3A3A3A] transition">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-black md:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        <div className="flex gap-3 mb-6 overflow-x-auto hide-scrollbar pb-2">
          {['Running', 'Training', 'Sportswear', 'Basketball', 'Football', 'Yoga'].map((sport) => (
            <button
              key={sport}
              onClick={() => fetchSportProducts(sport)}
              className={`px-5 py-2 rounded-full text-sm font-bold tracking-wider transition-all duration-300 whitespace-nowrap ${
                selectedSport === sport
                  ? 'bg-black text-white'
                  : 'bg-gray-100 md:bg-[#2A2A2A] text-gray-600 md:text-gray-300 hover:bg-gray-200 md:hover:bg-[#3A3A3A]'
              }`}
            >
              {sport}
            </button>
          ))}
        </div>

        <div ref={sportRef} className="flex overflow-x-auto gap-4 scroll-smooth hide-scrollbar pb-4">
          {loadingSport ? (
            <p className="text-gray-500 text-sm">Loading {selectedSport} products...</p>
          ) : sportProducts.length > 0 ? (
            sportProducts.map((product) => (
              <Link 
                to={`/product/${product._id}`} 
                key={product._id} 
                className="min-w-[240px] md:min-w-[300px] w-full flex-shrink-0 flex flex-col gap-2 group cursor-pointer"
              >
                {/* 🟢 FIX: aspect-[4/3] */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 md:bg-gray-800 rounded-lg group-hover:shadow-lg transition">
                  <img 
                    src={product.images?.[0] || product.imageUrl} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/600x600/f3f4f6/333333?text=No+Image";
                    }}
                  />
                </div>
                <div className="px-1 pt-1">
                  <h3 className="text-base md:text-lg font-bold text-black md:text-white leading-tight">
                    {product.title}
                  </h3>
                  <p className="text-xs text-gray-500 md:text-gray-400 mt-0.5">
                    {product.category}
                  </p>
                  <p className="font-bold text-sm text-black md:text-white mt-1">
                    ₹{product.price}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No products found for {selectedSport}.</p>
          )}
        </div>
      </section>

      {/* --- TRENDING --- */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-10 py-6 md:py-10 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-black md:text-white">Trending</h2>
          <div className="flex gap-2">
            <button onClick={scrollTrendingLeft} className="bg-white md:bg-[#2A2A2A] shadow border border-gray-200 md:border-gray-800 rounded-full p-1.5 md:p-2 hover:bg-gray-50 md:hover:bg-[#3A3A3A] transition">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-black md:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={scrollTrendingRight} className="bg-white md:bg-[#2A2A2A] shadow border border-gray-200 md:border-gray-800 rounded-full p-1.5 md:p-2 hover:bg-gray-50 md:hover:bg-[#3A3A3A] transition">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-black md:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        <div ref={trendingRef} className="flex overflow-x-auto gap-4 scroll-smooth hide-scrollbar pb-4">
          {loadingProducts ? (
            <p className="text-gray-500 text-sm">Loading trending...</p>
          ) : trendingProducts.length > 0 ? (
            trendingProducts.map((product) => (
              <Link to={`/product/${product._id}`} key={product._id} className="min-w-[240px] md:min-w-[300px] w-full flex-shrink-0 flex flex-col gap-2 group cursor-pointer">
                {/* 🟢 FIX: aspect-[4/3] */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 md:bg-gray-800 rounded-lg">
                  <img src={product.images?.[0] || product.imageUrl} alt={product.title} className="w-full h-full object-contain group-hover:scale-105 transition duration-500" onError={(e) => { e.target.src = 'https://placehold.co/600x600/f3f4f6/333333?text=No+Image'; }} />
                </div>
                <div className="flex flex-col gap-0.5 px-1">
                  <p className="font-bold text-sm text-black md:text-white">{product.title}</p>
                  <p className="text-xs text-gray-500 md:text-gray-400">{product.category}</p>
                  <p className="font-bold text-sm text-black md:text-white mt-0.5">₹{product.price}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No trending products found.</p>
          )}
        </div>
      </section>

    </div>
  );
}