import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight } from 'lucide-react';
import { PROJECTS } from '../data/projects';
import type { ProjectCategory } from '../types/project';

const CATEGORIES_LIST: { id: ProjectCategory; title: string; description: string }[] = [
  {
    id: 'WEB',
    title: 'Web Applications & Sites',
    description: 'Full production web landing pages, WebGL canvas experiences, and responsive web platforms.',
  },
  {
    id: 'UI/UX',
    title: 'UI/UX & Interactive Interfaces',
    description: 'Sleek glassmorphism cards, kinetic form controls, dark mode dashboards, and accessibility-first UI widgets.',
  },
  {
    id: 'JAVASCRIPT',
    title: 'Vanilla JavaScript Builds',
    description: 'Native browser APIs, WebAudio synthesizers, custom physics engines, and dependency-free utilities.',
  },
  {
    id: 'REACT',
    title: 'React & Ecosystem Builds',
    description: 'Scalable React components, custom hooks, state morphing controllers, and high-performance charting.',
  },
  {
    id: 'CSS',
    title: 'CSS & Modern Layouts',
    description: 'Bento grid architectures, subgrid implementations, keyframe animations, and container queries.',
  },
  {
    id: 'ANIMATIONS',
    title: 'Kinetic & Motion Design',
    description: 'Framer Motion animations, 3D tilt interactions, scroll pinning, and smooth cursor trails.',
  },
  {
    id: 'MINI PROJECTS',
    title: 'Mini Micro-Builds',
    description: 'Single-file utilities, creative micro-interactions, and targeted visual experiments.',
  },
];

export const CategoriesPage: React.FC = () => {
  return (
    <div className="w-full pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Banner */}
        <div className="space-y-4 max-w-3xl">
          <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            BUILD ARCHIVE CATEGORIES
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Browse Builds by Category
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            Explore our curated build catalog organized by technology discipline, framework focus, and interactive domain.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORIES_LIST.map((cat) => {
            const count = PROJECTS.filter((p) => p.category === cat.id).length;
            const categoryProjects = PROJECTS.filter((p) => p.category === cat.id).slice(0, 2);

            return (
              <div
                key={cat.id}
                className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between group space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      {cat.id}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      {count} {count === 1 ? 'BUILD' : 'BUILDS'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">{cat.description}</p>
                  </div>
                </div>

                {/* Micro preview titles */}
                {categoryProjects.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-white/5">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                      FEATURED IN THIS CATEGORY
                    </span>
                    {categoryProjects.map((p) => (
                      <Link
                        key={p.id}
                        to={`/project/${p.slug}`}
                        className="flex items-center justify-between text-xs text-zinc-300 hover:text-amber-300 font-medium py-1 group/item"
                      >
                        <span className="line-clamp-1"># {p.title}</span>
                        <ArrowRight className="w-3 h-3 text-zinc-500 group-hover/item:text-amber-400 transition-colors shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}

                <Link
                  to={`/projects?category=${cat.id}`}
                  className="inline-flex items-center justify-between w-full pt-4 border-t border-white/10 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <span>BROWSE ALL {cat.id} BUILDS</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
