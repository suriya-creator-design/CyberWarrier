import React, { useState, useEffect } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { AdminDetailsModal } from '../components/modals/AdminDetailsModal';
import {
  Sliders,
  Server,
  ShieldAlert,
  Cpu,
  Zap,
  RotateCcw,
  CheckCircle2,
  Lock,
  Radio,
  Power,
  Crown,
  UserCheck,
  Unlock,
  Mail,
  KeyRound,
  AlertTriangle,
  Clock,
  Shield,
  Fingerprint,
  ExternalLink,
  ArrowLeft,
  Info,
} from 'lucide-react';

export const AdminControlPage: React.FC = () => {
  const {
    resetAllData,
    startExploitSimulation,
    openCircuitBreakerConfirm,
    startDemoMode,
    setCurrentPage,
  } = useSecurity();

  const {
    currentUser,
    users,
    unlockUser,
    requestPasswordReset,
    resetUserPasswordByAdmin,
    getRemainingLockoutSeconds,
  } = useAuth();

  // Engine toggles
  const [mempoolEngine, setMempoolEngine] = useState(true);
  const [threatEngine, setThreatEngine] = useState(true);
  const [riskEngine, setRiskEngine] = useState(true);
  const [guardianArmed, setGuardianArmed] = useState(true);
  const [circuitBreakerReady, setCircuitBreakerReady] = useState(true);

  // Config parameters
  const [riskThreshold, setRiskThreshold] = useState(85);
  const [latencyBudget, setLatencyBudget] = useState(350);
  const [multisigQuorum, setMultisigQuorum] = useState(3);

  // Admin action notification
  const [adminNotice, setAdminNotice] = useState<string | null>(null);

  // Password reset prompt state
  const [selectedUserToReset, setSelectedUserToReset] = useState<string | null>(null);
  const [newAdminPassword, setNewAdminPassword] = useState('');

  // Admin Details Modal state
  const [isAdminDetailsOpen, setIsAdminDetailsOpen] = useState(false);

  // Clock ticker for live countdowns
  const [, setTicker] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTicker((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const isHeadAdmin = currentUser?.role === 'SUPER_ADMIN_HEAD';

  // If user is NOT Head Admin, BLOCK access to admin detail & control plane!
  if (!isHeadAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 animate-fadeIn">
        <GlassCard className="max-w-md w-full p-6 sm:p-8 space-y-5 border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.15)] text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/50 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="px-2 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-red-400 font-mono text-[10px] font-black uppercase tracking-wider">
              ACCESS BLOCKED
            </span>
            <h2 className="text-xl font-black font-mono text-white">
              HEAD ADMIN CLEARANCE REQUIRED
            </h2>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              This enclave control plane and admin details are strictly restricted to the{' '}
              <strong className="text-amber-300">Head Administrator (admin@sentinel.sec)</strong>.
              Your account clearance level does not permit viewing or modifying these parameters.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-left font-mono text-xs space-y-1">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Your Current Identity</div>
            <div className="text-white font-bold">{currentUser?.displayName}</div>
            <div className="text-slate-400 text-[11px]">{currentUser?.email}</div>
            <div className="text-cyan-400 text-[10px] mt-1">Role: {currentUser?.role}</div>
          </div>

          <div className="pt-2 flex flex-col gap-2 font-mono text-xs">
            <button
              onClick={() => setCurrentPage('overview')}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold flex items-center justify-center gap-2 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Security Overview
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  const handleUnlock = (userId: string, userName: string) => {
    unlockUser(userId);
    setAdminNotice(`Account for ${userName} has been unlocked by Head Admin.`);
    setTimeout(() => setAdminNotice(null), 4000);
  };

  const handleSendResetLink = (email: string, userName: string) => {
    const res = requestPasswordReset(email);
    if (res.success) {
      setAdminNotice(`Password verification link generated and dispatched to ${email}.`);
    } else {
      setAdminNotice(`Error: ${res.error}`);
    }
    setTimeout(() => setAdminNotice(null), 5000);
  };

  const handleDirectPasswordReset = (userId: string) => {
    if (!newAdminPassword || newAdminPassword.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }
    resetUserPasswordByAdmin(userId, newAdminPassword);
    setAdminNotice('User password successfully updated and account unlocked.');
    setSelectedUserToReset(null);
    setNewAdminPassword('');
    setTimeout(() => setAdminNotice(null), 4000);
  };

  const formatRemaining = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono text-amber-400 tracking-wider font-semibold">
              HEAD OF ENCLAVE COMMAND PLANE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white flex items-center gap-3">
            ADMIN CONTROL PLANE
            <span className="px-2 py-0.5 text-xs rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-normal">
              SUPER ADMIN HEAD
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-sans">
            Head administrator enclave orchestration, security lockout policies, detection thresholds, and guardian parameters
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdminDetailsOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          >
            <Crown className="w-3.5 h-3.5" />
            VIEW ADMIN DETAIL
          </button>

          <button
            onClick={resetAllData}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs font-bold transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            RESET SIMULATION DATA
          </button>
        </div>
      </div>

      {/* Admin Details Modal */}
      <AdminDetailsModal
        isOpen={isAdminDetailsOpen}
        onClose={() => setIsAdminDetailsOpen(false)}
      />

      {/* Dedicated Block: Head Administrator Identity & Enclave Credentials */}
      <GlassCard className="p-5 border-amber-500/40 bg-gradient-to-r from-amber-950/20 via-slate-900/50 to-slate-950/70 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white text-base">
                  {currentUser?.displayName || 'Supreme Commander (Head Admin)'}
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black">
                  HEAD OF ENCLAVE
                </span>
              </div>
              <div className="text-xs font-mono text-slate-400 mt-0.5 flex items-center gap-3">
                <span>Email: <strong className="text-slate-200">{currentUser?.email}</strong></span>
                <span>•</span>
                <span>Clearance: <strong className="text-amber-300">Level 5 (Unrestricted)</strong></span>
                <span>•</span>
                <span>Enclave: <strong className="text-cyan-400">Master-01 Armed</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsAdminDetailsOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/50 text-amber-300 text-xs font-mono font-bold flex items-center gap-2 transition-all"
            >
              <Info className="w-3.5 h-3.5" />
              Full Enclave Specification
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Admin Notice Banner */}
      {adminNotice && (
        <div className="p-3 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-mono text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{adminNotice}</span>
        </div>
      )}

      {/* Head Admin Authority & User Lockout Management */}
      <GlassCard className="p-5 space-y-4 border-amber-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Head Administrator • Enclave User Governance & Lockout Controls
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Admin is the Head of this system with authority to unlock 5-minute locked accounts and manage credentials
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold">
              3-STRIKE / 5-MIN POLICY ACTIVE
            </span>
          </div>
        </div>

        {/* User Accounts Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase">
                <th className="pb-3 font-semibold">User / Identity</th>
                <th className="pb-3 font-semibold">Role & Authority</th>
                <th className="pb-3 font-semibold">First-Time Setup</th>
                <th className="pb-3 font-semibold">Failed Attempts</th>
                <th className="pb-3 font-semibold">Account Status</th>
                <th className="pb-3 font-semibold text-right">Head Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => {
                const remainingSecs = getRemainingLockoutSeconds(u);
                const isUserLocked = remainingSecs > 0;
                const isSuperHead = u.role === 'SUPER_ADMIN_HEAD';

                return (
                  <tr key={u.id} className="hover:bg-slate-900/30 transition-colors">
                    {/* User */}
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isSuperHead
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {isSuperHead ? <Crown className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <div className="text-white font-bold">{u.displayName}</div>
                          <div className="text-[10px] text-slate-500">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3 pr-3">
                      {isSuperHead ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black tracking-wide inline-flex items-center gap-1">
                          <Crown className="w-2.5 h-2.5" />
                          HEAD OF ENCLAVE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold">
                          SECURITY ANALYST
                        </span>
                      )}
                    </td>

                    {/* First-time */}
                    <td className="py-3 pr-3">
                      {u.isFirstTimeUser ? (
                        <span className="px-2 py-0.5 rounded bg-amber-950/50 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                          PENDING ROTATION
                        </span>
                      ) : (
                        <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          COMPLETED
                        </span>
                      )}
                    </td>

                    {/* Failed Attempts */}
                    <td className="py-3 pr-3">
                      <span
                        className={`font-bold ${
                          u.failedAttempts >= 3
                            ? 'text-red-400'
                            : u.failedAttempts > 0
                            ? 'text-amber-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {u.failedAttempts} / 3
                      </span>
                    </td>

                    {/* Account Status */}
                    <td className="py-3 pr-3">
                      {isUserLocked ? (
                        <div className="space-y-0.5">
                          <span className="px-2 py-0.5 rounded bg-red-500/20 border border-red-500/50 text-red-400 text-[10px] font-bold inline-flex items-center gap-1 animate-pulse">
                            <Clock className="w-3 h-3" />
                            LOCKED (5 MIN)
                          </span>
                          <div className="text-[10px] text-red-400/80 font-mono">
                            {formatRemaining(remainingSecs)} remaining
                          </div>
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          ACTIVE
                        </span>
                      )}
                    </td>

                    {/* Head Admin Actions */}
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isSuperHead ? (
                          <button
                            onClick={() => setIsAdminDetailsOpen(true)}
                            className="px-2.5 py-1 rounded-lg bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 text-[10px] font-bold flex items-center gap-1 transition-all"
                            title="View Head Admin Enclave Specification"
                          >
                            <Info className="w-3 h-3" />
                            View Detail
                          </button>
                        ) : (
                          <button
                            onClick={() => setIsAdminDetailsOpen(true)}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-bold flex items-center gap-1 transition-all"
                            title="View Enclave Specifications"
                          >
                            <Info className="w-3 h-3" />
                            Detail
                          </button>
                        )}

                        {isUserLocked && (
                          <button
                            onClick={() => handleUnlock(u.id, u.displayName)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold flex items-center gap-1 transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                            title="Head Admin Override: Clear lockout immediately"
                          >
                            <Unlock className="w-3 h-3" />
                            Unlock User
                          </button>
                        )}

                        <button
                          onClick={() => handleSendResetLink(u.email, u.displayName)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-cyan-300 text-[10px] font-bold flex items-center gap-1 transition-all"
                          title="Generate and dispatch password reset verification link"
                        >
                          <Mail className="w-3 h-3" />
                          Reset Link
                        </button>

                        <button
                          onClick={() =>
                            setSelectedUserToReset(selectedUserToReset === u.id ? null : u.id)
                          }
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-bold flex items-center gap-1 transition-all"
                          title="Direct password update"
                        >
                          <KeyRound className="w-3 h-3" />
                          Set Pass
                        </button>
                      </div>

                      {/* Inline password setter prompt */}
                      {selectedUserToReset === u.id && (
                        <div className="mt-2 p-2.5 rounded-lg bg-slate-950 border border-cyan-500/40 text-left space-y-2">
                          <div className="text-[10px] text-slate-400">
                            Set new password for <strong className="text-white">{u.displayName}</strong>:
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="password"
                              placeholder="New password (min 8 chars)"
                              value={newAdminPassword}
                              onChange={(e) => setNewAdminPassword(e.target.value)}
                              className="flex-1 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                            />
                            <button
                              onClick={() => handleDirectPasswordReset(u.id)}
                              className="px-3 py-1 rounded bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 transition-all"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* 5 Core Engines Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <GlassCard className="p-4 space-y-1.5">
          <div className="text-[11px] font-mono text-slate-400">Mempool Engine</div>
          <div className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ONLINE
          </div>
          <div className="text-[10px] text-slate-500 font-mono">Ingress Buffer: 0.1ms</div>
        </GlassCard>

        <GlassCard className="p-4 space-y-1.5">
          <div className="text-[11px] font-mono text-slate-400">Threat Engine</div>
          <div className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ONLINE
          </div>
          <div className="text-[10px] text-slate-500 font-mono">Bytecode Heuristics</div>
        </GlassCard>

        <GlassCard className="p-4 space-y-1.5">
          <div className="text-[11px] font-mono text-slate-400">Risk Engine</div>
          <div className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ONLINE
          </div>
          <div className="text-[10px] text-slate-500 font-mono">Multi-signal Weights</div>
        </GlassCard>

        <GlassCard className="p-4 space-y-1.5">
          <div className="text-[11px] font-mono text-slate-400">Guardian</div>
          <div className="text-sm font-bold font-mono text-cyan-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            READY
          </div>
          <div className="text-[10px] text-slate-500 font-mono">3-of-5 Enclaves Armed</div>
        </GlassCard>

        <GlassCard className="p-4 space-y-1.5">
          <div className="text-[11px] font-mono text-slate-400">Circuit Breaker</div>
          <div className="text-sm font-bold font-mono text-cyan-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            READY
          </div>
          <div className="text-[10px] text-slate-500 font-mono">Pause Dispatch Disarmed</div>
        </GlassCard>
      </div>

      {/* Sections Grid: Configuration & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Configuration */}
        <GlassCard className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Security Configuration & Thresholds
            </h3>
            <Badge variant="simulated">CALIBRATION</Badge>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* Risk Threshold Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Automatic Pause Threshold:</span>
                <span className="text-red-400 font-bold">{riskThreshold} / 100</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={riskThreshold}
                onChange={(e) => setRiskThreshold(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="text-[10px] text-slate-500 font-sans">
                Transactions with risk scores equal or above this threshold trigger pre-execution intervention.
              </div>
            </div>

            {/* Latency Budget Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>P99 Pre-Execution Latency Budget:</span>
                <span className="text-cyan-300 font-bold">{latencyBudget} ms</span>
              </div>
              <input
                type="range"
                min="100"
                max="800"
                step="25"
                value={latencyBudget}
                onChange={(e) => setLatencyBudget(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="text-[10px] text-slate-500 font-sans">
                Target time envelope before transaction is finalized in mempool candidate block.
              </div>
            </div>

            {/* Quorum selector */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Multisig Hardware Enclave Quorum:</span>
                <span className="text-white font-bold">{multisigQuorum} of 5</span>
              </div>
              <div className="flex gap-2">
                {[2, 3, 4, 5].map((q) => (
                  <button
                    key={q}
                    onClick={() => setMultisigQuorum(q)}
                    className={`flex-1 py-1.5 rounded-lg border font-bold text-xs transition-all ${
                      multisigQuorum === q
                        ? 'bg-cyan-500 text-black border-cyan-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {q}-of-5
                  </button>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Engine Toggles & Simulation Controls */}
        <GlassCard className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Power className="w-4 h-4 text-emerald-400" />
              Engine Operations & Simulation Triggers
            </h3>
            <Badge variant="simulated">ENCLAVE ACCESS</Badge>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* Toggles */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div>
                <div className="text-white font-bold">Mempool Ingress Engine</div>
                <div className="text-[10px] text-slate-500 font-sans">Continuous raw transaction interceptor</div>
              </div>
              <button
                onClick={() => setMempoolEngine(!mempoolEngine)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  mempoolEngine ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-500'
                }`}
              >
                {mempoolEngine ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div>
                <div className="text-white font-bold">Heuristic Sandbox Engine</div>
                <div className="text-[10px] text-slate-500 font-sans">EVM state deviation and bytecode analyzer</div>
              </div>
              <button
                onClick={() => setThreatEngine(!threatEngine)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  threatEngine ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-500'
                }`}
              >
                {threatEngine ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            {/* Quick Simulation Triggers */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="text-slate-400 font-bold uppercase text-[10px]">
                Immediate Scenario Triggers
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={startExploitSimulation}
                  className="p-2.5 rounded-xl bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Trigger Flash Loan
                </button>
                <button
                  onClick={() => openCircuitBreakerConfirm()}
                  className="p-2.5 rounded-xl bg-red-950/50 hover:bg-red-900/60 border border-red-500/40 text-red-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Trigger Pause
                </button>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

