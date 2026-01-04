import React, { useEffect, useState } from 'react';
import './App.css';
import SpaceBackground from './components/SpaceBackground';
import About from './components/About';
import Skills from './components/Skills';
import Contact from './components/Contact';

function App() {
  const [data, setData] = useState(null);

  // Fetch data from backend on load
  useEffect(() => {
    fetch('http://localhost:5000/api/portfolio')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error("API Error:", err));
  }, []);

  if (!data) return <div className="loading">Loading assets...</div>;

  return (
    <div className="app">
      <SpaceBackground />
      
      {/* Navigation - Converted to semantic React links if using Router later */}
      <nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

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
        
      <About bio={data.bio} />
      <Skills skills={data.skills} />


      <section id="projects">
        <h2 className="section-title">Featured Projects</h2>
        
        {/* Filter for Featured Project */}
        {data.projects.filter(p => p.isFeatured).map((project, index) => (
            <div key={index} className="featured-project">
                <span className="featured-badge">⭐ CURRENT WORK</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tech">
                    {project.tech.map(t => <span key={t} className="tech-badge">{t}</span>)}
                </div>
            </div>
        ))}

        <div className="projects-grid">
            {/* Filter for non-featured projects */}
            {data.projects.filter(p => !p.isFeatured).map((project, index) => (
                <div key={index} className="project-card">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-tech">
                        {project.tech.map(t => <span key={t} className="tech-badge">{t}</span>)}
                    </div>
                    {project.metric && <p className="project-metric">{project.metric}</p>}
                </div>
            ))}
        </div>
      </section>

      <Contact />
      
      <footer>
        <p>&copy; 2024 {data.bio.name}. Crafted with React & Node.</p>
      </footer>
    </div>
  );
}

export default App;