import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Layer1FarBackgroundProps {
  mouseX: number;
  mouseY: number;
  isReducedMotion?: boolean;
}

export const Layer1FarBackground: React.FC<Layer1FarBackgroundProps> = ({
  mouseX,
  mouseY,
  isReducedMotion = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const gridRef = useRef<THREE.Mesh>(null);
  const distantRingRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (!isReducedMotion) {
      // Extremely subtle far parallax (approx 1px displacement)
      const targetX = mouseX * 0.15;
      const targetY = mouseY * 0.1;
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, delta * 0.8);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 0.8);

      if (distantRingRef.current) {
        distantRingRef.current.rotation.z += delta * 0.008; // Imperceptible rotation
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -25]}>
      {/* Distant Subtle Architectural Grid Plane */}
      <mesh ref={gridRef} rotation={[-Math.PI / 2.3, 0, 0]} position={[0, -6, 0]}>
        <planeGeometry args={[120, 120, 30, 30]} />
        <meshStandardMaterial
          color="#060608"
          wireframe
          transparent
          opacity={0.06}
          emissive="#ff6b00"
          emissiveIntensity={0.03}
        />
      </mesh>

      {/* Far Background Giant Ambient Torus Frame Silhouette */}
      <mesh ref={distantRingRef} position={[0, 2, -5]}>
        <torusGeometry args={[16, 0.06, 16, 120]} />
        <meshBasicMaterial color="#ff6b00" transparent opacity={0.05} wireframe />
      </mesh>
    </group>
  );
};
