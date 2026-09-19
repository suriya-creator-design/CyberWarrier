import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User, Code, ShieldCheck, Copy, Check, MessageSquare } from 'lucide-react';
import { Badge } from '../common/Badge';

interface Message {
  sender: 'ai' | 'user';
  text: string;
  codeSnippet?: string;
  timestamp: string;
}

const PRESET_PROMPTS = [
  { label: '⚡ Explain Aave Flash Loan Vector', prompt: 'Explain how the Aave V3 flash loan vector is identified in pre-execution.' },
  { label: '🛡️ Generate Solidity Pause Patch', prompt: 'Generate a Solidity circuit breaker emergency pause modifier for Aave V3 pool.' },
  { label: '🌊 Simulate 50% Liquidity Shock', prompt: 'What happens if Curve 3Pool experiences a 50% collateral shock?' },
  { label: '📢 Draft Emergency Disclosure', prompt: 'Draft a public security disclosure statement for the Sentinel Guardian pause.' },
];

const PRESET_ANSWERS: Record<string, { text: string; codeSnippet?: string }> = {
  'Explain how the Aave V3 flash loan vector is identified in pre-execution.': {
    text: `The Aave V3 Flash Loan vector is identified in the mempool before block inclusion through a 4-point heuristic correlation:

1. **Uncollateralized Borrow Volume**: An atomic single-block transaction borrows $85M USDC across 3 distinct lending pools without providing prior collateral.
2. **State Diff Simulation**: The pre-execution EVM sandbox evaluates storage slot \`0x3b\` (\`poolReserves[USDC]\`), detecting that the post-execution reserve drops by 99.7% before repayment validation.
3. **Spot Price Dislocation**: AMM spot price deviates by 14.8% from off-chain Chainlink decentralized oracle feeds.
4. **Bytecode Reentrancy**: The calling contract executes multiple callbacks within 280ms before state mutex locks.`,
  },
  'Generate a Solidity circuit breaker emergency pause modifier for Aave V3 pool.': {
    text: `Here is a production-grade Solidity emergency circuit-breaker modifier integrating Sentinel Guardian pre-execution signatures:`,
    codeSnippet: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract SentinelCircuitBreaker is AccessControl {
    bytes32 public constant GUARDIAN_ROLE = keccak256("GUARDIAN_ROLE");
    bool public circuitPaused;
    uint256 public constant MAX_SLIPPAGE_TOLERANCE = 500; // 5.00%

    event CircuitBreakerTriggered(address indexed guardian, string reason, uint256 timestamp);

    modifier whenNotPaused() {
        require(!circuitPaused, "Sentinel: Circuit breaker engaged - protocol paused");
        _;
    }

    /// @notice Executed by Sentinel Guardian hardware enclaves upon pre-execution threat
    function triggerEmergencyPause(
        bytes calldata signature,
        string calldata threatVector
    ) external onlyRole(GUARDIAN_ROLE) {
        circuitPaused = true;
        emit CircuitBreakerTriggered(msg.sender, threatVector, block.timestamp);
    }
}`,
  },
  'What happens if Curve 3Pool experiences a 50% collateral shock?': {
    text: `**Simulation Analysis: 50% Collateral Shock on Curve 3Pool**

- **Direct Impact**: The pool's invariant curve shifts aggressively into unbalanced territory. DAI/USDC ratio skews from 1.0002 to 1.1480.
- **Contagion Propagation**: Aave and Compound positions using Curve LP tokens as collateral face immediate liquidation cascades totaling approximately $480M across 12 blocks.
- **Sentinel Recommendation**: Pre-emptively engage the Circuit Breaker pause on deposit/withdraw routes while leaving liquidation grace periods active to prevent bad debt accumulation.`,
  },
  'Draft a public security disclosure statement for the Sentinel Guardian pause.': {
    text: `**Sentinel Protocol — Security Advisory & Status Update**

**Status**: Guardian Circuit Breaker Engaged  
**Target Protocol**: Aave V3 Core Markets  
**Incident Ref**: INC-2026-0891  
**Timestamp**: 15:42:10 UTC  

"At 15:42:01 UTC, the Sentinel Protocol pre-execution threat radar identified an anomalous $85M flash-borrow vector targeting Aave V3 pools. In accordance with automated multi-sig enclave policy, a simulated Emergency Guardian Pause was broadcast to safeguard protocol liquidity. 

All user balances remain secure in pre-execution state. No collateral was liquidated. The security council is reviewing bytecode traces in the sandbox enclave."`,
  },
};

export const SentinelCopilot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Greetings, Security Operator. I am Sentinel Enclave AI — your real-time pre-execution threat analyst and remediation assistant. How can I assist your security triage?',
      timestamp: '15:42 UTC',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;

    const newMsg: Message = {
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');

    // Generate response
    setTimeout(() => {
      const match = PRESET_ANSWERS[userText] || {
        text: `Based on current pre-execution telemetry, our heuristic engine indicates that "${userText}" has been analyzed in the enclave sandbox. Composite systemic health remains at 82/100, and all guardian nodes are armed.`,
      };

      const aiResponse: Message = {
        sender: 'ai',
        text: match.text,
        codeSnippet: match.codeSnippet,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 600);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating Trigger Button in Bottom Right */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-[0_0_30px_rgba(6,182,212,0.5),0_10px_25px_rgba(0,0,0,0.6)] flex items-center gap-2 font-mono text-xs font-black transition-all hover:scale-105 group"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 fill-black animate-spin" style={{ animationDuration: '8s' }} />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
        <span className="hidden sm:inline">SENTINEL AI COPILOT</span>
      </button>

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[460px] h-[580px] rounded-2xl bg-[#090F1C]/95 border-2 border-cyan-500/40 shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.2)] backdrop-blur-xl flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black font-mono tracking-wider text-white flex items-center gap-1.5">
                  SENTINEL ENCLAVE AI
                  <Badge variant="simulated" size="sm">COPILOT</Badge>
                </h3>
                <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  PRE-EXECUTION THREAT MODEL V3
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-2.5 border-b border-slate-800/80 bg-slate-950/60 flex items-center gap-1.5 overflow-x-auto">
            {PRESET_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.prompt)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-[10px] font-mono whitespace-nowrap transition-all shrink-0"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-3 rounded-xl ${
                    msg.sender === 'user'
                      ? 'bg-cyan-500 text-black font-semibold'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                  {/* Code snippet if present */}
                  {msg.codeSnippet && (
                    <div className="mt-2.5 rounded-lg bg-[#04070D] border border-slate-800 p-2.5 font-mono text-[11px] text-cyan-300 overflow-x-auto relative">
                      <div className="flex justify-between items-center mb-1 text-[10px] text-slate-500 border-b border-slate-800 pb-1">
                        <span>Solidity Mitigation</span>
                        <button
                          onClick={() => handleCopyCode(msg.codeSnippet!)}
                          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {copied ? 'COPIED' : 'COPY'}
                        </button>
                      </div>
                      <code>{msg.codeSnippet}</code>
                    </div>
                  )}

                  <div
                    className={`text-[9px] font-mono mt-1 text-right ${
                      msg.sender === 'user' ? 'text-black/60' : 'text-slate-500'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-800 bg-slate-900/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Sentinel AI to analyze vector, generate patch, or simulate shock..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs font-sans focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black font-bold transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)]"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
