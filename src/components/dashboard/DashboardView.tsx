import React from 'react';
import { useVisitor } from '../../context/VisitorContext';
import { 
  Users, 
  UserCheck, 
  Clock, 
  AlertTriangle, 
  Package, 
  ShieldAlert, 
  ArrowUpRight, 
  CheckCircle2, 
  LogIn, 
  UserPlus, 
  TabletSmartphone,
  AlertOctagon,
  Printer
} from 'lucide-react';
import { ActiveTab } from '../common/Sidebar';

export const DashboardView: React.FC<{ onNavigate: (tab: ActiveTab) => void }> = ({ onNavigate }) => {
  const { 
    visitors, 
    deliveries, 
    selectedSiteId, 
    sites, 
    checkInVisitor, 
    checkOutVisitor,
    setActiveBadgeToPrint,
    setActiveDossierVisitor,
    auditLogs
  } = useVisitor();

  const currentSite = sites.find(s => s.id === selectedSiteId) || sites[0];

  const siteVisitors = visitors.filter(v => v.siteId === selectedSiteId);
  const onSiteVisitors = siteVisitors.filter(v => v.status === 'checked_in' || v.status === 'overstay');
  const expectedVisitors = siteVisitors.filter(v => v.status === 'expected');
  const checkedOutVisitors = siteVisitors.filter(v => v.status === 'checked_out');
  const overstayVisitors = siteVisitors.filter(v => v.status === 'overstay');
  const pendingDeliveries = deliveries.filter(d => d.status === 'awaiting_pickup' && d.siteId === selectedSiteId);

  // Hourly presence distribution for today (08:00 to 18:00)
  const hourlyData = [
    { hour: '08:00', count: 3 },
    { hour: '09:00', count: 7 },
    { hour: '10:00', count: 11 },
    { hour: '11:00', count: 14 },
    { hour: '12:00', count: 12 },
    { hour: '13:00', count: 9 },
    { hour: '14:00', count: 13 },
    { hour: '15:00', count: onSiteVisitors.length },
    { hour: '16:00 (Est)', count: 8 },
    { hour: '17:00 (Est)', count: 4 },
  ];
  const maxHourly = 15;

  // Breakdown by visitor type
  const typeCounts = siteVisitors.reduce<Record<string, number>>((acc, v) => {
    acc[v.visitorType] = (acc[v.visitorType] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Top Banner: Facility Capacity & Quick Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-md p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">{currentSite.name}</h1>
            <span className="font-mono text-xs bg-slate-800 text-brand-300 px-2 py-0.5 rounded-sm border border-slate-700">
              {currentSite.code}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {currentSite.address} • Building Occupancy: <strong className="text-slate-200">{onSiteVisitors.length} / {currentSite.capacity}</strong> ({Math.round((onSiteVisitors.length / currentSite.capacity) * 100)}%)
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('preregister')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-md border border-brand-500 shadow-sm transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Pre-Register Visitor</span>
          </button>
          <button
            onClick={() => onNavigate('kiosk')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors"
          >
            <TabletSmartphone className="w-4 h-4 text-brand-400" />
            <span>Launch Kiosk iPad</span>
          </button>
          <button
            onClick={() => onNavigate('deliveries')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors"
          >
            <Package className="w-4 h-4 text-amber-400" />
            <span>Receive Package</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row (NO gradients, NO pills, sharp enterprise layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* On-Site */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase font-mono">
            <span>Currently On-Site</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{onSiteVisitors.length}</span>
            <span className="text-xs text-slate-400 font-mono">badges active</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Turnstiles synched</span>
          </div>
        </div>

        {/* Expected Today */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase font-mono">
            <span>Expected Today</span>
            <UserCheck className="w-4 h-4 text-brand-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{expectedVisitors.length}</span>
            <span className="text-xs text-slate-400 font-mono">pre-registered</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Next: Dmitri Petrov (16:00)
          </div>
        </div>

        {/* Overstay Alerts */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase font-mono">
            <span>Overstay Alerts</span>
            <AlertTriangle className={`w-4 h-4 ${overstayVisitors.length > 0 ? 'text-amber-400' : 'text-slate-500'}`} />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold font-mono ${overstayVisitors.length > 0 ? 'text-amber-400' : 'text-white'}`}>
              {overstayVisitors.length}
            </span>
            <span className="text-xs text-slate-400 font-mono">&gt;8 hrs on-site</span>
          </div>
          <div className={`mt-2 text-[11px] ${overstayVisitors.length > 0 ? 'text-amber-400 font-semibold' : 'text-slate-500'}`}>
            {overstayVisitors.length > 0 ? 'Security check dispatched' : 'All badges within time limit'}
          </div>
        </div>

        {/* Checked Out */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase font-mono">
            <span>Departed Today</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{checkedOutVisitors.length}</span>
            <span className="text-xs text-slate-400 font-mono">badges revoked</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            100% badges accounted for
          </div>
        </div>

        {/* Deliveries Waiting */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase font-mono">
            <span>Pending Mail</span>
            <Package className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{pendingDeliveries.length}</span>
            <span className="text-xs text-slate-400 font-mono">awaiting pickup</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-400">
            {pendingDeliveries.length > 0 ? 'Lockers notified' : 'No parcels waiting'}
          </div>
        </div>
      </div>

      {/* Middle Row: Hourly Presence & Visitor Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Traffic Bar Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-md p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                Facility Hourly Presence Pattern
              </h2>
              <p className="text-xs text-slate-400">Live head-count distribution across 24h operational cycle</p>
            </div>
            <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded-sm border border-slate-700">
              Peak: 11:00 (14 Visitors)
            </span>
          </div>

          {/* Crisp SVG / CSS Bars */}
          <div className="h-48 flex items-end gap-3 pt-6 pb-2 px-2 border-b border-slate-800">
            {hourlyData.map((item, idx) => {
              const heightPercent = Math.round((item.count / maxHourly) * 100);
              const isCurrent = item.hour.includes('15:00');
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-mono text-slate-400 group-hover:text-white transition-colors">
                    {item.count}
                  </span>
                  <div 
                    className={`w-full rounded-sm transition-all duration-300 ${
                      isCurrent 
                        ? 'bg-brand-500 hover:bg-brand-400' 
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                    title={`${item.hour}: ${item.count} visitors`}
                  />
                  <span className="text-[9px] font-mono text-slate-500 truncate w-full text-center">
                    {item.hour.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-brand-500 rounded-sm"></span>
                <span className="text-[11px]">Current Hour (15:00)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-slate-700 rounded-sm"></span>
                <span className="text-[11px]">Recorded Timeline</span>
              </div>
            </div>
            <span className="text-[11px] font-mono">Turnstile Ingestion Rate: 1.4/min</span>
          </div>
        </div>

        {/* Breakdown By Type */}
        <div className="bg-slate-900 border border-slate-800 rounded-md p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-1">
              Visitor Demographics
            </h2>
            <p className="text-xs text-slate-400 mb-4">Classification by operational clearance</p>

            <div className="space-y-3">
              {Object.entries(typeCounts).map(([type, count]) => {
                const percentage = Math.round((count / siteVisitors.length) * 100);
                return (
                  <div key={type} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{type}</span>
                      <span className="text-slate-400 font-mono">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-sm overflow-hidden border border-slate-800">
                      <div 
                        className="bg-brand-600 h-full rounded-sm"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Total Registry Records:</span>
            <span className="font-mono font-bold text-slate-200">{siteVisitors.length}</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Active On-Site Visitors Table + Real-time Movement Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* On-Site Visitors Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-md p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                Currently On-Site Personnel
              </h2>
              <p className="text-xs text-slate-400">Badges requiring physical checkout or surveillance</p>
            </div>
            <button
              onClick={() => onNavigate('visitors')}
              className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
            >
              <span>View Full Registry</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                  <th className="py-2.5 px-3">Visitor</th>
                  <th className="py-2.5 px-3">Badge & Zone</th>
                  <th className="py-2.5 px-3">Host Sponsor</th>
                  <th className="py-2.5 px-3">Check-In</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {onSiteVisitors.map(v => (
                  <tr key={v.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200">{v.fullName}</div>
                      <div className="text-[11px] text-slate-400">{v.company}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-mono text-brand-300 font-bold">{v.badgeNumber}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[130px]">{v.accessZones[0]}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-200">{v.hostName}</div>
                      <div className="text-[10px] text-slate-400">{v.hostDepartment}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {v.checkInTime ? new Date(v.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </td>
                    <td className="py-3 px-3">
                      {v.status === 'overstay' ? (
                        <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm">
                          OVERSTAY
                        </span>
                      ) : (
                        <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm">
                          ON-SITE
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right space-x-1">
                      <button
                        onClick={() => setActiveBadgeToPrint(v)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-sm border border-slate-700 transition-colors"
                        title="Print Badge"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => checkOutVisitor(v.id)}
                        className="px-2 py-1 bg-slate-800 hover:bg-red-950 hover:text-red-300 hover:border-red-800 text-slate-300 rounded-sm border border-slate-700 text-[11px] font-semibold transition-colors"
                      >
                        Check Out
                      </button>
                      <button
                        onClick={() => setActiveDossierVisitor(v)}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-sm border border-slate-700 text-[11px] font-semibold transition-colors"
                      >
                        Dossier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Operational Movement Stream */}
        <div className="bg-slate-900 border border-slate-800 rounded-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Live Security Telemetry
            </h2>
            <span className="w-2 h-2 rounded-sm bg-emerald-500 animate-pulse"></span>
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {auditLogs.slice(0, 7).map(log => (
              <div key={log.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-md text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[9px] font-mono font-bold px-1 py-0.2 rounded-sm ${
                    log.severity === 'DANGER' ? 'bg-red-950 text-red-300 border border-red-800' :
                    log.severity === 'WARN' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-slate-800 text-brand-300'
                  }`}>
                    {log.action}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">{log.details}</p>
                <div className="mt-1 text-[10px] text-slate-500 font-mono">Terminal: {log.actor}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

