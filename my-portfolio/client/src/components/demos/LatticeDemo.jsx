import React, { useState, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';

// --- ATOM COMPONENT ---
const Atom = ({ position, color, radius, vibrationIntensity }) => {
  const meshRef = useRef();
  // Store initial position to vibrate around
  const [initialPos] = useState(new THREE.Vector3(...position));
  const [phase] = useState(Math.random() * Math.PI * 2);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Brownian Thermal Vibration
    meshRef.current.position.x = initialPos.x + Math.sin(t * 15 + phase) * vibrationIntensity;
    meshRef.current.position.y = initialPos.y + Math.cos(t * 13 + phase) * vibrationIntensity;
    meshRef.current.position.z = initialPos.z + Math.sin(t * 10 + phase) * vibrationIntensity;
  });

  return (
    <mesh ref={meshRef} position={initialPos}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.1} 
        metalness={0.9} 
        emissive={color}
        emissiveIntensity={0.15}
      />
    </mesh>
  );
};

// --- BOND COMPONENT ---
const Bond = ({ start, end, radius }) => {
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  const distance = startVec.distanceTo(endVec);
  const mid = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
  
  const direction = new THREE.Vector3().subVectors(endVec, startVec);
  const defaultUp = new THREE.Vector3(0, 1, 0); 
  const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultUp, direction.normalize());

  return (
    <mesh position={mid} quaternion={quaternion}>
      <cylinderGeometry args={[radius * 0.15, radius * 0.15, distance, 8]} />
      <meshStandardMaterial color="#666" transparent opacity={0.4} />
    </mesh>
  );
};

// --- LATTICE SYSTEM GENERATOR ---
const LatticeSystem = ({ temp, structure, latticeConstant, atomRadius, showBonds }) => {
  // Convert real units to World Units (1 Angstrom = 1 World Unit)
  // Atom Radius is in pm (picometers), so /100 to get Angstroms
  const r = atomRadius / 100;
  
  const { atoms, bonds } = useMemo(() => {
    const atomList = [];
    const bondList = [];
    const gridSize = 1; // 1x1x1 unit cells (keep small for performance)
    
    // Helper to add atom
    const addAtom = (x, y, z, type) => {
      // Scale coordinates by Lattice Constant (a)
      atomList.push({ 
        pos: [x * latticeConstant, y * latticeConstant, z * latticeConstant], 
        type 
      });
    };

    // 1. GENERATE ATOMS
    for (let x = -gridSize; x <= gridSize; x++) {
      for (let y = -gridSize; y <= gridSize; y++) {
        for (let z = -gridSize; z <= gridSize; z++) {
          // All structures have corners
          addAtom(x, y, z, 'corner');

          if (x < gridSize && y < gridSize && z < gridSize) {
            // BCC: Add center atom
            if (structure === 'BCC') {
               addAtom(x + 0.5, y + 0.5, z + 0.5, 'center');
            }
            // FCC: Add face centers
            if (structure === 'FCC') {
               addAtom(x + 0.5, y + 0.5, z, 'face'); // Front/Back
               addAtom(x + 0.5, y, z + 0.5, 'face'); // Top/Bottom
               addAtom(x, y + 0.5, z + 0.5, 'face'); // Left/Right
            }
          }
        }
      }
    }

    // 2. GENERATE BONDS (Dynamic Threshold)
    // Neighbors distance depends on geometry
    let threshold = latticeConstant * 1.01; // Default SC
    if (structure === 'BCC') threshold = (latticeConstant * Math.sqrt(3) / 2) * 1.01;
    if (structure === 'FCC') threshold = (latticeConstant / Math.sqrt(2)) * 1.01;

    atomList.forEach((atom1, i) => {
      atomList.forEach((atom2, j) => {
        if (i >= j) return; 
        const d = Math.sqrt(
            Math.pow(atom1.pos[0] - atom2.pos[0], 2) + 
            Math.pow(atom1.pos[1] - atom2.pos[1], 2) + 
            Math.pow(atom1.pos[2] - atom2.pos[2], 2)
        );
        if (d > 0.01 && d <= threshold) {
            bondList.push({ start: atom1.pos, end: atom2.pos });
        }
      });
    });

    return { atoms: atomList, bonds: bondList };
  }, [structure, latticeConstant]); // Recalc when these change

  // Temp Vibration (0K = 0, 1000K = 0.15A)
  const vibration = (temp / 1000) * 0.15;
  
  // Color Logic
  const getAtomColor = (type) => {
    if (type === 'center') return '#ffaa00'; // Orange
    if (type === 'face') return '#00aaff';   // Blue
    return '#c9a961';                        // Gold (Corner)
  };

  return (
    <group rotation={[0.4, 0.6, 0]}>
      {atoms.map((atom, i) => (
        <Atom 
            key={i} 
            position={atom.pos} 
            color={getAtomColor(atom.type)} 
            radius={r}
            vibrationIntensity={vibration} 
        />
      ))}
      {showBonds && bonds.map((bond, i) => (
        <Bond key={i} start={bond.start} end={bond.end} radius={r} />
      ))}
    </group>
  );
};

// --- CALCULATIONS HELPER ---
const calculateMetrics = (structure, a, r_pm) => {
  const r = r_pm / 100; // convert pm to Angstroms
  const cellVol = Math.pow(a, 3);
  let atomsPerCell = 1; // SC
  if (structure === 'BCC') atomsPerCell = 2;
  if (structure === 'FCC') atomsPerCell = 4;
  
  const sphereVol = (4/3) * Math.PI * Math.pow(r, 3);
  const atomicVol = atomsPerCell * sphereVol;
  const apf = atomicVol / cellVol; // Atomic Packing Factor

  return {
    vol: cellVol.toFixed(2),
    apf: apf.toFixed(3),
    count: atomsPerCell
  };
};

// --- MAIN UI COMPONENT ---
const LatticeDemo = () => {
  const [temp, setTemp] = useState(298); // Kelvin
  const [latticeConstant, setLatticeConstant] = useState(3.5); // Angstroms
  const [atomRadius, setAtomRadius] = useState(70); // Picometers
  const [structure, setStructure] = useState('FCC');
  const [showBonds, setShowBonds] = useState(true);

  const stats = calculateMetrics(structure, latticeConstant, atomRadius);

  return (
    <div style={{display: 'flex', height: '100%', fontFamily: 'monospace', color: '#c9a961'}}>
      
      {/* --- CONTROLS SIDEBAR --- */}
      <div style={{
        width: '280px', 
        borderRight: '1px solid rgba(201, 169, 97, 0.3)', 
        padding: '20px',
        background: 'rgba(5, 5, 5, 0.9)',
        display: 'flex', 
        flexDirection: 'column',
        gap: '15px',
        fontSize: '0.85rem'
      }}>
        <h3 style={{borderBottom: '1px solid #444', paddingBottom: '10px', margin: 0}}>LATTICE_CONFIG</h3>

        {/* Structure Select */}
        <div>
           <label>Structure Type</label>
           <select 
             value={structure} 
             onChange={e => setStructure(e.target.value)}
             style={{width: '100%', background: '#111', color: '#c9a961', border: '1px solid #333', padding: '5px', marginTop: '5px'}}
           >
             <option value="SC">Simple Cubic (SC)</option>
             <option value="BCC">Body-Centered (BCC)</option>
             <option value="FCC">Face-Centered (FCC)</option>
           </select>
        </div>

        {/* Sliders */}
        <div>
          <label>Lattice Constant (a): {latticeConstant} Å</label>
          <input type="range" min="2.5" max="6.0" step="0.1" value={latticeConstant} 
             onChange={e => setLatticeConstant(parseFloat(e.target.value))}
             style={{width: '100%', accentColor: '#c9a961'}} />
        </div>

        <div>
          <label>Atomic Radius (r): {atomRadius} pm</label>
          <input type="range" min="50" max="200" step="5" value={atomRadius} 
             onChange={e => setAtomRadius(parseInt(e.target.value))}
             style={{width: '100%', accentColor: '#c9a961'}} />
        </div>

        <div>
          <label>Temperature: <span style={{color: temp > 800 ? '#ff4444' : 'inherit'}}>{temp} K</span></label>
          <input type="range" min="0" max="1500" step="10" value={temp} 
             onChange={e => setTemp(parseInt(e.target.value))}
             style={{width: '100%', accentColor: '#c9a961'}} />
        </div>

        {/* --- REAL-TIME DATA READOUT --- */}
        <div style={{marginTop: 'auto', borderTop: '1px solid #333', paddingTop: '15px'}}>
           <h4 style={{color: '#fff', marginBottom: '10px'}}>CALCULATED_METRICS</h4>
           <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
              <div>
                  <div style={{color: '#888', fontSize: '0.7rem'}}>UNIT CELL VOL</div>
                  <div>{stats.vol} Å³</div>
              </div>
              <div>
                  <div style={{color: '#888', fontSize: '0.7rem'}}>ATOMS/CELL</div>
                  <div>{stats.count}</div>
              </div>
              <div style={{gridColumn: 'span 2'}}>
                  <div style={{color: '#888', fontSize: '0.7rem'}}>ATOMIC PACKING FACTOR (APF)</div>
                  <div style={{
                      fontSize: '1.2rem', 
                      color: stats.apf > 0.7 ? '#00ff00' : stats.apf < 0.53 ? '#ffaa00' : '#fff'
                  }}>
                      {stats.apf} <span style={{fontSize:'0.8rem', color:'#666'}}>(Theo: {structure === 'FCC' ? 0.74 : structure === 'BCC' ? 0.68 : 0.52})</span>
                  </div>
              </div>
           </div>
        </div>
      </div>

      {/* --- 3D VIEWPORT --- */}
      <div style={{flex: 1, background: '#000', position: 'relative'}}>
        <div style={{position: 'absolute', top: 10, right: 10, zIndex: 10, color: '#666'}}>
           [Left Click]: Rotate | [Right Click]: Pan
        </div>
        <Canvas camera={{ position: [0, 0, 12], fov: 40 }}>
          <Stars radius={100} depth={50} count={2000} factor={4} fade />
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <pointLight position={[-10, -10, -5]} color="#4444ff" intensity={0.5} />
          
          <LatticeSystem 
             temp={temp} 
             structure={structure}
             latticeConstant={latticeConstant}
             atomRadius={atomRadius}
             showBonds={showBonds}
          />
          
          <OrbitControls makeDefault />
        </Canvas>
      </div>
    </div>
  );
};

export default LatticeDemo;