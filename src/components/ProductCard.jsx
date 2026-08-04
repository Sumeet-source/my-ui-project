import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ id, title, price, originalPrice, image, colors = [], discount, featured }) { // Added `featured` prop
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="bg-white p-4 group relative border border-transparent hover:border-gray-200 transition-all duration-300">
      
      {/* FEATURED BADGE (Matches Under Armour exactly) */}
      {featured && (
        <div className="absolute top-3 left-3 z-10 bg-black text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
          Featured
        </div>
      )}

      {/* Heart Icon */}
      <button 
        onClick={() => toggleWishlist({ id, title, price, image })}
        className="absolute top-3 right-3 z-10 transition-transform hover:scale-110"
      >
        <svg className={`w-6 h-6 transition-colors ${isInWishlist(id) ? 'fill-black' : 'fill-none stroke-black'}`} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Product Image */}
      <Link to={`/product/${id}`}>
        <div className="relative w-full aspect-square overflow-hidden bg-gray-50 mb-4 rounded-md">
          <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      </Link>

      {/* Color Swatches */}
      {colors && colors.length > 0 && (
        <div className="flex gap-1.5 mb-3">
          {colors.map((color, idx) => (
            <div key={idx} className={`w-4 h-4 rounded-full border border-gray-200 ${color === 'white' ? 'bg-white border-gray-300' : `bg-[${color}]`}`}></div>
          ))}
          {colors.length > 2 && <span className="text-xs text-gray-400 mt-0.5">+{colors.length - 2} More</span>}
        </div>
      )}

      {/* Title & Price */}
      <Link to={`/product/${id}`} className="block mb-2">
        <h3 className="text-sm font-bold text-gray-900 hover:underline leading-tight">{title}</h3>
      </Link>
      
      <div className="flex items-center gap-2 text-sm">
        {originalPrice && discount ? (
          <>
            <span className="text-red-600 font-bold">₹{originalPrice - discount}</span>
            <span className="text-gray-400 line-through text-xs">₹{originalPrice}</span>
            <span className="text-green-600 text-xs font-bold">{discount}% Off</span>
          </>
        ) : (
          <span className="font-bold">₹{price}</span>
        )}
      </div>
    </div>
  );
}