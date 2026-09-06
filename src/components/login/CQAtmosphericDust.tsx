import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CQAtmosphericDustProps {
  count?: number;
  mouseX: number;
  mouseY: number;
  isReducedMotion?: boolean;
}

interface DustParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  scale: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  baseAlpha: number;
  type: 'gold' | 'silver';
}

export const CQAtmosphericDust: React.FC<CQAtmosphericDustProps> = ({
  count = 220,
  mouseX,
  mouseY,
  isReducedMotion = false,
}) => {
  const goldMeshRef = useRef<THREE.InstancedMesh>(null);
  const silverMeshRef = useRef<THREE.InstancedMesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Half gold, half silver dust particles
  const countPerType = Math.floor(count / 2);

  const { goldDust, silverDust } = useMemo(() => {
    const createDust = (type: 'gold' | 'silver'): DustParticle[] => {
      const temp: DustParticle[] = [];
      for (let i = 0; i < countPerType; i++) {
        temp.push({
          position: new THREE.Vector3(
            (Math.random() - 0.5) * 44,
            (Math.random() - 0.5) * 32,
            -20 + Math.random() * 24 // z: -20 to +4
          ),
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.18,
            0.06 + Math.random() * 0.18,
            (Math.random() - 0.5) * 0.12
          ),
          scale: 0.02 + Math.random() * 0.038,
          twinkleSpeed: 1.5 + Math.random() * 2.5,
          twinkleOffset: Math.random() * Math.PI * 2,
          baseAlpha: 0.25 + Math.random() * 0.45,
          type,
        });
      }
      return temp;
    };

    return { goldDust: createDust('gold'), silverDust: createDust('silver') };
  }, [countPerType]);

  useFrame((state, delta) => {
    if (!goldMeshRef.current || !silverMeshRef.current) return;

    const time = state.clock.getElapsedTime();

    const updateDustGroup = (dustList: DustParticle[], mesh: THREE.InstancedMesh) => {
      dustList.forEach((p, i) => {
        if (!isReducedMotion) {
          // Slow upward & sideways air drift
          p.position.x += p.velocity.x * delta + Math.sin(time * 0.8 + p.twinkleOffset) * 0.004;
          p.position.y += p.velocity.y * delta;
          p.position.z += Math.cos(time * 0.6 + p.twinkleOffset) * 0.002;

          // Wrap boundaries smoothly
          if (p.position.y > 18) p.position.y = -18;
          if (p.position.y < -18) p.position.y = 18;
          if (p.position.x > 24) p.position.x = -24;
          if (p.position.x < -24) p.position.x = 24;

          // Parallax offset based on Z depth
          const depthFactor = (p.position.z + 18) / 22; // 0 (far) to 1 (near)
          const parallaxX = mouseX * 0.3 * depthFactor;
          const parallaxY = mouseY * 0.2 * depthFactor;

          dummy.position.set(
            p.position.x + parallaxX,
            p.position.y + parallaxY,
            p.position.z
          );
        } else {
          dummy.position.copy(p.position);
        }

        // Soft twinkling scale pulsation
        const twinkle = 0.6 + Math.sin(time * p.twinkleSpeed + p.twinkleOffset) * 0.4;
        dummy.scale.setScalar(p.scale * twinkle);
        dummy.rotation.set(time * 0.2, time * 0.3, 0);
        dummy.updateMatrix();

        mesh.setMatrixAt(i, dummy.matrix);
      });

      mesh.instanceMatrix.needsUpdate = true;
    };

    updateDustGroup(goldDust, goldMeshRef.current);
    updateDustGroup(silverDust, silverMeshRef.current);
  });

  return (
    <group>
      {/* Gold Atmospheric Dust */}
      <instancedMesh ref={goldMeshRef} args={[undefined, undefined, countPerType]}>
        <tetrahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#E5C158"
          emissive="#ff6b00"
          emissiveIntensity={0.25}
          roughness={0.4}
          metalness={0.8}
          transparent
          opacity={0.45}
        />
      </instancedMesh>

      {/* Silver Atmospheric Dust */}
      <instancedMesh ref={silverMeshRef} args={[undefined, undefined, countPerType]}>
        <tetrahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#D9DDE2"
          emissive="#e4e4e7"
          emissiveIntensity={0.2}
          roughness={0.3}
          metalness={0.9}
          transparent
          opacity={0.4}
        />
      </instancedMesh>
    </group>
  );
};
