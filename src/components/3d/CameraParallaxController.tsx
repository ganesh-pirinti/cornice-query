import React from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraParallaxControllerProps {
  mouseX: number;
  mouseY: number;
  scrollY: number;
  isReducedMotion?: boolean;
}

export const CameraParallaxController: React.FC<CameraParallaxControllerProps> = ({
  mouseX,
  mouseY,
  scrollY,
  isReducedMotion = false,
}) => {
  const { camera } = useThree();

  useFrame((_, delta) => {
    if (isReducedMotion) return;

    // 1. Target Camera Position:
    // Mouse adds subtle tilt/shift.
    // Scroll down moves camera slightly deeper into the environment (+Z offset) and slightly down (+Y shift).
    const scrollZOffset = Math.min(2.2, scrollY * 0.0012);
    const scrollYOffset = -Math.min(3.5, scrollY * 0.0008);

    const targetX = mouseX * 0.35;
    const targetY = mouseY * 0.25 + scrollYOffset;
    const targetZ = 9.5 + scrollZOffset;

    // Smooth linear interpolation (lerp)
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, delta * 1.5);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, delta * 1.5);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, delta * 1.5);

    // Subtle lookAt dampening towards origin center
    camera.lookAt(
      mouseX * 0.1,
      mouseY * 0.1 + scrollYOffset * 0.5,
      -10
    );
  });

  return null;
};
