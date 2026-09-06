import React, { useState } from 'react';
import { Film, Play } from 'lucide-react';

interface MediaFallbackProps {
  src?: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  showPlayIcon?: boolean;
}

export const MediaFallback: React.FC<MediaFallbackProps> = ({
  src,
  alt,
  className = '',
  showPlayIcon = true,
}) => {
  const [hasError, setHasError] = useState(!src);
  const [isLoading, setIsLoading] = useState(!!src);

  if (hasError || !src) {
    return (
      <div 
        className={`w-full h-full min-h-[220px] bg-gradient-to-br from-[#14141d] via-[#0d0d12] to-[#070709] border border-white/10 rounded-xl flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group ${className}`}
      >
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
        <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 group-hover:border-amber-500/60 transition-transform duration-300">
          {showPlayIcon ? <Play className="w-6 h-6 ml-0.5 fill-amber-400/20 text-amber-400" /> : <Film className="w-6 h-6 text-amber-400" />}
        </div>
        <p className="text-xs font-mono text-zinc-400 tracking-wider uppercase mb-1">CORNICE & QUERY BUILD</p>
        <span className="text-sm text-zinc-300 font-medium max-w-[80%] line-clamp-1">{alt}</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-[#121218] animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
};
