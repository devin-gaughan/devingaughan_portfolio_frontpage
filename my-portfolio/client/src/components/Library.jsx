import React, { useState, useEffect } from 'react';
import { fetchBooks, updateBook, logout } from '../lib/auth';

const priorityConfig = {
  essential: { label: 'Must-Have', color: '#d4af37', bg: 'rgba(212,175,55,0.12)', border: 'rgba(212,175,55,0.35)' },
  high:      { label: 'Highly Recommended', color: '#7eb8da', bg: 'rgba(126,184,218,0.10)', border: 'rgba(126,184,218,0.30)' },
  medium:    { label: 'Great Addition', color: '#a8a8a8', bg: 'rgba(168,168,168,0.08)', border: 'rgba(168,168,168,0.25)' },
};

function googleSearchUrl(t, a)  { return `https://www.google.com/search?q=${encodeURIComponent(`${t} ${a}`)}`; }
function googleShoppingUrl(t,a) { return `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(`${t} ${a} book`)}`; }
function amazonSearchUrl(t, a)  { return `https://www.amazon.com/s?k=${encodeURIComponent(`${t} ${a}`)}&i=stripbooks`; }

const LinkPill = ({ href, icon, label }) => (
  <a href={href} target="_blank" rel="noopener noreferrer"
    style={{ fontSize:'11px', color:'#7eb8da', textDecoration:'none', padding:'3px 10px',
      borderRadius:'12px', border:'1px solid rgba(126,184,218,0.22)',
      background:'rgba(126,184,218,0.06)', whiteSpace:'nowrap' }}>
    {icon} {label}
  </a>
);

export default function Library({ onLogout, onNavigate }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [filterPriority, setFilterPriority] = useState('all');
  const [expandedBooks, setExpandedBooks] = useState(new Set());
  const [showPlainList, setShowPlainList] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchBooks().then(setBooks).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const toggleBook = (id) => {
    setExpandedBooks(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const toggleOwned = async (book) => {
    try {
      const updated = await updateBook(book.id, { owned: !book.owned });
      setBooks(prev => prev.map(b => b.id === updated.id ? updated : b));
    } catch (e) { setError(e.message); }
  };

  // Group books by category
  const grouped = books.reduce((acc, b) => {
    if (!acc[b.category_id]) acc[b.category_id] = { id: b.category_id, name: b.category_name, icon: b.category_icon, why: b.category_why, books: [] };
    acc[b.category_id].books.push(b);
    return acc;
  }, {});

  const categories = Object.values(grouped).map(cat => ({
    ...cat, books: cat.books.filter(b => filterPriority === 'all' || b.priority === filterPriority),
  })).filter(c => c.books.length > 0);

  const totalBooks = categories.reduce((s, c) => s + c.books.length, 0);
  const essentialCount = Object.values(grouped).reduce((s, c) => s + c.books.filter(b => b.priority === 'essential').length, 0);
  const ownedCount = books.filter(b => b.owned).length;

  const handleCopy = async () => {
    let t = `AURAEON LIBRARY\n${'='.repeat(48)}\n${totalBooks} books\n\n`;
    categories.forEach(cat => {
      t += `${cat.icon} ${cat.name.toUpperCase()}\n${'-'.repeat(40)}\n`;
      cat.books.forEach((b,i) => { t += `${i+1}. ${b.title}\n   ${b.author} · ${b.publisher}  [${priorityConfig[b.priority]?.label}]${b.owned ? ' ✓ OWNED' : ''}\n\n`; });
      t += '\n';
    });
    try { await navigator.clipboard.writeText(t.trim()); } catch { /* fallback */ }
    setCopied(true); setTimeout(() => setCopied(false), 2400);
  };

  const handleLogout = () => { logout(); onLogout(); };

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0d0d0d', color:'#d4af37', fontFamily:'Georgia,serif', fontSize:'14px' }}>
      Loading library...
    </div>
  );

  return (
    <div style={{ fontFamily:"'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif", background:'linear-gradient(165deg,#0d0d0d 0%,#1a1510 40%,#0d0d0d 100%)', color:'#e8e0d4', minHeight:'100vh' }}>
      {/* Header */}
      <div style={{ padding:'40px 32px 28px', borderBottom:'1px solid rgba(212,175,55,0.2)', background:'linear-gradient(180deg,rgba(212,175,55,0.06) 0%,transparent 100%)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
          <div style={{ fontSize:'11px', letterSpacing:'4px', textTransform:'uppercase', color:'#d4af37' }}>AURAEON LIBRARY</div>
          <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
            <a onClick={() => onNavigate && onNavigate('/dashboard')} style={{ fontSize:'12px', color:'#6b6156', textDecoration:'none', cursor:'pointer' }}>← Dashboard</a>
            <button onClick={handleLogout} style={{ fontSize:'12px', color:'#8a7e6e', background:'none', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'14px', padding:'4px 12px', cursor:'pointer', fontFamily:'inherit' }}>
              Sign Out
            </button>
          </div>
        </div>
        <h1 style={{ fontSize:'28px', fontWeight:'400', color:'#f0e6d3', margin:'0 0 6px', letterSpacing:'0.5px' }}>Recommended Acquisitions</h1>
        <p style={{ fontSize:'14px', color:'#8a7e6e', margin:'0 0 20px', lineHeight:1.6 }}>
          {totalBooks} books across {categories.length} disciplines.
          <span style={{ color:'#d4af37' }}> {essentialCount} essential.</span>
          <span style={{ color:'#5cb85c' }}> {ownedCount} owned.</span>
        </p>
        {error && <div style={{ background:'rgba(220,53,69,0.1)', border:'1px solid rgba(220,53,69,0.3)', borderRadius:'6px', padding:'8px 14px', fontSize:'13px', color:'#e8685a', marginBottom:'16px' }}>{error}</div>}

        {/* Controls */}
        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', alignItems:'center' }}>
          {[{key:'all',label:'All Books'},{key:'essential',label:'🔥 Must-Haves'},{key:'high',label:"Highly Rec'd"},{key:'medium',label:'Great Additions'}].map(f => (
            <button key={f.key} onClick={() => setFilterPriority(f.key)} style={{
              padding:'6px 14px', borderRadius:'20px', fontSize:'12px', cursor:'pointer', fontFamily:'inherit',
              border: filterPriority===f.key ? '1px solid #d4af37' : '1px solid rgba(255,255,255,0.12)',
              background: filterPriority===f.key ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)',
              color: filterPriority===f.key ? '#d4af37' : '#8a7e6e',
            }}>{f.label}</button>
          ))}
          <div style={{ flex:1, minWidth:'8px' }} />
          <button onClick={() => setShowPlainList(p => !p)} style={{
            padding:'6px 14px', borderRadius:'20px', fontSize:'12px', cursor:'pointer', fontFamily:'inherit',
            border: showPlainList ? '1px solid #d4af37' : '1px solid rgba(255,255,255,0.18)',
            background: showPlainList ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.06)',
            color: showPlainList ? '#d4af37' : '#b8ad9e',
          }}>{showPlainList ? '✕ Close' : '📋 Plain List'}</button>
          <button onClick={handleCopy} style={{
            padding:'6px 14px', borderRadius:'20px', fontSize:'12px', cursor:'pointer', fontFamily:'inherit',
            border: copied ? '1px solid #5cb85c' : '1px solid rgba(255,255,255,0.18)',
            background: copied ? 'rgba(92,184,92,0.15)' : 'rgba(255,255,255,0.06)',
            color: copied ? '#5cb85c' : '#b8ad9e',
          }}>{copied ? '✓ Copied!' : '📎 Copy All'}</button>
        </div>
      </div>

      {/* Plain List Panel */}
      {showPlainList && (
        <div style={{ margin:'16px 32px', background:'rgba(0,0,0,0.45)', border:'1px solid rgba(212,175,55,0.2)', borderRadius:'10px', overflow:'hidden' }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid rgba(212,175,55,0.12)' }}>
            <span style={{ fontSize:'14px', fontWeight:'600', color:'#d4af37' }}>📋 {totalBooks} books</span>
          </div>
          <div style={{ padding:'12px 20px', maxHeight:'65vh', overflowY:'auto' }}>
            {categories.map(cat => (
              <div key={cat.id} style={{ marginBottom:'18px' }}>
                <div style={{ fontSize:'13px', fontWeight:'700', color:'#c9a961', marginBottom:'6px' }}>{cat.icon} {cat.name}</div>
                {cat.books.map((book, i) => {
                  const pc = priorityConfig[book.priority] || priorityConfig.medium;
                  return (
                    <div key={book.id} style={{ padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ display:'flex', alignItems:'baseline', gap:'8px', flexWrap:'wrap' }}>
                        {book.owned && <span style={{ color:'#5cb85c', fontSize:'13px' }}>✓</span>}
                        <span style={{ fontSize:'14px', color:'#f0e6d3', fontWeight:'600' }}>{book.title}</span>
                        <span style={{ fontSize:'9px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.8px', color:pc.color, opacity:0.8 }}>{pc.label}</span>
                      </div>
                      <div style={{ fontSize:'12px', color:'#8a7e6e', margin:'2px 0 4px' }}>{book.author} · {book.publisher}</div>
                      <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                        <LinkPill href={googleSearchUrl(book.title, book.author)} icon="🔍" label="Google" />
                        <LinkPill href={googleShoppingUrl(book.title, book.author)} icon="🛒" label="Shopping" />
                        <LinkPill href={amazonSearchUrl(book.title, book.author)} icon="📦" label="Amazon" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Accordion */}
      <div style={{ padding:'20px 32px 40px' }}>
        {categories.map(cat => {
          const isOpen = activeCategory === cat.id;
          return (
            <div key={cat.id} style={{ marginBottom:'6px' }}>
              <button onClick={() => setActiveCategory(isOpen ? null : cat.id)} style={{
                width:'100%', display:'flex', alignItems:'center', gap:'12px', padding:'16px',
                background: isOpen ? 'rgba(212,175,55,0.06)' : 'transparent', border:'none',
                borderBottom: isOpen ? 'none' : '1px solid rgba(255,255,255,0.05)',
                borderRadius: isOpen ? '10px 10px 0 0' : '0', cursor:'pointer', textAlign:'left', fontFamily:'inherit',
              }}>
                <span style={{ fontSize:'22px' }}>{cat.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'16px', fontWeight:'600', color: isOpen ? '#d4af37' : '#e8e0d4' }}>{cat.name}</div>
                  <div style={{ fontSize:'12px', color:'#6b6156', marginTop:'2px' }}>{cat.books.length} book{cat.books.length !== 1 ? 's' : ''}</div>
                </div>
                <span style={{ fontSize:'18px', color:'#6b6156', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition:'transform 0.25s ease' }}>›</span>
              </button>
              {isOpen && (
                <div style={{ background:'rgba(212,175,55,0.03)', borderRadius:'0 0 10px 10px', padding:'4px 16px 16px', borderTop:'1px solid rgba(212,175,55,0.08)' }}>
                  <p style={{ fontSize:'13px', color:'#9a8e7e', lineHeight:1.6, margin:'12px 0 16px', fontStyle:'italic' }}>{cat.why}</p>
                  {cat.books.map(book => {
                    const bookId = `${cat.id}-${book.id}`;
                    const isExpanded = expandedBooks.has(bookId);
                    const pc = priorityConfig[book.priority] || priorityConfig.medium;
                    return (
                      <div key={book.id} style={{ background:pc.bg, border:`1px solid ${pc.border}`, borderRadius:'8px', padding:'14px 16px', marginBottom:'8px' }}>
                        <div onClick={() => toggleBook(bookId)} style={{ cursor:'pointer', display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'10px' }}>
                          <div style={{ flex:1 }}>
                            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                              {book.owned && <span style={{ color:'#5cb85c', fontSize:'14px' }} title="Owned">✓</span>}
                              <span style={{ fontSize:'15px', fontWeight:'600', color:'#f0e6d3', lineHeight:1.3 }}>{book.title}</span>
                            </div>
                            <div style={{ fontSize:'13px', color:'#8a7e6e', marginTop:'3px' }}>{book.author} · {book.publisher}</div>
                          </div>
                          <span style={{ fontSize:'10px', fontWeight:'700', letterSpacing:'1px', textTransform:'uppercase',
                            color:pc.color, background:pc.bg, border:`1px solid ${pc.border}`,
                            padding:'3px 8px', borderRadius:'10px', whiteSpace:'nowrap', flexShrink:0 }}>{pc.label}</span>
                        </div>
                        {isExpanded && (
                          <div style={{ marginTop:'12px', paddingTop:'12px', borderTop:`1px solid ${pc.border}` }}>
                            <div style={{ fontSize:'13px', lineHeight:1.65, color:'#b8ad9e', marginBottom:'10px' }}>
                              <strong style={{ color:'#d4af37', fontWeight:'600' }}>Why this book:</strong> {book.why}
                            </div>
                            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', alignItems:'center' }}>
                              <LinkPill href={googleSearchUrl(book.title, book.author)} icon="🔍" label="Google" />
                              <LinkPill href={googleShoppingUrl(book.title, book.author)} icon="🛒" label="Shopping" />
                              <LinkPill href={amazonSearchUrl(book.title, book.author)} icon="📦" label="Amazon" />
                              <div style={{ flex:1 }} />
                              <button onClick={(e) => { e.stopPropagation(); toggleOwned(book); }} style={{
                                fontSize:'11px', padding:'4px 12px', borderRadius:'14px', cursor:'pointer', fontFamily:'inherit',
                                border: book.owned ? '1px solid rgba(92,184,92,0.4)' : '1px solid rgba(255,255,255,0.15)',
                                background: book.owned ? 'rgba(92,184,92,0.12)' : 'rgba(255,255,255,0.05)',
                                color: book.owned ? '#5cb85c' : '#8a7e6e',
                              }}>
                                {book.owned ? '✓ Owned' : '+ Mark Owned'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ padding:'24px 32px', borderTop:'1px solid rgba(212,175,55,0.12)', textAlign:'center' }}>
        <p style={{ fontSize:'12px', color:'#5a5045', margin:0 }}>
          Tap category → expand · Tap book → rationale & links · 📋 Plain List → flat view · 📎 Copy All → clipboard
        </p>
      </div>
    </div>
  );
}
