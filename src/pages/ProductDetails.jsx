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
  
  // 🟢 FIX: Agar product null hai, toh niche ka code run hi nahi hoga
  if (!product) return <div className="text-center py-20 text-xl text-gray-600">Product not found!</div>;

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p._id !== product._id)
    .slice(0, 8);

  const handleAddToCart = () => {
    if (!product.inStock) { showToast("Sorry, this item is out of stock!", "error"); return; }
    if (!selectedSize) { showToast("Please select a size!", "error"); return; }
    addToCart({ ...product, id: product._id, size: selectedSize, image: product.images?.[0] || product.imageUrl });
    showToast(`${product.title} (Size: ${selectedSize}) added to cart!`, 'success');
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation(); 
    if (!user) { showToast("Please login to add to wishlist", "error"); return; }
    if (isInWishlist(product._id)) removeFromWishlist(product._id);
    else addToWishlist(product._id);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { showToast("Please login to write a review", "error"); return; }
    if (!newReview.user || !newReview.comment) { showToast("Please fill in your name and comment.", "error"); return; }
    try {
      await axiosClient.post('/api/reviews', { user: user.id, product: product._id, rating: newReview.rating, comment: newReview.comment });
      setNewReview({ user: '', comment: '', rating: 5 });
      fetchReviews();
      showToast("Review submitted successfully!", "success");
    } catch (error) { showToast("Failed to submit review. Try again.", "error"); }
  };

  const renderStars = (rating) => Array.from({ length: 5 }, (_, i) => <span key={i} className={i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"}>★</span>);

  // 🟢 FIX: product null nahi hai, toh ab images safely access kar sakte hain
  const images = product.images?.length > 0 ? product.images : [product.imageUrl || 'https://placehold.co/600x600/333/fff?text=Product+Image'];

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Mobile Section */}
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
            {images.map((_, idx) => <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-colors ${mainImageIndex === idx ? 'bg-gray-900' : 'bg-gray-400'}`} />)}
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
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-gray-900">SELECT SIZE</h3>
              <button onClick={() => alert('Size chart is coming soon!')} className="text-xs text-gray-500 underline hover:text-black transition cursor-pointer">Size Chart</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {['S', 'M', 'L', 'XL'].map((size) => (
                <button key={size} onClick={() => setSelectedSize(size)} className={`w-12 h-12 rounded-full border text-sm font-medium transition ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-300 text-gray-700 hover:border-black'}`}>{size}</button>
              ))}
            </div>
          </div>
          <div className="mt-6">
            {!product.inStock ? (
              <div className="w-full bg-red-50 text-red-600 py-3 rounded text-center font-bold text-sm border border-red-200">Out of Stock</div>
            ) : (
              <div className="flex gap-3">
                <button onClick={handleAddToCart} className="flex-1 bg-black text-white py-4 rounded-md font-bold text-sm tracking-wide hover:bg-gray-800 transition">ADD TO BAG</button>
                <button onClick={handleWishlistToggle} className="w-14 h-14 border border-gray-200 rounded-md flex items-center justify-center text-gray-700 hover:bg-gray-50 transition">
                  <svg className={`w-6 h-6 ${isInWishlist(product._id) ? 'fill-red-500 text-red-500' : 'fill-none'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="px-4 py-4 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Product Details</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
        </div>

        {/* You Might Also Like */}
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

        {/* Ratings & Reviews */}
        <div className="px-4 py-4 border-t border-gray-100 bg-gray-50">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Ratings & Reviews</h3>
          <div className="space-y-4 mb-6">
            {reviews.length === 0 ? <p className="text-gray-500 italic text-sm text-center py-4">No reviews yet. Be the first to review!</p> : reviews.map((review, index) => (
              <div key={index} className="bg-white p-3 rounded border border-gray-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-gray-800">{review.user?.name || review.user || 'Anonymous'}</span>
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
      </div>

      {/* Desktop Section */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-12 mb-12">
          <div className="flex-1 relative group">
            <div className="cursor-pointer relative overflow-hidden rounded-xl shadow-lg bg-gray-100 aspect-square" onClick={() => setIsLightboxOpen(true)}>
              <img src={product.images?.[mainImageIndex] || product.imageUrl} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={(e) => { e.target.src = 'https://placehold.co/600x600/333/fff?text=Product+Image'; }} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300 flex items-center justify-center">
                <span className="bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                </span>
              </div>
              {/* Desktop Heart Button */}
              <button type="button" onClick={handleWishlistToggle} className="absolute top-4 right-4 p-3 bg-white/80 rounded-full hover:bg-white hover:scale-110 transition duration-200 z-20 shadow-md">
                <svg className={`w-6 h-6 transition duration-200 ${isInWishlist(product._id) ? 'fill-red-500 text-red-500' : 'text-gray-700 hover:text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            {(product.images && product.images.length > 1) && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button key={idx} onClick={() => setMainImageIndex(idx)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition flex-shrink-0 ${mainImageIndex === idx ? 'border-black' : 'border-gray-200 hover:border-gray-400'}`}>
                    <img src={img} alt={`${product.title} - ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">{product.title}</h1>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-gray-700">${product.price}</span>
              <div className="flex items-center gap-1">
                <span className="text-yellow-400 text-lg">{renderStars(4.5)}</span>
                <span className="text-sm text-gray-500 ml-1">({reviews.length} reviews)</span>
              </div>
            </div>
            <div><h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 mb-2">Select Size</h3>
              <div className="flex gap-3">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <button key={size} onClick={() => setSelectedSize(size)} className={`w-12 h-12 border rounded-md font-semibold transition ${selectedSize === size ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'}`}>{size}</button>
                ))}
              </div>
            </div>
            {!product.inStock && <div className="w-full md:w-auto bg-red-100 text-red-700 px-12 py-4 rounded-full font-bold uppercase tracking-wide text-center border border-red-200">Out of Stock</div>}
            {product.inStock && <button onClick={handleAddToCart} className="w-full md:w-auto bg-black text-white px-12 py-4 rounded-full font-bold uppercase tracking-wide hover:bg-gray-800 transition shadow-lg">Add to Cart</button>}
            <Link to="/" className="block text-gray-500 hover:text-black underline mt-4">Continue Shopping</Link>
          </div>
        </div>
        {/* Desktop Reviews */}
        <section className="border-t border-gray-200 pt-10 max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
          <div className="space-y-6 mb-8">
            {reviews.map((review, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-800">{review.user?.name || review.user || 'Anonymous'}</span>
                  <span className="text-yellow-400 text-sm">{renderStars(review.rating)}</span>
                </div>
                <p className="text-gray-600 text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1"><label className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label><input type="text" value={newReview.user} onChange={(e) => setNewReview({...newReview, user: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-black" placeholder="John Doe" /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Rating</label><select value={newReview.rating} onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})} className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-black"><option value="5">5 Stars ⭐⭐⭐⭐⭐</option><option value="4">4 Stars ⭐⭐⭐⭐</option><option value="3">3 Stars ⭐⭐⭐</option><option value="2">2 Stars ⭐⭐</option><option value="1">1 Star ⭐</option></select></div>
              </div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1">Comment</label><textarea value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-black h-24 resize-none" placeholder="Tell us what you think..."></textarea></div>
              <button type="submit" className="bg-black text-white px-6 py-2 rounded font-bold hover:bg-gray-800 transition text-sm uppercase tracking-wider">Submit Review</button>
            </form>
          </div>
        </section>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setIsLightboxOpen(false)}>
          <button onClick={() => setIsLightboxOpen(false)} className="absolute top-6 right-6 text-white text-5xl font-light hover:text-gray-300 transition z-10">&times;</button>
          <button onClick={handleWishlistToggle} className="absolute top-6 left-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition z-10">
            <svg className={`w-7 h-7 ${isInWishlist(product._id) ? 'fill-red-500 text-red-500' : 'fill-none text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <img src={product.images?.[mainImageIndex] || product.imageUrl} alt={product.title} className="max-w-full max-h-[90vh] object-contain rounded-lg cursor-default shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}