import React from 'react';
import { useSecurity } from '../context/SecurityContext';
import { useAuth } from '../context/AuthContext';
import type { PageView, Threat } from '../types';
import {
  LayoutDashboard,
  Radar,
  Activity,
  Network,
  ZapOff,
  Users,
  AlertTriangle,
  FileCheck,
  Sliders,
  Sparkles,
  Server,
  Cpu,
  Lock,
  Crown,
} from 'lucide-react';

interface NavItem {
  id: PageView;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  highlight?: boolean;
}

export const Sidebar: React.FC = () => {
  const { currentPage, setCurrentPage, threats, startDemoMode } = useSecurity();
  const { currentUser } = useAuth();

  const isHeadAdmin = currentUser?.role === 'SUPER_ADMIN_HEAD';
  const activeCriticalCount = threats.filter((t: Threat) => t.severity === 'CRITICAL').length;

  const NAV_ITEMS: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      id: 'mempool',
      label: 'Mempool Radar',
      icon: <Radar className="w-4 h-4" />,
      badge: activeCriticalCount > 0 ? activeCriticalCount : undefined,
      highlight: true,
    },
    { id: 'protocol-health', label: 'Protocol Health', icon: <Activity className="w-4 h-4" /> },
    { id: 'contagion-map', label: 'Contagion Map', icon: <Network className="w-4 h-4" /> },
    { id: 'circuit-breaker', label: 'Circuit Breaker', icon: <ZapOff className="w-4 h-4" /> },
    { id: 'user-monitoring', label: 'User Monitoring', icon: <Users className="w-4 h-4" /> },
    { id: 'incident-center', label: 'Incident Center', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'audit-trail', label: 'Audit Trail', icon: <FileCheck className="w-4 h-4" /> },
    {
      id: 'admin-control',
      label: isHeadAdmin ? 'Admin Control Plane' : 'Admin Detail (Restricted)',
      icon: isHeadAdmin ? <Crown className="w-4 h-4 text-amber-400" /> : <Lock className="w-4 h-4 text-red-400" />,
      badge: isHeadAdmin ? 'HEAD' : 'BLOCKED',
    },
    {
      id: 'demo-mode',
      label: 'Demo Mode',
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
      badge: 'GUIDED',
    },
  ];

  const handleNavClick = (id: PageView) => {
    if (id === 'demo-mode') {
      startDemoMode();
    }
    setCurrentPage(id);
  };

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col border-r border-slate-800 bg-[#070D18]/70 backdrop-blur-md h-[calc(100vh-4rem)] sticky top-16 select-none">
      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
          Threat Operations
        </div>

        {NAV_ITEMS.map((item) => {
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-cyan-950/50 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`${
                    isActive
                      ? 'text-cyan-400'
                      : 'text-slate-500 group-hover:text-cyan-400 transition-colors'
                  }`}
                >
                  {item.icon}
                </span>
                <span className="tracking-wide">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    item.badge === 'GUIDED'
                      ? 'bg-cyan-500 text-black shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                      : 'bg-red-500/20 border border-red-500/40 text-red-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer: System Status */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/40 space-y-3 font-mono text-xs">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Server className="w-3 h-3 text-cyan-400" />
              System Status
            </span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-cyan-400" />
              API Status
            </span>
            <span className="text-cyan-300 font-semibold">SYNCHRONIZED</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#050912] border border-slate-800 text-[10px] text-slate-400 leading-tight">
          <div className="text-cyan-400 font-bold uppercase tracking-wider mb-0.5">
            ENVIRONMENT
          </div>
          <div>PROTOTYPE / SIMULATION</div>
          <div className="text-slate-500 mt-0.5">master-enclave-01</div>
        </div>
      </div>
    </aside>
  );
};
