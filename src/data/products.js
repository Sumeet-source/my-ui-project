export const products = [
  { 
    id: 1, 
    title: "Tech Fleece Hoodie", 
    price: 75.00, 
    originalPrice: 100.00,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80", 
    category: "outerwear", 
    brand: "FORGE", 
    inStock: true, 
    rating: 4.8, 
    colors: ['#333333', '#666666', '#ffffff'],
    reviews: [{ user: "Alex M.", comment: "Super comfortable!", rating: 5 }] 
  },
  { 
    id: 2, 
    title: "Essential Running Shoe", 
    price: 120.00, 
    originalPrice: 160.00,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80", 
    category: "footwear", 
    brand: "Nike", 
    inStock: true, 
    rating: 4.6,
    colors: ['#cc0000', '#000000', '#ffffff'],
    reviews: [{ user: "David R.", comment: "Great grip!", rating: 5 }] 
  },
  { 
    id: 3, 
    title: "Performance Joggers", 
    price: 65.00, 
    originalPrice: 90.00,
    image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=600&q=80", 
    category: "men", 
    brand: "Adidas", 
    inStock: true, 
    rating: 4.5,
    colors: ['#222222', '#444444'],
    reviews: [{ user: "Mike T.", comment: "Very stretchy.", rating: 5 }] 
  },
  { 
    id: 4, 
    title: "Lightweight Tank Top", 
    price: 35.00, 
    originalPrice: 45.00,
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80", 
    category: "women", 
    brand: "FORGE", 
    inStock: true, 
    rating: 4.9,
    colors: ['#ff69b4', '#ffffff', '#000000'],
    reviews: [{ user: "Chloe B.", comment: "So breathable!", rating: 5 }] 
  },
  // Adding a couple more so the Outlet/Echo pages look populated
  { id: 5, title: "Compression Base Layer", price: 50.00, originalPrice: 70.00, image: "https://images.unsplash.com/photo-1589319318227-43873c8e6873?auto=format&fit=crop&w=600&q=80", category: "men", brand: "Under Armour", inStock: true, rating: 4.8, colors: ['#000000', '#ffffff'], reviews: [{ user: "Tom S.", comment: "Great for cold weather.", rating: 5 }] },
  { id: 6, title: "High-Waist Yoga Leggings", price: 55.00, originalPrice: 80.00, image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=600&q=80", category: "women", brand: "Lululemon", inStock: true, rating: 4.9, colors: ['#111111', '#888888'], reviews: [{ user: "Sarah K.", comment: "Best leggings ever!", rating: 5 }] },
];