import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { REQUIRED_POINTS } from '../../config/boostPoints';
import { ProgressRing3D } from '../3d/ProgressRing3D';

interface BoostPointsCardProps {
  points: number;
  isEarlyUser?: boolean;
}

export const BoostPointsCard: React.FC<BoostPointsCardProps> = ({ points, isEarlyUser }) => {
  const percentage = Math.min(100, Math.round((points / REQUIRED_POINTS) * 100));
  const isUnlocked = points >= REQUIRED_POINTS;
  const needed = Math.max(0, REQUIRED_POINTS - points);

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-orange-500/30 space-y-6 relative overflow-hidden shadow-2xl">
      {/* Background Flare */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] pointer-events-none" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-orange-400" />
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
            ✦ BOOST POINTS WALLET
          </h3>
        </div>

        {isEarlyUser && (
          <span className="text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 uppercase">
            ✦ FOUNDING MEMBER
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <ProgressRing3D currentPoints={points} targetPoints={REQUIRED_POINTS} size={84} />
          <div>
            <span className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {points}
            </span>
            <span className="text-xs font-mono text-zinc-400 block">/ {REQUIRED_POINTS} PTS</span>
          </div>
        </div>

        {isUnlocked ? (
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>40% OFF UNLOCKED ✓</span>
          </div>
        ) : (
          <span className="text-xs font-mono text-orange-400 font-semibold">
            {needed} MORE PTS TO UNLOCK 40% OFF
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-zinc-500">
          <span>0 PTS</span>
          <span>50 PTS</span>
          <span>100 PTS (40% OFF)</span>
        </div>
      </div>
    </div>
  );
};
