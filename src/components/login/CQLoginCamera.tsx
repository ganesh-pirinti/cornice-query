import React from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CQLoginCameraProps {
  elapsedTime: number;
  mouseX: number;
  mouseY: number;
  isReducedMotion?: boolean;
}

export const CQLoginCamera: React.FC<CQLoginCameraProps> = ({
  elapsedTime,
  mouseX,
  mouseY,
  isReducedMotion = false,
}) => {
  const { camera } = useThree();

  useFrame((state, delta) => {
    if (isReducedMotion) {
      camera.position.set(0, 0, 9);
      camera.lookAt(0, 0, 0);
      return;
    }

    let targetX = 0;
    let targetY = 0;
    let targetZ = 9.5;

    // Cinematic Intro Camera Track across phases
    if (elapsedTime < 2) {
      // Phase 1: Deep cinematic starting view
      targetZ = 10.8;
      targetY = -0.3;
    } else if (elapsedTime < 7) {
      // Phase 2-3: Upward follow tilt following rising petal stream
      const progress = (elapsedTime - 2) / 5;
      targetZ = 10.2 - progress * 0.7;
      targetY = Math.sin(progress * Math.PI) * 0.4;
      targetX = Math.cos(progress * Math.PI * 0.5) * 0.3;
    } else if (elapsedTime < 11) {
      // Phase 4-5: Broad arc and transition to gravity drop
      const progress = (elapsedTime - 7) / 4;
      targetZ = 9.5;
      targetY = (1 - progress) * 0.3;
    } else {
      // Phase 6-7 & Persistent Ambient State: Subtle camera drift + multi-layer mouse parallax
      const time = state.clock.getElapsedTime();
      const driftX = Math.sin(time * 0.05) * 0.18;
      const driftY = Math.cos(time * 0.04) * 0.12;

      targetX = mouseX * 0.35 + driftX;
      targetY = mouseY * 0.25 + driftY;
      targetZ = 9.0;
    }

    // Smooth Lerp
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, delta * 1.8);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, delta * 1.8);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, delta * 1.8);

    camera.lookAt(mouseX * 0.08, mouseY * 0.08, 0);
  });

  return null;
};
