export type ChainId = 'ALL' | 'ETHEREUM' | 'ARBITRUM' | 'BASE' | 'OPTIMISM' | 'POLYGON';

export interface ChainOption {
  id: ChainId;
  name: string;
  symbol: string;
  iconColor: string;
  isTestnet?: boolean;
}

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface ThreatSignal {
  name: string;
  score: number; // e.g., +35
  description: string;
  detected: boolean;
}

export interface Threat {
  id: string;
  txHash: string;
  chain: string;
  chainId: ChainId;
  protocol: string;
  type: string;
  riskScore: number; // 0 - 100
  severity: SeverityLevel;
  status: 'PRE-EXECUTION' | 'SIMULATING' | 'ANALYZED' | 'MITIGATED' | 'PAUSED';
  latencyMs: number;
  potentialLoss: string;
  detectedAt: string;
  explanation: string;
  signals: ThreatSignal[];
  simulated: boolean;
}

export interface ProtocolHealth {
  id: string;
  name: string;
  category: string;
  chain: string;
  chainId: ChainId;
  tvl: string;
  tvlNumeric: number; // in billions
  collateralAtRisk: string;
  collateralAtRiskNumeric: number; // in millions
  liquidityConcentration: number; // 0 - 1.0
  bridgeSync: number; // percentage e.g. 99.2
  governanceRisk: SeverityLevel;
  liquidityRisk: SeverityLevel;
  dependencyRisk: SeverityLevel;
  healthScore: number; // 0 - 100
  isPaused: boolean;
  activeIncidentsCount: number;
}

export interface ContagionNode {
  id: string;
  name: string;
  type: 'PROTOCOL' | 'BRIDGE' | 'DEX' | 'LENDING';
  tvl: string;
  risk: SeverityLevel;
  dependencies: string[];
  x: number; // Canvas/SVG percentage position
  y: number;
}

export interface ContagionEdge {
  from: string;
  to: string;
  strength: 'HIGH' | 'MEDIUM' | 'LOW';
  exposureAmount: string;
}

export interface IncidentTimelineStep {
  time: string;
  title: string;
  description: string;
  status: 'COMPLETED' | 'ACTIVE' | 'PENDING';
}

export interface SecurityIncident {
  id: string;
  title: string;
  chain: string;
  chainId: ChainId;
  protocol: string;
  threatType: string;
  severity: SeverityLevel;
  riskScore: number;
  detectedAt: string;
  potentialExposure: string;
  connectedProtocolsCount: number;
  guardianStatus: 'IDLE' | 'ALERTED' | 'ACTIVE';
  multisigStatus: 'PENDING' | 'SIMULATED APPROVAL' | 'REJECTED';
  circuitBreakerStatus: 'STANDBY' | 'ENGAGED' | 'BYPASSED';
  timeline: IncidentTimelineStep[];
  isResolved: boolean;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  chain: string;
  chainId: ChainId;
  protocol: string;
  event: string;
  severity: SeverityLevel;
  action: string;
  status: 'COMPLETED' | 'QUEUED' | 'ACTIVE';
}

export interface MonitoredUser {
  wallet: string;
  transactionCount: number;
  riskLevel: SeverityLevel;
  lastActivity: string;
  threatStatus: 'MONITORED' | 'FLAGGED' | 'RESTRICTED' | 'CLEARED';
  notes: string;
}

export interface SystemMetrics {
  totalValueMonitored: string;
  collateralAtRisk: string;
  activeThreats: number;
  criticalThreats: number;
  p99Latency: string;
  mempoolThroughput: string;
  systemicHealthIndex: number;
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  severity: SeverityLevel;
  title: string;
  message: string;
  read: boolean;
  incidentId?: string;
  protocol?: string;
}

export interface SimulationStep {
  stepNumber: number;
  title: string;
  description: string;
  details?: string;
}

export type PageView =
  | 'overview'
  | 'mempool'
  | 'protocol-health'
  | 'contagion-map'
  | 'circuit-breaker'
  | 'user-monitoring'
  | 'incident-center'
  | 'audit-trail'
  | 'admin-control'
  | 'demo-mode';

export type UserRole = 'SUPER_ADMIN_HEAD' | 'SECURITY_ANALYST' | 'AUDITOR';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  role: UserRole;
  passwordHash: string; // In-memory/local mock hashed or stored password
  isFirstTimeUser: boolean;
  failedAttempts: number;
  lockUntil: number | null; // Timestamp (ms) until which the user is locked out
  lastLogin?: string;
  avatarUrl?: string;
}

export interface PasswordResetRequest {
  id: string;
  email: string;
  token: string;
  expiresAt: number;
  used: boolean;
  createdAt: string;
}

