import { Routes, Route } from 'react-router-dom';
import { useCart } from './context/CartContext'; 
import AddedToBagPopup from './components/AddedToBagPopup'; 
import ScrollToTop from './components/ScrollToTop'; // 🟢 STEP 1: Import ScrollToTop component

// --- COMPONENTS ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// --- SAARE PAGES KA IMPORT ---
import Home from './pages/Home';
import Men from './pages/Men';
import Women from './pages/Women';
import Shoes from './pages/Shoes';
import Outlet from './pages/Outlet';
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
import Checkout from './pages/Checkout';
import NewArrivalsFixed from './pages/NewArrivalsFixed';

function App() {
  const { isAddedToBagOpen, addedProductData, closeAddedToBag } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-white">
        
        {/* 🟢 STEP 2: YEH LINE ADD KARO (Routes ke bilkul upar) */}
        <ScrollToTop /> 

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/men" element={<Men />} />
          <Route path="/women" element={<Women />} />
          <Route path="/shoes" element={<Shoes />} />
          <Route path="/outlet" element={<Outlet />} />
          <Route path="/new-arrivals" element={<NewArrivalsFixed />} />
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
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
      <Footer />

      <AddedToBagPopup 
        isOpen={isAddedToBagOpen} 
        closePopup={closeAddedToBag} 
        productData={addedProductData} 
      />
    </div>
  );
}

export default App;