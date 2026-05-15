import React from 'react';

const Ventures = ({ onLaunchSim }) => {
  return (
    <section id="ventures" className="ventures-section">
      <h2 className="section-title">Ventures</h2>
      <p className="section-subtitle">Live projects you can explore right now</p>

      <div className="ventures-grid">
        {/* Crystal Lattice Simulator Card */}
        <div className="venture-card venture-card--lattice">
          <div className="venture-card__glow"></div>
          <div className="venture-card__content">
            <div className="venture-card__label">INTERACTIVE SIMULATION</div>
            <h3 className="venture-card__title">Auraeon Crystal Lattice</h3>
            <p className="venture-card__desc">
              3D crystal structure visualizer with Miller Indices plane slicing, 
              d-spacing calculations, and real-time atom highlighting. 
              Supports FCC, BCC, HCP, and Diamond cubic lattices.
            </p>
            <div className="venture-card__tech">
              <span>React</span><span>Three.js</span><span>R3F</span><span>Physics</span>
            </div>
            <div className="venture-card__actions">
              <a href="/auraeon/" className="btn btn-primary" style={{fontSize:'0.9rem', padding:'10px 24px'}}>
                ↗ Open Live App
              </a>
            </div>
          </div>
          <div className="venture-card__visual venture-card__visual--lattice">
            <svg viewBox="0 0 200 200" className="lattice-svg">
              {/* Simple crystal lattice wireframe illustration */}
              <g stroke="rgba(201,169,97,0.4)" strokeWidth="1" fill="none">
                <line x1="50" y1="50" x2="150" y2="50"/>
                <line x1="50" y1="50" x2="50" y2="150"/>
                <line x1="150" y1="50" x2="150" y2="150"/>
                <line x1="50" y1="150" x2="150" y2="150"/>
                <line x1="80" y1="30" x2="180" y2="30"/>
                <line x1="80" y1="30" x2="80" y2="130"/>
                <line x1="180" y1="30" x2="180" y2="130"/>
                <line x1="80" y1="130" x2="180" y2="130"/>
                <line x1="50" y1="50" x2="80" y2="30"/>
                <line x1="150" y1="50" x2="180" y2="30"/>
                <line x1="50" y1="150" x2="80" y2="130"/>
                <line x1="150" y1="150" x2="180" y2="130"/>
              </g>
              {/* Atom nodes */}
              <g fill="rgba(201,169,97,0.8)">
                <circle cx="50" cy="50" r="5"/><circle cx="150" cy="50" r="5"/>
                <circle cx="50" cy="150" r="5"/><circle cx="150" cy="150" r="5"/>
                <circle cx="80" cy="30" r="4"/><circle cx="180" cy="30" r="4"/>
                <circle cx="80" cy="130" r="4"/><circle cx="180" cy="130" r="4"/>
                <circle cx="100" cy="100" r="6" fill="rgba(212,175,55,0.9)"/>
              </g>
              {/* Miller plane */}
              <polygon points="50,50 150,150 180,130 80,30" fill="rgba(201,169,97,0.08)" stroke="rgba(212,175,55,0.5)" strokeWidth="1.5" strokeDasharray="4,3"/>
            </svg>
          </div>
        </div>

        {/* Auraeon Store Card */}
        <div className="venture-card venture-card--store">
          <div className="venture-card__glow"></div>
          <div className="venture-card__content">
            <div className="venture-card__label">E-COMMERCE BRAND</div>
            <h3 className="venture-card__title">Auraeon</h3>
            <p className="venture-card__desc">
              Outdoor adventure gear, solar-powered essentials, and trail fuel. 
              Built on Shopify with custom theming, print-on-demand integration, 
              and brand identity designed from the ground up.
            </p>
            <div className="venture-card__tech">
              <span>Shopify</span><span>Liquid</span><span>Supliful</span><span>Brand Design</span>
            </div>
            <div className="venture-card__actions">
              <a href="https://auraeon.com" target="_blank" rel="noreferrer" className="btn btn-primary" style={{fontSize:'0.9rem', padding:'10px 24px'}}>
                ↗ Visit Store
              </a>
            </div>
          </div>
          <div className="venture-card__visual venture-card__visual--store">
            <svg viewBox="0 0 200 200" className="store-svg">
              {/* Sun/solar icon */}
              <circle cx="100" cy="80" r="25" fill="none" stroke="rgba(201,169,97,0.5)" strokeWidth="2"/>
              <circle cx="100" cy="80" r="15" fill="rgba(201,169,97,0.15)"/>
              {/* Sun rays */}
              {[0,45,90,135,180,225,270,315].map((angle, i) => {
                const rad = angle * Math.PI / 180;
                const x1 = 100 + Math.cos(rad) * 32;
                const y1 = 80 + Math.sin(rad) * 32;
                const x2 = 100 + Math.cos(rad) * 42;
                const y2 = 80 + Math.sin(rad) * 42;
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(201,169,97,0.4)" strokeWidth="2" strokeLinecap="round"/>;
              })}
              {/* Mountain silhouette */}
              <path d="M20,170 L60,110 L80,130 L120,90 L160,130 L180,170 Z" fill="rgba(201,169,97,0.08)" stroke="rgba(201,169,97,0.3)" strokeWidth="1.5"/>
              {/* Trail */}
              <path d="M90,170 Q100,150 110,155 Q120,160 130,145 Q135,138 140,140" fill="none" stroke="rgba(212,175,55,0.4)" strokeWidth="1.5" strokeDasharray="3,3"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Ventures;
