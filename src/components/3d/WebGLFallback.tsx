import React from 'react';

export const WebGLFallback: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#070709]">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-amber-500/10 blur-[150px] rounded-full" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-amber-600/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-orange-600/5 blur-[120px] rounded-full" />
    </div>
  );
};
