import React from 'react';
import { useSecurity } from '../context/SecurityContext';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import {
  ZapOff,
  ShieldAlert,
  Lock,
  Unlock,
  Radio,
  AlertOctagon,
  CheckCircle2,
  Server,
  Play,
} from 'lucide-react';
import { ProtocolHealth } from '../types';

export const CircuitBreakerPage: React.FC = () => {
  const { protocols, openCircuitBreakerConfirm } = useSecurity();

  const pauseDispatchers = [
    {
      id: 'disp-1',
      protocolKey: 'aave-v3',
      target: 'Aave V3 Core',
      actionType: 'EMERGENCY GLOBAL PAUSE',
      affectedTrigger: 'Flash-borrow pool reserves, oracle deviation > 8%',
      reason: 'Pre-execution flash-loan anomaly detected',
      defaultStatus: 'READY FOR DISPATCH',
    },
    {
      id: 'disp-2',
      protocolKey: 'curve-fi',
      target: 'Curve 3Pool Controller',
      actionType: 'COLLATERAL INGRESS HALT',
      affectedTrigger: 'TWAP deviation > 10%, sandwich bundle presence',
      reason: 'Cross-protocol TWAP manipulation vector',
      defaultStatus: 'READY FOR DISPATCH',
    },
    {
      id: 'disp-3',
      protocolKey: 'compound-v3',
      target: 'Compound Comet Market',
      actionType: 'BATCH LIQUIDATION CAP',
      affectedTrigger: 'Atomic liquidation depth > 3 blocks',
      reason: 'Cascading collateral seizure anomaly',
      defaultStatus: 'STANDBY',
    },
    {
      id: 'disp-4',
      protocolKey: 'gmx-v2',
      target: 'GMX Router Vault',
      actionType: 'ROUTER REENTRANCY LOCK',
      affectedTrigger: 'Execution frame depth > 4, state mutex unverified',
      reason: 'Pre-execution reentrancy bytecode flag',
      defaultStatus: 'STANDBY',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ZapOff className="w-4 h-4 text-red-400" />
            <span className="text-xs font-mono text-red-400 tracking-wider font-semibold">
              AUTOMATED MITIGATION ENGINE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
            EMERGENCY GUARDIAN PAUSE DISPATCHER
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-sans">
            Pre-execution circuit-breaker triggering and multi-sig pause dispatch
          </p>
        </div>

        {/* Global Dispatch Button */}
        <button
          onClick={() => openCircuitBreakerConfirm()}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] flex items-center gap-2"
        >
          <AlertOctagon className="w-4 h-4" />
          TRIGGER GUARDIAN PAUSE
        </button>
      </div>

      {/* Top Enclave Telemetry */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div>
          <div className="text-slate-500 text-[10px] uppercase">DISPATCH STATUS</div>
          <div className="text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ENCLAVE ARMED
          </div>
        </div>
        <div>
          <div className="text-slate-500 text-[10px] uppercase">MULTISIG THRESHOLD</div>
          <div className="text-white font-bold mt-0.5">3-of-5 Hardware Enclaves</div>
        </div>
        <div>
          <div className="text-slate-500 text-[10px] uppercase">AVG DISPATCH TIME</div>
          <div className="text-cyan-300 font-bold mt-0.5">240ms (Pre-Block)</div>
        </div>
        <div>
          <div className="text-slate-500 text-[10px] uppercase">ENVIRONMENT</div>
          <Badge variant="simulated">SIMULATED GUARDIAN</Badge>
        </div>
      </div>

      {/* Dispatcher Cards Table */}
      <div className="space-y-4">
        <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          Configured Emergency Protocol Dispatchers
        </div>

        <div className="grid grid-cols-1 gap-4">
          {pauseDispatchers.map((disp) => {
            const protoObj = protocols.find((p) => p.id === disp.protocolKey);
            const isPaused = protoObj?.isPaused || false;

            return (
              <GlassCard
                key={disp.id}
                glow={isPaused ? 'red' : 'none'}
                className="p-5 space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-base font-bold text-white font-mono">{disp.target}</h3>
                      {isPaused ? (
                        <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-500 text-red-300 text-xs font-black font-mono animate-pulse">
                          ● PAUSED / PROTECTED
                        </span>
                      ) : (
                        <Badge severity="HIGH">{disp.defaultStatus}</Badge>
                      )}
                    </div>
                    <div className="text-xs font-mono text-cyan-300 font-semibold">
                      Action: {disp.actionType}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openCircuitBreakerConfirm(protoObj)}
                      className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 ${
                        isPaused
                          ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                          : 'bg-red-950/60 hover:bg-red-900/70 border border-red-500/50 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                      }`}
                    >
                      {isPaused ? (
                        <>
                          <Lock className="w-3.5 h-3.5 text-red-400" />
                          PAUSE ACTIVE
                        </>
                      ) : (
                        <>
                          <AlertOctagon className="w-3.5 h-3.5" />
                          TRIGGER GUARDIAN PAUSE
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <div className="text-slate-500 text-[10px] uppercase">Reason</div>
                    <div className="text-red-300 font-semibold mt-1">{disp.reason}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <div className="text-slate-500 text-[10px] uppercase">Affected Trigger Conditions</div>
                    <div className="text-slate-300 mt-1">{disp.affectedTrigger}</div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};
