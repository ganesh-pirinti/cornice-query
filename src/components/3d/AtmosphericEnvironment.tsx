import React from 'react';

export const AtmosphericEnvironment: React.FC = () => {
  return (
    <>
      {/* Dark atmospheric fog to establish background depth and fade distant objects smoothly */}
      <fog attach="fog" args={['#050505', 8, 42]} />

      {/* Ambient background light - low intensity to keep overall scene dark & editorial */}
      <ambientLight intensity={0.35} color="#18181b" />

      {/* Main directional key light */}
      <directionalLight position={[10, 12, 10]} intensity={0.5} color="#e4e4e7" castShadow={false} />

      {/* Warm CQ Orange / Amber Rim Accent Light - placed deep left */}
      <pointLight position={[-12, 8, -12]} intensity={2.2} color="#ff6b00" distance={35} decay={2} />

      {/* Warm Gold Accent Fill Light - placed lower right */}
      <pointLight position={[12, -8, -10]} intensity={1.4} color="#f59e0b" distance={30} decay={2} />

      {/* Subtle top rim light for subtle top silhouette highlights */}
      <directionalLight position={[0, 15, -15]} intensity={0.3} color="#ff8c00" />
    </>
  );
};
