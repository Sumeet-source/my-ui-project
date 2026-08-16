import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import FilterBottomSheet from '../components/FilterBottomSheet';

export default function Men() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchMenProducts = async (page = 1, reset = false, filters = {}) => {
    if (reset) {
      setLoading(true);
      setProducts([]);
      setCurrentPage(1);
    }

    try {
      let params = {
        page: page,
        limit: 8
      };

      if (filters.category === 'Shoes' || filters.category === 'Accessories') {
        params.category = filters.category;
        if (filters.subCategory) params.subCategory = filters.subCategory;
      } else {
        params.category = 'Men';
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
    fetchMenProducts(currentPage + 1);
  };

  const applyFilters = (filters) => {
    setFilteredProducts([]);
    setHasMore(true);
    fetchMenProducts(1, true, filters);
  };

  const clearFilters = () => {
    setFilteredProducts([]);
    setHasMore(true);
    fetchMenProducts(1, true, {});
  };

  // ===========================
  // FIXED HEADER UI UPDATE
  // ===========================
  return (
    <div className="px-4 py-2 md:px-10 bg-white min-h-screen relative">
      
      {/* 1. Title Section (Scrolls away) */}
      <div className="pt-4 pb-2">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Men's</h1>
      </div>

      {/* 2. Tabs Section (Scrolls away) */}
      <div className="flex gap-6 border-b border-gray-200 pb-3 mb-4">
        <span className="text-sm font-bold border-b-2 border-black pb-3 cursor-pointer">Clothing</span>
        <span className="text-sm text-gray-500 hover:text-black pb-3 cursor-pointer">Shoes</span>
        <span className="text-sm text-gray-500 hover:text-black pb-3 cursor-pointer">Accessories</span>
      </div>

      {/* 3. FIXED Result Count & Filter Row (Always stuck to header) */}
      {/* Note: Agar aapke Navbar ki height 80px se alag hai, toh top-[80px] ko top-[75px] ya top-[85px] mein badal lena */}
      <div className="fixed top-[80px] left-0 right-0 z-30 bg-white py-3 px-4 md:px-10 border-b border-gray-100 shadow-sm">
        <div className="max-w-[1280px] mx-auto flex justify-between items-center">
          <span className="text-sm text-gray-500 font-medium">
            {filteredProducts.length} Results
          </span>
          <button 
            onClick={() => setIsFilterOpen(true)} 
            className="flex items-center gap-2 border border-gray-300 bg-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Filter
          </button>
        </div>
      </div>

      {/* 4. Spacer Div (Taaki Fixed bar ke neeche products chhupe nahi) */}
      <div className="h-[60px] mt-2"></div>

      {/* LOADING STATE */}
      {loading ? (
        <p className="text-center py-20 text-gray-500 text-sm">Loading products...</p>
      ) : (
        <div className="mt-4">
          {/* 5. Updated Grid & Product Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.length === 0 ? (
              <p className="col-span-full text-center py-20 text-gray-500 text-sm">No products match your filters.</p>
            ) : (
              filteredProducts.map((product) => (
                <Link to={`/product/${product._id}`} key={product._id} className="group cursor-pointer flex flex-col gap-2">
                  
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                    <img 
                      src={product.images?.[0] || 'https://placehold.co/600x600/333/fff?text=Product+Image'} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out" 
                      onError={(e) => { e.target.src = 'https://placehold.co/600x600/333/fff?text=Image+Error'; }} 
                    />
                    
                    {/* Wishlist Button */}
                    <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 hover:scale-105 transition-all duration-200 z-10">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* Product Details - ONLY Product Title & Price */}
                  <div className="flex flex-col px-1 pb-2">
                    <p className="text-sm text-gray-900 font-medium line-clamp-2 leading-snug">
                      {product.title}
                    </p>
                    <p className="text-sm font-bold text-black mt-1">
                      ${product.price}
                    </p>
                  </div>

                </Link>
              ))
            )}
          </div>

          {/* 6. Load More Button */}
          {hasMore && !loadingMore && (
            <div className="flex justify-center mt-10 mb-8">
              <button 
                onClick={handleLoadMore} 
                className="px-8 py-2.5 border border-black text-black text-sm font-medium rounded-full hover:bg-black hover:text-white transition-colors duration-300"
              >
                Load More
              </button>
            </div>
          )}
          {loadingMore && (
            <div className="flex justify-center mt-10 mb-8">
              <p className="text-sm text-gray-500">Loading more products...</p>
            </div>
          )}
        </div>
      )}

      {/* Filter Bottom Sheet */}
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