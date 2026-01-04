import React, { useState, useEffect, useRef } from 'react';

const Terminal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    "DevinOS v1.0.4 (tty1)",
    "Login successful.",
    "Type 'help' for available commands."
  ]);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (isOpen) {
        // Auto-focus input when opened
        setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [history, isOpen]);

  const handleCommand = (cmd) => {
    const cleanCmd = cmd.trim().toLowerCase();
    let response = "";

    switch (cleanCmd) {
      case 'help':
        response = "Available commands: skills, contact, about, clear, exit";
        break;
      case 'skills':
        response = "Loaded Modules: [Python, C++, Embedded C, React, Rust, Assembly, RTOS]";
        break;
      case 'contact':
        response = "E-Mail: devin@devingaughan.com | LinkedIn: /in/devinpgaughan";
        break;
      case 'about':
        response = "System Architect: Devin Gaughan. Location: Earth (Currently).";
        break;
      case 'clear':
        setHistory([]);
        return; // Don't add the command to history if clearing
      case 'exit':
        setIsOpen(false);
        response = "Session terminated.";
        break;
      case '':
        return;
      default:
        response = `Command not found: ${cleanCmd}. Type 'help'.`;
    }

    setHistory([...history, `> ${cmd}`, response]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'rgba(13, 13, 13, 0.9)',
          border: '2px solid #c9a961',
          color: '#c9a961',
          fontSize: '1.2rem',
          cursor: 'pointer',
          zIndex: 1000,
          boxShadow: '0 0 15px rgba(201, 169, 97, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {/* Terminal Icon */}
        <span style={{fontWeight: 'bold', fontFamily: 'monospace'}}>{'>_'}</span>
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '400px',
      height: '300px',
      background: 'rgba(10, 10, 10, 0.95)',
      border: '1px solid #c9a961',
      borderRadius: '8px',
      fontFamily: "'Courier New', monospace",
      padding: '10px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 0 20px rgba(201, 169, 97, 0.2)',
      backdropFilter: 'blur(5px)'
    }}>
      {/* Terminal Header */}
      <div style={{
        borderBottom: '1px solid #333',
        paddingBottom: '5px',
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        color: '#666',
        fontSize: '0.8rem'
      }}>
        <span>TERMINAL.EXE</span>
        <span 
            onClick={() => setIsOpen(false)} 
            style={{cursor: 'pointer', color: '#c9a961'}}
        >[X]</span>
      </div>

      {/* Output Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        color: '#c9a961',
        fontSize: '0.9rem',
        marginBottom: '10px'
      }}>
        {history.map((line, i) => (
          <div key={i} style={{marginBottom: '4px'}}>{line}</div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input Line */}
      <div style={{display: 'flex', alignItems: 'center', color: '#c9a961'}}>
        <span style={{marginRight: '8px'}}>{'>'}</span>
        <input 
          ref={inputRef}
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontFamily: 'inherit',
            fontSize: '0.9rem',
            width: '100%',
            outline: 'none'
          }}
          autoComplete="off"
        />
      </div>
    </div>
  );
};

export default Terminal;