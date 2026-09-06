import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import type { Project } from '../types/project';
import { MediaFallback } from './MediaFallback';
import { InteractiveCard3D } from './3d/InteractiveCard3D';

interface HeroProps {
  featuredProject: Project;
  onOpenVideo?: (project: Project) => void;
}

export const Hero: React.FC<HeroProps> = ({ featuredProject, onOpenVideo }) => {
  return (
    <section className="relative w-full pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden border-b border-white/10">
      {/* Subtle studio atmosphere background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-orange-500/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Eyebrow Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>OFFICIAL RESOURCE HUB</span>
            </div>

            {/* Brand Title & Main Statement */}
            <div className="space-y-3">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
                Everything you see on <span className="text-orange-400">CQ</span>, built and documented in one place.
              </h1>
              <p className="text-base sm:text-lg text-zinc-300 font-normal max-w-2xl leading-relaxed">
                Explore our builds, watch them in action, and get the resources you need to build them yourself.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#builds-gallery"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-base transition-all duration-200 shadow-xl shadow-orange-500/20 hover:-translate-y-0.5 active:scale-95"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-200 hover:text-white border border-white/10 hover:border-white/20 text-base font-semibold transition-all duration-200 hover:-translate-y-0.5"
              >
                <span>About CQ</span>
              </Link>
            </div>

            {/* Quick Flow Indicators */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                <span>01 WATCH</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                <span>02 EXPLORE</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                <span>03 BUILD</span>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Studio Preview Frame */}
          <div className="lg:col-span-5 relative">
            <InteractiveCard3D depth={8}>
              <div className="bg-[#0c0c10] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                
                {/* Header Bar */}
                <div className="px-4 py-3 bg-white/[0.03] border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500">
                    CQ-FEATURED-BUILD.TSX
                  </span>
                </div>

                {/* Hero Card Thumbnail & Play Overlay */}
                <div className="relative aspect-video bg-black group/thumb cursor-pointer">
                  <MediaFallback
                    src={featuredProject.thumbnail}
                    alt={featuredProject.title}
                    className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover/thumb:bg-black/20 transition-colors flex items-center justify-center">
                    <button
                      onClick={() => onOpenVideo && onOpenVideo(featuredProject)}
                      className="w-16 h-16 rounded-full bg-orange-500 text-slate-950 flex items-center justify-center shadow-xl shadow-orange-500/40 group-hover/thumb:scale-110 transition-transform cursor-pointer"
                      aria-label="Play Featured Video"
                    >
                      <Play className="w-7 h-7 ml-1 fill-slate-950 text-slate-950" />
                    </button>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="p-5 space-y-3 bg-[#08080c]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-orange-400 font-bold px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">
                      FEATURED BUILD
                    </span>
                    <span className="text-xs font-mono text-zinc-400">{featuredProject.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white leading-snug">
                    {featuredProject.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {featuredProject.technologies.map((t) => (
                      <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </InteractiveCard3D>
          </div>

        </div>
      </div>
    </section>
  );
};
