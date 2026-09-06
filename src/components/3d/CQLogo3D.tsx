import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float } from '@react-three/drei';

interface CQLogo3DProps {
  position?: [number, number, number];
  scale?: number;
  mouseX?: number;
  mouseY?: number;
}

export const CQLogo3D: React.FC<CQLogo3DProps> = ({
  position = [0, 0, 0],
  scale = 1,
  mouseX = 0,
  mouseY = 0,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load('/assets/cq-logo.png', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      setTexture(tex);
    });
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Damped mouse parallax tilt
    const targetRotX = mouseY * 0.15;
    const targetRotY = mouseX * 0.2 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, delta * 1.8);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, delta * 1.8);
  });

  return (
    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} position={position} scale={scale}>
        {texture && (
          <mesh castShadow receiveShadow>
            <planeGeometry args={[4.2, 4.2]} />
            <meshBasicMaterial
              map={texture}
              transparent
              toneMapped={false}
            />
          </mesh>
        )}
      </group>
    </Float>
  );
};
