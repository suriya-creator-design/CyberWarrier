import { PageView } from '../types';

export interface DemoStepItem {
  step: number;
  title: string;
  targetPage: PageView;
  targetAction?: string;
  actionButtonText?: string;
  description: string;
  guidance: string;
}

export const DEMO_STEPS: DemoStepItem[] = [
  {
    step: 1,
    title: 'Select Chain Environment',
    targetPage: 'overview',
    description: 'Filter telemetry by chain or aggregate across all connected protocols.',
    guidance: 'Observe the Top Bar Chain Selector. Switch to "Ethereum Mainnet" or "ALL CHAINS" to see cross-chain aggregated values.',
  },
  {
    step: 2,
    title: 'Open Mempool Radar',
    targetPage: 'mempool',
    description: 'Inspect pre-execution pending transactions streamed before block inclusion.',
    guidance: 'Navigate to the Mempool Radar. View incoming simulated transactions, risk scores, and latency metrics.',
  },
  {
    step: 3,
    title: 'Launch Simulate Exploit',
    targetPage: 'mempool',
    targetAction: 'simulate-exploit',
    actionButtonText: 'Run Exploit Simulation',
    description: 'Trigger the pre-execution attack detection sequence.',
    guidance: 'Click "SIMULATE EXPLOIT" to launch the 8-step interactive detection pipeline in the pre-execution sandbox.',
  },
  {
    step: 4,
    title: 'Show Threat Detection',
    targetPage: 'mempool',
    description: 'Review the classified CRITICAL threat (Flash Loan Anomaly - 94/100).',
    guidance: 'The attack is caught in pre-execution! Notice the risk score of 94/100, $14.2M potential loss, and CRITICAL status.',
  },
  {
    step: 5,
    title: 'Open Why Detected?',
    targetPage: 'mempool',
    targetAction: 'why-detected',
    actionButtonText: 'Inspect Heuristic Signals',
    description: 'Deconstruct the heuristic scoring breakdown into transparent signals.',
    guidance: 'Click "WHY DETECTED?" on the Aave V3 threat to inspect the signal breakdown (+35 Flash loan, +25 Liquidity imbalance, etc.).',
  },
  {
    step: 6,
    title: 'Show Protocol Health Matrix',
    targetPage: 'protocol-health',
    description: 'Analyze systemic health, collateral exposure, and concentration risks.',
    guidance: 'Examine the Systemic Health Index (82/100) and compare Aave V3, Curve, Lido, Compound, Uniswap, and GMX.',
  },
  {
    step: 7,
    title: 'Simulate Contagion Cascade',
    targetPage: 'contagion-map',
    targetAction: 'simulate-cascade',
    actionButtonText: 'Simulate Cascade Wave',
    description: 'Model risk propagation across interconnected lending pools and AMMs.',
    guidance: 'Click "SIMULATE CASCADE" to see the visual cascade wave: Aave → Curve → Compound ($480M estimated exposure).',
  },
  {
    step: 8,
    title: 'Open Circuit Breaker',
    targetPage: 'circuit-breaker',
    description: 'Access the Emergency Guardian Pause Dispatcher for automated response.',
    guidance: 'Review the protocol target list and pre-configured pause triggers for Aave V3 Core.',
  },
  {
    step: 9,
    title: 'Trigger Guardian Response',
    targetPage: 'circuit-breaker',
    targetAction: 'trigger-guardian',
    actionButtonText: 'Trigger Guardian Pause',
    description: 'Execute the simulated multi-sig guardian pause action.',
    guidance: 'Click "TRIGGER GUARDIAN PAUSE" to execute the 4-step emergency pause response on Aave V3.',
  },
  {
    step: 10,
    title: 'Show Security Incident Report',
    targetPage: 'incident-center',
    targetAction: 'open-report',
    actionButtonText: 'Generate Dossier',
    description: 'Review the full incident timeline and generate a printable security dossier.',
    guidance: 'Open the printable Incident Report containing all timestamps, detection methods, guardian actions, and audit logs.',
  },
];
