import React from 'react';

export function PromoCard({ image }) {
  return (
    <div className="flex flex-col aspect-square">
      <div className="flex-1 bg-gray-100 overflow-hidden">
        <img
          src={image}
          alt="Shop UA Running Gear"
          className="w-full h-full object-cover"
        />
      </div>
      <button className="mt-0 w-full border border-black bg-white text-black text-sm font-semibold py-2.5 text-center rounded-none">
        Shop UA Running Gear
      </button>
    </div>
  );
}