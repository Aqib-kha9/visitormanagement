import React, { useState, useEffect } from 'react';
import { useVisitor } from '../../context/VisitorContext';
import { 
  ShieldCheck, 
  Building2, 
  AlertOctagon, 
  Clock, 
  Bell, 
  CheckCircle2,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export const Header: React.FC<{ onNavigateToEvacuation?: () => void }> = ({ onNavigateToEvacuation }) => {
  const { 
    sites, 
    selectedSiteId, 
    setSelectedSiteId, 
    visitors, 
    isEvacuationActive, 
    triggerEmergencyAlarm, 
    silenceEmergencyAlarm,
    auditLogs
  } = useVisitor();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [showNotificationCenter, setShowNotificationCenter] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
      setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeVisitors = visitors.filter(v => (v.status === 'checked_in' || v.status === 'overstay') && v.siteId === selectedSiteId);
  const overstayCount = visitors.filter(v => v.status === 'overstay' && v.siteId === selectedSiteId).length;
  const flaggedCount = visitors.filter(v => v.isFlagged && v.siteId === selectedSiteId).length;

  const currentSite = sites.find(s => s.id === selectedSiteId) || sites[0];

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shrink-0 select-none z-30">
      {/* Brand & Facility Info */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-600 rounded-md flex items-center justify-center text-white font-bold shadow-sm">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-base text-white">AEGISPASS</span>
              <span className="text-[10px] uppercase font-mono tracking-widest bg-slate-800 text-brand-300 px-1.5 py-0.5 border border-slate-700 rounded-sm">
                VMS 4.2
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Enterprise Physical Identity & Access Registry</p>
          </div>
        </div>

        {/* Site Selector Dropdown */}
        <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-800">
          <Building2 className="w-4 h-4 text-slate-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Active Facility</span>
            <select
              value={selectedSiteId}
              onChange={(e) => setSelectedSiteId(e.target.value)}
              className="bg-slate-950 text-slate-200 text-xs font-semibold border border-slate-700 rounded-sm px-2.5 py-1 focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              {sites.map(site => (
                <option key={site.id} value={site.id}>
                  {site.name} ({site.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Center: Live Occupancy & Clock */}
      <div className="hidden md:flex items-center gap-6">
        {/* On-Site Status Indicator */}
        <div className="flex items-center gap-3 px-3.5 py-1.5 bg-slate-950 border border-slate-800 rounded-md">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-mono text-slate-300">
              <strong className="text-white font-bold">{activeVisitors.length}</strong> ON-SITE
            </span>
          </div>
          <span className="text-slate-700 text-xs">|</span>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-sm ${overstayCount > 0 ? 'bg-amber-500' : 'bg-slate-600'}`}></span>
            <span className={`text-xs font-mono ${overstayCount > 0 ? 'text-amber-300 font-bold' : 'text-slate-400'}`}>
              {overstayCount} OVERSTAY
            </span>
          </div>
          {flaggedCount > 0 && (
            <>
              <span className="text-slate-700 text-xs">|</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-red-500"></span>
                <span className="text-xs font-mono text-red-400 font-bold">
                  {flaggedCount} FLAGGED
                </span>
              </div>
            </>
          )}
        </div>

        {/* Digital Clock */}
        <div className="flex items-center gap-2 text-slate-300 text-xs font-mono bg-slate-950 px-3 py-1.5 border border-slate-800 rounded-md">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{currentTime}</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">{currentDate}</span>
        </div>
      </div>

      {/* Right: Emergency Button, Notifications, User profile */}
      <div className="flex items-center gap-3">
        {/* Evacuation Alert CTA */}
        {isEvacuationActive ? (
          <button
            onClick={() => {
              if (onNavigateToEvacuation) onNavigateToEvacuation();
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-md border border-red-500 animate-pulse transition-colors"
          >
            <AlertOctagon className="w-4 h-4 text-white" />
            <span>Active Evacuation In Progress</span>
          </button>
        ) : (
          <button
            onClick={() => {
              if (onNavigateToEvacuation) {
                onNavigateToEvacuation();
              } else {
                triggerEmergencyAlarm();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-red-950 hover:text-red-300 hover:border-red-800 text-slate-300 text-xs font-semibold rounded-md border border-slate-700 transition-colors"
            title="Initiate Emergency Roll Call / Facility Muster"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
            <span>Emergency Muster</span>
          </button>
        )}

        {/* Notification Center Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationCenter(!showNotificationCenter)}
            className="relative p-2 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-md transition-colors"
            title="System Audit & Alerts"
          >
            <Bell className="w-4 h-4" />
            {auditLogs.some(l => l.severity === 'DANGER') && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-sm"></span>
            )}
          </button>

          {/* Notification Center Popover */}
          {showNotificationCenter && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-md shadow-2xl z-50 overflow-hidden">
              <div className="px-3 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Live System Audit</span>
                <span className="text-[10px] text-slate-400 font-mono">Last 5 Events</span>
              </div>
              <div className="divide-y divide-slate-800 max-h-72 overflow-y-auto">
                {auditLogs.slice(0, 5).map(log => (
                  <div key={log.id} className="p-2.5 text-xs hover:bg-slate-850 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-mono font-bold px-1 py-0.2 rounded-sm ${
                        log.severity === 'DANGER' ? 'bg-red-950 text-red-300 border border-red-800' :
                        log.severity === 'WARN' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {log.action}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-2">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Identity */}
        <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-800">
          <div className="w-8 h-8 bg-slate-800 border border-slate-700 rounded-md flex items-center justify-center font-mono text-xs font-bold text-brand-300">
            DC
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-slate-200 leading-tight">David K. Chen</p>
            <p className="text-[10px] text-slate-400 font-mono">Security Lead • Console #1</p>
          </div>
        </div>
      </div>
    </header>
  );
};

