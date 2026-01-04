import React, { useEffect, useState } from 'react';

const SpaceBackground = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const starCount = 200;
    const newStars = [];

    for (let i = 0; i < starCount; i++) {
      newStars.push({
        id: i,
        size: Math.random() * 2 + 1,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3,
        duration: Math.random() * 3 + 2
      });
    }
    setStars(newStars);
  }, []);

  return (
    <div className="space-bg">
      <div className="stars">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SpaceBackground;