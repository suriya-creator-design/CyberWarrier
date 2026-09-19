import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { useSecurity } from '../../context/SecurityContext';
import { ShieldAlert, AlertOctagon, CheckCircle2, Lock, ArrowDown, Radio, Cpu, ShieldCheck } from 'lucide-react';

export const CircuitBreakerModal: React.FC = () => {
  const {
    isCircuitBreakerModalOpen,
    closeCircuitBreakerConfirm,
    circuitBreakerTarget,
    executeCircuitBreaker,
    isExecutingCircuitBreaker,
    circuitBreakerStep,
  } = useSecurity();

  const targetName = circuitBreakerTarget?.name || 'Aave V3';

  const STEPS = [
    { step: 1, title: 'GUARDIAN ALERT SENT', desc: 'Secure RPC payload dispatched to Sentinel Guardian nodes' },
    { step: 2, title: 'MULTISIG APPROVAL (SIMULATED)', desc: 'Threshold 3-of-5 hardware enclaves assembled ECDSA signatures' },
    { step: 3, title: 'CIRCUIT BREAKER ENGAGED', desc: 'Protocol pause function broadcast to target smart contracts' },
    { step: 4, title: 'PROTECTION ACTIVE', desc: 'Target protocol in locked state; collateral drain halted' },
  ];

  const ENCLAVE_NODES = [
    { name: 'Zurich AWS Nitro Enclave #1', status: circuitBreakerStep >= 2 ? 'SIGNED' : 'ARMED', sig: '0x7f8a3e...b23d' },
    { name: 'Virginia Intel SGX Enclave #2', status: circuitBreakerStep >= 2 ? 'SIGNED' : 'ARMED', sig: '0x9e120f...c112' },
    { name: 'Tokyo Keystone TEE Enclave #3', status: circuitBreakerStep >= 2 ? 'SIGNED' : 'ARMED', sig: '0x44ba88...901e' },
    { name: 'London Hardware HSM #4', status: circuitBreakerStep >= 4 ? 'CONFIRMED' : 'STANDBY', sig: 'Pending quorum' },
    { name: 'Singapore Enclave Node #5', status: 'STANDBY', sig: 'Standby backup' },
  ];

  return (
    <Modal
      isOpen={isCircuitBreakerModalOpen}
      onClose={closeCircuitBreakerConfirm}
      title="SIMULATED PROTECTION ACTION"
      subtitle="Sentinel Guardian Emergency Protocol Intervention"
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Warning Banner */}
        <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold text-red-200 uppercase tracking-wider font-mono">
              CONFIRM EMERGENCY GUARDIAN DISPATCH
            </div>
            <p className="text-red-300/90 leading-relaxed">
              You are about to simulate a global emergency pause response on the target protocol. This will trigger the Sentinel Guardian circuit breaker.
            </p>
          </div>
        </div>

        {/* Confirmation Details Card */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Target Protocol:</span>
            <span className="text-white font-bold text-sm">{targetName}</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Reason:</span>
            <span className="text-red-400 font-bold">Critical threat (Pre-execution Anomaly)</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Action:</span>
            <Badge severity="CRITICAL">Guardian Emergency Pause</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Environment:</span>
            <Badge variant="simulated">DEMO SIMULATION</Badge>
          </div>
        </div>

        {/* Hardware Enclave Multi-Sig Panel */}
        <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/80 border border-cyan-500/20 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              Hardware Enclave Multi-Sig Quorum
            </span>
            <span className="text-emerald-400 font-bold">
              {circuitBreakerStep >= 2 ? '3/5 QUORUM ACHIEVED' : '3/5 REQUIRED'}
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            {ENCLAVE_NODES.map((node, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-slate-900/70 border border-slate-800/80 flex items-center justify-between text-[11px]"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      node.status === 'SIGNED' || node.status === 'CONFIRMED'
                        ? 'bg-emerald-400 animate-pulse'
                        : 'bg-slate-500'
                    }`}
                  />
                  <span className="text-slate-200">{node.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-slate-500 text-[10px] hidden sm:inline">{node.sig}</code>
                  <span
                    className={`font-bold ${
                      node.status === 'SIGNED' || node.status === 'CONFIRMED'
                        ? 'text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {node.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Execution Pipeline State */}
        {isExecutingCircuitBreaker || circuitBreakerStep > 1 ? (
          <div className="space-y-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              Execution Pipeline Progression
            </div>

            <div className="space-y-2">
              {STEPS.map((s, idx) => {
                const isPassed = circuitBreakerStep > s.step;
                const isCurrent = circuitBreakerStep === s.step;

                return (
                  <React.Fragment key={s.step}>
                    <div
                      className={`p-3 rounded-lg border text-xs font-mono transition-all flex items-center justify-between ${
                        isCurrent
                          ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                          : isPassed
                          ? 'border-emerald-500/30 bg-emerald-950/30 text-emerald-300'
                          : 'border-slate-800 bg-slate-900/40 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {isPassed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : isCurrent ? (
                          <Lock className="w-4 h-4 text-cyan-400 animate-spin" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px]">
                            {s.step}
                          </span>
                        )}
                        <div>
                          <div className="font-bold">{s.title}</div>
                          <div className="text-[10px] text-slate-400 font-sans mt-0.5">{s.desc}</div>
                        </div>
                      </div>
                      <span className="text-[10px]">
                        {isPassed ? 'DONE' : isCurrent ? 'EXECUTING' : 'PENDING'}
                      </span>
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className="flex justify-center -my-1 text-slate-600">
                        <ArrowDown className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            onClick={closeCircuitBreakerConfirm}
            disabled={isExecutingCircuitBreaker}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {circuitBreakerStep === 4 ? 'CLOSE' : 'CANCEL'}
          </button>
          {circuitBreakerStep < 4 && (
            <button
              onClick={executeCircuitBreaker}
              disabled={isExecutingCircuitBreaker}
              className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] disabled:opacity-50 flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              {isExecutingCircuitBreaker ? 'DISPATCHING...' : 'EXECUTE DEMO ACTION'}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
