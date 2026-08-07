import { useState } from 'react';

export default function FilterDrawer({ isOpen, onClose, onApply, onClear }) {
  const [localFilters, setLocalFilters] = useState({
    sort: 'featured',
    gender: '',
    productType: '',
    price: '',
  });

  const handleChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearAll = () => {
    setLocalFilters({ sort: 'featured', gender: '', productType: '', price: '' });
    onClear();
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* Backdrop Overlay with subtle blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      ></div>

      {/* Drawer Panel */}
      <div className="relative w-full max-w-sm bg-[#1d1d1d] text-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="text-white/60 hover:text-white transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-bold tracking-wider">Filters</h2>
          </div>
          <button 
            onClick={handleClearAll} 
            className="text-sm text-white/50 hover:text-white underline transition"
          >
            Clear all
          </button>
        </div>

        {/* Filter Options (Scrollable Area) */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          
          {/* Sort */}
          <div className="border-b border-white/10 pb-4">
            <p className="font-semibold text-sm uppercase tracking-wider mb-3 text-white/70">Sort</p>
            <select 
              value={localFilters.sort} 
              onChange={(e) => handleChange('sort', e.target.value)}
              className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-white/50 transition"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Gender */}
          <div className="border-b border-white/10 pb-4">
            <p className="font-semibold text-sm uppercase tracking-wider mb-3 text-white/70">Gender</p>
            <div className="space-y-2">
              {['Men', 'Women', 'Unisex'].map((g) => (
                <label key={g} className="flex items-center gap-3 text-sm text-white/80 hover:text-white cursor-pointer transition">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={localFilters.gender === g}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-4 h-4 accent-white focus:ring-white/50"
                  />
                  {g}
                </label>
              ))}
            </div>
          </div>

          {/* Product Category */}
          <div className="border-b border-white/10 pb-4">
            <p className="font-semibold text-sm uppercase tracking-wider mb-3 text-white/70">Category</p>
            <div className="space-y-2 text-sm text-white/80">
              {['Clothing', 'Shoes', 'Accessories'].map((c) => (
                <label key={c} className="flex items-center gap-3 cursor-pointer hover:text-white transition">
                  <input
                    type="checkbox"
                    checked={localFilters.productType === c}
                    onChange={(e) => handleChange('productType', e.target.checked ? c : '')}
                    className="w-4 h-4 accent-white rounded focus:ring-white/50"
                  />
                  {c}
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="border-b border-white/10 pb-4">
            <p className="font-semibold text-sm uppercase tracking-wider mb-3 text-white/70">Price</p>
            <select 
              value={localFilters.price} 
              onChange={(e) => handleChange('price', e.target.value)}
              className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-white/50 transition"
            >
              <option value="">All Prices</option>
              <option value="0-50">Under $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100+">Over $100</option>
            </select>
          </div>

        </div>

        {/* Footer Apply Button */}
        <div className="p-6 border-t border-white/10 bg-[#1d1d1d]">
          <button 
            onClick={handleApply}
            className="w-full py-4 bg-white text-black font-bold text-base tracking-wider hover:bg-gray-200 transition"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}