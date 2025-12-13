// src/components/ProjectNetwork.js
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import ProjectPlanet from './ProjectPlanet';
import { textureLoader } from '../utils/textureLoader';
import sunTexUrl from '../assests/textures/sun/sun_color.png';

const ProjectNetwork = ({ projects = [], onProjectSelect }) => {
  const groupRef = useRef();
  const sunRef = useRef();
  const [sunTexture, setSunTexture] = React.useState(null);

  // Real solar system distances
  const orbitalDistances = [8, 12, 16, 22, 35, 50, 65, 80, 95];
  const orbitalPeriods = [20, 25, 30, 35, 45, 55, 65, 75, 85];

  const planetPositions = useMemo(() => {
    const positions = [];
    
    (projects || []).forEach((project, index) => {
      const distance = orbitalDistances[index] || 10 + (index * 5);
      const angle = (index / Math.max(projects.length, 1)) * Math.PI * 2;
      const inclination = [0.035, 0.059, 0, 0.032, 0.023, 0.043, 0.013, 0.030, 0.115][index] || 0;
      
      const x = Math.cos(angle) * distance;
      const y = Math.sin(inclination) * distance * 0.3;
      const z = Math.sin(angle) * distance;
      
      positions.push([x, y, z]);
    });
    
    return positions;
  }, [projects, orbitalDistances]);

  // White Asteroid Belt
  const asteroidBelt = useMemo(() => {
    const asteroids = [];
    const beltInnerRadius = 25;
    const beltOuterRadius = 30;
    
    for (let i = 0; i < 100; i++) {
      const distance = beltInnerRadius + Math.random() * (beltOuterRadius - beltInnerRadius);
      const angle = Math.random() * Math.PI * 2;
      const inclination = (Math.random() - 0.5) * 0.05;
      
      const x = Math.cos(angle) * distance;
      const y = Math.sin(inclination) * distance * 0.2;
      const z = Math.sin(angle) * distance;
      
      const size = 0.02 + Math.random() * 0.05;
      
      asteroids.push({
        position: [x, y, z],
        size: size
      });
    }
    
    return asteroids;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.00005;
    }
    
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.001;
      
      // Sun pulsing effect
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      sunRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  React.useEffect(() => {
    let disposed = false;
    const load = async () => {
      try {
        const result = await textureLoader.loadTexture(sunTexUrl, 0);
        if (!disposed) {
          const tex = result?.texture ?? result;
          if (tex) {
            tex.colorSpace = THREE.SRGBColorSpace;
            setSunTexture(tex);
          }
        }
      } catch (e) {
        console.warn('Sun texture load error:', e);
      }
    };
    load();
    return () => { disposed = true; };
  }, []);

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <group ref={groupRef}>
      {/* Sun with texture and subtle emissive glow */}
      <mesh ref={sunRef} position={[0, 0, 0]}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshStandardMaterial 
          map={sunTexture}
          color={sunTexture ? 0xffffff : 0xffd700}
          emissive={0xffaa33}
          emissiveIntensity={0.25}
          roughness={1.0}
          metalness={0.0}
          transparent={false}
          opacity={1}
        />
        <pointLight color="#ffd700" intensity={2} distance={150} />
      </mesh>

      
      {/* Solar Flares - toned down */}
      <group>
        {[...Array(8)].map((_, i) => (
          <mesh key={i} rotation={[0, 0, (i / 8) * Math.PI * 2]}>
            <planeGeometry args={[7, 1.5]} />
            <meshBasicMaterial 
              color="#ff6a00"
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* Asteroid Belt */}
      <group>
        {asteroidBelt.map((asteroid, index) => (
          <mesh
            key={index}
            position={asteroid.position}
          >
            <sphereGeometry args={[asteroid.size, 6, 6]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>
      
      {/* Project Planets */}
      {projects.map((project, index) => (
        <ProjectPlanet
          key={project.id}
          initialPosition={planetPositions[index]}
          project={project}
          onSelect={onProjectSelect}
          index={index}
          orbitalPeriod={orbitalPeriods[index]}
          orbitalDistance={orbitalDistances[index]}
        />
      ))}
    </group>
  );
};

export default ProjectNetwork;