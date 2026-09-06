import React, { useEffect, useRef } from 'react';

interface BubbleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxAlpha: number;
  life: number; // 0 (start) to 1 (expired)
  decay: number;
  wobbleSpeed: number;
  wobbleOffset: number;
}

export const CursorBloom: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePos = useRef({ x: -200, y: -200 });
  const prevMousePos = useRef({ x: -200, y: -200 });
  const bubblesRef = useRef<BubbleParticle[]>([]);
  const isTouchDevice = useRef(false);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    // 1. Check for Mobile / Touch Device
    if (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window) {
      isTouchDevice.current = true;
      return;
    }

    // 2. Check for Reduced Motion Preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      prefersReducedMotion.current = true;
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // 3. Mouse Movement Listener
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    // 4. Click Listener (Spawns 3-4 extra tiny spreading bubbles)
    const handleMouseDown = (e: MouseEvent) => {
      const clickCount = 3 + Math.floor(Math.random() * 2); // 3-4 bubbles
      for (let i = 0; i < clickCount; i++) {
        const angle = (Math.PI * 2 * i) / clickCount + (Math.random() - 0.5) * 0.5;
        const speed = 0.8 + Math.random() * 1.2;
        bubblesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.3,
          size: 4 + Math.random() * 6, // Small sizes 4px-10px
          maxAlpha: 0.35 + Math.random() * 0.15,
          life: 0,
          decay: 0.025 + Math.random() * 0.015,
          wobbleSpeed: 4 + Math.random() * 4,
          wobbleOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });

    // 5. Render & Physical Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const dx = mousePos.current.x - prevMousePos.current.x;
      const dy = mousePos.current.y - prevMousePos.current.y;
      const speed = Math.hypot(dx, dy);

      // Emit new floating bubbles ONLY when cursor is actually moving
      if (speed > 1.2 && prevMousePos.current.x > 0) {
        const spawnProbability = Math.min(0.8, speed * 0.04);
        if (Math.random() < spawnProbability && bubblesRef.current.length < 10) {
          bubblesRef.current.push({
            x: mousePos.current.x + (Math.random() - 0.5) * 14,
            y: mousePos.current.y + (Math.random() - 0.5) * 14,
            vx: -dx * 0.06 + (Math.random() - 0.5) * 0.4,
            vy: -dy * 0.06 - 0.4 - Math.random() * 0.5, // Natural buoyancy upwards & backwards
            size: 5 + Math.random() * 9, // 5px to 14px
            maxAlpha: 0.25 + Math.random() * 0.2,
            life: 0,
            decay: 0.018 + Math.random() * 0.015,
            wobbleSpeed: 3 + Math.random() * 3,
            wobbleOffset: Math.random() * Math.PI * 2,
          });
        }
      }

      prevMousePos.current = { x: mousePos.current.x, y: mousePos.current.y };

      // Physics Update and Draw Loop for Active Bubbles
      for (let i = bubblesRef.current.length - 1; i >= 0; i--) {
        const b = bubblesRef.current[i];

        // Organic Physics update
        b.x += b.vx + Math.sin(b.life * b.wobbleSpeed + b.wobbleOffset) * 0.25;
        b.y += b.vy;
        b.vx *= 0.96; // Damping
        b.vy *= 0.96;
        b.vy -= 0.02; // Soft upward drift
        b.life += b.decay;

        const currentAlpha = Math.max(0, b.maxAlpha * (1 - b.life));

        if (b.life >= 1 || currentAlpha <= 0.005) {
          bubblesRef.current.splice(i, 1);
          continue;
        }

        // Draw Translucent CQ Orange/Gold Glass Soap-Bubble
        ctx.save();

        // Soft Translucent Fill
        ctx.fillStyle = `rgba(255, 120, 20, ${currentAlpha * 0.25})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fill();

        // Delicate Outer Glass Border
        ctx.strokeStyle = `rgba(255, 160, 50, ${currentAlpha * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Tiny Specular Light Reflection Highlight (top-left)
        const highlightRadius = Math.max(1, b.size * 0.2);
        const highlightX = b.x - b.size * 0.3;
        const highlightY = b.y - b.size * 0.3;

        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(highlightX, highlightY, highlightRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden"
    />
  );
};
