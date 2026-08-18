import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard'; // 🟢 Import ProductCard
import axiosClient from '../api/axiosClient';
import FilterBottomSheet from '../components/FilterBottomSheet';
import { Filter } from 'lucide-react';

export default function Men() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [currentFilters, setCurrentFilters] = useState({});

  const fetchMenProducts = async (page = 1, reset = false, filters = {}) => {
    if (reset) {
      setLoading(true);
      setProducts([]);
      setCurrentPage(1);
    }

    try {
      let params = { page: page, limit: 8 };
      params.category = filters.category || 'Men';
      if (filters.subCategory) params.subCategory = filters.subCategory;
      if (filters.sort) params.sort = filters.sort;
      if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;

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
      console.error('Error fetching men products:', error);
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
    fetchMenProducts(1, true);
  }, []);

  const handleLoadMore = () => {
    setLoadingMore(true);
    fetchMenProducts(currentPage + 1, false, currentFilters);
  };

  const applyFilters = (filters) => {
    setCurrentFilters(filters);
    setFilteredProducts([]);
    setHasMore(true);
    fetchMenProducts(1, true, filters);
  };

  const clearFilters = () => {
    setCurrentFilters({});
    setFilteredProducts([]);
    setHasMore(true);
    fetchMenProducts(1, true, {});
  };

  return (
    <div className="px-0 md:px-8 bg-white min-h-screen pb-10">
      
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex justify-between items-center py-3 px-4 md:px-10 max-w-[1280px] mx-auto">
          <span className="text-sm font-semibold text-gray-900 pl-5">Men</span>
          <button onClick={() => setIsFilterOpen(true)} className="flex items-center gap-2 border border-gray-300 bg-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center py-20 text-gray-500 text-sm mt-6">Loading products...</p>
      ) : (
        <div className="mt-0 md:mt-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-8">
            {filteredProducts.length === 0 ? (
              <p className="col-span-full text-center py-20 text-gray-500 text-sm">No products match your filters.</p>
            ) : (
              filteredProducts.map((product, index) => (
                // 🟢 FIX: Direct img tag hata kar ProductCard use kiya
                <ProductCard 
                  key={product._id}
                  id={product._id}
                  title={product.title}
                  price={product.price}
                  image={product.images?.[0]}
                  inStock={product.inStock}
                  index={index}
                />
              ))
            )}
          </div>
          {hasMore && !loadingMore && (
            <div className="flex justify-center mt-10">
              <button onClick={handleLoadMore} className="px-8 py-2.5 border border-black text-black text-sm font-medium rounded-full hover:bg-black hover:text-white transition-colors duration-300">Load More</button>
            </div>
          )}
          {loadingMore && <p className="text-center mt-10 text-sm text-gray-500">Loading more products...</p>}
        </div>
      )}
      
      <FilterBottomSheet 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        onApply={applyFilters} 
        onClear={clearFilters} 
        products={filteredProducts} 
        defaultCategory="Men" 
        totalCount={totalCount} 
      />
    </div>
  );
}