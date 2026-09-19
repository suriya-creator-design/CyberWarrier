import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import {
  AlertTriangle,
  ShieldAlert,
  Layers,
  CheckCircle2,
  FileText,
  Clock,
  ArrowRight,
  ShieldCheck,
  Printer,
} from 'lucide-react';

export const IncidentCenterPage: React.FC = () => {
  const { incidents, openReportModal } = useSecurity();
  const [selectedIncident, setSelectedIncident] = useState(incidents[0] || null);

  if (!selectedIncident) {
    return (
      <div className="p-12 text-center text-slate-500 font-mono text-xs">
        NO INCIDENTS RECORDED
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 tracking-wider font-semibold">
              TRIAGE & MITIGATION
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
            INCIDENT RESPONSE CENTER
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-sans">
            Three-pillar threat mitigation command & real-time forensic timeline
          </p>
        </div>

        {/* Generate Report Button */}
        <button
          onClick={() => openReportModal(selectedIncident)}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-black transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2"
        >
          <FileText className="w-4 h-4 fill-black" />
          GENERATE INCIDENT REPORT
        </button>
      </div>

      {/* Incident Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {incidents.map((inc) => (
          <button
            key={inc.id}
            onClick={() => setSelectedIncident(inc)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-2 ${
              selectedIncident.id === inc.id
                ? 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{inc.id}</span>
            <span>•</span>
            <span>{inc.protocol}</span>
            <Badge severity={inc.severity} size="sm">{inc.severity}</Badge>
          </button>
        ))}
      </div>

      {/* 3 Visually Connected Pillars: DETECT -> IMPACT -> PROTECT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        {/* PILLAR 1: DETECT */}
        <GlassCard glow="red" className="p-5 space-y-4 relative">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <h3 className="text-sm font-black font-mono tracking-wider text-red-400 uppercase">
                1. DETECT
              </h3>
            </div>
            <Badge severity={selectedIncident.severity}>{selectedIncident.severity}</Badge>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="text-slate-500 text-[10px] uppercase">Threat Pattern</div>
              <div className="text-base font-bold text-white mt-0.5">{selectedIncident.threatType}</div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Risk Score:</span>
              <span className="text-xl font-black text-red-400">{selectedIncident.riskScore} / 100</span>
            </div>

            <div className="space-y-1 text-slate-400">
              <div className="flex justify-between">
                <span>Detection Engine:</span>
                <span className="text-cyan-300 font-semibold">Pre-Execution EVM Sandbox</span>
              </div>
              <div className="flex justify-between">
                <span>Detected At:</span>
                <span className="text-white">{selectedIncident.detectedAt}</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* PILLAR 2: IMPACT */}
        <GlassCard glow="cyan" className="p-5 space-y-4 relative">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-black font-mono tracking-wider text-cyan-400 uppercase">
                2. IMPACT
              </h3>
            </div>
            <Badge variant="simulated">CALCULATED</Badge>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="text-slate-500 text-[10px] uppercase">Target Protocol</div>
              <div className="text-base font-bold text-cyan-300 mt-0.5">{selectedIncident.protocol}</div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Potential Exposure:</span>
              <span className="text-xl font-black text-red-400">{selectedIncident.potentialExposure}</span>
            </div>

            <div className="space-y-1 text-slate-400">
              <div className="flex justify-between">
                <span>Connected Protocols:</span>
                <span className="text-amber-400 font-bold">{selectedIncident.connectedProtocolsCount} pools</span>
              </div>
              <div className="flex justify-between">
                <span>Contagion Threat:</span>
                <span className="text-red-400 font-semibold">HIGH CASCADE RISK</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* PILLAR 3: PROTECT */}
        <GlassCard glow="green" className="p-5 space-y-4 relative">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-black font-mono tracking-wider text-emerald-400 uppercase">
                3. PROTECT
              </h3>
            </div>
            <Badge variant="pulse">ACTIVE DEFENSE</Badge>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Sentinel Guardian:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {selectedIncident.guardianStatus}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Multisig Consensus:</span>
                <span className="text-cyan-300 font-bold">{selectedIncident.multisigStatus}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Circuit Breaker:</span>
                <span className="text-red-400 font-black">{selectedIncident.circuitBreakerStatus}</span>
              </div>
            </div>

            <div className="text-[11px] text-emerald-400/90 font-sans border-t border-slate-800 pt-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              Pre-execution interception successfully halted potential collateral drain.
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Professional Vertical Incident Timeline */}
      <GlassCard className="p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              Forensic Incident Timeline ({selectedIncident.id})
            </h3>
          </div>
          <Badge variant="simulated">CHRONOLOGICAL TRACE</Badge>
        </div>

        <div className="relative pl-6 sm:pl-8 border-l-2 border-cyan-500/30 space-y-6 my-2">
          {selectedIncident.timeline.map((step, idx) => (
            <div key={idx} className="relative group">
              {/* Bullet node */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-0.5 w-4 h-4 rounded-full bg-[#080E1C] border-2 border-cyan-400 group-hover:bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-colors flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 group-hover:bg-black" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5 font-mono text-xs">
                  <span className="text-cyan-400 font-black px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                    {step.time}
                  </span>
                  <span className="text-white font-bold text-sm">{step.title}</span>
                  <span className="text-emerald-400 text-[10px] font-semibold">{step.status}</span>
                </div>
                <p className="text-xs text-slate-400 font-sans pl-1">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
