import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { SecurityProvider, useSecurity } from './context/SecurityContext';
import { MainLayout } from './layouts/MainLayout';
import { OverviewPage } from './pages/OverviewPage';
import { MempoolRadarPage } from './pages/MempoolRadarPage';
import { ProtocolHealthPage } from './pages/ProtocolHealthPage';
import { ContagionMapPage } from './pages/ContagionMapPage';
import { CircuitBreakerPage } from './pages/CircuitBreakerPage';
import { UserMonitoringPage } from './pages/UserMonitoringPage';
import { IncidentCenterPage } from './pages/IncidentCenterPage';
import { AuditTrailPage } from './pages/AuditTrailPage';
import { AdminControlPage } from './pages/AdminControlPage';
import { DemoModePage } from './pages/DemoModePage';

const PageRenderer: React.FC = () => {
  const { currentPage } = useSecurity();

  switch (currentPage) {
    case 'overview':
      return <OverviewPage />;
    case 'mempool':
      return <MempoolRadarPage />;
    case 'protocol-health':
      return <ProtocolHealthPage />;
    case 'contagion-map':
      return <ContagionMapPage />;
    case 'circuit-breaker':
      return <CircuitBreakerPage />;
    case 'user-monitoring':
      return <UserMonitoringPage />;
    case 'incident-center':
      return <IncidentCenterPage />;
    case 'audit-trail':
      return <AuditTrailPage />;
    case 'admin-control':
      return <AdminControlPage />;
    case 'demo-mode':
      return <DemoModePage />;
    default:
      return <OverviewPage />;
  }
};

export function App() {
  return (
    <AuthProvider>
      <SecurityProvider>
        <MainLayout>
          <PageRenderer />
        </MainLayout>
      </SecurityProvider>
    </AuthProvider>
  );
}

export default App;


