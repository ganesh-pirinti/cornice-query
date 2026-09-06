import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { PROJECTS } from '../data/projects';
import type { Project } from '../types/project';

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenVideo?: (project: Project) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onOpenVideo }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? PROJECTS.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.shortDescription.toLowerCase().includes(query.toLowerCase()) ||
          p.technologies.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : PROJECTS.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 animate-fadeIn">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/85 backdrop-blur-xl" />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#0c0c10] border border-white/20 rounded-2xl overflow-hidden shadow-2xl z-10 space-y-0">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/[0.02]">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type project title, technology (React, CSS...), or category..."
            autoFocus
            className="w-full bg-transparent text-white text-base placeholder-zinc-500 focus:outline-none font-medium"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          {filtered.length === 0 ? (
            <p className="text-center text-zinc-500 py-8 text-sm">No builds found matching "{query}"</p>
          ) : (
            filtered.map((project) => (
              <div
                key={project.id}
                onClick={() => {
                  onClose();
                  navigate(`/project/${project.slug}`);
                }}
                className="p-3.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer group flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="text-white font-bold text-sm group-hover:text-amber-400 transition-colors">
                    {project.title}
                  </h4>
                  <p className="text-xs text-zinc-400 line-clamp-1">{project.shortDescription}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {onOpenVideo && project.videoUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                        onOpenVideo(project);
                      }}
                      className="px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-400 text-xs font-mono font-bold hover:bg-orange-500/20"
                    >
                      WATCH
                    </button>
                  )}
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
