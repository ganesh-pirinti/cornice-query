import React, { useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search builds by title, tech stack (React, CSS...), or keyword...",
  autoFocus = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative w-full max-w-2xl mx-auto group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-amber-400 transition-colors">
        <Search className="w-5 h-5" />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-[#0e0e14] border border-white/15 focus:border-amber-500/50 text-white placeholder-zinc-400 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all duration-200 shadow-xl"
      />

      {value && (
        <button
          onClick={() => {
            onChange('');
            if (inputRef.current) inputRef.current.focus();
          }}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-white transition-colors"
          aria-label="Clear search query"
        >
          <X className="w-4 h-4 bg-white/10 hover:bg-white/20 rounded-full p-0.5" />
        </button>
      )}
    </div>
  );
};
