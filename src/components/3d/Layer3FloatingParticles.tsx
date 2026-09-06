import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Layer3FloatingParticlesProps {
  count?: number;
  mouseX: number;
  mouseY: number;
  isReducedMotion?: boolean;
}

interface ParticleData {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  speed: number;
  scale: number;
  wobbleSpeed: number;
  wobbleOffset: number;
}

export const Layer3FloatingParticles: React.FC<Layer3FloatingParticlesProps> = ({
  count = 35,
  mouseX,
  mouseY,
  isReducedMotion = false,
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo<ParticleData[]>(() => {
    const temp: ParticleData[] = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 32,
          (Math.random() - 0.5) * 24,
          -5 - Math.random() * 8 // z: -5 to -13
        ),
        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        speed: 0.08 + Math.random() * 0.12,
        scale: 0.025 + Math.random() * 0.045,
        wobbleSpeed: 0.8 + Math.random() * 1.2,
        wobbleOffset: Math.random() * Math.PI * 2,
      });
    }
    return temp;
  }, [count]);

  useFrame((state, delta) => {
    if (!meshRef.current || !groupRef.current) return;

    // 1. Mouse Parallax at Mid Depth (~3px movement)
    if (!isReducedMotion) {
      const targetX = mouseX * 0.65;
      const targetY = mouseY * 0.5;
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, delta * 1.5);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 1.5);
    }

    // 2. Physical Drift and Matrix Update
    const time = state.clock.getElapsedTime();

    particles.forEach((particle, i) => {
      if (!isReducedMotion) {
        // Slow vertical drift & gentle sine wobble
        particle.position.y += delta * 0.08 * particle.speed;
        if (particle.position.y > 12) particle.position.y = -12;

        particle.rotation.x += delta * 0.05 * particle.speed;
        particle.rotation.y += delta * 0.06 * particle.speed;
      }

      const wobbleX = Math.sin(time * particle.wobbleSpeed + particle.wobbleOffset) * 0.15;

      dummy.position.set(
        particle.position.x + wobbleX,
        particle.position.y,
        particle.position.z
      );
      dummy.rotation.copy(particle.rotation);
      dummy.scale.setScalar(particle.scale);
      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#1c1c22"
          emissive="#f59e0b"
          emissiveIntensity={0.15}
          roughness={0.7}
          metalness={0.5}
          transparent
          opacity={0.3}
        />
      </instancedMesh>
    </group>
  );
};
