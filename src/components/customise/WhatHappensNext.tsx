import React from 'react';

export const WhatHappensNext: React.FC = () => {
  const steps = [
    { number: '01', text: 'Tell us your idea' },
    { number: '02', text: 'Choose your style' },
    { number: '03', text: 'Define your website' },
    { number: '04', text: 'Select features' },
    { number: '05', text: 'Start your build' },
  ];

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 relative overflow-hidden my-8">
      {/* Subtle Top Accent Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-amber-500/35 to-transparent" />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 inline-block">
          WHAT HAPPENS NEXT
        </span>
        <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
          CQ Build Direction
        </h3>
      </div>

      {/* 5-Step Process Timeline */}
      <div className="py-2">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 max-w-4xl mx-auto">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-amber-500/30 transition-all duration-200 space-y-1.5 group relative"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400">
                  {step.number}
                </span>
                {idx < 4 && (
                  <span className="hidden sm:inline-block text-amber-400/30 text-[10px] font-mono">
                    →
                  </span>
                )}
              </div>
              <p className="font-sans text-xs font-medium text-zinc-300 group-hover:text-white transition-colors leading-snug">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Supporting Line */}
      <p className="text-center text-xs text-zinc-400 max-w-lg mx-auto leading-relaxed pt-1">
        Complete the five steps and we'll turn your requirements into a clear build direction.
      </p>
    </div>
  );
};
