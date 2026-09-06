import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, CheckCircle2, Star } from 'lucide-react';
import type { Project } from '../types/project';
import { MediaFallback } from './MediaFallback';
import { ResourceButtons } from './ResourceButtons';
import { InteractiveCard3D } from './3d/InteractiveCard3D';

interface FeaturedBuildProps {
  project: Project;
  onOpenVideo?: (project: Project) => void;
}

export const FeaturedBuild: React.FC<FeaturedBuildProps> = ({ project, onOpenVideo }) => {
  const formattedNumber = project.projectNumber || '01';

  return (
    <section className="w-full py-12">
      <InteractiveCard3D depth={8}>
        <div className="relative rounded-3xl bg-gradient-to-br from-[#12121c] via-[#0b0b10] to-[#070709] border border-amber-500/30 p-6 sm:p-8 md:p-12 overflow-hidden shadow-2xl shadow-amber-500/10">
          {/* Subtle background flare */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            
            {/* Media / Video side */}
            <div className="lg:col-span-7 relative group cursor-pointer">
              <div className="relative rounded-2xl overflow-hidden aspect-video border border-white/15 bg-black shadow-2xl">
                <MediaFallback
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <button
                    onClick={() => onOpenVideo && onOpenVideo(project)}
                    className="w-18 h-18 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/50 group-hover:scale-110 transition-transform cursor-pointer"
                    aria-label="Play Featured Video"
                  >
                    <Play className="w-8 h-8 ml-1 fill-slate-950 text-slate-950" />
                  </button>
                </div>

                {/* Number overlay */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="font-mono text-xs font-bold px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md text-amber-400 border border-amber-500/30">
                    BUILD #{formattedNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Project Details side */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>FEATURED BUILD</span>
              </div>

              <div className="space-y-3">
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                  {project.title}
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Key highlights list */}
              {project.highlights && (
                <div className="space-y-2 pt-2">
                  {project.highlights.slice(0, 3).map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Technologies */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest block">
                  TECHNOLOGY STACK
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 text-zinc-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-4">
                <Link
                  to={`/project/${project.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                >
                  <span>EXPLORE BUILD</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <ResourceButtons project={project} />
              </div>

            </div>

          </div>
        </div>
      </InteractiveCard3D>
    </section>
  );
};
