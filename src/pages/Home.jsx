import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const res = await axiosClient.get('/api/products');
      setProducts(res.data); 
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Men', link: '/men', img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&auto=format&fit=crop' },
    { name: 'Women', link: '/women', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop' },
    { name: 'Shoes', link: '/shoes', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop' },
    { name: 'Outlet', link: '/outlet', img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=800&auto=format&fit=crop' }
  ];

  const instaImages = [
    'https://images.unsplash.com/photo-1517931524326-bdd55b5415f7?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574680096144-f9ca08522613?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop'
  ];

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

      {/* === MIDDLE SECTION (NOW FULL WIDTH EDGE-TO-EDGE LIKE BANNER 2) === */}
      <div className="relative w-full py-10 md:py-16 overflow-hidden mt-0">
        
        {/* Background Image for the middle section */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop" 
            alt="Background Texture" 
            className="w-full h-full object-cover opacity-5"
          />
          {/* Overlay to ensure text remains perfectly readable */}
          <div className="absolute inset-0 bg-white/80"></div>
        </div>

        {/* Inner Content container with padding (to keep text aligned and not touch edges) */}
        <div className="relative px-6 md:px-10 max-w-[1600px] mx-auto">
          
          {/* CATEGORY GRID */}
          <h1 className="text-3xl font-bold mb-6 pt-8">Shop by Category</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
            {categories.map((cat) => (
              <Link to={cat.link} key={cat.name} className="flex flex-col group cursor-pointer">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-200">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" onError={(e) => { e.target.src = 'https://picsum.photos/seed/fallback/800/800'; }} />
                </div>
                <p className="mt-2 text-sm font-medium text-gray-900 uppercase tracking-wider">Shop {cat.name}</p>
              </Link>
            ))}
          </div>

          {/* FEATURED PRODUCTS */}
          <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-gray-200 rounded-lg aspect-square"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {products.slice(0, 8).map((product) => (
                <Link to={`/product/${product._id}`} key={product._id} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square border border-gray-100">
                    <img src={product.images?.[0] || 'https://placehold.co/600x600/333/fff?text=Product+Image'} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" onError={(e) => { e.target.src = 'https://placehold.co/600x600/333/fff?text=Image+Error'; }} />
                    <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    </button>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-semibold text-gray-900">{product.title}</p>
                    <p className="text-sm text-gray-500">${product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* INSTAGRAM SECTION */}
          <div className="border-t border-gray-200 pt-10 mt-4">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Follow Our Journey</h2>
              <span className="text-sm text-gray-500 hover:text-black cursor-pointer font-medium">#FORGE_FITNESS</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              {instaImages.map((imgSrc, index) => (
                <div key={index} className="relative aspect-square overflow-hidden group bg-gray-200 rounded-lg">
                  <img src={imgSrc} alt={`Insta ${index + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" onError={(e) => { e.target.src = 'https://picsum.photos/seed/instafallback/1000/1000'; }} />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition duration-300"></div>
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center mt-6 pt-4 border-t border-gray-100">
               <Link to="#" className="flex items-center gap-2 text-gray-800 hover:text-black transition group">
                  <svg className="w-6 h-6 group-hover:scale-110 transition" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                  <span className="text-sm font-semibold">Follow us @forge_fitness</span>
               </Link>
            </div>
          </div>

        </div>
      </div>

      {/* === BOTTOM BANNERS (EDGE-TO-EDGE) === */}
      
      {/* Bottom Banner 1 */}
      <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden mt-0">
        <img src="https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop" alt="New Arrivals" className="w-full h-full object-cover brightness-75" onError={(e) => { e.target.src = 'https://picsum.photos/seed/bottom1/2070/400'; }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-wider mb-2">SHOP THE LATEST</h2>
          <p className="text-sm md:text-lg text-white max-w-xl mb-6">Discover new arrivals and exclusive collections.</p>
          <Link to="/new-arrivals" className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-300">Shop Now</Link>
        </div>
      </div>

      {/* Bottom Banner 2 */}
      <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden mt-0">
        <img src="https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=2070&auto=format&fit=crop" alt="Essentials" className="w-full h-full object-cover brightness-75" onError={(e) => { e.target.src = 'https://picsum.photos/seed/bottom2/2070/400'; }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-wider mb-2">BUILT TO LAST</h2>
          <p className="text-sm md:text-lg text-white max-w-xl mb-6">Premium quality gear designed for endurance.</p>
          <Link to="/outlet" className="bg-black text-white font-bold py-3 px-8 rounded-full hover:bg-gray-800 hover:scale-105 transition-all duration-300 border border-white/20">Shop Outlet</Link>
        </div>
      </div>

      {/* Bottom Banner 3 */}
      <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden mt-0">
        <img src="https://images.unsplash.com/photo-1574680096144-f9ca08522613?q=80&w=2070&auto=format&fit=crop" alt="Limited Drop" className="w-full h-full object-cover brightness-75" onError={(e) => { e.target.src = 'https://picsum.photos/seed/bottom3/2070/400'; }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-wider mb-2">LIMITED DROP</h2>
          <p className="text-sm md:text-lg text-white max-w-xl mb-6">Exclusive styles. Limited quantities. Get yours before they're gone.</p>
          <Link to="/shoes" className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-300">Shop Now</Link>
        </div>
      </div>

    </div>
  );
}