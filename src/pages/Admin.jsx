import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import axiosClient from '../api/axiosClient';

export default function AdminDashboard() {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  
  // --- State for Adding Product ---
  const [formData, setFormData] = useState({
    title: '', 
    price: '', 
    description: '', 
    imageUrl: '', 
    category: 'Men', 
    inStock: true
  });

  // --- State for Editing Product ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '', 
    price: '', 
    description: '', 
    imageUrl: '', 
    category: 'Men', 
    inStock: true
  });

  // --- Fetch Data ---
  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      const res = await axiosClient.get('/api/orders/all');
      setOrders(res.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axiosClient.get('/api/products');
      setProducts(res.data);
    } catch (error) {
      showToast('Failed to load products', 'error');
    }
  };

  // 🟢 NEW: Handle Order Status Update
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axiosClient.put(`/api/orders/${orderId}/status`, { status: newStatus });
      showToast('Order status updated successfully!', 'success');
      fetchOrders(); // List refresh karo
    } catch (error) {
      console.error('Status update error:', error);
      showToast('Failed to update order status', 'error');
    }
  };

  // --- Handlers for Adding Product ---
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

  // --- Handlers for Editing Product ---
  const handleEditClick = (product) => {
    setEditingProductId(product._id);
    setEditFormData({
      title: product.title,
      price: product.price,
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      category: product.category,
      inStock: product.inStock
    });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.put(`/api/products/${editingProductId}`, editFormData);
      showToast('Product updated successfully!', 'success');
      setIsEditModalOpen(false);
      setEditingProductId(null);
      fetchProducts();
    } catch (error) {
      showToast('Failed to update product', 'error');
    }
  };

  // --- Handler for Deleting Product ---
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

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button 
            onClick={() => setActiveTab('products')}
            className={`py-2 px-4 border-b-2 font-semibold transition ${activeTab === 'products' ? 'border-black text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Manage Products
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-4 border-b-2 font-semibold transition ${activeTab === 'orders' ? 'border-black text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Order History ({orders.length})
          </button>
        </div>

        {/* Add New Product Form */}
        {activeTab === 'products' && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
              <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900">Product Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Compression Shorts" className="mt-1 w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-black" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900">Price ($)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="49.99" className="mt-1 w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-black" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900">Image URL</label>
                    <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." className="mt-1 w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-black" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Product details..." className="mt-1 w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black h-20" />
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900">Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="mt-1 h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-black bg-white">
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Shoes">Shoes</option>
                      <option value="Outlet">Outlet</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange} className="h-5 w-5 accent-black" />
                    <label className="text-sm font-medium">In Stock</label>
                  </div>
                </div>
                <button type="submit" className="w-full h-10 flex items-center justify-center font-semibold text-white bg-black hover:bg-gray-800 transition">Add Product</button>
              </form>
            </div>

            {/* Manage Existing Products */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Manage Existing Products</h2>
              {products.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No products found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <div key={product._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex gap-4">
                      <img 
                        src={product.images?.[0] || product.imageUrl || 'https://placehold.co/600x600/333/fff?text=Product+Image'} 
                        alt={product.title} 
                        className="w-24 h-24 object-cover rounded bg-gray-100"
                        onError={(e) => { e.target.src = 'https://placehold.co/600x600/333/fff?text=Image+Error'; }}
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
                            <button onClick={() => handleEditClick(product)} className="text-sm text-blue-600 hover:underline">Edit</button>
                            <button onClick={() => handleDelete(product._id)} className="text-sm text-red-600 hover:underline">Delete</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* 🟢 UPDATED: Order History Tab with Status Dropdown */}
        {activeTab === 'orders' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">All Customer Orders</h2>
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No orders placed yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-2 border-b border-gray-200 pb-2">
                      <span className="font-bold text-gray-900 text-sm">Order #{order._id.slice(-6)}</span>
                      <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="space-y-1 mb-2">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-gray-600">
                          <span>{item.title} {item.size ? `(Size: ${item.size})` : ''} <span className="font-bold">x{item.quantity}</span></span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      {order.items.length > 2 && <p className="text-xs text-gray-400">+ {order.items.length - 2} more items</p>}
                    </div>
                    <div className="flex justify-between items-center mt-2 border-t border-gray-300 pt-2">
                      <span className="font-bold text-sm text-gray-900">Total: ${order.totalAmount.toFixed(2)}</span>
                      
                      {/* 🟢 STATUS DROPDOWN */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-gray-500">Status:</label>
                        <select 
                          value={order.status || 'Pending'} 
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:border-black"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 🟢 EDIT PRODUCT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Product</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div><label className="block text-sm font-semibold text-gray-900">Product Title</label><input type="text" name="title" value={editFormData.title} onChange={handleEditChange} className="mt-1 w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-black" required /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-gray-900">Price ($)</label><input type="number" name="price" value={editFormData.price} onChange={handleEditChange} className="mt-1 w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-black" required /></div>
                <div><label className="block text-sm font-semibold text-gray-900">Image URL</label><input type="text" name="imageUrl" value={editFormData.imageUrl} onChange={handleEditChange} className="mt-1 w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-black" /></div>
              </div>
              <div><label className="block text-sm font-semibold text-gray-900">Description</label><textarea name="description" value={editFormData.description} onChange={handleEditChange} className="mt-1 w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black h-20" /></div>
              <div className="flex items-center gap-6">
                <div className="flex-1"><label className="block text-sm font-semibold text-gray-900">Category</label><select name="category" value={editFormData.category} onChange={handleEditChange} className="mt-1 h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-black bg-white"><option value="Men">Men</option><option value="Women">Women</option><option value="Shoes">Shoes</option><option value="Outlet">Outlet</option></select></div>
                <div className="flex items-center gap-2 mt-6"><input type="checkbox" name="inStock" checked={editFormData.inStock} onChange={handleEditChange} className="h-5 w-5 accent-black" /><label className="text-sm font-medium">In Stock</label></div>
              </div>
              <div className="flex gap-3 pt-2"><button type="submit" className="flex-1 bg-black text-white py-2 rounded font-semibold hover:bg-gray-800 transition">Save Changes</button><button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded font-semibold hover:bg-gray-300 transition">Cancel</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}