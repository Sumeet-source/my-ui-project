export const products = [
  // --- MEN'S APPAREL ---
  { 
    id: 101, 
    title: "Tech Fleece Hoodie", 
    price: 75.00, 
    originalPrice: 100.00,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80", 
    category: "men", 
    brand: "FORGE", 
    inStock: true, 
    rating: 4.8, 
    colors: ['#333333', '#666666', '#ffffff'],
    reviews: [{ user: "Alex M.", comment: "Super comfortable!", rating: 5 }] 
  },
  { 
    id: 102, 
    title: "Performance Joggers", 
    price: 65.00, 
    originalPrice: 90.00,
    image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=600&q=80", 
    category: "men", 
    brand: "FORGE", 
    inStock: true, 
    rating: 4.5,
    colors: ['#222222', '#444444'],
    reviews: [{ user: "Mike T.", comment: "Very stretchy.", rating: 5 }] 
  },
  { 
    id: 103, 
    title: "Compression Base Layer", 
    price: 50.00, 
    originalPrice: 70.00, 
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80", // UPDATED TO WORKING URL
    category: "men", 
    brand: "Under Armour", 
    inStock: true, 
    rating: 4.8, 
    colors: ['#000000', '#ffffff'], 
    reviews: [{ user: "Tom S.", comment: "Great for cold weather.", rating: 5 }] 
  },
  { 
    id: 104, 
    title: "Performance Training Shorts", 
    price: 35.00, 
    originalPrice: 45.00,
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=600&q=80", 
    category: "men", 
    brand: "Nike", 
    inStock: true, 
    rating: 4.6,
    colors: ['#222222', '#444444', '#888888'],
    reviews: [{ user: "John D.", comment: "Lightweight and cool.", rating: 5 }] 
  },

  // --- WOMEN'S APPAREL ---
  { 
    id: 201, 
    title: "High-Waist Yoga Leggings", 
    price: 55.00, 
    originalPrice: 80.00,
    image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=600&q=80", 
    category: "women", 
    brand: "Lululemon", 
    inStock: true, 
    rating: 4.9, 
    colors: ['#111111', '#888888', '#ffffff'], 
    reviews: [{ user: "Sarah K.", comment: "Best leggings ever!", rating: 5 }] 
  },
  { 
    id: 202, 
    title: "Seamless Sports Bra", 
    price: 45.00, 
    originalPrice: 60.00,
    image: "https://images.unsplash.com/photo-1579722820308-d74e5719000b?auto=format&fit=crop&w=600&q=80", // UPDATED TO WORKING URL
    category: "women", 
    brand: "FORGE", 
    inStock: true, 
    rating: 4.7,
    colors: ['#ff69b4', '#ffffff', '#000000'],
    reviews: [{ user: "Emma W.", comment: "Perfect for running.", rating: 5 }] 
  },
  { 
    id: 203, 
    title: "Lightweight Tank Top", 
    price: 35.00, 
    originalPrice: 45.00,
    image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=600&q=80", // UPDATED TO WORKING URL
    category: "women", 
    brand: "FORGE", 
    inStock: true, 
    rating: 4.9,
    colors: ['#ff69b4', '#ffffff', '#000000'],
    reviews: [{ user: "Chloe B.", comment: "So breathable!", rating: 5 }] 
  },
  // ... (Keep the rest of your products exactly as they are) ...
];