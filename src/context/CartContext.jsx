import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('shopping_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [discount, setDiscount] = useState({ amount: 0, code: '' });

  // 🟢 NEW STATES FOR POPUP
  const [isAddedToBagOpen, setIsAddedToBagOpen] = useState(false);
  const [addedProductData, setAddedProductData] = useState(null);

  useEffect(() => {
    localStorage.setItem('shopping_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existingItem = prev.find((i) => i.id === item.id && i.size === item.size);
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // 🟢 NEW FUNCTIONS TO HANDLE POPUP
  const openAddedToBag = (product) => {
    setAddedProductData(product);
    setIsAddedToBagOpen(true);
  };

  const closeAddedToBag = () => {
    setIsAddedToBagOpen(false);
    // Data ko thodi der baad clear kar dete hain taaki animation smooth rahe
    setTimeout(() => setAddedProductData(null), 300);
  };

  const removeFromCart = (id, size) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
  };

  const updateQuantity = (id, size, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
    setDiscount({ amount: 0, code: '' });
  };

  const applyDiscount = (amount, code) => {
    setDiscount({ amount, code });
  };

  const clearDiscount = () => {
    setDiscount({ amount: 0, code: '' });
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      getTotalPrice,
      clearCart,
      discount,
      applyDiscount,
      clearDiscount,
      // 🟢 EXPORT NEW POPUP STATES & FUNCTIONS
      isAddedToBagOpen,
      addedProductData,
      openAddedToBag,
      closeAddedToBag
    }}>
      {children}
    </CartContext.Provider>
  );
}

// 🟢 YAHAN YE EXPORT ZAROORI HAI!
export function useCart() {
  return useContext(CartContext);
}