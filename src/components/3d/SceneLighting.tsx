import React from 'react';

export const SceneLighting: React.FC = () => {
  return (
    <>
      {/* Ambient background light */}
      <ambientLight intensity={0.6} />

      {/* Main key light */}
      <directionalLight position={[5, 8, 5]} intensity={1.2} color="#ffffff" castShadow />

      {/* CQ Orange / Amber Rim Accent Light */}
      <pointLight position={[-6, 4, -4]} intensity={2.5} color="#ff6b00" distance={15} />

      {/* Warm fill light */}
      <pointLight position={[6, -4, 4]} intensity={1.5} color="#f59e0b" distance={12} />
    </>
  );
};
