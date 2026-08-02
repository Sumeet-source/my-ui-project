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
        <button onClick={() => setFilters({})} className="text-xs text-gray-500 hover:underline">Clear all</button>
      </div>

      <div className="border-b border-gray-200 py-4">
        <h4 className="font-semibold text-sm text-gray-900 mb-2">Gender</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={filters.gender?.includes('men')} onChange={() => handleCheckbox('gender', 'men')} /> Men
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={filters.gender?.includes('women')} onChange={() => handleCheckbox('gender', 'women')} /> Women
          </label>
        </div>
      </div>

      <div className="border-b border-gray-200 py-4">
        <h4 className="font-semibold text-sm text-gray-900 mb-2">Product Category</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={filters.category?.includes('outerwear')} onChange={() => handleCheckbox('category', 'outerwear')} /> Outerwear
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={filters.category?.includes('footwear')} onChange={() => handleCheckbox('category', 'footwear')} /> Footwear
          </label>
        </div>
      </div>
    </div>
  );
}