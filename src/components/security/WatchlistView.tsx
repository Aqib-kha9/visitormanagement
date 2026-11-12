import React, { useState } from 'react';
import { useVisitor } from '../../context/VisitorContext';
import { WatchlistEntry, WatchlistSeverity } from '../../types';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Plus, 
  Search, 
  Trash2, 
  UserX, 
  AlertOctagon,
  Eye,
  Check
} from 'lucide-react';

export const WatchlistView: React.FC = () => {
  const { watchlist, addWatchlistEntry, removeWatchlistEntry, checkWatchlistMatch } = useVisitor();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Name match test state
  const [testName, setTestName] = useState('');
  const [matchResult, setMatchResult] = useState<WatchlistEntry | null | 'NONE'>(null);

  // Form state
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState<WatchlistEntry['category']>('Past Security Incident');
  const [severity, setSeverity] = useState<WatchlistSeverity>('CRITICAL');
  const [actionRequired, setActionRequired] = useState('');
  const [notes, setNotes] = useState('');

  const filtered = watchlist.filter(w =>
    w.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTestLookup = () => {
    if (!testName.trim()) return;
    const hit = checkWatchlistMatch(testName);
    setMatchResult(hit || 'NONE');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWatchlistEntry({
      fullName,
      company: company || undefined,
      category,
      severity,
      actionRequired: actionRequired || 'Escort off premises and notify chief of security.',
      addedBy: 'David K. Chen (Director of Security)',
      notes
    });

    setShowAddModal(false);
    setFullName('');
    setCompany('');
    setActionRequired('');
    setNotes('');
  };

  const getSeverityBadge = (sev: WatchlistSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return <span className="bg-red-950 text-red-300 border border-red-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm">CRITICAL DENIAL</span>;
      case 'WARNING':
        return <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm">ESCORT RESTRICTION</span>;
      case 'VIP_ESCORT':
        return <span className="bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm">VIP PROTOCOL</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-md p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Security Watchlist & Denied List</h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated turnstile intercept engine, legal injunctions, and executive protocol alerts
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-md border border-red-500 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Flagged Subject</span>
        </button>
      </div>

      {/* Real-time Match Simulator Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-md p-5 space-y-3">
        <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Eye className="w-4 h-4 text-brand-400" />
          <span>Pre-Check Name Matching Engine Simulator</span>
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={testName}
            onChange={(e) => {
              setTestName(e.target.value);
              setMatchResult(null);
            }}
            placeholder="Type a subject name to test watch list interception (e.g. Vikramaditya Roy)..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-mono"
          />
          <button
            onClick={handleTestLookup}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-sm border border-slate-700 transition-colors"
          >
            Run Watchlist Match
          </button>
        </div>

        {matchResult === 'NONE' && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-sm text-xs text-emerald-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>CLEARED: No active security match or trespass restraint logged for "{testName}".</span>
          </div>
        )}

        {matchResult && matchResult !== 'NONE' && (
          <div className="p-4 bg-red-950 border border-red-800 rounded-sm text-xs text-red-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-2 text-red-300 text-sm">
                <AlertOctagon className="w-5 h-5 text-red-400" />
                SECURITY ALERT: POSITIVE WATCHLIST MATCH
              </span>
              {getSeverityBadge(matchResult.severity)}
            </div>
            <div className="font-mono text-xs">
              Subject: <strong className="text-white">{matchResult.fullName}</strong> ({matchResult.company || 'Unknown'})
            </div>
            <p className="text-red-200 leading-relaxed font-mono">
              Action Required: {matchResult.actionRequired}
            </p>
          </div>
        )}
      </div>

      {/* Search and Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-md overflow-hidden">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="relative w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter watchlist records..."
              className="w-full bg-slate-900 border border-slate-700 rounded-sm pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
          </div>
          <span className="text-xs font-mono text-slate-400">
            {filtered.length} Restricted Entities Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                <th className="py-3 px-4">Subject Name & Affiliation</th>
                <th className="py-3 px-3">Classification</th>
                <th className="py-3 px-3">Enforcement Protocol</th>
                <th className="py-3 px-3">Authorized By</th>
                <th className="py-3 px-3">Severity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(entry => (
                <tr key={entry.id} className="hover:bg-slate-850/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-100">{entry.fullName}</div>
                    <div className="text-[11px] text-slate-400">{entry.company || 'Private Citizen'}</div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-medium text-slate-200">{entry.category}</span>
                  </td>

                  <td className="py-3 px-3 text-slate-300 max-w-xs leading-relaxed font-mono text-[11px]">
                    {entry.actionRequired}
                  </td>

                  <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                    <div>{entry.addedBy}</div>
                    <div className="text-[10px] text-slate-500">{new Date(entry.addedAt).toLocaleDateString()}</div>
                  </td>

                  <td className="py-3 px-3">
                    {getSeverityBadge(entry.severity)}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => removeWatchlistEntry(entry.id)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 rounded-sm border border-slate-700 transition-colors"
                      title="Remove Flag"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-md max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>Add Person to Security Watchlist</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-100 font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Subject Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Brandon Cole"
                  className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Affiliation / Entity</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Ex-Contractor Corp"
                    className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
                  >
                    <option value="Terminated Employee">Terminated Employee</option>
                    <option value="Past Security Incident">Past Security Incident</option>
                    <option value="Banned Vendor">Banned Vendor</option>
                    <option value="Litigation Restraint">Litigation Restraint</option>
                    <option value="VIP Protocol">VIP Protocol</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Enforcement Severity *</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
                >
                  <option value="CRITICAL">CRITICAL: Immediate Turnstile Lockdown & Security Dispatch</option>
                  <option value="WARNING">WARNING: Escort Mandatory (Entry Allowed under supervision)</option>
                  <option value="VIP_ESCORT">VIP_ESCORT: VIP Escort & Welcome Protocol</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Action Protocol for Frontdesk *</label>
                <textarea
                  required
                  value={actionRequired}
                  onChange={(e) => setActionRequired(e.target.value)}
                  placeholder="e.g. Retain building pass immediately. Intercept at turnstile and contact extension 4410."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Confidential Security Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Incident details, case reference number, etc."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-md border border-red-500 shadow-sm"
                >
                  Enforce Security Flag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

