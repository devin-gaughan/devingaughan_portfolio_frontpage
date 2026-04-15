import React, { useState, useEffect } from 'react';
import { logout } from '../lib/auth';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.devingaughan.com';

function getToken() { return sessionStorage.getItem('auraeon_token'); }

async function fetchDashboard() {
  const r = await fetch(`${API_URL}/api/dashboard/summary`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!r.ok) throw new Error('Failed to load dashboard');
  return r.json();
}

const STAT_CONFIG = {
  intelligence: { label: 'Intelligence', color: '#7F77DD', icon: '🧠' },
  engineering:  { label: 'Engineering',  color: '#1D9E75', icon: '⚙️' },
  vitality:     { label: 'Vitality',     color: '#E24B4A', icon: '💓' },
  discipline:   { label: 'Discipline',   color: '#EF9F27', icon: '📐' },
  creativity:   { label: 'Creativity',   color: '#D4537E', icon: '🎵' },
};

const s = {
  page: { fontFamily: "'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif", background: 'linear-gradient(165deg,#0d0d0d 0%,#1a1510 40%,#0d0d0d 100%)', color: '#e8e0d4', minHeight: '100vh' },
  header: { padding: '32px 32px 20px', borderBottom: '1px solid rgba(212,175,55,0.2)', background: 'linear-gradient(180deg,rgba(212,175,55,0.06) 0%,transparent 100%)' },
  brand: { fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: '#d4af37' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  content: { padding: '24px 32px 40px', maxWidth: '900px', margin: '0 auto' },
};

export default function Dashboard({ onLogout, onNavigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard()
      .then(setData)
      .catch(e => { setError(e.message); if (e.message.includes('expired')) { logout(); onLogout(); } })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); onLogout(); };

  if (loading) return (
    <div style={{ ...s.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#d4af37', fontSize: '14px' }}>Loading dashboard...</span>
    </div>
  );

  if (error) return (
    <div style={{ ...s.page, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
      <span style={{ color: '#e8685a', fontSize: '14px' }}>{error}</span>
      <button onClick={handleLogout} style={{ color: '#8a7e6e', background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit' }}>Sign Out</button>
    </div>
  );

  const { character, stats, modules, domains } = data;

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.nav}>
          <div style={s.brand}>AURAEON DASHBOARD</div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <a href="/" style={{ fontSize: '12px', color: '#6b6156', textDecoration: 'none' }}>← Portfolio</a>
            <button onClick={handleLogout} style={{ fontSize: '12px', color: '#8a7e6e', background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '4px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>Sign Out</button>
          </div>
        </div>
      </div>

      <div style={s.content}>
        {/* Character Card */}
        <div style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', padding: '24px 28px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '400', color: '#f0e6d3', margin: '0 0 4px' }}>{character.name}</div>
              <div style={{ fontSize: '13px', color: '#d4af37', letterSpacing: '1px' }}>{character.title}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '32px', fontWeight: '400', color: '#d4af37' }}>Lv {character.level}</div>
              <div style={{ fontSize: '12px', color: '#8a7e6e' }}>{character.xp} XP</div>
            </div>
          </div>

          {/* Stat Bars */}
          <div style={{ marginTop: '20px', display: 'grid', gap: '8px' }}>
            {Object.entries(STAT_CONFIG).map(([key, cfg]) => {
              const val = stats[key]?.value || 0;
              return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '14px', width: '24px', textAlign: 'center' }}>{cfg.icon}</span>
                  <span style={{ fontSize: '12px', color: '#8a7e6e', width: '90px', textAlign: 'right' }}>{cfg.label}</span>
                  <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(val, 100)}%`, background: cfg.color, borderRadius: '4px', transition: 'width 0.8s ease' }} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '500', color: cfg.color, minWidth: '32px', textAlign: 'right' }}>
                    {val > 0 ? Math.round(val) : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Module Cards */}
        <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#8a7e6e', margin: '0 0 12px' }}>Modules</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px', marginBottom: '28px' }}>
          {[
            { name: 'Library', icon: '📚', route: '/library', summary: `${modules.library.owned}/${modules.library.books} owned · ${modules.library.completed} completed` },
            { name: 'Assessments', icon: '🧠', route: '/assess', summary: `${modules.assessments.total} tests · ${modules.assessments.domains_tracked} domains` },
            { name: 'Vitality', icon: '💓', route: '/vitality', summary: `${modules.vitality.minutes_30d} min · ${modules.vitality.sessions_30d} sessions (30d)` },
            { name: 'Academics', icon: '🎓', route: '/academics', summary: modules.academics.courses_completed > 0 ? `${modules.academics.courses_completed} courses · ${modules.academics.gpa} GPA` : 'Add your courses' },
          ].map(mod => (
            <div key={mod.name} onClick={() => onNavigate(mod.route)} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
              padding: '16px', cursor: 'pointer', transition: 'border-color 0.2s',
            }} onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'}
               onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>{mod.icon}</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#f0e6d3', marginBottom: '4px' }}>{mod.name}</div>
              <div style={{ fontSize: '12px', color: '#8a7e6e', lineHeight: 1.4 }}>{mod.summary}</div>
            </div>
          ))}
        </div>

        {/* Knowledge Domains */}
        <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#8a7e6e', margin: '0 0 12px' }}>Knowledge domains</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px', marginBottom: '28px' }}>
          {domains.map(d => {
            const levelColors = { unassessed: '#5a5045', novice: '#a8a8a8', competent: '#7eb8da', proficient: '#1D9E75', advanced: '#d4af37', expert: '#D4537E' };
            const color = levelColors[d.current_level] || '#5a5045';
            return (
              <div key={d.slug} onClick={() => onNavigate(`/assess/${d.slug}`)} style={{
                background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '8px',
                padding: '12px 14px', cursor: 'pointer', transition: 'border-color 0.2s',
              }} onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.25)'}
                 onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px' }}>{d.icon} <span style={{ fontSize: '13px', color: '#e8e0d4' }}>{d.name}</span></span>
                </div>
                <div style={{ fontSize: '11px', color, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: '6px' }}>
                  {d.current_level === 'unassessed' ? '○ unassessed' : `◆ ${d.current_level}`}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '16px 0', borderTop: '1px solid rgba(212,175,55,0.1)' }}>
          <p style={{ fontSize: '12px', color: '#5a5045', margin: 0 }}>
            All stats computed from verified measurements and assessments. Nothing is inferred.
          </p>
        </div>
      </div>
    </div>
  );
}
