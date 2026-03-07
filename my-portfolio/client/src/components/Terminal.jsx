import React, { useState, useEffect, useRef } from 'react';

const Terminal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    "DevinOS v2.0 — Bangkok, Thailand",
    "Login successful.",
    "Type 'help' for available commands."
  ]);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => endRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [history, isOpen]);

  const handleCommand = (cmd) => {
    const c = cmd.trim().toLowerCase();
    let r = "";
    switch (c) {
      case 'help':
        r = "Commands: skills, stack, contact, lattice, auraeon, languages, about, clear, exit"; break;
      case 'skills':
        r = "Loaded: [React, Three.js, Node.js, Python, C, C++, MongoDB, Linux, RTOS, Assembly]"; break;
      case 'stack':
        r = "Frontend: React + Three.js | Backend: Node/Express | Systems: C/RTOS | Data: MongoDB/MySQL"; break;
      case 'contact':
        r = "Email: devin@devingaughan.com | LinkedIn: /in/devinpgaughan | GitHub: /devin-gaughan"; break;
      case 'lattice':
        r = "Crystal Lattice Sim → devingaughan.com/auraeon/ | FCC, BCC, HCP, Diamond | Miller Indices"; break;
      case 'auraeon':
        r = "Auraeon → auraeon.com | Outdoor gear, solar tech, adventure fuel. Built on Shopify."; break;
      case 'languages':
        r = "Human protocols: English (native), Thai (fluent), Japanese (conversational)"; break;
      case 'about':
        r = "10+ yrs engineering (Intel, HP). CS @ Oregon State. Based in Bangkok. Building things."; break;
      case 'clear':
        setHistory([]); return;
      case 'exit':
        setIsOpen(false); r = "Session terminated."; break;
      case '': return;
      default:
        r = `Command not found: ${c}. Type 'help'.`;
    }
    setHistory([...history, `> ${cmd}`, r]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { handleCommand(input); setInput(''); }
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} style={{
        position:'fixed', bottom:'20px', right:'20px', width:'50px', height:'50px',
        borderRadius:'50%', background:'rgba(13,13,13,0.9)', border:'2px solid #c9a961',
        color:'#c9a961', fontSize:'1.2rem', cursor:'pointer', zIndex:1000,
        boxShadow:'0 0 15px rgba(201,169,97,0.3)', display:'flex',
        alignItems:'center', justifyContent:'center', transition:'all 0.3s'
      }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <span style={{fontWeight:'bold', fontFamily:'monospace'}}>{'>_'}</span>
      </button>
    );
  }

  return (
    <div style={{
      position:'fixed', bottom:'20px', right:'20px', width:'420px', height:'300px',
      background:'rgba(10,10,10,0.95)', border:'1px solid #c9a961', borderRadius:'8px',
      fontFamily:"'Courier New', monospace", padding:'10px', zIndex:1000,
      display:'flex', flexDirection:'column', boxShadow:'0 0 20px rgba(201,169,97,0.2)',
      backdropFilter:'blur(5px)'
    }}>
      <div style={{borderBottom:'1px solid #333', paddingBottom:'5px', marginBottom:'10px',
        display:'flex', justifyContent:'space-between', color:'#666', fontSize:'0.8rem'}}>
        <span>TERMINAL.EXE</span>
        <span onClick={() => setIsOpen(false)} style={{cursor:'pointer', color:'#c9a961'}}>[X]</span>
      </div>
      <div style={{flex:1, overflowY:'auto', color:'#c9a961', fontSize:'0.9rem', marginBottom:'10px'}}>
        {history.map((line, i) => <div key={i} style={{marginBottom:'4px'}}>{line}</div>)}
        <div ref={endRef} />
      </div>
      <div style={{display:'flex', alignItems:'center', color:'#c9a961'}}>
        <span style={{marginRight:'8px'}}>{'>'}</span>
        <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown} autoComplete="off"
          style={{background:'transparent', border:'none', color:'#fff', fontFamily:'inherit',
            fontSize:'0.9rem', width:'100%', outline:'none'}} />
      </div>
    </div>
  );
};

export default Terminal;
