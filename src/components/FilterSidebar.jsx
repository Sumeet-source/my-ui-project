export default function FilterSidebar({ filters = { gender: [], category: [] }, setFilters }) {
  const handleCheckbox = (key, value) => {
    setFilters((prev) => {
      // Safety check if prev is somehow undefined
      const safePrev = prev || { gender: [], category: [] };
      const currentList = safePrev[key] || [];
      const newList = currentList.includes(value)
        ? currentList.filter((item) => item !== value)
        : [...currentList, value];
      return { ...safePrev, [key]: newList };
    });
  };

  return (
    <div className="w-full lg:w-64 shrink-0 pr-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-base">Filter</h3>
        <button onClick={() => setFilters({ gender: [], category: [] })} className="text-xs text-gray-500 hover:underline">Clear all</button>
      </div>

      <div className="border-b border-gray-200 py-4">
        <h4 className="font-semibold text-sm text-gray-900 mb-2">Gender</h4>
        <div className="space-y-1">
          {/* Custom Mobile-Friendly Checkbox for Men */}
          <button onClick={() => handleCheckbox('gender', 'men')} className="flex items-center gap-2 cursor-pointer w-full py-1 hover:bg-gray-50 px-2 rounded transition-colors">
            <div className={`w-5 h-5 border rounded flex-shrink-0 flex items-center justify-center transition-colors ${filters.gender?.includes('men') ? 'bg-black border-black' : 'border-gray-300 bg-white'}`}>
              {filters.gender?.includes('men') && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
            </div>
            <span className="text-sm text-gray-700 select-none">Men</span>
          </button>
          {/* Custom Mobile-Friendly Checkbox for Women */}
          <button onClick={() => handleCheckbox('gender', 'women')} className="flex items-center gap-2 cursor-pointer w-full py-1 hover:bg-gray-50 px-2 rounded transition-colors">
            <div className={`w-5 h-5 border rounded flex-shrink-0 flex items-center justify-center transition-colors ${filters.gender?.includes('women') ? 'bg-black border-black' : 'border-gray-300 bg-white'}`}>
              {filters.gender?.includes('women') && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
            </div>
            <span className="text-sm text-gray-700 select-none">Women</span>
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200 py-4">
        <h4 className="font-semibold text-sm text-gray-900 mb-2">Product Category</h4>
        <div className="space-y-1">
          {/* Custom Mobile-Friendly Checkbox for Outerwear */}
          <button onClick={() => handleCheckbox('category', 'outerwear')} className="flex items-center gap-2 cursor-pointer w-full py-1 hover:bg-gray-50 px-2 rounded transition-colors">
            <div className={`w-5 h-5 border rounded flex-shrink-0 flex items-center justify-center transition-colors ${filters.category?.includes('outerwear') ? 'bg-black border-black' : 'border-gray-300 bg-white'}`}>
              {filters.category?.includes('outerwear') && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
            </div>
            <span className="text-sm text-gray-700 select-none">Outerwear</span>
          </button>
          {/* Custom Mobile-Friendly Checkbox for Footwear */}
          <button onClick={() => handleCheckbox('category', 'footwear')} className="flex items-center gap-2 cursor-pointer w-full py-1 hover:bg-gray-50 px-2 rounded transition-colors">
            <div className={`w-5 h-5 border rounded flex-shrink-0 flex items-center justify-center transition-colors ${filters.category?.includes('footwear') ? 'bg-black border-black' : 'border-gray-300 bg-white'}`}>
              {filters.category?.includes('footwear') && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
            </div>
            <span className="text-sm text-gray-700 select-none">Footwear</span>
          </button>
        </div>
      </div>
    </div>
  );
}