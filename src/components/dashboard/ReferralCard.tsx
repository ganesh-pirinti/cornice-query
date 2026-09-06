import React, { useState } from 'react';
import { getReferralUrl } from '../../config/site';
import { Copy, Share2, Check, Users } from 'lucide-react';
import { REFERRAL_TARGET } from '../../config/boostPoints';

interface ReferralCardProps {
  referralCode: string;
  successfulReferrals: number;
}

export const ReferralCard: React.FC<ReferralCardProps> = ({
  referralCode,
  successfulReferrals,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const referralUrl = getReferralUrl(referralCode);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareReferral = async () => {
    const text = `Hey! Check out Cornice & Query — create custom websites and UI builds with 3D experiences. Signup here: ${referralUrl}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Cornice & Query',
          text,
          url: referralUrl,
        });
        return;
      } catch {
        // Fallback to copy link if share is dismissed/fails
      }
    }
    handleCopyLink();
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-orange-400" />
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
            REFERRAL SYSTEM
          </h3>
        </div>
        <span className="text-xs font-mono text-orange-400 font-bold px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
          +18 PTS / REFERRAL
        </span>
      </div>

      {/* Code & Link Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Referral Code Box */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">YOUR UNIQUE REFERRAL CODE</span>
          <div className="flex items-center justify-between">
            <span className="font-mono font-extrabold text-xl text-orange-400 tracking-wider">
              {referralCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'COPIED' : 'COPY CODE'}</span>
            </button>
          </div>
        </div>

        {/* Referral Link Box */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">YOUR REFERRAL LINK</span>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-zinc-300 truncate max-w-[180px]">
              {referralUrl}
            </span>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'COPIED' : 'COPY LINK'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Share Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleShareReferral}
          className="flex-1 py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-500/20"
        >
          <Share2 className="w-4 h-4 text-slate-950" />
          <span>SHARE REFERRAL LINK</span>
        </button>
        <button
          onClick={handleCopyLink}
          className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Copy className="w-4 h-4" />
          <span>{copiedLink ? 'COPIED LINK!' : 'COPY LINK'}</span>
        </button>
      </div>

      {/* 5-Dot Referral Progress Tracker */}
      <div className="pt-4 border-t border-white/10 space-y-2">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-zinc-400 font-semibold">SUCCESSFUL REFERRALS</span>
          <span className="text-orange-400 font-bold">{successfulReferrals} / {REFERRAL_TARGET}</span>
        </div>

        <div className="flex items-center gap-2">
          {Array.from({ length: REFERRAL_TARGET }).map((_, idx) => {
            const isCompleted = idx < successfulReferrals;
            return (
              <div
                key={idx}
                className={`flex-1 h-3 rounded-full transition-all duration-300 ${
                  isCompleted ? 'bg-orange-500 shadow-md shadow-orange-500/40' : 'bg-white/10'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
