import React, { useEffect, useState } from 'react';
import './App.css';
import SpaceBackground from './components/SpaceBackground';
import About from './components/About';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Hologram from './components/Hologram';
import HackerText from './components/HackerText';
import Terminal from './components/Terminal';

const ServerStatus = () => {
  const [status, setStatus] = useState('⚪ Connecting to server...');
  const [latency, setLatency] = useState(null);

  useEffect(() => {
    const start = Date.now();
    // Use the environment variable so it works on Vercel
    fetch(`${import.meta.env.VITE_API_URL}/api/health`)
      .then(res => {
        if (res.ok) {
            setLatency(Date.now() - start);
            setStatus('🟢 System Online');
        } else {
            setStatus('🟠 System Waking Up...');
        }
      })
      .catch(() => setStatus('🔴 System Offline'));
  }, []);

  return (
    <div style={{ 
        fontSize: '0.85rem', 
        color: 'rgba(255,255,255,0.5)', 
        marginTop: '1rem', 
        fontFamily: 'monospace',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingTop: '0.5rem',
        display: 'inline-block'
    }}>
      STATUS: {status} {latency && `| LATENCY: ${latency}ms`}
    </div>
  );
};

function App() {
  const [data, setData] = useState(null);

  // Fetch data from backend
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/portfolio`)
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error("API Error:", err));
  }, []);

  if (!data) return (
    <div style={{
      height: '100vh',
      background: '#000',
      color: '#c9a961',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }}>
      <SpaceBackground /> {/* Keep the stars while loading! */}
      <div className="glow" style={{fontSize: '2rem'}}>Initializing System...</div>
    </div>
  );

  return (
    <div className="app">
      <SpaceBackground />
      
      {/* Navigation */}
      <nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <Hologram /> {/* Holographic 3D Model Component */}
        <div className="hero-content">
          <h1 className="glow" style={{ minHeight: '80px' }}> {/* minHeight prevents jitter */}
                  <HackerText text={data.bio.name} />
          </h1>
          <p className="subtitle">{data.bio.title}</p>
          <p>{data.bio.description}</p>
          <div className="cta-buttons">
            <a href="#projects" className="btn btn-primary">View Projects</a>
            <a href="#contact" className="btn btn-secondary">Get In Touch</a>
          </div>
        </div>
      </section>

      {/* Components */}
      <About bio={data.bio} />
      <Skills skills={data.skills} />

      {/* Projects Section */}
      <section id="projects">
        <h2 className="section-title">Featured Projects</h2>
        <div className="projects-grid">
            {data.projects.map((project, index) => (
                <div key={index} className="project-card">
                    {project.isFeatured && <span className="featured-badge">⭐ FEATURED</span>}
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-tech">
                        {project.tech.map(t => <span key={t} className="tech-badge">{t}</span>)}
                    </div>
                </div>
            ))}
        </div>
      </section>
      
      <Contact socialLinks={data.socialLinks} />

      <footer>
        <p>&copy; 2024 {data.bio.name}.</p>
        
        {/* Shows server status in footer */}
        <ServerStatus />
      </footer>
      <Terminal /> {/* Terminal Component */}
    </div>
  );
}

export default App;