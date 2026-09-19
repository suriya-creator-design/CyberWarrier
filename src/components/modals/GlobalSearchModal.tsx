import React, { useState, useMemo } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { useSecurity } from '../../context/SecurityContext';
import { Search, ShieldAlert, Cpu, Hash, Globe, FileText, ArrowRight } from 'lucide-react';
import { Threat, SecurityIncident, ProtocolHealth } from '../../types';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    toggleSearchModal,
    threats,
    protocols,
    incidents,
    setCurrentPage,
    openWhyDetected,
    openReportModal,
  } = useSecurity();

  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) {
      return { threats: [], protocols: [], incidents: [] };
    }
    const q = query.toLowerCase().trim();

    const matchedThreats = threats.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.txHash.toLowerCase().includes(q) ||
        t.protocol.toLowerCase().includes(q) ||
        t.type.toLowerCase().includes(q) ||
        t.chain.toLowerCase().includes(q)
    );

    const matchedProtocols = protocols.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.chain.toLowerCase().includes(q)
    );

    const matchedIncidents = incidents.filter(
      (i) =>
        i.id.toLowerCase().includes(q) ||
        i.title.toLowerCase().includes(q) ||
        i.protocol.toLowerCase().includes(q) ||
        i.threatType.toLowerCase().includes(q) ||
        i.chain.toLowerCase().includes(q)
    );

    return { threats: matchedThreats, protocols: matchedProtocols, incidents: matchedIncidents };
  }, [query, threats, protocols, incidents]);

  const totalMatches =
    results.threats.length + results.protocols.length + results.incidents.length;

  return (
    <Modal
      isOpen={isSearchModalOpen}
      onClose={() => toggleSearchModal(false)}
      title="CENTRAL ENCLAVE INTELLIGENCE SEARCH"
      subtitle="Search across Pre-Execution TXs, Protocols, Threat Vectors & Incident Logs"
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search transaction (0x8f...), protocol (Aave), threat (Flash Loan), or chain..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 hover:text-slate-300"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Search Results */}
        {query.trim() === '' ? (
          <div className="p-8 text-center text-slate-500 text-xs font-mono">
            Type to search Sentinel Protocol enclave database (e.g. "Aave", "Curve", "0x8f9", "Flash Loan")
          </div>
        ) : totalMatches === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
            <div className="text-slate-400 font-mono text-xs">NO INTELLIGENCE RECORDS FOUND</div>
            <p className="text-[11px] text-slate-500">
              No transactions, protocols, or threats matched "{query}". Try a different keyword.
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
            {/* Threats */}
            {results.threats.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                  Pre-Execution Threats ({results.threats.length})
                </div>
                <div className="space-y-1.5">
                  {results.threats.map((threat) => (
                    <div
                      key={threat.id}
                      onClick={() => {
                        toggleSearchModal(false);
                        openWhyDetected(threat);
                      }}
                      className="p-3 rounded-lg bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white">{threat.type}</span>
                          <Badge severity={threat.severity}>{threat.severity}</Badge>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {threat.protocol} • {threat.chain} • TX: {threat.txHash.slice(0, 14)}...
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-red-400">{threat.riskScore}/100</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Protocols */}
            {results.protocols.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  Protocols & Markets ({results.protocols.length})
                </div>
                <div className="space-y-1.5">
                  {results.protocols.map((protocol) => (
                    <div
                      key={protocol.id}
                      onClick={() => {
                        toggleSearchModal(false);
                        setCurrentPage('protocol-health');
                      }}
                      className="p-3 rounded-lg bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-xs text-white">{protocol.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {protocol.category} • {protocol.chain} • TVL: {protocol.tvl}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-xs text-cyan-400">
                        <span>Health: {protocol.healthScore}/100</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Incidents */}
            {results.incidents.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  Security Incidents ({results.incidents.length})
                </div>
                <div className="space-y-1.5">
                  {results.incidents.map((incident) => (
                    <div
                      key={incident.id}
                      onClick={() => {
                        toggleSearchModal(false);
                        openReportModal(incident);
                      }}
                      className="p-3 rounded-lg bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-xs text-white flex items-center gap-2">
                          <span>{incident.title}</span>
                          <Badge severity={incident.severity}>{incident.severity}</Badge>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {incident.protocol} • Exposure: {incident.potentialExposure}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-cyan-400">VIEW DOSSIER</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
