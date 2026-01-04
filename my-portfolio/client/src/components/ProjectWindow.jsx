import React from 'react';

const ProjectWindow = ({ title, onClose, children }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '800px',
      maxWidth: '90vw',
      height: '600px',
      maxHeight: '80vh',
      backgroundColor: 'rgba(10, 10, 16, 0.95)',
      border: '1px solid #c9a961',
      boxShadow: '0 0 50px rgba(201, 169, 97, 0.2)',
      borderRadius: '8px',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      backdropFilter: 'blur(10px)',
      overflow: 'hidden'
    }}>
      {/* Title Bar */}
      <div style={{
        padding: '10px 15px',
        borderBottom: '1px solid rgba(201, 169, 97, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
           {/* Traffic Light Window Controls */}
           <div style={{width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56'}}></div>
           <div style={{width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e'}}></div>
           <div style={{width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f'}}></div>
           <span style={{marginLeft: '10px', color: '#c9a961', fontFamily: 'monospace', fontWeight: 'bold'}}>
             ./bin/{title.toLowerCase().replace(/ /g, '_')}.exe
           </span>
        </div>
        <button 
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#c9a961',
            cursor: 'pointer',
            fontSize: '1.2rem'
          }}
        >✕</button>
      </div>

      {/* Program Content Area */}
      <div style={{flex: 1, position: 'relative', overflow: 'hidden'}}>
        {children}
      </div>
    </div>
  );
};

export default ProjectWindow;