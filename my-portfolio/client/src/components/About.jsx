import React from 'react';

const About = ({ bio }) => {
  return (
<section id="about">
      <h2 className="section-title">About Me</h2>
      <p className="section-subtitle">Dedicated to pushing the boundaries of embedded systems</p>
      <div className="about-content">
        <div className="about-text">
          {/* Map through the array of paragraphs */}
          {bio.aboutText.map((paragraph, index) => (
            <p key={index} style={{marginBottom: '1.5rem'}}>{paragraph}</p>
          ))}
        </div>
        
        <div className="about-highlights">
          {/* Highlight 1: Research */}
          <div className="highlight-item">
            <div className="highlight-icon">
              <svg className="icon-svg" viewBox="0 0 24 24" fill="none">
                 <path d="M12 20L4.67 10.85..." fill="#a58860" fillOpacity="0.24"/>
                 <path d="M12 20L15.5 9..." stroke="#cfad48" strokeWidth="1.4" strokeLinecap="round"/>
                 {/* Note: I've abbreviated the paths here. Copy the full paths from your index.html! */}
              </svg>
            </div>
            <div>
              <strong>Materials Science Research</strong>
              <p>Crystal lattice simulation for next-gen computing</p>
            </div>
          </div>

          {/* Highlight 2: Embedded */}
          <div className="highlight-item">
            <div className="highlight-icon">
              {/* Insert SVG for Embedded Systems here, converting attributes to camelCase */}
            </div>
            <div>
              <strong>Embedded Systems Expert</strong>
              <p>Firmware optimization & real-time processing</p>
            </div>
          </div>

          {/* Highlight 3: Sustainable */}
          <div className="highlight-item">
             {/* ... Insert SVG for Sustainable Tech here ... */}
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