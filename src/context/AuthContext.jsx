import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on page load
  useEffect(() => {
    const token = localStorage.getItem('token'); // FIX: 'forge_token' -> 'token'
    const storedUser = localStorage.getItem('user'); // FIX: 'forge_user' -> 'user'
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // --- LOGIN ---
  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password }); // FIX: '/auth' -> '/api/auth'
      const { token, user } = response.data;
      
      // Save to browser storage
      localStorage.setItem('token', token); // FIX: 'forge_token' -> 'token'
      localStorage.setItem('user', JSON.stringify(user)); // FIX: 'forge_user' -> 'user'
      
      setUser(user);
      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };

  // --- SIGNUP ---
  const signup = async (name, email, password) => {
    try {
      const response = await api.post('/api/auth/signup', { name, email, password }); // FIX: '/auth' -> '/api/auth'
      
      return { success: true, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Signup failed.' 
      };
    }
  };

  // --- LOGOUT ---
  const logout = () => {
    localStorage.removeItem('token'); // FIX: 'forge_token' -> 'token'
    localStorage.removeItem('user'); // FIX: 'forge_user' -> 'user'
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}