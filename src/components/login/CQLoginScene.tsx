import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { CQLoginCamera } from './CQLoginCamera';
import { CQPetalSystem } from './CQPetalSystem';
import { CQAtmosphericDust } from './CQAtmosphericDust';
import { CQPetalTrailSystem, type TrailBurstRef } from './CQPetalTrailSystem';
import { WebGLFallback } from '../3d/WebGLFallback';
import { useMousePosition } from '../../hooks/useMousePosition';

interface CQLoginSceneProps {
  elapsedTime: number;
  isReducedMotion?: boolean;
}

export const CQLoginScene: React.FC<CQLoginSceneProps> = ({
  elapsedTime,
  isReducedMotion = false,
}) => {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const mousePos = useMousePosition();
  const trailRef = useRef<TrailBurstRef>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });

    // Click burst listener
    const handleMouseDown = (e: MouseEvent) => {
      if (trailRef.current) {
        const normX = (e.clientX / window.innerWidth) * 2 - 1;
        const normY = -(e.clientY / window.innerHeight) * 2 + 1;
        trailRef.current.triggerBurst(normX * 7.5, normY * 4.8);
      }
    };

    window.addEventListener('mousedown', handleMouseDown, { passive: true });

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  if (!hasWebGL) return <WebGLFallback />;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#080808]">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45, near: 0.1, far: 50 }}
        gl={{
          alpha: true,
          antialias: !isMobile,
          powerPreference: 'high-performance',
        }}
        style={{ pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          {/* Dark Atmospheric Fog */}
          <fog attach="fog" args={['#080808', 8, 55]} />

          {/* Cinematic Studio Lighting with Deep Background Illumination */}
          <ambientLight intensity={0.65} color="#282420" />
          <directionalLight position={[8, 12, 10]} intensity={1.1} color="#ffffff" />
          <pointLight position={[-12, 8, -6]} intensity={2.8} color="#ff6b00" distance={35} />
          <pointLight position={[12, -8, -4]} intensity={2.2} color="#e5c158" distance={32} />
          <pointLight position={[0, 4, -16]} intensity={2.5} color="#ffaa33" distance={35} />

          {/* Camera Controller */}
          <CQLoginCamera
            elapsedTime={elapsedTime}
            mouseX={mousePos.normalizedX}
            mouseY={mousePos.normalizedY}
            isReducedMotion={isReducedMotion}
          />

          {/* Atmospheric Magic Dust Layer */}
          <CQAtmosphericDust
            count={isMobile ? 80 : 220}
            mouseX={mousePos.normalizedX}
            mouseY={mousePos.normalizedY}
            isReducedMotion={isReducedMotion}
          />

          {/* 3D Physical Petal System (160+ Petals) */}
          <CQPetalSystem
            elapsedTime={elapsedTime}
            mouseX={mousePos.normalizedX}
            mouseY={mousePos.normalizedY}
            isReducedMotion={isReducedMotion}
            isMobile={isMobile}
          />

          {/* Motion Trails & Click Burst Fragments */}
          <CQPetalTrailSystem ref={trailRef} />
        </Suspense>
      </Canvas>

      {/* Atmospheric Horizon Haze Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/80 pointer-events-none" />
    </div>
  );
};
