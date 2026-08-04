import { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

export default function MobileFilterPanel({ isOpen, onClose, onApply }) {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-white flex flex-col md:hidden">
      {/* --- Header --- */}
      <div className="flex justify-between items-center px-4 py-4 border-b border-gray-200 shrink-0">
        <button className="text-sm font-medium text-gray-500 hover:text-black">Clear all</button>
        <h2 className="text-base font-bold text-black">Filter</h2>
        <button onClick={onClose} className="text-black p-1">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* --- Filter List (Accordion style) --- */}
      <div className="flex-1 overflow-y-auto px-4">
        {['Sort', 'Gender', 'Product Category', 'Product Type', 'Price', 'Sport', 'Fit', 'Shoe Type', 'Color'].map((item) => (
          <div key={item} className="border-b border-gray-100 py-4">
            <button 
              onClick={() => toggleSection(item)}
              className="w-full flex justify-between items-center text-sm font-medium text-black"
            >
              {item}
              {expandedSection === item ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            
            {/* Expanded content area */}
            {expandedSection === item && (
              <div className="pt-3 pb-1 text-sm text-gray-600 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" /> Option 1</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" /> Option 2</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" /> Option 3</label>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* --- Sticky Footer Button --- */}
      <div className="p-4 border-t border-gray-200 bg-white shrink-0">
        <button 
          onClick={onApply}
          className="w-full bg-black text-white py-3 rounded font-bold hover:bg-gray-800 transition"
        >
          Apply
        </button>
      </div>
    </div>
  );
}