import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useLocation } from 'react-router-dom';
import { AtmosphericEnvironment } from './AtmosphericEnvironment';
import { Layer1FarBackground } from './Layer1FarBackground';
import { Layer2AbstractStructures } from './Layer2AbstractStructures';
import { Layer3FloatingParticles } from './Layer3FloatingParticles';
import { Layer4NearParticles } from './Layer4NearParticles';
import { CameraParallaxController } from './CameraParallaxController';
import { WebGLFallback } from './WebGLFallback';
import { useMousePosition } from '../../hooks/useMousePosition';
import { useScrollVelocity } from '../../hooks/useScrollVelocity';

export const CQBackground: React.FC = () => {
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const mousePos = useMousePosition();
  const scrollState = useScrollVelocity();
  const location = useLocation();

  // WebGL & Device Capability Checks
  useEffect(() => {
    // 1. WebGL Support Check
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.warn('[CQ 3D Diagnostics] WebGL context unavailable. Falling back to CSS background.');
        setHasWebGL(false);
      } else {
        console.log('[CQ 3D Diagnostics] WebGL 3D Background Canvas active.');
      }
    } catch (err) {
      console.warn('[CQ 3D Diagnostics] WebGL initialization error:', err);
      setHasWebGL(false);
    }

    // 2. Responsive Check for Mobile / Tablet
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });

    // 3. Reduced Motion Preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsReducedMotion(true);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Determine current active route category for 3D environment adaptation
  const getRouteCategory = (path: string): string => {
    if (path === '/') return 'hero';
    if (path.startsWith('/project')) return 'projects';
    if (path === '/categories') return 'categories';
    if (path === '/about') return 'about';
    if (path === '/customise') return 'customise';
    if (path.startsWith('/dashboard') || path === '/login' || path === '/signup') return 'dashboard';
    return 'default';
  };

  const routeCategory = getRouteCategory(location.pathname);

  if (!hasWebGL) return <WebGLFallback />;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050505] aria-hidden:true">
      <Canvas
        camera={{ position: [0, 0, 9.5], fov: 45, near: 0.1, far: 50 }}
        gl={{
          alpha: true,
          antialias: !isMobile, // Optimize antialiasing on mobile
          powerPreference: 'high-performance',
        }}
        style={{ pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          <CameraParallaxController
            mouseX={mousePos.normalizedX}
            mouseY={mousePos.normalizedY}
            scrollY={scrollState.scrollY}
            isReducedMotion={isReducedMotion}
          />
          <AtmosphericEnvironment />
          <Layer1FarBackground
            mouseX={mousePos.normalizedX}
            mouseY={mousePos.normalizedY}
            isReducedMotion={isReducedMotion}
          />
          <Layer2AbstractStructures
            mouseX={mousePos.normalizedX}
            mouseY={mousePos.normalizedY}
            routeCategory={routeCategory}
            isReducedMotion={isReducedMotion}
            isMobile={isMobile}
          />
          <Layer3FloatingParticles
            count={isMobile ? 15 : 35}
            mouseX={mousePos.normalizedX}
            mouseY={mousePos.normalizedY}
            isReducedMotion={isReducedMotion}
          />
          <Layer4NearParticles
            count={isMobile ? 4 : 12}
            mouseX={mousePos.normalizedX}
            mouseY={mousePos.normalizedY}
            isReducedMotion={isReducedMotion}
          />
        </Suspense>
      </Canvas>

      {/* Soft dark vignetting ambient overlay to guarantee text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/45 to-[#050505] pointer-events-none" />
    </div>
  );
};
