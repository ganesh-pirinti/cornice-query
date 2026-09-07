import React, { useState, useEffect } from 'react';
import { ArrowRight, Layout, CheckCircle2 } from 'lucide-react';
import { getVisitorCount } from '../../services/visitorService';

interface CustomiseHeroProps {
  onStartQuiz?: () => void;
}

export const CustomiseHero: React.FC<CustomiseHeroProps> = ({ onStartQuiz }) => {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    getVisitorCount().then((count) => setVisitorCount(count));
  }, []);

  const handleStart = () => {
    if (onStartQuiz) {
      onStartQuiz();
    } else {
      const quizElement = document.getElementById('qualification-quiz');
      if (quizElement) {
        quizElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

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
    <div className="w-full space-y-10">
      {/* Top Qualification Intro Card: CUSTOMISE YOUR EXPERIENCE */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 relative overflow-hidden">
        {/* Subtle Top Accent Line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

        <div className="text-center max-w-2xl mx-auto space-y-3">
          {/* Real Visitor Counter Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[11px] font-mono font-bold tracking-wider uppercase">
            <span className="text-orange-400 font-serif">✦</span>
            <span>{visitorCount !== null ? `${visitorCount.toLocaleString()} CQ VISITORS` : 'CQ BUILD STUDIO'}</span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            CUSTOMISE YOUR EXPERIENCE <span className="text-amber-400 font-serif">✦</span>
          </h1>

          <p className="text-sm text-zinc-300 font-normal leading-relaxed">
            A quick 5-step conversation to understand what you actually need.
          </p>
        </div>

        {/* 01–05 Editorial Timeline Markers */}
        <div className="py-1">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-4xl mx-auto">
            {[
              { step: '01', label: 'IDEA' },
              { step: '02', label: 'STYLE' },
              { step: '03', label: 'WEBSITE' },
              { step: '04', label: 'FEATURES' },
              { step: '05', label: 'BUILD' },
            ].map((item) => (
              <div
                key={item.step}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-amber-500/30 transition-colors text-center space-y-1 group"
              >
                <div className="font-mono text-xs font-bold text-amber-400 tracking-wider">
                  {item.step}
                </div>
                <div className="font-display text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-zinc-400 max-w-lg mx-auto leading-relaxed pt-1">
          Answer five simple questions. Your answers help us understand the right direction for your custom website.
        </p>
      </div>

      {/* Centered Primary CTA Button in the gap between 5-step card & methodology section */}
      <div className="text-center py-1">
        <button
          onClick={handleStart}
          aria-label="Start customising your website with Cornice & Query"
          className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-sm sm:text-base tracking-wider uppercase transition-all duration-200 shadow-xl shadow-orange-500/25 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          <span>START CUSTOMISING</span>
          <ArrowRight className="w-5 h-5 text-slate-950 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>

      {/* Editorial Methodology: FROM IDEA TO INTERFACE */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 space-y-8 relative overflow-hidden">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono font-bold tracking-widest uppercase">
            <span className="text-amber-400 font-serif">✦</span>
            <span>CQ METHODOLOGY</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            FROM IDEA TO INTERFACE <span className="text-amber-400 font-serif">✦</span>
          </h2>
          <p className="text-sm text-zinc-300 font-normal leading-relaxed">
            Tell us what you're building. We'll help shape the experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {[
            {
              step: '01',
              title: 'DEFINE',
              desc: 'Clarity before code. Align on project scope, core features, and architectural direction.',
            },
            {
              step: '02',
              title: 'DESIGN',
              desc: 'Visual identity & UI. Crafting bespoke glassmorphic interfaces and responsive interactions.',
            },
            {
              step: '03',
              title: 'BUILD',
              desc: 'Production engineering. Executing high-performance full-stack web builds with precision.',
            },
          ].map((item, idx) => (
            <div
              key={item.step}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-500/40 transition-all duration-300 space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-bold text-amber-400 tracking-wider">
                  {item.step} — {item.title}
                </span>
                {idx < 2 && (
                  <span className="hidden md:inline-block text-amber-400/50 text-xs font-mono">
                    →
                  </span>
                )}
              </div>
              <div className="h-0.5 w-12 bg-gradient-to-r from-amber-500 to-orange-500 group-hover:w-20 transition-all duration-300" />
              <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                {item.desc}
              </p>
            </div>
          ))}
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
