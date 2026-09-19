import React from 'react';
import { useSecurity } from '../../context/SecurityContext';
import { DEMO_STEPS } from '../../data/demoSteps';
import { Play, ArrowLeft, ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';

export const GuidedDemoBanner: React.FC = () => {
  const {
    demoModeActive,
    demoStep,
    nextDemoStep,
    prevDemoStep,
    exitDemoMode,
    startExploitSimulation,
    openWhyDetected,
    threats,
    openCircuitBreakerConfirm,
    openReportModal,
    triggerCascadeSimulation,
  } = useSecurity();

  if (!demoModeActive) return null;

  const currentStepData = DEMO_STEPS[demoStep - 1] || DEMO_STEPS[0];

  const handleStepAction = () => {
    switch (currentStepData.targetAction) {
      case 'simulate-exploit':
        startExploitSimulation();
        break;
      case 'why-detected':
        if (threats.length > 0) openWhyDetected(threats[0]);
        break;
      case 'simulate-cascade':
        triggerCascadeSimulation();
        break;
      case 'trigger-guardian':
        openCircuitBreakerConfirm();
        break;
      case 'open-report':
        openReportModal();
        break;
      default:
        break;
    }
  };

  return (
    <div className="fixed bottom-4 inset-x-4 sm:inset-x-8 z-40 max-w-5xl mx-auto">
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0C1527]/95 border-2 border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.35),0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Step Indicator & Info */}
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500 text-black font-black text-xs font-mono tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              GUIDED DEMO • STEP {demoStep} / {DEMO_STEPS.length}
            </span>
            <span className="text-cyan-300 font-bold text-sm tracking-wide">
              {currentStepData.title}
            </span>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {currentStepData.guidance}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {currentStepData.actionButtonText && (
            <button
              onClick={handleStepAction}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-mono text-xs font-black transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-1.5 animate-pulse"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              {currentStepData.actionButtonText}
            </button>
          )}

          <div className="flex items-center gap-1 border border-slate-700/80 rounded-xl bg-slate-900/80 p-1">
            <button
              onClick={prevDemoStep}
              disabled={demoStep === 1}
              className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent text-xs font-mono transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              PREV
            </button>
            <button
              onClick={nextDemoStep}
              disabled={demoStep === DEMO_STEPS.length}
              className="px-2.5 py-1.5 rounded-lg text-cyan-300 hover:text-white hover:bg-cyan-950/60 disabled:opacity-40 disabled:hover:bg-transparent text-xs font-mono font-bold transition-colors flex items-center gap-1"
            >
              NEXT
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={exitDemoMode}
            title="Exit Demo Mode"
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800/80 border border-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
