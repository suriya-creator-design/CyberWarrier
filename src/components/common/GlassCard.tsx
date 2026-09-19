import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'none' | 'cyan' | 'red' | 'green' | 'purple';
  hover?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = 'none',
  hover = false,
  onClick,
}) => {
  const glowStyles = {
    none: 'border-slate-800/80 bg-slate-900/60 shadow-lg',
    cyan: 'border-cyan-500/30 bg-[#0A1322]/80 shadow-[0_0_20px_rgba(6,182,212,0.12)]',
    red: 'border-red-500/30 bg-[#190C12]/80 shadow-[0_0_20px_rgba(239,68,68,0.15)]',
    green: 'border-emerald-500/30 bg-[#0C1A14]/80 shadow-[0_0_20px_rgba(16,185,129,0.12)]',
    purple: 'border-purple-500/30 bg-[#140E24]/80 shadow-[0_0_20px_rgba(139,92,246,0.15)]',
  };

  const hoverStyles = hover
    ? 'transition-all duration-200 hover:border-cyan-500/50 hover:bg-slate-900/80 hover:translate-y-[-1px] cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl backdrop-blur-md border ${glowStyles[glow]} ${hoverStyles} ${className}`}
    >
      {/* Subtle top light edge */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent pointer-events-none" />
      {children}
    </div>
  );
};
