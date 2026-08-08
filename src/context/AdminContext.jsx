import { createContext, useContext } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  // Admin ke liye agar koi global state chahiye toh yahan add karo
  const value = {};

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
