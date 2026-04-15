import React, { useState, useEffect } from 'react';
import './App.css';
import SpaceBackground from './components/SpaceBackground';
import About from './components/About';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Hologram from './components/Hologram';
import HackerText from './components/HackerText';
import Terminal from './components/Terminal';
import ProjectWindow from './components/ProjectWindow';
import LatticeDemo from './components/demos/LatticeDemo';
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
    title: "SOFTWARE ENGINEER",
    description: "Full-stack engineer and CS student building interactive simulations, outdoor tech, and real-time systems — from crystal lattice physics to solar-powered adventure gear.",
    aboutText: [
      "I'm Devin Gaughan — a software engineer with 10+ years of experience spanning firmware at Intel and HP, full-stack web development, and scientific computing. Currently pursuing a CS degree at Oregon State University while building things from Bangkok, Thailand.",
      "My work ranges across the stack: React frontends with Three.js 3D visualizations, Node.js/Express APIs, Python tooling, and low-level embedded C. I'm drawn to problems where software meets the physical world — materials simulations, IoT devices, solar tech.",
      "Outside of code, I'm driven by chemistry, physics, and the outdoors. I run Auraeon, an adventure brand focused on outdoor gear and solar-powered essentials. I speak English, Thai, and Japanese."
    ]
  },
  skills: [
    { category: "Frontend", tags: ["React", "Three.js", "JavaScript/ES6+", "HTML5/CSS3", "Vite", "Tailwind"] },
    { category: "Backend & Data", tags: ["Node.js", "Express", "Python", "MongoDB", "MySQL", "REST APIs"] },
    { category: "Systems & Embedded", tags: ["C", "C++", "ARM Cortex", "RTOS", "Linux", "Assembly"] },
    { category: "DevOps & Tools", tags: ["Git", "Docker", "GitHub Actions", "WSL/Ubuntu", "Bash", "CI/CD"] },
    { category: "Protocols & Hardware", tags: ["I2C", "SPI", "UART", "CAN", "USB", "JTAG/SWD"] },
    { category: "Scientific & AI", tags: ["Physics Modeling", "Materials Science", "LLM APIs", "Data Pipelines", "Simulation"] }
  ],
  projects: [
    { title: "Auraeon Crystal Lattice Simulator", description: "Interactive 3D crystal structure visualizer with Miller Indices plane slicing, d-spacing calculations, and atom highlighting. Built with React, Three.js, and React Three Fiber.", tech: ["React", "Three.js", "R3F", "Vite", "Scientific Computing"], metric: "Live at devingaughan.com/auraeon", isFeatured: true, hasDemo: true },
    { title: "Auraeon Storefront", description: "Full e-commerce brand for outdoor adventure gear and solar-powered essentials. Custom Shopify theme, print-on-demand product design, and brand identity from scratch.", tech: ["Shopify", "Liquid", "E-Commerce", "Brand Design", "Supliful"], metric: "Live at auraeon.com", isFeatured: true, link: "https://auraeon.com" },
    { title: "Portfolio Site (This Site)", description: "React SPA with animated 3D hologram (Three.js), starfield background, interactive terminal emulator, and hacker-text effects. Deployed via GitHub Pages.", tech: ["React", "Three.js", "Vite", "GitHub Pages"], metric: "You're looking at it", isFeatured: false },
    { title: "Custom Shell (smallsh)", description: "POSIX-compliant shell in C for Linux. Process management, signal handling (SIGINT, SIGTSTP), I/O redirection, background processes, and built-in commands.", tech: ["C", "Linux", "System Calls", "Signals", "Processes"], metric: "OSU Systems Programming", isFeatured: false },
    { title: "Printer Firmware — HP", description: "Engineered firmware for a next-gen printer platform at HP. Custom bootloader, optimized initialization routines, dramatically reduced startup times.", tech: ["C", "ARM Cortex-M", "USB", "Bootloader", "RTOS"], metric: "15% boot time reduction", isFeatured: false },
    { title: "Validation Tooling — Intel", description: "Automated validation and testing tools for embedded systems at Intel. Firmware integration testing, HW/SW interface verification, and defect analysis pipelines.", tech: ["Python", "C", "Embedded Systems", "Test Automation"], metric: "Intel Validation Engineering", isFeatured: false }
  ],
  socialLinks: [
    { name: "Email", url: "mailto:devin@devingaughan.com", icon: "email" },
    { name: "LinkedIn", url: "https://linkedin.com/in/devinpgaughan", icon: "linkedin" },
    { name: "GitHub", url: "https://github.com/devin-gaughan", icon: "github" },
    { name: "Resume", url: "/Senior Software Engineer - Devin Patrick Gaughan.pdf", icon: "resume" }
  ]
};

function App() {
  const [activeWindow, setActiveWindow] = useState(null);
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
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      <section id="home" className="hero">
        <Hologram />
        <div className="hero-content">
          <h1 className="glow" style={{ minHeight: '80px' }}>
            <HackerText text={data.bio.name} />
          </h1>
          <p className="subtitle">{data.bio.title}</p>
          <p>{data.bio.description}</p>
          <div className="cta-buttons">
            <a href="#ventures" className="btn btn-primary">Explore My Work</a>
            <a href="#contact" className="btn btn-secondary">Get In Touch</a>
          </div>
        </div>
      </section>

      <About bio={data.bio} />
      <Ventures onLaunchSim={() => setActiveWindow('lattice')} />
      <Skills skills={data.skills} />

      <section id="projects">
        <h2 className="section-title">Projects</h2>
        <p className="section-subtitle">Engineering across the full stack</p>
        <div className="projects-grid">
          {data.projects.map((project, index) => (
            <div key={index} className={`project-card ${project.isFeatured ? 'project-card--featured' : ''}`}>
              {project.isFeatured && <span className="featured-badge">★ FEATURED</span>}
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-actions">
                {project.hasDemo && (
                  <button className="btn btn-secondary" style={{fontSize:'0.85rem',padding:'6px 18px'}} onClick={() => setActiveWindow('lattice')}>▶ Launch Demo</button>
                )}
                {project.link && (
                  <a href={project.link} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{fontSize:'0.85rem',padding:'6px 18px'}}>↗ Visit Site</a>
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
      <Terminal />

      {activeWindow === 'lattice' && (
        <ProjectWindow title="Auraeon Crystal Lattice v2.0" onClose={() => setActiveWindow(null)}>
          <LatticeDemo />
        </ProjectWindow>
      )}
    </div>
  );
}

export default App;
