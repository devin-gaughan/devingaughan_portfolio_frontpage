import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

const QuantumArtifact = () => {
  const meshRef = useRef();
  const ringRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Rotate the main crystal
    meshRef.current.rotation.x = time * 0.2;
    meshRef.current.rotation.y = time * 0.3;
    
    // Rotate the outer ring in reverse
    ringRef.current.rotation.x = time * 0.1;
    ringRef.current.rotation.z = -time * 0.2;
    
    // "Breathing" scale effect
    const scale = 1 + Math.sin(time) * 0.1;
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <group>
      {/* 1. The Inner Crystal Lattice (Wireframe) */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.8, 1]} /> {/* args: [radius, detail] */}
        <meshStandardMaterial 
            color="#c9a961" 
            wireframe 
            emissive="#c9a961" 
            emissiveIntensity={0.5} 
        />
      </mesh>

      {/* 2. The Outer Energy Field (Transparent Shell) */}
      <mesh>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshStandardMaterial 
            color="#d4af37" 
            transparent 
            opacity={0.05} 
            roughness={0} 
            metalness={0.8} 
        />
      </mesh>

      {/* 3. The Scanning Ring (Sci-Fi UI feel) */}
      <mesh ref={ringRef}>
        <torusGeometry args={[3.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

const Hologram = () => {
  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      zIndex: -1, // Behind the text
      pointerEvents: 'none' // Let clicks pass through to buttons
    }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#c9a961" intensity={0.5} />
        
        <QuantumArtifact />
        
        {/* Allows mouse interaction if you remove pointerEvents: 'none' above */}
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};

export default Hologram;