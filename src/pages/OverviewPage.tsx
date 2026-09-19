import React from 'react';
import { useSecurity } from '../context/SecurityContext';
import { StatCard } from '../components/common/StatCard';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import {
  ShieldAlert,
  Activity,
  Layers,
  Zap,
  Clock,
  Radio,
  ExternalLink,
  ArrowRight,
  Play,
  ZapOff,
  Server,
} from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const {
    metrics,
    threats,
    protocols,
    startExploitSimulation,
    openWhyDetected,
    openCircuitBreakerConfirm,
    setCurrentPage,
  } = useSecurity();

  const criticalThreats = threats.filter((t) => t.severity === 'CRITICAL' || t.severity === 'HIGH').slice(0, 3);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono text-cyan-400 tracking-wider font-semibold">
              PRE-EXECUTION THREAT RADAR
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
            SENTINEL PROTOCOL
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-sans">
            Pre-Execution Threat Radar & Protocol Health Engine
          </p>
        </div>

        {/* Quick Exploit Simulation CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={startExploitSimulation}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-black font-mono text-xs font-black transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2 hover:scale-[1.02]"
          >
            <Play className="w-4 h-4 fill-black" />
            SIMULATE EXPLOIT
          </button>

          <button
            onClick={() => openCircuitBreakerConfirm()}
            className="px-3.5 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 text-red-300 font-mono text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <ZapOff className="w-4 h-4" />
            EMERGENCY PAUSE
          </button>
        </div>
      </div>

      {/* Top Status Bar as requested */}
      <div className="p-3 sm:p-4 rounded-xl bg-[#090F1C] border border-cyan-500/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="border-r border-slate-800/80 pr-2">
          <div className="text-slate-500 text-[10px] uppercase tracking-wider">AUTHORITY:</div>
          <div className="text-white font-bold mt-0.5 flex items-center gap-1">
            <Server className="w-3 h-3 text-cyan-400" />
            Main Security Node
          </div>
        </div>
        <div className="border-r border-slate-800/80 pr-2">
          <div className="text-slate-500 text-[10px] uppercase tracking-wider">NODE:</div>
          <div className="text-cyan-300 font-semibold mt-0.5">master-enclave-01</div>
        </div>
        <div className="border-r border-slate-800/80 pr-2">
          <div className="text-slate-500 text-[10px] uppercase tracking-wider">ENVIRONMENT:</div>
          <div className="text-amber-400 font-semibold mt-0.5 flex items-center gap-1">
            <Badge variant="simulated">DEMO / SIMULATION</Badge>
          </div>
        </div>
        <div>
          <div className="text-slate-500 text-[10px] uppercase tracking-wider">SYSTEM:</div>
          <div className="text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ONLINE
          </div>
        </div>
      </div>

      {/* 6 Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          label="TOTAL VALUE MONITORED"
          value={metrics.totalValueMonitored}
          subtext="6 protocols monitored"
          icon={<Layers className="w-4 h-4" />}
          highlight
        />
        <StatCard
          label="COLLATERAL AT RISK"
          value={metrics.collateralAtRisk}
          subtext="Flagged liquidity pools"
          icon={<ShieldAlert className="w-4 h-4" />}
          alert
        />
        <StatCard
          label="ACTIVE THREATS"
          value={metrics.activeThreats}
          subtext="Pending mempool vectors"
          icon={<Radio className="w-4 h-4" />}
        />
        <StatCard
          label="CRITICAL THREATS"
          value={metrics.criticalThreats}
          subtext="Intervention thresholds"
          icon={<Zap className="w-4 h-4" />}
          alert
        />
        <StatCard
          label="P99 DETECTION LATENCY"
          value={metrics.p99Latency}
          subtext="Pre-execution benchmark"
          icon={<Clock className="w-4 h-4" />}
        />
        <StatCard
          label="MEMPOOL THROUGHPUT"
          value={metrics.mempoolThroughput}
          subtext="Continuous telemetry"
          icon={<Activity className="w-4 h-4" />}
          highlight
        />
      </div>

      {/* Main Overview Grid: Active Threats & Systemic Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Pre-Execution Threat Interception Stream */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <h2 className="text-sm font-bold font-mono text-white tracking-wide uppercase">
                Active Pre-Execution Threats
              </h2>
            </div>
            <button
              onClick={() => setCurrentPage('mempool')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              VIEW ALL IN RADAR <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {criticalThreats.map((threat) => (
              <GlassCard
                key={threat.id}
                glow={threat.severity === 'CRITICAL' ? 'red' : 'none'}
                className="p-4 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="font-mono text-xs font-bold text-white tracking-wider">
                      {threat.id}
                    </span>
                    <span className="text-slate-500 font-mono text-xs">•</span>
                    <span className="font-bold text-sm text-cyan-300">{threat.protocol}</span>
                    <Badge severity={threat.severity}>{threat.severity}</Badge>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                    <span>{threat.chain}</span>
                    <span>•</span>
                    <span className="text-red-400 font-bold">LOSS: {threat.potentialLoss}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-200">{threat.type}</div>
                    <div className="font-mono text-slate-400 text-[11px] truncate max-w-md">
                      TX: {threat.txHash}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openWhyDetected(threat)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold transition-all shadow-sm"
                    >
                      WHY DETECTED?
                    </button>
                    <button
                      onClick={() => openCircuitBreakerConfirm(protocols.find((p) => p.name === threat.protocol))}
                      className="px-3 py-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/50 border border-red-500/40 text-red-300 font-mono text-xs font-bold transition-all"
                    >
                      PAUSE PROTOCOL
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Right Col: Systemic Health Index & Action Center */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold font-mono text-white tracking-wide uppercase">
              Systemic Health Index
            </h2>
          </div>

          <GlassCard glow="cyan" className="p-5 space-y-4">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-28 h-28 rounded-full border-4 border-cyan-400/40 bg-cyan-950/20 relative shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                <div className="text-center font-mono">
                  <div className="text-3xl font-black text-cyan-300">
                    {metrics.systemicHealthIndex}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase">/ 100 HEALTH</div>
                </div>
              </div>

              <div className="text-xs font-mono font-bold text-emerald-400 flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                SYSTEMIC EQUILIBRIUM STABLE
              </div>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                Aggregated composite score across collateral ratios, oracle deviations, and liquidity depths across all monitored protocols.
              </p>
            </div>

            {/* Quick Metrics Breakdown */}
            <div className="space-y-2 pt-3 border-t border-slate-800 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Liquidity Concentration:</span>
                <span className="text-cyan-300 font-bold">0.79 / 1.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Cross-Chain Bridge Sync:</span>
                <span className="text-emerald-400 font-bold">99.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Contagion Vulnerability:</span>
                <span className="text-amber-400 font-bold">MODERATE</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentPage('protocol-health')}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              EXPLORE PROTOCOL MATRIX <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
