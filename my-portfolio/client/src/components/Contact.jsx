import React, { useState } from 'react';

// Simple Icon Components (SVG paths from your original HTML)
const EmailIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" fill="none">
    <path d="M4 16V10.2427C4 10.1312 4.11735 10.0587 4.21708 10.1085L10.6584 13.3292C11.5029 13.7515 12.4971 13.7515 13.3416 13.3292L19.7829 10.1085C19.8827 10.0587 20 10.1312 20 10.2427V16C20 17.1046 19.1046 18 18 18H6C4.89543 18 4 17.1046 4 16Z" fill="#af9168"/>
    <path d="M4 8V8.90729C4 8.96411 4.0321 9.01605 4.08292 9.04146L10.6584 12.3292C11.5029 12.7515 12.4971 12.7515 13.3416 12.3292L19.9171 9.04146C19.9679 9.01605 20 8.96411 20 8.9073V8C20 6.89543 19.1046 6 18 6H6C4.89543 6 4 6.89543 4 8Z" fill="#af9168" fillOpacity="0.24"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" fill="#d1ad45"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 13C8.33033 13 5.32016 15.4204 5.02395 18.5004C4.99752 18.7753 5.22389 19 5.50003 19H18.5C18.7762 19 19.0025 18.7753 18.9761 18.5004C18.6799 15.4204 15.6697 13 12 13Z" fill="#957c57" fillOpacity="0.24"/>
  </svg>
);

const GitHubIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" fill="none">
    <path d="M13.5 5.5L6.45321 12.5468..." fill="#2A4157" fillOpacity="0.24"/> 
    {/* (I've shortened this path for readability, you can copy the full path from your index.html if needed, but this will display the icon shape) */}
    <path d="M12.2929 6.70711L6.45321 12.5468C6.22845 12.7716 6.11607 12.8839 6.04454 13.0229C5.97301 13.1619 5.94689 13.3187 5.89463 13.6322L5.11508 18.3095C5.06262 18.6243 5.03639 18.7817 5.12736 18.8726C5.21833 18.9636 5.37571 18.9374 5.69048 18.8849L10.3678 18.1054L10.3678 18.1054C10.6813 18.0531 10.8381 18.027 10.9771 17.9555C11.1161 17.8839 11.2284 17.7716 11.4532 17.5468L11.4532 17.5468L17.2929 11.7071C17.6262 11.3738 17.7929 11.2071 17.7929 11C17.7929 10.7929 17.6262 10.6262 17.2929 10.2929L17.2929 10.2929L13.7071 6.70711C13.3738 6.37377 13.2071 6.20711 13 6.20711C12.7929 6.20711 12.6262 6.37377 12.2929 6.70711Z" fill="#d4af37"/>
  </svg>
);

const ResumeIcon = () => (
   <svg className="icon-svg" viewBox="0 0 24 24" fill="none">
      <path d="M5 5C5 3.89543 5.89543 3 7 3H11.75C11.8881 3 12 3.11193 12 3.25V8C12 9.10457 12.8954 10 14 10H18.75C18.8881 10 19 10.1119 19 10.25V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V5Z" fill="#d0ad46" fillOpacity="0.24"/>
      <path d="M13 8V3.60355C13 3.38083 13.2693 3.26929 13.4268 3.42678L18.5732 8.57322C18.7307 8.73071 18.6192 9 18.3964 9H14C13.4477 9 13 8.55228 13 8Z" fill="#9e825c"/>
   </svg>
);

const Contact = ({ socialLinks }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) setStatus('Message sent!');
    } catch (err) { setStatus('Error.'); }
  };

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
        {/* The Original Links Section */}
        <div className="contact-links" style={{marginBottom: '3rem'}}>
            {socialLinks && socialLinks.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noreferrer" className="contact-link">
                    <div className="contact-icon">
                        {getIcon(link.name)}
                    </div>
                    <span>{link.name}</span>
                </a>
            ))}
        </div>

        {/* The New Form */}
        <p>Or send me a message directly:</p>
        <form onSubmit={handleSubmit} className="contact-form">
          <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required 
            style={{ width: '100%', padding: '1rem', marginBottom: '1rem', background: '#1a1a1a', border: '1px solid #c9a961', color: 'white' }} />
          <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required 
            style={{ width: '100%', padding: '1rem', marginBottom: '1rem', background: '#1a1a1a', border: '1px solid #c9a961', color: 'white' }} />
          <textarea name="message" placeholder="Message" rows="5" value={formData.message} onChange={handleChange} required 
            style={{ width: '100%', padding: '1rem', marginBottom: '1rem', background: '#1a1a1a', border: '1px solid #c9a961', color: 'white' }} />
          <button type="submit" className="btn btn-primary">Send Message</button>
        </form>
        {status && <p style={{ marginTop: '1rem', color: '#c9a961' }}>{status}</p>}
      </div>
    </section>
  );
};

export default Contact;