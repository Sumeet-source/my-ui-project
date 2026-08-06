import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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

import Checkout from './pages/Checkout';

// Routes ke andar ye line add karo:
// Cache bust
<Route path="/checkout" element={<Checkout />} />



function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <ToastProvider>
            
            {/* 🟢 NAVBAR KO ROUTES KE BAHAR RAKHO - HAMESHA DIKHEGA */}
            <Navbar />
            
            <div className="min-h-screen flex flex-col">
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
              
              {/* 🟢 FOOTER KO BHI ROUTES KE BAHAR RAKHO */}
              <Footer />
            </div>

          </ToastProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;