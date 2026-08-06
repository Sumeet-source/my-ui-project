import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';

// --- COMPONENTS ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// --- SAARE PAGES KA IMPORT ---
import Home from './pages/Home';
import Men from './pages/Men';
import Women from './pages/Women';
import Shoes from './pages/Shoes';
import Outlet from './pages/Outlet';
import NewArrivals from './pages/NewArrivals';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Wishlist from './pages/Wishlist';
import Search from './pages/Search';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>
              
              {/* 🟢 Full page flex column layout */}
              <div className="min-h-screen flex flex-col">
                
                <Navbar />
                
                {/* 🟢 flex-1 added here: Ye saari extra space lega aur footer ko neeche push karega */}
                <div className="flex-1">
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
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                  </Routes>
                </div>

                <Footer />
              </div>

            </ToastProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;