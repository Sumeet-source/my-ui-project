import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx'; 
import Footer from './Footer.jsx'; 

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}