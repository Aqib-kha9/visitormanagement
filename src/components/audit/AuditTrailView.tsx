import React, { useState } from 'react';
import { useVisitor } from '../../context/VisitorContext';
import { AuditLog, AuditAction } from '../../types';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Clock
} from 'lucide-react';

export const AuditTrailView: React.FC = () => {
  const { auditLogs } = useVisitor();
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | AuditLog['severity']>('all');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'all' ? true : log.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const handleExportAudit = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "LogID,Timestamp,Actor,Action,Severity,Details\n" +
      filteredLogs.map(l => `${l.id},"${l.timestamp}","${l.actor}","${l.action}","${l.severity}","${l.details.replace(/"/g, '""')}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `apex_compliance_audit_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSeverityBadge = (severity: AuditLog['severity']) => {
    switch (severity) {
      case 'DANGER':
        return <span className="bg-red-950 text-red-300 border border-red-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm">CRITICAL</span>;
      case 'WARN':
        return <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm">WARNING</span>;
      case 'SUCCESS':
        return <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm">SUCCESS</span>;
      default:
        return <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm">INFO</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-md p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">SOC 2 / ISO 27001 Security Audit Log</h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable physical security telemetry, credential issuance records, and access breach attempts
          </p>
        </div>

        <button
          onClick={handleExportAudit}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Compliance Manifest (.CSV)</span>
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
            placeholder="Search by terminal actor, event type, or keyword..."
            className="w-full bg-slate-950 border border-slate-700 rounded-sm pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'SUCCESS', 'INFO', 'WARN', 'DANGER'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm border transition-colors ${
                severityFilter === sev
                  ? 'bg-slate-800 text-white border-brand-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {sev === 'all' ? 'All Severity' : sev}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-3">Terminal / Actor</th>
                <th className="py-3 px-3">Event Code</th>
                <th className="py-3 px-4">Telemetry Audit Details</th>
                <th className="py-3 px-3">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-850/60 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-300 whitespace-nowrap">
                    <div>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                    <div className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleDateString()}</div>
                  </td>

                  <td className="py-3 px-3 font-mono font-semibold text-slate-200 whitespace-nowrap">
                    {log.actor}
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-mono text-brand-300 font-bold bg-slate-950 px-2 py-0.5 rounded-sm border border-slate-800 text-[10px]">
                      {log.action}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-300 leading-relaxed font-mono text-[11px]">
                    {log.details}
                  </td>

                  <td className="py-3 px-3">
                    {getSeverityBadge(log.severity)}
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

