import React from 'react';

// --- 1. Materials Science Icon (Crystal Structure) ---
const MaterialsIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" fill="none" style={{width: '40px', height: '40px'}}>
    {/* Hexagonal Lattice structure */}
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#7a5c15ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17L12 22L22 17" stroke="#7a5c15ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 7V17" stroke="#7a5c15ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 7V17" stroke="#7a5c15ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 12V22" stroke="#7a5c15ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* Inner glow opacity */}
    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#7a5c15ff" fillOpacity="0.1"/>
    <path d="M2 17L12 22L22 17V7L12 2V12L2 7V17Z" fill="#7a5c15ff" fillOpacity="0.05"/>
  </svg>
);

// --- 2. Embedded Systems Icon (Microchip) ---
const EmbeddedIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" fill="none" style={{width: '40px', height: '40px'}}>
    {/* The Chip Body */}
    <rect x="4" y="4" width="16" height="16" rx="2" stroke="#7a5c15ff" strokeWidth="2"/>
    <rect x="9" y="9" width="6" height="6" fill="#7a5c15ff" fillOpacity="0.2"/>
    
    {/* The Pins (Connectors) */}
    <path d="M9 1V4" stroke="#7a5c15ff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M15 1V4" stroke="#7a5c15ff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 20V23" stroke="#7a5c15ff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M15 20V23" stroke="#7a5c15ff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 9H23" stroke="#7a5c15ff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 15H23" stroke="#7a5c15ff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M1 9H4" stroke="#7a5c15ff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M1 15H4" stroke="#7a5c15ff" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// --- 3. Sustainable Tech Icon (Leaf Circuit) ---
const SustainableIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" fill="none" style={{width: '40px', height: '40px'}}>
    {/* The Leaf */}
    <path d="M12 22C12 22 4 18 4 10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10C20 18 12 22 12 22Z" stroke="#7a5c15ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* The Circuit Veins */}
    <path d="M12 12V22" stroke="#7a5c15ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 12L8 8" stroke="#7a5c15ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 15L16 11" stroke="#7a5c15ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* Tech Node Dots */}
    <circle cx="8" cy="8" r="1.5" fill="#7a5c15ff"/>
    <circle cx="16" cy="11" r="1.5" fill="#7a5c15ff"/>
    
    {/* Slight Fill */}
    <path d="M12 22C12 22 4 18 4 10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10C20 18 12 22 12 22Z" fill="#7a5c15ff" fillOpacity="0.1"/>
  </svg>
);

const About = ({ bio }) => {
  return (
    <section id="about">
      <h2 className="section-title">About Me</h2>
      <p className="section-subtitle">Dedicated to pushing the boundaries of embedded systems</p>
      <div className="about-content">
        <div className="about-text">
          {bio.aboutText.map((paragraph, index) => (
            <p key={index} style={{marginBottom: '1.5rem'}}>{paragraph}</p>
          ))}
        </div>
        
        <div className="about-highlights">
          {/* Highlight 1: Research */}
          <div className="highlight-item">
            <div className="highlight-icon">
              <MaterialsIcon />
            </div>
            <div>
              <strong>Materials Science Research</strong>
              <p>Crystal lattice simulation for next-gen computing</p>
            </div>
          </div>

          {/* Highlight 2: Embedded */}
          <div className="highlight-item">
            <div className="highlight-icon">
              <EmbeddedIcon />
            </div>
            <div>
              <strong>Embedded Systems Expert</strong>
              <p>Firmware optimization & real-time processing</p>
            </div>
          </div>

          {/* Highlight 3: Sustainable */}
          <div className="highlight-item">
            <div className="highlight-icon">
              <SustainableIcon />
            </div>
            <div>
              <strong>Sustainable Technology</strong>
              <p>Solutions that respect our environment</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;