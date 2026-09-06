import React, { useState, useEffect, useRef } from 'react';
import { CQLoginScene } from './CQLoginScene';
import { SkipIntroButton } from './SkipIntroButton';

interface CQLoginRevealProps {
  children: React.ReactNode;
}

export const CQLoginReveal: React.FC<CQLoginRevealProps> = ({ children }) => {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [introState, setIntroState] = useState<'active' | 'skipped' | 'complete'>('active');
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSkippedRef = useRef<boolean>(false);
  const startTimeRef = useRef<number | null>(null);

  // Signal intro active state on mount, complete/unmount
  useEffect(() => {
    // Notify app that login intro is active
    window.dispatchEvent(new CustomEvent('cq_login_intro', { detail: { active: true } }));

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsReducedMotion(true);
      setIntroState('complete');
      setElapsedTime(13);
      window.dispatchEvent(new CustomEvent('cq_login_intro', { detail: { active: false } }));
      return;
    }

    let animationFrameId: number;

    const tick = (now: number) => {
      if (isSkippedRef.current) return;

      if (!startTimeRef.current) startTimeRef.current = now;
      const currentSeconds = (now - startTimeRef.current) / 1000;
      setElapsedTime(currentSeconds);

      if (currentSeconds >= 5.0 && introState === 'active') {
        setIntroState('complete');
        window.dispatchEvent(new CustomEvent('cq_login_intro', { detail: { active: false } }));
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      // Ensure CUSTOMISE button is restored when leaving login page
      window.dispatchEvent(new CustomEvent('cq_login_intro', { detail: { active: false } }));
    };
  }, []);

  const handleSkip = () => {
    isSkippedRef.current = true;
    setIntroState('skipped');
    setElapsedTime(13); // Fast-forward 3D scene

    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('cq_login_intro', { detail: { active: false } }));
    }, 300);
  };

  const revealProgress = isReducedMotion || introState !== 'active'
    ? 1
    : Math.min(1, Math.max(0, (elapsedTime - 1.2) / 2.0));

  const showSkipButton = !isReducedMotion && introState === 'active' && revealProgress < 0.8;

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* 1. Global 3D Petal & Atmosphere Canvas */}
      <CQLoginScene elapsedTime={elapsedTime} isReducedMotion={isReducedMotion} />

      {/* 2. Existing CQ Login UI Interface Container */}
      <div
        className="relative z-10 w-full transition-all duration-500 ease-out"
        style={{
          opacity: revealProgress,
          transform: `scale(${0.96 + revealProgress * 0.04})`,
          pointerEvents: revealProgress > 0.5 ? 'auto' : 'none',
        }}
      >
        {children}
      </div>

      {/* 3. Sleek Top-Right Skip Control */}
      <SkipIntroButton onSkip={handleSkip} isVisible={showSkipButton} />
    </div>
  );
};
