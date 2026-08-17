import { useState } from 'react';

const CATEGORIES = {
  Men: ['T-Shirt', 'Polo', 'Shirt', 'Jean', 'Trouser', 'Jacket', 'Sweatshirt', 'Hoodie', 'Short', 'Track Pant'],
  Women: ['T-Shirt', 'Top', 'Dress', 'Jean', 'Trouser', 'Jacket', 'Sweatshirt', 'Hoodie', 'Short', 'Legging'],
  Shoes: ['Sneaker', 'Running Shoe', 'Casual Shoe', 'Formal Shoe', 'Loafer', 'Boot', 'Sandal'],
  Accessories: ['Watch', 'Sunglass', 'Belt', 'Wallet', 'Cap & Hat', 'Backpack', 'Sock', 'Tie', 'Cufflink'],
  // 🟢 NEW: Outlet ab Men/Women/Shoes sab ki sub-categories dikhayega
  Outlet: [
    'T-Shirt', 'Polo', 'Shirt', 'Jean', 'Trouser', 'Jacket', 
    'Sweatshirt', 'Hoodie', 'Short', 'Track Pant',
    'Top', 'Dress', 'Legging',
    'Sneaker', 'Running Shoe', 'Casual Shoe', 'Formal Shoe', 'Loafer', 'Boot', 'Sandal',
    'Watch', 'Sunglass', 'Belt', 'Wallet', 'Cap & Hat', 'Backpack', 'Sock', 'Tie', 'Cufflink'
  ]
};

export default function FilterBottomSheet({ 
  isOpen, 
  onClose, 
  onApply, 
  onClear, 
  products, 
  defaultCategory = '',
  totalCount = 0 
}) {
  const isDefaultCategoryValid = defaultCategory && CATEGORIES[defaultCategory];

  const [localFilters, setLocalFilters] = useState({
    sort: 'featured',
    category: isDefaultCategoryValid ? defaultCategory : '', 
    subCategory: '',
    maxPrice: 20000, 
  });

  const getFilteredCount = () => {
    let result = [...products];

    if (localFilters.category) {
      result = result.filter(p => p.category === localFilters.category);
    }

    if (localFilters.subCategory) {
      result = result.filter(p => p.subCategory === localFilters.subCategory);
    }

    if (localFilters.maxPrice < 20000) {
      result = result.filter(p => p.price <= parseInt(localFilters.maxPrice));
    }

    return result.length;
  };

  const filteredCount = getFilteredCount();
  const activeFilterCount = Object.values(localFilters).filter(v => v !== '' && v !== 'featured' && v !== 20000).length;

  const handleChange = (key, value) => {
    if (key === 'category') {
      setLocalFilters(prev => ({ ...prev, category: value, subCategory: '' }));
    } else {
      setLocalFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleClearAll = () => {
    setLocalFilters({ 
      sort: 'featured', 
      category: isDefaultCategoryValid ? defaultCategory : '', 
      subCategory: '', 
      maxPrice: 20000 
    });
    onClear();
  };

  const handleApply = () => {
    const sortMap = {
      'price-low': 'price_asc',
      'price-high': 'price_desc',
      'newest': 'newest',
      'featured': 'featured',
    };

    const finalFilters = {
      category: isDefaultCategoryValid ? defaultCategory : localFilters.category,
      subCategory: localFilters.subCategory,
      sort: sortMap[localFilters.sort] || 'featured',
      maxPrice: localFilters.maxPrice < 20000 ? localFilters.maxPrice : undefined,
    };

    onApply(finalFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 transition-opacity duration-300" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white rounded-t-2xl shadow-2xl transform transition-transform duration-300 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          {activeFilterCount > 0 && (
            <button onClick={handleClearAll} className="text-sm font-medium text-gray-500 hover:text-black underline transition">Clear all</button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 pb-24">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Sort By</p>
            <select value={localFilters.sort} onChange={(e) => handleChange('sort', e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:outline-none focus:border-black transition">
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* 🟢 FIX: Agar defaultCategory 'Outlet' hai, toh Category dropdown mat dikhao */}
          {!isDefaultCategoryValid && defaultCategory !== 'Outlet' && (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Category</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {Object.keys(CATEGORIES).map((mainCat) => {
                  const isSelected = localFilters.category === mainCat;
                  return (
                    <button key={mainCat} onClick={() => handleChange('category', isSelected ? '' : mainCat)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition border ${isSelected ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}>
                      {isSelected && '✓ '}{mainCat}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* 🟢 Outlet ke liye Sub-Category direct dikhao */}
          {isDefaultCategoryValid && defaultCategory === 'Outlet' && (
            <div className="space-y-2 mt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Sub-Category (For Outlet)</p>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.Shoes.map((sub) => {
                    const isSelected = localFilters.subCategory === sub;
                    return (
                      <button key={sub} onClick={() => handleChange('subCategory', isSelected ? '' : sub)} className={`px-3 py-1 rounded-full text-xs font-medium transition border ${isSelected ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}>
                        {isSelected && '✓ '}{sub}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 🟢 Baaki pages ke liye normal Sub-Category display */}
          {((!isDefaultCategoryValid && localFilters.category && CATEGORIES[localFilters.category]) || (isDefaultCategoryValid && defaultCategory !== 'Outlet' && CATEGORIES[defaultCategory])) && (
            <div className="space-y-2 mt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {isDefaultCategoryValid ? `${defaultCategory} Sub-Categories` : 'Sub-Category (Optional)'}
              </p>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {(isDefaultCategoryValid ? CATEGORIES[defaultCategory] : CATEGORIES[localFilters.category]).map((sub) => {
                    const isSelected = localFilters.subCategory === sub;
                    return (
                      <button key={sub} onClick={() => handleChange('subCategory', isSelected ? '' : sub)} className={`px-3 py-1 rounded-full text-xs font-medium transition border ${isSelected ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}>
                        {isSelected && '✓ '}{sub}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Price</p>
            <div className="space-y-4">
              <input type="range" min="0" max="20000" value={localFilters.maxPrice} onChange={(e) => handleChange('maxPrice', Number(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>₹0</span>
                <span className="font-medium text-black">Max: ₹{localFilters.maxPrice}</span>
                <span>₹20000+</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 rounded-b-2xl">
          <button onClick={handleApply} className="w-full py-3.5 bg-black text-white text-base font-semibold rounded-lg hover:bg-gray-900 transition">
            Show {filteredCount} of {totalCount} Products
          </button>
        </div>
      </div>
    </div>
  );
}