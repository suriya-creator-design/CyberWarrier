import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  ChainId,
  SeverityLevel,
  Threat,
  ProtocolHealth,
  SecurityIncident,
  AuditEvent,
  MonitoredUser,
  SystemMetrics,
  NotificationItem,
  PageView,
} from '../types';
import { INITIAL_PROTOCOLS } from '../data/protocols';
import { INITIAL_THREATS } from '../data/threats';
import { INITIAL_INCIDENTS } from '../data/incidents';
import { INITIAL_AUDIT_TRAIL } from '../data/auditTrail';
import { MONITORED_USERS } from '../data/users';
import { DEMO_STEPS } from '../data/demoSteps';
import { soundEngine } from '../services/soundEffects';

interface SecurityContextType {
  selectedChain: ChainId;
  setSelectedChain: (chain: ChainId) => void;
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  
  // Data
  threats: Threat[];
  protocols: ProtocolHealth[];
  incidents: SecurityIncident[];
  auditTrail: AuditEvent[];
  users: MonitoredUser[];
  metrics: SystemMetrics;
  notifications: NotificationItem[];
  unreadNotificationCount: number;

  // Modals and Drawers
  isExploitModalOpen: boolean;
  isSimulatingExploit: boolean;
  simulationStep: number;
  currentSimulatedThreat: Threat | null;
  
  whyDetectedThreat: Threat | null;
  isWhyDetectedOpen: boolean;
  openWhyDetected: (threat: Threat) => void;
  closeWhyDetected: () => void;

  // EVM Trace Modal
  isEvmTraceOpen: boolean;
  evmTraceThreat: Threat | null;
  openEvmTrace: (threat?: Threat) => void;
  closeEvmTrace: () => void;

  isCircuitBreakerModalOpen: boolean;
  circuitBreakerTarget: ProtocolHealth | null;
  openCircuitBreakerConfirm: (protocol?: ProtocolHealth) => void;
  closeCircuitBreakerConfirm: () => void;
  executeCircuitBreaker: () => Promise<void>;
  isExecutingCircuitBreaker: boolean;
  circuitBreakerStep: number;

  isReportModalOpen: boolean;
  activeReportIncident: SecurityIncident | null;
  openReportModal: (incident?: SecurityIncident) => void;
  closeReportModal: () => void;

  isSearchModalOpen: boolean;
  toggleSearchModal: (open?: boolean) => void;

  isNotificationDrawerOpen: boolean;
  toggleNotificationDrawer: (open?: boolean) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Cascade Simulation
  isCascadeSimulating: boolean;
  cascadeStep: number;
  cascadeAffectedCount: number;
  triggerCascadeSimulation: () => void;

  // Guided Demo Mode
  demoModeActive: boolean;
  demoStep: number;
  startDemoMode: () => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  exitDemoMode: () => void;
  setDemoStepDirect: (step: number) => void;

  // Audio Control
  isAudioMuted: boolean;
  toggleAudioMute: () => void;

  // Actions
  startExploitSimulation: () => void;
  closeExploitModal: () => void;
  resetAllData: () => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-1',
    timestamp: '15:42:01 UTC',
    severity: 'CRITICAL',
    title: 'Flash Loan Anomaly Detected',
    message: 'Pre-execution heuristic flagged $85M borrow bundle targeting Aave V3 pools.',
    read: false,
    incidentId: 'INC-2026-0891',
    protocol: 'Aave V3',
  },
  {
    id: 'NOTIF-2',
    timestamp: '15:40:18 UTC',
    severity: 'CRITICAL',
    title: 'Cross-Protocol TWAP Deviation',
    message: 'Curve 3Pool price skewed 11.4% relative to median Chainlink feeds.',
    read: false,
    incidentId: 'INC-2026-0890',
    protocol: 'Curve',
  },
  {
    id: 'NOTIF-3',
    timestamp: '15:38:52 UTC',
    severity: 'HIGH',
    title: 'Reentrancy Call Sequence Flagged',
    message: 'GMX router invocation flagged with call stack depth > 4 before state lock.',
    read: false,
    incidentId: 'INC-2026-0888',
    protocol: 'GMX',
  },
  {
    id: 'NOTIF-4',
    timestamp: '15:35:10 UTC',
    severity: 'MEDIUM',
    title: 'Governance Proposal Activity',
    message: 'New simulated timelock upgrade proposed for Compound V3 market parameter.',
    read: true,
    protocol: 'Compound',
  },
];

export const SecurityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedChain, setSelectedChain] = useState<ChainId>('ALL');
  const [currentPage, setCurrentPage] = useState<PageView>('overview');

  const [threats, setThreats] = useState<Threat[]>(INITIAL_THREATS);
  const [protocols, setProtocols] = useState<ProtocolHealth[]>(INITIAL_PROTOCOLS);
  const [incidents, setIncidents] = useState<SecurityIncident[]>(INITIAL_INCIDENTS);
  const [auditTrail, setAuditTrail] = useState<AuditEvent[]>(INITIAL_AUDIT_TRAIL);
  const [users] = useState<MonitoredUser[]>(MONITORED_USERS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Audio State
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  const toggleAudioMute = () => {
    setIsAudioMuted((prev) => {
      soundEngine.isMuted = !prev;
      return !prev;
    });
  };

  // Exploit Simulation
  const [isExploitModalOpen, setIsExploitModalOpen] = useState<boolean>(false);
  const [isSimulatingExploit, setIsSimulatingExploit] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(1);
  const [currentSimulatedThreat, setCurrentSimulatedThreat] = useState<Threat | null>(INITIAL_THREATS[0]);

  // Why Detected
  const [whyDetectedThreat, setWhyDetectedThreat] = useState<Threat | null>(null);
  const [isWhyDetectedOpen, setIsWhyDetectedOpen] = useState<boolean>(false);

  // EVM Trace Modal
  const [isEvmTraceOpen, setIsEvmTraceOpen] = useState<boolean>(false);
  const [evmTraceThreat, setEvmTraceThreat] = useState<Threat | null>(null);

  const openEvmTrace = (threat?: Threat) => {
    setEvmTraceThreat(threat || threats[0]);
    setIsEvmTraceOpen(true);
    soundEngine.playClick();
  };

  const closeEvmTrace = () => {
    setIsEvmTraceOpen(false);
  };

  // Circuit Breaker
  const [isCircuitBreakerModalOpen, setIsCircuitBreakerModalOpen] = useState<boolean>(false);
  const [circuitBreakerTarget, setCircuitBreakerTarget] = useState<ProtocolHealth | null>(null);
  const [isExecutingCircuitBreaker, setIsExecutingCircuitBreaker] = useState<boolean>(false);
  const [circuitBreakerStep, setCircuitBreakerStep] = useState<number>(1);

  // Report Modal
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [activeReportIncident, setActiveReportIncident] = useState<SecurityIncident | null>(INITIAL_INCIDENTS[0]);

  // Search & Notifications
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState<boolean>(false);

  // Cascade
  const [isCascadeSimulating, setIsCascadeSimulating] = useState<boolean>(false);
  const [cascadeStep, setCascadeStep] = useState<number>(0);
  const [cascadeAffectedCount, setCascadeAffectedCount] = useState<number>(3);

  // Demo Mode
  const [demoModeActive, setDemoModeActive] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(1);

  // Filtered view logic
  const filteredThreats = useMemo(() => {
    if (selectedChain === 'ALL') return threats;
    return threats.filter((t) => t.chainId === selectedChain);
  }, [threats, selectedChain]);

  const filteredProtocols = useMemo(() => {
    if (selectedChain === 'ALL') return protocols;
    return protocols.filter((p) => p.chainId === selectedChain);
  }, [protocols, selectedChain]);

  // Derived Metrics
  const metrics = useMemo<SystemMetrics>(() => {
    const totalTvln = filteredProtocols.reduce((sum, p) => sum + p.tvlNumeric, 0);
    const totalCollateralAtRisk = filteredProtocols.reduce((sum, p) => sum + p.collateralAtRiskNumeric, 0);
    const activeThreatsCount = filteredThreats.filter((t) => t.status === 'PRE-EXECUTION' || t.status === 'SIMULATING').length;
    const criticalThreatsCount = filteredThreats.filter((t) => t.severity === 'CRITICAL').length;
    
    return {
      totalValueMonitored: `$${totalTvln.toFixed(1)}B`,
      collateralAtRisk: `$${(totalCollateralAtRisk / 1000).toFixed(2)}B`,
      activeThreats: activeThreatsCount,
      criticalThreats: criticalThreatsCount,
      p99Latency: selectedChain === 'ALL' ? '312ms' : selectedChain === 'ETHEREUM' ? '280ms' : '145ms',
      mempoolThroughput: selectedChain === 'ALL' ? '2,850 tx/s' : '820 tx/s',
      systemicHealthIndex: Math.round(
        filteredProtocols.reduce((sum, p) => sum + p.healthScore, 0) / (filteredProtocols.length || 1)
      ),
    };
  }, [filteredProtocols, filteredThreats, selectedChain]);

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Exploit Simulation Sequence
  const startExploitSimulation = () => {
    setIsExploitModalOpen(true);
    setIsSimulatingExploit(true);
    setSimulationStep(1);
    soundEngine.playAlarm();

    const threatToSimulate = INITIAL_THREATS[0];
    setCurrentSimulatedThreat(threatToSimulate);

    const stepInterval = setInterval(() => {
      setSimulationStep((prev) => {
        soundEngine.playRadarBlip();
        if (prev >= 8) {
          clearInterval(stepInterval);
          setIsSimulatingExploit(false);
          soundEngine.playLock();

          // Update global state after completion
          setThreats((prevThreats) => {
            const exists = prevThreats.some((t) => t.id === threatToSimulate.id);
            if (exists) return prevThreats;
            return [threatToSimulate, ...prevThreats];
          });

          // Add audit event
          const newAuditEvent: AuditEvent = {
            id: `AUD-${Date.now().toString().slice(-4)}`,
            timestamp: new Date().toLocaleTimeString() + ' UTC',
            chain: 'Ethereum Mainnet',
            chainId: 'ETHEREUM',
            protocol: 'Aave V3',
            event: 'Simulated Exploit Executed',
            severity: 'CRITICAL',
            action: 'Pre-Execution Vector Detected & Guardian Alerted',
            status: 'COMPLETED',
          };
          setAuditTrail((prev) => [newAuditEvent, ...prev]);

          // Add notification
          const newNotif: NotificationItem = {
            id: `NOTIF-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString() + ' UTC',
            severity: 'CRITICAL',
            title: 'Exploit Simulation Complete',
            message: 'Flash loan vector successfully intercepted at pre-execution phase (Risk: 94/100).',
            read: false,
            incidentId: 'INC-2026-0891',
            protocol: 'Aave V3',
          };
          setNotifications((prev) => [newNotif, ...prev]);

          return 8;
        }
        return prev + 1;
      });
    }, 900);
  };

  const closeExploitModal = () => {
    setIsExploitModalOpen(false);
  };

  // Why Detected Modal
  const openWhyDetected = (threat: Threat) => {
    setWhyDetectedThreat(threat);
    setIsWhyDetectedOpen(true);
    soundEngine.playClick();
  };

  const closeWhyDetected = () => {
    setIsWhyDetectedOpen(false);
    setWhyDetectedThreat(null);
  };

  // Circuit Breaker Actions
  const openCircuitBreakerConfirm = (protocol?: ProtocolHealth) => {
    setCircuitBreakerTarget(protocol || protocols.find((p) => p.id === 'aave-v3') || protocols[0]);
    setIsCircuitBreakerModalOpen(true);
    setCircuitBreakerStep(1);
    setIsExecutingCircuitBreaker(false);
    soundEngine.playClick();
  };

  const closeCircuitBreakerConfirm = () => {
    if (!isExecutingCircuitBreaker) {
      setIsCircuitBreakerModalOpen(false);
    }
  };

  const executeCircuitBreaker = async () => {
    setIsExecutingCircuitBreaker(true);
    setCircuitBreakerStep(1); // GUARDIAN ALERT SENT
    soundEngine.playRadarBlip();

    await new Promise((r) => setTimeout(r, 800));
    setCircuitBreakerStep(2); // MULTISIG APPROVAL
    soundEngine.playRadarBlip();

    await new Promise((r) => setTimeout(r, 900));
    setCircuitBreakerStep(3); // CIRCUIT BREAKER ENGAGED
    soundEngine.playRadarBlip();

    await new Promise((r) => setTimeout(r, 800));
    setCircuitBreakerStep(4); // PROTECTION ACTIVE
    soundEngine.playLock();

    // Update Protocol state to paused
    if (circuitBreakerTarget) {
      setProtocols((prev) =>
        prev.map((p) => (p.id === circuitBreakerTarget.id ? { ...p, isPaused: true } : p))
      );
    }

    // Add audit entry
    const newAudit: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString() + ' UTC',
      chain: circuitBreakerTarget?.chain || 'Ethereum Mainnet',
      chainId: circuitBreakerTarget?.chainId || 'ETHEREUM',
      protocol: circuitBreakerTarget?.name || 'Aave V3',
      event: 'Guardian Circuit Breaker Engaged',
      severity: 'CRITICAL',
      action: 'Emergency Global Pause Dispatched & Active',
      status: 'COMPLETED',
    };
    setAuditTrail((prev) => [newAudit, ...prev]);

    // Add notification
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString() + ' UTC',
      severity: 'CRITICAL',
      title: `Guardian Pause Active: ${circuitBreakerTarget?.name || 'Aave V3'}`,
      message: 'Emergency pause executed. Deposits and flash borrows halted.',
      read: false,
      protocol: circuitBreakerTarget?.name,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    setIsExecutingCircuitBreaker(false);
  };

  // Contagion Cascade Simulation
  const triggerCascadeSimulation = () => {
    if (isCascadeSimulating) return;
    setIsCascadeSimulating(true);
    setCascadeStep(1); // Aave
    setCascadeAffectedCount(1);
    soundEngine.playAlarm();

    setTimeout(() => {
      setCascadeStep(2); // Curve
      setCascadeAffectedCount(2);
      soundEngine.playRadarBlip();
    }, 1200);

    setTimeout(() => {
      setCascadeStep(3); // Compound
      setCascadeAffectedCount(3);
      soundEngine.playRadarBlip();
    }, 2400);

    setTimeout(() => {
      setCascadeStep(4); // Liquidity Impact
      setIsCascadeSimulating(false);
      soundEngine.playLock();
    }, 3600);
  };

  // Guided Demo Mode Controls
  const startDemoMode = () => {
    setDemoModeActive(true);
    setDemoStep(1);
    setCurrentPage(DEMO_STEPS[0].targetPage);
    soundEngine.playClick();
  };

  const nextDemoStep = () => {
    if (demoStep < DEMO_STEPS.length) {
      const next = demoStep + 1;
      setDemoStep(next);
      setCurrentPage(DEMO_STEPS[next - 1].targetPage);
      soundEngine.playClick();
    }
  };

  const prevDemoStep = () => {
    if (demoStep > 1) {
      const prev = demoStep - 1;
      setDemoStep(prev);
      setCurrentPage(DEMO_STEPS[prev - 1].targetPage);
      soundEngine.playClick();
    }
  };

  const exitDemoMode = () => {
    setDemoModeActive(false);
  };

  const setDemoStepDirect = (step: number) => {
    if (step >= 1 && step <= DEMO_STEPS.length) {
      setDemoStep(step);
      setCurrentPage(DEMO_STEPS[step - 1].targetPage);
      soundEngine.playClick();
    }
  };

  // Report Modal
  const openReportModal = (incident?: SecurityIncident) => {
    setActiveReportIncident(incident || incidents[0]);
    setIsReportModalOpen(true);
    soundEngine.playClick();
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
  };

  // Search & Notifications
  const toggleSearchModal = (open?: boolean) => {
    setIsSearchModalOpen((prev) => (open !== undefined ? open : !prev));
    soundEngine.playClick();
  };

  const toggleNotificationDrawer = (open?: boolean) => {
    setIsNotificationDrawerOpen((prev) => (open !== undefined ? open : !prev));
    soundEngine.playClick();
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Reset Data
  const resetAllData = () => {
    setThreats(INITIAL_THREATS);
    setProtocols(INITIAL_PROTOCOLS);
    setIncidents(INITIAL_INCIDENTS);
    setAuditTrail(INITIAL_AUDIT_TRAIL);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSelectedChain('ALL');
    setDemoStep(1);
    soundEngine.playLock();
  };

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleSearchModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <SecurityContext.Provider
      value={{
        selectedChain,
        setSelectedChain,
        currentPage,
        setCurrentPage,
        threats: filteredThreats,
        protocols: filteredProtocols,
        incidents,
        auditTrail,
        users,
        metrics,
        notifications,
        unreadNotificationCount,
        isExploitModalOpen,
        isSimulatingExploit,
        simulationStep,
        currentSimulatedThreat,
        whyDetectedThreat,
        isWhyDetectedOpen,
        openWhyDetected,
        closeWhyDetected,
        isEvmTraceOpen,
        evmTraceThreat,
        openEvmTrace,
        closeEvmTrace,
        isCircuitBreakerModalOpen,
        circuitBreakerTarget,
        openCircuitBreakerConfirm,
        closeCircuitBreakerConfirm,
        executeCircuitBreaker,
        isExecutingCircuitBreaker,
        circuitBreakerStep,
        isReportModalOpen,
        activeReportIncident,
        openReportModal,
        closeReportModal,
        isSearchModalOpen,
        toggleSearchModal,
        isNotificationDrawerOpen,
        toggleNotificationDrawer,
        markNotificationRead,
        markAllNotificationsRead,
        isCascadeSimulating,
        cascadeStep,
        cascadeAffectedCount,
        triggerCascadeSimulation,
        demoModeActive,
        demoStep,
        startDemoMode,
        nextDemoStep,
        prevDemoStep,
        exitDemoMode,
        setDemoStepDirect,
        isAudioMuted,
        toggleAudioMute,
        startExploitSimulation,
        closeExploitModal,
        resetAllData,
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
