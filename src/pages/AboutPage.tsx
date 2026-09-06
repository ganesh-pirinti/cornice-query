import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Sparkles, Code2, Layers, Cpu, ArrowRight, ShieldCheck } from 'lucide-react';
import { CQJourney } from '../components/CQJourney';

export const AboutPage: React.FC = () => {
  return (
    <div className="w-full pt-28 pb-24 space-y-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* About Hero Header */}
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>DESIGN IT. BUILD IT. QUERY IT.</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            About Cornice & Query
          </h1>

          <p className="text-lg text-zinc-300 leading-relaxed font-normal">
            Cornice & Query is a creative development platform where ideas are turned into practical, production-ready digital builds.
          </p>
        </div>

        {/* What connects CQ grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          {[
            { name: 'DESIGN', desc: 'Kinetic visual craft', icon: Sparkles },
            { name: 'CODE', desc: 'Clean TypeScript & CSS', icon: Code2 },
            { name: 'EXPERIMENTS', desc: 'WebGL & Canvas physics', icon: Cpu },
            { name: 'PROJECTS', desc: 'Complete web apps', icon: Layers },
            { name: 'LEARNING', desc: 'Open source resources', icon: Terminal },
          ].map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.name}
                className="glass-panel p-6 rounded-2xl border border-white/10 space-y-2 hover:border-amber-500/30 transition-colors"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                  <Icon className="w-5 h-5 text-amber-400" />
                </div>
                <h4 className="text-xs font-mono font-bold text-white tracking-wider">{pillar.name}</h4>
                <p className="text-[11px] text-zinc-400">{pillar.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Deep Dive Narrative Cards */}
        <div className="space-y-8">
          
          {/* What is CQ? */}
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 space-y-4">
            <h2 className="font-display text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              What is CQ?
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              If you’ve watched a short video or social reel on <strong className="text-white">Cornice & Query</strong> showing a smooth animated UI component, a 3D portfolio element, or a kinetic web dashboard, this platform is where that reel turns into reality.
            </p>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Instead of leaving code snippets buried in social media comments or temporary storage links, every single build featured across CQ is documented here with live video previews, architectural breakdowns, technology tags, and direct access to source code and working demos.
            </p>
          </div>

          {/* Why CQ Exists */}
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 space-y-4">
            <h2 className="font-display text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              Why CQ Exists
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              We noticed a huge gap on developer social media: impressive video reels showcase amazing user interfaces, but developers are often left guessing how it was constructed or where to inspect the code.
            </p>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Cornice & Query was created to empower developers, designers, and creators with authentic, accessible, and production-tested builds. Every project published here is built with purpose, high code quality standards, and full transparency.
            </p>
          </div>

          {/* What We Build */}
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 space-y-4">
            <h2 className="font-display text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              What We Build
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                'Kinetic Authentication & Onboarding Cards',
                'WebGL & 3D Interactive Canvas Nodes',
                'Enterprise Glassmorphism Dashboard Layouts',
                'WebAudio API Digital Synthesizers & Sound Engines',
                'Magnetic Parallax Cursor & Scroll Navigation Systems',
                'Modern Responsive CSS Bento Grid Architectures',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-zinc-300 bg-white/[0.02] p-3.5 rounded-xl border border-white/5">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* How Platform Works Flow */}
        <CQJourney />

        {/* Bottom CTA Box */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-amber-500/20 via-[#12121c] to-[#070709] border border-amber-500/30 text-center space-y-6">
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Ready to explore the builds?
          </h3>
          <p className="text-sm text-zinc-300 max-w-xl mx-auto">
            Check out our project library, test live web implementations, and grab source code for your next project.
          </p>
          <div className="pt-2">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base transition-all shadow-xl shadow-amber-500/25"
            >
              <span>Explore Projects Archive</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
