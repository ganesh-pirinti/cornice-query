import React, { useState, useEffect } from 'react';
import { ArrowRight, Layout, CheckCircle2 } from 'lucide-react';
import { getVisitorCount } from '../../services/visitorService';

interface CustomiseHeroProps {
  onStartQuiz: () => void;
}

export const CustomiseHero: React.FC<CustomiseHeroProps> = ({ onStartQuiz }) => {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    getVisitorCount().then((count) => setVisitorCount(count));
  }, []);

  const capabilities = [
    'Custom Authentication & Login Interfaces',
    'High-Conversion Landing Pages',
    'Interactive 3D & WebGL Portfolios',
    'Enterprise Glassmorphism Dashboards',
    'Kinetic Motion Design & Micro-Interactions',
    'Bespoke Web Application Architectures',
  ];

  const steps = [
    { number: '01', title: 'Tell us what you need', desc: 'Identify your project requirements and target visual design.' },
    { number: '02', title: 'Complete qualification', desc: 'Answer 5 quick questions to clarify your project scope.' },
    { number: '03', title: 'Connect with CQ', desc: 'Unlock direct WhatsApp communication with our engineering team.' },
    { number: '04', title: 'Discuss custom build', desc: 'Review project specifications, design direction, and execution plan.' },
  ];

  return (
    <div className="w-full space-y-16">
      {/* Main Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        
        {/* Real Visitor Counter Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono font-bold tracking-wider uppercase">
          <span className="text-orange-400 font-serif">✦</span>
          <span>{visitorCount !== null ? `${visitorCount.toLocaleString()} CQ VISITORS` : '0 CQ VISITORS'}</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
          CUSTOMISE YOUR BUILD <span className="text-orange-400 font-serif">✦</span>
        </h1>

        <p className="text-lg sm:text-xl text-zinc-300 font-normal leading-relaxed">
          "Have an idea that doesn't fit inside a template? Tell us what you want to build."
        </p>

        <div className="pt-2">
          <button
            onClick={onStartQuiz}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-base transition-all duration-200 shadow-xl shadow-orange-500/25 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>START CUSTOMISING →</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Capabilities Showcase */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
            <Layout className="w-5 h-5 text-orange-400" />
            <span>WHAT WE BUILD FOR YOU</span>
          </h2>
          <span className="text-xs font-mono text-orange-400 uppercase font-semibold">CUSTOM ENGINEERING</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {capabilities.map((cap, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3 text-sm text-zinc-200">
              <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span className="font-medium">{cap}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4-Step Process Cards */}
      <div className="space-y-6">
        <h3 className="text-center text-xs font-mono text-orange-400 uppercase tracking-widest font-semibold">
          HOW CUSTOMISATION WORKS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 glass-panel hover:border-orange-500/30 transition-all space-y-3 relative group"
            >
              <span className="font-mono text-xs font-bold text-orange-400 px-2.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 inline-block">
                STEP {step.number}
              </span>
              <h4 className="text-base font-bold text-white group-hover:text-orange-300 transition-colors">
                {step.title}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
