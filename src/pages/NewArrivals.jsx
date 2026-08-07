import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🟢 Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchNewArrivals = async (page = 1, reset = false) => {
    if (reset) {
      setLoading(true);
      setProducts([]);
      setCurrentPage(1);
    }

    try {
      // 🟢 Page param bhej rahe hain
      const res = await axiosClient.get('/api/products', { params: { limit: 8, page: page } });
      
      const { products: newProducts, totalCount, currentPage: pageReturned, totalPages } = res.data;

      if (reset) {
        setProducts(newProducts || []);
      } else {
        setProducts(prev => [...prev, ...(newProducts || [])]);
      }
      
      setCurrentPage(pageReturned || 1);
      setHasMore(pageReturned < totalPages);
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      if (reset) {
        setProducts([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchNewArrivals(1, true);
  }, []);

  const handleLoadMore = () => {
    setLoadingMore(true);
    fetchNewArrivals(currentPage + 1);
  };

  return (
    <div className="p-6 md:p-10 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">New Arrivals 🔥</h1>
      
      {loading ? (
        <p className="text-center py-10 text-gray-500">Loading new arrivals...</p>
      ) : (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.length === 0 ? (
              <p className="col-span-full text-center py-10 text-gray-500">No new arrivals found.</p>
            ) : (
              products.map((product) => (
                <Link to={`/product/${product._id}`} key={product._id} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square">
                    <img src={product.images?.[0] || 'https://placehold.co/600x600/333/fff?text=Product+Image'} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" onError={(e) => { e.target.src = 'https://placehold.co/600x600/333/fff?text=Image+Error'; }} />
                    <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    </button>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-semibold text-gray-900">{product.title}</p>
                    <p className="text-sm text-gray-500">${product.price}</p>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* 🟢 Load More Button */}
          {hasMore && !loadingMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                className="px-6 py-3 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition"
              >
                Load More
              </button>
            </div>
          )}
          {loadingMore && (
            <div className="flex justify-center mt-8">
              <p className="text-sm text-gray-500">Loading more products...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}