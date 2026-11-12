import React, { useState } from 'react';
import { useVisitor } from '../../context/VisitorContext';
import { 
  Briefcase, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  Users, 
  UserPlus, 
  CheckCircle2, 
  XCircle,
  Building 
} from 'lucide-react';
import { ActiveTab } from '../common/Sidebar';

export const HostDirectoryView: React.FC<{ onNavigate: (tab: ActiveTab) => void }> = ({ onNavigate }) => {
  const { hosts, visitors, selectedSiteId } = useVisitor();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');

  const departments = Array.from(new Set(hosts.map(h => h.department)));

  const filteredHosts = hosts.filter(h => {
    const matchesSearch = 
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'all' ? true : h.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  // Calculate active visitors per host
  const getHostActiveVisitors = (hostId: string) => {
    return visitors.filter(
      v => v.hostId === hostId && (v.status === 'checked_in' || v.status === 'overstay') && v.siteId === selectedSiteId
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-md p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Host Employee Directory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Registered internal hosts, active visitor loads, floor desk locations, and notification channels
          </p>
        </div>

        <button
          onClick={() => onNavigate('preregister')}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-md border border-brand-500 shadow-sm transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Guest for Host</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="bg-slate-900 border border-slate-800 rounded-md p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search host by name, role, department, or desk number..."
            className="w-full bg-slate-950 border border-slate-700 rounded-sm pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 font-medium"
          />
        </div>

        <div className="w-full sm:w-60">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Host Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHosts.map(host => {
          const activeVisitors = getHostActiveVisitors(host.id);

          return (
            <div 
              key={host.id} 
              className="bg-slate-900 border border-slate-800 rounded-md p-5 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-slate-800 border border-slate-700 rounded-md flex items-center justify-center font-bold text-slate-200 text-sm font-mono shrink-0">
                      {host.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">{host.name}</h3>
                      <p className="text-xs text-brand-400 font-medium">{host.role}</p>
                      <p className="text-[11px] text-slate-400">{host.department}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-sm font-bold border ${
                    host.isAvailable 
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {host.isAvailable ? 'AVAILABLE' : 'IN MEETING'}
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-sm border border-slate-800 space-y-1.5 text-xs text-slate-300 font-mono mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{host.floor} • {host.officeNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{host.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{host.phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-400">Active Visitors:</span>
                  <span className={`font-mono font-bold ${activeVisitors.length > 0 ? 'text-brand-300' : 'text-slate-500'}`}>
                    {activeVisitors.length}
                  </span>
                </div>

                <button
                  onClick={() => onNavigate('preregister')}
                  className="px-2.5 py-1 text-[11px] font-semibold text-brand-400 hover:text-white bg-slate-800 hover:bg-brand-600 rounded-sm border border-slate-700 transition-colors"
                >
                  Schedule Visit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

