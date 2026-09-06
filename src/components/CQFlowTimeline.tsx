import React from 'react';
import { Eye, Layers, Terminal } from 'lucide-react';

interface CQFlowTimelineProps {
  currentStep?: 'WATCH' | 'EXPLORE' | 'BUILD' | 'ALL';
  compact?: boolean;
}

export const CQFlowTimeline: React.FC<CQFlowTimelineProps> = ({
  currentStep = 'ALL',
  compact = false,
}) => {
  const steps = [
    {
      id: 'WATCH',
      number: '01',
      title: 'WATCH',
      subtitle: 'See it in action',
      desc: 'Watch project video previews and kinetic UI interactions.',
      icon: Eye,
    },
    {
      id: 'EXPLORE',
      number: '02',
      title: 'EXPLORE',
      subtitle: 'Understand what we built',
      desc: 'Deconstruct architecture, core algorithms, and tech stack.',
      icon: Layers,
    },
    {
      id: 'BUILD',
      number: '03',
      title: 'BUILD',
      subtitle: 'Get code and build it',
      desc: 'Access complete source code repositories and live implementations.',
      icon: Terminal,
    },
  ];

  if (compact) {
    return (
      <div className="w-full py-4 px-6 rounded-2xl bg-white/[0.03] border border-white/10 glass-panel">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            THE CQ RESOURCE FLOW
          </span>
          <div className="flex items-center gap-2 sm:gap-6 text-xs sm:text-sm font-medium">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono flex items-center justify-center font-bold">
                    {step.number}
                  </span>
                  <span className="text-white font-semibold">{step.title}</span>
                </div>
                {idx < steps.length - 1 && (
                  <span className="text-amber-500/40 font-mono">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === 'ALL' || currentStep === step.id;

          return (
            <div
              key={step.id}
              className={`p-6 rounded-2xl transition-all duration-300 relative overflow-hidden group ${
                isActive
                  ? 'glass-panel border-amber-500/20 hover:border-amber-500/40 shadow-xl'
                  : 'bg-white/[0.02] border border-white/5 opacity-70'
              }`}
            >
              <div className="absolute top-0 right-0 p-6 text-5xl font-black font-mono text-white/[0.03] group-hover:text-amber-500/[0.08] transition-colors pointer-events-none">
                {step.number}
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold block">
                    STEP {step.number}
                  </span>
                  <h4 className="text-lg font-bold text-white tracking-wide">{step.title}</h4>
                </div>
              </div>

              <p className="text-sm font-medium text-amber-200/90 mb-1">{step.subtitle}</p>
              <p className="text-xs text-zinc-400 leading-relaxed">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
