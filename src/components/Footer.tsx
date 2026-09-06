import React from 'react';
import { Link } from 'react-router-dom';
import { IconGithub, IconInstagram, IconYoutube, IconTwitter } from './SocialIcons';
import { CQBrand } from './brand/CQBrand';
import { SOCIAL_LINKS } from '../config/socialLinks';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#050507] border-t border-white/10 pt-16 pb-12 mt-20 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-white/10">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            {/* Central CQ Brand Lockup: [ CQ MARK ] CORNICE & QUERY */}
            <CQBrand variant="footer" className="mb-2" />
            <p className="text-amber-400 font-mono text-sm tracking-wide">
              "Design it. Build it. Query it."
            </p>
            <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">
              The official resource platform for Cornice & Query builds featured on social media. Discover projects, watch them in action, explore code, and build them yourself.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-semibold">
              EXPLORE HUB
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-zinc-400 hover:text-amber-400 transition-colors">
                  Featured Builds
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-zinc-400 hover:text-amber-400 transition-colors">
                  Project Library
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-zinc-400 hover:text-amber-400 transition-colors">
                  Categories Breakdown
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-zinc-400 hover:text-amber-400 transition-colors">
                  About Platform
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Connections */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-semibold">
              SOCIAL CONNECT
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              Follow our reels and social posts to see new builds in development.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 text-zinc-300 hover:text-amber-400 transition-all group"
                aria-label="Visit Cornice & Query on Instagram"
                title="Visit Cornice & Query on Instagram"
              >
                <IconInstagram className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 text-zinc-300 hover:text-amber-400 transition-all"
                aria-label="Visit Cornice & Query on YouTube"
                title="Visit Cornice & Query on YouTube"
              >
                <IconYoutube className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 text-zinc-300 hover:text-amber-400 transition-all"
                aria-label="Twitter"
              >
                <IconTwitter className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 text-zinc-300 hover:text-amber-400 transition-all"
                aria-label="GitHub"
              >
                <IconGithub className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
          <p>© {new Date().getFullYear()} CORNICE & QUERY. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>WATCH. EXPLORE. BUILD.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
