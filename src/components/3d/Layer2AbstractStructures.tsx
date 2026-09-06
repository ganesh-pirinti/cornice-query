import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Layer2AbstractStructuresProps {
  mouseX: number;
  mouseY: number;
  routeCategory: string; // 'hero' | 'projects' | 'categories' | 'about' | 'customise' | 'dashboard'
  isReducedMotion?: boolean;
  isMobile?: boolean;
}

export const Layer2AbstractStructures: React.FC<Layer2AbstractStructuresProps> = ({
  mouseX,
  mouseY,
  routeCategory,
  isReducedMotion = false,
  isMobile = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const heroRingRef = useRef<THREE.Mesh>(null);
  const octahedronRef = useRef<THREE.Mesh>(null);
  const sideArcRef = useRef<THREE.Mesh>(null);
  const panelRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // 1. Mouse Parallax (Approx 2px displacement at middle depth z: -12)
    if (!isReducedMotion) {
      const targetX = mouseX * 0.45;
      const targetY = mouseY * 0.35;
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, delta * 1.2);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 1.2);
    }

    // 2. Route-based Target Offsets for Structural Geometry
    let targetRingPos: [number, number, number] = [3.8, 0.5, -12];
    let targetRingRotX = 0.2;
    let targetOctaPos: [number, number, number] = [-4.5, -1.2, -14];

    if (routeCategory === 'projects') {
      // Push structures outward to frame project cards grid
      targetRingPos = [6.2, 1.2, -14];
      targetOctaPos = [-6.5, -2.5, -15];
    } else if (routeCategory === 'categories') {
      targetRingPos = [0, 2.0, -13];
      targetRingRotX = 0.6; // Angled perspective tilt
      targetOctaPos = [4.8, -2.0, -14];
    } else if (routeCategory === 'about') {
      targetRingPos = [2.5, -1.5, -13];
      targetOctaPos = [-3.8, 1.8, -15];
    } else if (routeCategory === 'customise') {
      targetRingPos = [3.0, 0.8, -10]; // Slightly closer depth
      targetOctaPos = [-3.5, -0.8, -11];
    }

    // Smoothly lerp hero ring position based on active page route
    if (heroRingRef.current) {
      heroRingRef.current.position.x = THREE.MathUtils.lerp(heroRingRef.current.position.x, targetRingPos[0], delta * 1.5);
      heroRingRef.current.position.y = THREE.MathUtils.lerp(heroRingRef.current.position.y, targetRingPos[1], delta * 1.5);
      heroRingRef.current.position.z = THREE.MathUtils.lerp(heroRingRef.current.position.z, targetRingPos[2], delta * 1.5);
    }

    if (octahedronRef.current) {
      octahedronRef.current.position.x = THREE.MathUtils.lerp(octahedronRef.current.position.x, targetOctaPos[0], delta * 1.5);
      octahedronRef.current.position.y = THREE.MathUtils.lerp(octahedronRef.current.position.y, targetOctaPos[1], delta * 1.5);
      octahedronRef.current.position.z = THREE.MathUtils.lerp(octahedronRef.current.position.z, targetOctaPos[2], delta * 1.5);
    }

    // 3. Ultra-Slow Continuous Architectural Rotation
    if (!isReducedMotion) {
      const time = state.clock.getElapsedTime();
      if (heroRingRef.current) {
        heroRingRef.current.rotation.z = time * 0.025;
        heroRingRef.current.rotation.x = targetRingRotX + Math.sin(time * 0.2) * 0.04;
      }

      if (octahedronRef.current) {
        octahedronRef.current.rotation.x = time * 0.03;
        octahedronRef.current.rotation.y = time * 0.04;
      }

      if (sideArcRef.current) {
        sideArcRef.current.rotation.z = -time * 0.015;
      }

      if (panelRef.current) {
        panelRef.current.rotation.y = Math.sin(time * 0.15) * 0.15;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. Hero Primary Architectural Ring Frame */}
      <mesh ref={heroRingRef} position={[3.8, 0.5, -12]}>
        <torusGeometry args={[3.4, 0.07, 32, 100]} />
        <meshStandardMaterial
          color="#09090d"
          metalness={0.95}
          roughness={0.2}
          emissive="#ff6b00"
          emissiveIntensity={0.16}
        />
      </mesh>

      {/* Inner Accent Ring inside Hero Ring */}
      <mesh position={[3.8, 0.5, -12.1]}>
        <torusGeometry args={[4.2, 0.015, 16, 64]} />
        <meshBasicMaterial color="#ff7814" transparent opacity={0.15} wireframe />
      </mesh>

      {/* 2. Abstract Geometric Wireframe Octahedron (Left side silhouette) */}
      {!isMobile && (
        <mesh ref={octahedronRef} position={[-4.5, -1.2, -14]}>
          <octahedronGeometry args={[2.2, 0]} />
          <meshStandardMaterial
            color="#08080c"
            wireframe
            metalness={0.9}
            roughness={0.3}
            emissive="#f59e0b"
            emissiveIntensity={0.12}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}

      {/* 3. Curved Architectural Outer Perimeter Arc (Top-Right) */}
      <mesh ref={sideArcRef} position={[5.5, 4.0, -16]} rotation={[0.4, -0.3, 0]}>
        <torusGeometry args={[7.5, 0.04, 16, 80, Math.PI * 0.75]} />
        <meshStandardMaterial
          color="#0d0d12"
          emissive="#ff6b00"
          emissiveIntensity={0.1}
          metalness={0.8}
          roughness={0.4}
        />
      </mesh>

      {/* 4. Abstract Sleek Metallic Wall Panel (Left Background) */}
      {!isMobile && (
        <mesh ref={panelRef} position={[-7.0, 3.5, -18]} rotation={[0.2, 0.4, -0.1]}>
          <planeGeometry args={[5, 9]} />
          <meshStandardMaterial
            color="#050508"
            metalness={0.98}
            roughness={0.1}
            wireframe
            transparent
            opacity={0.08}
            emissive="#ff6b00"
            emissiveIntensity={0.04}
          />
        </mesh>
      )}
    </group>
  );
};
