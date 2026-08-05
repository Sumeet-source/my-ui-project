import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  const fetchNewArrivals = async () => {
    try {
      const res = await axiosClient.get('/api/products');
      const sortedProducts = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);
      setProducts(sortedProducts);
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">New Arrivals 🔥</h1>
      {loading ? (
        <p className="text-center py-10 text-gray-500">Loading new arrivals...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <p className="col-span-full text-center py-10 text-gray-500">No new arrivals found.</p>
          ) : (
            products.map((product) => (
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
    </div>
  );
}