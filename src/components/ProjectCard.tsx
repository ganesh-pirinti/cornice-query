import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, Code, ExternalLink, Share2 } from 'lucide-react';
import type { Project } from '../types/project';
import { MediaFallback } from './MediaFallback';
import { InteractiveCard3D } from './3d/InteractiveCard3D';

interface ProjectCardProps {
  project: Project;
  onOpenVideo?: (project: Project) => void;
  index?: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpenVideo, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  const {
    slug,
    projectNumber,
    title,
    shortDescription,
    thumbnail,
    category,
    technologies,
    codeUrl,
    liveUrl,
    socialUrl,
  } = project;

  // Auto-format project number if omitted
  const formattedNumber = projectNumber || String(index + 1).padStart(2, '0');

  return (
    <InteractiveCard3D className="h-full">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative bg-[#0f0f14] border border-white/10 hover:border-amber-500/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col h-full"
      >
        {/* Top Media / Thumbnail Section */}
        <div className="relative w-full aspect-video overflow-hidden bg-black cursor-pointer">
          <MediaFallback
            src={thumbnail}
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
          />

          {/* Dark subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f14] via-black/20 to-black/40 pointer-events-none" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-amber-400 border border-amber-500/30">
              {formattedNumber}
            </span>
            <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md text-zinc-200 uppercase tracking-wider">
              {category}
            </span>
          </div>

          {/* Interactive Animated Play Overlay */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenVideo) onOpenVideo(project);
            }}
            aria-label={`Play video for ${title}`}
            className="absolute inset-0 flex items-center justify-center z-10 focus:outline-none cursor-pointer"
          >
            <div
              className={`w-14 h-14 rounded-full bg-amber-500/90 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/30 transition-all duration-300 ${
                isHovered ? 'scale-110 opacity-100' : 'scale-95 opacity-80'
              }`}
            >
              <Play className="w-6 h-6 ml-1 fill-slate-950 text-slate-950" />
            </div>
          </button>

          {/* Resource Indicators on Thumbnail Bottom Right */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10 pointer-events-none">
            {codeUrl && (
              <span title="Source Code Available" className="p-1 rounded bg-black/60 backdrop-blur-md text-amber-400 border border-white/10">
                <Code className="w-3.5 h-3.5" />
              </span>
            )}
            {liveUrl && (
              <span title="Live Demo Available" className="p-1 rounded bg-black/60 backdrop-blur-md text-emerald-400 border border-white/10">
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
            )}
            {socialUrl && (
              <span title="Social Reel Post Available" className="p-1 rounded bg-black/60 backdrop-blur-md text-purple-400 border border-white/10">
                <Share2 className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
        </div>

        {/* Card Content Section */}
        <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
          <div className="space-y-2">
            {/* Project Title */}
            <Link to={`/project/${slug}`} className="block group/title">
              <h3
                className={`font-display text-lg font-bold text-white transition-colors duration-200 line-clamp-1 ${
                  isHovered ? 'text-amber-400 translate-x-0.5' : ''
                }`}
              >
                {title}
              </h3>
            </Link>

            {/* Short Description */}
            <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
              {shortDescription}
            </p>
          </div>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] text-zinc-300 border border-white/5"
              >
                {tech}
              </span>
            ))}
            {technologies.length > 4 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white/[0.04] text-zinc-400">
                +{technologies.length - 4}
              </span>
            )}
          </div>

          {/* Action Link Button */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between mt-auto">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest">
              CQ BUILD
            </span>
            <Link
              to={`/project/${slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 group-hover:translate-x-1 transition-all duration-200"
            >
              <span>VIEW PROJECT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </InteractiveCard3D>
  );
};
