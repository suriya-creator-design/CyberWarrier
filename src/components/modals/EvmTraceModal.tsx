import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { useSecurity } from '../../context/SecurityContext';
import { Terminal, Database, Cpu, Zap, Code, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

interface StorageDiff {
  slot: string;
  variable: string;
  preValue: string;
  postValue: string;
  status: 'MUTATED' | 'DRAINED' | 'INITIALIZED';
}

const SAMPLE_STORAGE_DIFFS: StorageDiff[] = [
  {
    slot: '0x000000000000000000000000000000000000000000000000000000000000003b',
    variable: 'poolReserves[USDC]',
    preValue: '$85,240,000 (85.2M USDC)',
    postValue: '$240,000 (0.24M USDC)',
    status: 'DRAINED',
  },
  {
    slot: '0x000000000000000000000000000000000000000000000000000000000000003c',
    variable: 'poolReserves[WETH]',
    preValue: '28,400 WETH',
    postValue: '4,100 WETH',
    status: 'DRAINED',
  },
  {
    slot: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    variable: 'callerAllowance[Proxy]',
    preValue: '0x0000000000000000000000000000000000000000',
    postValue: '0xffffffffffffffffffffffffffffffffffffffff',
    status: 'MUTATED',
  },
  {
    slot: '0x12a934bb0018cdae7829031bfe98230198ca301b500000000000000000000000',
    variable: 'reentrancyMutexState',
    preValue: '1 (UNLOCKED)',
    postValue: '2 (LOCKED_VIOLATION)',
    status: 'MUTATED',
  },
];

const OPCODES_TRACE = [
  { pc: '0x0024', opcode: 'PUSH4', operand: '0xd0e30db0', gas: '3', note: 'flashLoan(address,uint256)' },
  { pc: '0x0029', opcode: 'CALLVALUE', operand: '', gas: '2', note: 'Check msg.value == 0' },
  { pc: '0x002e', opcode: 'SLOAD', operand: 'slot 0x3b', gas: '2100', note: 'Read USDC pool balance' },
  { pc: '0x0041', opcode: 'CALL', operand: '0x71A...92F4b', gas: '14800', note: 'Execute borrower callback' },
  { pc: '0x008a', opcode: 'DELEGATECALL', operand: '0x3d...8e', gas: '24500', note: 'Nested state mutation' },
  { pc: '0x00c4', opcode: 'SSTORE', operand: 'slot 0x3b', gas: '22100', note: 'Drained balance written to state' },
  { pc: '0x0112', opcode: 'STATICCALL', operand: 'Chainlink Feed', gas: '2600', note: 'TWAP deviation check failed' },
  { pc: '0x0145', opcode: 'REVERT', operand: 'Sentinel: Intercepted', gas: '0', note: 'Circuit-breaker simulation halt' },
];

export const EvmTraceModal: React.FC = () => {
  const { isEvmTraceOpen, closeEvmTrace, evmTraceThreat } = useSecurity();
  const [activeTab, setActiveTab] = useState<'storage' | 'opcodes'>('storage');

  if (!isEvmTraceOpen) return null;

  return (
    <Modal
      isOpen={isEvmTraceOpen}
      onClose={closeEvmTrace}
      title="EVM PRE-EXECUTION BYTECODE & STATE DIFF INSPECTOR"
      subtitle={`Sandboxed Sandbox Execution • Threat Specimen: ${evmTraceThreat?.id || 'THR-8891'}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Top Summary Banner */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
          <div>
            <div className="text-slate-400">Target Function Selector:</div>
            <div className="text-cyan-300 font-bold text-sm flex items-center gap-2 mt-0.5">
              <Code className="w-4 h-4 text-cyan-400" />
              <span>0xd0e30db0: flashLoan(address receiver, uint256 amount)</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Target Contract: {evmTraceThreat?.protocol || 'Aave V3'} ({evmTraceThreat?.chain || 'Ethereum Mainnet'})
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-red-400 font-black text-sm">498,210 GAS</div>
              <div className="text-[10px] text-slate-500">ESTIMATED CONSUMPTION</div>
            </div>
            <Badge severity="CRITICAL">STATE HAZARD</Badge>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('storage')}
            className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'storage'
                ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            STORAGE SLOT MUTATIONS (DIFF)
          </button>
          <button
            onClick={() => setActiveTab('opcodes')}
            className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'opcodes'
                ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            OPCODE EXECUTION TRACE
          </button>
        </div>

        {/* Tab 1: Storage Slot Mutations */}
        {activeTab === 'storage' ? (
          <div className="space-y-3">
            <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>PRE-EXECUTION vs. POST-SIMULATION STATE DELTAS</span>
              <Badge variant="simulated">EVM SANDBOX DIFF</Badge>
            </div>

            <div className="space-y-2.5">
              {SAMPLE_STORAGE_DIFFS.map((diff, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 font-mono text-xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-bold">{diff.variable}</span>
                      <span className="text-slate-500 text-[10px]">({diff.slot.slice(0, 16)}...)</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        diff.status === 'DRAINED'
                          ? 'bg-red-950/80 border border-red-500 text-red-300 animate-pulse'
                          : 'bg-amber-950/80 border border-amber-500 text-amber-300'
                      }`}
                    >
                      {diff.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded bg-slate-900/80 border border-slate-800/80">
                      <div className="text-slate-500 text-[10px]">BEFORE (INITIAL STATE)</div>
                      <div className="text-emerald-400 font-semibold mt-0.5">{diff.preValue}</div>
                    </div>
                    <div className="p-2 rounded bg-red-950/30 border border-red-500/30">
                      <div className="text-red-400 text-[10px]">AFTER (POST-SIMULATION STATE)</div>
                      <div className="text-red-300 font-bold mt-0.5">{diff.postValue}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Tab 2: Opcode Execution Trace */
          <div className="space-y-3">
            <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>EVM OPCODES EXECUTED BEFORE INTERCEPTION</span>
              <span className="text-cyan-400">8 OPCODES SHOWN</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden divide-y divide-slate-800/60 font-mono text-xs">
              {OPCODES_TRACE.map((op, idx) => (
                <div
                  key={idx}
                  className="p-2.5 px-4 flex items-center justify-between hover:bg-slate-900/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-[11px] w-14">{op.pc}</span>
                    <span
                      className={`font-black w-24 ${
                        op.opcode === 'REVERT'
                          ? 'text-red-400'
                          : op.opcode === 'DELEGATECALL' || op.opcode === 'SSTORE'
                          ? 'text-amber-400'
                          : 'text-cyan-300'
                      }`}
                    >
                      {op.opcode}
                    </span>
                    <span className="text-slate-300 text-[11px]">{op.operand}</span>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <span className="text-slate-400 text-[11px] hidden sm:inline">{op.note}</span>
                    <span className="text-slate-500 text-[10px] w-16">{op.gas} gas</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            SANDBOX MUTEX: REVERT SIMULATED PRE-CONFIRMATION
          </span>
          <button
            onClick={closeEvmTrace}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-semibold"
          >
            CLOSE TRACE
          </button>
        </div>
      </div>
    </Modal>
  );
};
