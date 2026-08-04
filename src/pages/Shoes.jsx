import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import FilterSidebar from '../components/FilterSidebar.jsx';
import MobileFilterPanel from '../components/MobileFilterPanel.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { products } from '../data/products.js';

export default function Shoes() {
  const [sortBy, setSortBy] = useState('featured');
  const [filters, setFilters] = useState({ gender: [], category: [] });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const filteredProducts = products.filter((product) => {
    if (product.category !== 'footwear') return false;
    if (filters.gender?.length > 0 && !filters.gender.includes(product.category)) return false;
    if (filters.category?.length > 0 && !filters.category.includes(product.category)) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'low-high') return a.price - b.price;
    if (sortBy === 'high-low') return b.price - a.price;
    return 0;
  });

  const handleApplyFilters = () => setIsFilterOpen(false);

  return (
    <div className="bg-white min-h-screen overflow-x-hidden relative">
      <div className="md:hidden flex justify-between items-center border-b border-gray-200 py-3 px-4 bg-white shrink-0">
        <button onClick={() => setIsCategoryOpen(!isCategoryOpen)} className="flex-1 flex items-center justify-center gap-1 text-sm font-medium text-black border-r border-gray-200">
          Shoes {isCategoryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <button onClick={() => setIsFilterOpen(true)} className="flex-1 flex items-center justify-center text-sm font-medium text-black">
          Filters/ Sort
        </button>
      </div>

      {isCategoryOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-6 py-4 flex flex-col gap-4 shadow-sm">
          <Link to="/shoes" onClick={() => setIsCategoryOpen(false)} className="text-sm font-medium text-black hover:text-blue-600">Featured</Link>
          <Link to="/shoes" onClick={() => setIsCategoryOpen(false)} className="text-sm font-medium text-black hover:text-blue-600">Shop by Category</Link>
          <Link to="/shoes" onClick={() => setIsCategoryOpen(false)} className="text-sm font-medium text-black hover:text-blue-600">Shop by Sport</Link>
          <Link to="/shoes" onClick={() => setIsCategoryOpen(false)} className="text-sm font-medium text-black hover:text-blue-600">Shop by Collection</Link>
          <Link to="/shoes" onClick={() => setIsCategoryOpen(false)} className="text-sm font-medium text-black hover:text-blue-600">Accessories</Link>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>Shoes</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-8">FORGE Shoes</h1>

        <div className="hidden md:flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
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

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="hidden lg:block w-56 shrink-0">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 lg:gap-x-8 lg:gap-y-12">
            {sortedProducts.map((product, index) => (
              <ProductCard key={product.id} {...product} featured={index < 2} />
            ))}
          </div>
        </div>
      </div>

      <MobileFilterPanel isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApply={handleApplyFilters} />
    </div>
  );
}