import { useState } from 'react';

const FilterSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="border-b border-gray-200 py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex justify-between w-full text-sm font-semibold text-gray-900 mb-2"
      >
        {title}
        <span className="text-gray-400">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && <div className="space-y-2 text-sm text-gray-600">{children}</div>}
    </div>
  );
};

export default function FilterSidebar() {
  return (
    <div className="w-full lg:w-64 shrink-0 pr-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-base">Filter</h3>
        <button className="text-xs text-gray-500 hover:underline">Clear all</button>
      </div>

      <FilterSection title="Gender">
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" /> Men</label>
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" /> Women</label>
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" /> Unisex</label>
      </FilterSection>

      <FilterSection title="Product Category">
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" /> Tops</label>
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" /> Bottoms</label>
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" /> Shoes</label>
      </FilterSection>

      <FilterSection title="Price">
        <div className="pt-2">
          <input type="range" min="0" max="50000" className="w-full h-1 bg-gray-300 rounded appearance-none cursor-pointer" />
          <div className="flex justify-between text-xs text-gray-500 mt-1"><span>₹0</span><span>₹50,000+</span></div>
        </div>
      </FilterSection>

      <FilterSection title="Sport">
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" /> Running</label>
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" /> Basketball</label>
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" /> Training</label>
      </FilterSection>
    </div>
  );
}