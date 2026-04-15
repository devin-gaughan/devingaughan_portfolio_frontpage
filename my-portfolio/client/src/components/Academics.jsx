import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.devingaughan.com';
function getToken() { return sessionStorage.getItem('auraeon_token'); }

const GRADE_COLORS = {
  'A': '#1D9E75', 'A-': '#3ab88a', 'B+': '#7eb8da', 'B': '#7eb8da', 'B-': '#8ab5c7',
  'C+': '#EF9F27', 'C': '#EF9F27',
};

const s = {
  page: { fontFamily: "'Palatino Linotype','Book Antiqua',Georgia,serif", background: 'linear-gradient(165deg,#0d0d0d 0%,#1a1510 40%,#0d0d0d 100%)', color: '#e8e0d4', minHeight: '100vh' },
  header: { padding: '32px 32px 20px', borderBottom: '1px solid rgba(212,175,55,0.2)', background: 'linear-gradient(180deg,rgba(212,175,55,0.06) 0%,transparent 100%)' },
  content: { padding: '24px 32px 40px', maxWidth: '800px', margin: '0 auto' },
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', marginBottom: '16px' },
  sectionLabel: { fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#8a7e6e', margin: '24px 0 12px' },
};

export default function Academics({ onNavigate }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/academics/courses`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json()).then(setCourses).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ ...s.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#d4af37', fontSize: '14px' }}>Loading academic record...</span>
    </div>
  );

  // Compute stats
  const completed = courses.filter(c => c.status === 'completed' && c.grade_points != null);
  const inProgress = courses.filter(c => c.status === 'in_progress');
  const planned = courses.filter(c => c.status === 'planned');
  const totalCredits = completed.reduce((s, c) => s + (c.credits || 0), 0);
  const weightedGPA = completed.reduce((s, c) => s + (c.credits || 0) * (c.grade_points || 0), 0);
  const overallGPA = totalCredits > 0 ? (weightedGPA / totalCredits) : 0;

  const osuTerms = ['Winter 2025', 'Spring 2025', 'Summer 2025', 'Fall 2025', 'Winter 2026'];
  const osuCourses = completed.filter(c => osuTerms.includes(c.term));
  const osuCredits = osuCourses.reduce((s, c) => s + (c.credits || 0), 0);
  const osuGPA = osuCredits > 0 ? osuCourses.reduce((s, c) => s + (c.credits || 0) * (c.grade_points || 0), 0) / osuCredits : 0;

  const transferCourses = completed.filter(c => !osuTerms.includes(c.term));
  const transferCredits = transferCourses.reduce((s, c) => s + (c.credits || 0), 0);
  const transferGPA = transferCredits > 0 ? transferCourses.reduce((s, c) => s + (c.credits || 0) * (c.grade_points || 0), 0) / transferCredits : 0;

  // Group by term
  const termOrder = ['Summer 2026', 'Spring 2026', 'Winter 2026', 'Fall 2025', 'Summer 2025', 'Spring 2025', 'Winter 2025',
    'Clark 2022-Fall', 'Clark 2021-Spr', 'Clark 2021-Fall', 'Clark 2018-Win', 'Clark 2014-Fall',
    'Clark 2013-Sum', 'Clark 2013-Spr', 'Clark 2013-Win', 'Clark 2013-Fall', 'Clark 2012',
    'UPhx 2011-Spr', 'UPhx 2011-Win', 'UPhx 2011-Fall'];
  const byTerm = {};
  courses.forEach(c => { (byTerm[c.term] = byTerm[c.term] || []).push(c); });
  const sortedTerms = Object.keys(byTerm).sort((a, b) => {
    const ai = termOrder.indexOf(a), bi = termOrder.indexOf(b);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: '#d4af37' }}>ACADEMICS</div>
          <button onClick={() => onNavigate('/dashboard')} style={{ fontSize: '12px', color: '#6b6156', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>← Dashboard</button>
        </div>
      </div>
      <div style={s.content}>

        {/* Program info */}
        <div style={{ ...s.card, borderColor: 'rgba(212,175,55,0.2)' }}>
          <div style={{ fontSize: '18px', color: '#f0e6d3', marginBottom: '4px' }}>Bachelor of Science — Applied Computer Science</div>
          <div style={{ fontSize: '13px', color: '#8a7e6e' }}>Oregon State University · College of Engineering</div>
          <div style={{ fontSize: '12px', color: '#6b6156', marginTop: '4px' }}>Transfer credits from Clark College & University of Phoenix</div>
        </div>

        {/* GPA Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '24px' }}>
          {[
            { label: 'OSU GPA', value: osuGPA.toFixed(2), color: '#d4af37', sub: `${osuCredits} credits` },
            { label: 'Transfer GPA', value: transferGPA.toFixed(2), color: '#8a7e6e', sub: `${transferCredits} credits` },
            { label: 'Overall GPA', value: overallGPA.toFixed(2), color: '#f0e6d3', sub: `${totalCredits} credits` },
            { label: 'Honor Roll', value: '5×', color: '#1D9E75', sub: 'consecutive terms' },
          ].map(stat => (
            <div key={stat.label} style={{ ...s.card, textAlign: 'center', padding: '16px', marginBottom: 0 }}>
              <div style={{ fontSize: '28px', fontWeight: '400', color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: '#8a7e6e', marginTop: '2px' }}>{stat.label}</div>
              <div style={{ fontSize: '11px', color: '#5a5045', marginTop: '2px' }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Course progress */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', fontSize: '13px' }}>
          <span style={{ color: '#1D9E75' }}>✓ {completed.length} completed</span>
          <span style={{ color: '#d4af37' }}>◆ {inProgress.length} in progress</span>
          <span style={{ color: '#5a5045' }}>○ {planned.length} planned</span>
        </div>

        {/* Courses by term */}
        {sortedTerms.map(term => {
          const termCourses = byTerm[term];
          const isOSU = osuTerms.includes(term);
          const isInProgress = termCourses.some(c => c.status === 'in_progress');
          const isPlanned = termCourses.some(c => c.status === 'planned');
          const termCredits = termCourses.reduce((s, c) => s + (c.credits || 0), 0);
          const termGPA = termCourses.filter(c => c.grade_points).length > 0
            ? (termCourses.reduce((s, c) => s + (c.credits || 0) * (c.grade_points || 0), 0) / termCourses.reduce((s, c) => s + (c.grade_points ? (c.credits || 0) : 0), 0)).toFixed(2)
            : null;
          return (
            <div key={term} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: isOSU ? '#d4af37' : '#8a7e6e' }}>{term}</span>
                  {isOSU && <span style={{ fontSize: '10px', color: '#1D9E75', marginLeft: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Honor Roll</span>}
                  {isInProgress && <span style={{ fontSize: '10px', color: '#d4af37', marginLeft: '8px', textTransform: 'uppercase' }}>In Progress</span>}
                  {isPlanned && <span style={{ fontSize: '10px', color: '#5a5045', marginLeft: '8px', textTransform: 'uppercase' }}>Planned</span>}
                </div>
                <div style={{ fontSize: '12px', color: '#6b6156' }}>
                  {termCredits} cr{termGPA ? ` · ${termGPA} GPA` : ''}
                </div>
              </div>
              {termCourses.map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.05)', borderRadius: '6px', marginBottom: '4px' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '13px', color: '#b8ad9e', fontWeight: '500', marginRight: '10px', minWidth: '65px', display: 'inline-block' }}>{c.code}</span>
                    <span style={{ fontSize: '13px', color: '#e8e0d4' }}>{c.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '12px', color: '#6b6156' }}>{c.credits} cr</span>
                    {c.grade ? (
                      <span style={{ fontSize: '13px', fontWeight: '600', color: GRADE_COLORS[c.grade] || '#8a7e6e', minWidth: '24px', textAlign: 'right' }}>{c.grade}</span>
                    ) : (
                      <span style={{ fontSize: '11px', color: c.status === 'in_progress' ? '#d4af37' : '#5a5045', minWidth: '24px', textAlign: 'right' }}>
                        {c.status === 'in_progress' ? '◆' : '○'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '16px 0', borderTop: '1px solid rgba(212,175,55,0.1)', marginTop: '20px' }}>
          <p style={{ fontSize: '12px', color: '#5a5045', margin: 0 }}>
            Data sourced from OSU unofficial transcript. Only courses with C or better shown.
          </p>
        </div>
      </div>
    </div>
  );
}
