import { useParams, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import axiosClient from '../api/axiosClient';
import ProductCard from '../components/ProductCard';
import { Truck, RotateCcw, X } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart, openAddedToBag } = useCart(); 
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
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  // 🟢 STATES FOR PINCODE CHECK
  const [pincodeInput, setPincodeInput] = useState('');
  const [deliveryAvailable, setDeliveryAvailable] = useState(null);
  const [checkingPincode, setCheckingPincode] = useState(false);

  // 🟢 STATES FOR POPUP MODALS
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProductData();
    fetchReviews();
  }, [id]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const allRes = await axiosClient.get('/api/products');
      
      let allData = allRes.data;
      if (Array.isArray(allData)) {
        allData = allData;
      } else if (allData && Array.isArray(allData.products)) {
        allData = allData.products;
      } else if (allData && Array.isArray(allData.data)) {
        allData = allData.data;
      } else {
        allData = [];
      }
      setAllProducts(allData);

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

  // 🟢 LOGIC: Exact same as Checkout page to check pincode
  const checkDeliveryAvailability = async () => {
    if (!pincodeInput || pincodeInput.length !== 6) {
      setDeliveryAvailable(null);
      return;
    }
    setCheckingPincode(true);
    try {
      const res = await axiosClient.get(`/api/delivery/check/${pincodeInput}`);
      setDeliveryAvailable(res.data.success);
    } catch (error) {
      setDeliveryAvailable(false);
    } finally {
      setCheckingPincode(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-lg text-gray-500">Loading product...</div>;
  if (!product) return <div className="text-center py-20 text-xl text-gray-600">Product not found!</div>;

  const normalize = (val) => (val || '').toString().trim().toLowerCase();
  let relatedProducts = allProducts.filter((p) => p._id !== product._id && normalize(p.category) === normalize(product.category));
  if (product.subCategory) {
    const sameSubCategory = relatedProducts.filter((p) => normalize(p.subCategory) === normalize(product.subCategory));
    if (sameSubCategory.length > 0) relatedProducts = sameSubCategory;
  }
  relatedProducts = relatedProducts.slice(0, 8);

  let fallbackCategory = product.category;
  const titleLower = product.title.toLowerCase();
  if (titleLower.includes("women's")) fallbackCategory = 'Women';
  else if (titleLower.includes("men's")) fallbackCategory = 'Men';
  else if (titleLower.includes("shoes")) fallbackCategory = 'Shoes';
  else if (titleLower.includes("accessories")) fallbackCategory = 'Accessories';

  const fallbackRelated = allProducts.filter(p => normalize(p.category) === normalize(fallbackCategory) && p._id !== product._id).slice(0, 8);
  const displayRelated = relatedProducts.length > 0 ? relatedProducts : fallbackRelated.length > 0 ? fallbackRelated : allProducts.slice(0, 8);

  const isShoeProduct = product.category === 'Shoes' || titleLower.includes('shoes');
  const clothingSizes = ['S', 'M', 'L', 'XL'];
  const shoeSizes = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'];
  const sizeOptions = isShoeProduct ? shoeSizes : clothingSizes;

  const handleAddToCart = () => {
    if (!product.inStock) { showToast("Sorry, this item is out of stock!", "error"); return; }
    if (!selectedSize) { showToast("Please select a size!", "error"); return; }
    
    addToCart({ ...product, id: product._id, size: selectedSize, image: product.images?.[0] || product.imageUrl });
    openAddedToBag({ 
      title: product.title, 
      price: product.price, 
      size: selectedSize, 
      image: product.images?.[0] || product.imageUrl 
    });
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
  const images = product.images?.length > 0 ? product.images : [product.imageUrl || 'https://placehold.co/600x600/333/fff?text=Product+Image'];

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {isSizeChartOpen && ( /* Size Chart Modal */
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsSizeChartOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl">&times;</button>
            <h2 className="text-xl font-bold mb-4 text-center">Shoe Size Guide</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-center border-collapse">
                <thead><tr className="bg-gray-100"><th className="p-2 border border-gray-200">UK</th><th className="p-2 border border-gray-200">US</th><th className="p-2 border border-gray-200">EU</th><th className="p-2 border border-gray-200">Foot Length (CM)</th></tr></thead>
                <tbody>
                  <tr><td className="p-2 border border-gray-200">6</td><td className="p-2 border border-gray-200">7</td><td className="p-2 border border-gray-200">40</td><td className="p-2 border border-gray-200">25.0</td></tr>
                  <tr><td className="p-2 border border-gray-200">7</td><td className="p-2 border border-gray-200">8</td><td className="p-2 border border-gray-200">41</td><td className="p-2 border border-gray-200">25.5</td></tr>
                  <tr><td className="p-2 border border-gray-200">8</td><td className="p-2 border border-gray-200">9</td><td className="p-2 border border-gray-200">42</td><td className="p-2 border border-gray-200">26.0</td></tr>
                  <tr><td className="p-2 border border-gray-200">9</td><td className="p-2 border border-gray-200">10</td><td className="p-2 border border-gray-200">43</td><td className="p-2 border border-gray-200">26.5</td></tr>
                  <tr><td className="p-2 border border-gray-200">10</td><td className="p-2 border border-gray-200">11</td><td className="p-2 border border-gray-200">44</td><td className="p-2 border border-gray-200">27.0</td></tr>
                  <tr><td className="p-2 border border-gray-200">11</td><td className="p-2 border border-gray-200">12</td><td className="p-2 border border-gray-200">45</td><td className="p-2 border border-gray-200">27.5</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">*This is a standard guide. Sizes may vary slightly by brand.</p>
          </div>
        </div>
      )}

      {/* ================= MOBILE LAYOUT ================= */}
      <div className="md:hidden">
        {/* Carousel, Info, Size, Add to Cart button */}
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
        {/* Details, Price, Size Selection */}
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
              {isShoeProduct && <button onClick={() => setIsSizeChartOpen(true)} className="text-xs text-gray-500 underline hover:text-black transition cursor-pointer">Size Chart</button>}
            </div>
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((size) => (
                <button key={size} onClick={() => setSelectedSize(size)} className={`w-12 h-12 rounded-full border text-sm font-medium transition ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-300 text-gray-700 hover:border-black'}`}>{size}</button>
              ))}
            </div>
          </div>
          <div className="mt-6">
            {!product.inStock ? (
              <div className="w-full bg-red-50 text-red-600 py-3 rounded text-center font-bold text-sm border border-red-200">Out of Stock</div>
            ) : (
              <div className="flex gap-3">
                <button onClick={handleAddToCart} className="flex-1 bg-black text-white py-4 rounded-md font-bold text-sm tracking-wide hover:gray-800 transition">ADD TO BAG</button>
                <button onClick={handleWishlistToggle} className="w-14 h-14 border border-gray-200 rounded-md flex items-center justify-center text-gray-700 hover:bg-gray-50 transition">
                  <svg className={`w-6 h-6 ${isInWishlist(product._id) ? 'fill-red-500 text-red-500' : 'fill-none'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Product Details Text */}
        <div className="px-4 py-4 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Product Details</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
        </div>

        {/* 🔴 UPDATED: Delivery Details with Checkout-style Pincode Logic */}
        <div className="px-4 py-6 border-t border-gray-100">
          <h3 className="font-bold text-gray-900 mb-1 text-sm">Check delivery date</h3>
          <p className="text-xs text-gray-500 mb-3">Enter pincode to know exact delivery dates/charges</p>
          
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={pincodeInput}
              onChange={(e) => {
                setPincodeInput(e.target.value);
                setDeliveryAvailable(null); // Reset message when typing
              }}
              placeholder="Pincode"
              className="border border-gray-300 rounded px-3 py-2 text-xs w-36 outline-none focus:border-black"
            />
            <button
              onClick={checkDeliveryAvailability}
              disabled={checkingPincode || pincodeInput.length !== 6}
              className="bg-white border border-gray-300 rounded px-4 py-2 text-xs font-medium hover:bg-gray-50 transition-colors text-gray-700 disabled:opacity-50"
            >
              {checkingPincode ? '...' : 'Check'}
            </button>
          </div>

          {/* Delivery Status Messages */}
          {deliveryAvailable === false && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
              <span className="text-red-500 text-lg shrink-0">🚫</span>
              <div>
                <h4 className="text-xs font-bold text-red-800">We do not deliver to this area</h4>
                <p className="text-[11px] text-red-600 mt-0.5">
                  Currently, we are unable to deliver to <strong>{pincodeInput}</strong>. Please enter a different pincode.
                </p>
              </div>
            </div>
          )}
          {deliveryAvailable === true && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-green-600 text-lg">✓</span>
              <p className="text-sm font-semibold text-green-600">We deliver to this location!</p>
            </div>
          )}

          <div className="mt-5 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2 text-gray-700"><RotateCcw className="w-4 h-4" /><span>14-day return and size exchange</span></div>
              <button onClick={() => setIsReturnModalOpen(true)} className="text-gray-500 underline cursor-pointer hover:text-black font-medium">Know More</button>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2 text-gray-700"><Truck className="w-4 h-4" /><span>Free delivery available</span></div>
              <button onClick={() => setIsDeliveryModalOpen(true)} className="text-gray-500 underline cursor-pointer hover:text-black font-medium">Know More</button>
            </div>
          </div>
        </div>
        {/* 🔴 END UPDATES */}

        {/* You Might Also Like */}
        {displayRelated.length > 0 ? (
          <div className="px-4 py-6 border-t border-gray-100">
            <h2 className="text-base font-bold text-gray-900 mb-4">You Might Also Like</h2>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x snap-mandatory">
              {displayRelated.map((item) => (
                <div key={item._id} className="min-w-[150px] snap-start">
                  <ProductCard id={item._id} title={item.title} price={item.price} image={item.images?.[0] || item.imageUrl || 'https://placehold.co/600x600/333/fff?text=Product+Image'} rating={4.5} reviewsCount={reviews.length} inStock={item.inStock} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
        
        {/* Reviews */}
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


      {/* ================= DESKTOP LAYOUT ================= */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-12 mb-12">
          <div className="flex-1 relative group">
            {/* Image, hover effects, wishlist */}
            <div className="cursor-pointer relative overflow-hidden rounded-xl shadow-lg bg-gray-100 aspect-square" onClick={() => setIsLightboxOpen(true)}>
              <img src={product.images?.[mainImageIndex] || product.imageUrl} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={(e) => { e.target.src = 'https://placehold.co/600x600/333/fff?text=Product+Image'; }} />
              <button onClick={handleWishlistToggle} className="absolute top-4 right-4 p-3 bg-white/80 rounded-full hover:bg-white hover:scale-110 transition duration-200 z-20 shadow-md">
                <svg className={`w-6 h-6 ${isInWishlist(product._id) ? 'fill-red-500 text-red-500' : 'text-gray-700 hover:text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </button>
            </div>
            {product.images && product.images.length > 1 && (
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
              <div className="flex items-center gap-1"><span className="text-yellow-400 text-lg">{renderStars(4.5)}</span><span className="text-sm text-gray-500 ml-1">({reviews.length} reviews)</span></div>
            </div>
            {/* Size Selector */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600">Select Size</h3>
                {isShoeProduct && <button onClick={() => setIsSizeChartOpen(true)} className="text-xs text-gray-500 underline hover:text-black transition cursor-pointer">Size Chart</button>}
              </div>
              <div className="flex gap-3">
                {sizeOptions.map((size) => (
                  <button key={size} onClick={() => setSelectedSize(size)} className={`w-12 h-12 border rounded-md font-semibold transition ${selectedSize === size ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'}`}>{size}</button>
                ))}
              </div>
            </div>
            {!product.inStock && <div className="w-full md:w-auto bg-red-100 text-red-700 px-12 py-4 rounded-full font-bold uppercase tracking-wide text-center border border-red-200">Out of Stock</div>}
            {product.inStock && <button onClick={handleAddToCart} className="w-full md:w-auto bg-black text-white px-12 py-4 rounded-full font-bold uppercase tracking-wide hover:bg-gray-800 transition shadow-lg">Add to Cart</button>}

            {/* 🔴 DESKTOP: DELIVERY, RETURN MODALS TRIGGERS (With Pincode Check) */}
            <div className="mt-8 border-t pt-6">
              <h3 className="font-bold text-gray-900 mb-1">Check delivery date</h3>
              <p className="text-sm text-gray-500 mb-3">Enter pincode to know exact delivery dates/charges</p>
              
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={pincodeInput}
                  onChange={(e) => {
                    setPincodeInput(e.target.value);
                    setDeliveryAvailable(null);
                  }}
                  placeholder="Pincode"
                  className="border border-gray-300 rounded px-3 py-2 text-sm w-40 outline-none focus:border-black"
                />
                <button
                  onClick={checkDeliveryAvailability}
                  disabled={checkingPincode || pincodeInput.length !== 6}
                  className="bg-white border border-gray-300 rounded px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors text-gray-700 disabled:opacity-50"
                >
                  {checkingPincode ? '...' : 'Check'}
                </button>
              </div>

              {/* Delivery Status Messages */}
              {deliveryAvailable === false && (
                <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 max-w-[400px]">
                  <span className="text-red-500 text-xl shrink-0">🚫</span>
                  <div>
                    <h4 className="text-sm font-bold text-red-800">We do not deliver to this area</h4>
                    <p className="text-xs text-red-600 mt-1">
                      Currently, we are unable to deliver to <strong>{pincodeInput}</strong>. Please enter a different pincode.
                    </p>
                  </div>
                </div>
              )}
              {deliveryAvailable === true && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-green-600 text-lg">✓</span>
                  <p className="text-sm font-semibold text-green-600">We deliver to this location!</p>
                </div>
              )}

              <div className="mt-5 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-gray-700"><RotateCcw className="w-4 h-4" /><span>14-day return and size exchange</span></div>
                  <button onClick={() => setIsReturnModalOpen(true)} className="text-gray-500 underline cursor-pointer hover:text-black font-medium text-xs">Know More</button>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-gray-700"><Truck className="w-4 h-4" /><span>Free delivery available</span></div>
                  <button onClick={() => setIsDeliveryModalOpen(true)} className="text-gray-500 underline cursor-pointer hover:text-black font-medium text-xs">Know More</button>
                </div>
              </div>
            </div>
            {/* 🔴 END DESKTOP UPDATES */}

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

      {/* 🟢 DELIVERY DETAILS MODAL */}
      {isDeliveryModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center md:items-center bg-black/50 backdrop-blur-sm p-0 md:p-4" onClick={() => setIsDeliveryModalOpen(false)}>
          <div className="bg-white w-full max-w-md rounded-t-2xl md:rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto p-6 pb-10" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsDeliveryModalOpen(false)} className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors z-10">
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-start gap-3 mb-4">
              <Truck className="w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Details</h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  We offer free shipping on all orders across India, with no minimum order value and no additional delivery, platform, or hidden charges.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  Orders are typically processed within 3-5 business days Delivery timelines may vary based on location, product availability, and other factors. If your order includes multiple items, they may be shipped separately.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  Delivery timelines may vary based on location, product availability, and other factors. If your order includes multiple items, they may be shipped separately.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Estimated delivery dates shown at checkout are indicative and may be impacted by factors beyond our control, such as extreme weather, public holidays, or logistical constraints. While we aim to meet these timelines, delays may occur, and we'll keep you informed if your order is affected.
                </p>
                <h4 className="text-sm font-bold text-gray-900 uppercase mb-2">CANCELLATION POLICY</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  You can cancel your order directly from the My Orders section before the item is shipped. Once an order has been processed and shipped, cancellation is not possible. In such cases, you can initiate a return after delivery through our returns process. For cancelled orders, refunds are processed within 5 business days from the date of cancellation.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed mt-2">
                  If you need any assistance, our Customer Service team is always here for you at <a href="mailto:support@forge.com" className="text-black font-medium underline">support@forge.com</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🟢 RETURN & EXCHANGE MODAL */}
      {isReturnModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center md:items-center bg-black/50 backdrop-blur-sm p-0 md:p-4" onClick={() => setIsReturnModalOpen(false)}>
          <div className="bg-white w-full max-w-md rounded-t-2xl md:rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto p-6 pb-10" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsReturnModalOpen(false)} className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors z-10">
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-start gap-3 mb-4">
              <RotateCcw className="w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Return & Exchange</h2>
                <div className="text-sm text-gray-600 leading-relaxed space-y-3 list-decimal pl-5">
                  <p className="mb-2"><span className="font-bold">1.</span> Most Nike products are eligible for returns or exchanges and can be requested within 14 days of delivery from the My Orders section on our website. Requests after this window will not be accepted. For select high-heat products, eligibility may vary and will be specified on the product page.</p>
                  <p className="mb-2"><span className="font-bold">2.</span> Items must be unused, unworn, and returned in original condition with all tags, packaging, brand box, invoice, and accessories intact. Products showing signs of use or alteration will not be eligible.</p>
                  <p className="mb-2"><span className="font-bold">3.</span> If you receive a defective or incorrect product, please contact Customer Service immediately with product images at <a href="mailto:support@forge.com" className="text-black font-medium underline">support@forge.com</a>.</p>
                  <p className="mb-2"><span className="font-bold">4.</span> Once a request is placed, our logistics partner will arrange a free pickup within the return window. Size exchanges can be requested via My Orders or by emailing <a href="mailto:support@forge.com" className="text-black font-medium underline">support@forge.com</a>. If the requested size is unavailable, a return will be offered instead.</p>
                  <p className="mb-2"><span className="font-bold">5.</span> For approved returns, refunds are initiated within 5–7 working days after pickup. If you need any additional help, our Customer Service team is always here for you at <a href="mailto:support@forge.com" className="text-black font-medium underline">support@forge.com</a>.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}