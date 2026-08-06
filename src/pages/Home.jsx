import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      
      {/* === HERO BANNER 1 === */}
      <div className="relative w-full h-[500px] md:h-[700px] lg:h-[800px] overflow-hidden mt-0 pt-0">
        <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop" alt="Gym Hero" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://picsum.photos/2070/800?random=1'; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-start justify-end px-6 md:px-20 pb-10 md:pb-20">
          <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-lg mb-2">PUSH <br className="hidden md:block" /> BEYOND</h1>
          <p className="text-base md:text-xl text-gray-200 max-w-2xl mb-6 drop-shadow-md">Premium athletic wear engineered for your peak performance.</p>
          <Link to="/men" className="bg-white text-black font-bold py-3 px-8 md:py-4 md:px-10 rounded hover:bg-gray-100 hover:scale-105 transition-all duration-300">SHOP NOW</Link>
        </div>
      </div>

      {/* === HERO BANNER 2 === */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden mt-0">
        <img src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=2070&auto=format&fit=crop" alt="HeatGear Elite" className="w-full h-full object-cover brightness-75" onError={(e) => { e.target.src = 'https://picsum.photos/2070/800?random=2'; }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-wider mb-2">HEATGEAR<span className="text-red-500">®</span> ELITE</h2>
          <p className="text-sm md:text-lg text-white max-w-xl mb-6">Compression that stretches the way you need it.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/men" className="bg-black text-white font-semibold py-3 px-8 rounded hover:bg-gray-800 hover:scale-105 transition-all duration-300 border border-white/20">Shop Men</Link>
            <Link to="/women" className="bg-white text-black font-semibold py-3 px-8 rounded hover:bg-gray-100 hover:scale-105 transition-all duration-300">Shop Women</Link>
          </div>
        </div>
      </div>

    </div>
  );
}