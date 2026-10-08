import React, { useState, useEffect, useRef } from 'react';
import { X, HelpCircle, Lightbulb } from 'lucide-react';

export const BeginnerHelpTab: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close popover when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const examples = [
    { icon: '🌐', label: 'Website for my business' },
    { icon: '🎨', label: 'Landing page' },
    { icon: '🔐', label: 'Login / Signup page' },
    { icon: '🛍️', label: 'Online store' },
    { icon: '📱', label: 'Mobile-friendly website' },
    { icon: '✨', label: 'Something completely custom' },
  ];

  return (
    <>
      {/* FLOATING TAB (Bottom-Left) */}
      <div
        style={{
          position: 'fixed',
          bottom: 'max(20px, env(safe-area-inset-bottom, 20px))',
          left: '20px',
          zIndex: 999,
        }}
      >
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="New to web design? Get quick help"
          className="group relative flex items-center gap-3 rounded-2xl py-2.5 px-3.5 sm:py-3 sm:px-4 bg-[#0d0d14]/95 backdrop-blur-md border border-amber-500/35 hover:border-amber-400 transition-all duration-300 shadow-xl shadow-black/60 hover:shadow-amber-500/15 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400/80 text-left active:scale-95"
        >
          {/* Subtle glowing ambient pulse */}
          <div className="absolute -inset-0.5 rounded-2xl bg-amber-500/20 blur-sm opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />

          {/* Lightbulb Icon Badge */}
          <div className="relative z-10 w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-110 transition-transform">
            <Lightbulb className="w-4 h-4 fill-amber-400/30 text-amber-400" />
          </div>

          {/* Text Stack */}
          <div className="relative z-10 flex flex-col leading-tight">
            <span className="font-mono font-bold text-xs text-amber-300 group-hover:text-amber-200 tracking-wide flex items-center gap-1">
              <span>💡 NEW TO WEB DESIGN?</span>
            </span>
            <span className="text-[11px] text-zinc-400 font-medium">
              Not sure what to choose?
            </span>
          </div>
        </button>
      </div>

      {/* FLOATING HELP POPOVER MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-[1001] flex items-end sm:items-center justify-start sm:p-6 p-4 animate-fadeIn">
          {/* Backdrop Overlay (Click outside to close) */}
          <div
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />

          {/* Popover Card Window */}
          <div
            ref={modalRef}
            className="relative z-10 w-full max-w-sm sm:max-w-md bg-[#0f0f16] border border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-black space-y-5 animate-scaleIn mb-16 sm:mb-0 sm:ml-4"
          >
            {/* Header with Title and Close X */}
            <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono font-bold uppercase">
                  <HelpCircle className="w-3 h-3" />
                  <span>CQ BEGINNER GUIDE</span>
                </div>
                <h3 className="font-display text-lg font-bold text-white tracking-tight">
                  Don't know much about websites?
                </h3>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-all cursor-pointer shrink-0"
                aria-label="Close help window"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-zinc-300 leading-relaxed">
              No worries! You don't need technical knowledge to customise a website with CQ.
            </p>

            {/* Examples Grid */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                JUST TELL US WHAT YOU WANT:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-2 text-xs text-zinc-200"
                  >
                    <span className="text-sm shrink-0">{ex.icon}</span>
                    <span className="font-medium line-clamp-1">{ex.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footnote */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-zinc-300 space-y-1">
              <span className="font-bold text-amber-400 block">Not sure?</span>
              <p className="text-[11px] text-zinc-300 leading-normal">
                Choose the option that feels closest to your idea. We'll help you figure out the rest.
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all duration-200 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>GOT IT →</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
