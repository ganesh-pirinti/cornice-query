import React from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';
import { ReferralCard } from '../components/dashboard/ReferralCard';
import { useSetDocumentTitle } from '../utils/seo';
import { Users, ArrowLeft } from 'lucide-react';

export const ReferralsPage: React.FC = () => {
  const user = getCurrentUser();

  useSetDocumentTitle({
    title: 'Cornice & Query — Referral Hub',
    description: 'Share your unique CQ referral code to earn +18 Boost Points per successful friend account registration.',
  });

  if (!user) return null;

  return (
    <div className="w-full pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-orange-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO DASHBOARD</span>
          </Link>
          <span className="text-xs font-mono text-orange-400 font-bold px-2.5 py-1 rounded bg-orange-500/10 border border-orange-500/20">
            REFERRAL HUB
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            <Users className="w-7 h-7 text-orange-400" />
            <span>Refer 5 Friends & Unlock 40% OFF</span>
          </h1>
          <p className="text-sm text-zinc-400">
            Earn <strong className="text-orange-400">+18 Boost Points</strong> for every friend who creates a real CQ account using your link (up to 5 referrals max).
          </p>
        </div>

        <ReferralCard referralCode={user.referral_code} successfulReferrals={user.successful_referrals} />
      </div>
    </div>
  );
};
