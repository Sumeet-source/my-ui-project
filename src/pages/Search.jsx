import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import axiosClient from '../api/axiosClient';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await axiosClient.get('/api/products', { params: { q: query } });
        
        // 🟢 FIX: Agar res.data Object hai toh usme se array nikaalo, warna crash ho jayega!
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
  }, [query]);

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      
      <div className="md:hidden flex justify-center items-center border-b border-gray-200 py-3 px-4 bg-white">
        <button className="text-sm font-medium text-black flex items-center gap-1">
          Filters/ Sort <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-2">
          <h1 className="text-xl font-bold text-gray-900">Search Results</h1>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">"{query}"</h2>
          <p className="text-sm text-gray-500 mt-2">{loading ? 'Searching...' : `${products.length} items`}</p>
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
