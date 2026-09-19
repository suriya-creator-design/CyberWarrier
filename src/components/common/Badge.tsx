import React from 'react';
import { SeverityLevel } from '../../types';

interface BadgeProps {
  severity?: SeverityLevel;
  children: React.ReactNode;
  variant?: 'severity' | 'status' | 'simulated' | 'outline' | 'pulse';
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  severity,
  children,
  variant = 'severity',
  className = '',
  size = 'sm',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  if (variant === 'simulated') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-mono uppercase tracking-wider rounded border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 ${sizeClasses} ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
        {children}
      </span>
    );
  }

  if (variant === 'pulse') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 ${sizeClasses} ${className}`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        {children}
      </span>
    );
  }

  // Severity color mapping
  const severityStyles: Record<SeverityLevel, string> = {
    CRITICAL: 'border-red-500/40 bg-red-950/50 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.2)]',
    HIGH: 'border-orange-500/40 bg-orange-950/50 text-orange-300 shadow-[0_0_10px_rgba(245,158,11,0.15)]',
    MEDIUM: 'border-amber-500/30 bg-amber-950/40 text-amber-300',
    LOW: 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300',
  };

  const currentStyle = severity ? severityStyles[severity] : 'border-slate-700 bg-slate-800 text-slate-300';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded font-mono font-medium border ${sizeClasses} ${currentStyle} ${className}`}
    >
      {children}
    </span>
  );
};
