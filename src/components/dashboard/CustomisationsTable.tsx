import React from 'react';
import { Link } from 'react-router-dom';
import type { UserCustomisationRequest } from '../../services/customisationService';
import { Layers, Calendar, ArrowRight } from 'lucide-react';

interface CustomisationsTableProps {
  customisations: UserCustomisationRequest[];
}

export const CustomisationsTable: React.FC<CustomisationsTableProps> = ({ customisations }) => {
  if (customisations.length === 0) {
    return (
      <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400">
          <Layers className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-white">NO CUSTOM BUILDS YET</h4>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          "Your future custom build requirements will appear here after you complete the qualification."
        </p>
        <Link
          to="/customise"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-orange-500/20"
        >
          <span>START CUSTOMISING</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
          MY CUSTOMISATION REQUESTS
        </h3>
        <span className="text-xs font-mono text-zinc-400">{customisations.length} TOTAL</span>
      </div>

      <div className="space-y-3">
        {customisations.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-orange-500/30 transition-all"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  SCORE: {item.quizScore}/5
                </span>
                <span className="text-xs font-bold text-white line-clamp-1">
                  {item.requirement || 'Custom Website Requirement'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-zinc-500" />
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <span>•</span>
                <span>ESTIMATE: {item.priceShown}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
