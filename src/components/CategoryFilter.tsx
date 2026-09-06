import React from 'react';
import { CATEGORIES } from '../data/categories';

interface CategoryFilterProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  counts?: Record<string, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
  counts,
}) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2 min-w-max">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count = counts ? counts[cat.id] : undefined;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-200 flex items-center gap-2 active:scale-95 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-lg shadow-orange-500/25 border border-orange-400'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/10'
              }`}
            >
              <span>{cat.label}</span>
              {count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-slate-950/30 text-slate-950' : 'bg-white/10 text-zinc-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
