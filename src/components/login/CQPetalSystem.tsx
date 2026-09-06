import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createCQPetalGeometry } from './CQPetalGeometry';

interface CQPetalSystemProps {
  elapsedTime: number;
  mouseX: number;
  mouseY: number;
  isReducedMotion?: boolean;
  isMobile?: boolean;
}

interface PetalState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Euler;
  rotVelocity: THREE.Vector3;
  scale: number;
  baseScale: number;
  type: 'gold' | 'silver';
  layer: 'bg' | 'mid' | 'fg';
  variant: 0 | 1 | 2 | 3;
  wobbleSpeed: number;
  wobbleOffset: number;
  orbitRadiusX: number;
  orbitRadiusY: number;
  orbitAngle: number;
  isForegroundSweep?: boolean;
}

export const CQPetalSystem: React.FC<CQPetalSystemProps> = ({
  elapsedTime,
  mouseX,
  mouseY,
  isReducedMotion = false,
  isMobile = false,
}) => {
  // 8 InstancedMesh references for 4 Geometries x 2 Color Types (Gold & Silver)
  const gMeshRef0 = useRef<THREE.InstancedMesh>(null);
  const gMeshRef1 = useRef<THREE.InstancedMesh>(null);
  const gMeshRef2 = useRef<THREE.InstancedMesh>(null);
  const gMeshRef3 = useRef<THREE.InstancedMesh>(null);

  const sMeshRef0 = useRef<THREE.InstancedMesh>(null);
  const sMeshRef1 = useRef<THREE.InstancedMesh>(null);
  const sMeshRef2 = useRef<THREE.InstancedMesh>(null);
  const sMeshRef3 = useRef<THREE.InstancedMesh>(null);

  const prevMousePos = useRef({ x: 0, y: 0 });

  // 4 Geometries for organic visual variety
  const geom0 = useMemo(() => createCQPetalGeometry(0, 16, 12), []);
  const geom1 = useMemo(() => createCQPetalGeometry(1, 16, 12), []);
  const geom2 = useMemo(() => createCQPetalGeometry(2, 16, 12), []);
  const geom3 = useMemo(() => createCQPetalGeometry(3, 16, 12), []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Total density: ~304 desktop (152 gold, 152 silver), ~112 mobile
  const countPerMesh = isMobile ? 14 : 38;

  // Initialize persistent 360-degree 3D Petal Population across 3 depth zones IMMEDIATELY ON FRAME 0
  const { g0, g1, g2, g3, s0, s1, s2, s3 } = useMemo(() => {
    const createPetal = (type: 'gold' | 'silver', variant: 0 | 1 | 2 | 3): PetalState => {
      const layerRoll = Math.random();
      // 48% Background, 36% Midground, 16% Foreground
      const layer: 'bg' | 'mid' | 'fg' = layerRoll < 0.48 ? 'bg' : layerRoll < 0.84 ? 'mid' : 'fg';

      let z = -4;
      let baseScale = 0.28;

      if (layer === 'bg') {
        z = -5 - Math.random() * 13; // -5 to -18 (Far Background)
        baseScale = 0.12 + Math.random() * 0.10;
      } else if (layer === 'mid') {
        z = -0.5 - Math.random() * 4.3; // -0.5 to -4.8 (Midground)
        baseScale = 0.24 + Math.random() * 0.14;
      } else {
        z = 0.5 + Math.random() * 3.7; // 0.5 to 4.2 (Foreground in front/beside camera)
        baseScale = 0.42 + Math.random() * 0.24;
      }

      // Camera distance Z calculation for dynamic frustum seeding
      const distToCam = 9.0 - z;
      const maxY = distToCam * 0.414 + 1.8;
      const maxX = maxY * 1.78 + 2.5;

      // Seed IMMEDIATELY within visible frustum volume on frame 0
      const initialX = (Math.random() - 0.5) * maxX * 1.8;
      const initialY = (Math.random() - 0.5) * maxY * 1.8;

      return {
        position: new THREE.Vector3(initialX, initialY, z),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.6,
          0.25 + Math.random() * 0.65,
          (Math.random() - 0.5) * 0.25
        ),
        rotation: new THREE.Euler(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        ),
        rotVelocity: new THREE.Vector3(
          (Math.random() - 0.5) * 1.6,
          (Math.random() - 0.5) * 1.8,
          (Math.random() - 0.5) * 1.4
        ),
        scale: baseScale,
        baseScale,
        type,
        layer,
        variant,
        wobbleSpeed: 0.8 + Math.random() * 1.8,
        wobbleOffset: Math.random() * Math.PI * 2,
        orbitRadiusX: 4.5 + Math.random() * 4.5,
        orbitRadiusY: 2.8 + Math.random() * 2.8,
        orbitAngle: Math.random() * Math.PI * 2,
        isForegroundSweep: layer === 'fg' && Math.random() < 0.3,
      };
    };

    const buildList = (type: 'gold' | 'silver', variant: 0 | 1 | 2 | 3) => {
      const list: PetalState[] = [];
      for (let i = 0; i < countPerMesh; i++) {
        list.push(createPetal(type, variant));
      }
      return list;
    };

    return {
      g0: buildList('gold', 0),
      g1: buildList('gold', 1),
      g2: buildList('gold', 2),
      g3: buildList('gold', 3),
      s0: buildList('silver', 0),
      s1: buildList('silver', 1),
      s2: buildList('silver', 2),
      s3: buildList('silver', 3),
    };
  }, [countPerMesh]);

  useFrame((state, delta) => {
    if (
      !gMeshRef0.current || !gMeshRef1.current || !gMeshRef2.current || !gMeshRef3.current ||
      !sMeshRef0.current || !sMeshRef1.current || !sMeshRef2.current || !sMeshRef3.current
    ) return;

    const time = state.clock.getElapsedTime();
    const mouseWorldX = mouseX * 8.5;
    const mouseWorldY = mouseY * 5.2;

    // Air wake velocity calculation from mouse movement
    const mouseVx = (mouseWorldX - prevMousePos.current.x) * 14;
    const mouseVy = (mouseWorldY - prevMousePos.current.y) * 14;
    prevMousePos.current = { x: mouseWorldX, y: mouseWorldY };

    // Dynamic 4-Phase Ambient Wind Vectors
    const windX = Math.sin(time * 0.22) * 0.45 + Math.cos(time * 0.09) * 0.25;
    const windY = 0.40 + Math.sin(time * 0.16) * 0.35 + Math.cos(time * 0.28) * 0.18;
    const windZ = Math.cos(time * 0.12) * 0.08;

    const updatePetalGroup = (petals: PetalState[], mesh: THREE.InstancedMesh) => {
      petals.forEach((p, i) => {
        if (isReducedMotion) {
          const angle = (i / petals.length) * Math.PI * 2;
          dummy.position.set(Math.cos(angle) * 7.0, Math.sin(angle) * 5.0, p.position.z);
          dummy.rotation.copy(p.rotation);
          dummy.scale.setScalar(p.scale);
          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);
          return;
        }

        // --- MODE 1: INITIAL AMBIENT (0s to 1.5s) ---
        // Immediate frame 0 visible floating petals
        if (elapsedTime < 1.5) {
          const ambTurbX = Math.sin(time * p.wobbleSpeed + p.wobbleOffset) * 0.15;
          const ambTurbY = Math.cos(time * p.wobbleSpeed * 0.8 + p.wobbleOffset) * 0.15;

          p.position.x += (p.velocity.x * 0.6 + ambTurbX) * delta;
          p.position.y += (p.velocity.y * 0.6 + ambTurbY) * delta;
          p.rotation.x += p.rotVelocity.x * delta * 0.4;
          p.rotation.y += p.rotVelocity.y * delta * 0.4;
        }
        // --- MODE 2: CINEMATIC INTRO (1.5s to 8.5s) ---
        else if (elapsedTime >= 1.5 && elapsedTime < 6.5) {
          // Gold petals sweep from lower-right, Silver petals sweep from lower-left
          const phaseProgress = (elapsedTime - 1.5) / 5;
          const targetVx = p.type === 'gold' ? -1.8 * (1 - phaseProgress * 0.6) : 1.8 * (1 - phaseProgress * 0.6);
          const targetVy = 3.2 * Math.sin(phaseProgress * Math.PI * 0.85);

          p.velocity.x = THREE.MathUtils.lerp(p.velocity.x, targetVx, delta * 2.0);
          p.velocity.y = THREE.MathUtils.lerp(p.velocity.y, targetVy, delta * 2.5);

          p.position.x += p.velocity.x * delta;
          p.position.y += p.velocity.y * delta;
          p.rotation.x += p.rotVelocity.x * delta * 1.4;
          p.rotation.y += p.rotVelocity.y * delta * 1.4;
        } else if (elapsedTime >= 6.5 && elapsedTime < 8.5) {
          // Framing swirl orbit around logo reveal
          p.orbitAngle += delta * (0.8 + p.wobbleSpeed * 0.3);
          const orbitX = Math.cos(p.orbitAngle + p.wobbleOffset) * p.orbitRadiusX;
          const orbitY = Math.sin(p.orbitAngle + p.wobbleOffset) * p.orbitRadiusY;

          p.position.x = THREE.MathUtils.lerp(p.position.x, orbitX, delta * 2.0);
          p.position.y = THREE.MathUtils.lerp(p.position.y, orbitY, delta * 2.0);
        }
        // --- MODE 3: PERMANENT POST-INTRO AMBIENT FIELD (8.5s+ & AFTER SKIP) ---
        else {
          const turbulenceX = Math.sin(time * p.wobbleSpeed + p.wobbleOffset) * 0.22;
          const turbulenceY = Math.cos(time * p.wobbleSpeed * 0.85 + p.wobbleOffset) * 0.20;
          const sweepX = p.isForegroundSweep ? (p.type === 'gold' ? 0.6 : -0.6) : 0;

          p.velocity.x = THREE.MathUtils.lerp(p.velocity.x, windX + sweepX, delta * 1.4);
          p.velocity.y = THREE.MathUtils.lerp(p.velocity.y, windY, delta * 1.4);
          p.velocity.z = THREE.MathUtils.lerp(p.velocity.z, windZ, delta * 1.0);

          p.position.x += (p.velocity.x + turbulenceX) * delta;
          p.position.y += (p.velocity.y + turbulenceY) * delta;
          p.position.z += p.velocity.z * delta;

          p.rotation.x += p.rotVelocity.x * delta * 0.6;
          p.rotation.y += p.rotVelocity.y * delta * 0.6;
          p.rotation.z += Math.sin(time * 1.2 + p.wobbleOffset) * 0.015;

          // Depth-aware cursor repulsion force & air wake
          const dx = p.position.x - mouseWorldX;
          const dy = p.position.y - mouseWorldY;
          const dz = (p.position.z - 0) * 0.4;
          const dist3D = Math.hypot(dx, dy, dz);

          if (dist3D < 4.2) {
            const force = (4.2 - dist3D) / 4.2;
            const depthMult = p.layer === 'fg' ? 0.16 : p.layer === 'mid' ? 0.09 : 0.03;

            const pushX = (dx / (dist3D || 0.001)) * force * depthMult + mouseVx * 0.025 * force;
            const pushY = (dy / (dist3D || 0.001)) * force * depthMult + mouseVy * 0.025 * force;

            p.position.x += pushX;
            p.position.y += pushY;
            p.rotation.z += force * 0.2;
          }
        }

        // --- DEPTH-AWARE CAMERA FRUSTUM OBJECT POOLING RECYCLING (ACTIVE IN ALL MODES) ---
        const distToCam = 9.0 - p.position.z;
        const maxY = distToCam * 0.414 + 1.8;
        const maxX = maxY * 1.78 + 2.5;

        if (p.position.y > maxY) {
          p.position.y = -maxY;
          p.position.x = (Math.random() - 0.5) * maxX * 2;
          p.isForegroundSweep = p.layer === 'fg' && Math.random() < 0.35;
        } else if (p.position.y < -maxY) {
          p.position.y = maxY;
          p.position.x = (Math.random() - 0.5) * maxX * 2;
          p.isForegroundSweep = p.layer === 'fg' && Math.random() < 0.35;
        }

        if (p.position.x > maxX) {
          p.position.x = -maxX;
          p.position.y = (Math.random() - 0.5) * maxY * 2;
        } else if (p.position.x < -maxX) {
          p.position.x = maxX;
          p.position.y = (Math.random() - 0.5) * maxY * 2;
        }

        // Apply matrix transformation to instanced mesh
        dummy.position.copy(p.position);
        dummy.rotation.copy(p.rotation);
        dummy.scale.setScalar(p.scale);
        dummy.updateMatrix();

        mesh.setMatrixAt(i, dummy.matrix);
      });

      mesh.instanceMatrix.needsUpdate = true;
    };

    updatePetalGroup(g0, gMeshRef0.current);
    updatePetalGroup(g1, gMeshRef1.current);
    updatePetalGroup(g2, gMeshRef2.current);
    updatePetalGroup(g3, gMeshRef3.current);

    updatePetalGroup(s0, sMeshRef0.current);
    updatePetalGroup(s1, sMeshRef1.current);
    updatePetalGroup(s2, sMeshRef2.current);
    updatePetalGroup(s3, sMeshRef3.current);
  });

  return (
    <group>
      {/* --- WARM CHAMPAGNE / GOLD PETAL INSTANCED MESHES --- */}
      <instancedMesh ref={gMeshRef0} args={[geom0, undefined, countPerMesh]}>
        <meshStandardMaterial
          color="#E5C158"
          roughness={0.20}
          metalness={0.86}
          emissive="#ff6b00"
          emissiveIntensity={0.10}
          side={THREE.DoubleSide}
        />
      </instancedMesh>

      <instancedMesh ref={gMeshRef1} args={[geom1, undefined, countPerMesh]}>
        <meshStandardMaterial
          color="#D4AF37"
          roughness={0.22}
          metalness={0.88}
          emissive="#ff8800"
          emissiveIntensity={0.12}
          side={THREE.DoubleSide}
        />
      </instancedMesh>

      <instancedMesh ref={gMeshRef2} args={[geom2, undefined, countPerMesh]}>
        <meshStandardMaterial
          color="#F59E0B"
          roughness={0.18}
          metalness={0.90}
          emissive="#d97706"
          emissiveIntensity={0.11}
          side={THREE.DoubleSide}
        />
      </instancedMesh>

      <instancedMesh ref={gMeshRef3} args={[geom3, undefined, countPerMesh]}>
        <meshStandardMaterial
          color="#FBBF24"
          roughness={0.16}
          metalness={0.92}
          emissive="#b45309"
          emissiveIntensity={0.13}
          side={THREE.DoubleSide}
        />
      </instancedMesh>

      {/* --- PLATINUM / SILVER PETAL INSTANCED MESHES --- */}
      <instancedMesh ref={sMeshRef0} args={[geom0, undefined, countPerMesh]}>
        <meshStandardMaterial
          color="#CBD5E1"
          roughness={0.18}
          metalness={0.90}
          emissive="#e2e8f0"
          emissiveIntensity={0.07}
          side={THREE.DoubleSide}
        />
      </instancedMesh>

      <instancedMesh ref={sMeshRef1} args={[geom1, undefined, countPerMesh]}>
        <meshStandardMaterial
          color="#FFFFFF"
          roughness={0.14}
          metalness={0.95}
          emissive="#ffffff"
          emissiveIntensity={0.09}
          side={THREE.DoubleSide}
        />
      </instancedMesh>

      <instancedMesh ref={sMeshRef2} args={[geom2, undefined, countPerMesh]}>
        <meshStandardMaterial
          color="#94A3B8"
          roughness={0.20}
          metalness={0.88}
          emissive="#cbd5e1"
          emissiveIntensity={0.06}
          side={THREE.DoubleSide}
        />
      </instancedMesh>

      <instancedMesh ref={sMeshRef3} args={[geom3, undefined, countPerMesh]}>
        <meshStandardMaterial
          color="#E2E8F0"
          roughness={0.15}
          metalness={0.93}
          emissive="#f8fafc"
          emissiveIntensity={0.08}
          side={THREE.DoubleSide}
        />
      </instancedMesh>
    </group>
  );
};
