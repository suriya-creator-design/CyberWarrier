import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { useSecurity } from '../../context/SecurityContext';
import { Printer, Download, ShieldAlert, CheckCircle2, FileText, Clock, AlertTriangle } from 'lucide-react';

export const IncidentReportModal: React.FC = () => {
  const { isReportModalOpen, closeReportModal, activeReportIncident, auditTrail } = useSecurity();

  if (!activeReportIncident) return null;

  const handlePrint = () => {
    window.print();
  };

  const relatedAudits = auditTrail.filter(
    (a) => a.protocol.toLowerCase().includes(activeReportIncident.protocol.toLowerCase())
  );

  return (
    <Modal
      isOpen={isReportModalOpen}
      onClose={closeReportModal}
      title="SECURITY INCIDENT REPORT"
      subtitle={`Dossier Ref: ${activeReportIncident.id} • Generated at: ${new Date().toUTCString()}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Printable Action Bar (Hidden when printing) */}
        <div className="no-print flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Formal Post-Incident Threat Report</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              <Printer className="w-3.5 h-3.5" />
              PRINT / EXPORT PDF
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 rounded-2xl bg-[#090E1A] border border-slate-800 text-slate-200 space-y-6">
          {/* Header Banner */}
          <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xl font-black tracking-widest text-cyan-400 font-mono">
                CYBER WARRIOR
              </div>
              <div className="text-xs text-slate-400 font-mono">
                SENTINEL PROTOCOL — PRE-EXECUTION THREAT RADAR & PROTOCOL HEALTH ENGINE
              </div>
              <div className="text-xs text-slate-500 mt-1 font-mono">
                CONFIDENTIAL • AUTOMATED SECURITY DISPATCH REPORT
              </div>
            </div>
            <div className="text-left sm:text-right font-mono text-xs space-y-1">
              <div>
                <span className="text-slate-500">INCIDENT ID: </span>
                <span className="text-white font-bold">{activeReportIncident.id}</span>
              </div>
              <div>
                <span className="text-slate-500">SEVERITY: </span>
                <Badge severity={activeReportIncident.severity}>{activeReportIncident.severity}</Badge>
              </div>
              <div>
                <span className="text-slate-500">STATUS: </span>
                <span className="text-emerald-400 font-bold">MITIGATED / CIRCUIT PAUSED</span>
              </div>
            </div>
          </div>

          {/* Prototype Watermark Notice */}
          <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/20 text-xs text-amber-300 font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>SIMULATED INCIDENT DOSSIER — GENERATED FOR DEMONSTRATION PURPOSES</span>
          </div>

          {/* Core Incident Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-slate-500 text-[10px] uppercase">Chain</div>
              <div className="font-bold text-white mt-1">{activeReportIncident.chain}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-slate-500 text-[10px] uppercase">Protocol Target</div>
              <div className="font-bold text-cyan-300 mt-1">{activeReportIncident.protocol}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-slate-500 text-[10px] uppercase">Risk Score</div>
              <div className="font-bold text-red-400 mt-1 text-sm">{activeReportIncident.riskScore} / 100</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-slate-500 text-[10px] uppercase">Potential Impact</div>
              <div className="font-bold text-red-400 mt-1 text-sm">{activeReportIncident.potentialExposure}</div>
            </div>
          </div>

          {/* Detection & Protection Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                Detection Vector Analysis
              </div>
              <div className="space-y-1 text-slate-300">
                <div><span className="text-slate-500">Threat Type:</span> {activeReportIncident.threatType}</div>
                <div><span className="text-slate-500">Detection Method:</span> Pre-Execution EVM Sandbox Heuristics</div>
                <div><span className="text-slate-500">Contagion Risk:</span> HIGH (3 Interconnected Pools Flagged)</div>
                <div><span className="text-slate-500">Detected At:</span> {activeReportIncident.detectedAt}</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Response Engine Status
              </div>
              <div className="space-y-1 text-slate-300">
                <div><span className="text-slate-500">Sentinel Guardian:</span> <span className="text-emerald-400 font-bold">{activeReportIncident.guardianStatus}</span></div>
                <div><span className="text-slate-500">Multisig Consensus:</span> <span className="text-cyan-400 font-bold">{activeReportIncident.multisigStatus}</span></div>
                <div><span className="text-slate-500">Circuit Breaker:</span> <span className="text-red-400 font-bold">{activeReportIncident.circuitBreakerStatus}</span></div>
                <div><span className="text-slate-500">Action:</span> Emergency Protocol Pause Dispatched</div>
              </div>
            </div>
          </div>

          {/* Incident Timeline */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Chronological Incident Timeline
            </div>
            <div className="relative pl-6 border-l-2 border-slate-800 space-y-4">
              {activeReportIncident.timeline.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-cyan-400 border-2 border-slate-950 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                  <div className="text-xs font-mono">
                    <span className="text-cyan-400 font-bold">{step.time}</span> —{' '}
                    <span className="text-white font-bold">{step.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{step.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Events Related */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Immutable Audit Events
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden text-xs font-mono divide-y divide-slate-800/60">
              {relatedAudits.slice(0, 4).map((audit) => (
                <div key={audit.id} className="p-2.5 flex items-center justify-between text-slate-300">
                  <span>{audit.timestamp}</span>
                  <span className="text-white font-semibold">{audit.event}</span>
                  <span className="text-slate-400">{audit.action}</span>
                  <span className="text-emerald-400 font-bold">{audit.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Close Footer */}
        <div className="no-print pt-2 flex justify-end">
          <button
            onClick={closeReportModal}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-semibold transition-colors"
          >
            CLOSE REPORT
          </button>
        </div>
      </div>
    </Modal>
  );
};
