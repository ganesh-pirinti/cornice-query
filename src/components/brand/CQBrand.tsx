import React from 'react';
import { CQLogo } from './CQLogo';

export interface CQBrandProps {
  variant?: 'header' | 'footer' | 'dashboard' | 'compact' | 'full';
  className?: string;
  showSubtitle?: boolean;
  onClick?: () => void;
}

export const CQBrand: React.FC<CQBrandProps> = ({
  variant = 'header',
  className = '',
  showSubtitle = true,
  onClick,
}) => {
  if (variant === 'compact') {
    return (
      <div onClick={onClick} className={`flex items-center gap-3 group cursor-pointer ${className}`}>
        <CQLogo className="w-9 h-9 shrink-0 group-hover:scale-105 transition-transform duration-300" />
        <div className="flex items-center gap-1.5 font-display text-base font-bold tracking-tight">
          <span className="text-amber-400">CORNICE</span>
          <span className="text-zinc-200">& QUERY</span>
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div onClick={onClick} className={`flex items-center gap-3.5 group ${className}`}>
        <CQLogo className="w-12 h-12 shrink-0 group-hover:scale-105 transition-transform duration-300" />
        <div className="flex flex-col justify-center">
          <div className="font-display text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              CORNICE
            </span>
            <span className="bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              & QUERY
            </span>
          </div>
          {showSubtitle && (
            <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase font-semibold mt-0.5">
              OFFICIAL RESOURCE PLATFORM
            </span>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'dashboard') {
    return (
      <div onClick={onClick} className={`flex items-center gap-3.5 group ${className}`}>
        <CQLogo className="w-11 h-11 shrink-0 group-hover:scale-105 transition-transform duration-300" />
        <div className="flex flex-col justify-center">
          <div className="font-display text-xl sm:text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <span className="text-amber-400">CORNICE</span>
            <span className="text-zinc-100">& QUERY</span>
          </div>
          {showSubtitle && (
            <span className="text-[10px] font-mono tracking-widest text-orange-400 font-bold uppercase">
              USER DASHBOARD
            </span>
          )}
        </div>
      </div>
    );
  }

  // Header default lockup with responsive mobile scaling
  return (
    <div onClick={onClick} className={`flex items-center gap-3 group shrink-0 ${className}`}>
      {/* Official CQ Mark Emblem */}
      <CQLogo className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 group-hover:scale-105 transition-transform duration-300" />

      {/* Official CORNICE & QUERY Wordmark */}
      <div className="flex flex-col justify-center">
        <div className="font-display text-base sm:text-lg font-extrabold tracking-tight flex items-center gap-1.5 leading-none">
          <span className="text-amber-400 group-hover:text-amber-300 transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            CORNICE
          </span>
          <span className="text-zinc-200 group-hover:text-white transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            & QUERY
          </span>
        </div>
        {showSubtitle && (
          <span className="hidden sm:inline text-[9px] font-mono tracking-widest text-zinc-400 uppercase font-semibold mt-1">
            RESOURCE HUB
          </span>
        )}
      </div>
    </div>
  );
};
