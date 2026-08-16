import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function Home() {
  const navigate = useNavigate();
  
  // 🟢 STATE FOR REAL PRODUCTS
  const [allProducts, setAllProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Running');

  // 🟢 CAROUSEL REFS
  const bestsellerRef = useRef(null);
  const sportRef = useRef(null);
  const trendingRef = useRef(null); // 🟢 ADDED FOR TRENDING

  // 🟢 SCROLL FUNCTIONS
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

  // 🟢 FETCH REAL PRODUCTS FROM BACKEND
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

  // Slice products for sections
  const bestsellers = allProducts.slice(0, 4);
  const trendingProducts = allProducts.slice(4, 9); // Trending mei next 5 products

  return (
    <div className="min-h-screen bg-white pb-16">
      
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

        <div className="absolute bottom-0 left-0 w-full p-4 md:p-10 pb-6 md:pb-14 flex flex-col items-start gap-3 md:gap-4 text-black">
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

      {/* --- FEATURED DOUBLE BANNER --- */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-10 py-6 md:py-12">
        <h2 className="text-xl md:text-2xl font-bold text-black mb-4">Featured</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="relative group overflow-hidden rounded-lg">
            <img src="https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=800&q=80" alt="Training Apparel" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
            <div className="absolute bottom-6 left-6 text-white z-10">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-300">Training Apparel</p>
              <h3 className="text-xl md:text-3xl font-bold mt-1">All Work, No Sweat</h3>
              <Link to="/women" className="inline-block mt-3 bg-white text-black px-4 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-gray-100 transition">Shop</Link>
            </div>
          </div>
          <div className="relative group overflow-hidden rounded-lg">
            <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80" alt="Studio Fleece" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
            <div className="absolute bottom-6 left-6 text-white z-10">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-300">Studio Fleece</p>
              <h3 className="text-xl md:text-3xl font-bold mt-1">It's Just a Sweatsuit Until It's Not</h3>
              <Link to="/women" className="inline-block mt-3 bg-white text-black px-4 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-gray-100 transition">Shop</Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- BESTSELLERS (Carousel with REAL PRODUCTS) --- */}
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

      {/* --- SHOP BY SPORT (Slider) --- */}
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

      {/* --- 🟢 TRENDING SLIDER (With Real Products & Redirect Links) --- */}
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
              <Link to={`/product/${product._id}`} key={product._id} className="min-w-[240px] md:min-w-[280px] relative h-[350px] md:h-[450px] overflow-hidden group cursor-pointer rounded-lg bg-gray-50">
                <img src={product.images?.[0] || product.imageUrl} alt={product.title} className="w-full h-full object-contain group-hover:scale-105 transition duration-500" />
                <div className="absolute bottom-6 left-6 z-10 pr-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-600">Just In</p>
                  <h3 className="text-lg md:text-xl font-bold text-black mt-1 line-clamp-2">{product.title}</h3>
                  <div className="inline-block mt-2 bg-white text-black px-4 py-1.5 md:px-5 md:py-2 rounded-full text-xs font-bold uppercase tracking-wider border border-gray-200 hover:bg-gray-100 transition">
                    Shop
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No trending products found.</p>
          )}
        </div>
      </section>

      {/* --- NEW MOVES CATEGORY BUTTONS --- */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-10 pt-2 pb-8">
        <div className="flex justify-center md:justify-start gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 no-scrollbar mt-2">
          {['Running shoes', 'Training', 'Jackets', 'Shorts', 'Jeans', 'T-shirts', 'Hoodies', 'Sneakers'].map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  navigate(`/search?subCategory=${cat}`);
                }}
                className={`px-4 py-1.5 text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 snap-center whitespace-nowrap rounded-full border-2 ${
                  isActive 
                    ? 'border-black text-black bg-gray-50' 
                    : 'border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-400'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* --- BETTER ON THE APP BANNER --- */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-10 py-6 md:py-8">
        <div className="bg-[#F5F0E1] w-full p-6 md:p-8 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 border border-[#E8DEC5]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-xl md:text-2xl font-black tracking-[0.2em] text-black">F</span>
            </div>
            <div>
              <h3 className="text-lg md:text-2xl font-bold text-black uppercase tracking-tight">It's Better on the FORGE App</h3>
            </div>
          </div>
          <Link to="/" className="bg-black text-white px-5 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition">
            Download Now
          </Link>
        </div>
      </section>

      {/* --- SHOP BY CATEGORY --- */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-10 pt-2 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/men" className="relative h-[300px] md:h-[500px] overflow-hidden group cursor-pointer">
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=800&q=80" alt="Shop Men" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-300"></div>
            <div className="absolute inset-0 flex flex-col items-start justify-end p-6 text-white">
              <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter">Men's</h3>
              <span className="mt-2 text-[13px] font-bold uppercase tracking-wider border-b border-white pb-0.5 hover:opacity-80 transition">Shop Now</span>
            </div>
          </Link>
          <Link to="/women" className="relative h-[300px] md:h-[500px] overflow-hidden group cursor-pointer">
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80" alt="Shop Women" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-300"></div>
            <div className="absolute inset-0 flex flex-col items-start justify-end p-6 text-white">
              <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter">Women's</h3>
              <span className="mt-2 text-[13px] font-bold uppercase tracking-wider border-b border-white pb-0.5 hover:opacity-80 transition">Shop Now</span>
            </div>
          </Link>
          <Link to="/shoes" className="relative h-[300px] md:h-[350px] overflow-hidden group cursor-pointer">
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=800&q=80" alt="Shop Shoes" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-300"></div>
            <div className="absolute inset-0 flex flex-col items-start justify-end p-6 text-white">
              <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter">Shoes</h3>
              <span className="mt-2 text-[13px] font-bold uppercase tracking-wider border-b border-white pb-0.5 hover:opacity-80 transition">Shop Now</span>
            </div>
          </Link>
          <Link to="/outlet" className="relative h-[300px] md:h-[350px] overflow-hidden group cursor-pointer">
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80" alt="Shop Accessories" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-300"></div>
            <div className="absolute inset-0 flex flex-col items-start justify-end p-6 text-white">
              <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter">Accessories</h3>
              <span className="mt-2 text-[13px] font-bold uppercase tracking-wider border-b border-white pb-0.5 hover:opacity-80 transition">Shop Now</span>
            </div>
          </Link>
        </div>
      </section>

    </div>
  );
}