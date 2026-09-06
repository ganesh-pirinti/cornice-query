import React, { useState } from 'react';
import { getWhatsAppChannelUrl } from '../../config/contact';
import { saveUserCustomisationRequest } from '../../services/customisationService';
import { getCurrentUser } from '../../services/authService';
import { MessageSquare, ShieldCheck, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';
import { trackEvent } from '../../services/analyticsService';

interface WhatsAppCTAProps {
  score: number;
  offerPrice?: string;
}

export const WhatsAppCTA: React.FC<WhatsAppCTAProps> = ({ score, offerPrice = "₹299" }) => {
  const [requirementText, setRequirementText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const maxLength = 500;

  const handleWhatsAppClick = async () => {
    setIsSubmitting(true);
    trackEvent('whatsapp_channel_clicked', { score, offerPrice, requirementLength: requirementText.length });

    const currentUser = getCurrentUser();

    // Persist customisation requirement submission into Supabase / Backend storage
    try {
      await saveUserCustomisationRequest({
        userId: currentUser?.id || 'anon_user',
        quizScore: score,
        fullStack: true,
        requirement: requirementText,
        priceShown: offerPrice,
        discountPercentage: (currentUser?.points ?? 0) >= 100 ? 40 : 0,
        pointsUsed: currentUser?.points ?? 0,
      });
      setSubmitted(true);
    } catch {
      // Proceed to channel redirect even if offline
    } finally {
      setIsSubmitting(false);
    }

    // Always redirect exclusively to official CQ WhatsApp Channel
    const channelUrl = getWhatsAppChannelUrl();
    window.open(channelUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h3 className="font-display text-2xl font-bold text-white tracking-tight">
          READY TO BUILD WITH CQ?
        </h3>
        <p className="text-xs text-zinc-300 max-w-md mx-auto">
          Join the official Cornice & Query WhatsApp Channel to submit your website requirements and connect with the development team.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="project-requirement" className="block text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">
          WHAT ARE YOU LOOKING TO BUILD? (OPTIONAL)
        </label>
        <div className="relative">
          <textarea
            id="project-requirement"
            rows={4}
            maxLength={maxLength}
            value={requirementText}
            onChange={(e) => setRequirementText(e.target.value)}
            placeholder="Describe your custom website requirement, feature wishlist, or preferred design style..."
            className="w-full p-4 rounded-2xl bg-[#0a0a0e] border border-white/15 focus:border-orange-500/50 text-white placeholder-zinc-500 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all resize-none"
          />
          <div className="absolute bottom-3 right-4 text-[11px] font-mono text-zinc-500">
            {requirementText.length} / {maxLength}
          </div>
        </div>
      </div>

      {submitted && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono text-center flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Requirement Saved to Your Account! Redirecting to Channel...</span>
        </div>
      )}

      <div className="pt-2 space-y-4">
        <button
          onClick={handleWhatsAppClick}
          disabled={isSubmitting}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-sm tracking-wider uppercase transition-all duration-200 shadow-xl shadow-orange-500/25 flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 text-slate-950 animate-spin" />
          ) : (
            <>
              <MessageSquare className="w-5 h-5 text-slate-950 fill-slate-950" />
              <span>SUBMIT REQUIREMENT & JOIN CQ CHANNEL</span>
              <ExternalLink className="w-4 h-4 text-slate-950" />
            </>
          )}
        </button>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-3 text-xs text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
          <span>
            <strong>Official Channel Submission:</strong> Submit your requirements through the official CQ WhatsApp Channel. No personal phone numbers are exposed.
          </span>
        </div>
      </div>
    </div>
  );
};
