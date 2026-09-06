import React from 'react';
import { SearchX, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No builds found",
  description = "Try searching with a different keyword, category, or clear your current filters.",
  onReset,
}) => {
  return (
    <div className="w-full py-16 px-6 glass-panel rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center my-8">
      <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
        <SearchX className="w-8 h-8 text-amber-400" />
      </div>
      <h3 className="font-display text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 max-w-md text-sm mb-6 leading-relaxed">{description}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-all duration-200 shadow-lg shadow-amber-500/20 active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Reset All Filters
        </button>
      )}
    </div>
  );
};
