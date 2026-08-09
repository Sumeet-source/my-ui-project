import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import FilterBottomSheet from '../components/FilterBottomSheet';

export default function Outlet() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchOutletProducts = async (page = 1, reset = false, filters = {}) => {
    if (reset) {
      setLoading(true);
      setProducts([]);
      setCurrentPage(1);
    }

    try {
      let params = { page: page, limit: 8 };

      if (filters.category === 'Shoes' || filters.category === 'Accessories') {
        params.category = filters.category;
        if (filters.subCategory) params.subCategory = filters.subCategory;
      } else {
        params.category = 'Outlet';
        if (filters.subCategory) params.subCategory = filters.subCategory;
      }

      if (filters.sort) {
        if (filters.sort === 'price-low') params.sort = 'price_asc';
        else if (filters.sort === 'price-high') params.sort = 'price_desc';
        else if (filters.sort === 'newest') params.sort = 'newest';
      }
      if (filters.price && filters.price < 200) params.maxPrice = filters.price;

      const res = await axiosClient.get('/api/products', { params });
      
      const { products: newProducts, totalCount: newTotalCount, currentPage: pageReturned, totalPages } = res.data;

      if (reset) {
        setProducts(newProducts || []);
        setFilteredProducts(newProducts || []);
        setTotalCount(newTotalCount || 0);
      } else {
        setProducts(prev => [...prev, ...(newProducts || [])]);
        setFilteredProducts(prev => [...prev, ...(newProducts || [])]);
      }
      
      setCurrentPage(pageReturned || 1);
      setHasMore(pageReturned < totalPages);
    } catch (error) {
      console.error('Error fetching outlet products:', error);
      if (reset) {
        setProducts([]);
        setFilteredProducts([]);
        setTotalCount(0);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchOutletProducts(1, true);
  }, []);

  const handleLoadMore = () => {
    setLoadingMore(true);
    fetchOutletProducts(currentPage + 1);
  };

  const applyFilters = (filters) => {
    setFilteredProducts([]);
    setHasMore(true);
    fetchOutletProducts(1, true, filters);
  };

  const clearFilters = () => {
    setFilteredProducts([]);
    setHasMore(true);
    fetchOutletProducts(1, true, {});
  };

  return (
    <div className="p-6 md:p-10 bg-white min-h-screen">
      
      {/* 🟢 SIMPLE THIN HEADER FOR OUTLET */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-light tracking-wide text-gray-900 uppercase">
          Outlet
        </h1>
        <button onClick={() => setIsFilterOpen(true)} className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded text-sm font-medium hover:bg-gray-200 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          Filters · Sort
        </button>
      </div>

      {loading ? (
        <p className="text-center py-10 text-gray-500">Loading products...</p>
      ) : (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filteredProducts.length === 0 ? (
              <p className="col-span-full text-center py-10 text-gray-500">No products match your filters.</p>
            ) : (
              filteredProducts.map((product) => (
                <Link to={`/product/${product._id}`} key={product._id} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
                    <img src={product.images?.[0] || 'https://placehold.co/600x600/333/fff?text=Product+Image'} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" onError={(e) => { e.target.src = 'https://placehold.co/600x600/333/fff?text=Image+Error'; }} />
                    <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white hover:scale-110 transition duration-200 z-10">
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

          {hasMore && !loadingMore && (
            <div className="flex justify-center mt-8">
              <button onClick={handleLoadMore} className="px-6 py-3 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition">Load More</button>
            </div>
          )}
          {loadingMore && (
            <div className="flex justify-center mt-8">
              <p className="text-sm text-gray-500">Loading more products...</p>
            </div>
          )}
        </div>
      )}

      <FilterBottomSheet 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        onApply={applyFilters} 
        onClear={clearFilters} 
        products={filteredProducts} 
        defaultCategory="Outlet" 
        totalCount={totalCount}
      />
    </div>
  );
}