import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function Home() {
  const navigate = useNavigate();
  
  const [allProducts, setAllProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Running');

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
    if (sportRef.current) sportRef.current.scrollBy({ left: -280, behavior: 'smooth' });
  };
  const scrollSportRight = () => {
    if (sportRef.current) sportRef.current.scrollBy({ left: 280, behavior: 'smooth' });
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

  const bestsellers = allProducts.slice(0, 4);
  const trendingProducts = allProducts.slice(4, 9);

  return (
    <div className="min-h-screen bg-white pb-16">
      
      {/* 🟢 COUPON PROMO BAR */}
      <div className="bg-[#F5F0E1] py-2.5 md:py-3 text-center border-b border-[#E8DEC5]">
        <p className="text-xs md:text-sm font-medium text-black">
          Enjoy 15% Off On The FORGE App. Use: <span className="font-bold">APP15</span>
          <Link to="/" className="ml-2 underline decoration-1 underline-offset-2 hover:text-gray-600 transition">
            Download Now
          </Link> <span className="hidden sm:inline mx-2 text-gray-400">|</span>
          <span className="hidden sm:inline text-gray-600 underline decoration-1 underline-offset-2 hover:text-black transition cursor-pointer">T&Cs</span>
        </p>
      </div>

      {/* --- SINGLE STATIC VIDEO BANNER --- */}
      <section className="relative w-full min-h-[60dvh] md:min-h-[85vh] max-h-[900px] overflow-hidden bg-black">
        <video 
          className="w-full h-full object-cover" 
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

        {/* 🟢 BLACK BOX AT BOTTOM TO HIDE WATERMARK */}
        <div className="absolute bottom-0 left-0 w-full h-[120px] md:h-[160px] bg-black z-10 pointer-events-none"></div>

        <div className="absolute bottom-0 left-0 w-full p-4 md:p-10 pb-6 md:pb-14 flex flex-col items-start gap-3 md:gap-4 text-black z-20">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/men" className="bg-white text-black border-2 border-black px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-gray-100 transition rounded-sm text-center">
              Shop men →
            </Link>
            <Link to="/women" className="bg-white text-black border-2 border-black px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-gray-100 transition rounded-sm text-center">
              Shop women →
            </Link>
          </div>
          <span className="inline-block text-xs md:text-sm font-bold uppercase tracking-wider border-b-2 border-black pb-1 cursor-pointer hover:opacity-70 transition">
            Learn More →
          </span>
        </div>
      </section>

      {/* --- BESTSELLERS --- */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-10 py-6 md:py-10 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-black">Bestsellers</h2>
          <div className="flex gap-2">
            <button onClick={scrollBestsellerLeft} className="bg-white shadow border border-gray-200 rounded-full p-1.5 md:p-2 hover:bg-gray-50 transition"><svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button>
            <button onClick={scrollBestsellerRight} className="bg-white shadow border border-gray-200 rounded-full p-1.5 md:p-2 hover:bg-gray-50 transition"><svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button>
          </div>
        </div>
        <div ref={bestsellerRef} className="flex overflow-x-auto gap-4 scroll-smooth hide-scrollbar pb-4">
          {loadingProducts ? (
            <p className="text-gray-500 text-sm">Loading bestsellers...</p>
          ) : bestsellers.length > 0 ? (
            bestsellers.map((product) => (
              <Link to={`/product/${product._id}`} key={product._id} className="min-w-[240px] md:min-w-[300px] flex flex-col gap-2 group cursor-pointer">
                <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-lg">
                  <img src={product.images?.[0] || product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="flex flex-col gap-0.5 px-1">
                  <p className="font-bold text-sm text-black">{product.title}</p>
                  <p className="text-xs text-gray-500">{product.category}</p>
                  <p className="font-bold text-sm text-black mt-0.5">₹{product.price}</p>
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
          <h2 className="text-xl md:text-2xl font-bold text-black">Shop By Sport</h2>
          <div className="flex gap-2">
            <button onClick={scrollSportLeft} className="bg-white shadow border border-gray-200 rounded-full p-1.5 md:p-2 hover:bg-gray-50 transition"><svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button>
            <button onClick={scrollSportRight} className="bg-white shadow border border-gray-200 rounded-full p-1.5 md:p-2 hover:bg-gray-50 transition"><svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button>
          </div>
        </div>
        <div ref={sportRef} className="flex overflow-x-auto gap-4 scroll-smooth hide-scrollbar pb-4">
          {['Running', 'Training', 'Sportswear', 'Basketball', 'Football', 'Yoga'].map((sport) => (
            <div key={sport} className="min-w-[240px] md:min-w-[300px] relative h-[300px] md:h-[450px] overflow-hidden group cursor-pointer rounded-lg">
              <img src={`https://source.unsplash.com/featured/?${sport},fitness`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={sport} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl font-bold">{sport}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- TRENDING --- */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-10 py-6 md:py-10 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-black">Trending</h2>
          <div className="flex gap-2">
            <button onClick={scrollTrendingLeft} className="bg-white shadow border border-gray-200 rounded-full p-1.5 md:p-2 hover:bg-gray-50 transition"><svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button>
            <button onClick={scrollTrendingRight} className="bg-white shadow border border-gray-200 rounded-full p-1.5 md:p-2 hover:bg-gray-50 transition"><svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button>
          </div>
        </div>

        <div ref={trendingRef} className="flex overflow-x-auto gap-4 scroll-smooth hide-scrollbar pb-4">
          {loadingProducts ? (
            <p className="text-gray-500 text-sm">Loading trending...</p>
          ) : trendingProducts.length > 0 ? (
            trendingProducts.map((product) => (
              <Link to={`/product/${product._id}`} key={product._id} className="min-w-[240px] md:min-w-[280px] flex flex-col gap-2 group cursor-pointer">
                <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-lg">
                  <img src={product.images?.[0] || product.imageUrl} alt={product.title} className="w-full h-full object-contain group-hover:scale-105 transition duration-500" />
                </div>
                <div className="flex flex-col gap-0.5 px-1">
                  <p className="font-bold text-sm text-black">{product.title}</p>
                  <p className="text-xs text-gray-500">{product.category}</p>
                  <p className="font-bold text-sm text-black mt-0.5">₹{product.price}</p>
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