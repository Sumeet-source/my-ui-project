import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useAdmin } from '../context/AdminContext.jsx';
// FALLBACK IMPORT
import { products as localProducts } from '../data/products.js'; 

export default function Home() {
  // Try to fetch from DB, fallback to local file if it fails
const { products: dbProducts, loading } = useAdmin();
const products = (dbProducts && dbProducts.length > 0) ? dbProducts : localProducts;
  const [searchParams] = useSearchParams();
  
  // Initialize state
  const [activeCategory, setActiveCategory] = useState(() => searchParams.get('category') || 'all');
  const [sortOption, setSortOption] = useState('default');
  const [brandFilter, setBrandFilter] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const searchTerm = searchParams.get('search') || '';

  // --- THE FIX ---
  // Whenever the URL changes (Men/Women clicks), update the activeCategory
  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    setActiveCategory(cat);
  }, [searchParams]); 
  // --- END OF FIX ---

  // --- SCROLL FIX ---
  // The menu buttons do a full page reload to '/?category=X#new-arrivals'.
  // On a hard reload, the browser tries to jump to #new-arrivals immediately,
  // before this component has rendered the filtered section - so the native
  // jump silently fails and you're stuck at the top. Re-trigger it ourselves
  // once the filtered content has actually rendered.
    // --- SCROLL FIX (MOBILE LAYOUT ENGINE DELAY) ---
  useEffect(() => {
    if (window.location.hash === '#new-arrivals') {
      // Increased to 1000ms to guarantee the mobile CPU finishes painting the grid layout
      const timer = setTimeout(() => {
        const element = document.getElementById('new-arrivals');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 1000); // 1-second delay

      // Cleanup timeout if the component unmounts early
      return () => clearTimeout(timer);
    }
  }, [activeCategory]);
  

  // 1. Filter by Category
  const categoryFiltered = activeCategory === 'all' 
    ? products 
    : products.filter((product) => product.category === activeCategory);

  // 2. Filter by Search Term
  const searchFiltered = categoryFiltered.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. Filter by Brand
  const brandFiltered = brandFilter === 'all'
    ? searchFiltered
    : searchFiltered.filter((product) => product.brand === brandFilter);

  // 4. Filter by Price Range
  const priceFiltered = brandFiltered.filter((product) => {
    if (priceRange === 'under50') return product.price < 50;
    if (priceRange === '50to100') return product.price >= 50 && product.price <= 100;
    if (priceRange === 'over100') return product.price > 100;
    return true;
  });

  // 5. Sort
  const sortedProducts = [...priceFiltered].sort((a, b) => {
    if (sortOption === 'low-to-high') return a.price - b.price;
    if (sortOption === 'high-to-low') return b.price - a.price;
    return 0;
  });

  const uniqueBrands = ['all', ...new Set(products.map(p => p.brand).filter(Boolean))];

  return (
    <div className="font-sans overflow-x-hidden">
      <section className="relative h-[600px] flex items-center justify-center bg-black" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold uppercase tracking-wider mb-4">Push Beyond</h1>
          <p className="text-lg md:text-2xl font-light mb-8">High-performance gear engineered for the grind.</p>
          <a href="#new-arrivals" className="bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-wide hover:bg-gray-200 transition shadow-lg inline-block">Shop Now</a>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 border-l-4 border-black pl-4">Shop by Category</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {['men', 'women', 'outerwear', 'footwear'].map((cat, idx) => (
            <div key={idx} onClick={() => setActiveCategory(cat)} className={`relative group h-64 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 ${activeCategory === cat ? 'border-black' : 'border-transparent'}`}>
               <img src={['https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&w=600&q=80','https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80','https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80','https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'][idx]} alt={cat} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
               <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-300"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <h3 className="text-white text-xl font-bold uppercase tracking-wider">{cat}</h3>
               </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16" id="new-arrivals">
        <div className="flex flex-wrap justify-between items-center mb-8 border-l-4 border-black pl-4 gap-4">
          <h2 className="text-3xl font-bold text-gray-900">
            {searchTerm ? `Searching for "${searchTerm}"` : (activeCategory === 'all' ? 'New Arrivals' : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1))}
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="bg-white border border-gray-300 rounded-md py-1.5 px-3 text-sm font-medium text-gray-700 focus:outline-none focus:border-black transition shadow-sm cursor-pointer">
              <option value="all">All Brands</option>
              {uniqueBrands.filter(b => b !== 'all').map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
            <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="bg-white border border-gray-300 rounded-md py-1.5 px-3 text-sm font-medium text-gray-700 focus:outline-none focus:border-black transition shadow-sm cursor-pointer">
              <option value="all">All Prices</option>
              <option value="under50">Under $50</option>
              <option value="50to100">$50 - $100</option>
              <option value="over100">Over $100</option>
            </select>
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="bg-white border border-gray-300 rounded-md py-1.5 px-3 text-sm font-medium text-gray-700 focus:outline-none focus:border-black transition shadow-sm cursor-pointer">
              <option value="default">Sort by</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
            </select>
            {activeCategory !== 'all' && <button onClick={() => setActiveCategory('all')} className="text-sm font-semibold text-gray-600 hover:text-black transition underline">View All</button>}
            {searchTerm && <button onClick={() => setSearchParams({})} className="text-sm font-semibold text-gray-600 hover:text-black transition underline">Clear Search</button>}
          </div>
        </div>

        {sortedProducts.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <p className="text-xl text-gray-500">No products found matching your filters.</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {sortedProducts.map((item) => (
              <ProductCard 
                key={item.id} 
                id={item.id} 
                title={item.title} 
                price={item.price} 
                image={item.image} 
                rating={item.rating} 
                reviewsCount={item.reviews?.length || 0} 
                inStock={item.inStock}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}