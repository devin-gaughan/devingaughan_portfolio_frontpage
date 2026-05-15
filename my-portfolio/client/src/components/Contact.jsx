import React from 'react';

/* Icons inherit color from the parent .contact-icon via currentColor.
   Two-tone fills (the lighter strokes on the envelope, the body of the
   resume sheet, etc.) use fillOpacity to keep that depth without
   hardcoding colors. */

const EmailIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 16V10.24C4 10.13 4.12 10.06 4.22 10.11L10.66 13.33C11.5 13.75 12.5 13.75 13.34 13.33L19.78 10.11C19.88 10.06 20 10.13 20 10.24V16C20 17.1 19.1 18 18 18H6C4.9 18 4 17.1 4 16Z"/>
    <path d="M4 8V8.91C4 8.96 4.03 9.02 4.08 9.04L10.66 12.33C11.5 12.75 12.5 12.75 13.34 12.33L19.92 9.04C19.97 9.02 20 8.96 20 8.91V8C20 6.9 19.1 6 18 6H6C4.9 6 4 6.9 4 8Z" fillOpacity="0.35"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="8" r="4"/>
    <path d="M12 13C8.33 13 5.32 15.42 5.02 18.5C5 18.78 5.22 19 5.5 19H18.5C18.78 19 19 18.78 18.98 18.5C18.68 15.42 15.67 13 12 13Z" fillOpacity="0.4"/>
  </svg>
);

const GitHubIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 16.42 4.87 20.17 8.84 21.5C9.34 21.58 9.5 21.27 9.5 21V19.31C6.73 19.91 6.14 17.97 6.14 17.97C5.68 16.81 5.03 16.5 5.03 16.5C4.12 15.88 5.1 15.9 5.1 15.9C6.1 15.97 6.63 16.93 6.63 16.93C7.5 18.45 8.97 18 9.54 17.76C9.63 17.11 9.89 16.67 10.17 16.42C7.95 16.17 5.62 15.31 5.62 11.5C5.62 10.39 6 9.5 6.65 8.79C6.55 8.54 6.2 7.5 6.75 6.15C6.75 6.15 7.59 5.88 9.5 7.17C10.29 6.95 11.15 6.84 12 6.84C12.85 6.84 13.71 6.95 14.5 7.17C16.41 5.88 17.25 6.15 17.25 6.15C17.8 7.5 17.45 8.54 17.35 8.79C18 9.5 18.38 10.39 18.38 11.5C18.38 15.32 16.04 16.16 13.81 16.41C14.17 16.72 14.5 17.33 14.5 18.26V21C14.5 21.27 14.66 21.59 15.17 21.5C19.14 20.16 22 16.42 22 12C22 6.48 17.52 2 12 2Z"/>
  </svg>
);

const ResumeIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 5C5 3.9 5.9 3 7 3H11.75C11.89 3 12 3.11 12 3.25V8C12 9.1 12.9 10 14 10H18.75C18.89 10 19 10.11 19 10.25V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V5Z" fillOpacity="0.35"/>
    <path d="M13 8V3.6C13 3.38 13.27 3.27 13.43 3.43L18.57 8.57C18.73 8.73 18.62 9 18.4 9H14C13.45 9 13 8.55 13 8Z"/>
    <path d="M8.5 13H15.5M8.5 16H15.5M8.5 19H12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7"/>
  </svg>
);

const Contact = ({ socialLinks }) => {
  const getIcon = (name) => {
    if (name === "Email") return <EmailIcon />;
    if (name === "LinkedIn") return <LinkedInIcon />;
    if (name === "GitHub") return <GitHubIcon />;
    return <ResumeIcon />;
  };

  return (
    <section id="contact">
      <h2 className="section-title">Let's Connect</h2>
      <p className="section-subtitle">Open to collaboration and new opportunities</p>
      <div className="contact-container">
        <p style={{marginBottom:'2rem', color:'rgba(229,228,226,0.8)', lineHeight:'1.8'}}>
          Whether you're interested in working together, have questions about my projects, or just want to talk shop about
          crystal structures and trail gear — I'd love to hear from you.
        </p>
        <div className="contact-links" style={{marginBottom:'2rem'}}>
          {socialLinks && socialLinks.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noreferrer" className="contact-link">
              <div className="contact-icon">{getIcon(link.name)}</div>
              <span>{link.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
