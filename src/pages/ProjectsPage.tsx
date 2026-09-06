import React from 'react';
import { ProjectGrid } from '../components/ProjectGrid';
import { PROJECTS } from '../data/projects';
import type { Project } from '../types/project';
import { Terminal } from 'lucide-react';

interface ProjectsPageProps {
  onOpenVideo: (project: Project) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onOpenVideo }) => {
  return (
    <div className="w-full pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Header Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#12121c] via-[#0c0c12] to-[#070709] border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[120px] pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              COMPLETE REPOSITORY ARCHIVE
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Cornice & Query Project Library
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Browse through our complete library of creative builds, UI experiments, WebGL canvas demos, and full-stack web applications.
            </p>
          </div>
        </div>

        {/* Searchable and Filterable Project Grid */}
        <ProjectGrid
          projects={PROJECTS}
          title="All Documented Builds"
          subtitle="Filter by tech stack or search directly for specific project components."
          onOpenVideo={onOpenVideo}
        />

      </div>
    </div>
  );
};
