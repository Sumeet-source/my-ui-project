import React from 'react';
import { Menu, User, Search, ShoppingBag, HelpCircle, ChevronDown } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { PromoCard } from '../components/PromoCard';

const PRODUCTS = [
  {
    featured: true,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    colors: ['#e51b23', '#222', '#f0f0f0'],
    moreColorsCount: 2,
    title: 'UA Project Rock Originators Hoodie',
    price: 17999,
    titleIsLink: true,
  },
  {
    featured: true,
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0975?auto=format&fit=crop&w=600&q=80',
    colors: ['#c8102e', '#333', '#f9f9f9'],
    title: 'UA Men\'s Curry Series 7 Basketball Shoes',
    price: 12599,
    titleIsLink: false,
  },
  {
    featured: false,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    colors: ['#111', '#555'],
    title: 'UA Men\'s Drive Pro Insulated Jacket',
    price: 17999,
    titleIsLink: false,
  },
];

const PROMO_IMAGE = 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80';

export default function MenCategoryPage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      {/* --- Fixed Navbar --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black h-[56px] px-4 flex items-center justify-between">
        <Menu className="w-6 h-6 text-white stroke-2" />
        <User className="w-6 h-6 text-white stroke-2" />
        {/* UA logo placeholder */}
        <div className="flex items-center justify-center w-10 h-10">
          <svg viewBox="0 0 100 100" className="w-9 h-9 fill-white">
            <path d="M50 20 L20 80 L80 80 L50 20Z" />
            <circle cx="50" cy="50" r="15" fill="black" />
          </svg>
        </div>
        <Search className="w-6 h-6 text-white stroke-2" />
        <ShoppingBag className="w-6 h-6 text-white stroke-2" />
      </nav>

      {/* Spacer */}
      <div className="h-[56px]" />

      {/* --- Sub-nav / Filter Bar --- */}
      <div className="flex items-center h-[48px] border-b border-gray-200 bg-white">
        <div className="flex-1 flex items-center justify-center border-r border-gray-200 text-sm font-medium text-black">
          Men <ChevronDown className="w-4 h-4 ml-1 stroke-2" />
        </div>
        <div className="flex-1 flex items-center justify-center text-sm font-medium text-black">
          Filters/ Sort
        </div>
      </div>

      {/* --- Product Grid --- */}
      <div className="max-w-md mx-auto px-2 pt-4">
        <div className="grid grid-cols-2 gap-x-2 gap-y-6">
          {PRODUCTS.map((product, idx) => (
            <ProductCard key={idx} product={product} />
          ))}
          <PromoCard image={PROMO_IMAGE} />
        </div>
      </div>

      {/* --- Floating Help Button --- */}
      <div className="fixed bottom-5 right-4 z-50">
        <button className="bg-black text-white rounded-full px-4 py-2.5 flex items-center gap-1.5 shadow-lg">
          <HelpCircle className="w-4 h-4 stroke-white" />
          <span className="text-sm font-medium">Help</span>
        </button>
      </div>
    </div>
  );
}