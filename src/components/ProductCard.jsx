import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ id, title, price, image, rating, reviewsCount, inStock = true }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  return (
    <div className="bg-white p-4 group relative border border-transparent hover:border-gray-200 transition-all duration-300">
      
      {/* Heart Icon */}
      <button 
        onClick={() => toggleWishlist({ id, title, price, image })}
        className="absolute top-4 right-4 z-10 transition-transform hover:scale-110"
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

      {/* Title & Price */}
      <Link to={`/product/${id}`} className="block mb-2">
        <h3 className="text-sm font-bold text-gray-900 hover:underline leading-tight">{title}</h3>
      </Link>
      
      {/* Price */}
      <div className="flex items-center gap-2 text-sm font-bold">
        <span>₹{price}</span>
      </div>
    </div>
  );
}