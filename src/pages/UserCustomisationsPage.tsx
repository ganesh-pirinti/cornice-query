import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserCustomisations } from '../services/customisationService';
import { CustomisationsTable } from '../components/dashboard/CustomisationsTable';
import { useSetDocumentTitle } from '../utils/seo';
import { Layers, ArrowLeft } from 'lucide-react';

export const UserCustomisationsPage: React.FC = () => {
  const { user } = useAuth();

  useSetDocumentTitle({
    title: 'Cornice & Query — My Customisations',
    description: 'View your submitted custom build requests, qualification scores, and review status.',
  });

  if (!user) return null;

  const customisations = getUserCustomisations(user.id);

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
            MY CUSTOM BUILDS
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            <Layers className="w-7 h-7 text-orange-400" />
            <span>My Customisations</span>
          </h1>
          <p className="text-sm text-zinc-400">
            Every time you complete the qualification and submit a requirement brief, your build request appears here.
          </p>
        </div>

        <CustomisationsTable customisations={customisations} />
      </div>
    </div>
  );
};
