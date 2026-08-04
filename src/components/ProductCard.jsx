import React from 'react';
import { Heart, Bell } from 'lucide-react';

export function ProductCard({ product }) {
  const {
    featured,
    image,
    colors,
    moreColorsCount = 0,
    title,
    price,
    titleIsLink = false,
  } = product;

  return (
    <div className="relative bg-white flex flex-col">
      {/* Image container */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-contain"
        />
        {/* Featured badge */}
        {featured && (
          <div className="absolute top-0 left-2 text-[10px] font-bold uppercase tracking-wide text-black leading-tight z-10">
            FEATURED
          </div>
        )}
        {/* Wishlist heart button */}
        <button className="absolute top-2 right-2 w-8 h-8 rounded-full border border-gray-300 bg-white/80 flex items-center justify-center hover:bg-white transition">
          <Heart className="w-4 h-4 stroke-black" />
        </button>
        {/* Notify bell button */}
        <button className="absolute -bottom-4 right-4 w-9 h-9 rounded-full bg-black flex items-center justify-center shadow-md z-10">
          <Bell className="w-4 h-4 stroke-white fill-none" />
        </button>
      </div>

      {/* Color swatches */}
      <div className="pt-3 flex items-center gap-1.5">
        {colors.slice(0, 4).map((color, idx) => (
          <div
            key={idx}
            className="w-4 h-4 rounded-full border border-gray-200"
            style={{ backgroundColor: color }}
          />
        ))}
        {moreColorsCount > 0 && (
          <span className="text-xs text-gray-500 ml-1">
            +{moreColorsCount} More
          </span>
        )}
      </div>

      {/* Title */}
      <div className="mt-1.5">
        {titleIsLink ? (
          <a href="#" className="text-sm text-black underline leading-snug line-clamp-2 hover:no-underline">
            {title}
          </a>
        ) : (
          <p className="text-sm text-black leading-snug line-clamp-2">
            {title}
          </p>
        )}
      </div>

      {/* Price */}
      <div className="text-sm font-bold text-black mt-1">
        ₹{price.toLocaleString('en-IN')}
      </div>
    </div>
  );
}