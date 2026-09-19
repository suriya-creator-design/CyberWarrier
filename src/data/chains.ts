import { ChainOption } from '../types';

export const CHAINS: ChainOption[] = [
  { id: 'ALL', name: 'ALL CHAINS', symbol: 'ALL', iconColor: '#00F0FF' },
  { id: 'ETHEREUM', name: 'Ethereum Mainnet', symbol: 'ETH', iconColor: '#627EEA' },
  { id: 'ARBITRUM', name: 'Arbitrum One', symbol: 'ARB', iconColor: '#28A0F0' },
  { id: 'BASE', name: 'Base', symbol: 'BASE', iconColor: '#0052FF' },
  { id: 'OPTIMISM', name: 'Optimism', symbol: 'OP', iconColor: '#FF0420' },
  { id: 'POLYGON', name: 'Polygon PoS', symbol: 'POL', iconColor: '#8247E5' },
];
