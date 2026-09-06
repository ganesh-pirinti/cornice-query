import React from 'react';

export interface CQLogoProps {
  variant?: 'mark' | 'full' | 'header' | 'footer' | string;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
  onClick?: () => void;
}

export const CQLogo: React.FC<CQLogoProps> = ({
  className = '',
  style,
  alt = 'Cornice & Query Mark',
  onClick,
}) => {
  const logoSrc = '/assets/cq-logo.png';

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-[#08080c]/60 border border-amber-500/20 shadow-md ${className}`}
      style={style}
    >
      <img
        src={logoSrc}
        alt={alt}
        className="w-[145%] h-[145%] max-w-none object-cover -translate-y-[8%] select-none pointer-events-none filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.25)]"
      />
    </div>
  );
};
