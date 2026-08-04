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
      className={`
        fixed z-[9999] w-[90%] max-w-md mx-auto px-6 py-4 rounded-lg shadow-xl text-white font-semibold transition-all duration-300
        top-20 left-0 right-0
        md:top-4 md:left-1/2 md:-translate-x-1/2 md:w-auto md:max-w-none md:mx-0
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-[-20px] opacity-0 pointer-events-none'}
        ${typeClasses[toast?.type] || 'bg-black'}
      `}
    >
      {toast?.message || 'Action completed'}
    </div>
  );
}