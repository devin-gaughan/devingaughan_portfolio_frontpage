import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('Failed to send message.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Error sending message.');
    }
  };

  return (
    <section id="contact">
      <h2 className="section-title">Let's Connect</h2>
      <div className="contact-container">
        <form onSubmit={handleSubmit} className="contact-form" style={{ marginTop: '2rem' }}>
          {/* Simple styling for the form elements can be added to App.css */}
          <input 
            type="text" name="name" placeholder="Your Name" 
            value={formData.name} onChange={handleChange} required 
            style={{ width: '100%', padding: '1rem', marginBottom: '1rem', background: '#1a1a1a', border: '1px solid #c9a961', color: 'white' }}
          />
          <input 
            type="email" name="email" placeholder="Your Email" 
            value={formData.email} onChange={handleChange} required 
            style={{ width: '100%', padding: '1rem', marginBottom: '1rem', background: '#1a1a1a', border: '1px solid #c9a961', color: 'white' }}
          />
          <textarea 
            name="message" placeholder="Message" rows="5"
            value={formData.message} onChange={handleChange} required 
            style={{ width: '100%', padding: '1rem', marginBottom: '1rem', background: '#1a1a1a', border: '1px solid #c9a961', color: 'white' }}
          />
          <button type="submit" className="btn btn-primary">Send Message</button>
        </form>
        {status && <p style={{ marginTop: '1rem', color: '#c9a961' }}>{status}</p>}
      </div>
    </section>
  );
};

export default Contact;