import React from 'react';

export const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className="bg-[#121218] border border-white/5 rounded-2xl overflow-hidden animate-pulse">
      {/* Thumbnail aspect ratio skeleton */}
      <div className="w-full h-56 bg-zinc-800/40 relative" />
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="w-10 h-5 bg-amber-500/10 rounded-full" />
          <div className="w-16 h-5 bg-zinc-800/60 rounded-full" />
        </div>
        <div className="h-6 bg-zinc-800/60 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-zinc-800/40 rounded w-full" />
          <div className="h-4 bg-zinc-800/40 rounded w-2/3" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-6 w-16 bg-zinc-800/50 rounded" />
          <div className="h-6 w-16 bg-zinc-800/50 rounded" />
          <div className="h-6 w-16 bg-zinc-800/50 rounded" />
        </div>
        <div className="pt-4 border-t border-white/5 flex justify-between items-center">
          <div className="h-5 w-24 bg-zinc-800/60 rounded" />
          <div className="h-8 w-28 bg-amber-500/20 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export const ProjectGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
};
