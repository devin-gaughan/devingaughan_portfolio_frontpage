import React, { useState, useEffect, useRef } from 'react';

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}|;':,./<>?";

const HackerText = ({ text, className }) => {
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef(null);

  const animate = () => {
    let iteration = 0;
    
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplay(prev => 
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(intervalRef.current);
      }

      iteration += 1 / 3; // Controls the speed (higher denominator = slower)
    }, 30);
  };

  // Run animation on mount
  useEffect(() => {
    animate();
  }, [text]);

  return (
    <span 
      className={className} 
      onMouseEnter={animate} // Re-scramble on hover!
      style={{ cursor: 'default', fontFamily: 'monospace' }} 
    >
      {display}
    </span>
  );
};

export default HackerText;