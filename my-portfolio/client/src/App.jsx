import React, { useEffect, useState } from 'react';
import './App.css';
import SpaceBackground from './components/SpaceBackground';
import About from './components/About';
import Skills from './components/Skills';
import Contact from './components/Contact';

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
        <div className="hero-content">
          <h1 className="glow">{data.bio.name}</h1>
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
        <p>&copy; 2024 {data.bio.name}. Crafted with React.</p>
      </footer>
    </div>
  );
}

export default App;