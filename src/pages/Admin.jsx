import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import axiosClient from '../api/axiosClient';

// 🟢 NEW: Sub-Category Mapping
const SUB_CATEGORY_MAP = {
  Clothing: ['T-Shirts', 'Polos', 'Shirts', 'Jeans', 'Trousers', 'Jackets', 'Sweatshirts', 'Hoodies', 'Shorts', 'Track Pants'],
  Shoes: ['Sneakers', 'Running Shoes', 'Casual Shoes', 'Formal Shoes', 'Loafers', 'Boots', 'Sandals'],
  Accessories: ['Watches', 'Sunglasses', 'Belts', 'Wallets', 'Caps & Hats', 'Backpacks', 'Socks', 'Ties', 'Cufflinks'],
};

export default function AdminDashboard() {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '', 
    price: '', 
    description: '', 
    imageUrl: '', 
    category: 'Men', 
    subCategory: '', 
    inStock: true
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '', 
    price: '', 
    description: '', 
    imageUrl: '', 
    category: 'Men', 
    subCategory: '', 
    inStock: true
  });

  const [couponFormData, setCouponFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderValue: '',
    expiresAt: '',
    usageLimit: 1
  });
  const [creatingCoupon, setCreatingCoupon] = useState(false);

  // 🟢 NEW: Pincode Management State
  const [deliveryPincodes, setDeliveryPincodes] = useState([]);
  const [loadingPincodes, setLoadingPincodes] = useState(false);
  const [pincodeForm, setPincodeForm] = useState({ pincode: '', city: '', state: '', isActive: true });
  const [isEditPincode, setIsEditPincode] = useState(false);
  const [editingPincodeId, setEditingPincodeId] = useState(null);

  const [customToast, setCustomToast] = useState({ show: false, message: '', type: 'success' });
  const triggerCustomToast = (message, type = 'success') => {
    setCustomToast({ show: true, message, type });
    setTimeout(() => setCustomToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // --- Fetch Data ---
  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchDeliveryPincodes();
  }, []);

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'delivery') fetchDeliveryPincodes();
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      const res = await axiosClient.get('/api/orders/all');
      let data = res.data;
      if (Array.isArray(data)) data = data;
      else if (data && Array.isArray(data.orders)) data = data.orders;
      else if (data && Array.isArray(data.data)) data = data.data;
      else data = [];
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      showToast('Failed to load orders', 'error');
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axiosClient.get('/api/products');
      let data = res.data;
      if (Array.isArray(data)) data = data;
      else if (data && Array.isArray(data.products)) data = data.products;
      else if (data && Array.isArray(data.data)) data = data.data;
      else data = [];
      setProducts(data);
    } catch (error) {
      showToast('Failed to load products', 'error');
    }
  };

  // 🟢 NEW: Fetch Delivery Pincodes
  const fetchDeliveryPincodes = async () => {
    setLoadingPincodes(true);
    try {
      const res = await axiosClient.get('/api/delivery/all');
      setDeliveryPincodes(res.data);
    } catch (error) {
      showToast('Failed to load pincodes', 'error');
    } finally {
      setLoadingPincodes(false);
    }
  };

  // --- Product / Coupon Logic (same as before) ---
  const handleImageUpload = async (e, setter, field = 'imageUrl') => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData(); formData.append('image', file);
    try {
      const res = await axiosClient.post('/api/admin/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setter(prev => ({ ...prev, [field]: res.data.secure_url }));
      showToast('Image uploaded successfully!', 'success');
    } catch (error) { showToast('Failed to upload image', 'error'); } finally { setUploading(false); }
  };

  const handleEditImageUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(true);
    const formData = new FormData(); formData.append('image', file);
    try {
      const res = await axiosClient.post('/api/admin/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setEditFormData(prev => ({ ...prev, imageUrl: res.data.secure_url }));
      showToast('Image uploaded successfully!', 'success');
    } catch (error) { showToast('Failed to upload image', 'error'); } finally { setUploading(false); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'category' && { subCategory: '' })
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (uploading) { showToast('Please wait, image is still uploading!', 'warning'); return; }
    if (!formData.imageUrl) { showToast('Please select and upload an image first!', 'warning'); return; }
    try {
      const dataToSend = { ...formData, images: [formData.imageUrl] };
      await axiosClient.post('/api/products', dataToSend);
      showToast('Product added successfully!', 'success');
      fetchProducts();
      setFormData({ title: '', price: '', description: '', imageUrl: '', category: 'Men', subCategory: '', inStock: true });
    } catch (error) { showToast('Failed to add product', 'error'); }
  };

  const handleEditClick = (product) => {
    setEditingProductId(product._id);
    setEditFormData({
      title: product.title, price: product.price, description: product.description || '',
      imageUrl: product.imageUrl || '', category: product.category, subCategory: product.subCategory || '', inStock: product.inStock
    });
    setIsEditModalOpen(true);
  };
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'category' && { subCategory: '' })
    }));
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (uploading) { showToast('Please wait, image is still uploading!', 'warning'); return; }
    try {
      const dataToSend = { ...editFormData, images: editFormData.imageUrl ? [editFormData.imageUrl] : [] };
      await axiosClient.put(`/api/products/${editingProductId}`, dataToSend);
      showToast('Product updated successfully!', 'success');
      setIsEditModalOpen(false); setEditingProductId(null); fetchProducts();
    } catch (error) { showToast('Failed to update product', 'error'); }
  };
  const handleDelete = async (id) => {
    if(!confirm('Are you sure you want to delete this product?')) return;
    try { await axiosClient.delete(`/api/products/${id}`); showToast('Product deleted', 'info'); fetchProducts(); } catch (error) { showToast('Failed to delete', 'error'); }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try { await axiosClient.put(`/api/orders/${orderId}/status`, { status: newStatus }); showToast('Order status updated successfully!', 'success'); fetchOrders(); } catch (error) { console.error('Failed to update order status:', error); showToast('Failed to update order status', 'error'); }
  };

  const handleCouponChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCouponFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!couponFormData.code || !couponFormData.discountValue || !couponFormData.expiresAt) {
      triggerCustomToast('Please fill in Code, Value, and Expiry Date', 'warning'); return;
    }
    setCreatingCoupon(true);
    try {
      await axiosClient.post('/api/coupons/create', couponFormData);
      triggerCustomToast('Coupon created successfully!', 'success');
      showToast('Coupon created successfully!', 'success');
      setCouponFormData({ code: '', discountType: 'percentage', discountValue: '', minOrderValue: '', expiresAt: '', usageLimit: 1 });
    } catch (error) { triggerCustomToast(error.response?.data?.message || 'Failed to create coupon', 'error'); } finally { setCreatingCoupon(false); }
  };

  // 🟢 NEW: Pincode Handlers
  const handlePincodeChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPincodeForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const handlePincodeSubmit = async (e) => {
    e.preventDefault();
    if (!pincodeForm.pincode || pincodeForm.pincode.length !== 6) {
      triggerCustomToast('Please enter a valid 6-digit pincode', 'error');
      return;
    }
    try {
      if (isEditPincode) {
        await axiosClient.put(`/api/delivery/${editingPincodeId}`, pincodeForm);
        triggerCustomToast('Pincode updated successfully!', 'success');
      } else {
        await axiosClient.post('/api/delivery/add', pincodeForm);
        triggerCustomToast('Pincode added successfully!', 'success');
      }
      setIsEditPincode(false); setEditingPincodeId(null);
      setPincodeForm({ pincode: '', city: '', state: '', isActive: true });
      fetchDeliveryPincodes();
    } catch (error) { triggerCustomToast(error.response?.data?.message || 'Failed to save pincode', 'error'); }
  };
  const handleEditPincode = (p) => {
    setIsEditPincode(true);
    setEditingPincodeId(p.pincode);
    setPincodeForm({ pincode: p.pincode, city: p.city || '', state: p.state || '', isActive: p.isActive });
  };
  const handleDeletePincode = async (pincode) => {
    if (!confirm(`Are you sure you want to delete pincode ${pincode}?`)) return;
    try { await axiosClient.delete(`/api/delivery/${pincode}`); triggerCustomToast('Pincode deleted!', 'info'); fetchDeliveryPincodes(); } catch (error) { triggerCustomToast('Failed to delete pincode', 'error'); }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {customToast.show && (
          <div className={`fixed top-4 left-0 right-0 mx-auto w-max z-[99999] px-6 py-3 rounded-xl shadow-2xl text-white font-bold text-center transition-all duration-300 border border-white/20 backdrop-blur-sm ${customToast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {customToast.message}
          </div>
        )}

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
          <button onClick={() => setActiveTab('products')} className={`py-2 px-4 border-b-2 font-semibold transition ${activeTab === 'products' ? 'border-black text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Manage Products</button>
          <button onClick={() => setActiveTab('orders')} className={`py-2 px-4 border-b-2 font-semibold transition ${activeTab === 'orders' ? 'border-black text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Order History ({orders.length})</button>
          <button onClick={() => setActiveTab('coupons')} className={`py-2 px-4 border-b-2 font-semibold transition ${activeTab === 'coupons' ? 'border-black text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Manage Coupons</button>
          <button onClick={() => setActiveTab('delivery')} className={`py-2 px-4 border-b-2 font-semibold transition ${activeTab === 'delivery' ? 'border-black text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Manage Delivery</button>
        </div>

        {activeTab === 'products' && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
              <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                {/* Same Product Form as before */}
                <div><label className="block text-sm font-semibold text-gray-900">Product Title</label><input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Compression Shorts" className="mt-1 w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-black" required /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-semibold text-gray-900">Price ($)</label><input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="49.99" className="mt-1 w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-black" required /></div>
                  <div><label className="block text-sm font-semibold text-gray-900">Product Image</label><div className="flex items-center gap-2 mt-1"><input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setFormData)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-black file:text-white hover:file:bg-gray-800" />{uploading && <span className="text-sm text-gray-500 animate-pulse">Uploading...</span>}</div>{formData.imageUrl && <p className="text-xs text-green-600 mt-1">Image uploaded successfully!</p>}</div>
                </div>
                <div><label className="block text-sm font-semibold text-gray-900">Description</label><textarea name="description" value={formData.description} onChange={handleChange} placeholder="Product details..." className="mt-1 w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black h-20" /></div>
                <div className="flex items-center gap-6">
                  <div><label className="block text-sm font-semibold text-gray-900">Category</label><select name="category" value={formData.category} onChange={handleChange} className="mt-1 h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-black bg-white"><option value="Men">Men</option><option value="Women">Women</option><option value="Shoes">Shoes</option><option value="Accessories">Accessories</option></select></div>
                  <div className="flex items-center gap-2 mt-6"><input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange} className="h-5 w-5 accent-black" /><label className="text-sm font-medium">In Stock</label></div>
                </div>
                {formData.category && SUB_CATEGORY_MAP[formData.category] && (
                  <div><label className="block text-sm font-semibold text-gray-900">Sub-Category</label><select name="subCategory" value={formData.subCategory} onChange={handleChange} className="mt-1 w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-black bg-white"><option value="">Select Sub-Category</option>{SUB_CATEGORY_MAP[formData.category].map((sub) => <option key={sub} value={sub}>{sub}</option>)}</select></div>
                )}
                <button type="submit" disabled={uploading} className={`w-full h-10 flex items-center justify-center font-semibold text-white bg-black hover:bg-gray-800 transition ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>{uploading ? 'Uploading...' : 'Add Product'}</button>
              </form>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Manage Existing Products</h2>
              {products.length === 0 ? (<p className="text-gray-500 text-center py-8">No products found.</p>) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <div key={product._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex gap-4">
                      <img src={product.images?.[0] || product.imageUrl || 'https://placehold.co/600x600/333/fff?text=Product+Image'} alt={product.title} className="w-24 h-24 object-cover rounded bg-gray-100" onError={(e) => { e.target.src = 'https://placehold.co/600x600/333/fff?text=Image+Error'; }} />
                      <div className="flex-1 flex flex-col justify-between">
                        <div><h3 className="font-medium text-gray-900">{product.title}</h3><p className="text-sm text-gray-600">${product.price}</p><p className="text-xs text-gray-500 mt-1">{product.description?.slice(0, 50)}...</p></div>
                        <div className="flex items-center justify-between gap-3 mt-4"><span className="text-xs text-gray-500">{product.category}</span><div className="flex gap-2"><button onClick={() => handleEditClick(product)} className="px-3 py-1 text-sm font-semibold text-white bg-black rounded hover:bg-gray-800 transition">Edit</button><button onClick={() => handleDelete(product._id)} className="px-3 py-1 text-sm font-semibold text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition">Delete</button></div></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

                {activeTab === 'orders' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Order History</h2>
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No orders found.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id || order.id} className="p-4 border border-gray-200 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      {/* 🟢 UPDATED: Customer Details Added Here */}
                      <p className="font-medium text-gray-900">Order #{order._id || order.id}</p>
                      
                      {/* Customer Info */}
                      <div className="mt-1 space-y-0.5">
                        <p className="text-xs text-gray-700">
                          <span className="font-semibold">Customer:</span> {order.shippingAddress?.fullName || order.user?.name || 'Guest'}
                        </p>
                        <p className="text-xs text-gray-700">
                          <span className="font-semibold">Phone:</span> {order.shippingAddress?.phone || 'N/A'}
                        </p>
                      </div>

                      <p className="text-sm text-gray-600 mt-1">Total: ${order.totalAmount ?? order.total ?? order.amount ?? '0.00'}</p>
                      <p className="text-xs text-gray-500">Current: {order.status ?? 'Pending'}</p>
                    </div>
                    
                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <select 
                        value={order.status || 'Pending'} 
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-black"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}        {activeTab === 'orders' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Order History</h2>
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No orders found.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id || order.id} className="p-4 border border-gray-200 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      {/* 🟢 UPDATED: Customer Details Added Here */}
                      <p className="font-medium text-gray-900">Order #{order._id || order.id}</p>
                      
                      {/* Customer Info */}
                      <div className="mt-1 space-y-0.5">
                        <p className="text-xs text-gray-700">
                          <span className="font-semibold">Customer:</span> {order.shippingAddress?.fullName || order.user?.name || 'Guest'}
                        </p>
                        <p className="text-xs text-gray-700">
                          <span className="font-semibold">Phone:</span> {order.shippingAddress?.phone || 'N/A'}
                        </p>
                      </div>

                      <p className="text-sm text-gray-600 mt-1">Total: ${order.totalAmount ?? order.total ?? order.amount ?? '0.00'}</p>
                      <p className="text-xs text-gray-500">Current: {order.status ?? 'Pending'}</p>
                    </div>
                    
                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <select 
                        value={order.status || 'Pending'} 
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-black"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'coupons' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Manage Coupons</h2>
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-gray-900">Coupon Code</label><input type="text" name="code" value={couponFormData.code} onChange={handleCouponChange} placeholder="e.g. TEST20" className="mt-1 w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-black uppercase" required /></div>
                <div><label className="block text-sm font-semibold text-gray-900">Discount Type</label><select name="discountType" value={couponFormData.discountType} onChange={handleCouponChange} className="mt-1 w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-black bg-white"><option value="percentage">Percentage (%)</option><option value="flat">Flat ($)</option></select></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-gray-900">Discount Value</label><input type="number" name="discountValue" value={couponFormData.discountValue} onChange={handleCouponChange} placeholder={couponFormData.discountType === 'percentage' ? 'e.g. 20' : 'e.g. 50'} className="mt-1 w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-black" required /></div>
                <div><label className="block text-sm font-semibold text-gray-900">Min Order Value ($)</label><input type="number" name="minOrderValue" value={couponFormData.minOrderValue} onChange={handleCouponChange} placeholder="e.g. 100" className="mt-1 w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-black" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-gray-900">Expiry Date</label><input type="date" name="expiresAt" value={couponFormData.expiresAt} onChange={handleCouponChange} className="mt-1 w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-black" required /></div>
                <div><label className="block text-sm font-semibold text-gray-900">Usage Limit</label><input type="number" name="usageLimit" value={couponFormData.usageLimit} onChange={handleCouponChange} placeholder="e.g. 10" className="mt-1 w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-black" /></div>
              </div>
              <button type="submit" disabled={creatingCoupon} className={`w-full h-10 flex items-center justify-center font-semibold text-white bg-black hover:bg-gray-800 transition ${creatingCoupon ? 'opacity-50 cursor-not-allowed' : ''}`}>{creatingCoupon ? 'Creating Coupon...' : 'Create Coupon'}</button>
            </form>
          </div>
        )}

        {/* 🟢 NEW: DELIVERY MANAGEMENT TAB */}
        {activeTab === 'delivery' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Manage Delivery Pincodes</h2>
            
            <form onSubmit={handlePincodeSubmit} className="space-y-4 mb-6 border-b border-gray-100 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900">Pincode</label>
                  <input type="text" name="pincode" value={pincodeForm.pincode} onChange={handlePincodeChange} placeholder="e.g. 452010" className="mt-1 w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-black" required disabled={isEditPincode} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900">City</label>
                  <input type="text" name="city" value={pincodeForm.city} onChange={handlePincodeChange} placeholder="Indore" className="mt-1 w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900">State</label>
                  <input type="text" name="state" value={pincodeForm.state} onChange={handlePincodeChange} placeholder="MP" className="mt-1 w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-black" />
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="isActive" checked={pincodeForm.isActive} onChange={handlePincodeChange} className="w-5 h-5 accent-black" />
                  <span className="text-sm font-medium">Active (Deliverable)</span>
                </label>
                <button type="submit" className="px-6 py-2 bg-black text-white text-sm font-semibold rounded hover:bg-gray-800 transition">
                  {isEditPincode ? 'Update Pincode' : 'Add Pincode'}
                </button>
                {isEditPincode && (
                  <button type="button" onClick={() => { setIsEditPincode(false); setEditingPincodeId(null); setPincodeForm({ pincode: '', city: '', state: '', isActive: true }); }} className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-semibold rounded hover:bg-gray-300 transition">
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {loadingPincodes ? (
              <p className="text-center py-4 text-gray-500">Loading pincodes...</p>
            ) : (
              <div className="space-y-2">
                {deliveryPincodes.length === 0 ? (
                  <p className="text-center py-4 text-gray-500">No pincodes added yet.</p>
                ) : (
                  deliveryPincodes.map((p) => (
                    <div key={p.pincode} className="flex items-center justify-between p-3 border border-gray-100 rounded bg-gray-50">
                      <div className="flex gap-4 text-sm">
                        <span className="font-bold w-24">{p.pincode}</span>
                        <span className="w-32">{p.city || '-'}</span>
                        <span className="w-32">{p.state || '-'}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {p.isActive ? 'Active' : 'Blocked'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditPincode(p)} className="text-xs text-blue-600 hover:underline">Edit</button>
                        <button onClick={() => handleDeletePincode(p.pincode)} className="text-xs text-red-600 hover:underline">Delete</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-4">Edit Product</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div><label className="block text-sm font-semibold">Title</label><input type="text" name="title" value={editFormData.title} onChange={handleEditChange} className="mt-1 w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-black" required /></div>
                <div><label className="block text-sm font-semibold">Price ($)</label><input type="number" name="price" value={editFormData.price} onChange={handleEditChange} className="mt-1 w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-black" required /></div>
                <div><label className="block text-sm font-semibold">Image</label><div className="flex items-center gap-2 mt-1"><input type="file" accept="image/*" onChange={(e) => handleEditImageUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-black file:text-white hover:file:bg-gray-800" />{uploading && <span className="text-sm text-gray-500 animate-pulse">Uploading...</span>}</div>{editFormData.imageUrl && <p className="text-xs text-green-600 mt-1">Image uploaded successfully!</p>}</div>
                <div><label className="block text-sm font-semibold">Description</label><textarea name="description" value={editFormData.description} onChange={handleEditChange} className="mt-1 w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black h-20" /></div>
                <div className="flex items-center gap-6">
                  <div><label className="block text-sm font-semibold">Category</label><select name="category" value={editFormData.category} onChange={handleEditChange} className="mt-1 h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-black bg-white"><option value="Men">Men</option><option value="Women">Women</option><option value="Shoes">Shoes</option><option value="Accessories">Accessories</option></select></div>
                  <div className="flex items-center gap-2 mt-6"><input type="checkbox" name="inStock" checked={editFormData.inStock} onChange={handleEditChange} className="h-5 w-5 accent-black" /><label className="text-sm font-medium">In Stock</label></div>
                </div>
                {editFormData.category && SUB_CATEGORY_MAP[editFormData.category] && (
                  <div><label className="block text-sm font-semibold text-gray-900">Sub-Category</label><select name="subCategory" value={editFormData.subCategory} onChange={handleEditChange} className="mt-1 w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-black bg-white"><option value="">Select Sub-Category</option>{SUB_CATEGORY_MAP[editFormData.category].map((sub) => <option key={sub} value={sub}>{sub}</option>)}</select></div>
                )}
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={uploading} className={`flex-1 h-10 bg-black text-white font-semibold rounded hover:bg-gray-800 transition ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>{uploading ? 'Uploading...' : 'Update Product'}</button>
                  <button type="button" onClick={() => { setIsEditModalOpen(false); setEditingProductId(null); }} className="flex-1 h-10 bg-gray-200 text-gray-800 font-semibold rounded hover:bg-gray-300 transition">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
