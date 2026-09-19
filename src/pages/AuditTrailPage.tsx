import React, { useState, useMemo } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { FileCheck, Search, Filter, Download, Shield, ExternalLink } from 'lucide-react';
import { AuditEvent } from '../types';

export const AuditTrailPage: React.FC = () => {
  const { auditTrail } = useSecurity();

  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filteredEvents = useMemo(() => {
    return auditTrail.filter((item) => {
      const matchesSeverity = severityFilter === 'ALL' || item.severity === severityFilter;
      const matchesSearch =
        item.protocol.toLowerCase().includes(search.toLowerCase()) ||
        item.event.toLowerCase().includes(search.toLowerCase()) ||
        item.action.toLowerCase().includes(search.toLowerCase()) ||
        item.chain.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase());
      return matchesSeverity && matchesSearch;
    });
  }, [auditTrail, search, severityFilter]);

  const handleExportCSV = () => {
    const headers = 'ID,Timestamp,Chain,Protocol,Event,Severity,Action,Status\n';
    const rows = filteredEvents
      .map(
        (e) =>
          `"${e.id}","${e.timestamp}","${e.chain}","${e.protocol}","${e.event}","${e.severity}","${e.action}","${e.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cyber_warrior_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileCheck className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 tracking-wider font-semibold">
              IMMUTABLE LOGS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
            SECURITY AUDIT TRAIL
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-sans">
            Cryptographically sealed timeline of pre-execution threat detections and guardian interventions
          </p>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
        >
          <Download className="w-4 h-4" />
          EXPORT AUDIT LOG (CSV)
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Severity filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                severityFilter === sev
                  ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search event, protocol or action..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <GlassCard className="overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Chain</th>
                <th className="py-3 px-4">Protocol</th>
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    NO AUDIT LOGS MATCHING QUERY
                  </td>
                </tr>
              ) : (
                filteredEvents.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-850/60 transition-colors"
                  >
                    <td className="py-3 px-4 text-cyan-300 font-bold whitespace-nowrap">
                      {item.timestamp}
                    </td>
                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                      {item.chain}
                    </td>
                    <td className="py-3 px-4 text-white font-bold whitespace-nowrap">
                      {item.protocol}
                    </td>
                    <td className="py-3 px-4 text-slate-200">
                      {item.event}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge severity={item.severity}>{item.severity}</Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {item.action}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-bold text-emerald-400">
                      {item.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Showing {filteredEvents.length} log entries</span>
          <Badge variant="simulated">ENCLAVE SECURED LOGS</Badge>
        </div>
      </GlassCard>
    </div>
  );
};
