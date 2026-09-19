import React, { useState, useRef, useEffect } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { useAuth } from '../context/AuthContext';
import { AdminDetailsModal } from '../components/modals/AdminDetailsModal';
import { CHAINS } from '../data/chains';
import {
  Shield,
  Search,
  Bell,
  ChevronDown,
  Radio,
  User,
  Volume2,
  VolumeX,
  Sparkles,
  LogOut,
  Sliders,
  Crown,
  Key,
  Info,
} from 'lucide-react';
import type { ChainId, ChainOption } from '../types';

export const Header: React.FC = () => {
  const {
    selectedChain,
    setSelectedChain,
    unreadNotificationCount,
    toggleNotificationDrawer,
    toggleSearchModal,
    setCurrentPage,
    isAudioMuted,
    toggleAudioMute,
  } = useSecurity();

  const { currentUser, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAdminDetailsOpen, setIsAdminDetailsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isHeadAdmin = currentUser?.role === 'SUPER_ADMIN_HEAD';

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-cyan-500/20 bg-[#070D18]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Branding */}
      <div className="flex items-center gap-3">
        <div
          onClick={() => setCurrentPage('overview')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all">
            <Shield className="w-5 h-5 text-cyan-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-500" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold font-mono tracking-wider text-base text-white group-hover:text-cyan-300 transition-colors">
                CYBER WARRIOR
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-mono font-semibold rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 uppercase">
                V2.4 ENCLAVE
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 -mt-0.5">
              Sentinel Protocol
            </div>
          </div>
        </div>
      </div>

      {/* Center: System Status Indicator */}
      <div className="hidden lg:flex items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-bold tracking-wider">SYSTEM ONLINE</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300">
          <Radio className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold tracking-wider">DEMO ENVIRONMENT</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Audio Toggle */}
        <button
          onClick={toggleAudioMute}
          title={isAudioMuted ? 'Unmute Cyber Audio' : 'Mute Cyber Audio'}
          className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all text-xs"
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>

        {/* Chain Selector */}
        <div className="relative">
          <select
            value={selectedChain}
            onChange={(e) => setSelectedChain(e.target.value as ChainId)}
            className="appearance-none bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 rounded-xl px-3 py-1.5 pr-8 text-xs font-mono font-semibold text-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer shadow-sm transition-all"
          >
            {CHAINS.map((chain: ChainOption) => (
              <option key={chain.id} value={chain.id} className="bg-slate-900 text-slate-200">
                {chain.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-cyan-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Global Search Button */}
        <button
          onClick={() => toggleSearchModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-white transition-all text-xs font-mono"
          title="Search (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">Search</span>
          <kbd className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Button */}
        <button
          onClick={() => toggleNotificationDrawer(true)}
          className="relative p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all"
          title="Security Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white font-mono text-[9px] font-black flex items-center justify-center animate-pulse">
              {unreadNotificationCount}
            </span>
          )}
        </button>

        {/* User Profile & Head Admin Dropdown */}
        <div className="relative" ref={menuRef}>
          <div
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={`flex items-center gap-2 pl-2 border-l border-slate-800 cursor-pointer p-1.5 rounded-xl transition-all ${
              isUserMenuOpen ? 'bg-slate-800/60' : 'hover:bg-slate-900/60'
            }`}
            title="User Account & Session"
          >
            <div
              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
                isHeadAdmin
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300'
              }`}
            >
              {isHeadAdmin ? <Crown className="w-4 h-4 text-amber-400" /> : <User className="w-4 h-4" />}
            </div>

            <div className="hidden xl:block text-left">
              <div className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5">
                <span>{currentUser?.displayName || 'SecOps Admin'}</span>
                {isHeadAdmin && (
                  <span className="px-1 py-0.2 text-[8px] font-black rounded bg-amber-500/20 border border-amber-500/40 text-amber-300">
                    HEAD
                  </span>
                )}
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                {isHeadAdmin ? 'Enclave Super Admin' : 'Security Analyst'}
              </div>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* User Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#08101e]/95 backdrop-blur-xl border border-slate-800 shadow-2xl p-3 z-50 space-y-3 font-mono animate-fadeIn">
              {/* Account summary */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    AUTHENTICATED ENCLAVE
                  </span>
                  {isHeadAdmin ? (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[9px] font-black flex items-center gap-1">
                      <Crown className="w-2.5 h-2.5" />
                      HEAD ADMIN
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-[9px] font-bold">
                      ANALYST
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-white truncate">
                  {currentUser?.displayName}
                </div>
                <div className="text-[11px] text-slate-400 truncate">{currentUser?.email}</div>
              </div>

              {/* Menu items */}
              <div className="space-y-1 text-xs">
                {isHeadAdmin && (
                  <button
                    onClick={() => {
                      setCurrentPage('admin-control');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-slate-900 transition-all text-left"
                  >
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <span>Admin Control Plane</span>
                  </button>
                )}

                {/* View Admin Details Button */}
                <button
                  onClick={() => {
                    setIsAdminDetailsOpen(true);
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-amber-300 hover:text-amber-200 hover:bg-amber-950/30 transition-all text-left font-bold"
                >
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>View Admin Details</span>
                </button>

                <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/80 text-[10px] text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Account Security:</span>
                    <span className="text-emerald-400 font-bold">ENFORCED (3-Strike)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lockout Window:</span>
                    <span className="text-cyan-400 font-bold">5 Minutes</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Admin Details Modal */}
      <AdminDetailsModal
        isOpen={isAdminDetailsOpen}
        onClose={() => setIsAdminDetailsOpen(false)}
      />
    </header>
  );
};

