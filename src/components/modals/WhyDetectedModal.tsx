import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { useSecurity } from '../../context/SecurityContext';
import { ShieldCheck, Info, CheckCircle2, Cpu, Hash } from 'lucide-react';

export const WhyDetectedModal: React.FC = () => {
  const { isWhyDetectedOpen, closeWhyDetected, whyDetectedThreat } = useSecurity();

  if (!whyDetectedThreat) return null;

  const totalScore = whyDetectedThreat.signals.reduce((acc, s) => acc + s.score, 0);

  return (
    <Modal
      isOpen={isWhyDetectedOpen}
      onClose={closeWhyDetected}
      title="THREAT ANALYSIS & HEURISTIC DECOMPOSITION"
      subtitle={`Threat ID: ${whyDetectedThreat.id} • Protocol: ${whyDetectedThreat.protocol}`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Top Summary Card */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                Threat Pattern
              </span>
            </div>
            <Badge severity={whyDetectedThreat.severity}>{whyDetectedThreat.severity}</Badge>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-xl font-extrabold text-white">{whyDetectedThreat.type}</div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                Target: <span className="text-cyan-300 font-semibold">{whyDetectedThreat.protocol}</span> ({whyDetectedThreat.chain})
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black font-mono text-red-400">
                {whyDetectedThreat.riskScore} <span className="text-xs text-slate-500 font-normal">/ 100</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">RISK SCORE</div>
            </div>
          </div>
        </div>

        {/* Signals Decomposition Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-cyan-400" />
              Heuristic Signal Breakdown
            </span>
            <span className="text-cyan-400 font-bold">CONTRIBUTION</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden divide-y divide-slate-800/80">
            {whyDetectedThreat.signals.map((signal, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors">
                <div className="space-y-0.5">
                  <div className="font-semibold text-xs text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    {signal.name}
                  </div>
                  <div className="text-[11px] text-slate-400 pl-3.5">{signal.description}</div>
                </div>
                <div className="font-mono text-sm font-bold text-red-400 shrink-0 px-2 py-0.5 rounded bg-red-950/40 border border-red-500/20">
                  +{signal.score}
                </div>
              </div>
            ))}

            {/* Total Row */}
            <div className="p-3.5 bg-slate-950/70 flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-slate-300 uppercase">Composite Threat Score</span>
              <span className="font-black text-red-400 text-sm">
                {totalScore} / 100
              </span>
            </div>
          </div>
        </div>

        {/* System Explanation */}
        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-2">
          <div className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            Detection Logic Explanation
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            "{whyDetectedThreat.explanation}"
          </p>
        </div>

        {/* Detected Signals Checklist */}
        <div className="space-y-2">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            DETECTED SIGNALS
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Abnormal liquidity movement</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Unusual transaction pattern</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>State deviation</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>High-value interaction</span>
            </div>
          </div>
        </div>

        {/* Prototype Scoring Disclaimer */}
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 font-sans">
          <span className="font-mono text-cyan-400 uppercase font-semibold">Demo Heuristic Logic: </span>
          The scores and weights (+35, +25, +20, +14) represent a simulated heuristic model demonstrating how multi-signal classification evaluates pre-execution mempool transactions in real time.
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={closeWhyDetected}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-semibold transition-colors"
          >
            CLOSE ANALYSIS
          </button>
        </div>
      </div>
    </Modal>
  );
};
