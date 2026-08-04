import { useState } from 'react';
import FilterSidebar from '../components/FilterSidebar.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { products } from '../data/products.js';

export default function Outlet() {
  const [sortBy, setSortBy] = useState('featured');
  const [filters, setFilters] = useState({ gender: [], category: [] });

  const filteredProducts = products.filter((product) => {
    if (!filters) return true;
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
        <p className="text-sm text-gray-500 mb-6">Outlet</p>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">FORGE Outlet</h1>
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
        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar filters={filters} setFilters={setFilters} />
          {/* --- UPDATED GRID FOR 2 COLUMNS ON MOBILE --- */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}