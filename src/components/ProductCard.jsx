import { useNavigate } from 'react-router-dom'; // 🟢 Import navigate
import { useWishlist } from '../context/WishlistContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function ProductCard({ id, title, price, image, badge }) {
  const navigate = useNavigate(); // 🟢 Hook initialize kiya
  const { user } = useAuth();
  const { showToast } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const isLiked = isInWishlist(id);

  const handleWishlistToggle = (e) => {
    e.stopPropagation(); // 🟢 Parent div ke click ko rokega

    if (!id) {
      showToast('Invalid product ID. Please refresh the page.', 'error');
      return;
    }

    if (!user) {
      showToast('Please login to save items to wishlist', 'error');
      return;
    }
    
    if (isLiked) {
      removeFromWishlist(id);
    } else {
      addToWishlist(id);
    }
  };

  // Card click par product details page par le jayega
  const handleCardClick = () => {
    if (id) {
      navigate(`/product/${id}`);
    }
  };

  return (
    <div onClick={handleCardClick} className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
        <img 
          src={image || 'https://placehold.co/600x600/333/fff?text=Product+Image'} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
          onError={(e) => { e.target.src = 'https://placehold.co/600x600/333/fff?text=Product+Image'; }} 
        />
        
        {/* 🟢 Heart Button - Click hone par sirf wishlist toggle hoga, page open nahi hoga */}
        <button 
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white hover:scale-110 transition duration-200 z-30 shadow-sm"
        >
          <svg className={`w-5 h-5 transition duration-200 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700 hover:text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        
        {badge && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">${price}</p>
      </div>
    </div>
  );
}