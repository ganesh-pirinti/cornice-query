import React from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';
import { getUserCustomisations } from '../services/customisationService';
import { BoostPointsCard } from '../components/dashboard/BoostPointsCard';
import { ReferralCard } from '../components/dashboard/ReferralCard';
import { CustomisationsTable } from '../components/dashboard/CustomisationsTable';
import { useSetDocumentTitle } from '../utils/seo';
import { CQBrand } from '../components/brand/CQBrand';
import { LayoutDashboard, Layers, Users, ArrowRight } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const user = getCurrentUser();

  useSetDocumentTitle({
    title: 'Cornice & Query — User Dashboard',
    description: 'Manage your CQ custom builds, boost points wallet, and unique referral links.',
  });

  if (!user) return null;

  const customisations = getUserCustomisations(user.id);

  return (
    <div className="w-full pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <CQBrand variant="dashboard" />
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight pt-1">
              WELCOME, {user.display_name.toUpperCase()}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Account Email: <code className="text-zinc-300 font-mono">{user.email}</code>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/customise"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-orange-500/20"
            >
              <span>NEW CUSTOM BUILD ✦</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Dashboard Sub-navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto no-scrollbar">
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-orange-500/10 text-orange-400 border border-orange-500/30 flex items-center gap-2"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>OVERVIEW</span>
          </Link>
          <Link
            to="/dashboard/customisations"
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 flex items-center gap-2"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>MY CUSTOMISATIONS ({customisations.length})</span>
          </Link>
          <Link
            to="/dashboard/referrals"
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 flex items-center gap-2"
          >
            <Users className="w-3.5 h-3.5" />
            <span>REFERRALS ({user.successful_referrals}/5)</span>
          </Link>
        </div>

        {/* Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BoostPointsCard points={user.points} isEarlyUser={user.is_early_user} />
          <ReferralCard referralCode={user.referral_code} successfulReferrals={user.successful_referrals} />
        </div>

        {/* Customisations List */}
        <CustomisationsTable customisations={customisations} />

      </div>
    </div>
  );
};
