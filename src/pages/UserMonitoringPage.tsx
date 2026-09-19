import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { Users, Search, AlertCircle, Shield, CheckCircle2, Eye, ShieldAlert } from 'lucide-react';
import { MonitoredUser } from '../types';

export const UserMonitoringPage: React.FC = () => {
  const { users } = useSecurity();
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<MonitoredUser | null>(null);

  const filteredUsers = users.filter(
    (u) =>
      u.wallet.toLowerCase().includes(search.toLowerCase()) ||
      u.threatStatus.toLowerCase().includes(search.toLowerCase()) ||
      u.notes.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 tracking-wider font-semibold">
              BEHAVIORAL RISK TRACKING
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
            USER & ENTITY MONITORING
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-sans">
            Pre-execution behavioral heuristics & risk profiling on monitored wallet entities
          </p>
        </div>

        <Badge variant="simulated">SYNTHETIC WALLETS</Badge>
      </div>

      {/* Privacy Notice */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3 text-xs text-slate-400">
        <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
        <div>
          <span className="text-white font-bold font-mono">SIMULATION TRANSPARENCY: </span>
          All wallet identifiers shown below are purely fictional/demo addresses generated for prototype testing. No real personal data or live wallet activity is tracked.
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full sm:w-80">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search wallet address or notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        />
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <GlassCard
            key={user.wallet}
            glow={user.riskLevel === 'CRITICAL' ? 'red' : 'none'}
            className="p-5 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <span className="font-mono text-xs font-bold text-cyan-300">
                  {user.wallet}
                </span>
                <Badge severity={user.riskLevel}>{user.riskLevel}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div className="text-slate-500 text-[10px]">TX COUNT</div>
                  <div className="font-bold text-white mt-0.5">{user.transactionCount} transactions</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div className="text-slate-500 text-[10px]">LAST SEEN</div>
                  <div className="font-bold text-slate-300 mt-0.5">{user.lastActivity}</div>
                </div>
              </div>

              <div className="text-xs text-slate-400 leading-relaxed font-sans">
                {user.notes}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                Status:{' '}
                <strong
                  className={
                    user.threatStatus === 'FLAGGED'
                      ? 'text-red-400'
                      : user.threatStatus === 'RESTRICTED'
                      ? 'text-purple-400'
                      : 'text-cyan-400'
                  }
                >
                  {user.threatStatus}
                </strong>
              </span>

              <button
                onClick={() => setSelectedUser(user)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono font-bold transition-colors flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                DETAILS
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Selected User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0B1220] border border-cyan-500/30 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white font-mono text-sm">
                ENTITY PROFILE: {selectedUser.wallet}
              </h3>
              <Badge severity={selectedUser.riskLevel}>{selectedUser.riskLevel}</Badge>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Threat Status:</span>
                <span className="text-white font-bold">{selectedUser.threatStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Recorded Transactions:</span>
                <span className="text-cyan-300 font-bold">{selectedUser.transactionCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Last Activity:</span>
                <span className="text-slate-300">{selectedUser.lastActivity}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-sans leading-relaxed">
                {selectedUser.notes}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
