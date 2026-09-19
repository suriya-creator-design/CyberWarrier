import React, { useState, useEffect } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import {
  Radar,
  Search,
  Play,
  Radio,
  Zap,
  ShieldAlert,
  Info,
  Code,
} from 'lucide-react';

export const MempoolRadarPage: React.FC = () => {
  const {
    threats,
    startExploitSimulation,
    openWhyDetected,
    openCircuitBreakerConfirm,
    openEvmTrace,
    protocols,
  } = useSecurity();

  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLiveSimulating, setIsLiveSimulating] = useState<boolean>(true);
  const [liveTxCounter, setLiveTxCounter] = useState<number>(142);

  // Periodic synthetic tick for live simulation indicator
  useEffect(() => {
    if (!isLiveSimulating) return;
    const interval = setInterval(() => {
      setLiveTxCounter((c) => c + Math.floor(Math.random() * 3) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [isLiveSimulating]);

  const filteredThreats = threats.filter((threat) => {
    const matchesSeverity =
      filterSeverity === 'ALL' || threat.severity === filterSeverity;
    const matchesSearch =
      threat.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.protocol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.chain.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radar className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-xs font-mono text-cyan-400 tracking-wider font-semibold">
              PRE-EXECUTION INGRESS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
            MEMPOOL RADAR
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-sans">
            Pre-Execution Suspicious Transaction Detection & Anomaly Classification
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Live Simulation Toggle */}
          <button
            onClick={() => setIsLiveSimulating(!isLiveSimulating)}
            className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 border ${
              isLiveSimulating
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isLiveSimulating ? 'text-emerald-400 animate-pulse' : ''}`} />
            {isLiveSimulating ? 'LIVE SIMULATION: ACTIVE' : 'SIMULATION PAUSED'}
          </button>

          {/* Simulate Exploit Button */}
          <button
            onClick={startExploitSimulation}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-mono text-xs font-black transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-black" />
            SIMULATE EXPLOIT
          </button>
        </div>
      </div>

      {/* Real-time Telemetry Strip */}
      <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">INGRESS STATUS:</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LISTENING (BLOCK INTERVAL 12.1s)
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>TX INTERCEPTED: <strong className="text-white">{liveTxCounter}</strong></span>
          <span>•</span>
          <span>PRE-EXECUTION PARSER: <strong className="text-cyan-300">SANDBOX V2.1</strong></span>
          <span>•</span>
          <Badge variant="simulated">SYNTHETIC PAYLOADS</Badge>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Severity Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => {
            const isActive = filterSeverity === sev;
            return (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                {sev}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search transaction, protocol or threat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
        </div>
      </div>

      {/* Threats Table / Cards List */}
      {filteredThreats.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 font-mono text-xs space-y-2">
          <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto" />
          <div>NO PENDING THREATS MATCHING CRITERIA</div>
          <p className="text-slate-500 font-sans text-xs">
            Try adjusting your severity filter or search query.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredThreats.map((threat) => (
            <GlassCard
              key={threat.id}
              glow={threat.severity === 'CRITICAL' ? 'red' : threat.severity === 'HIGH' ? 'purple' : 'none'}
              className="p-4 sm:p-5"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left Column: Target & Type */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-white tracking-wider bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                      {threat.id}
                    </span>
                    <span className="text-sm font-bold text-cyan-300 font-sans">
                      {threat.protocol}
                    </span>
                    <span className="text-slate-500 font-mono text-xs">•</span>
                    <span className="text-xs text-slate-300 font-mono">{threat.chain}</span>
                    <Badge severity={threat.severity}>{threat.severity}</Badge>
                    <Badge variant="simulated">{threat.status}</Badge>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white font-sans">{threat.type}</h3>
                    <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mt-1 flex-wrap">
                      <span>TX: <code className="text-cyan-400/90">{threat.txHash}</code></span>
                      <span>•</span>
                      <span>Latency: <strong className="text-white">{threat.latencyMs}ms</strong></span>
                    </div>
                  </div>
                </div>

                {/* Center Column: Risk & Potential Loss */}
                <div className="flex items-center gap-6 lg:border-x border-slate-800 lg:px-6 shrink-0">
                  <div className="text-center font-mono">
                    <div className="text-2xl font-black text-red-400">
                      {threat.riskScore} <span className="text-xs text-slate-500 font-normal">/100</span>
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase">RISK SCORE</div>
                  </div>

                  <div className="text-center font-mono">
                    <div className="text-xl font-bold text-red-300">
                      {threat.potentialLoss}
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase">POTENTIAL LOSS</div>
                  </div>
                </div>

                {/* Right Column: Interactive Buttons */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  {/* EVM Trace Button */}
                  <button
                    onClick={() => openEvmTrace(threat)}
                    className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 hover:border-cyan-500/40 text-slate-300 hover:text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5"
                    title="Inspect Storage Slot Diffs & Opcode Trace"
                  >
                    <Code className="w-3.5 h-3.5 text-cyan-400" />
                    EVM TRACE
                  </button>

                  {/* Why Detected Button */}
                  <button
                    onClick={() => openWhyDetected(threat)}
                    className="px-3 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold transition-all shadow-[0_0_10px_rgba(6,182,212,0.15)] flex items-center gap-1.5"
                  >
                    <Info className="w-3.5 h-3.5" />
                    WHY DETECTED?
                  </button>

                  {/* Guardian Pause Button */}
                  <button
                    onClick={() =>
                      openCircuitBreakerConfirm(
                        protocols.find((p) => p.name === threat.protocol)
                      )
                    }
                    className="px-3 py-2 rounded-xl bg-red-950/50 hover:bg-red-900/60 border border-red-500/40 text-red-300 font-mono text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    GUARDIAN PAUSE
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
