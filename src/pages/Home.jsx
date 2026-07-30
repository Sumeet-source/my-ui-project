import { useState } from 'react';

export default function Home() {
  const [count, setCount] = useState(0)

  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-6 py-20 max-w-6xl mx-auto gap-10">
      <div className="flex-1">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Build Amazing UIs
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          This is running on React, Vite, and Tailwind CSS!
          <br />Button clicked: {count} times
        </p>
        <button 
          onClick={() => setCount(count + 1)}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition shadow-lg"
        >
          Get Started
        </button>
      </div>
      <div className="flex-1">
        <img 
          src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
          alt="Coding workspace" 
          className="w-full h-64 md:h-80 rounded-xl object-cover shadow-lg"
        />
      </div>
    </section>
  );
}