import React from 'react';
import { useVisitor } from '../../context/VisitorContext';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  TabletSmartphone, 
  Package, 
  Briefcase, 
  ShieldAlert, 
  AlertOctagon, 
  FileText, 
  Settings,
  Radio
} from 'lucide-react';

export type ActiveTab = 
  | 'dashboard'
  | 'visitors'
  | 'preregister'
  | 'kiosk'
  | 'deliveries'
  | 'hosts'
  | 'watchlist'
  | 'evacuation'
  | 'audit'
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const { visitors, deliveries, watchlist, isEvacuationActive, selectedSiteId } = useVisitor();

  const activeVisitorsCount = visitors.filter(
    v => (v.status === 'checked_in' || v.status === 'overstay') && v.siteId === selectedSiteId
  ).length;

  const pendingDeliveries = deliveries.filter(
    d => d.status === 'awaiting_pickup' && d.siteId === selectedSiteId
  ).length;

  const criticalWatchlistCount = watchlist.filter(
    w => w.severity === 'CRITICAL'
  ).length;

  const navItems = [
    {
      group: 'OPERATIONS',
      items: [
        {
          id: 'dashboard' as ActiveTab,
          label: 'Command Dashboard',
          icon: LayoutDashboard,
          badge: null
        },
        {
          id: 'visitors' as ActiveTab,
          label: 'Visitor Registry',
          icon: Users,
          badge: activeVisitorsCount > 0 ? `${activeVisitorsCount} On-Site` : null,
          badgeColor: 'bg-emerald-950 text-emerald-300 border border-emerald-800'
        },
        {
          id: 'preregister' as ActiveTab,
          label: 'Pre-Registration & Invites',
          icon: UserPlus,
          badge: null
        },
        {
          id: 'kiosk' as ActiveTab,
          label: 'Reception Kiosk (iPad)',
          icon: TabletSmartphone,
          badge: 'Self-Serve',
          badgeColor: 'bg-brand-950 text-brand-300 border border-brand-800'
        },
        {
          id: 'deliveries' as ActiveTab,
          label: 'Courier & Package Log',
          icon: Package,
          badge: pendingDeliveries > 0 ? `${pendingDeliveries} Pending` : null,
          badgeColor: 'bg-amber-950 text-amber-300 border border-amber-800'
        },
        {
          id: 'hosts' as ActiveTab,
          label: 'Host Staff Directory',
          icon: Briefcase,
          badge: null
        }
      ]
    },
    {
      group: 'SECURITY & RESILIENCE',
      items: [
        {
          id: 'watchlist' as ActiveTab,
          label: 'Watchlist & Denied List',
          icon: ShieldAlert,
          badge: criticalWatchlistCount > 0 ? `${criticalWatchlistCount} Denied` : null,
          badgeColor: 'bg-red-950 text-red-300 border border-red-800'
        },
        {
          id: 'evacuation' as ActiveTab,
          label: 'Emergency Muster Call',
          icon: AlertOctagon,
          badge: isEvacuationActive ? 'ACTIVE ALARM' : 'Ready',
          badgeColor: isEvacuationActive ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-800 text-slate-400'
        },
        {
          id: 'audit' as ActiveTab,
          label: 'Security Audit Trail',
          icon: FileText,
          badge: null
        }
      ]
    },
    {
      group: 'CONFIGURATION',
      items: [
        {
          id: 'settings' as ActiveTab,
          label: 'Badge & Site Policies',
          icon: Settings,
          badge: null
        }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
      <div className="py-4 overflow-y-auto">
        {navItems.map((group, groupIdx) => (
          <div key={groupIdx} className="mb-6">
            <div className="px-4 mb-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase font-mono">
              {group.group}
            </div>
            <nav className="space-y-0.5 px-2">
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-all ${
                      isActive
                        ? 'bg-slate-800 text-white border-l-4 border-brand-500 shadow-sm font-semibold'
                        : 'text-slate-300 hover:bg-slate-850 hover:text-white border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-sm shrink-0 ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Terminal Hardware Status Footer */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hardware Sync: ONLINE</span>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-1 py-0.5 rounded-sm">24ms</span>
        </div>
        <div className="text-[10px] text-slate-500 space-y-0.5">
          <div className="flex justify-between">
            <span>Badge Printer:</span>
            <span className="text-emerald-400 font-mono">Zebra ZD621 (Ready)</span>
          </div>
          <div className="flex justify-between">
            <span>Turnstile Access:</span>
            <span className="text-emerald-400 font-mono">Wiegand/OSDP (Armed)</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

