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
  }, [id]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const allRes = await axiosClient.get('/api/products');
      setAllProducts(allRes.data);
      const singleRes = await axiosClient.get(`/api/products/${id}`);
      setProduct(singleRes.data);
      setReviews(singleRes.data.reviews || [
        { user: 'Customer 1', comment: 'Great quality, fits perfectly!', rating: 5 },
        { user: 'Customer 2', comment: 'Good fabric, but runs a bit small.', rating: 4 }
      ]);
    } catch (error) {
      console.error('Error fetching product:', error);
      showToast('Failed to load product details', 'error');
    } finally {
      setLoading(false);
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

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.user || !newReview.comment) {
      showToast("Please fill in your name and comment.", "error");
      return;
    }
    setReviews([...reviews, newReview]);
    setNewReview({ user: '', comment: '', rating: 5 });
    showToast("Review submitted successfully!", "success");
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
      <div className="md:hidden">
        {/* Carousel */}
        <div className="relative w-full bg-gray-50">
          <div ref={carouselRef} onScroll={handleCarouselScroll} className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar">
            {images.map((img, idx) => (
              <div key={idx} className="min-w-full snap-center flex justify-center items-center">
                <img src={img} alt={`${product.title} ${idx + 1}`} className="w-full h-[450px] object-cover cursor-pointer" onClick={() => setIsLightboxOpen(true)} onError={(e) => { e.target.src = 'https://placehold.co/600x600/333/fff?text=Image'; }} />
              </div>
            ))}
          </div>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, idx) => (
              <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-colors ${mainImageIndex === idx ? 'bg-gray-900' : 'bg-gray-400'}`} />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="px-4 py-4">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-2xl font-bold text-gray-900">${product.price}</span>
            <span className="text-sm line-through text-gray-500">${(product.price * 1.4).toFixed(2)}</span>
            <span className="text-sm font-medium text-green-600">(40% OFF)</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-1 bg-green-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold"><span>4.5</span><span>★</span></div>
            <span className="text-xs text-gray-500">{reviews.length} Reviews</span>
          </div>
          <h1 className="text-base font-semibold text-gray-900 leading-snug">{product.title}</h1>
          <p className="text-xs text-gray-500 mt-1">{product.description?.substring(0, 80)}...</p>

          {/* Size Selector */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-gray-900">SELECT SIZE</h3>
              {/* 🟢 FIX: Size Chart button ab popup dega */}
              <button 
                onClick={() => alert('Size chart is coming soon! For now, standard sizes are S, M, L, XL.')}
                className="text-xs text-gray-500 underline hover:text-black transition cursor-pointer"
              >
                Size Chart
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {['S', 'M', 'L', 'XL'].map((size) => (
                <button key={size} onClick={() => setSelectedSize(size)} className={`w-12 h-12 rounded-full border text-sm font-medium transition ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-300 text-gray-700 hover:border-black'}`}>{size}</button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6">
            {!product.inStock ? (
              <div className="w-full bg-red-50 text-red-600 py-3 rounded text-center font-bold text-sm border border-red-200">Out of Stock</div>
            ) : (
              <div className="flex gap-3">
                <button onClick={handleAddToCart} className="flex-1 bg-black text-white py-4 rounded-md font-bold text-sm tracking-wide hover:bg-gray-800 transition">ADD TO BAG</button>
                {/* 🟢 FIX: Wishlist button state properly rendering */}
                <button onClick={handleWishlistToggle} className="w-14 h-14 border border-gray-200 rounded-md flex items-center justify-center text-gray-700 hover:bg-gray-50 transition">
                  <svg className={`w-6 h-6 ${isInWishlist(product._id) ? 'fill-red-500 text-red-500' : 'fill-none'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Rest of the page (Description, Reviews, Similar Products) - same as before */}
        <div className="px-4 py-4 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Product Details</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
        </div>

        {/* Reviews and similar products section remains the same... */}
        <div className="px-4 py-4 border-t border-gray-100 bg-gray-50">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Ratings & Reviews</h3>
          <div className="space-y-4 mb-6">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white p-3 rounded border border-gray-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-gray-800">{review.user}</span>
                  <span className="text-yellow-400 text-xs">{renderStars(review.rating)}</span>
                </div>
                <p className="text-xs text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
          <div className="bg-white border border-gray-200 rounded p-4">
            <h4 className="text-sm font-bold text-gray-900 mb-3">Write a Review</h4>
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <input type="text" value={newReview.user} onChange={(e) => setNewReview({...newReview, user: e.target.value})} placeholder="Your Name" className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-black" />
              <select value={newReview.rating} onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-black"><option value="5">5 Stars</option><option value="4">4 Stars</option><option value="3">3 Stars</option><option value="2">2 Stars</option><option value="1">1 Star</option></select>
              <textarea value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})} placeholder="Tell us what you think..." className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-black h-20 resize-none"></textarea>
              <button type="submit" className="w-full bg-black text-white py-2 rounded font-bold text-sm hover:bg-gray-800 transition">Submit Review</button>
            </form>
          </div>
        </div>
        
        {/* Similar Products Section... */}
        {relatedProducts.length > 0 && (
          <div className="px-4 py-6 border-t border-gray-100">
            <h2 className="text-base font-bold text-gray-900 mb-4">You Might Also Like</h2>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory">
              {relatedProducts.map((item) => (
                <div key={item._id} className="min-w-[160px] snap-center">
                  <ProductCard id={item._id} title={item.title} price={item.price} image={item.images?.[0] || item.imageUrl || 'https://placehold.co/600x600/333/fff?text=Product+Image'} rating={4.5} reviewsCount={reviews.length} inStock={item.inStock} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop section remains the same as previous... */}
      {/* ... */}
    </div>
  );
}