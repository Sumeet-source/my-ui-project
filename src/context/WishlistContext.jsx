import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import axiosClient from '../api/axiosClient';
import { useToast } from './ToastContext.jsx';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch wishlist from backend whenever user changes
  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/api/wishlist?userId=${user.id}`);
      // Backend se 'products' array aata hai, usko set karo
      setWishlist(res.data.products || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add to Wishlist
  const addToWishlist = async (productId) => {
    try {
      await axiosClient.post('/api/wishlist', { userId: user.id, productId });
      // UI ko turant update karne ke liye optimistic update
      setWishlist((prev) => [...prev, { _id: productId }]);
      showToast('Added to wishlist!', 'success');
      fetchWishlist(); // Backend se confirm kar lo
    } catch (error) {
      showToast('Failed to add to wishlist', 'error');
    }
  };

  // Remove from Wishlist
  const removeFromWishlist = async (productId) => {
    try {
      await axiosClient.delete(`/api/wishlist/${productId}?userId=${user.id}`);
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
      showToast('Removed from wishlist', 'info');
    } catch (error) {
      showToast('Failed to remove from wishlist', 'error');
    }
  };

  // Check if product is in wishlist (compare via MongoDB '_id')
  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}