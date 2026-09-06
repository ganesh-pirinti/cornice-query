import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getVisitorCount, formatVisitorCount } from '../../services/visitorService';
import { InteractiveCard3D } from '../3d/InteractiveCard3D';

export const CustomiseSection: React.FC = () => {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    getVisitorCount().then((count) => setVisitorCount(count));
  }, []);

  return (
    <section className="w-full py-12">
      <InteractiveCard3D depth={10}>
        <div className="relative rounded-3xl bg-gradient-to-r from-[#141420] via-[#0e0e14] to-[#070709] border border-amber-500/30 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            {/* Real Visitor Count Badge replacing the previous BESPOKE DEVELOPMENT badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
              <span className="text-amber-400 font-serif">✦</span>
              <span>{visitorCount !== null ? `${formatVisitorCount(visitorCount)} CQ VISITORS` : '0 CQ VISITORS'}</span>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                BUILD SOMETHING THAT'S YOURS.
              </h2>
              <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed">
                Need a custom design, animation, portfolio, or full-stack web app built for your project?
                Cornice & Query creates bespoke frontend/web solutions tailored to your exact specifications.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/customise"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm tracking-wider uppercase transition-all duration-200 shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95"
              >
                <span>CUSTOMISE YOUR BUILD ✦</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </InteractiveCard3D>
    </section>
  );
};
