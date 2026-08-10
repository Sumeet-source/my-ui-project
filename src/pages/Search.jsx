import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import axiosClient from '../api/axiosClient';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const subCategory = searchParams.get('subCategory') || ''; 
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query && !subCategory) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        let params = {};
        if (query) params.q = query;
        if (subCategory) params.subCategory = subCategory;

        const res = await axiosClient.get('/api/products', { params });
        
        let data = res.data;
        if (Array.isArray(data)) {
          data = data;
        } else if (data && Array.isArray(data.products)) {
          data = data.products;
        } else if (data && Array.isArray(data.data)) {
          data = data.data;
        } else {
          data = [];
        }

        setProducts(data);
      } catch (error) {
        console.error('Search error:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, subCategory]);

  const handleClearSubCategory = () => {
    setSearchParams({ q: query });
  };

  const itemText = loading 
    ? 'Searching...' 
    : `${products.length} item${products.length !== 1 ? 's' : ''} found`;

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      
      <div className="md:hidden flex justify-center items-center border-b border-gray-200 py-3 px-4 bg-white">
        <button className="text-sm font-medium text-black flex items-center gap-1">
          Filters/ Sort <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* 🟢 UPDATED: Faded color + Smaller text (No dance animation) */}
        <div className="flex flex-col gap-1 mb-6">
          {/* text-2xl (chhota), text-gray-500 (fade), hata diya animate-dance */}
          <h1 className="text-2xl font-bold text-gray-500 capitalize inline-block">
            {subCategory || (query ? `"${query}"` : 'Search Results')}
          </h1>

          <div className="flex items-center gap-3 mt-1">
            {subCategory && (
              <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-900 border border-gray-200 shadow-sm transition-all">
                <span>{subCategory}</span>
                <button
                  onClick={handleClearSubCategory}
                  className="p-0.5 text-gray-400 hover:text-black hover:bg-gray-200 rounded-full transition-colors"
                  aria-label="Clear filter"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            <p className="text-sm text-gray-500 font-medium">
              {itemText}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 lg:gap-x-8 lg:gap-y-12 mt-4">
          {loading ? (
            <div className="col-span-2 lg:col-span-3 text-center py-20">
              <p className="text-gray-500">Loading search results...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-2 lg:col-span-3 text-center py-20">
              <h3 className="text-lg font-medium text-gray-900">No results found!</h3>
              <p className="text-gray-500 mt-1 text-sm">Try searching for something else.</p>
            </div>
          ) : (
            products.map((product, index) => (
              <ProductCard 
                key={product._id} 
                id={product._id} 
                title={product.title} 
                price={product.price} 
                image={product.images?.[0] || 'https://placehold.co/600x600/333/fff?text=Product+Image'} 
                badge={index < 2 ? 'NEW' : null} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}