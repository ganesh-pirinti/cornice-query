import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, LogOut, LayoutDashboard, Layers, Sparkles } from 'lucide-react';
import { IconGithub } from './SocialIcons';
import { useAuth } from '../context/AuthContext';
import { CQBrand } from './brand/CQBrand';

interface NavbarProps {
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const { user: currentUser, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const prevPointsRef = useRef<number | null>(currentUser?.points ?? null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync user state pulse when points change
  useEffect(() => {
    if (currentUser && prevPointsRef.current !== null && currentUser.points !== prevPointsRef.current) {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 450);
    }
    prevPointsRef.current = currentUser?.points ?? null;
  }, [currentUser]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Categories', path: '/categories' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = async () => {
    await signOut();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#070709]/85 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl shadow-black/50'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Official Central CQ Brand Lockup: [ CQ MARK ] CORNICE & QUERY */}
          <Link to="/" className="flex items-center shrink-0" aria-label="Cornice & Query Home">
            <CQBrand variant="header" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 relative ${
                    active
                      ? 'text-slate-950 font-semibold bg-gradient-to-r from-orange-500 to-amber-500 shadow-md shadow-orange-500/20'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions, Boost Points Indicator & Auth Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-orange-400 transition-all duration-200 flex items-center gap-2 px-3.5 text-xs font-mono cursor-pointer"
              aria-label="Search projects"
            >
              <Search className="w-4 h-4 text-orange-400" />
              <span className="hidden sm:inline text-zinc-400">Search builds...</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] bg-white/10 rounded text-zinc-400 font-mono">
                ⌘K
              </kbd>
            </button>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-all duration-200"
              aria-label="GitHub Repository"
            >
              <IconGithub className="w-4 h-4" />
            </a>

            {/* DEDICATED COMPACT BOOST POINTS HEADER INDICATOR (AUTHENTICATED ONLY) */}
            {currentUser && (
              <Link
                to="/dashboard/referrals"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono font-bold transition-all duration-300 cursor-pointer ${
                  isPulsing ? 'scale-110 border-amber-400 bg-amber-500/30 text-amber-200 shadow-md shadow-amber-500/30' : ''
                } ${
                  currentUser.points >= 100
                    ? 'bg-amber-500/15 border-amber-400/60 text-amber-300 hover:bg-amber-500/25 shadow-sm shadow-amber-500/20'
                    : 'bg-white/5 border-white/15 text-zinc-200 hover:bg-white/10'
                }`}
                title={`Verified Database Points: ${currentUser.points} Boost Points. ${
                  currentUser.points >= 100 ? '40% Customisation Discount Unlocked!' : 'Earn 100 points for 40% discount'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-extrabold text-amber-300 tracking-tight">{currentUser.points}</span>
                <span className="hidden sm:inline text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                  {currentUser.points === 1 ? 'POINT' : 'BOOST'}
                </span>
              </Link>
            )}

            {/* User Profile / Account Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono text-white transition-all cursor-pointer"
                >
                  <User className="w-4 h-4 text-orange-400" />
                  <span className="hidden sm:inline font-bold line-clamp-1 max-w-[90px]">
                    {currentUser.display_name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#0e0e14] border border-white/15 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn space-y-1">
                    <div className="px-3 py-2 border-b border-white/10">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">LOGGED IN AS</span>
                      <span className="text-xs font-bold text-white line-clamp-1">{currentUser.email}</span>
                      <span className="text-[10px] font-mono text-amber-400 font-bold block mt-0.5">
                        ✦ {currentUser.points} BOOST POINTS
                      </span>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-orange-400" />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      to="/dashboard/customisations"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <Layers className="w-4 h-4 text-orange-400" />
                      <span>My Customisations</span>
                    </Link>

                    <Link
                      to="/dashboard/referrals"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-orange-400" />
                      <span>Boost Points ({currentUser.points} Pts)</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors text-left cursor-pointer border-t border-white/10 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-mono font-bold text-xs hover:scale-105 transition-all shadow-md shadow-orange-500/20"
              >
                LOGIN
              </Link>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0a0a0e]/95 backdrop-blur-2xl px-6 py-6 transition-all animate-fadeIn">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    active
                      ? 'bg-orange-500 text-slate-950 font-bold'
                      : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenSearch) onOpenSearch();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-orange-400 font-mono text-sm font-medium border border-white/10"
              >
                <Search className="w-4 h-4" />
                Search All Projects
              </button>
              {currentUser ? (
                <>
                  <Link
                    to="/dashboard/referrals"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-300 font-mono text-xs font-bold"
                  >
                    <span>✦ BOOST POINTS BALANCE</span>
                    <span className="text-amber-400 font-extrabold text-sm">{currentUser.points} PTS</span>
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-500 text-slate-950 font-mono text-sm font-bold"
                  >
                    Dashboard ({currentUser.display_name})
                  </Link>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-500 text-slate-950 font-mono text-sm font-bold"
                >
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
