// src/components/ProjectNode.js
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ProjectNode = ({ position, project, onSelect, index }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  // Animation
  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + index) * 0.1;
      
      // Hover scale effect
      meshRef.current.scale.lerp(
        new THREE.Vector3(
          hovered ? 1.2 : 1,
          hovered ? 1.2 : 1,
          hovered ? 1.2 : 1
        ),
        0.1
      );
    }
  });

  const handleClick = () => {
    setActive(!active);
    onSelect(project);
  };

  const color = new THREE.Color(project.color || '#ffffff');

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Glow effect */}
      {hovered && (
        <mesh>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial 
            color={color}
            transparent
            opacity={0.2}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  );
};

export default ProjectNode;