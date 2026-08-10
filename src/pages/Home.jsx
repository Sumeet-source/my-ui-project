import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState(12 * 3600 + 45 * 60);

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

  return (
    <div className="min-h-screen bg-white font-body-md text-on-surface pb-16">
      
      {/* --- HERO CAROUSEL (Adidas Live Style) --- */}
      <section className="relative w-full h-[85vh] max-h-[900px] overflow-hidden">
        <div 
          className="flex w-[300%] h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 33.333}%)` }}
        >
          {/* Slide 1: Adidas HYPERBOOST style (Match kiya screenshot se) */}
          <div className="relative w-full h-full flex-shrink-0">
            <img 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1920&q=80" 
              alt="Hyperboost" 
            />
            <div className="absolute inset-0 bg-white/30 mix-blend-overlay"></div>
            <div className="absolute inset-0 flex flex-col items-start justify-center p-8 md:p-24 text-left text-black">
              <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-black mb-2">HYPERBOOST</h2>
              <p className="text-xs md:text-sm font-medium text-gray-900 max-w-xs mb-6">
                A new running experience, once you feel it, there is no going back.
              </p>
              
              {/* 🟢 Buttons exactly like Adidas screenshot */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <button className="bg-white text-black border-2 border-black px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-gray-100 transition rounded-sm">
                  Shop men →
                </button>
                <button className="bg-white text-black border-2 border-black px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-gray-100 transition rounded-sm">
                  Shop women →
                </button>
              </div>
              
              {/* 🟢 Learn More Link */}
              <span className="inline-block text-xs md:text-sm font-bold uppercase tracking-wider border-b-2 border-black pb-1 cursor-pointer hover:opacity-70 transition">
                Learn More →
              </span>
            </div>
          </div>
          
          {/* Slide 2 */}
          <div className="relative w-full h-full flex-shrink-0">
            <img 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1542213498-19360e5b9c23?auto=format&fit=crop&w=1920&q=80" 
              alt="Spring Awakening" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 md:p-20 w-full text-white flex flex-col items-start justify-end">
              <span className="text-[10px] md:text-[12px] uppercase tracking-[0.2em] font-bold bg-black/60 px-3 py-1 mb-4 inline-block">Vol. 02</span>
              <h2 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter leading-[0.9] mb-4">Spring Awakening</h2>
              <span className="inline-block text-[13px] md:text-[15px] font-bold uppercase tracking-wider border-b border-white pb-1 cursor-pointer hover:opacity-80 transition">
                Shop Collection →
              </span>
            </div>
          </div>
          
          {/* Slide 3 */}
          <div className="relative w-full h-full flex-shrink-0">
            <img 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1517931524326-bdd55a541177?auto=format&fit=crop&w=1920&q=80" 
              alt="Rooted in Style" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 md:p-20 w-full text-white flex flex-col items-start justify-end">
              <span className="text-[10px] md:text-[12px] uppercase tracking-[0.2em] font-bold bg-black/60 px-3 py-1 mb-4 inline-block">The Archives</span>
              <h2 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter leading-[0.9] mb-4">Rooted in Style</h2>
              <span className="inline-block text-[13px] md:text-[15px] font-bold uppercase tracking-wider border-b border-white pb-1 cursor-pointer hover:opacity-80 transition">
                Shop Now →
              </span>
            </div>
          </div>
        </div>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 flex gap-2">
          {[0, 1, 2].map((idx) => (
            <button 
              key={idx}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${currentSlide === idx ? 'bg-black' : 'bg-gray-400'}`}
              onClick={() => setCurrentSlide(idx)}
            />
          ))}
        </div>
      </section>

      {/* --- NEW SHOES. NEW MOVES. (Category Swipe Row) --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-left mb-6">
          <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tighter text-gray-900">NEW SHOES. NEW MOVES.</h2>
          <div className="flex items-center gap-2 mt-1">
             <span className="text-2xl">👟</span>
          </div>
        </div>
        
        {/* Horizontal Category Scroller */}
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 no-scrollbar">
          {['Running', 'Training', 'Football', 'Originals', 'Walk', 'Slides', 'Tennis', 'Basketball'].map((cat) => (
            <button key={cat} className="px-4 py-2 bg-transparent text-gray-900 text-sm font-medium uppercase tracking-wider border-b-2 border-transparent hover:border-black transition snap-center whitespace-nowrap">
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* --- SHOP BY CATEGORY (Adidas Grid Style) --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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

    </div>
  );
}