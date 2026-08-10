import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(12 * 3600 + 45 * 60);

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
      
      {/* --- SINGLE STATIC VIDEO BANNER --- */}
      {/* 🟢 FIX: Mobile par pura screen cover karne ke liye min-h-[90dvh] add kiya */}
      <section className="relative w-full min-h-[90dvh] md:h-[85vh] max-h-[900px] overflow-hidden">
        
        {/* 🟢 Video hamesha run karega */}
        <video 
          className="w-full h-full object-cover" 
          autoPlay 
          loop 
          muted 
          playsInline
          src="/videos/hero-banner.mp4" 
        ></video>

        {/* 🟢 Overlay aur Buttons - Mobile ke liye neeche thoda space (pb-16) diya hai */}
        <div className="absolute inset-0 bg-white/20 mix-blend-overlay"></div>
        <div className="absolute inset-0 flex flex-col items-start justify-end p-6 md:p-24 pb-16 md:pb-20 text-left text-black">
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-black mb-2">HYPERBOOST</h2>
          <p className="text-xs md:text-sm font-medium text-gray-900 max-w-xs mb-6">
            A new running experience, once you feel it, there is no going back.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
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

      {/* --- NEW SHOES. NEW MOVES. --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-left mb-6">
          <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tighter text-gray-900">NEW SHOES. NEW MOVES.</h2>
          <div className="flex items-center gap-2 mt-1">
             <span className="text-2xl">👟</span>
          </div>
        </div>
        
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 no-scrollbar">
          {['Running', 'Training', 'Football', 'Originals', 'Walk', 'Slides', 'Tennis', 'Basketball'].map((cat) => (
            <button key={cat} className="px-4 py-2 bg-transparent text-gray-900 text-sm font-medium uppercase tracking-wider border-b-2 border-transparent hover:border-black transition snap-center whitespace-nowrap">
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* --- SHOP BY CATEGORY --- */}
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