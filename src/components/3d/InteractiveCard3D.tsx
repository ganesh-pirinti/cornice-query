import React, { useState, useRef } from 'react';

interface InteractiveCard3DProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
}

export const InteractiveCard3D: React.FC<InteractiveCard3DProps> = ({
  children,
  className = '',
  depth = 6,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -depth;
    const rotateY = ((x - centerX) / centerX) * depth;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.01)`
    );
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: isHovered ? 'transform 0.12s cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`relative ${isHovered ? 'will-change-transform' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
