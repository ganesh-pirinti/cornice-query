import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { trackEvent } from '../../services/analyticsService';

interface EmberParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

export const FloatingCustomiseButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const embersRef = useRef<EmberParticle[]>([]);

  const [isCompact, setIsCompact] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isLoginIntroActive, setIsLoginIntroActive] = useState(false);

  // Listen for login intro state changes
  useEffect(() => {
    const handleIntroChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ active: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.active === 'boolean') {
        setIsLoginIntroActive(customEvent.detail.active);
      }
    };

    window.addEventListener('cq_login_intro', handleIntroChange);
    return () => {
      window.removeEventListener('cq_login_intro', handleIntroChange);
    };
  }, []);

  // Scroll Compact Morphing
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 100 && currentScrollY > lastScrollY + 5) {
        setIsCompact(true);
      } else if (currentScrollY < lastScrollY - 5 || currentScrollY < 100) {
        setIsCompact(false);
      }

      setLastScrollY(currentScrollY);

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsCompact(false);
      }, 1200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [lastScrollY]);

  // Dragon Ember Particle Canvas Engine
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const colors = ['#FFE81A', '#FFC700', '#F59E0B', '#EA580C'];

    const resizeCanvas = () => {
      if (!buttonRef.current || !canvas) return;
      const rect = buttonRef.current.getBoundingClientRect();
      canvas.width = rect.width + 40;
      canvas.height = rect.height + 60;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    const render = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const targetCount = isHovered ? 12 : 6;

      if (embersRef.current.length < targetCount && Math.random() < (isHovered ? 0.35 : 0.15)) {
        embersRef.current.push({
          x: 20 + Math.random() * (canvas.width - 40),
          y: canvas.height - 25 + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 0.6,
          vy: -0.6 - Math.random() * 0.8,
          size: 1.5 + Math.random() * 2.5,
          alpha: 0.7 + Math.random() * 0.3,
          decay: 0.015 + Math.random() * 0.015,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }

      for (let i = embersRef.current.length - 1; i >= 0; i--) {
        const p = embersRef.current[i];
        p.x += p.vx + Math.sin(p.y * 0.05) * 0.2;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y < 0) {
          embersRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFE81A';
        ctx.globalAlpha = p.alpha * 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const pullX = (e.clientX - centerX) * 0.15;
    const pullY = (e.clientY - centerY) * 0.15;

    setMagneticOffset({ x: pullX, y: pullY });
  };

  const handleMouseLeave = () => {
    setMagneticOffset({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const isLoginPage = location.pathname === '/login' || location.pathname === '/signup';
  const isCustomisePage = location.pathname === '/customise';

  // Completely hide CUSTOMISE button while login intro is active
  if (isLoginPage && isLoginIntroActive) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    if (canvasRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left + 20;
      const clickY = e.clientY - rect.top + 30;

      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        const speed = 1.5 + Math.random() * 1.5;
        embersRef.current.push({
          x: clickX,
          y: clickY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          size: 2.0 + Math.random() * 2.0,
          alpha: 1.0,
          decay: 0.03 + Math.random() * 0.02,
          color: i % 2 === 0 ? '#FFE81A' : '#EA580C',
        });
      }
    }

    trackEvent('customise_clicked');
    navigate('/customise');
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'max(16px, env(safe-area-inset-bottom, 16px))',
        right: '16px',
        zIndex: 999,
        transform: `translate(${magneticOffset.x}px, ${magneticOffset.y}px)`,
        transition: magneticOffset.x === 0 ? 'transform 0.4s ease-out' : 'transform 0.1s ease-out',
      }}
      className="sm:!bottom-[20px] sm:!right-[20px] md:!bottom-[24px] md:!right-[24px] pointer-events-auto"
    >
      {/* Floating Ember Particle Overlay Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute -top-[30px] -left-[20px] pointer-events-none z-0"
        style={{ width: 'calc(100% + 40px)', height: 'calc(100% + 60px)' }}
      />

      <button
        ref={buttonRef}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        aria-label="Customise your website with Cornice & Query"
        className={`group relative flex items-center gap-3 rounded-2xl transition-all duration-300 shadow-2xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400/80 overflow-hidden ${
          isCustomisePage
            ? 'scale-105 py-3.5 px-6'
            : 'hover:-translate-y-1 active:scale-95 py-3.5 px-5 sm:px-6'
        }`}
        style={{
          background: 'linear-gradient(135deg, #FFE81A 0%, #FFC700 35%, #F59E0B 75%, #D97706 100%)',
          boxShadow: isHovered
            ? '0 0 25px rgba(255, 232, 26, 0.8), 0 0 45px rgba(245, 158, 11, 0.6), 0 -6px 16px rgba(234, 88, 12, 0.7)'
            : '0 0 16px rgba(255, 232, 26, 0.5), 0 0 30px rgba(245, 158, 11, 0.35), 0 -3px 10px rgba(234, 88, 12, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
        }}
      >
        {/* Animated Outer Dragon Flame Border Layer */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 opacity-40 blur-sm group-hover:opacity-75 transition-opacity duration-300 pointer-events-none" />

        {/* Molten Shimmer Light Sweep Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.6)_50%,transparent_80%)] -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

        {/* Spark / Flame Icon */}
        <div className="relative z-10 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
        </div>

        {/* Label Text — DRAGON FLAME YELLOW Theme with Dark Crisp Contrast */}
        <span
          className={`relative z-10 font-mono font-black text-xs sm:text-sm tracking-wider uppercase whitespace-nowrap text-slate-950 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] transition-all duration-300 ${
            isCompact ? 'hidden sm:inline-block' : 'inline-block'
          }`}
        >
          CUSTOMISE <span className="font-serif text-slate-950">✦</span>
        </span>

        {/* Hover Arrow */}
        <ArrowRight
          className={`relative z-10 w-4 h-4 text-slate-950 transition-transform duration-300 group-hover:translate-x-1 ${
            isCompact ? 'hidden sm:block' : 'block'
          }`}
        />
      </button>
    </div>
  );
};
