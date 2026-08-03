import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosClient';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH ALL PRODUCTS FROM BACKEND ---
    // --- FETCH ALL PRODUCTS FROM BACKEND ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        
        // --- SAFETY CHECK: Ensure the backend returned an array, otherwise default to empty array ---
        const data = Array.isArray(response.data) ? response.data : [];
        
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        // Prevent the app from crashing by setting an empty array on error
        setProducts([]); 
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --- ADD NEW PRODUCT ---
  const addProduct = async (productData) => {
    try {
      const response = await api.post('/products', productData);
      setProducts((prev) => [response.data, ...prev]);
      return { success: true };
    } catch (error) {
      console.error('Error adding product:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to add product' };
    }
  };

  // --- DELETE PRODUCT ---
  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // --- TOGGLE STOCK STATUS ---
    // --- TOGGLE STOCK STATUS (SAVES TO DATABASE) ---
    // --- TOGGLE STOCK STATUS (DEBUGGING VERSION) ---
  const toggleStock = async (id) => {
    console.log("🔍 DEBUG: toggleStock was clicked with ID:", id); // <-- Does this print?
    
    const product = products.find((p) => p._id === id || p.id === id);
    
    if (!product) {
      console.error("❌ ERROR: Could not find product with ID:", id); // <-- Does this print?
      return;
    }

    console.log("✅ Found product. Current stock:", product.inStock);
    const updatedStock = !product.inStock;

    try {
      // Optimistic UI update
      setProducts((prev) =>
        prev.map((p) => (p._id === id || p.id === id ? { ...p, inStock: updatedStock } : p))
      );

      const response = await api.put(`/products/${id}`, { inStock: updatedStock });

      // Sync with database response
      setProducts((prev) =>
        prev.map((p) => (p._id === id || p.id === id ? response.data : p))
      );
      
    } catch (error) {
      console.error("❌ Backend error:", error.response?.data || error.message);
      // Revert the optimistic update
      setProducts((prev) =>
        prev.map((p) => (p._id === id || p.id === id ? { ...p, inStock: !updatedStock } : p))
      );
    }
  };

    

  return (
    <AdminContext.Provider value={{ products, loading, addProduct, deleteProduct, toggleStock }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}