import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import FilterDrawer from '../components/FilterDrawer';

export default function Outlet() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchOutletProducts();
  }, []);

  const fetchOutletProducts = async () => {
    try {
      // 🟢 Backend ko category filter bhej rahe hain
      const res = await axiosClient.get('/api/products', { params: { category: 'Outlet' } });
      
      // 🟢 SAFETY CHECK
      if (Array.isArray(res.data)) {
        setProducts(res.data);
        setFilteredProducts(res.data);
      } else {
        console.warn('Received non-array data:', res.data);
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error('Error fetching outlet products:', error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (filters) => {
    let result = [...(Array.isArray(products) ? products : [])];

    if (filters.sort === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (filters.sort === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (filters.sort === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (filters.gender) {
      result = result.filter(p => p.title.toLowerCase().includes(filters.gender.toLowerCase()));
    }

    if (filters.price === '0-50') result = result.filter(p => p.price < 50);
    else if (filters.price === '50-100') result = result.filter(p => p.price >= 50 && p.price <= 100);
    else if (filters.price === '100+') result = result.filter(p => p.price > 100);

    setFilteredProducts(result);
  };

  const clearFilters = () => setFilteredProducts(products);

  return (
    <div className="p-6 md:p-10 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">FORGE Outlet</h1>
        <button onClick={() => setIsFilterOpen(true)} className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded text-sm font-medium hover:bg-gray-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          Filters / Sort
        </button>
      </div>

      {loading ? (
        <p className="text-center py-10 text-gray-500">Loading products...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredProducts.length === 0 ? (
            <p className="col-span-full text-center py-10 text-gray-500">No products match your filters.</p>
          ) : (
            filteredProducts.map((product) => (
              <Link to={`/product/${product._id}`} key={product._id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square">
                  <img 
                    src={product.images?.[0] || 'https://placehold.co/600x600/333/fff?text=Product+Image'} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => { e.target.src = 'https://placehold.co/600x600/333/fff?text=Image+Error'; }}
                  />
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
      )}

      <FilterDrawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApply={applyFilters} onClear={clearFilters} />
    </div>
  );
}