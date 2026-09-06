import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, ArrowRight, AlertCircle, Info } from 'lucide-react';

interface QualificationResultProps {
  score: number;
  totalQuestions: number;
  onTryAgain: () => void;
  resultType: 'FAIL' | 'FULLSTACK_NO';
}

export const QualificationResult: React.FC<QualificationResultProps> = ({
  score,
  totalQuestions,
  onTryAgain,
  resultType,
}) => {
  if (resultType === 'FULLSTACK_NO') {
    return (
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 space-y-8 animate-fadeIn text-center">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-zinc-300 text-xs font-mono font-bold uppercase">
            <Info className="w-4 h-4 text-orange-400" />
            <span>FULL-STACK SCOPE NOTICE</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            THANKS FOR SHARING YOUR REQUIREMENT
          </h2>

          <div className="inline-block px-4 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-300 font-mono font-bold text-sm">
            SCORE: {score} / {totalQuestions}
          </div>

          <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
            Our current Customise flow is focused on full-stack builds. You can continue exploring CQ projects and come back when you're ready for a full-stack build.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/projects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-sm transition-all cursor-pointer shadow-lg shadow-orange-500/20"
          >
            <span>EXPLORE CQ BUILDS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={onTryAgain}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 font-semibold text-sm transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>TRY AGAIN</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 space-y-8 animate-fadeIn text-center">
      {/* Fail Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-zinc-400 text-xs font-mono font-bold uppercase">
          <AlertCircle className="w-4 h-4 text-orange-400" />
          <span>MORE SCOPE DEFINITION NEEDED</span>
        </div>

        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
          LET'S GET THE IDEA READY FIRST
        </h2>

        <div className="inline-block px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 font-mono font-bold text-sm">
          SCORE: {score} / {totalQuestions}
        </div>

        <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
          Custom development works best when there is a clear project requirement. Take some time to define what you'd like to build and come back when you're ready!
        </p>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onTryAgain}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-sm transition-all cursor-pointer shadow-lg shadow-orange-500/20"
        >
          <RefreshCw className="w-4 h-4" />
          <span>TRY AGAIN</span>
        </button>

        <Link
          to="/projects"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 font-semibold text-sm transition-all"
        >
          <span>EXPLORE CQ BUILDS</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
