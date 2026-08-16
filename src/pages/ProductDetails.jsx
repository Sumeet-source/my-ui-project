import { useParams, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import axiosClient from '../api/axiosClient';
import ProductCard from '../components/ProductCard';
import { Truck, RotateCcw, MapPin, Box, Info, X } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart, openAddedToBag } = useCart(); // 👈 Popup trigger added
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
    
    // 🟢 YAHAN POPUP TRIGGER HO RAHA HAI
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
        {/* Carousel, Info, Size, Add to Cart button (Everything same) */}
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

        {/* 🔴🔴🔴 CHECKPOINT 1: MOBILE KE LIYE NIKE SECTIONS (Ye dekho ki neeche aa raha hai ya nahi) */}
        {/* 1. Check Delivery Date */}
        <div className="px-4 py-6 border-t border-gray-100">
          <h3 className="font-bold text-gray-900 mb-1 text-sm">Check delivery date</h3>
          <p className="text-xs text-gray-500 mb-3">Enter pincode to know exact delivery dates/charges</p>
          <div className="flex gap-2 mb-4">
            <input type="text" placeholder="Pincode" className="border border-gray-300 rounded px-3 py-2 text-xs w-36 outline-none focus:border-black" />
            <button className="bg-white border border-gray-300 rounded px-4 py-2 text-xs font-medium hover:bg-gray-50 transition-colors text-gray-700">Check</button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2 text-gray-700"><RotateCcw className="w-4 h-4" /><span>14-day return and size exchange</span></div>
              <span className="text-gray-500 underline cursor-pointer hover:text-black font-medium">Know More</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2 text-gray-700"><Truck className="w-4 h-4" /><span>Free delivery available</span></div>
              <span className="text-gray-500 underline cursor-pointer hover:text-black font-medium">Know More</span>
            </div>
          </div>
        </div>

        {/* 2. Vendor Details */}
        <div className="px-4 border-t border-gray-100 pb-4 pt-4">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none text-sm font-bold text-gray-900">
              <span>Vendor Details</span>
              <span className="transition-transform group-open:rotate-180"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></span>
            </summary>
            <div className="mt-4 space-y-2 text-xs text-gray-600">
              <div className="grid grid-cols-[100px_1fr]"><span className="text-gray-500">Sold By</span><span className="font-medium text-gray-900">Nykasa Fashion Ltd</span></div>
              <div className="grid grid-cols-[100px_1fr]"><span className="text-gray-500">Country Of Origin</span><span className="font-medium text-gray-900">Vietnam</span></div>
              <div className="grid grid-cols-[100px_1fr]"><span className="text-gray-500">Manufacturer</span><span className="font-medium text-gray-900">Nike</span></div>
              <div className="grid grid-cols-[100px_1fr]"><span className="text-gray-500">Manufacturer Address</span><span className="text-gray-900">Worldion Vietnam Co. Ltd, Hoa Phu Commune Cu Chi District, Ho Chi Minh, 70000</span></div>
            </div>
          </details>
        </div>

        {/* 3. Return And Exchange Policy */}
        <div className="px-4 border-t border-gray-100 pb-2">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none text-sm font-bold text-gray-900 py-4">
              <span>Return And Exchange Policy</span>
              <span className="transition-transform group-open:rotate-180"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></span>
            </summary>
            <div className="pb-4 space-y-3 text-xs text-gray-600 leading-relaxed">
              <p>1. Most Nike products are eligible for returns or exchanges and can be requested within 14 days of delivery.</p>
              <p>2. Items must be unused, unworn, and returned in original condition with all tags.</p>
              <p>3. If you receive a defective or incorrect product, contact us immediately at <span className="text-gray-900 font-medium">support@forge.com</span>.</p>
              <p>4. Refunds are initiated within 5–7 working days after pickup.</p>
            </div>
          </details>
        </div>
        {/* 🔴🔴🔴 END CHECKPOINT 1 */}

        {/* You Might Also Like & Reviews (Same as before) */}
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
        {/* Rest of reviews can be kept */}
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

            {/* 🔴🔴🔴 CHECKPOINT 2: DESKTOP KE LIYE NIKE SECTIONS */}
            {/* 1. Check Delivery Date */}
            <div className="mt-8 border-t pt-6">
              <h3 className="font-bold text-gray-900 mb-1">Check delivery date</h3>
              <p className="text-sm text-gray-500 mb-3">Enter pincode to know exact delivery dates/charges</p>
              <div className="flex gap-2 mb-4">
                <input type="text" placeholder="Pincode" className="border border-gray-300 rounded px-3 py-2 text-sm w-40 outline-none focus:border-black" />
                <button className="bg-white border border-gray-300 rounded px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors text-gray-700">Check</button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-gray-700"><RotateCcw className="w-4 h-4" /><span>14-day return and size exchange</span></div>
                  <span className="text-gray-500 underline cursor-pointer hover:text-black font-medium text-xs">Know More</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-gray-700"><Truck className="w-4 h-4" /><span>Free delivery available</span></div>
                  <span className="text-gray-500 underline cursor-pointer hover:text-black font-medium text-xs">Know More</span>
                </div>
              </div>
            </div>

            {/* 2. Vendor Details */}
            <div className="mt-8 border-t pt-5 pb-4 border-b">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none text-sm font-bold text-gray-900">
                  <span>Vendor Details</span>
                  <span className="transition-transform group-open:rotate-180"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></span>
                </summary>
                <div className="mt-4 space-y-3 text-sm text-gray-600">
                  <div className="grid grid-cols-[120px_1fr]"><span className="text-gray-500">Sold By</span><span className="font-medium text-gray-900">Nykasa Fashion Ltd</span></div>
                  <div className="grid grid-cols-[120px_1fr]"><span className="text-gray-500">Country Of Origin</span><span className="font-medium text-gray-900">Vietnam</span></div>
                  <div className="grid grid-cols-[120px_1fr]"><span className="text-gray-500">Name Of Manufacturer</span><span className="font-medium text-gray-900">Nike</span></div>
                  <div className="grid grid-cols-[120px_1fr]"><span className="text-gray-500">Manufacturer Address</span><span className="text-gray-900">Worldion Vietnam Co. Ltd, Hoa Phu Commune Cu Chi District, Ho Chi Minh, 70000</span></div>
                </div>
              </details>
            </div>

            {/* 3. Return And Exchange Policy */}
            <div className="border-b pb-4">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none text-sm font-bold text-gray-900 py-4">
                  <span>Return And Exchange Policy</span>
                  <span className="transition-transform group-open:rotate-180"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></span>
                </summary>
                <div className="pb-4 space-y-4 text-sm text-gray-600 leading-relaxed">
                  <p>1. Most Nike products are eligible for returns or exchanges and can be requested within 14 days of delivery.</p>
                  <p>2. Items must be unused, unworn, and returned in original condition.</p>
                  <p>3. If you receive a defective or incorrect product, contact Customer Service at <span className="text-gray-900 font-medium">support@forge.com</span>.</p>
                  <p>4. Refunds are initiated within 5–7 working days after pickup.</p>
                </div>
              </details>
            </div>
            {/* 🔴🔴🔴 END CHECKPOINT 2 */}

            <Link to="/" className="block text-gray-500 hover:text-black underline mt-4">Continue Shopping</Link>
          </div>
        </div>
        {/* Reviews can stay here */}
      </div>
    </div>
  );
}