# 🛡️ Sentinel Protocol - Web3 Autonomous Security & Circuit Breaker Dashboard

> **Autonomous Real-Time Threat Detection, Mempool Surveillance, & Contagion Containment for DeFi Protocols**

---

## 🌟 Overview

**Sentinel Protocol** is an enterprise-grade Web3 security operations dashboard designed to monitor, detect, and mitigate critical vulnerabilities and exploits across multi-chain smart contracts in real time. 

Built for decentralized protocols, security auditors, and DeFi risk managers, Sentinel provides automated circuit breakers, live mempool attack vector tracing, collateral contagion maps, and emergency pause orchestration.

---

## 🚀 Key Features

- **⚡ Live Mempool Radar:** Real-time monitoring of pending transactions, front-running bots, sandwich attacks, and flash-loan exploit patterns before block confirmation.
- **🏥 Protocol Health & TVL Risk:** Real-time health factor tracking, liquidation thresholds, and debt pool utilization metrics.
- **🌐 Contagion Map:** Interactive visualization of interconnected liquidity pools and systemic risk vectors across protocols.
- **🛑 Autonomous Circuit Breakers:** Configurable automated fail-safes that trigger emergency pause mechanisms when anomalous drawdowns or exploit signatures are detected.
- **👥 User & Whale Monitoring:** Granular wallet analytics, suspicious transaction alerts, and large-stake movement tracking.
- **🚨 Incident Center:** Incident response coordination center with automated post-mortem log generation and EVM trace decompilation.
- **📜 Cryptographic Audit Trail:** Immutable, tamper-evident audit logs of all governance and administrative security actions.
- **🎮 Interactive Demo Mode:** Built-in attack simulation sandbox (Flash Loan attack, Oracle manipulation, Reentrancy) to demonstrate protocol resilience and circuit-breaker tripping.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS, Lucide Icons, Glassmorphism UI
- **Architecture:** Modular Context-driven state management (`SecurityContext`, `AuthContext`)
- **Performance:** Sub-second telemetry updates with optimized UI rendering

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation & Local Run

```bash
# 1. Clone the repository
git clone https://github.com/jayasuryacs25-netizen/CyberWarrier.git

# 2. Navigate to project directory
cd CyberWarrier

# 3. Install dependencies
npm install

# 4. Launch development server
npm run dev -- --host
```

Once running, access the dashboard at `http://localhost:5173`.

---

## 🧪 Demo Mode for Judges

To quickly test the protocol defenses during evaluation:
1. Navigate to the **Demo Mode** tab in the sidebar.
2. Select an exploit vector (e.g., *Flash Loan Price Oracle Exploit*).
3. Click **Simulate Attack**.
4. Observe the automated **Circuit Breaker** trigger, isolating the compromised pool and halting unauthorized drainage in milliseconds.
