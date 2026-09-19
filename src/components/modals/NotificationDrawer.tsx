import React from 'react';
import { X, Bell, CheckCheck, AlertTriangle, ShieldAlert, ArrowRight } from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';
import { Badge } from '../common/Badge';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationDrawerOpen,
    toggleNotificationDrawer,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    openReportModal,
    incidents,
    setCurrentPage,
  } = useSecurity();

  if (!isNotificationDrawerOpen) return null;

  const handleNotificationClick = (notifId: string, incidentId?: string, protocol?: string) => {
    markNotificationRead(notifId);
    toggleNotificationDrawer(false);
    if (incidentId) {
      const inc = incidents.find((i) => i.id === incidentId);
      if (inc) {
        openReportModal(inc);
        return;
      }
    }
    if (protocol) {
      setCurrentPage('protocol-health');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#04070D]/70 backdrop-blur-sm transition-opacity"
        onClick={() => toggleNotificationDrawer(false)}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#090F1C] border-l border-cyan-500/20 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-cyan-950/50 border border-cyan-500/30 text-cyan-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  SECURITY NOTIFICATIONS
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  {notifications.filter((n) => !n.read).length} UNREAD ALERTS
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={markAllNotificationsRead}
                title="Mark all as read"
                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors text-xs font-mono flex items-center gap-1"
              >
                <CheckCheck className="w-4 h-4" />
                <span className="hidden sm:inline">READ ALL</span>
              </button>
              <button
                onClick={() => toggleNotificationDrawer(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-mono text-xs">
                NO ACTIVE NOTIFICATIONS
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif.id, notif.incidentId, notif.protocol)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    notif.read
                      ? 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
                      : 'bg-slate-900/90 border-cyan-500/30 text-slate-200 hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.08)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge severity={notif.severity}>{notif.severity}</Badge>
                    <span className="text-[10px] font-mono text-slate-500">{notif.timestamp}</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white leading-snug">{notif.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px]">
                    <span className="font-mono text-cyan-400 font-semibold">{notif.protocol || 'All Protocols'}</span>
                    <span className="text-slate-500 hover:text-cyan-300 flex items-center gap-1 font-mono text-[10px]">
                      VIEW INCIDENT <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>ENCLAVE INGRESS: ONLINE</span>
            <Badge variant="simulated">DEMO ALERTS</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
