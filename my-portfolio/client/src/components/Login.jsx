import React, { useState } from 'react';
import { login, changePassword } from '../lib/auth';

export default function Login({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Password change flow
  const [mustChange, setMustChange] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(username, password);
      if (data.must_change_password) {
        setMustChange(true);
      } else {
        onSuccess();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPass.length < 12) { setError('Password must be at least 12 characters.'); return; }
    if (newPass !== confirmPass) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      await changePassword(password, newPass);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const s = {
    page: {
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at 30% 20%, rgba(212,175,55,0.04) 0%, #0a0a0a 70%)',
      fontFamily: "'Palatino Linotype', Georgia, serif", padding: '20px',
    },
    card: {
      width: '100%', maxWidth: '380px',
      background: 'rgba(13,13,13,0.95)', border: '1px solid rgba(212,175,55,0.2)',
      borderRadius: '12px', padding: '40px 32px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 80px rgba(212,175,55,0.03)',
    },
    brand: {
      fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase',
      color: '#d4af37', textAlign: 'center', marginBottom: '8px',
    },
    title: {
      fontSize: '22px', fontWeight: '400', color: '#f0e6d3',
      textAlign: 'center', margin: '0 0 28px',
    },
    label: {
      display: 'block', fontSize: '11px', letterSpacing: '1.5px',
      textTransform: 'uppercase', color: '#8a7e6e', marginBottom: '6px',
    },
    input: {
      width: '100%', padding: '12px 14px', fontSize: '15px',
      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '6px', color: '#e8e0d4', fontFamily: 'inherit',
      marginBottom: '18px', outline: 'none', boxSizing: 'border-box',
      transition: 'border-color 0.2s',
    },
    btn: {
      width: '100%', padding: '14px', fontSize: '14px', fontWeight: '600',
      letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer',
      background: 'linear-gradient(135deg, #d4af37, #c9a961)',
      color: '#0d0d0d', border: 'none', borderRadius: '6px',
      fontFamily: 'inherit', transition: 'opacity 0.2s',
      opacity: loading ? 0.6 : 1,
    },
    error: {
      background: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.3)',
      borderRadius: '6px', padding: '10px 14px', fontSize: '13px',
      color: '#e8685a', marginBottom: '18px', textAlign: 'center',
    },
    back: {
      display: 'block', textAlign: 'center', marginTop: '24px',
      fontSize: '13px', color: '#6b6156', textDecoration: 'none',
    },
  };

  if (mustChange) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <div style={s.brand}>AURAEON</div>
          <h1 style={s.title}>Set New Password</h1>
          <p style={{ fontSize: '13px', color: '#8a7e6e', textAlign: 'center', marginBottom: '24px', lineHeight: 1.5 }}>
            Your password must be changed before continuing. Minimum 12 characters.
          </p>
          {error && <div style={s.error}>{error}</div>}
          <form onSubmit={handleChangePassword}>
            <label style={s.label}>New Password</label>
            <input style={s.input} type="password" value={newPass}
              onChange={e => setNewPass(e.target.value)} autoFocus placeholder="Min 12 characters" />
            <label style={s.label}>Confirm Password</label>
            <input style={s.input} type="password" value={confirmPass}
              onChange={e => setConfirmPass(e.target.value)} placeholder="Confirm" />
            <button style={s.btn} type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Set Password & Continue'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.brand}>AURAEON</div>
        <h1 style={s.title}>Private Access</h1>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleLogin}>
          <label style={s.label}>Username</label>
          <input style={s.input} type="text" value={username}
            onChange={e => setUsername(e.target.value)} autoFocus autoComplete="username" />
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" value={password}
            onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Authenticating...' : 'Enter'}
          </button>
        </form>
        <a href="/" style={s.back}>← Back to portfolio</a>
      </div>
    </div>
  );
}
