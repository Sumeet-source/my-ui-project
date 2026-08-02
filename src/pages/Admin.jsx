import { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Navigate } from 'react-router-dom';
import api from '../api/axiosClient.js'; // Import API client

export default function Admin() {
  const { user, loading } = useAuth();
  const { products, addProduct, deleteProduct, toggleStock } = useAdmin();
  const { showToast } = useToast();
  const [view, setView] = useState('products');
  const [orders, setOrders] = useState([]); // State to hold orders from DB
  
  const [formData, setFormData] = useState({
    title: '', price: '', image: '', category: 'men', inStock: true
  });

  // Fetch orders from the backend when the component loads
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-xl text-gray-600">Loading your dashboard...</div>;
  }
  if (!user || user.email !== 'admin@test.com') {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.image) {
      showToast("Please fill in all fields.", "error");
      return;
    }
    addProduct({ ...formData, price: parseFloat(formData.price) });
    showToast(`${formData.title} added to store!`, 'success');
    setFormData({ title: '', price: '', image: '', category: 'men', inStock: true });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 border-l-4 border-black pl-4">Admin Dashboard</h1>
      
      <div className="flex gap-4 border-b border-gray-200 mb-8 pb-2">
        <button onClick={() => setView('products')} className={`font-semibold transition pb-2 ${view === 'products' ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-black'}`}>Manage Products</button>
        <button onClick={() => setView('orders')} className={`font-semibold transition pb-2 ${view === 'orders' ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-black'}`}>Order History ({orders.length})</button>
      </div>

      {/* Products View */}
      {view === 'products' && (
        <>
          <div className="bg-white p-6 rounded-lg shadow-md mb-12">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label><input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-black" placeholder="e.g. Compression Shorts" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label><input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-black" placeholder="49.99" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label><input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-black" placeholder="https://..." /></div>
              <div className="flex items-center gap-6">
                <div className="flex-1"><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-black"><option value="men">Men</option><option value="women">Women</option><option value="outerwear">Outerwear</option><option value="footwear">Footwear</option></select></div>
                <div className="flex items-center gap-2 pt-5"><input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange} className="w-5 h-5 border-gray-300 rounded focus:ring-black" /><label className="text-sm font-medium text-gray-700">In Stock</label></div>
              </div>
              <div className="md:col-span-2"><button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition">Add Product</button></div>
            </form>
          </div>

          <h2 className="text-xl font-bold mb-4">Manage Existing Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((product) => {
              const avgRating = product.reviews && product.reviews.length > 0 
                ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
                : 'N/A';
              return (
                <div key={product._id || product.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={product.image} alt={product.title} className="w-12 h-12 object-cover rounded" />
                    <div>
                      <h3 className="font-semibold">{product.title}</h3>
                      <p className="text-sm text-gray-500">${product.price}</p>
                      <div className="flex items-center gap-2 text-xs mt-1">
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">⭐ {avgRating !== 'N/A' ? avgRating : 'No reviews'}</span>
                        {avgRating !== 'N/A' && <span className="text-gray-400">({product.reviews.length} reviews)</span>}
                      </div>
                      <span className={`text-xs font-bold ml-2 ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleStock(product._id || product.id)} className={`px-3 py-1 text-xs font-bold rounded transition ${product.inStock ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>{product.inStock ? 'Mark OOS' : 'Mark In Stock'}</button>
                    <button onClick={() => deleteProduct(product._id || product.id)} className="text-red-500 hover:text-red-700 text-sm font-bold">Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Orders View (Now from MongoDB) */}
      {view === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">No orders have been placed yet.</div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b border-gray-200 pb-4">
                    <div>
                      <span className="font-bold text-gray-900">Order #{order._id.slice(-6)}</span>
                      <span className="text-sm text-gray-500 ml-4">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{order.paymentMethod}</span>
                      <span className="font-bold text-lg text-black">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="mb-4 text-sm">
                    <span className="font-semibold text-gray-700">Customer:</span> {order.userEmail || 'Unknown User'}
                    {order.upiId && <span className="ml-4 text-gray-500">UPI: {order.upiId}</span>}
                  </div>
                  <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm text-gray-600">
                        <span>{item.title} {item.size ? `(Size: ${item.size})` : ''} <span className="font-bold">x{item.quantity}</span></span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}