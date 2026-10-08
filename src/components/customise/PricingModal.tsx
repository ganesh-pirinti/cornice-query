import React, { useState } from 'react';
import { getPricingForScore } from '../../config/customisePricing';
import { Sparkles, Check, ArrowRight } from 'lucide-react';
import { WhatsAppCTA } from './WhatsAppCTA';
import { trackEvent } from '../../services/analyticsService';
import { InteractiveCard3D } from '../3d/InteractiveCard3D';

interface PricingModalProps {
  score: number;
  fullStackChoice?: 'YES' | 'NO' | null;
  onTryAgain?: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ score, fullStackChoice, onTryAgain }) => {
  const [showRequirementInput, setShowRequirementInput] = useState(false);
  const pricing = getPricingForScore(score);

  const handleContinueToDetails = () => {
    trackEvent('pricing_viewed', { score, fullStackChoice });
    setShowRequirementInput(true);
  };

  return (
    <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-orange-500/40 space-y-8 animate-fadeIn">
      {/* Qualified Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>🎉 YOU'RE QUALIFIED!</span>
        </div>

        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
          YOUR CUSTOM BUILD ESTIMATE
        </h2>

        <div className="inline-block px-5 py-2 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-300 font-mono text-sm">
          <span className="text-zinc-400 text-xs uppercase tracking-widest block font-bold">YOUR SCORE</span>
          <span className="text-orange-400 font-extrabold text-2xl">{score} / 5</span>
        </div>

        <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed pt-1">
          Your preferences match what we can build for you.
        </p>
      </div>

      {/* 3D Pricing Display Card */}
      <InteractiveCard3D depth={12}>
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#181824] via-[#101018] to-[#0a0a0e] border border-white/10 text-center space-y-4 shadow-2xl">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block">
            {fullStackChoice === 'NO'
              ? 'STARTING ESTIMATE FOR FRONTEND WEBSITE'
              : 'STARTING ESTIMATE FOR FULL-STACK WEBSITE'}
          </span>

          <div className="flex items-center justify-center gap-3">
            {pricing.originalPriceDisplay && (
              <span className="text-xl sm:text-2xl font-mono text-zinc-500 line-through">
                {pricing.originalPriceDisplay}
              </span>
            )}
            <span className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight">
              {pricing.startingPriceDisplay}
            </span>
            {pricing.discountDisplay && (
              <span className="px-2.5 py-1 rounded-lg bg-orange-500 text-slate-950 font-mono font-extrabold text-xs">
                {pricing.discountDisplay}
              </span>
            )}
          </div>

          <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
            Final pricing depends on your exact requirements, features, and project scope.
          </p>

          {/* Feature Checkmarks */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-left text-xs text-zinc-300">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Custom UI/UX & Responsive Layout</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Backend Database & User Auth Integration</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Kinetic Motion & Animation Styling</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Direct Engineering Support with CQ Team</span>
            </div>
          </div>
        </div>
      </InteractiveCard3D>

      {!showRequirementInput ? (
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <button
            onClick={handleContinueToDetails}
            className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-base transition-all duration-200 shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>CONTINUE TO PROJECT DETAILS</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          {onTryAgain && (
            <button
              onClick={onTryAgain}
              className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/15 cursor-pointer"
            >
              <span>CHANGE MY PREFERENCES →</span>
            </button>
          )}
        </div>
      ) : (
        <div className="pt-4 border-t border-white/10 space-y-4">
          <WhatsAppCTA score={score} offerPrice={pricing.startingPriceDisplay} />
          {onTryAgain && (
            <div className="text-center pt-2">
              <button
                onClick={onTryAgain}
                className="text-xs font-mono text-zinc-400 hover:text-orange-400 underline transition-colors cursor-pointer"
              >
                CHANGE MY PREFERENCES →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
