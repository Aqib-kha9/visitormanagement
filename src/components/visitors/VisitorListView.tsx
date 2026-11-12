import React, { useState } from 'react';
import { useVisitor } from '../../context/VisitorContext';
import { Visitor, VisitorStatus, VisitorType } from '../../types';
import { 
  Search, 
  Filter, 
  LogIn, 
  LogOut, 
  Printer, 
  FileText, 
  UserCheck, 
  Plus, 
  ShieldCheck, 
  AlertTriangle, 
  Trash2,
  Download,
  CheckCircle2,
  XCircle,
  Eye
} from 'lucide-react';

export const VisitorListView: React.FC = () => {
  const { 
    visitors, 
    selectedSiteId, 
    checkInVisitor, 
    checkOutVisitor, 
    setActiveBadgeToPrint, 
    setActiveDossierVisitor,
    deleteVisitor,
    hosts
  } = useVisitor();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | VisitorStatus>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | VisitorType>('all');
  const [showWalkInModal, setShowWalkInModal] = useState(false);

  // Walk-in form state
  const [walkInName, setWalkInName] = useState('');
  const [walkInEmail, setWalkInEmail] = useState('');
  const [walkInCompany, setWalkInCompany] = useState('');
  const [walkInHostId, setWalkInHostId] = useState(hosts[0]?.id || '');
  const [walkInPurpose, setWalkInPurpose] = useState('');
  const [walkInType, setWalkInType] = useState<VisitorType>('Client / Guest');

  const siteVisitors = visitors.filter(v => v.siteId === selectedSiteId);

  const filteredVisitors = siteVisitors.filter(v => {
    const matchesSearch = 
      v.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' ? true : v.status === statusFilter;
    const matchesType = typeFilter === 'all' ? true : v.visitorType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    const host = hosts.find(h => h.id === walkInHostId) || hosts[0];
    
    // We check-in immediately
    const newVisitor: Visitor = {
      id: `vis-${Date.now().toString().slice(-6)}`,
      fullName: walkInName,
      email: walkInEmail,
      phone: '+1 (415) 555-0100',
      company: walkInCompany,
      purpose: walkInPurpose || 'General Business Meeting',
      visitorType: walkInType,
      hostId: host.id,
      hostName: host.name,
      hostDepartment: host.department,
      hostEmail: host.email,
      expectedArrival: new Date().toISOString(),
      checkInTime: new Date().toISOString(),
      status: 'checked_in',
      badgeNumber: `V-${Math.floor(8800 + Math.random() * 900)}`,
      accessZones: ['L18 Lobby Area', `${host.floor} Conf Room`],
      ndaSigned: true,
      ndaSignatureDate: new Date().toISOString(),
      idVerified: true,
      idType: 'Govt ID',
      idNumberMasked: 'VERIFIED •• 901',
      escortRequired: false,
      wifiAccessCode: `APEX-PASS-${Math.floor(100 + Math.random() * 899)}`,
      siteId: selectedSiteId
    };

    visitors.unshift(newVisitor);
    setShowWalkInModal(false);
    setWalkInName('');
    setWalkInEmail('');
    setWalkInCompany('');
    setWalkInPurpose('');
    setActiveBadgeToPrint(newVisitor);
  };

  const getStatusBadge = (status: VisitorStatus) => {
    switch (status) {
      case 'checked_in':
        return <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm">ON-SITE</span>;
      case 'overstay':
        return <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm">OVERSTAY</span>;
      case 'checked_out':
        return <span className="bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm">DEPARTED</span>;
      case 'rejected':
        return <span className="bg-red-950 text-red-300 border border-red-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm">REJECTED</span>;
      default:
        return <span className="bg-brand-950 text-brand-300 border border-brand-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm">EXPECTED</span>;
    }
  };

  // Export CSV simulation
  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,Name,Company,Type,Badge,Host,CheckIn,Status\n" +
      filteredVisitors.map(v => `${v.id},"${v.fullName}","${v.company}","${v.visitorType}",${v.badgeNumber},"${v.hostName}",${v.checkInTime || ''},${v.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `apex_visitors_manifest_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-md p-5">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Visitor Security Registry</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time tracking, badge clearance, and movement logs for {siteVisitors.length} registered records
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowWalkInModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-md border border-brand-500 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Fast Walk-In Check-In</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-md p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by visitor name, company, badge #, or host sponsor..."
              className="w-full bg-slate-950 border border-slate-700 rounded-sm pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>

          {/* Type Dropdown */}
          <div className="w-full md:w-56">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="all">All Visitor Types</option>
              <option value="Client / Guest">Client / Guest</option>
              <option value="Contractor">Contractor</option>
              <option value="Job Interviewee">Job Interviewee</option>
              <option value="Vendor / Supplier">Vendor / Supplier</option>
              <option value="VIP Partner">VIP Partner</option>
              <option value="Board Member">Board Member</option>
              <option value="Auditor / Inspector">Auditor / Inspector</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-800">
          {[
            { id: 'all', label: 'All Records', count: siteVisitors.length },
            { id: 'checked_in', label: 'On-Site', count: siteVisitors.filter(v => v.status === 'checked_in').length },
            { id: 'overstay', label: 'Overstay Alert', count: siteVisitors.filter(v => v.status === 'overstay').length },
            { id: 'expected', label: 'Expected Today', count: siteVisitors.filter(v => v.status === 'expected').length },
            { id: 'checked_out', label: 'Departed', count: siteVisitors.filter(v => v.status === 'checked_out').length },
            { id: 'rejected', label: 'Denied Access', count: siteVisitors.filter(v => v.status === 'rejected').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1 text-xs font-medium rounded-sm border transition-colors flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-slate-800 text-white border-brand-500 font-semibold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-850 hover:text-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1 rounded-sm">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-md overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                <th className="py-3 px-4">Visitor Identification</th>
                <th className="py-3 px-3">Type & Zones</th>
                <th className="py-3 px-3">Badge Number</th>
                <th className="py-3 px-3">Host Sponsor</th>
                <th className="py-3 px-3">Time Window</th>
                <th className="py-3 px-3">Compliance</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredVisitors.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No visitor records match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredVisitors.map(v => (
                  <tr key={v.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-slate-800 border border-slate-700 rounded-sm flex items-center justify-center font-mono font-bold text-slate-300 text-xs shrink-0">
                          {v.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                            <span>{v.fullName}</span>
                            {v.isFlagged && (
                              <span title="Security Flag">
                                <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">{v.company}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{v.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-200">{v.visitorType}</div>
                      <div className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">
                        {v.accessZones.join(', ')}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-mono">
                      <span className="font-bold text-brand-300 bg-slate-950 px-2 py-0.5 rounded-sm border border-slate-800">
                        {v.badgeNumber}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="text-slate-200 font-medium">{v.hostName}</div>
                      <div className="text-[10px] text-slate-400">{v.hostDepartment}</div>
                    </td>

                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-300">
                      <div>
                        Arr: {v.checkInTime ? new Date(v.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(v.expectedArrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {v.checkOutTime && (
                        <div className="text-[10px] text-slate-500">
                          Dep: {new Date(v.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="space-y-1 text-[10px]">
                        <div className="flex items-center gap-1">
                          {v.ndaSigned ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <XCircle className="w-3 h-3 text-amber-400" />
                          )}
                          <span className={v.ndaSigned ? 'text-slate-300' : 'text-amber-400 font-medium'}>
                            {v.ndaSigned ? 'NDA Executed' : 'NDA Pending'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {v.idVerified ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <XCircle className="w-3 h-3 text-slate-500" />
                          )}
                          <span className={v.idVerified ? 'text-slate-300' : 'text-slate-400'}>
                            {v.idVerified ? `ID Verified (${v.idType})` : 'ID Unverified'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      {getStatusBadge(v.status)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Check-In / Check-Out */}
                        {(v.status === 'expected' || v.status === 'rejected') && (
                          <button
                            onClick={() => checkInVisitor(v.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-sm transition-colors"
                            title="Check In"
                          >
                            Check In
                          </button>
                        )}
                        {(v.status === 'checked_in' || v.status === 'overstay') && (
                          <button
                            onClick={() => checkOutVisitor(v.id)}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium rounded-sm border border-slate-700 transition-colors"
                            title="Check Out"
                          >
                            Check Out
                          </button>
                        )}

                        {/* Print Badge */}
                        <button
                          onClick={() => setActiveBadgeToPrint(v)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-sm border border-slate-700 transition-colors"
                          title="Print Thermal Badge"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* View Dossier */}
                        <button
                          onClick={() => setActiveDossierVisitor(v)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-brand-300 rounded-sm border border-slate-700 transition-colors"
                          title="View Full Dossier"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete entry */}
                        <button
                          onClick={() => deleteVisitor(v.id)}
                          className="p-1.5 bg-slate-800 hover:bg-red-950 hover:text-red-400 hover:border-red-800 text-slate-400 rounded-sm border border-slate-700 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Showing {filteredVisitors.length} of {siteVisitors.length} records</span>
          <span>Security Badge Protocol: AES-256 Encrypted RFID</span>
        </div>
      </div>

      {/* Walk-In Fast Check-In Modal */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-md max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LogIn className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                  Fast Reception Walk-In Registration
                </h3>
              </div>
              <button
                onClick={() => setShowWalkInModal(false)}
                className="text-slate-400 hover:text-slate-100 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWalkIn} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Visitor Full Name *</label>
                <input
                  type="text"
                  required
                  value={walkInName}
                  onChange={(e) => setWalkInName(e.target.value)}
                  placeholder="e.g. Katherine Pierce"
                  className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={walkInCompany}
                    onChange={(e) => setWalkInCompany(e.target.value)}
                    placeholder="e.g. Cisco Systems"
                    className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={walkInEmail}
                    onChange={(e) => setWalkInEmail(e.target.value)}
                    placeholder="k.pierce@cisco.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Visitor Classification</label>
                  <select
                    value={walkInType}
                    onChange={(e) => setWalkInType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
                  >
                    <option value="Client / Guest">Client / Guest</option>
                    <option value="Contractor">Contractor</option>
                    <option value="Job Interviewee">Job Interviewee</option>
                    <option value="Vendor / Supplier">Vendor / Supplier</option>
                    <option value="VIP Partner">VIP Partner</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Sponsoring Host *</label>
                  <select
                    value={walkInHostId}
                    onChange={(e) => setWalkInHostId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
                  >
                    {hosts.map(h => (
                      <option key={h.id} value={h.id}>
                        {h.name} ({h.department})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Purpose of Visit</label>
                <input
                  type="text"
                  value={walkInPurpose}
                  onChange={(e) => setWalkInPurpose(e.target.value)}
                  placeholder="e.g. Architecture review meeting"
                  className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-sm text-[11px] text-slate-400">
                <span className="text-emerald-400 font-bold">Auto-Clearance:</span> Government ID will be flagged as verified at front desk, and NDA signed electronically on terminal.
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowWalkInModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md border border-emerald-500 shadow-sm transition-colors"
                >
                  Issue Badge & Check In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
