import React from 'react';
import { Code2, ExternalLink, Share2 } from 'lucide-react';
import type { Project } from '../types/project';

interface ResourceButtonsProps {
  project: Project;
  className?: string;
  size?: 'normal' | 'large';
}

export const ResourceButtons: React.FC<ResourceButtonsProps> = ({
  project,
  className = '',
  size = 'normal',
}) => {
  const { codeUrl, liveUrl, socialUrl } = project;

  // IMPORTANT UX RULE: Only show buttons for resources that actually exist.
  const hasResources = codeUrl || liveUrl || socialUrl;

  if (!hasResources) {
    return (
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-zinc-400 text-sm italic">
        Resources for this build are being prepared for release.
      </div>
    );
  }

  const py = size === 'large' ? 'py-3.5 px-6 text-base' : 'py-2.5 px-4 text-sm';

  return (
    <div className={`flex flex-wrap items-center gap-3.5 ${className}`}>
      {codeUrl && (
        <a
          href={codeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 font-bold tracking-wide rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all duration-200 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-[0.98] ${py}`}
        >
          <Code2 className={size === 'large' ? 'w-5 h-5' : 'w-4 h-4'} />
          <span>GET CODE</span>
        </a>
      )}

      {liveUrl && (
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 font-semibold tracking-wide rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 hover:border-white/30 transition-all duration-200 active:scale-[0.98] backdrop-blur-md ${py}`}
        >
          <ExternalLink className={size === 'large' ? 'w-5 h-5' : 'w-4 h-4'} />
          <span>LIVE DEMO</span>
        </a>
      )}

      {socialUrl && (
        <a
          href={socialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 font-medium tracking-wide rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 hover:border-zinc-500 transition-all duration-200 active:scale-[0.98] ${py}`}
        >
          <Share2 className={size === 'large' ? 'w-5 h-5 text-amber-400' : 'w-4 h-4 text-amber-400'} />
          <span>ORIGINAL POST</span>
        </a>
      )}
    </div>
  );
};
