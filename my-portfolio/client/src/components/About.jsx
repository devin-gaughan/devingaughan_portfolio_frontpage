import React from 'react';

const StackIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" fill="none" style={{width:'40px',height:'40px'}}>
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#7a5c15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17L12 22L22 17" stroke="#7a5c15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke="#7a5c15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#7a5c15" fillOpacity="0.1"/>
  </svg>
);

const ScienceIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" fill="none" style={{width:'40px',height:'40px'}}>
    <path d="M9 3V10L4 19C3.5 20 4.2 21 5.3 21H18.7C19.8 21 20.5 20 20 19L15 10V3" stroke="#7a5c15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 3H15" stroke="#7a5c15" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="10" cy="16" r="1.5" fill="#7a5c15"/>
    <circle cx="14" cy="14" r="1" fill="#7a5c15"/>
    <circle cx="12" cy="17" r="1" fill="#7a5c15" fillOpacity="0.5"/>
    <path d="M4 19C3.5 20 4.2 21 5.3 21H18.7C19.8 21 20.5 20 20 19L15 10H9L4 19Z" fill="#7a5c15" fillOpacity="0.08"/>
  </svg>
);

const OutdoorIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" fill="none" style={{width:'40px',height:'40px'}}>
    <circle cx="12" cy="6" r="4" fill="none" stroke="#7a5c15" strokeWidth="2"/>
    <circle cx="12" cy="6" r="2" fill="#7a5c15" fillOpacity="0.2"/>
    {[0,60,120,180,240,300].map((a, i) => {
      const r = a * Math.PI / 180;
      return <line key={i} x1={12+Math.cos(r)*5.5} y1={6+Math.sin(r)*5.5} x2={12+Math.cos(r)*7.5} y2={6+Math.sin(r)*7.5} stroke="#7a5c15" strokeWidth="2" strokeLinecap="round"/>;
    })}
    <path d="M4 20L9 13L12 16L16 11L20 20Z" fill="#7a5c15" fillOpacity="0.1" stroke="#7a5c15" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

const About = ({ bio }) => {
  return (
    <section id="about">
      <h2 className="section-title">About Me</h2>
      <p className="section-subtitle">Engineer, scientist, explorer</p>
      <div className="about-content">
        <div className="about-text">
          {bio.aboutText.map((paragraph, index) => (
            <p key={index} style={{marginBottom: '1.5rem'}}>{paragraph}</p>
          ))}
        </div>
        <div className="about-highlights">
          <div className="highlight-item">
            <div className="highlight-icon"><StackIcon /></div>
            <div>
              <strong>Full-Stack & Embedded</strong>
              <p>React to bare-metal C, across the whole stack</p>
            </div>
          </div>
          <div className="highlight-item">
            <div className="highlight-icon"><ScienceIcon /></div>
            <div>
              <strong>Scientific Computing</strong>
              <p>Crystal lattice simulation for materials science</p>
            </div>
          </div>
          <div className="highlight-item">
            <div className="highlight-icon"><OutdoorIcon /></div>
            <div>
              <strong>Outdoor & Solar Tech</strong>
              <p>Building the Auraeon adventure brand</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
