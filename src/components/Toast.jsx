import { useToast } from '../context/ToastContext.jsx';
import { useState, useEffect } from 'react';

export default function Toast() {
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);

  // Handle the slide-in/slide-out animation
  useEffect(() => {
    if (toast) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 2800);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [toast]);

  if (!toast && !isVisible) return null;

  // Color styling based on the 'type' passed in
  const typeClasses = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
  };

  return (
    <div 
      className={`fixed top-20 right-4 z-[100] px-6 py-4 rounded-lg shadow-xl text-white font-semibold transition-all duration-300 transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      } ${typeClasses[toast?.type] || 'bg-black'}`}
    >
      {toast?.message || 'Action completed'}
    </div>
  );
}