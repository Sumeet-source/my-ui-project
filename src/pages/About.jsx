export default function About() {
  return (
    <div className="font-sans">
      {/* Mission Header */}
      <section className="relative py-20 bg-black text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-extrabold uppercase tracking-widest mb-4">Our Story</h1>
          <p className="text-xl font-light text-gray-300 max-w-2xl mx-auto">
            Born from the relentless pursuit of better. We build high-performance gear that empowers athletes to push past their limits.
          </p>
        </div>
      </section>

      {/* Brand Values */}
      <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1">
          <img 
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80" 
            alt="Athletes training" 
            className="w-full h-96 object-cover rounded-xl shadow-xl"
          />
        </div>
        <div className="flex-1 space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Engineered for the Grind</h2>
          <p className="text-gray-600 leading-relaxed">
            From the drawing board to the field, our philosophy is simple: if it doesn't make you faster, stronger, or more resilient, we don't make it. Our materials are tested by elite athletes to ensure they hold up under the toughest conditions.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-100">
              <span className="block text-2xl font-bold text-black">10+</span>
              <span className="text-sm text-gray-500">Years of Innovation</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-100">
              <span className="block text-2xl font-bold text-black">50M+</span>
              <span className="text-sm text-gray-500">Athletes Empowered</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}