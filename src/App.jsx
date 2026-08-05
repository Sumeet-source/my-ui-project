import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext'; // 🟢 Import karo
import { ToastProvider } from './context/ToastContext';

// ... (Aapke saare pages ke imports yahan hain) ...

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* 🟢 WishlistProvider ko AuthProvider ke andar wrap karo */}
        <WishlistProvider>
          <ToastProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/men" element={<Men />} />
              <Route path="/women" element={<Women />} />
              <Route path="/shoes" element={<Shoes />} />
              <Route path="/outlet" element={<Outlet />} />
              <Route path="/new-arrivals" element={<NewArrivals />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </ToastProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;