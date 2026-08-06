import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function Wishlist() {
  const { user } = useAuth();
  const { wishlist, loading } = useWishlist();

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Please Login</h2>
        <p className="text-gray-500 mb-8">Login to view and manage your wishlist.</p>
        <Link to="/login" className="bg-black text-white px-8 py-3 rounded font-bold hover:bg-gray-800 transition">Go to Login</Link>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-20 text-gray-500 text-lg">Loading your wishlist...</div>;
  }

  return (
    <div className="p-6 md:p-10 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">My Wishlist ({wishlist.length})</h1>
      
      {wishlist.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500 mb-4">Your wishlist is empty.</p>
          <Link to="/" className="bg-black text-white px-6 py-2 rounded font-medium hover:bg-gray-800 transition">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {wishlist.map((product) => {
            // 🟢 SAFETY CHECK: Agar product invalid hai toh skip karo
            if (!product || !product._id) return null; 

            return (
              <ProductCard 
                key={product._id}
                id={product._id}
                title={product.title}
                price={product.price}
                image={product.images?.[0] || 'https://placehold.co/600x600/333/fff?text=Product+Image'}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}