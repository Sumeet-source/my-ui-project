import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import axiosClient from '../api/axiosClient';

export default function AdminDashboard() {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    title: '', 
    price: '', 
    description: '', 
    imageUrl: '', 
    category: 'Men', 
    inStock: true
  });

  // Mount hone par products fetch karo
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axiosClient.get('/api/products');
      setProducts(res.data);
    } catch (error) {
      showToast('Failed to load products', 'error');
    }
  };

  // Inputs change hone par formData update karo
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/api/products', formData);
      showToast('Product added successfully!', 'success');
      fetchProducts();
      setFormData({ title: '', price: '', description: '', imageUrl: '', category: 'Men', inStock: true });
    } catch (error) {
      showToast('Failed to add product', 'error');
    }
  };

  const handleDelete = async (id) => {
    if(!confirm('Are you sure you want to delete this product?')) return;
    try {
      await axiosClient.delete(`/api/products/${id}`);
      showToast('Product deleted', 'info');
      fetchProducts();
    } catch (error) {
      showToast('Failed to delete', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

        {/* Manage Products / Order History tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button className="py-2 px-4 border-b-2 border-black font-semibold">Manage Products</button>
          <button className="py-2 px-4 text-gray-500 hover:text-gray-700">Order History (0)</button>
        </div>

        {/* Add New Product Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900">Product Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Compression Shorts"
                className="mt-1 w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="49.99"
                  className="mt-1 w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900">Image URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="mt-1 w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Product details..."
                className="mt-1 w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black h-20"
              />
            </div>

            <div className="flex items-center gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-black bg-white"
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Outlet">Outlet</option>
                </select>
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleChange}
                  className="h-5 w-5 accent-black"
                />
                <label className="text-sm font-medium">In Stock</label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-10 flex items-center justify-center font-semibold text-white bg-black hover:bg-gray-800 transition"
            >
              Add Product
            </button>
          </form>
        </div>

        {/* Manage Existing Products */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Manage Existing Products</h2>
          {products.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No products found. Add your first product above!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product) => (
                <div key={product._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex gap-4">
                  <img 
                    src={product.imageUrl} 
                    alt={product.title} 
                    className="w-24 h-24 object-cover rounded bg-gray-100"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{product.title}</h3>
                      <p className="text-sm text-gray-600">${product.price}</p>
                      <p className="text-xs text-gray-500 mt-1">{product.description?.slice(0, 50)}...</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.inStock ? 'In Stock' : 'OOS'}
                      </span>
                      <div className="flex gap-2">
                        <button className="text-sm text-red-600 hover:underline" onClick={() => handleDelete(product._id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}