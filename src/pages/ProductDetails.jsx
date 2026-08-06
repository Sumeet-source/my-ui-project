import { useParams, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import axiosClient from '../api/axiosClient';
import ProductCard from '../components/ProductCard';

export default function ProductDetails() {
  const { id } = useParams();

  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const carouselRef = useRef(null);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ user: '', comment: '', rating: 5 });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProductData();
    fetchReviews();
  }, [id]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const allRes = await axiosClient.get('/api/products');
      setAllProducts(allRes.data);

      const singleRes = await axiosClient.get(`/api/products/${id}`);
      if (!singleRes.data || Object.keys(singleRes.data).length === 0) {
        setProduct(null);
      } else {
        setProduct(singleRes.data);
      }
    } catch (error) {
      console.error('❌ Error fetching product:', error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axiosClient.get(`/api/reviews/product/${id}`);
      setReviews(res.data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
      setReviews([]);
    }
  };

  const handleCarouselScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const width = carouselRef.current.clientWidth;
      const index = Math.round(scrollLeft / width);
      setMainImageIndex(index);
    }
  };

  if (loading) return <div className="text-center py-20 text-lg text-gray-500">Loading product...</div>;
  if (!product) return <div className="text-center py-20 text-xl text-gray-600">Product not found!</div>;

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p._id !== product._id)
    .slice(0, 8);

  const handleAddToCart = () => {
    if (!product.inStock) {
      showToast("Sorry, this item is out of stock!", "error");
      return;
    }
    if (!selectedSize) {
      showToast("Please select a size!", "error");
      return;
    }
    addToCart({ 
      ...product, 
      id: product._id, 
      size: selectedSize, 
      image: product.images?.[0] || product.imageUrl || 'https://placehold.co/600x600/333/fff?text=Product+Image' 
    });
    showToast(`${product.title} (Size: ${selectedSize}) added to cart!`, 'success');
  };

  const handleWishlistToggle = () => {
    if (!user) {
      showToast("Please login to add to wishlist", "error");
      return;
    }
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast("Please login to write a review", "error");
      return;
    }
    if (!newReview.user || !newReview.comment) {
      showToast("Please fill in your name and comment.", "error");
      return;
    }

    try {
      const reviewData = {
        user: user.id,
        product: product._id,
        rating: newReview.rating,
        comment: newReview.comment
      };
      await axiosClient.post('/api/reviews', reviewData);
      setNewReview({ user: '', comment: '', rating: 5 });
      fetchReviews();
      showToast("Review submitted successfully!", "success");
    } catch (error) {
      console.error("Review error:", error);
      showToast("Failed to submit review. Try again.", "error");
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  const images = product.images?.length > 0 ? product.images : [product.imageUrl || 'https://placehold.co/600x600/333/fff?text=Product+Image'];

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* (Baki saara JSX bilkul waisa hi hai, maine pichle response mein pura code diya tha. Wahi use karo. Isme maine sirf fetchProductData ka logic fix kiya hai). */}
      {/* User ko JSX part repeat karne se bachane ke liye main yahin rok raha hoon, pichli baar diya gaya code hi use karein, bas backend ka fix lagayein. */}
    </div>
  );
}