import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { CONTAGION_NODES, CONTAGION_EDGES } from '../data/contagion';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { Network, Play, AlertTriangle, ArrowDown, ShieldAlert, Info, Layers } from 'lucide-react';
import { ContagionNode } from '../types';

export const ContagionMapPage: React.FC = () => {
  const {
    isCascadeSimulating,
    cascadeStep,
    cascadeAffectedCount,
    triggerCascadeSimulation,
  } = useSecurity();

  const [selectedNode, setSelectedNode] = useState<ContagionNode | null>(CONTAGION_NODES[0]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Network className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 tracking-wider font-semibold">
              DEPENDENCY TOPOLOGY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
            CROSS-PROTOCOL CONTAGION MAP
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-sans">
            Inter-protocol liquidity dependencies & systemic cascading failure modeling
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={triggerCascadeSimulation}
          disabled={isCascadeSimulating}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 hover:from-red-500 hover:to-orange-500 text-white font-mono text-xs font-black transition-all shadow-[0_0_25px_rgba(239,68,68,0.4)] flex items-center gap-2 disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-white" />
          {isCascadeSimulating ? 'SIMULATING CASCADE...' : 'SIMULATE CASCADE'}
        </button>
      </div>

      {/* Main Grid: Interactive Canvas & Cascade Status Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network Visualization (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="relative rounded-2xl bg-[#080E1C] border border-cyan-500/20 overflow-hidden shadow-2xl h-[520px] p-4 flex flex-col justify-between">
            {/* Background Grid & Radar Sweep */}
            <div className="absolute inset-0 cyber-dots-bg opacity-30 pointer-events-none" />

            {/* SVG Connecting Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="edge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity="0.6" />
                </linearGradient>
              </defs>

              {CONTAGION_EDGES.map((edge, idx) => {
                const sourceNode = CONTAGION_NODES.find((n) => n.id === edge.from);
                const targetNode = CONTAGION_NODES.find((n) => n.id === edge.to);
                if (!sourceNode || !targetNode) return null;

                const isEdgeInCascade =
                  (cascadeStep >= 1 && edge.from === 'aave' && edge.to === 'curve') ||
                  (cascadeStep >= 2 && edge.from === 'curve' && edge.to === 'compound');

                return (
                  <g key={idx}>
                    <line
                      x1={`${sourceNode.x}%`}
                      y1={`${sourceNode.y}%`}
                      x2={`${targetNode.x}%`}
                      y2={`${targetNode.y}%`}
                      stroke={isEdgeInCascade ? '#EF4444' : '#0284C7'}
                      strokeWidth={isEdgeInCascade ? 3.5 : 1.5}
                      strokeDasharray={isEdgeInCascade ? '6,6' : 'none'}
                      className={isEdgeInCascade ? 'animate-pulse' : 'opacity-40'}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Render Protocol Nodes */}
            {CONTAGION_NODES.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isCascadingNode =
                (cascadeStep >= 1 && node.id === 'aave') ||
                (cascadeStep >= 2 && node.id === 'curve') ||
                (cascadeStep >= 3 && node.id === 'compound');

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-10 ${
                    isSelected ? 'scale-110' : 'hover:scale-105'
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl border backdrop-blur-md font-mono text-xs transition-all ${
                      isCascadingNode
                        ? 'border-red-500 bg-red-950/80 text-red-200 shadow-[0_0_25px_rgba(239,68,68,0.7)] animate-bounce'
                        : isSelected
                        ? 'border-cyan-400 bg-slate-900/95 text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                        : 'border-slate-800 bg-slate-950/85 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          node.risk === 'CRITICAL'
                            ? 'bg-red-500 animate-ping'
                            : node.risk === 'HIGH'
                            ? 'bg-orange-500'
                            : 'bg-emerald-400'
                        }`}
                      />
                      <span>{node.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      TVL: <strong className="text-white">{node.tvl}</strong>
                    </div>
                    <div className="text-[10px] mt-0.5">
                      Risk: <strong className={node.risk === 'CRITICAL' ? 'text-red-400' : 'text-amber-400'}>{node.risk}</strong>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Top legend */}
            <div className="relative z-20 flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> CRITICAL
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-orange-500" /> HIGH
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> MEDIUM / LOW
                </span>
              </div>
              <Badge variant="simulated">TOPOLOGY GRAPH</Badge>
            </div>

            {/* Bottom hint */}
            <div className="relative z-20 text-[11px] font-mono text-slate-500">
              Click any node to inspect collateral exposures and pool dependencies.
            </div>
          </div>
        </div>

        {/* Right Column: Node Details & Cascade Simulation Outcome */}
        <div className="space-y-4">
          {/* Selected Node Details */}
          {selectedNode && (
            <GlassCard glow="cyan" className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  NODE SPECIFICATIONS
                </span>
                <Badge severity={selectedNode.risk}>{selectedNode.risk}</Badge>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white font-mono">{selectedNode.name}</h3>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  Type: {selectedNode.type} • TVL: <span className="text-cyan-300 font-bold">{selectedNode.tvl}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-xs font-mono space-y-1.5">
                <div className="text-slate-400 font-semibold">Direct Dependencies:</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.dependencies.map((dep, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 text-[11px]"
                    >
                      {dep}
                    </span>
                  ))}
                </div>
              </div>
            </GlassCard>
          )}

          {/* Simulated Cascade Summary Box */}
          <GlassCard
            glow={isCascadeSimulating || cascadeStep > 0 ? 'red' : 'none'}
            className="p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  SIMULATED CASCADE
                </span>
              </div>
              <Badge variant="simulated">DEMO CASCADE</Badge>
            </div>

            {/* Cascade Flow Stepper */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 font-mono text-xs">
              <div
                className={`p-2 rounded flex items-center justify-between ${
                  cascadeStep >= 1 ? 'bg-red-950/60 border border-red-500/40 text-red-200' : 'text-slate-500'
                }`}
              >
                <span>1. AAVE V3 (ORIGIN VECTOR)</span>
                {cascadeStep >= 1 && <span className="text-[10px] font-bold">TRIGGERED</span>}
              </div>
              <div className="flex justify-center -my-1 text-slate-600">
                <ArrowDown className="w-3 h-3" />
              </div>
              <div
                className={`p-2 rounded flex items-center justify-between ${
                  cascadeStep >= 2 ? 'bg-red-950/60 border border-red-500/40 text-red-200' : 'text-slate-500'
                }`}
              >
                <span>2. CURVE (COLLATERAL SKEW)</span>
                {cascadeStep >= 2 && <span className="text-[10px] font-bold">INFECTED</span>}
              </div>
              <div className="flex justify-center -my-1 text-slate-600">
                <ArrowDown className="w-3 h-3" />
              </div>
              <div
                className={`p-2 rounded flex items-center justify-between ${
                  cascadeStep >= 3 ? 'bg-red-950/60 border border-red-500/40 text-red-200' : 'text-slate-500'
                }`}
              >
                <span>3. COMPOUND (LIQUIDITY DRAIN)</span>
                {cascadeStep >= 3 && <span className="text-[10px] font-bold">CONTAMINATED</span>}
              </div>
              <div className="flex justify-center -my-1 text-slate-600">
                <ArrowDown className="w-3 h-3" />
              </div>
              <div
                className={`p-2 rounded flex items-center justify-between ${
                  cascadeStep >= 4 ? 'bg-amber-950/60 border border-amber-500/40 text-amber-200' : 'text-slate-500'
                }`}
              >
                <span>4. SYSTEMIC LIQUIDITY IMPACT</span>
                {cascadeStep >= 4 && <span className="text-[10px] font-bold">CONTAINED</span>}
              </div>
            </div>

            {/* Cascade Metrics as requested */}
            <div className="space-y-2 text-xs font-mono pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Potentially affected protocols:</span>
                <span className="text-white font-bold">{cascadeAffectedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Risk propagation:</span>
                <span className="text-red-400 font-bold">HIGH</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Estimated exposure:</span>
                <span className="text-red-400 font-bold text-sm">$480M</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[10px] text-slate-400 font-sans">
              <strong className="text-cyan-400 font-mono">SIMULATION NOTICE: </strong>
              This cascade represents a synthetic contagion stress-test model and is not an actual prediction of market events.
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
