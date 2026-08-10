import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import axiosClient from '../api/axiosClient';

export default function Search() {
  // 🟢 setSearchParams bhi import kiya taaki Clean button kaam kare
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const subCategory = searchParams.get('subCategory') || ''; // 🟢 Ye nikaala
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      // 🟢 Agar query aur subCategory dono empty hain toh kuch mat karo
      if (!query && !subCategory) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // 🟢 Params build karna
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
  }, [query, subCategory]); // 🟢 subCategory change hone par bhi fetch chalega

  // Clear button function (Sirf subCategory hatao, agar query hai toh use rahne do)
  const handleClearSubCategory = () => {
    setSearchParams({ q: query });
  };

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      
      <div className="md:hidden flex justify-center items-center border-b border-gray-200 py-3 px-4 bg-white">
        <button className="text-sm font-medium text-black flex items-center gap-1">
          Filters/ Sort <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900">
            {subCategory ? `Showing results for:` : 'Search Results'}
          </h1>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            {query ? `"${query}"` : subCategory ? `${subCategory}` : ''}
          </h2>
          
          {/* 🟢 UI: Agar subCategory active hai toh woh clean Gray Pill dikhega */}
          {subCategory && (
            <div className="mt-3 inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium text-gray-900 shadow-sm border border-gray-100 transition-all">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>{subCategory}</span>
              </span>
              <button
                onClick={handleClearSubCategory}
                className="ml-1 p-1 text-gray-400 hover:text-black hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Clear filter"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <p className="text-sm text-gray-500 mt-3">
            {loading ? 'Searching...' : `${products.length} items found`}
          </p>
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