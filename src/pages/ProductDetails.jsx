import { useParams, Link } from 'react-router-dom';
import { useState, useRef, useEffect, useMemo } from 'react';
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
  const [sizeUnit, setSizeUnit] = useState('in');

  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [pincodeInput, setPincodeInput] = useState('');
  const [deliveryAvailable, setDeliveryAvailable] = useState(null);
  const [checkingPincode, setCheckingPincode] = useState(false);

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

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const handleCarouselScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const width = carouselRef.current.clientWidth;
      const index = Math.round(scrollLeft / width);
      setMainImageIndex(index);
    }
  };

  const checkDeliveryAvailability = async () => {
    if (!pincodeInput || pincodeInput.length !== 6) {
      showToast("Please enter a valid 6-digit pincode!", "warning");
      return;
    }
    setCheckingPincode(true);
    try {
      const res = await axiosClient.get(`/api/delivery/check/${pincodeInput}`);
      setDeliveryAvailable(res.data.success);
    } catch (error) {
      console.error("Pincode API Error:", error);
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
  const clothingSizes = ['S', 'M', 'L', 'XL', '2XL'];
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
    <div className="bg-white min-h-screen pb-20 font-sans">
      
      {isSizeChartOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsSizeChartOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl">&times;</button>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-gray-900">Size Guide</h2>
            </div>
            <p className="text-sm text-gray-500 mb-4">Below are body measurements this product fits</p>
            <div className="flex gap-2 mb-4">
              <button onClick={() => setSizeUnit('in')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${sizeUnit === 'in' ? 'bg-black text-white border border-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>in</button>
              <button onClick={() => setSizeUnit('cm')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${sizeUnit === 'cm' ? 'bg-black text-white border border-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>cm</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-center border-collapse">
                <thead><tr className="bg-gray-100"><th className="p-2 border border-gray-200 font-semibold">Size</th><th className="p-2 border border-gray-200 font-semibold">Chest</th><th className="p-2 border border-gray-200 font-semibold">Waist</th><th className="p-2 border border-gray-200 font-semibold">Hip</th></tr></thead>
                <tbody>
                  {sizeUnit === 'in' ? (
                    <>
                      <tr><td className="p-2 border border-gray-200 font-medium">S</td><td className="p-2 border border-gray-200">33-35.5"</td><td className="p-2 border border-gray-200">28.5-31"</td><td className="p-2 border border-gray-200">34-36"</td></tr>
                      <tr><td className="p-2 border border-gray-200 font-medium">M</td><td className="p-2 border border-gray-200">36-38"</td><td className="p-2 border border-gray-200">31-33.5"</td><td className="p-2 border border-gray-200">36-38"</td></tr>
                      <tr><td className="p-2 border border-gray-200 font-medium">L</td><td className="p-2 border border-gray-200">38-40.5"</td><td className="p-2 border border-gray-200">33.5-36"</td><td className="p-2 border border-gray-200">38-40"</td></tr>
                      <tr><td className="p-2 border border-gray-200 font-medium">XL</td><td className="p-2 border border-gray-200">40.5-43"</td><td className="p-2 border border-gray-200">36-38"</td><td className="p-2 border border-gray-200">40-42"</td></tr>
                      <tr><td className="p-2 border border-gray-200 font-medium">2XL</td><td className="p-2 border border-gray-200">43-45.5"</td><td className="p-2 border border-gray-200">38-41"</td><td className="p-2 border border-gray-200">42-44"</td></tr>
                    </>
                  ) : (
                    <>
                      <tr><td className="p-2 border border-gray-200 font-medium">S</td><td className="p-2 border border-gray-200">84-90</td><td className="p-2 border border-gray-200">72-79</td><td className="p-2 border border-gray-200">86-91</td></tr>
                      <tr><td className="p-2 border border-gray-200 font-medium">M</td><td className="p-2 border border-gray-200">91-96</td><td className="p-2 border border-gray-200">79-85</td><td className="p-2 border border-gray-200">91-96</td></tr>
                      <tr><td className="p-2 border border-gray-200 font-medium">L</td><td className="p-2 border border-gray-200">96-103</td><td className="p-2 border border-gray-200">85-91</td><td className="p-2 border border-gray-200">96-101</td></tr>
                      <tr><td className="p-2 border border-gray-200 font-medium">XL</td><td className="p-2 border border-gray-200">103-109</td><td className="p-2 border border-gray-200">91-96</td><td className="p-2 border border-gray-200">101-106</td></tr>
                      <tr><td className="p-2 border border-gray-200 font-medium">2XL</td><td className="p-2 border border-gray-200">109-115</td><td className="p-2 border border-gray-200">96-104</td><td className="p-2 border border-gray-200">106-111</td></tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">*This is a standard guide. Sizes may vary slightly by brand.</p>
          </div>
        </div>
      )}

      {/* ================= MOBILE LAYOUT ================= */}
      <div className="md:hidden">
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
        <div className="px-4 py-4">
          {/* 🟢 JUST IN BADGE */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Just In</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight mb-1">{product.title}</h1>
          <p className="text-sm text-gray-500 mb-3">{product.category}</p>
          
          {/* 🟢 PRICE + INCLUSIVE TAX (Gap ke saath) */}
          <div className="mt-2">
            <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
            <div className="mt-1 text-xs text-gray-500">Inclusive of all taxes</div>
          </div>

          {product.discountPercent > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm line-through text-gray-400">₹{(product.price * (1 + product.discountPercent / 100)).toFixed(2)}</span>
              <span className="text-sm font-medium text-green-600">({product.discountPercent}% OFF)</span>
            </div>
          )}

          {/* 🟢 NIKE STYLE GRID SIZE SELECTOR */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-gray-900">Select Size</h3>
              {!isShoeProduct && (
                <button onClick={() => setIsSizeChartOpen(true)} className="text-xs text-gray-500 underline hover:text-black transition cursor-pointer">Size Guide</button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {sizeOptions.map((size) => (
                <button 
                  key={size} 
                  onClick={() => setSelectedSize(size)} 
                  className={`py-3 border rounded-sm text-sm font-semibold transition ${
                    selectedSize === size 
                      ? 'border-black bg-black text-white' 
                      : 'border-gray-300 text-gray-900 hover:border-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* 🟢 NIKE STYLE ROUNDED BUTTONS */}
          <div className="mt-6 space-y-3">
            {!product.inStock ? (
              <div className="w-full bg-red-50 text-red-600 py-4 rounded-full text-center font-bold text-sm border border-red-200">Out of Stock</div>
            ) : (
              <>
                <button 
                  onClick={handleAddToCart} 
                  className="w-full bg-black text-white py-4 rounded-full font-bold text-sm tracking-wide hover:bg-gray-800 transition"
                >
                  Add to Bag
                </button>
                <button 
                  onClick={handleWishlistToggle} 
                  className={`w-full py-4 rounded-full border border-gray-200 font-bold text-sm flex items-center justify-center gap-2 transition ${
                    isInWishlist(product._id) ? 'bg-gray-100 border-black' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <span>Favourite</span>
                  <svg className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-red-500 text-red-500' : 'fill-none'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </>
            )}
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>
        </div>

        {/* 🟢 NIKE STYLE ACCORDIONS */}
        <div className="px-4 border-t border-gray-100">
          <div className="py-4 border-b border-gray-100">
            <h4 className="font-semibold text-gray-900 text-sm mb-2">Check delivery date</h4>
            <p className="text-xs text-gray-500 mb-3">Enter pincode to know exact delivery dates/charges</p>
            <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                value={pincodeInput} 
                onChange={(e) => setPincodeInput(e.target.value)} 
                placeholder="Pincode" 
                className="border border-gray-300 rounded px-3 py-2 text-sm w-full outline-none focus:border-black"
              />
              <button 
                onClick={checkDeliveryAvailability}
                disabled={checkingPincode}
                className="bg-white border border-gray-300 rounded px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors text-gray-600 disabled:opacity-50"
              >
                {checkingPincode ? '...' : 'Check'}
              </button>
            </div>
            {deliveryAvailable === true && <p className="text-xs text-green-600 font-medium">✓ We deliver to this location!</p>}
            {deliveryAvailable === false && <p className="text-xs text-red-500 font-medium">🚫 We do not deliver to this area.</p>}
          </div>

          <details className="group border-b border-gray-100 py-4">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <span className="font-semibold text-gray-900 text-sm">Vendor Details</span>
              <span className="transition-transform group-open:rotate-180"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></span>
            </summary>
            <div className="mt-3 space-y-1 text-sm text-gray-600">
              <div><span className="text-gray-500">Sold By: </span>Nykasa Fashion Ltd</div>
              <div><span className="text-gray-500">Country of Origin: </span>Vietnam</div>
              <div><span className="text-gray-500">Manufacturer: </span>FORGE</div>
            </div>
          </details>

          <details className="group border-b border-gray-100 py-4">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <span className="font-semibold text-gray-900 text-sm">Return And Exchange Policy</span>
              <span className="transition-transform group-open:rotate-180"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></span>
            </summary>
            <div className="mt-3 space-y-2 text-sm text-gray-600 leading-relaxed">
              <p>1. Most FORGE products are eligible for returns or exchanges within 14 days of delivery.</p>
              <p>2. Items must be unused, unworn, and returned in original condition.</p>
              <p>3. Refunds are initiated within 5–7 working days after pickup.</p>
            </div>
          </details>
        </div>

        {/* 🟢 NIKE STYLE "More From" SECTION */}
        <div className="px-4 mt-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">More From {product.category}</h2>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-4 snap-x snap-mandatory">
            {displayRelated.map((item) => (
              <div key={item._id} className="min-w-[160px] snap-start">
                <ProductCard id={item._id} title={item.title} price={item.price} image={item.images?.[0] || item.imageUrl || 'https://placehold.co/600x600/333/fff?text=Product+Image'} rating={4.5} reviewsCount={reviews.length} inStock={item.inStock} />
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* ================= DESKTOP LAYOUT ================= */}
      <div className="hidden md:block max-w-6xl mx-auto px-8 py-12">
        <div className="flex flex-col md:flex-row gap-12 mb-12">
          <div className="flex-1 relative group">
            <div className="cursor-pointer relative overflow-hidden rounded-lg bg-gray-100 aspect-square" onClick={() => setIsLightboxOpen(true)}>
              <img src={product.images?.[mainImageIndex] || product.imageUrl} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <button onClick={handleWishlistToggle} className="absolute top-4 right-4 p-3 bg-white rounded-full hover:bg-white hover:scale-110 transition duration-200 z-20 shadow-md">
                <svg className={`w-6 h-6 ${isInWishlist(product._id) ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
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

          <div className="flex-1 space-y-4">
            <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Just In</span>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.title}</h1>
            <p className="text-sm text-gray-500">{product.category}</p>
            
            {/* 🟢 PRICE + INCLUSIVE TAX (Gap ke saath) */}
            <div className="mt-2">
              <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
              <div className="mt-1 text-xs text-gray-500">Inclusive of all taxes</div>
            </div>

            {product.discountPercent > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm line-through text-gray-400">₹{(product.price * (1 + product.discountPercent / 100)).toFixed(2)}</span>
                <span className="text-sm font-medium text-green-600">({product.discountPercent}% OFF)</span>
              </div>
            )}

            {/* Size Selector */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-gray-900">Select Size</h3>
                {!isShoeProduct && <button onClick={() => setIsSizeChartOpen(true)} className="text-xs text-gray-500 underline hover:text-black transition cursor-pointer">Size Guide</button>}
              </div>
              <div className="grid grid-cols-3 gap-2 max-w-md">
                {sizeOptions.map((size) => (
                  <button key={size} onClick={() => setSelectedSize(size)} className={`py-3 border rounded-sm text-sm font-semibold transition ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-300 text-gray-900 hover:border-black'}`}>{size}</button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3 max-w-md">
              {!product.inStock && <div className="w-full bg-red-50 text-red-600 py-4 rounded-full text-center font-bold text-sm border border-red-200">Out of Stock</div>}
              {product.inStock && (
                <>
                  <button onClick={handleAddToCart} className="w-full bg-black text-white py-4 rounded-full font-bold text-sm tracking-wide hover:bg-gray-800 transition">Add to Bag</button>
                  <button onClick={handleWishlistToggle} className={`w-full py-4 rounded-full border border-gray-200 font-bold text-sm flex items-center justify-center gap-2 transition ${isInWishlist(product._id) ? 'bg-gray-100 border-black' : 'bg-white hover:bg-gray-50'}`}>
                    <span>Favourite</span>
                    <svg className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-red-500 text-red-500' : 'fill-none'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  </button>
                </>
              )}
            </div>

            {/* Description */}
            <div className="mt-4 max-w-md">
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>

            {/* Desktop Accordions */}
            <div className="mt-8 border-t border-gray-200 pt-6 max-w-md">
              <div className="py-4 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900 text-sm mb-2">Check delivery date</h4>
                <p className="text-xs text-gray-500 mb-2">Enter pincode to know exact delivery dates/charges</p>
                <div className="flex gap-2">
                  <input type="text" value={pincodeInput} onChange={(e) => setPincodeInput(e.target.value)} placeholder="Pincode" className="border border-gray-300 rounded px-3 py-2 text-sm w-40 outline-none focus:border-black" />
                  <button onClick={checkDeliveryAvailability} className="bg-white border border-gray-300 rounded px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors text-gray-600">Check</button>
                </div>
                {deliveryAvailable === true && <p className="text-xs text-green-600 font-medium mt-2">✓ We deliver to this location!</p>}
                {deliveryAvailable === false && <p className="text-xs text-red-500 font-medium mt-2">🚫 We do not deliver to this area.</p>}
              </div>

              <details className="group border-b border-gray-200 py-4">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <span className="font-semibold text-gray-900 text-sm">Vendor Details</span>
                  <span className="transition-transform group-open:rotate-180"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></span>
                </summary>
                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  <div><span className="text-gray-500">Sold By: </span>Nykasa Fashion Ltd</div>
                  <div><span className="text-gray-500">Country of Origin: </span>Vietnam</div>
                  <div><span className="text-gray-500">Manufacturer: </span>FORGE</div>
                </div>
              </details>

              <details className="group border-b border-gray-200 py-4">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <span className="font-semibold text-gray-900 text-sm">Return And Exchange Policy</span>
                  <span className="transition-transform group-open:rotate-180"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></span>
                </summary>
                <div className="mt-3 space-y-2 text-sm text-gray-600 leading-relaxed">
                  <p>1. Most FORGE products are eligible for returns or exchanges within 14 days of delivery.</p>
                  <p>2. Items must be unused, unworn, and returned in original condition.</p>
                  <p>3. Refunds are initiated within 5–7 working days after pickup.</p>
                </div>
              </details>
            </div>

            <Link to="/" className="block text-gray-500 hover:text-black underline mt-4 text-sm">Continue Shopping</Link>
          </div>
        </div>
      </div>

      {/* 🟢 NIKE-STYLE LIGHTBOX (Image Slider with Thumbnails) */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
          {/* Close Button */}
          <button 
            onClick={() => setIsLightboxOpen(false)} 
            className="absolute top-4 right-4 z-50 p-2 text-black hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Main Image */}
          <div className="flex-1 w-full flex items-center justify-center px-4 py-8">
            <img 
              src={images[mainImageIndex]} 
              alt={`${product.title} - Main View`} 
              className="max-w-full max-h-[70vh] object-contain" 
              onError={(e) => { e.target.src = 'https://placehold.co/600x600/333/fff?text=Image'; }} 
            />
          </div>

          {/* Thumbnail Strip */}
          <div className="w-full max-w-3xl px-4 pb-8 overflow-x-auto">
            <div className="flex gap-2 justify-center">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImageIndex(idx)}
                  className={`w-16 h-16 rounded border-2 overflow-hidden flex-shrink-0 transition ${
                    mainImageIndex === idx ? 'border-black' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${idx + 1}`} 
                    className="w-full h-full object-cover" 
                    onError={(e) => { e.target.src = 'https://placehold.co/100x100/333/fff?text=Image'; }} 
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}