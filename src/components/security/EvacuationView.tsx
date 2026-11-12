import React, { useState } from 'react';
import { useVisitor } from '../../context/VisitorContext';
import { 
  AlertOctagon, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Printer, 
  Volume2, 
  VolumeX, 
  Search, 
  UserCheck, 
  MapPin, 
  Flame,
  FileCheck
} from 'lucide-react';

export const EvacuationView: React.FC = () => {
  const { 
    isEvacuationActive, 
    triggerEmergencyAlarm, 
    silenceEmergencyAlarm, 
    evacuationList, 
    toggleEvacuationSafe, 
    markAllEvacueesSafe,
    selectedSiteId,
    sites
  } = useVisitor();

  const currentSite = sites.find(s => s.id === selectedSiteId) || sites[0];

  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const totalEvacuees = evacuationList.length;
  const safeCount = evacuationList.filter(e => e.isSafe).length;
  const missingCount = totalEvacuees - safeCount;

  const filtered = evacuationList.filter(rec => {
    const matchesSearch = 
      rec.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.hostName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = zoneFilter === 'all' ? true : rec.zone.includes(zoneFilter);
    return matchesSearch && matchesZone;
  });

  const handlePrintManifest = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Alarm Status Banner */}
      <div className={`p-6 border rounded-md transition-colors ${
        isEvacuationActive 
          ? 'bg-red-950 border-red-600 text-white' 
          : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-md flex items-center justify-center shrink-0 ${
              isEvacuationActive ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-800 text-red-400'
            }`}>
              <AlertOctagon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">
                  {isEvacuationActive ? 'EMERGENCY EVACUATION IN PROGRESS' : 'Emergency Muster & Evacuation System'}
                </h1>
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm font-bold border ${
                  isEvacuationActive ? 'bg-red-600 text-white border-red-500 animate-pulse' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {isEvacuationActive ? 'ALARM BROADCASTING' : 'STANDBY MODE'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Facility: {currentSite.name} • Assembly Area: <strong className="text-white">North Lawn Muster Station B</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isEvacuationActive ? (
              <button
                onClick={silenceEmergencyAlarm}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase rounded-md border border-slate-700 transition-colors"
              >
                <VolumeX className="w-4 h-4" />
                <span>Stand Down Alarm</span>
              </button>
            ) : (
              <button
                onClick={triggerEmergencyAlarm}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider rounded-md border border-red-500 shadow-lg transition-colors"
              >
                <Flame className="w-4 h-4 text-white animate-bounce" />
                <span>Trigger Facility Evacuation</span>
              </button>
            )}

            <button
              onClick={handlePrintManifest}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-md border border-slate-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Fire Marshal Manifest</span>
            </button>
          </div>
        </div>
      </div>

      {/* Headcount Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-md">
          <div className="text-xs font-mono uppercase text-slate-400">Total Personnel Inside Facility</div>
          <div className="text-3xl font-extrabold font-mono text-white mt-1">{totalEvacuees}</div>
          <div className="text-[11px] text-slate-500 mt-1">Active badge turnstile scans</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-md">
          <div className="text-xs font-mono uppercase text-slate-400">Verified Safe at Assembly Area</div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-1">{safeCount}</div>
          <div className="text-[11px] text-emerald-400/80 mt-1">
            {totalEvacuees > 0 ? Math.round((safeCount / totalEvacuees) * 100) : 100}% accounted for
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-md">
          <div className="text-xs font-mono uppercase text-slate-400">Unaccounted / Missing</div>
          <div className={`text-3xl font-extrabold font-mono mt-1 ${missingCount > 0 ? 'text-red-400 animate-pulse' : 'text-slate-400'}`}>
            {missingCount}
          </div>
          <div className={`text-[11px] mt-1 ${missingCount > 0 ? 'text-red-400 font-semibold' : 'text-slate-500'}`}>
            {missingCount > 0 ? 'Requires search & rescue verification' : 'All visitors confirmed accounted for'}
          </div>
        </div>
      </div>

      {/* Filter and Bulk Action Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-md p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by person name..."
              className="w-full bg-slate-950 border border-slate-700 rounded-sm pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
          </div>

          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-sm px-3 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Access Zones</option>
            <option value="L18">L18 Lobby Area</option>
            <option value="L22">L22 Engineering Core</option>
            <option value="L24">L24 Executive Penthouse</option>
            <option value="Elevator">Machine Room / Penthouse</option>
          </select>
        </div>

        <button
          onClick={markAllEvacueesSafe}
          className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-md border border-emerald-500 shadow-sm transition-colors flex items-center justify-center gap-1.5"
        >
          <FileCheck className="w-4 h-4" />
          <span>Bulk Verify All Evacuees Safe</span>
        </button>
      </div>

      {/* Roll Call Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                <th className="py-3 px-4">Visitor / Subject</th>
                <th className="py-3 px-3">Last Known Access Zone</th>
                <th className="py-3 px-3">Host Sponsor</th>
                <th className="py-3 px-3">Entry Time</th>
                <th className="py-3 px-3">Muster Status</th>
                <th className="py-3 px-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(rec => (
                <tr key={rec.visitorId} className={`hover:bg-slate-850/60 transition-colors ${!rec.isSafe ? 'bg-red-950/20' : ''}`}>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-100">{rec.fullName}</div>
                    <div className="text-[11px] text-slate-400">{rec.company} ({rec.visitorType})</div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-mono text-brand-300 font-semibold bg-slate-950 px-2 py-0.5 rounded-sm border border-slate-800">
                      {rec.zone}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="text-slate-200">{rec.hostName}</div>
                    <div className="text-[10px] text-slate-400">{rec.hostDepartment}</div>
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-400">
                    {new Date(rec.checkedInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>

                  <td className="py-3 px-3">
                    {rec.isSafe ? (
                      <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ACCOUNTED SAFE
                      </span>
                    ) : (
                      <span className="bg-red-950 text-red-300 border border-red-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm flex items-center gap-1 w-fit animate-pulse">
                        <XCircle className="w-3 h-3 text-red-400" />
                        UNACCOUNTED
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => toggleEvacuationSafe(rec.visitorId)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-sm border transition-colors ${
                        rec.isSafe
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-sm'
                      }`}
                    >
                      {rec.isSafe ? 'Unmark Safe' : 'Mark As Safe'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

