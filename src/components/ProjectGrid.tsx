import React, { useState, useMemo } from 'react';
import type { Project } from '../types/project';
import { ProjectCard } from './ProjectCard';
import { CategoryFilter } from './CategoryFilter';
import { SearchBar } from './SearchBar';
import { EmptyState } from './EmptyState';
import { ProjectGridSkeleton } from './SkeletonLoader';
import { CATEGORIES } from '../data/categories';

interface ProjectGridProps {
  projects: Project[];
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
  showSearch?: boolean;
  onOpenVideo?: (project: Project) => void;
  isLoading?: boolean;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  title = "Explore the Builds",
  subtitle = "Projects featured across Cornice & Query social reels and videos.",
  showFilters = true,
  showSearch = true,
  onOpenVideo,
  isLoading = false,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Category counts computation
  const counts = useMemo(() => {
    const map: Record<string, number> = { ALL: projects.length };
    CATEGORIES.forEach((cat) => {
      if (cat.id !== 'ALL') {
        map[cat.id] = projects.filter((p) => p.category.toUpperCase() === cat.id.toUpperCase()).length;
      }
    });
    return map;
  }, [projects]);

  // Filtered projects computation
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        activeCategory === 'ALL' || project.category.toUpperCase() === activeCategory.toUpperCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.shortDescription.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.category.toLowerCase().includes(q) ||
        project.technologies.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [projects, activeCategory, searchQuery]);

  const handleReset = () => {
    setActiveCategory('ALL');
    setSearchQuery('');
  };

  return (
    <section className="w-full py-8 space-y-8" id="builds-gallery">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono text-orange-400 uppercase tracking-widest font-semibold flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            CQ PROJECT ARCHIVE
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-xl">{subtitle}</p>
        </div>

        <div className="text-xs font-mono text-zinc-400">
          SHOWING <span className="text-orange-400 font-bold">{filteredProjects.length}</span> OF {projects.length} BUILDS
        </div>
      </div>

      {/* Filter and Search Bar */}
      {(showFilters || showSearch) && (
        <div className="space-y-4">
          {showSearch && (
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          )}

          {showFilters && (
            <CategoryFilter
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              counts={counts}
            />
          )}
        </div>
      )}

      {/* Grid or Loading / Empty States */}
      {isLoading ? (
        <ProjectGridSkeleton count={6} />
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          title="No builds matched your search"
          description={`We couldn't find any projects matching "${searchQuery || activeCategory}". Try searching for keywords like "Login", "3D", "React", or reset your filters.`}
          onReset={handleReset}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpenVideo={onOpenVideo}
              index={idx}
            />
          ))}
        </div>
      )}
    </section>
  );
};
