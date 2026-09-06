import React from 'react';

interface SkipIntroButtonProps {
  onSkip: () => void;
  isVisible: boolean;
}

export const SkipIntroButton: React.FC<SkipIntroButtonProps> = ({ onSkip, isVisible }) => {
  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={onSkip}
      aria-label="Skip intro animation"
      className="fixed top-[90px] right-6 sm:top-[100px] sm:right-[28px] z-50 pointer-events-auto inline-flex items-center justify-center px-4 py-2 rounded-xl sm:rounded-2xl text-xs font-mono font-black tracking-widest uppercase transition-all duration-300 shadow-lg hover:-translate-y-0.5 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-300 text-slate-950 select-none"
      style={{
        backgroundColor: 'rgba(255, 140, 40, 0.60)',
        borderColor: 'rgba(255, 140, 40, 0.60)',
        borderWidth: '1px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 140, 40, 0.85)';
        e.currentTarget.style.borderColor = 'rgba(255, 140, 40, 0.85)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 140, 40, 0.60)';
        e.currentTarget.style.borderColor = 'rgba(255, 140, 40, 0.60)';
      }}
    >
      SKIP
    </button>
  );
};
