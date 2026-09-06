import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  count?: number;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({ count = 40 }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 22,
          (Math.random() - 0.5) * 22,
          (Math.random() - 0.5) * 12
        ),
        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        speed: 0.05 + Math.random() * 0.1, // Damped, slow physical drift
        scale: 0.02 + Math.random() * 0.04, // Small subtle scale
      });
    }
    return temp;
  }, [count]);

  useFrame((state, delta) => {
    if (!mesh.current) return;

    particles.forEach((particle, i) => {
      particle.position.y += Math.sin(state.clock.getElapsedTime() * particle.speed + i) * 0.001;
      particle.rotation.x += delta * 0.03 * particle.speed;
      particle.rotation.y += delta * 0.04 * particle.speed;

      dummy.position.copy(particle.position);
      dummy.rotation.copy(particle.rotation);
      dummy.scale.setScalar(particle.scale);
      dummy.updateMatrix();

      mesh.current!.setMatrixAt(i, dummy.matrix);
    });

    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#27272a"
        emissive="#ff6b00"
        emissiveIntensity={0.12}
        roughness={0.8}
        metalness={0.5}
        transparent
        opacity={0.35}
      />
    </instancedMesh>
  );
};
