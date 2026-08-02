import { useWishlist } from '../context/WishlistContext.jsx';
import { Link } from 'react-router-dom';

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h1>
        <p className="text-gray-600 mb-8">Save your favorite gear here!</p>
        <Link to="/" className="bg-black text-white px-8 py-3 rounded font-bold hover:bg-gray-800 transition">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 overflow-x-hidden">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {wishlist.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
            
            {/* Remove Button */}
            <button 
              onClick={() => toggleWishlist(item)}
              className="absolute top-3 right-3 z-10 p-2 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <Link to={`/product/${item.id}`}>
              <img src={item.image} alt={item.title} className="w-full h-64 object-cover" />
            </Link>
            <div className="p-4 text-center">
              <Link to={`/product/${item.id}`}>
                <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition">{item.title}</h3>
              </Link>
              <p className="text-gray-600 mt-1">${item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}