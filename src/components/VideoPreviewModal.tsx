import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Project } from '../types/project';
import { MediaFallback } from './MediaFallback';
import { ResourceButtons } from './ResourceButtons';

interface VideoPreviewModalProps {
  project: Project | null;
  onClose: () => void;
}

export const VideoPreviewModal: React.FC<VideoPreviewModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  const formattedNumber = project.projectNumber || '01';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fadeIn">
      {/* Dark backdrop overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity"
      />

      {/* Modal Card Container */}
      <div className="relative w-full max-w-4xl bg-[#0c0c10] border border-white/15 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              BUILD #{formattedNumber}
            </span>
            <h3 className="text-base font-bold text-white line-clamp-1">{project.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Area */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
          {project.videoUrl ? (
            <video
              src={project.videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
              poster={project.thumbnail}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <MediaFallback src={project.thumbnail} alt={project.title} className="w-full h-full" />
          )}
        </div>

        {/* Modal Footer / Description & Quick Resources */}
        <div className="p-6 space-y-4 overflow-y-auto bg-[#0a0a0e]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-1">
                {project.category}
              </span>
              <p className="text-sm text-zinc-300 leading-relaxed">{project.shortDescription}</p>
            </div>
            <Link
              to={`/project/${project.slug}`}
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all whitespace-nowrap shadow-lg shadow-amber-500/20"
            >
              <span>FULL EXPLORE PAGE</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="pt-4 border-t border-white/10">
            <ResourceButtons project={project} />
          </div>
        </div>
      </div>
    </div>
  );
};
