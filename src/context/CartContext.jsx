import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('shopping_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [coupon, setCoupon] = useState(null);

  const validCoupons = {
    'SAVE10': 10,
    'SAVE20': 20,
    'WELCOME5': 5,
  };

  useEffect(() => {
    localStorage.setItem('shopping_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.title === product.title);
      if (existingItem) {
        return prevCart.map((item) =>
          item.title === product.title
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (title) => {
    setCart((prevCart) => prevCart.filter((item) => item.title !== title));
  };

  // NEW: Update quantity by +1 or -1
  const updateQuantity = (title, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.title === title) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        .filter((item) => item.quantity > 0); // Automatically removes item if quantity hits 0
    });
  };

  const applyCoupon = (code) => {
    const upperCode = code.toUpperCase();
    if (validCoupons[upperCode]) {
      setCoupon({ code: upperCode, discount: validCoupons[upperCode] });
      return true;
    }
    return false;
  };

  const clearCoupon = () => {
    setCoupon(null);
  };

  const getTotalPrice = () => {
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    if (coupon) {
      const discountAmount = subtotal * (coupon.discount / 100);
      return subtotal - discountAmount;
    }
    return subtotal;
  };

  const getDiscountAmount = () => {
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    if (coupon) {
      return subtotal * (coupon.discount / 100);
    }
    return 0;
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
    localStorage.removeItem('shopping_cart');
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, // Added this!
      getTotalPrice, 
      getDiscountAmount, 
      clearCart, 
      coupon, 
      applyCoupon, 
      clearCoupon 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}