import React from 'react';
import { Layers, Server, CheckCircle2 } from 'lucide-react';

interface FullStackQuestionProps {
  selectedChoice: 'YES' | 'NO' | null;
  onSelectChoice: (choice: 'YES' | 'NO') => void;
}

export const FullStackQuestion: React.FC<FullStackQuestionProps> = ({
  selectedChoice,
  onSelectChoice,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono text-orange-400 font-bold uppercase tracking-widest">
          QUALIFICATION STEP 2
        </span>
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
          Do you want to make a full-stack website?
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
          Specify whether your project requires backend databases, user accounts, and API integrations, or frontend UI engineering only.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        
        {/* Option YES */}
        <button
          onClick={() => onSelectChoice('YES')}
          className={`p-6 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between space-y-4 group cursor-pointer ${
            selectedChoice === 'YES'
              ? 'bg-orange-500/15 border-orange-400 text-white shadow-xl shadow-orange-500/10'
              : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/10 text-zinc-300 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Server className="w-5 h-5" />
            </div>
            {selectedChoice === 'YES' && <CheckCircle2 className="w-5 h-5 text-orange-400" />}
          </div>

          <div className="space-y-1">
            <h4 className="text-lg font-black text-white group-hover:text-orange-300 transition-colors">
              YES, I NEED FULL-STACK
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Includes database architecture, backend APIs, user authentication, and complete web application deployment.
            </p>
          </div>
        </button>

        {/* Option NO */}
        <button
          onClick={() => onSelectChoice('NO')}
          className={`p-6 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between space-y-4 group cursor-pointer ${
            selectedChoice === 'NO'
              ? 'bg-white/10 border-white/30 text-white shadow-xl'
              : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/10 text-zinc-300 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300">
              <Layers className="w-5 h-5" />
            </div>
            {selectedChoice === 'NO' && <CheckCircle2 className="w-5 h-5 text-white" />}
          </div>

          <div className="space-y-1">
            <h4 className="text-lg font-black text-white">
              NO, FRONTEND IS ENOUGH
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Static landing page, UI/UX prototype, animation styling, or frontend client template without backend databases.
            </p>
          </div>
        </button>

      </div>
    </div>
  );
};
