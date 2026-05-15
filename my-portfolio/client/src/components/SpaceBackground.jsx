import React, { useEffect, useState } from 'react';

const SpaceBackground = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    // Sparse, varied starfield. Each star has its own slow, decorrelated
    // twinkle period so the overall scene reads as quiet atmosphere
    // rather than coordinated motion.
    const starCount = 85;
    const newStars = [];

    for (let i = 0; i < starCount; i++) {
      // Roughly 1 in 10 stars is warm gold; the rest are platinum-cream.
      // Astronomically realistic and keeps the palette signal alive in the sky.
      const tint = Math.random();
      let color;
      if (tint < 0.10) {
        color = 'warm';   // champagne gold
      } else if (tint < 0.18) {
        color = 'cool';   // pale ice-blue (very rare)
      } else {
        color = 'cream';  // dominant platinum-cream
      }

      newStars.push({
        id: i,
        size: Math.random() * 1.8 + 0.8,     // 0.8 – 2.6 px
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 8,             // 0 – 8 s, decorrelates phases
        duration: Math.random() * 6 + 4,      // 4 – 10 s, slow + varied
        color
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
            className={`star star--${star.color}`}
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
