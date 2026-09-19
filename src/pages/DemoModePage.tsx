import React from 'react';
import { useSecurity } from '../context/SecurityContext';
import { DEMO_STEPS } from '../data/demoSteps';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import {
  Sparkles,
  Play,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Network,
  ZapOff,
  FileText,
} from 'lucide-react';

export const DemoModePage: React.FC = () => {
  const {
    demoStep,
    demoModeActive,
    startDemoMode,
    setDemoStepDirect,
    nextDemoStep,
    prevDemoStep,
    exitDemoMode,
  } = useSecurity();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 tracking-wider font-semibold">
              HACKATHON PRESENTATION GUIDE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
            CYBER WARRIOR GUIDED DEMO
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-sans">
            Curated 10-step walkthrough designed for hackathon evaluation & judges
          </p>
        </div>

        {/* Start / Stop Demo Mode */}
        {demoModeActive ? (
          <button
            onClick={exitDemoMode}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold transition-all"
          >
            EXIT ACTIVE TOUR
          </button>
        ) : (
          <button
            onClick={startDemoMode}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-black font-mono text-xs font-black transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-black" />
            LAUNCH GUIDED TOUR (STEP 1)
          </button>
        )}
      </div>

      {/* Hero Overview Card */}
      <GlassCard glow="cyan" className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div>
            <h2 className="text-lg font-bold text-white font-mono">
              Presentation Architecture & Flow
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Demonstrate pre-execution threat detection, heuristic breakdown, systemic contagion modeling, and guardian circuit-breaker pause.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400">STATUS:</span>
            {demoModeActive ? (
              <span className="text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 animate-pulse">
                ACTIVE (STEP {demoStep} / 10)
              </span>
            ) : (
              <span className="text-slate-500 font-semibold">STANDBY</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs text-slate-300">
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <strong className="text-cyan-400">1. PRE-EXECUTION</strong>
            <p className="text-[11px] text-slate-400 font-sans mt-1">
              Catches attacks in the mempool before transaction inclusion.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <strong className="text-amber-400">2. MULTI-SIGNAL</strong>
            <p className="text-[11px] text-slate-400 font-sans mt-1">
              Heuristic scores explain why threats are flagged transparently.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <strong className="text-emerald-400">3. AUTOMATED PAUSE</strong>
            <p className="text-[11px] text-slate-400 font-sans mt-1">
              Guardian circuit breakers halt pool drains automatically.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* 10 Step Detailed Matrix */}
      <div className="space-y-3">
        <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          All 10 Presentation Steps (Click to Jump Directly)
        </div>

        <div className="grid grid-cols-1 gap-3">
          {DEMO_STEPS.map((stepItem) => {
            const isCurrent = demoModeActive && demoStep === stepItem.step;

            return (
              <GlassCard
                key={stepItem.step}
                glow={isCurrent ? 'cyan' : 'none'}
                hover
                onClick={() => setDemoStepDirect(stepItem.step)}
                className={`p-4 sm:p-5 transition-all ${
                  isCurrent ? 'border-cyan-400 bg-cyan-950/30' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl font-mono text-xs font-black flex items-center justify-center shrink-0 ${
                        isCurrent
                          ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.6)]'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {stepItem.step}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white font-mono">
                          {stepItem.title}
                        </h3>
                        {isCurrent && (
                          <span className="px-2 py-0.2 rounded bg-cyan-500 text-black text-[10px] font-black font-mono animate-pulse">
                            ACTIVE STEP
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 font-sans mt-0.5">
                        {stepItem.description}
                      </p>
                      <div className="text-[11px] text-cyan-400/90 font-mono mt-1">
                        👉 {stepItem.guidance}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDemoStepDirect(stepItem.step);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-950 hover:border-cyan-500/50 border border-slate-700 text-cyan-300 font-mono text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
                  >
                    <span>GO TO STEP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};
