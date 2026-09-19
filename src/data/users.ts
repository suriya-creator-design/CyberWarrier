import { MonitoredUser } from '../types';

export const MONITORED_USERS: MonitoredUser[] = [
  {
    wallet: '0x71A...92F4b',
    transactionCount: 42,
    riskLevel: 'HIGH',
    lastActivity: '2 mins ago',
    threatStatus: 'MONITORED',
    notes: 'Repeated flash-loan bundle deployments across Aave and Curve with dynamic caller contracts.',
  },
  {
    wallet: '0x38C...11D9e',
    transactionCount: 128,
    riskLevel: 'CRITICAL',
    lastActivity: '4 mins ago',
    threatStatus: 'FLAGGED',
    notes: 'Associated with known MEV searcher infrastructure executing sandwich attacks on Uniswap V3.',
  },
  {
    wallet: '0x99F...8820a',
    transactionCount: 19,
    riskLevel: 'MEDIUM',
    lastActivity: '12 mins ago',
    threatStatus: 'MONITORED',
    notes: 'Large collateral withdrawals from Compound pools within narrow block intervals.',
  },
  {
    wallet: '0x44D...7301c',
    transactionCount: 5,
    riskLevel: 'LOW',
    lastActivity: '25 mins ago',
    threatStatus: 'CLEARED',
    notes: 'Standard cross-chain bridge transfer via official Arbitrum bridge contract.',
  },
  {
    wallet: '0x12B...E0391',
    transactionCount: 84,
    riskLevel: 'CRITICAL',
    lastActivity: '1 min ago',
    threatStatus: 'RESTRICTED',
    notes: 'Pre-execution bytecode analyzer detected reentrancy exploit payload directed at GMX router.',
  },
  {
    wallet: '0x88A...C1944',
    transactionCount: 31,
    riskLevel: 'MEDIUM',
    lastActivity: '45 mins ago',
    threatStatus: 'MONITORED',
    notes: 'High slippage swaps routed through Curve 3Pool with abnormal priority gas bribes.',
  },
];
