import { useState } from 'react';
import FilterSidebar from '../components/FilterSidebar.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { products } from '../data/products.js';

export default function Men() {
  const [sortBy, setSortBy] = useState('featured');
  const [filters, setFilters] = useState({ gender: [], category: [] });

  const filteredProducts = products.filter((product) => {
    if (product.category !== 'men') return false; // Only show Men's items
    if (filters.gender?.length > 0 && !filters.gender.includes(product.category)) return false;
    if (filters.category?.length > 0 && !filters.category.includes(product.category)) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'low-high') return a.price - b.price;
    if (sortBy === 'high-low') return b.price - a.price;
    return 0;
  });

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Top Breadcrumb & Header */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span>Home</span>
          <span className="text-gray-300">/</span>
          <span className="text-black font-semibold">Men</span>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">FORGE Men's</h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">{sortedProducts.length} items</span>
            <div className="border border-gray-200 rounded-sm px-4 py-2 flex items-center gap-2">
              <label className="text-xs text-gray-600">Sort</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-xs font-medium bg-transparent focus:outline-none cursor-pointer">
                <option value="featured">Featured</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Layout: Sidebar + Grid */}
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar - Updated width to match Under Armour's narrower look */}
          <div className="w-full lg:w-56 shrink-0">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>
          
          {/* Product Grid - 2 Columns on larger screens to match reference */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {sortedProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                {...product} 
                // Adding the 'featured' badge to the first two items just like Under Armour's screenshot
                featured={index < 2} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}