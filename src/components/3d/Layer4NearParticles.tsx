import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Layer4NearParticlesProps {
  count?: number;
  mouseX: number;
  mouseY: number;
  isReducedMotion?: boolean;
}

interface NearParticleData {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  speed: number;
  scale: number;
  wobbleSpeed: number;
  wobbleOffset: number;
}

export const Layer4NearParticles: React.FC<Layer4NearParticlesProps> = ({
  count = 12,
  mouseX,
  mouseY,
  isReducedMotion = false,
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const nearParticles = useMemo<NearParticleData[]>(() => {
    const temp: NearParticleData[] = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 14,
          -1.5 - Math.random() * 3.0 // z: -1.5 to -4.5
        ),
        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        speed: 0.15 + Math.random() * 0.2,
        scale: 0.06 + Math.random() * 0.08, // Larger near particles
        wobbleSpeed: 1.2 + Math.random() * 1.5,
        wobbleOffset: Math.random() * Math.PI * 2,
      });
    }
    return temp;
  }, [count]);

  useFrame((state, delta) => {
    if (!meshRef.current || !groupRef.current) return;

    // 1. Faster Near-Depth Parallax (Approx 4-5px displacement)
    if (!isReducedMotion) {
      const targetX = mouseX * 1.1;
      const targetY = mouseY * 0.85;
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, delta * 1.8);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 1.8);
    }

    // 2. Continuous Organic Drift
    const time = state.clock.getElapsedTime();

    nearParticles.forEach((particle, i) => {
      if (!isReducedMotion) {
        particle.position.y += delta * 0.12 * particle.speed;
        if (particle.position.y > 8) particle.position.y = -8;

        particle.rotation.x += delta * 0.08 * particle.speed;
        particle.rotation.y += delta * 0.09 * particle.speed;
      }

      const wobbleX = Math.sin(time * particle.wobbleSpeed + particle.wobbleOffset) * 0.2;

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
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#27272a"
          emissive="#ff6b00"
          emissiveIntensity={0.12}
          roughness={0.4}
          metalness={0.8}
          transparent
          opacity={0.22}
        />
      </instancedMesh>
    </group>
  );
};
