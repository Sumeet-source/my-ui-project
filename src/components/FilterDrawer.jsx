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
      {/* Backdrop Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

      {/* Drawer Panel */}
      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="text-gray-500 hover:text-black text-sm">
              Close
            </button>
            <span className="text-sm font-medium text-gray-400">|</span>
            <button onClick={handleClearAll} className="text-sm text-gray-700 hover:text-black">
              Clear all
            </button>
          </div>
          <h2 className="text-lg font-bold">Filter</h2>
        </div>

        {/* Filter Options (Scrollable Area) */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Sort */}
          <div className="border-b border-gray-100 pb-4">
            <p className="font-semibold text-sm mb-3">Sort</p>
            <select 
              value={localFilters.sort} 
              onChange={(e) => handleChange('sort', e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-sm"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Gender */}
          <div className="border-b border-gray-100 pb-4">
            <p className="font-semibold text-sm mb-3">Gender</p>
            <div className="space-y-2">
              {['Men', 'Women', 'Unisex'].map((g) => (
                <label key={g} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={localFilters.gender === g}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="accent-black"
                  />
                  {g}
                </label>
              ))}
            </div>
          </div>

          {/* Product Category (For Men/Women pages) */}
          <div className="border-b border-gray-100 pb-4">
            <p className="font-semibold text-sm mb-3">Product Category</p>
            <div className="space-y-2 text-sm">
              {['Clothing', 'Shoes', 'Accessories'].map((c) => (
                <label key={c} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localFilters.productType === c}
                    onChange={(e) => handleChange('productType', e.target.checked ? c : '')}
                    className="accent-black"
                  />
                  {c}
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="border-b border-gray-100 pb-4">
            <p className="font-semibold text-sm mb-3">Price</p>
            <select 
              value={localFilters.price} 
              onChange={(e) => handleChange('price', e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-sm"
            >
              <option value="">All Prices</option>
              <option value="0-50">Under $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100+">Over $100</option>
            </select>
          </div>
        </div>

        {/* Footer Apply Button */}
        <div className="p-6 border-t border-gray-200 bg-white">
          <button 
            onClick={handleApply}
            className="w-full h-12 bg-black text-white text-sm font-semibold hover:bg-gray-800 transition"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}