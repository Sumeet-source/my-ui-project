import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Running');

  // 🟢 REFS & SCROLL FUNCTIONS FOR CAROUSELS
  const bestsellerRef = useRef(null);
  const sportRef = useRef(null);

  // Scroll functions for Bestsellers
  const scrollBestsellerLeft = () => {
    if (bestsellerRef.current) {
      bestsellerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };
  const scrollBestsellerRight = () => {
    if (bestsellerRef.current) {
      bestsellerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  // Scroll functions for Shop By Sport
  const scrollSportLeft = () => {
    if (sportRef.current) {
      sportRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };
  const scrollSportRight = () => {
    if (sportRef.current) {
      sportRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white font-body-md text-on-surface pb-16">
      
      {/* --- SINGLE STATIC VIDEO BANNER --- */}
      <section className="relative w-full min-h-[90dvh] md:h-[85vh] max-h-[900px] overflow-hidden">
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

        {/* Left Buttons */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 pb-8 md:pb-14 flex flex-col items-start gap-4 text-black">
          <div className="flex flex-col sm:flex-row gap-4">
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

        {/* Bottom Right Corner Button */}
        <div className="absolute bottom-0 right-0 md:bottom-0 md:right-0">
          <div className="bg-white text-black px-4 py-3 rounded-tl-lg shadow-md flex items-center gap-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition cursor-pointer">
            <span className="text-sm leading-none opacity-80">✦</span> 
            Follow us
          </div>
        </div>
      </section>

      {/* --- FEATURED DOUBLE BANNER --- */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-10 py-8 md:py-12">
        <h2 className="text-xl md:text-2xl font-bold text-black mb-4">Featured</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="relative group overflow-hidden rounded-none">
            <img src="https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=800&q=80" alt="Training Apparel" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition duration-300"></div>
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white z-10">
              <p className="text-xs md:text-sm font-medium uppercase tracking-wider text-gray-300">Training Apparel</p>
              <h3 className="text-2xl md:text-4xl font-bold mt-1">All Work, No Sweat</h3>
              <Link to="/women" className="inline-block mt-4 bg-white text-black px-6 py-2.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-gray-100 transition">Shop</Link>
            </div>
          </div>
          <div className="relative group overflow-hidden rounded-none">
            <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80" alt="Studio Fleece" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition duration-300"></div>
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white z-10">
              <p className="text-xs md:text-sm font-medium uppercase tracking-wider text-gray-300">Studio Fleece</p>
              <h3 className="text-2xl md:text-4xl font-bold mt-1">It's Just a Sweatsuit Until It's Not</h3>
              <Link to="/women" className="inline-block mt-4 bg-white text-black px-6 py-2.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-gray-100 transition">Shop</Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- BESTSELLERS (Carousel) --- */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-10 py-6 md:py-10 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-black">Bestsellers</h2>
          <div className="flex gap-2">
            <button onClick={scrollBestsellerLeft} className="bg-white shadow-md border border-gray-200 rounded-full p-2 hover:bg-gray-50 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={scrollBestsellerRight} className="bg-white shadow-md border border-gray-200 rounded-full p-2 hover:bg-gray-50 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
        <div ref={bestsellerRef} className="flex overflow-x-auto gap-4 md:gap-6 scroll-smooth hide-scrollbar pb-4">
          <div className="min-w-[280px] md:min-w-[320px] flex flex-col gap-3 group cursor-pointer">
            <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-lg">
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80" alt="Jordan" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-bold text-sm text-black">Jordan Sixty Plus Low</p>
              <p className="text-xs text-gray-600">Men's Shoes</p>
              <p className="font-bold text-sm text-black mt-0.5">₹15,295</p>
            </div>
          </div>
          <div className="min-w-[280px] md:min-w-[320px] flex flex-col gap-3 group cursor-pointer">
            <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-lg">
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80" alt="Pegasus" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-bold text-sm text-black">Nike Pegasus Premium</p>
              <p className="text-xs text-gray-600">Men's Road Running Shoes</p>
              <p className="font-bold text-sm text-black mt-0.5">₹19,295</p>
            </div>
          </div>
          <div className="min-w-[280px] md:min-w-[320px] flex flex-col gap-3 group cursor-pointer">
            <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-lg">
              <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80" alt="Brooklyn" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-bold text-sm text-black">Jordan Brooklyn</p>
              <p className="text-xs text-gray-600">Men's T-Shirt</p>
              <p className="font-bold text-sm text-black mt-0.5">₹2,495</p>
            </div>
          </div>
          <div className="min-w-[280px] md:min-w-[320px] flex flex-col gap-3 group cursor-pointer">
            <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-lg">
              <img src="https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=600&q=80" alt="Air Max" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-bold text-sm text-black">Nike Air Max</p>
              <p className="text-xs text-gray-600">Men's Shoes</p>
              <p className="font-bold text-sm text-black mt-0.5">₹16,995</p>
            </div>
          </div>
          <div className="min-w-[280px] md:min-w-[320px] flex flex-col gap-3 group cursor-pointer">
            <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-lg">
              <img src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80" alt="Hoodie" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-bold text-sm text-black">FORGE Performance Hoodie</p>
              <p className="text-xs text-gray-600">Unisex Hoodie</p>
              <p className="font-bold text-sm text-black mt-0.5">₹3,995</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 🟢 SHOP BY SPORT (Horizontal Carousel) --- */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-10 py-6 md:py-10 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-black">Shop By Sport</h2>
          {/* Navigation Arrows for Sport */}
          <div className="flex gap-2">
            <button onClick={scrollSportLeft} className="bg-white shadow-md border border-gray-200 rounded-full p-2 hover:bg-gray-50 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={scrollSportRight} className="bg-white shadow-md border border-gray-200 rounded-full p-2 hover:bg-gray-50 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        <div ref={sportRef} className="flex overflow-x-auto gap-4 md:gap-6 scroll-smooth hide-scrollbar pb-4">
          {/* 1. Running */}
          <div className="min-w-[280px] md:min-w-[320px] relative h-[400px] md:h-[450px] overflow-hidden group cursor-pointer rounded-lg">
            <img src="https://images.unsplash.com/photo-1552674605-5d3b62d6d026?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Running" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-xl font-bold">Running</h3>
            </div>
          </div>
          {/* 2. Training */}
          <div className="min-w-[280px] md:min-w-[320px] relative h-[400px] md:h-[450px] overflow-hidden group cursor-pointer rounded-lg">
            <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Training" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-xl font-bold">Training</h3>
            </div>
          </div>
          {/* 3. Sportswear */}
          <div className="min-w-[280px] md:min-w-[320px] relative h-[400px] md:h-[450px] overflow-hidden group cursor-pointer rounded-lg">
            <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Sportswear" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-xl font-bold">Sportswear</h3>
            </div>
          </div>
          {/* 4. Basketball */}
          <div className="min-w-[280px] md:min-w-[320px] relative h-[400px] md:h-[450px] overflow-hidden group cursor-pointer rounded-lg">
            <img src="https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Basketball" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-xl font-bold">Basketball</h3>
            </div>
          </div>
          {/* 5. Football */}
          <div className="min-w-[280px] md:min-w-[320px] relative h-[400px] md:h-[450px] overflow-hidden group cursor-pointer rounded-lg">
            <img src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Football" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-xl font-bold">Football</h3>
            </div>
          </div>
          {/* 6. Yoga */}
          <div className="min-w-[280px] md:min-w-[320px] relative h-[400px] md:h-[450px] overflow-hidden group cursor-pointer rounded-lg">
            <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Yoga" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-xl font-bold">Yoga</h3>
            </div>
          </div>
        </div>
      </section>

      {/* --- TRENDING (3 Unique Cards) --- */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-10 py-6 md:py-10">
        <h2 className="text-xl md:text-2xl font-bold text-black mb-4">Trending</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Trending 1: Product (Left) */}
          <div className="relative h-[400px] md:h-[550px] overflow-hidden group cursor-pointer bg-gray-50">
            <img src="https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-contain group-hover:scale-105 transition duration-500" alt="Tiempo" />
            <div className="absolute bottom-6 left-6 z-10">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-600">Just In: Tiempo Maestro Elite</p>
              <h3 className="text-xl font-bold text-black mt-1">Designed for Creative Touch</h3>
              <Link to="/shoes" className="inline-block mt-3 bg-white text-black px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider border border-gray-200 hover:bg-gray-100 transition">Shop</Link>
            </div>
          </div>
          {/* Trending 2: Lifestyle (Middle) */}
          <div className="relative h-[400px] md:h-[550px] overflow-hidden group cursor-pointer">
            <img src="https://images.unsplash.com/photo-1560272563-c67281a2cb65?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="Nerazzurri" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white z-10">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-300">Inter Milan Home Kit 2026/27</p>
              <h3 className="text-2xl font-bold text-white mt-1">Nerazzurri Pride</h3>
              <Link to="/men" className="inline-block mt-3 bg-white text-black px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition">Shop Football</Link>
            </div>
          </div>
          {/* Trending 3: Kids (Right) */}
          <div className="relative h-[400px] md:h-[550px] overflow-hidden group cursor-pointer">
            <img src="https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="Kids Jordan" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white z-10">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-300">Kids' Jordan</p>
              <h3 className="text-2xl font-bold text-white mt-1">All-Day Play</h3>
              <Link to="/men" className="inline-block mt-3 bg-white text-black px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition">Shop Jordan</Link>
            </div>
          </div>
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

      {/* --- SHOP BY CATEGORY --- */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-10 pt-2 pb-10">
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