import { useRef, useImperativeHandle, forwardRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface TrailBurstRef {
  triggerBurst: (worldX: number, worldY: number) => void;
}

export interface CQPetalTrailSystemProps {
  className?: string;
}

interface FragmentParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  scale: number;
  alpha: number;
  life: number;
  decay: number;
  rotation: THREE.Euler;
  colorType: 'gold' | 'silver';
}

export const CQPetalTrailSystem = forwardRef<TrailBurstRef, CQPetalTrailSystemProps>((_, ref) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const maxFragments = 120;
  const fragmentsRef = useRef<FragmentParticle[]>([]);

  useImperativeHandle(ref, () => ({
    triggerBurst: (worldX: number, worldY: number) => {
      const burstCount = 8 + Math.floor(Math.random() * 5); // 8 to 12 fragments
      for (let i = 0; i < burstCount; i++) {
        if (fragmentsRef.current.length >= maxFragments) {
          fragmentsRef.current.shift(); // Recycle oldest
        }

        const angle = (Math.PI * 2 * i) / burstCount + (Math.random() - 0.5) * 0.4;
        const speed = 1.2 + Math.random() * 2.0;

        fragmentsRef.current.push({
          position: new THREE.Vector3(
            worldX + (Math.random() - 0.5) * 0.3,
            worldY + (Math.random() - 0.5) * 0.3,
            (Math.random() - 0.5) * 2.0
          ),
          velocity: new THREE.Vector3(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed + 0.5,
            (Math.random() - 0.5) * 1.0
          ),
          scale: 0.03 + Math.random() * 0.04,
          alpha: 0.9,
          life: 0,
          decay: 0.02 + Math.random() * 0.015,
          rotation: new THREE.Euler(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            0
          ),
          colorType: Math.random() < 0.6 ? 'gold' : 'silver',
        });
      }
    },
  }));

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const fragments = fragmentsRef.current;

    for (let i = fragments.length - 1; i >= 0; i--) {
      const f = fragments[i];
      f.life += f.decay;
      f.position.x += f.velocity.x * delta;
      f.position.y += f.velocity.y * delta;
      f.position.z += f.velocity.z * delta;

      f.velocity.x *= 0.95; // Damping
      f.velocity.y *= 0.95;
      f.velocity.z *= 0.95;

      f.rotation.x += delta * 2.0;
      f.rotation.y += delta * 2.0;

      const currentScale = Math.max(0.001, f.scale * (1 - f.life));

      if (f.life >= 1.0 || currentScale <= 0.002) {
        fragments.splice(i, 1);
        continue;
      }

      dummy.position.copy(f.position);
      dummy.rotation.copy(f.rotation);
      dummy.scale.setScalar(currentScale);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    // Hide inactive instances
    for (let i = fragments.length; i < maxFragments; i++) {
      dummy.position.set(0, -100, 0);
      dummy.scale.setScalar(0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, maxFragments]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#E5C158"
        emissive="#ff6b00"
        emissiveIntensity={0.3}
        roughness={0.2}
        metalness={0.9}
        transparent
        opacity={0.7}
      />
    </instancedMesh>
  );
});

CQPetalTrailSystem.displayName = 'CQPetalTrailSystem';
