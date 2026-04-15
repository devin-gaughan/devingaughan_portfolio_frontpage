import React, { useState, useEffect } from 'react';
import { isLoggedIn, verifyToken, logout } from '../lib/auth';
import Login from './Login';

/**
 * PrivateRoute — wraps a component that requires authentication.
 * Shows Login if not authenticated; verifies token on mount.
 */
export default function PrivateRoute({ children }) {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  const check = async () => {
    if (!isLoggedIn()) { setChecking(false); return; }
    const valid = await verifyToken();
    if (!valid) logout();
    setAuthed(valid);
    setChecking(false);
  };

  useEffect(() => { check(); }, []);

  if (checking) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#d4af37', fontFamily: 'Georgia, serif', fontSize: '14px' }}>
      Verifying session...
    </div>
  );

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;

  return typeof children === 'function' ? children({ onLogout: () => setAuthed(false) }) : children;
}
