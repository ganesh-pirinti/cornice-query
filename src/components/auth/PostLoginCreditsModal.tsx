import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import type { UserProfile } from '../../services/authService';
import { InteractiveCard3D } from '../3d/InteractiveCard3D';
import { CQLogo } from '../brand/CQLogo';

interface PostLoginCreditsModalProps {
  user: UserProfile;
  onContinue: () => void;
}

export const PostLoginCreditsModal: React.FC<PostLoginCreditsModalProps> = ({ user, onContinue }) => {
  return (
    <div className="w-full max-w-lg mx-auto px-4">
      <InteractiveCard3D depth={8}>
        <div
          className="p-8 sm:p-10 rounded-3xl space-y-7 backdrop-blur-xl border transition-all duration-300 shadow-2xl"
          style={{
            backgroundColor: 'rgba(220, 220, 220, 0.08)',
            borderColor: 'rgba(255, 140, 40, 0.75)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 25px 60px rgba(0, 0, 0, 0.75)',
          }}
        >
          {/* Header Badge & Icon */}
          <div className="text-center space-y-3">
            <CQLogo variant="mark" className="w-16 h-16 mx-auto drop-shadow-2xl" />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-400/40 text-orange-300 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>AUTHENTICATION SUCCESSFUL</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              YOUR BOOST POINTS CREDITS
            </h2>
            <p className="text-xs text-zinc-300 max-w-sm mx-auto font-medium">
              Welcome back, <span className="text-white font-bold">{user.display_name}</span>. Your real-time profile credits are loaded from the database.
            </p>
          </div>

          {/* Real User Points Display Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0e0e15]/90 to-[#07070b]/90 border border-orange-500/40 text-center space-y-2 relative overflow-hidden shadow-inner">
            <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
              <Sparkles className="w-24 h-24 text-orange-400" />
            </div>

            <span className="text-[11px] font-mono font-bold text-orange-400 uppercase tracking-widest block">
              VERIFIED DATABASE BALANCE
            </span>

            <div className="text-5xl sm:text-6xl font-extrabold text-white font-mono tracking-tight flex items-center justify-center gap-2 py-1">
              <span className="text-amber-400 animate-pulse">✦</span>
              <span className="drop-shadow-[0_2px_10px_rgba(245,158,11,0.4)]">{user.points}</span>
              <span className="text-xs text-amber-300 font-sans font-bold uppercase tracking-wider">POINTS</span>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs text-zinc-300 font-mono pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Account Status: {user.is_early_user ? 'Early Member Bonus Active' : 'Standard Member'}</span>
            </div>
          </div>

          {/* Points Benefit & How It Works Explanation */}
          <div className="space-y-3 text-xs text-zinc-300 bg-white/[0.03] border border-white/10 rounded-2xl p-4">
            <h4 className="font-mono font-bold text-white uppercase text-[11px] tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-orange-400" />
              HOW BOOST POINTS WORK
            </h4>
            <ul className="space-y-2 text-zinc-300 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">•</span>
                <span>Your Boost Points help unlock customisation benefits across all builds.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">•</span>
                <span>Reach <strong className="text-amber-300 font-mono">100 Boost Points</strong> via referrals to unlock an automatic <strong className="text-orange-300">40% Customisation Discount</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">•</span>
                <span>Share your unique referral link found in your profile dashboard to earn <strong className="text-white font-mono">+20 Points</strong> per referral.</span>
              </li>
            </ul>
          </div>

          {/* Continue to Home Action Button */}
          <button
            onClick={onContinue}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-3 transition-all duration-200 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 active:scale-[0.99] cursor-pointer"
          >
            <span>CONTINUE TO HOME</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </InteractiveCard3D>
    </div>
  );
};
