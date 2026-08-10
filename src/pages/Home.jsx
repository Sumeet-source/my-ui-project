import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState(12 * 3600 + 45 * 60);
  const productCarouselRef = useRef(null);

  // Auto slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
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

  // Featured Products Mock Data (Adidas real products)
  const featuredProducts = [
    { id: '1', title: 'Adizero EVO SL Shoes', price: 159.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80' },
    { id: '2', title: 'Men\'s Performance Tee', price: 45.00, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80' },
    { id: '3', title: 'Women\'s Yoga Leggings', price: 65.00, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80' },
    { id: '4', title: 'Classic Backpack', price: 39.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80' },
    { id: '5', title: 'Ultraboost 22 Running', price: 189.99, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80' },
    { id: '6', title: 'Sportswear Zip Hoodie', price: 79.99, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div className="min-h-screen bg-white font-body-md text-on-surface pb-16">
      
      {/* --- HERO CAROUSEL (Full Width) --- */}
      <section className="relative w-full h-[85vh] max-h-[900px] overflow-hidden">
        <div 
          className="flex w-[300%] h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 33.333}%)` }}
        >
          {/* Slide 1 */}
          <div className="relative w-full h-full flex-shrink-0">
            <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1920&q=80" alt="Men's Sportswear" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 md:p-20 w-full text-white flex flex-col items-start justify-end">
              <span className="text-[10px] md:text-[12px] uppercase tracking-[0.2em] font-bold bg-black/60 px-3 py-1 mb-4 inline-block">New Arrivals</span>
              <h2 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter leading-[0.9] mb-4">The Final Edit</h2>
              <p className="text-xs md:text-base font-light opacity-90 max-w-lg mb-6">Curated pieces from the season's close. Engineered for peak performance.</p>
              {/* 🟢 Adidas Style CTA (Text + Underline) */}
              <span className="inline-block text-[13px] md:text-[15px] font-bold uppercase tracking-wider border-b border-white pb-1 cursor-pointer hover:opacity-80 transition">
                Explore Archive →
              </span>
            </div>
          </div>
          
          {/* Slide 2 */}
          <div className="relative w-full h-full flex-shrink-0">
            <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1542213498-19360e5b9c23?auto=format&fit=crop&w=1920&q=80" alt="Women's Running" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 md:p-20 w-full text-white flex flex-col items-start justify-end">
              <span className="text-[10px] md:text-[12px] uppercase tracking-[0.2em] font-bold bg-black/60 px-3 py-1 mb-4 inline-block">Vol. 02</span>
              <h2 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter leading-[0.9] mb-4">Spring Awakening</h2>
              <p className="text-xs md:text-base font-light opacity-90 max-w-lg mb-6">The new collection has arrived. Lightweight, breathable, and ready.</p>
              <span className="inline-block text-[13px] md:text-[15px] font-bold uppercase tracking-wider border-b border-white pb-1 cursor-pointer hover:opacity-80 transition">
                Shop Collection →
              </span>
            </div>
          </div>
          
          {/* Slide 3 */}
          <div className="relative w-full h-full flex-shrink-0">
            <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1517931524326-bdd55a541177?auto=format&fit=crop&w=1920&q=80" alt="Shoes & Gear" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 md:p-20 w-full text-white flex flex-col items-start justify-end">
              <span className="text-[10px] md:text-[12px] uppercase tracking-[0.2em] font-bold bg-black/60 px-3 py-1 mb-4 inline-block">The Archives</span>
              <h2 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter leading-[0.9] mb-4">Rooted in Style</h2>
              <p className="text-xs md:text-base font-light opacity-90 max-w-lg mb-6">Premium athletic wear engineered for your peak performance.</p>
              <span className="inline-block text-[13px] md:text-[15px] font-bold uppercase tracking-wider border-b border-white pb-1 cursor-pointer hover:opacity-80 transition">
                Shop Now →
              </span>
            </div>
          </div>
        </div>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 flex gap-2">
          {[0, 1, 2].map((idx) => (
            <button key={idx} className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${currentSlide === idx ? 'bg-white' : 'bg-white/40'}`} onClick={() => setCurrentSlide(idx)} />
          ))}
        </div>
      </section>

      {/* --- SHOP BY CATEGORY (Adidas Grid Style) --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tight text-gray-900">Shop The Collection</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/men" className="relative h-[400px] md:h-[500px] overflow-hidden group cursor-pointer">
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=800&q=80" alt="Shop Men" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-300"></div>
            <div className="absolute inset-0 flex flex-col items-start justify-end p-8 text-white">
              <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter">Men's</h3>
              <span className="mt-2 text-[13px] font-bold uppercase tracking-wider border-b border-white pb-0.5 hover:opacity-80 transition">Shop Now</span>
            </div>
          </Link>
          <Link to="/women" className="relative h-[400px] md:h-[500px] overflow-hidden group cursor-pointer">
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80" alt="Shop Women" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-300"></div>
            <div className="absolute inset-0 flex flex-col items-start justify-end p-8 text-white">
              <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter">Women's</h3>
              <span className="mt-2 text-[13px] font-bold uppercase tracking-wider border-b border-white pb-0.5 hover:opacity-80 transition">Shop Now</span>
            </div>
          </Link>
          <Link to="/shoes" className="relative h-[300px] md:h-[350px] overflow-hidden group cursor-pointer">
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=800&q=80" alt="Shop Shoes" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-300"></div>
            <div className="absolute inset-0 flex flex-col items-start justify-end p-8 text-white">
              <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter">Shoes</h3>
              <span className="mt-2 text-[13px] font-bold uppercase tracking-wider border-b border-white pb-0.5 hover:opacity-80 transition">Shop Now</span>
            </div>
          </Link>
          <Link to="/outlet" className="relative h-[300px] md:h-[350px] overflow-hidden group cursor-pointer">
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80" alt="Shop Accessories" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-300"></div>
            <div className="absolute inset-0 flex flex-col items-start justify-end p-8 text-white">
              <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter">Accessories</h3>
              <span className="mt-2 text-[13px] font-bold uppercase tracking-wider border-b border-white pb-0.5 hover:opacity-80 transition">Shop Now</span>
            </div>
          </Link>
        </div>
      </section>

      {/* --- TRENDING PRODUCTS (Horizontal Carousel / Rail) --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-3xl font-bold uppercase tracking-tight text-gray-900">Trending Now</h2>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gray-500">
            <span>Curated</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="text-black">{formatTime(timeLeft)}</span>
          </div>
        </div>
        
        {/* 🟢 Horizontal Scroll Rail (Adidas Style) */}
        <div 
          ref={productCarouselRef} 
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 no-scrollbar"
        >
          {featuredProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="min-w-[160px] md:min-w-[240px] snap-center group">
              <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <button className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white hover:scale-110 transition duration-200 z-10">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </button>
              </div>
              <div className="mt-3">
                <p className="text-xs md:text-sm font-bold text-gray-900 line-clamp-1">{product.title}</p>
                <p className="text-xs md:text-sm text-gray-600 mt-0.5">${product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* --- MID-SECTION BANNER (Adidas Lifestyle) --- */}
      <section className="relative w-full h-[450px] bg-black overflow-hidden">
        <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80" alt="Lifestyle Banner" />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6">
          <span className="text-white text-[10px] uppercase tracking-[0.2em] font-bold bg-black/60 px-3 py-1 mb-4 inline-block">Push Beyond</span>
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-white mb-2">Never Stop</h2>
          <p className="text-white/80 text-xs md:text-sm mb-6 max-w-md">Premium athletic wear engineered for your peak performance.</p>
          <span className="inline-block text-[13px] md:text-[15px] font-bold uppercase tracking-wider text-white border-b border-white pb-1 cursor-pointer hover:opacity-80 transition">
            Shop Now
          </span>
        </div>
      </section>

    </div>
  );
}