import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import FilterBottomSheet from '../components/FilterBottomSheet';
import { Filter } from 'lucide-react';

export default function NewArrivalsFixed() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchNewArrivals = async (page = 1, reset = false, filters = {}) => {
    if (reset) { setLoading(true); setProducts([]); setCurrentPage(1); }
    try {
      let params = { limit: 8, page: page };
      if (filters.category === 'Shoes' || filters.category === 'Accessories') { params.category = filters.category; if (filters.subCategory) params.subCategory = filters.subCategory; }
      else if (filters.category) { params.category = filters.category; if (filters.subCategory) params.subCategory = filters.subCategory; }
      if (filters.sort) {
        if (filters.sort === 'price-low') params.sort = 'price_asc';
        else if (filters.sort === 'price-high') params.sort = 'price_desc';
        else if (filters.sort === 'newest') params.sort = 'newest';
      }
      if (filters.price && filters.price < 200) params.maxPrice = filters.price;
      const res = await axiosClient.get('/api/products', { params });
      const { products: newProducts, totalCount: newTotalCount, currentPage: pageReturned, totalPages } = res.data;
      if (reset) { setProducts(newProducts || []); setFilteredProducts(newProducts || []); setTotalCount(newTotalCount || 0); }
      else { setProducts(prev => [...prev, ...(newProducts || [])]); setFilteredProducts(prev => [...prev, ...(newProducts || [])]); }
      setCurrentPage(pageReturned || 1); setHasMore(pageReturned < totalPages);
    } catch (error) { console.error('Error fetching new arrivals:', error); if (reset) { setProducts([]); setFilteredProducts([]); setTotalCount(0); } }
    finally { setLoading(false); setLoadingMore(false); }
  };

  useEffect(() => { fetchNewArrivals(1, true); }, []);
  const handleLoadMore = () => { setLoadingMore(true); fetchNewArrivals(currentPage + 1); };
  const applyFilters = (filters) => { setFilteredProducts([]); setHasMore(true); fetchNewArrivals(1, true, filters); };
  const clearFilters = () => { setFilteredProducts([]); setHasMore(true); fetchNewArrivals(1, true, {}); };

  return (
    <div className="px-0 md:px-8 bg-white min-h-screen pb-10">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex justify-between items-center py-3 px-4 md:px-10 max-w-[1280px] mx-auto">
          <span className="text-sm font-semibold text-gray-900 pl-5">New Arrivals</span>
          <button onClick={() => setIsFilterOpen(true)} className="flex items-center gap-2 border border-gray-300 bg-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {loading ? (<p className="text-center py-20 text-gray-500 text-sm mt-6">Loading new arrivals...</p>) : (
        <div className="mt-0 md:mt-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-8">
            {filteredProducts.length === 0 ? (<p className="col-span-full text-center py-20 text-gray-500 text-sm">No products match your filters.</p>) : (
              filteredProducts.map((product) => (
                <Link to={`/product/${product._id}`} key={product._id} className="group cursor-pointer flex flex-col gap-1.5 p-0">
                  <div className="relative aspect-square overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                    <img src={product.images?.[0] || 'https://placehold.co/600x600/333/fff?text=Product+Image'} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out" onError={(e) => { e.target.src = 'https://placehold.co/600x600/333/fff?text=Image+Error'; }} />
                    <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 hover:scale-105 transition-all duration-200 z-10"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></button>
                  </div>
                  <div className="flex flex-col gap-1 px-1 md:px-1.5 pb-1.5">
                    <p className="text-sm text-gray-900 font-medium line-clamp-2 leading-snug">{product.title}</p>
                    <p className="text-sm font-bold text-black">${product.price}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
          {hasMore && !loadingMore && (<div className="flex justify-center mt-10"><button onClick={handleLoadMore} className="px-8 py-2.5 border border-black text-black text-sm font-medium rounded-full hover:bg-black hover:text-white transition-colors duration-300">Load More</button></div>)}
          {loadingMore && (<p className="text-center mt-10 text-sm text-gray-500">Loading more products...</p>)}
        </div>
      )}
      <FilterBottomSheet isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApply={applyFilters} onClear={clearFilters} products={filteredProducts} defaultCategory="" totalCount={totalCount} />
    </div>
  );
}