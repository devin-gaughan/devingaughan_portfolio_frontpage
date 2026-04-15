import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.devingaughan.com';
function getToken() { return sessionStorage.getItem('auraeon_token'); }

const TIER_ORDER = ['novice', 'competent', 'proficient', 'advanced', 'expert'];
const TIER_LABELS = { novice: 'Novice', competent: 'Competent', proficient: 'Proficient', advanced: 'Advanced', expert: 'Expert' };
const QUESTIONS_PER_ASSESSMENT = 10;
const PASS_THRESHOLD = 0.7;

// ── Backend proxy for Claude-powered assessment ──────────────────────
async function apiFetch(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed (${res.status})`);
  }
  return res.json();
}

async function generateQuestion(domain, tier, questionNum, history) {
  return apiFetch('/api/assessments/generate-question', {
    domain_name: domain.name,
    domain_slug: domain.slug,
    tier,
    question_num: questionNum,
    total_questions: QUESTIONS_PER_ASSESSMENT,
    history: history.map(h => ({ question: h.question, score: h.score })),
  });
}

async function evaluateAnswer(domain, tier, question, answer) {
  return apiFetch('/api/assessments/evaluate-answer', {
    domain_name: domain.name,
    tier,
    question,
    answer,
  });
}

async function saveAssessment(domainSlug, tier, score, passed, questions, durationSec, notes) {
  const res = await fetch(`${API_URL}/api/assessments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({
      domain_slug: domainSlug, tier_attempted: tier, score, passed,
      question_count: questions.length, questions_data: questions,
      duration_seconds: durationSec, notes,
    }),
  });
  return res.json();
}

// ── Styles ────────────────────────────────────────────────────────────
const s = {
  page: { fontFamily: "'Palatino Linotype','Book Antiqua',Georgia,serif", background: 'linear-gradient(165deg,#0d0d0d 0%,#1a1510 40%,#0d0d0d 100%)', color: '#e8e0d4', minHeight: '100vh' },
  header: { padding: '32px 32px 20px', borderBottom: '1px solid rgba(212,175,55,0.2)', background: 'linear-gradient(180deg,rgba(212,175,55,0.06) 0%,transparent 100%)' },
  content: { padding: '24px 32px 40px', maxWidth: '720px', margin: '0 auto' },
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', marginBottom: '16px' },
  btn: { padding: '12px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', border: 'none', borderRadius: '8px', fontFamily: 'inherit', transition: 'opacity 0.2s' },
  textarea: { width: '100%', minHeight: '150px', padding: '14px', fontSize: '15px', fontFamily: "'Palatino Linotype',Georgia,serif", background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#e8e0d4', resize: 'vertical', outline: 'none', boxSizing: 'border-box', lineHeight: '1.6' },
};

export default function Assessment({ domain: initialDomain, onNavigate, onLogout }) {
  // Phases: select_domain, select_tier, testing, reviewing, results
  const [phase, setPhase] = useState(initialDomain ? 'select_tier' : 'select_domain');
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(initialDomain || null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [skillTree, setSkillTree] = useState(null);

  // Assessment state
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNum, setQuestionNum] = useState(1);
  const [answer, setAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [startTime] = useState(Date.now());
  const [inputMode, setInputMode] = useState('text'); // text, math, code
  const [katexReady, setKatexReady] = useState(false);

  // Auto-detect input mode from domain category
  useEffect(() => {
    if (selectedDomain) {
      const cat = selectedDomain.category || '';
      if (['Physics', 'Mathematics'].includes(cat)) setInputMode('math');
      else if (cat === 'Computer Science') setInputMode('code');
      else setInputMode('text');
    }
  }, [selectedDomain]);

  // Load KaTeX dynamically
  useEffect(() => {
    if (document.getElementById('katex-css')) { setKatexReady(!!window.katex); return; }
    const link = document.createElement('link');
    link.id = 'katex-css'; link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css';
    document.head.appendChild(link);
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js';
    script.onload = () => setKatexReady(true);
    document.head.appendChild(script);
  }, []);

  // Load domains
  useEffect(() => {
    fetch(`${API_URL}/api/domains`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json()).then(setDomains).catch(e => setError(e.message));
  }, []);

  // Load skill tree when domain selected
  const loadSkillTree = async (slug) => {
    const r = await fetch(`${API_URL}/api/domains/${slug}/skill-tree`, { headers: { Authorization: `Bearer ${getToken()}` } });
    const data = await r.json();
    setSkillTree(data);
  };

  const selectDomain = (d) => {
    setSelectedDomain(d);
    loadSkillTree(d.slug);
    setPhase('select_tier');
  };

  const startAssessment = async (tier) => {
    setSelectedTier(tier);
    setPhase('testing');
    setQuestionNum(1);
    setHistory([]);
    setLoading(true);
    setError('');
    try {
      const q = await generateQuestion(selectedDomain, tier, 1, []);
      setCurrentQuestion(q);
    } catch (e) { setError('Failed to generate question: ' + e.message); }
    setLoading(false);
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    setError('');
    try {
      const eval_result = await evaluateAnswer(selectedDomain, selectedTier, currentQuestion.question, answer);
      setEvaluation(eval_result);
      setHistory(prev => [...prev, {
        question: currentQuestion.question, type: currentQuestion.type,
        answer, score: eval_result.score, correct: eval_result.correct,
        feedback: eval_result.feedback, strengths: eval_result.strengths,
        gaps: eval_result.gaps, correct_answer: eval_result.correct_answer_summary,
      }]);
      setPhase('reviewing');
    } catch (e) { setError('Evaluation failed: ' + e.message); }
    setLoading(false);
  };

  const nextQuestion = async () => {
    const next = questionNum + 1;
    if (next > QUESTIONS_PER_ASSESSMENT) {
      // Assessment complete
      const totalScore = history.reduce((s, h) => s + (h.score || 0), 0) / (QUESTIONS_PER_ASSESSMENT * 10);
      const passed = totalScore >= PASS_THRESHOLD;
      const durationSec = Math.round((Date.now() - startTime) / 1000);
      setLoading(true);
      try {
        await saveAssessment(selectedDomain.slug, selectedTier, totalScore, passed, history, durationSec,
          `Adaptive assessment: ${QUESTIONS_PER_ASSESSMENT} questions at ${selectedTier} level.`);
      } catch (e) { console.error('Save failed:', e); }
      setLoading(false);
      setPhase('results');
      return;
    }
    setQuestionNum(next);
    setAnswer('');
    setEvaluation(null);
    setPhase('testing');
    setLoading(true);
    try {
      const q = await generateQuestion(selectedDomain, selectedTier, next, history);
      setCurrentQuestion(q);
    } catch (e) { setError('Failed to generate question: ' + e.message); }
    setLoading(false);
  };

  // ── Render: Domain Selection ──────────────────────────────────────────
  const renderDomainSelect = () => (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: '400', color: '#f0e6d3', margin: '0 0 16px' }}>Select a knowledge domain to assess</h2>
      {['Physics', 'Mathematics', 'Computer Science'].map(cat => (
        <div key={cat} style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#8a7e6e', margin: '0 0 8px' }}>{cat}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
            {domains.filter(d => d.category === cat).map(d => (
              <div key={d.slug} onClick={() => selectDomain(d)} style={{
                ...s.card, padding: '14px', cursor: 'pointer', marginBottom: 0,
                borderColor: selectedDomain?.slug === d.slug ? 'rgba(212,175,55,0.4)' : undefined,
              }}>
                <span style={{ fontSize: '16px' }}>{d.icon}</span>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#f0e6d3', marginTop: '6px' }}>{d.name}</div>
                <div style={{ fontSize: '11px', color: d.current_level === 'unassessed' ? '#5a5045' : '#d4af37', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {d.current_level === 'unassessed' ? '○ unassessed' : `◆ ${d.current_level}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // ── Render: Tier Selection ────────────────────────────────────────────
  const renderTierSelect = () => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setPhase('select_domain')} style={{ background: 'none', border: 'none', color: '#6b6156', cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit' }}>← Domains</button>
        <span style={{ fontSize: '20px' }}>{selectedDomain?.icon}</span>
        <h2 style={{ fontSize: '20px', fontWeight: '400', color: '#f0e6d3', margin: 0 }}>{selectedDomain?.name}</h2>
      </div>
      <p style={{ fontSize: '14px', color: '#8a7e6e', margin: '0 0 20px' }}>Select the proficiency tier to attempt:</p>
      <div style={{ display: 'grid', gap: '10px' }}>
        {TIER_ORDER.map((tier, i) => {
          const tierData = skillTree?.tiers?.find(t => t.level === tier);
          const colors = { novice: '#a8a8a8', competent: '#7eb8da', proficient: '#1D9E75', advanced: '#d4af37', expert: '#D4537E' };
          const isCurrentOrBelow = selectedDomain?.level_order >= i;
          return (
            <div key={tier} onClick={() => startAssessment(tier)} style={{
              ...s.card, padding: '16px', cursor: 'pointer', marginBottom: 0,
              borderColor: `rgba(${tier === 'expert' ? '212,83,126' : '255,255,255'},0.15)`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: colors[tier], textTransform: 'uppercase', letterSpacing: '1px' }}>{TIER_LABELS[tier]}</span>
                  {tierData?.description && <div style={{ fontSize: '13px', color: '#8a7e6e', marginTop: '4px', lineHeight: 1.5 }}>{tierData.description}</div>}
                </div>
                <span style={{ fontSize: '13px', color: '#5a5045' }}>→</span>
              </div>
              {tierData?.books?.length > 0 && (
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b6156' }}>
                  Required reading: {tierData.books.filter(b => b.is_required).map(b => b.title.substring(0, 30)).join(', ')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── Render: Active Testing ────────────────────────────────────────────
  const renderTesting = () => (
    <div>
      {/* Progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <span style={{ fontSize: '12px', color: '#8a7e6e' }}>{selectedDomain?.icon} {selectedDomain?.name} · {TIER_LABELS[selectedTier]}</span>
        <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
          <div style={{ height: '100%', width: `${(questionNum / QUESTIONS_PER_ASSESSMENT) * 100}%`, background: '#d4af37', borderRadius: '2px', transition: 'width 0.3s' }} />
        </div>
        <span style={{ fontSize: '12px', color: '#d4af37', fontWeight: '500' }}>{questionNum}/{QUESTIONS_PER_ASSESSMENT}</span>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#d4af37', fontSize: '14px' }}>Generating question...</div>
      ) : currentQuestion ? (
        <div>
          <div style={{ ...s.card, borderColor: 'rgba(212,175,55,0.2)' }}>
            <div style={{ fontSize: '11px', color: '#8a7e6e', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
              {currentQuestion.type || 'Question'} · {currentQuestion.topic || selectedDomain?.name}
            </div>
            <div style={{ fontSize: '16px', color: '#f0e6d3', lineHeight: 1.7 }}>{currentQuestion.question}</div>
          </div>

          <div style={{ margin: '16px 0' }}>
            {/* Input mode tabs */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
              {[['text', '📝 Text'], ['math', '∫ Math (LaTeX)'], ['code', '< > Code']].map(([mode, label]) => (
                <button key={mode} onClick={() => setInputMode(mode)} style={{
                  padding: '4px 12px', borderRadius: '14px', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit', border: 'none',
                  background: inputMode === mode ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.04)',
                  color: inputMode === mode ? '#d4af37' : '#6b6156',
                }}>{label}</button>
              ))}
            </div>

            {/* Math symbol toolbar */}
            {inputMode === 'math' && (
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                {[
                  ['α','\\alpha'],['β','\\beta'],['γ','\\gamma'],['δ','\\delta'],['ε','\\epsilon'],
                  ['θ','\\theta'],['λ','\\lambda'],['μ','\\mu'],['π','\\pi'],['σ','\\sigma'],
                  ['φ','\\phi'],['ψ','\\psi'],['ω','\\omega'],['ℏ','\\hbar'],['∇','\\nabla'],
                  ['∂','\\partial'],['∫','\\int'],['∑','\\sum'],['∏','\\prod'],['√','\\sqrt{}'],
                  ['→','\\rightarrow'],['⟨|','\\langle'],['|⟩','\\rangle'],['∞','\\infty'],
                  ['frac','\\frac{}{}'],['vec','\\vec{}'],['hat','\\hat{}'],['dot','\\dot{}'],
                ].map(([display, tex]) => (
                  <button key={tex} onClick={() => {
                    const ta = document.getElementById('answer-input');
                    if (ta) { const pos = ta.selectionStart; const before = answer.slice(0, pos); const after = answer.slice(pos);
                      const cursorOffset = tex.includes('{}') ? tex.indexOf('{') + 1 : tex.length;
                      setAnswer(before + tex + after);
                      setTimeout(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = pos + cursorOffset; }, 0);
                    } else setAnswer(answer + tex);
                  }} style={{
                    padding: '3px 8px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontFamily: "'Palatino Linotype',serif",
                    background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', color: '#b8ad9e',
                  }}>{display}</button>
                ))}
              </div>
            )}

            <textarea id="answer-input" value={answer} onChange={e => setAnswer(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && e.ctrlKey) { submitAnswer(); return; }
                if (e.key === 'Tab' && inputMode === 'code') { e.preventDefault(); const pos = e.target.selectionStart;
                  setAnswer(answer.slice(0, pos) + '  ' + answer.slice(pos));
                  setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = pos + 2; }, 0); }
              }}
              placeholder={inputMode === 'math' ? 'Use LaTeX notation: \\psi(x) = A e^{ikx}, \\frac{d^2}{dx^2}, etc. Your raw LaTeX will be sent for evaluation.'
                : inputMode === 'code' ? 'Write your code here. Tab inserts spaces. Be thorough with comments.'
                : 'Type your answer here... Be thorough — show your reasoning and working.'}
              style={{
                ...s.textarea,
                fontFamily: inputMode === 'code' ? "'Consolas','Monaco','Courier New',monospace" : inputMode === 'math' ? "'Palatino Linotype','CMU Serif',Georgia,serif" : s.textarea.fontFamily,
                fontSize: inputMode === 'code' ? '14px' : '15px',
                minHeight: inputMode === 'code' ? '200px' : '150px',
                tabSize: 2,
              }} />

            {/* LaTeX live preview */}
            {inputMode === 'math' && answer.trim() && katexReady && (
              <div style={{ marginTop: '8px', padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: '#8a7e6e', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Preview</div>
                <div style={{ color: '#f0e6d3', fontSize: '16px', lineHeight: 2, overflowX: 'auto' }}
                  dangerouslySetInnerHTML={{ __html: (() => {
                    try {
                      // Replace display math blocks $$...$$ and inline $...$
                      let html = answer.replace(/\$\$([\s\S]*?)\$\$/g, (_, tex) => {
                        try { return '<div style="text-align:center;margin:8px 0">' + window.katex.renderToString(tex.trim(), { displayMode: true, throwOnError: false }) + '</div>'; }
                        catch { return `<span style="color:#e8685a">[Error: ${tex}]</span>`; }
                      });
                      html = html.replace(/\$([^$\n]+?)\$/g, (_, tex) => {
                        try { return window.katex.renderToString(tex.trim(), { throwOnError: false }); }
                        catch { return `<span style="color:#e8685a">[?]</span>`; }
                      });
                      // Also try rendering the entire thing as LaTeX if no $ delimiters
                      if (!answer.includes('$') && (answer.includes('\\') || answer.includes('^') || answer.includes('_'))) {
                        try { return window.katex.renderToString(answer.trim(), { displayMode: true, throwOnError: false }); }
                        catch { return html; }
                      }
                      return html || '<span style="color:#5a5045">Start typing LaTeX...</span>';
                    } catch { return '<span style="color:#e8685a">Preview error</span>'; }
                  })() }} />
              </div>
            )}

            <div style={{ fontSize: '11px', color: '#5a5045', marginTop: '6px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Ctrl+Enter to submit{inputMode === 'math' ? ' · Wrap inline math in $...$ or display math in $$...$$' : inputMode === 'code' ? ' · Tab indents' : ''}</span>
              <span>{answer.length} chars</span>
            </div>
          </div>

          <button onClick={submitAnswer} disabled={!answer.trim() || loading}
            style={{ ...s.btn, background: answer.trim() ? 'linear-gradient(135deg,#d4af37,#c9a961)' : 'rgba(255,255,255,0.06)',
              color: answer.trim() ? '#0d0d0d' : '#5a5045', width: '100%' }}>
            Submit Answer
          </button>
        </div>
      ) : null}
    </div>
  );

  // ── Render: Review Evaluation ─────────────────────────────────────────
  const renderReview = () => {
    if (!evaluation) return null;
    const scoreColor = evaluation.score >= 7 ? '#1D9E75' : evaluation.score >= 5 ? '#EF9F27' : '#E24B4A';
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <span style={{ fontSize: '12px', color: '#8a7e6e' }}>Question {questionNum} of {QUESTIONS_PER_ASSESSMENT}</span>
        </div>

        {/* Score */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '48px', fontWeight: '400', color: scoreColor }}>{evaluation.score}<span style={{ fontSize: '20px', color: '#5a5045' }}>/10</span></div>
          <div style={{ fontSize: '14px', color: evaluation.correct ? '#1D9E75' : '#E24B4A', fontWeight: '500' }}>
            {evaluation.correct ? '✓ Correct' : '✗ Needs improvement'}
          </div>
        </div>

        {/* Feedback */}
        <div style={{ ...s.card, borderColor: `rgba(${evaluation.score >= 7 ? '29,158,117' : '232,75,74'},0.2)` }}>
          <div style={{ fontSize: '14px', color: '#e8e0d4', lineHeight: 1.7, marginBottom: '12px' }}>{evaluation.feedback}</div>
          {evaluation.strengths?.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: '#1D9E75', fontWeight: '500' }}>Strengths: </span>
              <span style={{ fontSize: '12px', color: '#8a7e6e' }}>{evaluation.strengths.join(' · ')}</span>
            </div>
          )}
          {evaluation.gaps?.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: '#EF9F27', fontWeight: '500' }}>Gaps: </span>
              <span style={{ fontSize: '12px', color: '#8a7e6e' }}>{evaluation.gaps.join(' · ')}</span>
            </div>
          )}
          {evaluation.correct_answer_summary && (
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '12px', color: '#d4af37', fontWeight: '500', marginBottom: '4px' }}>Key answer:</div>
              <div style={{ fontSize: '13px', color: '#b8ad9e', lineHeight: 1.6 }}>{evaluation.correct_answer_summary}</div>
            </div>
          )}
        </div>

        <button onClick={nextQuestion} style={{ ...s.btn, background: 'linear-gradient(135deg,#d4af37,#c9a961)', color: '#0d0d0d', width: '100%', marginTop: '16px' }}>
          {questionNum >= QUESTIONS_PER_ASSESSMENT ? 'View Results' : `Next Question (${questionNum + 1}/${QUESTIONS_PER_ASSESSMENT})`}
        </button>
      </div>
    );
  };

  // ── Render: Final Results ─────────────────────────────────────────────
  const renderResults = () => {
    const totalScore = history.reduce((s, h) => s + (h.score || 0), 0);
    const avgScore = totalScore / history.length;
    const percentage = (totalScore / (history.length * 10)) * 100;
    const passed = percentage >= PASS_THRESHOLD * 100;
    const duration = Math.round((Date.now() - startTime) / 1000);
    const mins = Math.floor(duration / 60);
    const secs = duration % 60;

    return (
      <div>
        {/* Result banner */}
        <div style={{ textAlign: 'center', padding: '32px 0 24px' }}>
          <div style={{ fontSize: '64px', marginBottom: '8px' }}>{passed ? '🏆' : '📘'}</div>
          <div style={{ fontSize: '24px', fontWeight: '400', color: passed ? '#d4af37' : '#8a7e6e' }}>
            {passed ? 'Assessment Passed!' : 'Keep Studying'}
          </div>
          <div style={{ fontSize: '14px', color: '#8a7e6e', marginTop: '8px' }}>
            {selectedDomain?.icon} {selectedDomain?.name} · {TIER_LABELS[selectedTier]}
          </div>
        </div>

        {/* Score card */}
        <div style={{ ...s.card, borderColor: passed ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '400', color: passed ? '#1D9E75' : '#EF9F27' }}>{Math.round(percentage)}%</div>
              <div style={{ fontSize: '12px', color: '#8a7e6e' }}>Overall score</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '400', color: '#f0e6d3' }}>{avgScore.toFixed(1)}</div>
              <div style={{ fontSize: '12px', color: '#8a7e6e' }}>Avg per question</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '400', color: '#f0e6d3' }}>{mins}:{secs.toString().padStart(2, '0')}</div>
              <div style={{ fontSize: '12px', color: '#8a7e6e' }}>Duration</div>
            </div>
          </div>
          {passed && (
            <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(212,175,55,0.08)', borderRadius: '8px', textAlign: 'center' }}>
              <span style={{ fontSize: '13px', color: '#d4af37' }}>
                Your {selectedDomain?.name} proficiency has been updated to {TIER_LABELS[selectedTier]}
              </span>
            </div>
          )}
        </div>

        {/* Question breakdown */}
        <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#8a7e6e', margin: '24px 0 12px' }}>Question breakdown</div>
        {history.map((h, i) => (
          <div key={i} style={{ ...s.card, padding: '14px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', color: '#e8e0d4', lineHeight: 1.5 }}>Q{i + 1}: {h.question?.substring(0, 100)}{h.question?.length > 100 ? '...' : ''}</div>
              </div>
              <div style={{ fontSize: '16px', fontWeight: '500', color: h.score >= 7 ? '#1D9E75' : h.score >= 5 ? '#EF9F27' : '#E24B4A', marginLeft: '12px' }}>
                {h.score}/10
              </div>
            </div>
          </div>
        ))}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button onClick={() => onNavigate('/dashboard')} style={{ ...s.btn, flex: 1, background: 'rgba(255,255,255,0.06)', color: '#8a7e6e', border: '1px solid rgba(255,255,255,0.1)' }}>
            ← Dashboard
          </button>
          <button onClick={() => { setPhase('select_tier'); setHistory([]); setQuestionNum(1); setEvaluation(null); setAnswer(''); }}
            style={{ ...s.btn, flex: 1, background: 'linear-gradient(135deg,#d4af37,#c9a961)', color: '#0d0d0d' }}>
            Retake Assessment
          </button>
        </div>
      </div>
    );
  };

  // ── Main Render ───────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: '#d4af37' }}>ASSESSMENT ENGINE</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => onNavigate('/dashboard')} style={{ fontSize: '12px', color: '#6b6156', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>← Dashboard</button>
          </div>
        </div>
      </div>
      <div style={s.content}>
        {error && <div style={{ background: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.3)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#e8685a', marginBottom: '16px' }}>{error}</div>}
        {phase === 'select_domain' && renderDomainSelect()}
        {phase === 'select_tier' && renderTierSelect()}
        {phase === 'testing' && renderTesting()}
        {phase === 'reviewing' && renderReview()}
        {phase === 'results' && renderResults()}
      </div>
    </div>
  );
}
