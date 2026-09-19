import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useSecurity } from '../context/SecurityContext';
import { AttackSimulationModal } from '../components/modals/AttackSimulationModal';
import { WhyDetectedModal } from '../components/modals/WhyDetectedModal';
import { CircuitBreakerModal } from '../components/modals/CircuitBreakerModal';
import { GlobalSearchModal } from '../components/modals/GlobalSearchModal';
import { NotificationDrawer } from '../components/modals/NotificationDrawer';
import { IncidentReportModal } from '../components/modals/IncidentReportModal';
import { EvmTraceModal } from '../components/modals/EvmTraceModal';
import { SentinelCopilot } from '../components/copilot/SentinelCopilot';
import { GuidedDemoBanner } from '../components/demo/GuidedDemoBanner';
import { PageView } from '../types';

import {
  LayoutDashboard,
  Radar,
  Activity,
  Network,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { currentPage, setCurrentPage } = useSecurity();

  const MOBILE_NAV: { id: PageView; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'mempool', label: 'Radar', icon: <Radar className="w-4 h-4" /> },
    { id: 'protocol-health', label: 'Health', icon: <Activity className="w-4 h-4" /> },
    { id: 'contagion-map', label: 'Contagion', icon: <Network className="w-4 h-4" /> },
    { id: 'incident-center', label: 'Incidents', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'demo-mode', label: 'Demo', icon: <Sparkles className="w-4 h-4 text-cyan-400" /> },
  ];

  return (
    <div className="min-h-screen bg-[#06090F] text-slate-100 flex flex-col cyber-grid-bg relative">
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto pb-28 md:pb-16">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-[#070D18]/95 border-t border-slate-800 backdrop-blur-md px-2 py-2 flex items-center justify-around">
        {MOBILE_NAV.map((nav) => {
          const isActive = currentPage === nav.id;
          return (
            <button
              key={nav.id}
              onClick={() => setCurrentPage(nav.id)}
              className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono font-medium transition-colors ${
                isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {nav.icon}
              <span>{nav.label}</span>
            </button>
          );
        })}
      </div>

      {/* Modals & Overlays */}
      <AttackSimulationModal />
      <WhyDetectedModal />
      <CircuitBreakerModal />
      <GlobalSearchModal />
      <NotificationDrawer />
      <IncidentReportModal />
      <EvmTraceModal />

      {/* Sentinel AI Copilot Floating Drawer */}
      <SentinelCopilot />

      {/* Guided Demo Mode Sticky Banner */}
      <GuidedDemoBanner />
    </div>
  );
};
