import React from 'react';
import { Eye, Layers, Terminal, Sparkles } from 'lucide-react';
import { InteractiveCard3D } from './3d/InteractiveCard3D';

export const CQJourney: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'WATCH',
      tagline: 'See it in action.',
      description:
        'Every project starts as a live video breakdown on Cornice & Query social channels. Experience kinetic UI motion, 3D Canvas rendering, and micro-interactions.',
      icon: Eye,
    },
    {
      number: '02',
      title: 'EXPLORE',
      tagline: 'Understand what we built.',
      description:
        'Deconstruct the architecture behind every build. Inspect the technology stack, algorithmic logic, performance optimizations, and design system choices.',
      icon: Layers,
    },
    {
      number: '03',
      title: 'BUILD',
      tagline: 'Get the code and build it yourself.',
      description:
        'Access clean production-ready source code repositories, explore live interactive web demos, and inspect original social media posts directly.',
      icon: Terminal,
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono text-orange-400 uppercase tracking-widest font-semibold inline-flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            HOW CORNICE & QUERY WORKS
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            From Social Reel to Production Code
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            We bridge the gap between creative visual content and tangible software development.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <InteractiveCard3D key={step.number} depth={6} className="h-full">
                <div className="relative p-8 rounded-2xl bg-[#0c0c10] border border-white/10 hover:border-orange-500/30 transition-all duration-300 group flex flex-col justify-between h-full">
                  {/* Background Step Number */}
                  <div className="absolute top-4 right-6 font-display text-6xl font-black text-white/[0.03] group-hover:text-orange-500/10 transition-colors pointer-events-none">
                    {step.number}
                  </div>

                  <div className="space-y-6">
                    {/* Step Badge & Icon */}
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shadow-md">
                        <Icon className="w-6 h-6 text-orange-400" />
                      </div>
                      <span className="font-mono text-xs font-bold text-orange-400 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
                        STEP {step.number}
                      </span>
                    </div>

                    {/* Title & Tagline */}
                    <div className="space-y-1">
                      <h3 className="font-display text-2xl font-bold text-white tracking-wide">
                        {step.title}
                      </h3>
                      <p className="text-sm font-semibold text-orange-400">
                        "{step.tagline}"
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/10 flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    <span>CQ RESOURCE ARCHITECTURE</span>
                  </div>
                </div>
              </InteractiveCard3D>
            );
          })}
        </div>

      </div>
    </section>
  );
};
