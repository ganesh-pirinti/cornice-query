import { useState, useEffect, useRef } from 'react';

export interface ScrollState {
  scrollY: number;
  velocity: number;
  direction: 'up' | 'down' | 'idle';
}

export function useScrollVelocity(): ScrollState {
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollY: 0,
    velocity: 0,
    direction: 'idle',
  });

  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const deltaY = currentScrollY - lastScrollY.current;
      const deltaTime = Math.max(1, currentTime - lastTime.current);

      const rawVelocity = (deltaY / deltaTime) * 16.6; // normalized velocity
      const clampedVelocity = Math.min(100, Math.max(-100, Math.abs(rawVelocity)));

      setScrollState({
        scrollY: currentScrollY,
        velocity: clampedVelocity,
        direction: deltaY > 0 ? 'down' : deltaY < 0 ? 'up' : 'idle',
      });

      lastScrollY.current = currentScrollY;
      lastTime.current = currentTime;

      if (timeoutId.current) clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(() => {
        setScrollState((prev) => ({
          ...prev,
          velocity: 0,
          direction: 'idle',
        }));
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };
  }, []);

  return scrollState;
}
