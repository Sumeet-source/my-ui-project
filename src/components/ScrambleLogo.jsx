import { useState, useEffect } from 'react';

export default function ScrambleLogo({ text = "FORGE", delay = 500, className = "" }) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    let interval = null;
    let iterations = 0;
    const maxIterations = 12; 
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        const originalLetters = text.split('');
        const scrambled = originalLetters.map((letter, index) => {
          const progress = iterations / maxIterations;
          const lockedIndex = Math.floor(progress * originalLetters.length);
          
          if (index < lockedIndex) return letter;
          return characters[Math.floor(Math.random() * characters.length)];
        }).join('');

        setDisplayText(scrambled);
        iterations++;

        if (iterations >= maxIterations) {
          clearInterval(interval);
          setDisplayText(text);
        }
      }, 70); 
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, delay]);

  return <span className={className}>{displayText}</span>;
}