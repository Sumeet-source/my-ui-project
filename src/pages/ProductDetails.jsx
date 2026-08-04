import { useParams, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import axiosClient from '../api/axiosClient'; 
import ProductCard from '../components/ProductCard';

export default function ProductDetails() {
  const { id } = useParams(); 
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const scrollContainerRef = useRef(null);

  // ✅ FIX: Ye hooks ab component ke bilkul TOP par hain. Isse error kabhi nahi aayega.
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
      // Product fetch hone ke baad reviews update kar diye
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

  if (loading) {
    return <div className="text-center py-20 text-2xl text-gray-600">Loading product...</div>;
  }

  if (!product) {
    return <div className="text-center py-20 text-2xl text-gray-600">Product not found!</div>;
  }

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p._id !== product._id)
    .slice(0, 8);

  const scrollCarousel = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 320;
      container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const handleAddToCart = () => {
    if (!product.inStock) {
      showToast("Sorry, this item is out of stock!", "error");
      return;
    }
    if (!selectedSize) {
      showToast("Please select a size!", "error");
      return;
    }
    addToCart({ ...product, id: product._id, size: selectedSize, image: product.imageUrl });
    showToast(`${product.title} (Size: ${selectedSize}) added to cart!`, 'success');
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

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* -- Product Details -- */}
      <div className="flex flex-col md:flex-row gap-12 mb-12">
        <div className="flex-1 relative group">
          <div className="cursor-pointer relative overflow-hidden rounded-xl shadow-lg" onClick={() => setIsLightboxOpen(true)}>
            <img 
              src={product?.imageUrl || 'https://picsum.photos/seed/fallback/600/600'} 
              alt={product.title} 
              className="w-full h-[500px] object-cover transition-transform duration-500 group-hover:scale-105" 
              onError={(e) => { e.target.src = 'https://picsum.photos/seed/fallback/600/600'; }} 
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300 flex items-center justify-center">
              <span className="bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
              </span>
            </div>
          </div>
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
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 mb-2">Select Size</h3>
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

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setIsLightboxOpen(false)}>
          <button onClick={() => setIsLightboxOpen(false)} className="absolute top-6 right-6 text-white text-5xl font-light hover:text-gray-300 transition z-10">&times;</button>
          <img src={product.imageUrl} alt={product.title} className="max-w-full max-h-[90vh] object-contain rounded-lg cursor-default shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-gray-200 pt-10 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
          <div className="relative group/carousel">
            <div ref={scrollContainerRef} className="flex gap-6 overflow-x-auto overflow-y-hidden py-4 px-2 scroll-smooth no-scrollbar">
              {relatedProducts.map((item) => (
                <div key={item._id} className="min-w-[260px] max-w-[260px] flex-shrink-0">
                  <ProductCard 
                    id={item._id} 
                    title={item.title} 
                    price={item.price} 
                    image={item.imageUrl} 
                    rating={4.5} 
                    reviewsCount={reviews.length} 
                    inStock={item.inStock} 
                  />
                </div>
              ))}
            </div>
            <button onClick={() => scrollCarousel('left')} className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hover:bg-white hover:scale-110 z-10 hidden md:block"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button>
            <button onClick={() => scrollCarousel('right')} className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hover:bg-white hover:scale-110 z-10 hidden md:block"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section className="border-t border-gray-200 pt-10 max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
        <div className="space-y-6 mb-8">
          {reviews.map((review, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-gray-800">{review.user}</span>
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
  );
}