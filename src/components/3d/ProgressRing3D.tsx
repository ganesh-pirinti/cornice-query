import React from 'react';

interface ProgressRing3DProps {
  currentPoints: number;
  targetPoints: number;
  size?: number;
}

export const ProgressRing3D: React.FC<ProgressRing3DProps> = ({
  currentPoints,
  targetPoints,
  size = 120,
}) => {
  const percentage = Math.min(100, Math.round((currentPoints / targetPoints) * 100));
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const isUnlocked = currentPoints >= targetPoints;

  return (
    <div className="relative flex items-center justify-center group" style={{ width: size, height: size }}>
      {/* Ambient background glow ring */}
      <div
        className={`absolute inset-0 rounded-full blur-lg transition-opacity duration-500 ${
          isUnlocked ? 'bg-emerald-500/30 opacity-100' : 'bg-orange-500/20 opacity-60 group-hover:opacity-100'
        }`}
      />

      <svg width={size} height={size} className="transform -rotate-90 relative z-10">
        {/* Track Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="8"
          fill="transparent"
        />

        {/* Dynamic Animated Progress Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isUnlocked ? '#10b981' : '#ff6b00'}
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>

      {/* Center Digital Points Value */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20">
        <span className="font-display text-xl font-bold text-white tracking-tight">
          {currentPoints}
        </span>
        <span className="text-[9px] font-mono text-zinc-400 uppercase">PTS</span>
      </div>
    </div>
  );
};
