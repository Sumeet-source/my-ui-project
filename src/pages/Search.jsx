import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import axiosClient from '../api/axiosClient'; // 🟢 Import backend API

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  // 🟢 State for live search results and loading
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🟢 Fetch from backend whenever 'query' changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await axiosClient.get('/api/products/search', { params: { q: query } });
        setProducts(res.data);
      } catch (error) {
        console.error('Search error:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      
      {/* --- MOBILE TOP BAR (Filters/Sort) --- */}
      <div className="md:hidden flex justify-center items-center border-b border-gray-200 py-3 px-4 bg-white">
        <button className="text-sm font-medium text-black flex items-center gap-1">
          Filters/ Sort <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* --- SEARCH RESULT HEADER --- */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-2">
          <h1 className="text-xl font-bold text-gray-900">Search Results</h1>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">"{query}"</h2>
          {/* 🟢 Show real count from backend */}
          <p className="text-sm text-gray-500 mt-2">{loading ? 'Searching...' : `${products.length} items`}</p>
        </div>

        {/* --- PRODUCT GRID --- */}
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
                key={product._id} // 🟢 MongoDB uses '_id', not 'id'
                {...product} 
                image={product.images?.[0] || 'https://placehold.co/600x600/333/fff?text=Product+Image'} // 🟢 Safety fix for images
                // Adds the "🔥 NEW" badge to the top 2 items
                badge={index < 2 ? 'NEW' : null} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}