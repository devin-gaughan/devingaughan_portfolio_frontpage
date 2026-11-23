import React, { useState } from 'react';
import './App.css';
import SpaceBackground from './components/SpaceBackground';
import About from './components/About';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Ventures from './components/Ventures';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import Library from './components/Library';
import Assessment from './components/Assessment';
import Academics from './components/Academics';

// GitHub Pages SPA: 404.html redirects unknown paths to /?p=/original-path
function getRoutePath() {
  const params = new URLSearchParams(window.location.search);
  const redirected = params.get('p');
  if (redirected) {
    window.history.replaceState(null, '', redirected);
    return redirected;
  }
  return window.location.pathname;
}

const portfolioData = {
  bio: {
    name: "Devin Gaughan",
    title: "SOFTWARE DEVELOPER",
    description: "Computer science student and developer building interactive simulations, games and tools about physical systems, from crystal lattices to neutrino event displays.",
    aboutText: [
      "I'm Devin Gaughan, a computer science student at Oregon State University. Before that I spent more than five years as a firmware and hardware test technician at Hewlett-Packard and Intel, running firmware test suites on Linux and diagnosing firmware and hardware issues alongside engineers.",
      "My own projects are mostly React and Three.js front ends with Python and FastAPI behind them, plus C and C++ from coursework. I'm drawn to problems where software meets the physical world: crystal structures, particle detectors, sound and light.",
      "Outside of code, I'm driven by chemistry, physics, and the outdoors. I publish my projects under the name Auraeon Studios, and the Auraeon store sells printable study notes, planners and solar guides. I speak English, Thai, and Japanese."
    ]
  },
  skills: [
    { category: "Frontend", tags: ["React", "Three.js", "JavaScript", "TypeScript", "HTML5/CSS3", "Vite"] },
    { category: "Backend & Data", tags: ["Python", "FastAPI", "Node.js", "SQL/PostgreSQL", "REST APIs"] },
    { category: "Systems & Languages", tags: ["C", "C++", "C#", "Linux", "Bash/PowerShell"] },
    { category: "Tools", tags: ["Git", "GitHub Actions", "JIRA", "Docker", "Godot"] },
    { category: "Test & Hardware", tags: ["Firmware & BIOS Flashing", "Regression Testing", "Test Automation Scripts", "Hardware Validation", "RF Lab Support"] },
    { category: "Scientific & AI", tags: ["Physics Simulation", "Crystal Structure Visualization", "3D Visualization", "LLM APIs"] }
  ],
  projects: [
    { title: "Titania: Crystal Lattice Simulator", description: "Interactive 3D crystal structure visualizer with Miller Indices plane slicing, d-spacing calculations, and atom highlighting. Built with React, Three.js, and React Three Fiber.", tech: ["React", "Three.js", "R3F", "Vite", "Scientific Computing"], metric: "Real-time crystallography in the browser", isFeatured: true, link: "https://devingaughan.com/auraeon", linkLabel: "Open Live App", writeup: "/writing/titania-crystal-from-two-arrays.html" },
    { title: "Auraeon Storefront", description: "Online store for printable study notes, planners, night-sky calendars and solar guides, with a small line of apparel. Built on Shopify.", tech: ["Shopify", "E-Commerce", "Digital Downloads", "Print on Demand"], metric: "Live at auraeon.com", isFeatured: true, link: "https://auraeon.com" },
    { title: "Wisp", description: "Browser event display for liquid argon neutrino detector data, starting with the MicroBooNE public samples. Three wire-plane views, truth-mode coloring and a 3D trajectory view in a single HTML file.", tech: ["JavaScript", "Python", "HDF5"], metric: "Open source", isFeatured: false, link: "https://github.com/devin-gaughan/wisp", linkLabel: "View Source", writeup: "/writing/wisp-neutrino-event-display.html" },
    { title: "FFR Progress", description: "Read-only viewer for the hidden lifetime counters in a Final Fantasy Resonance save. It reads a copy of the save and never writes to it.", tech: ["Python", "Tkinter", "PyInstaller"], metric: "Windows build and source, MIT license", isFeatured: false, link: "https://github.com/devin-gaughan/ffr-progress", linkLabel: "View Source" },
    { title: "Portfolio Site (This Site)", description: "React single-page application with a quietly twinkling starfield, Fraunces display typography, and a soft-cosmic palette tuned for legibility and calm. Deployed via GitHub Pages.", tech: ["React", "Three.js", "Vite", "GitHub Pages"], metric: "You're looking at it", isFeatured: false },
    { title: "Custom Shell (smallsh)", description: "A small Unix shell written in C for an operating systems course. Process management, signal handling (SIGINT, SIGTSTP), I/O redirection, background processes, and built-in commands.", tech: ["C", "Linux", "System Calls", "Signals", "Processes"], metric: "OSU Operating Systems coursework", isFeatured: false },
    { title: "Firmware Test Suites at HP", description: "Built and ran trunk-health firmware test suites on Red Hat Linux against prototype printer hardware, deployed firmware packages for QA, and ran automation scripts to verify test cases across dozens of printer models.", tech: ["Red Hat Linux", "Firmware", "Test Automation", "QA"], metric: "Printer Firmware Technician, 2015 to 2018", isFeatured: false },
    { title: "RF Lab Support at Intel", description: "Configured, maintained and updated hardware, software and firmware on RF test server racks, and managed project hardware inventory and quarterly asset audits.", tech: ["Firmware", "Hardware Validation", "RF Test Racks", "Asset Tracking"], metric: "Lab Technician, 2020 to 2021", isFeatured: false }
  ],
  socialLinks: [
    { name: "Email", url: "mailto:devin@devingaughan.com", icon: "email" },
    { name: "LinkedIn", url: "https://linkedin.com/in/devinpgaughan", icon: "linkedin" },
    { name: "GitHub", url: "https://github.com/devin-gaughan", icon: "github" },
    { name: "Resume", url: "/Devin_Gaughan_Resume.pdf", icon: "resume" }
  ]
};

function App() {
  const [route, setRoute] = useState(getRoutePath());
  const data = portfolioData;

  const navigateTo = (path) => {
    window.history.pushState(null, '', path);
    setRoute(path);
  };

  const handleLogout = () => {
    window.history.replaceState(null, '', '/');
    setRoute('/');
  };

  // ── Private routes (login required) ─────────────────
  const privateRoutes = ['/dashboard', '/login', '/library', '/assess', '/vitality', '/academics'];
  if (privateRoutes.some(r => route.startsWith(r))) {
    return (
      <PrivateRoute>
        {({ onLogout }) => {
          if (route === '/library') {
            return <Library onLogout={() => { onLogout(); handleLogout(); }} onNavigate={navigateTo} />;
          }
          if (route.startsWith('/assess')) {
            return <Assessment onLogout={() => { onLogout(); handleLogout(); }} onNavigate={navigateTo} />;
          }
          if (route.startsWith('/academics')) {
            return <Academics onLogout={() => { onLogout(); handleLogout(); }} onNavigate={navigateTo} />;
          }
          // Default: Dashboard hub
          return <Dashboard onLogout={() => { onLogout(); handleLogout(); }} onNavigate={navigateTo} />;
        }}
      </PrivateRoute>
    );
  }

  // ── Public portfolio (default) ──────────────────────
  return (
    <div className="app">
      <SpaceBackground />
      <nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#ventures">Ventures</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="/writing/">Writing</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      <section id="home" className="hero">
        <div className="hero-content">
          <h1 className="display-name">{data.bio.name}</h1>
          <p className="subtitle">{data.bio.title}</p>
          <p>{data.bio.description}</p>
          <div className="cta-buttons">
            <a href="#ventures" className="btn btn-primary">Explore My Work</a>
            <a href="#contact" className="btn btn-secondary">Get In Touch</a>
          </div>
        </div>
      </section>

      <About bio={data.bio} />
      <Ventures />
      <Skills skills={data.skills} />

      <section id="projects">
        <h2 className="section-title">Projects</h2>
        <p className="section-subtitle">Things I have built and worked on</p>
        <div className="projects-grid">
          {data.projects.map((project, index) => (
            <div key={index} className={`project-card ${project.isFeatured ? 'project-card--featured' : ''}`}>
              {project.isFeatured && <span className="featured-badge">★ FEATURED</span>}
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-actions" style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{fontSize:'0.85rem',padding:'6px 18px'}}>↗ {project.linkLabel || 'Visit Site'}</a>
                )}
                {project.writeup && (
                  <a href={project.writeup} className="btn btn-secondary" style={{fontSize:'0.85rem',padding:'6px 18px'}}>Read the write-up</a>
                )}
              </div>
              <div className="project-tech">
                {project.tech.map(t => <span key={t} className="tech-badge">{t}</span>)}
              </div>
              {project.metric && <div className="project-metric">{project.metric}</div>}
            </div>
          ))}
        </div>
      </section>
      
      <Contact socialLinks={data.socialLinks} />
      <footer><p>&copy; {new Date().getFullYear()} {data.bio.name}. Built with React & Three.js.</p></footer>
    </div>
  );
}

export default App;
