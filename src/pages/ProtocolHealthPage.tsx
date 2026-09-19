import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  TrendingDown,
  Lock,
  Zap,
} from 'lucide-react';

export const ProtocolHealthPage: React.FC = () => {
  const { protocols, metrics, openCircuitBreakerConfirm } = useSecurity();
  const [activeTab, setActiveTab] = useState<'matrix' | 'charts'>('matrix');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 tracking-wider font-semibold">
              SYSTEMIC RISK TELEMETRY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
            MULTI-DIMENSIONAL PROTOCOL HEALTH MATRIX
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-sans">
            Comprehensive solvency, oracle resilience, and dependency risk indices
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'matrix'
                ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            PROTOCOL CARDS
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'charts'
                ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            HEALTH CHARTS
          </button>
        </div>
      </div>

      {/* Systemic Health Index Hero & 7 Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Systemic Health Index Hero Card */}
        <GlassCard glow="cyan" className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              SYSTEMIC HEALTH INDEX
            </span>
            <Badge variant="simulated">SIMULATED</Badge>
          </div>

          <div className="my-4 text-center">
            <div className="text-5xl font-black font-mono text-cyan-300">
              {metrics.systemicHealthIndex}
              <span className="text-lg text-slate-500 font-normal"> / 100</span>
            </div>
            <div className="text-xs font-mono text-emerald-400 font-bold mt-1">
              ● EQUILIBRIUM NOMINAL
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-sans border-t border-slate-800/80 pt-2">
            Target SLA: 99.8% uptime across verified oracle and state feeds.
          </div>
        </GlassCard>

        {/* 6 Sub-Metrics Cards as requested */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div className="text-[11px] font-mono text-slate-400">Total Value Locked</div>
            <div className="text-xl font-bold font-mono text-white mt-1">$64.1B</div>
            <div className="text-[10px] text-emerald-400 font-mono mt-1">Across 6 Protocols</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div className="text-[11px] font-mono text-slate-400">Collateral At Risk</div>
            <div className="text-xl font-bold font-mono text-red-400 mt-1">$2.01B</div>
            <div className="text-[10px] text-red-400 font-mono mt-1">Flagged in Pools</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div className="text-[11px] font-mono text-slate-400">Liquidity Concentration</div>
            <div className="text-xl font-bold font-mono text-cyan-300 mt-1">0.79 / 1.0</div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">Normalized Index</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div className="text-[11px] font-mono text-slate-400">Cross-Chain Bridge Sync</div>
            <div className="text-xl font-bold font-mono text-emerald-300 mt-1">99.2%</div>
            <div className="text-[10px] text-emerald-400 font-mono mt-1">12-block Finality</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div className="text-[11px] font-mono text-slate-400">Governance Risk</div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">LOW</div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">Timelocks Active</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div className="text-[11px] font-mono text-slate-400">Dependency Risk</div>
            <div className="text-xl font-bold font-mono text-red-400 mt-1">HIGH</div>
            <div className="text-[10px] text-red-400 font-mono mt-1">Curve / Aave Correlated</div>
          </div>
        </div>
      </div>

      {/* Main Content: Protocol Cards or Charts */}
      {activeTab === 'matrix' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {protocols.map((proto) => (
            <GlassCard
              key={proto.id}
              glow={proto.healthScore < 75 ? 'red' : 'none'}
              className="p-5 space-y-4"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                    {proto.name}
                    {proto.isPaused && (
                      <span className="px-2 py-0.5 rounded bg-red-900/60 border border-red-500 text-red-300 text-[10px] font-black">
                        PAUSED
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">{proto.category} • {proto.chain}</p>
                </div>
                <div className="text-right font-mono">
                  <div className={`text-xl font-black ${proto.healthScore > 80 ? 'text-emerald-400' : proto.healthScore > 70 ? 'text-amber-400' : 'text-red-400'}`}>
                    {proto.healthScore}
                  </div>
                  <div className="text-[9px] text-slate-500">HEALTH</div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs font-mono">
                <div>
                  <div className="text-slate-500 text-[10px]">TVL</div>
                  <div className="font-bold text-slate-200 mt-0.5">{proto.tvl}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px]">COLLATERAL AT RISK</div>
                  <div className="font-bold text-red-400 mt-0.5">{proto.collateralAtRisk}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px]">CONCENTRATION</div>
                  <div className="font-bold text-cyan-300 mt-0.5">{proto.liquidityConcentration}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px]">BRIDGE SYNC</div>
                  <div className="font-bold text-emerald-400 mt-0.5">{proto.bridgeSync}%</div>
                </div>
              </div>

              {/* Risk Badges */}
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Governance Risk:</span>
                  <Badge severity={proto.governanceRisk}>{proto.governanceRisk}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Liquidity Risk:</span>
                  <Badge severity={proto.liquidityRisk}>{proto.liquidityRisk}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Dependency Risk:</span>
                  <Badge severity={proto.dependencyRisk}>{proto.dependencyRisk}</Badge>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  Incidents: <strong className="text-slate-300">{proto.activeIncidentsCount}</strong>
                </span>
                <button
                  onClick={() => openCircuitBreakerConfirm(proto)}
                  className="px-3 py-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/60 border border-red-500/40 text-red-300 font-mono text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Lock className="w-3 h-3" />
                  EMERGENCY PAUSE
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        /* Visual Charts View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Health Score by Protocol */}
          <GlassCard className="p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Health Score by Protocol (0 - 100)
            </h3>
            <div className="space-y-3 font-mono text-xs">
              {protocols.map((p) => (
                <div key={p.id} className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>{p.name}</span>
                    <span className="font-bold">{p.healthScore} / 100</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        p.healthScore > 80
                          ? 'bg-emerald-400'
                          : p.healthScore > 70
                          ? 'bg-cyan-400'
                          : 'bg-red-400'
                      }`}
                      style={{ width: `${p.healthScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Chart 2: Collateral At Risk by Protocol */}
          <GlassCard className="p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
              Collateral At Risk by Protocol ($ Millions)
            </h3>
            <div className="space-y-3 font-mono text-xs">
              {protocols.map((p) => {
                const percentOfMax = Math.round((p.collateralAtRiskNumeric / 600) * 100);
                return (
                  <div key={p.id} className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>{p.name}</span>
                      <span className="font-bold text-red-400">{p.collateralAtRisk}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                        style={{ width: `${percentOfMax}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Chart 3: Liquidity Concentration */}
          <GlassCard className="p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              Liquidity Concentration (Gini / Top 3 Pool Ratio)
            </h3>
            <div className="space-y-3 font-mono text-xs">
              {protocols.map((p) => (
                <div key={p.id} className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>{p.name}</span>
                    <span className="font-bold text-amber-300">{p.liquidityConcentration}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 transition-all duration-500"
                      style={{ width: `${p.liquidityConcentration * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Chart 4: Risk Trend Over Time (Simulated Wave) */}
          <GlassCard className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Systemic Risk Trend (24h Window)
              </h3>
              <Badge variant="simulated">SIMULATED TREND</Badge>
            </div>
            <div className="h-44 flex items-end gap-2 pt-4 px-2">
              {[42, 45, 50, 48, 55, 62, 70, 78, 85, 94, 88, 82].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="text-[9px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {val}
                  </div>
                  <div
                    className={`w-full rounded-t transition-all ${
                      val > 80 ? 'bg-red-500/80 group-hover:bg-red-400' : 'bg-cyan-500/60 group-hover:bg-cyan-400'
                    }`}
                    style={{ height: `${val}%` }}
                  />
                  <div className="text-[9px] font-mono text-slate-600">
                    {idx * 2}h
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
