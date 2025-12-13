// src/App.js
import React, { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import ProjectNetwork from './components/ProjectNetwork';
import ProjectDetails from './components/ProjectDetails';
import { projectsData } from './data/projectsData';
import './App.css';

function Loader() {
  return (
    <div className="loader">
      <span>Loading Cosmic Experience...</span>
    </div>
  );
}

function Sidebar({ visible, projects, selectedProjectId, onSelect, onClose }) {
  if (!visible) return null;

  const containerStyle = {
    position: 'fixed',
    top: 0,
    right: 0,
    height: '100%',
    width: '240px',
    background: 'rgba(0,0,0,0.9)',
    borderLeft: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 0 30px rgba(0,0,0,0.5)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    zIndex: 950,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '"BBH bartle", sans-serif',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  };

  const closeStyle = {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.08)',
    color: '#cbd5e1',
    cursor: 'pointer'
  };

  const listStyle = {
    overflowY: 'auto',
    padding: '8px 6px'
  };

  const itemStyle = (project, selected) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 8px',
    marginBottom: '6px',
    borderRadius: '10px',
    cursor: 'pointer',
    background: selected ? 'rgba(255,255,255,0.06)' : 'transparent',
    border: selected ? `1px solid ${project.color}55` : '1px solid rgba(255,255,255,0.06)'
  });

  const dotStyle = (color) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: color,
    boxShadow: `0 0 8px ${color}66`
  });

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <span style={{ color: '#ffffff', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '1px' }}>Projects</span>
        <button onClick={onClose} style={closeStyle}>×</button>
      </div>
      <div style={listStyle}>
        {projects.map((p) => (
          <div key={p.id} onClick={() => onSelect(p)} style={itemStyle(p, selectedProjectId === p.id)}>
            <span style={dotStyle(p.color)} />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: '#e5e7eb', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {p.title}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{p.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const controlsRef = useRef();

  return (
    <div className="app">
      <div className="canvas-container">
        <Canvas 
          camera={{ position: [0, 40, 60], fov: 50, near: 0.1, far: 2000 }}
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            alpha: true
          }}
          dpr={[1, 2]} // Better quality on high-DPI displays
        >
          <Suspense fallback={null}>
            {/* Deep Space Background */}
            <color attach="background" args={["#000000"]} />
            <fog attach="fog" args={["#000000", 150, 1200]} />
            
            {/* Enhanced Stars - More realistic distribution */}
            <Stars 
              radius={150} 
              depth={100} 
              count={150} 
              factor={6} 
              saturation={0.1}
              fade 
              speed={0.3}
            />
            
                        
            {/* Lighting */}
            <ambientLight intensity={0.2} color="#4466aa" />
            <pointLight position={[0, 0, 0]} intensity={2.5} color="#ffd700" />
            <pointLight position={[30, 20, 30]} intensity={0.3} color="#4466ff" />
            <pointLight position={[-30, -20, -30]} intensity={0.3} color="#ff4466" />
            
            <ProjectNetwork 
              projects={projectsData} 
              onProjectSelect={setSelectedProject}
            />
            
            {/* Minimal 3D navbar text */}
            <Text
              position={[0, 35, 0]}
              fontSize={1}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              font={undefined}
            >
              Diddy's solar system
            </Text>

            <OrbitControls 
              ref={controlsRef}
              enableZoom={true} 
              enablePan={true}
              minDistance={20}
              maxDistance={1000}
              autoRotate={false}
              autoRotateSpeed={0.1}
              rotateSpeed={0.5}
              enableDamping={true}
              dampingFactor={0.05}
            />
          </Suspense>
        </Canvas>
      </div>

      {selectedProject && (
        <ProjectDetails 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Default thin sidebar with title */}
      <div style={{
        position: 'fixed', top: 0, left: 0, height: '100%', width: '84px',
        background: 'rgba(0,0,0,0.9)', borderRight: '1px solid rgba(255,255,255,0.1)',
        zIndex: 940, display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        <div style={{
          writingMode: 'vertical-rl', transform: 'rotate(180deg)',
          color: '#ffffff', letterSpacing: '2px', fontWeight: 800, fontSize: '0.8rem',
          marginTop: '24px'
        }}>
          KUROs SOLAR SYSTEM
        </div>
      </div>

      {selectedProject && (
        <Sidebar
          visible={true}
          projects={projectsData}
          selectedProjectId={selectedProject?.id}
          onSelect={(p) => setSelectedProject(p)}
          onClose={() => setSelectedProject(null)}
        />
      )}

      <div className="ui-overlay">
        <div className="instructions">
          <span>Orbit • Scroll Zoom • Click Planets</span>
        </div>
        <div className="system-info">
          <span>{projectsData.length} Projects • Solar System</span>
        </div>
      </div>
    </div>
  );
}

export default App;