import { useState } from 'react';

export default function FilterBottomSheet({ isOpen, onClose, onApply, onClear, products }) {
  const [localFilters, setLocalFilters] = useState({
    sort: 'featured',
    gender: '',
    category: '',
    price: 200,
  });

  const getFilteredCount = () => {
    let result = [...products];
    if (localFilters.sort === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (localFilters.sort === 'price-high') result.sort((a, b) => b.price - a.price);
    
    if (localFilters.gender) {
      result = result.filter(p => p.title.toLowerCase().includes(localFilters.gender.toLowerCase()));
    }
    if (localFilters.category) {
      result = result.filter(p => p.category.toLowerCase() === localFilters.category.toLowerCase());
    }
    if (localFilters.price) {
      result = result.filter(p => p.price <= parseInt(localFilters.price));
    }
    return result.length;
  };

  const filteredCount = getFilteredCount();
  const activeFilterCount = Object.values(localFilters).filter(v => v !== '' && v !== 'featured' && v !== 200).length;

  const handleChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearAll = () => {
    setLocalFilters({ sort: 'featured', gender: '', category: '', price: 200 });
    onClear();
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const categories = ['Clothing', 'Shoes', 'Accessories'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 transition-opacity duration-300" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white rounded-t-2xl shadow-2xl transform transition-transform duration-300 flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          {activeFilterCount > 0 && (
            <button onClick={handleClearAll} className="text-sm font-medium text-gray-500 hover:text-black underline transition">
              Clear all
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 pb-24">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Sort By</p>
            <select 
              value={localFilters.sort} 
              onChange={(e) => handleChange('sort', e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:outline-none focus:border-black transition"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Gender</p>
            <div className="flex flex-wrap gap-3">
              {['Men', 'Women', 'Unisex'].map((g) => (
                <label key={g} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={localFilters.gender === g}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-4 h-4 accent-black focus:ring-black"
                  />
                  {g}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Category</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => {
                const isSelected = localFilters.category === c;
                return (
                  <button
                    key={c}
                    onClick={() => handleChange('category', isSelected ? '' : c)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition border ${
                      isSelected 
                        ? 'bg-black text-white border-black' 
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {isSelected && '✓ '}{c}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Price</p>
            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max="200"
                value={localFilters.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>$0</span>
                <span className="font-medium text-black">Max: ${localFilters.price}</span>
                <span>$200+</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 rounded-b-2xl">
          <button 
            onClick={handleApply}
            className="w-full py-3.5 bg-black text-white text-base font-semibold rounded-lg hover:bg-gray-900 transition"
          >
            Show {filteredCount} Products
          </button>
        </div>

      </div>
    </div>
  );
}