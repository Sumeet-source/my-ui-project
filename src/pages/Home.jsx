import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState(12 * 3600 + 45 * 60);

  // Auto slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3); // 3 slides for variety
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Featured Products Mock Data
  const featuredProducts = [
    { id: '1', title: 'Adizero EVO SL Shoes', price: 159.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80' },
    { id: '2', title: 'Men\'s Performance Tee', price: 45.00, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80' },
    { id: '3', title: 'Women\'s Yoga Leggings', price: 65.00, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80' },
    { id: '4', title: 'Classic Backpack', price: 39.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div className="min-h-screen bg-white font-body-md text-on-surface pb-12">
      
      {/* --- HERO CAROUSEL (Adidas Style Full Width) --- */}
      <section className="relative w-full h-[90vh] max-h-[900px] overflow-hidden">
        <div 
          className="flex w-[300%] h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 33.333}%)` }}
        >
          {/* Slide 1 */}
          <div className="relative w-full h-full flex-shrink-0">
            <img 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1920&q=80" 
              alt="Men's Sportswear" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 md:p-20 w-full text-white flex flex-col items-start justify-end">
              <span className="text-xs md:text-sm uppercase tracking-[0.2em] font-semibold bg-black/60 px-4 py-1 mb-4 inline-block">New Arrivals</span>
              <h2 className="text-4xl md:text-7xl font-bold uppercase tracking-tight leading-tight mb-4">The Final Edit</h2>
              <p className="text-sm md:text-lg font-light opacity-90 max-w-lg mb-8">Curated pieces from the season's close. Premium sportswear engineered for your peak performance.</p>
              <button className="bg-white text-black px-8 py-3 md:px-10 md:py-4 uppercase tracking-widest text-sm font-bold rounded hover:bg-gray-200 transition shadow-lg">Explore Archive</button>
            </div>
          </div>
          
          {/* Slide 2 */}
          <div className="relative w-full h-full flex-shrink-0">
            <img 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1542213498-19360e5b9c23?auto=format&fit=crop&w=1920&q=80" 
              alt="Women's Running" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 md:p-20 w-full text-white flex flex-col items-start justify-end">
              <span className="text-xs md:text-sm uppercase tracking-[0.2em] font-semibold bg-black/60 px-4 py-1 mb-4 inline-block">Vol. 02</span>
              <h2 className="text-4xl md:text-7xl font-bold uppercase tracking-tight leading-tight mb-4">Spring Awakening</h2>
              <p className="text-sm md:text-lg font-light opacity-90 max-w-lg mb-8">The new collection has arrived. Lightweight, breathable, and ready for the road.</p>
              <button className="bg-white text-black px-8 py-3 md:px-10 md:py-4 uppercase tracking-widest text-sm font-bold rounded hover:bg-gray-200 transition shadow-lg">Explore Collection</button>
            </div>
          </div>
          
          {/* Slide 3 */}
          <div className="relative w-full h-full flex-shrink-0">
            <img 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1517931524326-bdd55a541177?auto=format&fit=crop&w=1920&q=80" 
              alt="Shoes & Gear" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 md:p-20 w-full text-white flex flex-col items-start justify-end">
              <span className="text-xs md:text-sm uppercase tracking-[0.2em] font-semibold bg-black/60 px-4 py-1 mb-4 inline-block">The Archives</span>
              <h2 className="text-4xl md:text-7xl font-bold uppercase tracking-tight leading-tight mb-4">Rooted in Style</h2>
              <p className="text-sm md:text-lg font-light opacity-90 max-w-lg mb-8">Premium athletic wear engineered for your peak performance.</p>
              <button className="bg-white text-black px-8 py-3 md:px-10 md:py-4 uppercase tracking-widest text-sm font-bold rounded hover:bg-gray-200 transition shadow-lg">Shop Now</button>
            </div>
          </div>
        </div>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 flex gap-2">
          {[0, 1, 2].map((idx) => (
            <button 
              key={idx}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${currentSlide === idx ? 'bg-white' : 'bg-white/40'}`}
              onClick={() => setCurrentSlide(idx)}
            />
          ))}
        </div>
      </section>

      {/* --- SHOP BY CATEGORY (Adidas Grid Style) --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tight text-gray-900">Shop The Collection</h2>
          <p className="text-gray-500 text-sm mt-2">Elevate your game with our latest drops.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Men */}
          <Link to="/men" className="relative h-[400px] md:h-[500px] overflow-hidden group cursor-pointer">
            <img 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src="https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=800&q=80" 
              alt="Shop Men" 
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-300"></div>
            <div className="absolute inset-0 flex flex-col items-start justify-end p-8 text-white">
              <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-wider">Men's</h3>
              <button className="mt-2 text-sm font-medium uppercase border-b border-white hover:text-gray-200 hover:border-gray-200 transition">Shop Now</button>
            </div>
          </Link>
          {/* Women */}
          <Link to="/women" className="relative h-[400px] md:h-[500px] overflow-hidden group cursor-pointer">
            <img 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80" 
              alt="Shop Women" 
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-300"></div>
            <div className="absolute inset-0 flex flex-col items-start justify-end p-8 text-white">
              <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-wider">Women's</h3>
              <button className="mt-2 text-sm font-medium uppercase border-b border-white hover:text-gray-200 hover:border-gray-200 transition">Shop Now</button>
            </div>
          </Link>
          
          {/* Shoes - Full width on mobile, split on desktop */}
          <Link to="/shoes" className="relative h-[300px] md:h-[350px] overflow-hidden group cursor-pointer md:col-span-1">
            <img 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src="https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=800&q=80" 
              alt="Shop Shoes" 
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-300"></div>
            <div className="absolute inset-0 flex flex-col items-start justify-end p-8 text-white">
              <h3 className="text-3xl font-bold uppercase tracking-wider">Shoes</h3>
              <button className="mt-2 text-sm font-medium uppercase border-b border-white hover:text-gray-200 hover:border-gray-200 transition">Shop Now</button>
            </div>
          </Link>
          {/* Accessories */}
          <Link to="/outlet" className="relative h-[300px] md:h-[350px] overflow-hidden group cursor-pointer md:col-span-1">
            <img 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80" 
              alt="Shop Accessories" 
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-300"></div>
            <div className="absolute inset-0 flex flex-col items-start justify-end p-8 text-white">
              <h3 className="text-3xl font-bold uppercase tracking-wider">Accessories</h3>
              <button className="mt-2 text-sm font-medium uppercase border-b border-white hover:text-gray-200 hover:border-gray-200 transition">Shop Now</button>
            </div>
          </Link>
        </div>
      </section>

      {/* --- MID-SECTION BANNER (Adidas Lifestyle) --- */}
      <section className="relative w-full h-[400px] bg-black/10 overflow-hidden">
        <img 
          className="w-full h-full object-cover" 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80" 
          alt="Lifestyle Banner" 
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6">
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-white mb-2">Push Beyond</h2>
          <p className="text-white/80 text-sm md:text-lg mb-6 max-w-md">Premium athletic wear engineered for your peak performance.</p>
          <button className="bg-white text-black px-8 py-3 uppercase tracking-widest text-sm font-bold rounded hover:bg-gray-100 transition">Shop Now</button>
        </div>
      </section>

      {/* --- TRENDING PRODUCTS (Grid Layout) --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tight text-gray-900">Trending Now</h2>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-2">
            <span>Curated Selections</span>
            <span className="text-gray-300">·</span>
            <span className="font-medium text-black">{formatTime(timeLeft)}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {featuredProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="group cursor-pointer">
              <div className="relative w-full aspect-square overflow-hidden bg-gray-100 rounded-lg">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white hover:scale-110 transition duration-200 z-10">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </button>
              </div>
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-900 line-clamp-1">{product.title}</p>
                <p className="text-sm text-gray-600 mt-1">${product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}