import { useState } from 'react';

const CATEGORIES = {
  Clothing: ['T-Shirts', 'Polos', 'Shirts', 'Jeans', 'Trousers', 'Jackets', 'Sweatshirts', 'Hoodies', 'Shorts', 'Track Pants'],
  Shoes: ['Sneakers', 'Running Shoes', 'Casual Shoes', 'Formal Shoes', 'Loafers', 'Boots', 'Sandals'],
  Accessories: ['Watches', 'Sunglasses', 'Belts', 'Wallets', 'Caps & Hats', 'Backpacks', 'Socks', 'Ties', 'Cufflinks']
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
  // 🟢 Check karo ki defaultCategory CATEGORIES list mein hai ya nahi (jaise 'Shoes' ya 'Clothing')
  const isDefaultCategoryValid = defaultCategory && CATEGORIES[defaultCategory];

  const [localFilters, setLocalFilters] = useState({
    sort: 'featured',
    category: isDefaultCategoryValid ? defaultCategory : '', // Agar valid hai toh set kar do
    subCategory: '',
    price: 200,
  });

  const getFilteredCount = () => {
    let result = [...products];
    if (localFilters.sort === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (localFilters.sort === 'price-high') result.sort((a, b) => b.price - a.price);
    
    // 🟢 FILTER LOGIC FIXED
    if (isDefaultCategoryValid) {
        // Shoes page logic: Sirf subCategory filter karega
        if (localFilters.subCategory) {
            result = result.filter(p => p.subCategory?.toLowerCase() === localFilters.subCategory.toLowerCase());
        }
    } else {
        // Men/Women/Home page logic: Category aur SubCategory dono filter karega
        if (localFilters.category) {
            result = result.filter(p => p.category.toLowerCase() === localFilters.category.toLowerCase());
            if (localFilters.subCategory) {
                result = result.filter(p => p.subCategory?.toLowerCase() === localFilters.subCategory.toLowerCase());
            }
        }
    }

    if (localFilters.price) {
      result = result.filter(p => p.price <= parseInt(localFilters.price));
    }
    return result.length;
  };

  const filteredCount = getFilteredCount();
  const activeFilterCount = Object.values(localFilters).filter(v => v !== '' && v !== 'featured' && v !== 200).length;

  const handleChange = (key, value) => {
    if (key === 'category') {
      setLocalFilters(prev => ({ ...prev, category: value, subCategory: '' }));
    } else {
      setLocalFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleClearAll = () => {
    // 🟢 Clear karte waqt defaultCategory preserve rakhein
    setLocalFilters({ 
      sort: 'featured', 
      category: isDefaultCategoryValid ? defaultCategory : '', 
      subCategory: '', 
      price: 200 
    });
    onClear();
  };

  const handleApply = () => {
    let finalFilters = { ...localFilters };
    
    if (isDefaultCategoryValid) {
      // 🟢 Shoes page: backend ko sirf Shoes aur uski SubCategory bhejega
      finalFilters = {
        category: defaultCategory,
        subCategory: localFilters.subCategory,
        sort: localFilters.sort,
        price: localFilters.price
      };
    } else {
      // 🟢 Men/Women page: backend ko poori Category aur SubCategory bhejega
      finalFilters = localFilters;
    }
    
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

          {/* 🟢 MAIN CATEGORY BUTTONS: Sirf tab dikhenge jab /shoes page par nahi ho */}
          {!isDefaultCategoryValid && (
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

          {/* 🟢 SUB-CATEGORY LOGIC: Correctly decide karega ki kiske sub-categories dikhane hain */}
          {((!isDefaultCategoryValid && localFilters.category && CATEGORIES[localFilters.category]) || (isDefaultCategoryValid && CATEGORIES[defaultCategory])) && (
            <div className="space-y-2 mt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {isDefaultCategoryValid ? `${defaultCategory} Sub-Categories` : 'Sub-Category (Optional)'}
              </p>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {/* Agar Shoes page hai toh wahi dikhao, warna selected category wali dikhao */}
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
              <input type="range" min="0" max="200" value={localFilters.price} onChange={(e) => handleChange('price', e.target.value)} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>$0</span>
                <span className="font-medium text-black">Max: ${localFilters.price}</span>
                <span>$200+</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 rounded-b-2xl">
          <button onClick={handleApply} className="w-full py-3.5 bg-black text-white text-base font-semibold rounded-lg hover:bg-gray-900 transition">
            Show {filteredCount} Products
          </button>
        </div>
      </div>
    </div>
  );
}