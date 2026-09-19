import React from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import {
  Crown,
  Shield,
  Key,
  Lock,
  Cpu,
  Server,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  Radio,
  Activity,
  UserCheck,
} from 'lucide-react';

interface AdminDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDetailsModal: React.FC<AdminDetailsModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, users } = useAuth();

  // Find head admin user
  const headAdmin = users.find((u) => u.role === 'SUPER_ADMIN_HEAD') || currentUser;

  if (!headAdmin) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="HEAD ADMINISTRATOR • ENCLAVE CREDENTIALS"
      subtitle="Sentinel Protocol Tier-1 Defense Plane Authority Specification"
      maxWidth="lg"
    >
      <div className="space-y-5 font-mono text-xs">
        {/* Head Admin Identity Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/40 via-slate-900/90 to-slate-950 border border-amber-500/40 relative overflow-hidden shadow-[0_0_25px_rgba(245,158,11,0.15)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] shrink-0">
                <Crown className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-white">{headAdmin.displayName}</span>
                  <span className="px-2 py-0.5 text-[9px] font-black rounded bg-amber-500/20 border border-amber-500/40 text-amber-300">
                    HEAD OF ENCLAVE
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{headAdmin.email}</div>
                <div className="text-[10px] text-amber-400/90 font-mono mt-0.5">
                  Authority: Super Admin • Enclave Commander
                </div>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">CLEARANCE LEVEL</div>
              <div className="text-sm font-black text-amber-300">LEVEL 5 (UNRESTRICTED)</div>
              <div className="text-[10px] text-emerald-400 flex items-center justify-end gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ACTIVE SESSION
              </div>
            </div>
          </div>
        </div>

        {/* Credentials & Enclave Hardware Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1.5 font-bold">
              <Fingerprint className="w-3.5 h-3.5 text-cyan-400" />
              Hardware Enclave Signer ID
            </div>
            <div className="text-white font-bold truncate">0x71C2a8F9B03eD41785a9C3482De...9A</div>
            <div className="text-[10px] text-slate-500">Hardware: Intel SGX Tier-1 Sealed</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1.5 font-bold">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Multisig Quorum Weight
            </div>
            <div className="text-white font-bold">3-of-5 Enclaves Armed</div>
            <div className="text-[10px] text-cyan-400">Head Admin holds Master Key Share</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1.5 font-bold">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              Account Lockout Policy
            </div>
            <div className="text-emerald-400 font-bold">3 Strikes / 5-Min Lockdown</div>
            <div className="text-[10px] text-slate-500">Head Admin override enabled</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1.5 font-bold">
              <Radio className="w-3.5 h-3.5 text-amber-400" />
              Circuit Breaker Command
            </div>
            <div className="text-amber-300 font-bold">Emergency Pause Ready</div>
            <div className="text-[10px] text-slate-500">Cross-protocol halt privilege</div>
          </div>
        </div>

        {/* Privileges & Governance Matrix */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
          <div className="text-slate-400 font-bold uppercase text-[11px] flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            Head Administrator Granted Privileges
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Full Enclave Orchestration & Thresholds</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Immediate 5-Min Lockout Override</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Emergency Circuit Breaker Pause</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Password Verification Dispatch</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>User Account Provisioning & Roles</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Heuristic Detection Sensitivity Calibration</span>
            </div>
          </div>
        </div>

        {/* Close button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs transition-all"
          >
            Close Admin Detail
          </button>
        </div>
      </div>
    </Modal>
  );
};
