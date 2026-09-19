import React from 'react';
import { GlassCard } from './GlassCard';
import { Badge } from './Badge';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  highlight?: boolean;
  alert?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon,
  trend,
  trendUp,
  highlight = false,
  alert = false,
}) => {
  const glow = alert ? 'red' : highlight ? 'cyan' : 'none';

  return (
    <GlassCard glow={glow} className="p-4 sm:p-5 flex flex-col justify-between">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {icon && <div className="text-cyan-400 p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20">{icon}</div>}
          <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
            {label}
          </span>
        </div>
        <Badge variant="simulated" size="sm">SIMULATED DATA</Badge>
      </div>

      <div className="mt-2 flex items-baseline justify-between">
        <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-white">
          {value}
        </div>
        {trend && (
          <span
            className={`text-xs font-mono font-semibold px-1.5 py-0.5 rounded ${
              trendUp ? 'text-emerald-400 bg-emerald-950/40' : 'text-red-400 bg-red-950/40'
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      {subtext && (
        <div className="mt-2 text-xs text-slate-400 font-sans border-t border-slate-800/80 pt-2 flex items-center justify-between">
          <span>{subtext}</span>
          <span className="text-[10px] text-slate-500 font-mono">NODE: master-01</span>
        </div>
      )}
    </GlassCard>
  );
};
