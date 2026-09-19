import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { useSecurity } from '../../context/SecurityContext';
import { ShieldAlert, Zap, CheckCircle2, Clock, Terminal, AlertTriangle } from 'lucide-react';

const SIMULATION_STEPS = [
  { step: 1, title: 'TRANSACTION RECEIVED', desc: 'Ingress node intercepting raw transaction payload from public mempool' },
  { step: 2, title: 'MEMPOOL DETECTED', desc: 'Mempool listener cataloged $85M flash-borrow atomic transaction bundle' },
  { step: 3, title: 'HEURISTIC ANALYSIS', desc: 'Static opcode scanner detected uncollateralized lending pool arbitrage' },
  { step: 4, title: 'STATE DIFFERENCE ANALYSIS', desc: 'Pre-execution sandbox computed post-state solvency delta across 3 pools' },
  { step: 5, title: 'RISK CALCULATION', desc: 'Multi-factor risk engine calculated composite threat score: 94 / 100' },
  { step: 6, title: 'THREAT CLASSIFICATION', desc: 'Escalated to CRITICAL priority (Flash Loan Anomaly vector)' },
  { step: 7, title: 'GUARDIAN ALERT', desc: 'Sent automated pre-execution signature request to Sentinel Guardian node' },
  { step: 8, title: 'CIRCUIT BREAKER RESPONSE', desc: 'Simulated multi-sig enclave broadcast emergency pause dispatch' },
];

export const AttackSimulationModal: React.FC = () => {
  const {
    isExploitModalOpen,
    closeExploitModal,
    isSimulatingExploit,
    simulationStep,
    currentSimulatedThreat,
  } = useSecurity();

  const progressPercent = Math.min(100, Math.round((simulationStep / 8) * 100));

  return (
    <Modal
      isOpen={isExploitModalOpen}
      onClose={closeExploitModal}
      title="PRE-EXECUTION ATTACK SIMULATION"
      subtitle="Simulated Sandbox Threat Detection & Circuit Breaker Interception"
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Prototype Transparency Notice */}
        <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider text-amber-300">
              DEMO / SIMULATION RUNTIME:
            </span>{' '}
            This demonstration runs inside an isolated pre-execution testing sandbox using synthetic blockchain payloads. No live funds or real contracts are affected.
          </div>
        </div>

        {/* Progress Bar & Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-400 flex items-center gap-1.5 font-bold">
              {isSimulatingExploit ? (
                <>
                  <Zap className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                  ANALYSIS ENGINE RUNNING... (STEP {simulationStep} / 8)
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  SIMULATION COMPLETE — THREAT MITIGATED
                </>
              )}
            </span>
            <span className="text-slate-400">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Simulated Payload Specimen */}
        {currentSimulatedThreat && (
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Target Specimen:</span>
              <Badge severity="CRITICAL">SIMULATED PAYLOAD</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
              <div>
                <span className="text-slate-500">Transaction: </span>
                <span className="text-cyan-300 font-semibold">{currentSimulatedThreat.txHash.slice(0, 16)}...</span>
              </div>
              <div>
                <span className="text-slate-500">Chain: </span>
                <span>{currentSimulatedThreat.chain}</span>
              </div>
              <div>
                <span className="text-slate-500">Target Protocol: </span>
                <span className="text-white font-bold">{currentSimulatedThreat.protocol}</span>
              </div>
              <div>
                <span className="text-slate-500">Potential Loss: </span>
                <span className="text-red-400 font-bold">{currentSimulatedThreat.potentialLoss}</span>
              </div>
            </div>
          </div>
        )}

        {/* 8-Step Animated Stepper */}
        <div className="space-y-2.5">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            Execution Pipeline Telemetry
          </div>

          <div className="space-y-2">
            {SIMULATION_STEPS.map((s) => {
              const isCurrent = isSimulatingExploit && simulationStep === s.step;
              const isDone = simulationStep > s.step || !isSimulatingExploit;
              const isPending = simulationStep < s.step && isSimulatingExploit;

              return (
                <div
                  key={s.step}
                  className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-3 text-xs ${
                    isCurrent
                      ? 'border-cyan-500/50 bg-cyan-950/30 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : isDone
                      ? 'border-emerald-500/30 bg-emerald-950/20 text-slate-300'
                      : 'border-slate-800 bg-slate-900/40 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] font-bold ${
                        isCurrent
                          ? 'bg-cyan-500 text-black animate-pulse'
                          : isDone
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isDone ? '✓' : s.step}
                    </div>
                    <div>
                      <div className="font-bold font-mono tracking-wide">{s.title}</div>
                      <div className="text-[11px] opacity-80 mt-0.5">{s.desc}</div>
                    </div>
                  </div>

                  <div className="shrink-0 font-mono text-[10px]">
                    {isCurrent && (
                      <span className="text-cyan-400 flex items-center gap-1 animate-pulse">
                        <Clock className="w-3 h-3" /> PROCESSING
                      </span>
                    )}
                    {isDone && <span className="text-emerald-400 font-bold">VERIFIED</span>}
                    {isPending && <span className="text-slate-600">QUEUED</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 font-mono">
            STATUS: {isSimulatingExploit ? 'ANALYSIS IN PROGRESS' : 'GUARDIAN PAUSE DISPATCHED'}
          </div>
          <button
            onClick={closeExploitModal}
            className="px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-semibold transition-colors"
          >
            {isSimulatingExploit ? 'DISMISS MODAL (BACKGROUND)' : 'CLOSE & VIEW DASHBOARD'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
