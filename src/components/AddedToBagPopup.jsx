// src/components/AddedToBagPopup.jsx
import { Link } from 'react-router-dom';
import { CheckCircle, X } from 'lucide-react';

export default function AddedToBagPopup({ isOpen, closePopup, productData }) {
  if (!isOpen || !productData) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] flex justify-center pointer-events-none">
      {/* Popup Container - Slide up animation */}
      <div 
        className={`bg-white w-full max-w-md md:max-w-lg rounded-t-2xl shadow-2xl p-6 pointer-events-auto transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-bold text-gray-900 text-lg">Added to Bag</span>
          </div>
          <button onClick={closePopup} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Product Details Block */}
        <div className="flex gap-4 mb-4">
          <img 
            src={productData.image} 
            alt={productData.title} 
            className="w-20 h-20 object-cover rounded border border-gray-100" 
          />
          <div className="flex flex-col gap-1 justify-center">
            <p className="font-bold text-gray-900 text-sm">{productData.title}</p>
            <p className="text-gray-500 text-sm">Size: {productData.size}</p>
            <p className="font-bold text-gray-900 text-sm">${productData.price}</p>
          </div>
        </div>

        {/* Footer Taxes & Button */}
        <p className="text-xs text-gray-500 mb-4">Inclusive of all taxes</p>
        <Link 
          to="/cart" 
          onClick={closePopup} 
          className="block w-full bg-black text-white text-center py-3 rounded-full font-bold text-sm hover:bg-gray-800 transition-colors"
        >
          View Bag
        </Link>
      </div>
    </div>
  );
}