import React, { useState } from 'react';
import { useVisitor } from '../../context/VisitorContext';
import { 
  X, 
  User, 
  Building, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  Key, 
  FileText, 
  Printer, 
  LogIn, 
  LogOut,
  AlertTriangle,
  Car,
  Wifi,
  Mail,
  Phone
} from 'lucide-react';

export const VisitorDetailModal: React.FC = () => {
  const { 
    activeDossierVisitor, 
    setActiveDossierVisitor, 
    checkInVisitor, 
    checkOutVisitor, 
    setActiveBadgeToPrint,
    updateVisitor
  } = useVisitor();

  const [activeTab, setActiveTab] = useState<'overview' | 'security' | 'nda' | 'notes'>('overview');
  const [editedNotes, setEditedNotes] = useState<string>('');

  if (!activeDossierVisitor) return null;
  const visitor = activeDossierVisitor;

  const handleSaveNotes = () => {
    updateVisitor(visitor.id, { notes: editedNotes });
  };

  const getStatusBadge = () => {
    switch (visitor.status) {
      case 'checked_in':
        return <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-mono font-bold px-2 py-0.5 rounded-sm">ACTIVE ON-SITE</span>;
      case 'overstay':
        return <span className="bg-amber-950 text-amber-300 border border-amber-800 text-xs font-mono font-bold px-2 py-0.5 rounded-sm">OVERSTAY ALERT</span>;
      case 'checked_out':
        return <span className="bg-slate-800 text-slate-400 border border-slate-700 text-xs font-mono font-bold px-2 py-0.5 rounded-sm">DEPARTED</span>;
      case 'rejected':
        return <span className="bg-red-950 text-red-300 border border-red-800 text-xs font-mono font-bold px-2 py-0.5 rounded-sm">ACCESS DENIED</span>;
      default:
        return <span className="bg-brand-950 text-brand-300 border border-brand-800 text-xs font-mono font-bold px-2 py-0.5 rounded-sm">EXPECTED TODAY</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-md max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Dossier Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-md flex items-center justify-center text-slate-300 text-base font-bold font-mono shrink-0">
              {visitor.fullName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-100">{visitor.fullName}</h2>
                {getStatusBadge()}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                <span>{visitor.company}</span>
                <span>•</span>
                <span>Badge: <strong className="text-slate-200">{visitor.badgeNumber}</strong></span>
                <span>•</span>
                <span className="text-brand-400">{visitor.visitorType}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveDossierVisitor(null)}
            className="text-slate-400 hover:text-slate-100 p-1.5 rounded-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="px-5 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {(visitor.status === 'expected' || visitor.status === 'rejected') && (
              <button
                onClick={() => checkInVisitor(visitor.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md border border-emerald-500 shadow-sm transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Check In Now</span>
              </button>
            )}
            {(visitor.status === 'checked_in' || visitor.status === 'overstay') && (
              <button
                onClick={() => checkOutVisitor(visitor.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-400" />
                <span>Check Out Visitor</span>
              </button>
            )}
            <button
              onClick={() => setActiveBadgeToPrint(visitor)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Print Badge</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => updateVisitor(visitor.id, { isFlagged: !visitor.isFlagged, flagReason: visitor.isFlagged ? undefined : 'Flagged for security review by officer.' })}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                visitor.isFlagged 
                  ? 'bg-red-950 text-red-200 border-red-800 hover:bg-red-900'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span>{visitor.isFlagged ? 'Remove Security Flag' : 'Flag Security Concern'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 px-5 bg-slate-950">
          {[
            { id: 'overview', label: 'Visit Overview' },
            { id: 'security', label: 'Access & Identification' },
            { id: 'nda', label: 'NDA & Legal Compliance' },
            { id: 'notes', label: 'Security Notes & Log' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-brand-500 text-brand-400 font-bold bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 border border-slate-800 rounded-md">
                <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block mb-1">
                  Purpose of Visit
                </span>
                <p className="text-sm text-slate-200 font-medium leading-relaxed">{visitor.purpose}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Host Card */}
                <div className="bg-slate-950 p-4 border border-slate-800 rounded-md">
                  <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block mb-2">
                    Sponsoring Host
                  </span>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-slate-800 rounded-md flex items-center justify-center font-bold text-slate-300 text-xs shrink-0">
                      {visitor.hostName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-200">{visitor.hostName}</p>
                      <p className="text-xs text-brand-400">{visitor.hostDepartment}</p>
                      <div className="mt-2 space-y-1 text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span>{visitor.hostEmail}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visit Timestamps */}
                <div className="bg-slate-950 p-4 border border-slate-800 rounded-md space-y-2.5">
                  <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block mb-1">
                    Movement Timestamps
                  </span>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Scheduled Arrival:</span>
                    <span className="font-mono text-slate-200">
                      {new Date(visitor.expectedArrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Actual Check-In:</span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      {visitor.checkInTime ? new Date(visitor.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Check-Out:</span>
                    <span className="font-mono text-slate-400">
                      {visitor.checkOutTime ? new Date(visitor.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Still on-site'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-3 border border-slate-800 rounded-md">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">Email Address</span>
                  <p className="text-xs font-mono text-slate-300 mt-1">{visitor.email}</p>
                </div>
                <div className="bg-slate-950 p-3 border border-slate-800 rounded-md">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">Phone Number</span>
                  <p className="text-xs font-mono text-slate-300 mt-1">{visitor.phone}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 border border-slate-800 rounded-md">
                  <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block mb-2">
                    Government Identification
                  </span>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-400">ID Document Type:</span>
                    <span className="font-semibold text-slate-200">{visitor.idType}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-400">Document Number:</span>
                    <span className="font-mono text-brand-300 font-bold">{visitor.idNumberMasked}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Verification Status:</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Physical Card Verified
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 border border-slate-800 rounded-md">
                  <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block mb-2">
                    Building Access Policies
                  </span>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-400">Continuous Escort:</span>
                    <span className={`font-semibold ${visitor.escortRequired ? 'text-red-400' : 'text-slate-300'}`}>
                      {visitor.escortRequired ? 'MANDATORY (Staff Escort)' : 'Waived (Unescorted L24)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-400">Parking Space:</span>
                    <span className="font-mono text-slate-300">
                      {visitor.vehicleRegistration || 'None / Public Transit'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Guest Wi-Fi Passcode:</span>
                    <span className="font-mono text-brand-400 font-bold">{visitor.wifiAccessCode}</span>
                  </div>
                </div>
              </div>

              {/* Access Zones */}
              <div className="bg-slate-950 p-4 border border-slate-800 rounded-md">
                <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block mb-2">
                  Permitted Turnstiles & Floor Zones
                </span>
                <div className="flex flex-wrap gap-2">
                  {visitor.accessZones.map((zone, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 text-xs font-mono bg-slate-900 border border-slate-700 text-slate-200 rounded-sm font-semibold"
                    >
                      {zone}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'nda' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 border border-slate-800 rounded-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-400" />
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Mutual Confidentiality & Facility Safety Agreement
                    </span>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-sm ${
                    visitor.ndaSigned 
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-red-950 text-red-300 border border-red-800'
                  }`}>
                    {visitor.ndaSigned ? 'EXECUTED & AUDITED' : 'PENDING SIGNATURE'}
                  </span>
                </div>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-sm text-xs text-slate-400 max-h-36 overflow-y-auto font-mono leading-relaxed mb-3">
                  1. VISITOR CONFIDENTIALITY: The Visitor agrees that all technology, computer screens, prototypes, and conversations observed within APEX facilities are strictly confidential trade secrets.<br /><br />
                  2. PROHIBITION OF RECORDING: No photography, audio recording, or unauthorized device connection to internal network ports is allowed.<br /><br />
                  3. FACILITY SAFETY: The Visitor agrees to comply with all safety instructions, stay within approved access zones, and wear issued visitor badge visibly above the waist at all times.
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Signatory: <strong className="text-slate-200">{visitor.fullName}</strong></span>
                  <span>Execution Timestamp: <strong className="text-slate-200">{visitor.ndaSignatureDate ? new Date(visitor.ndaSignatureDate).toLocaleString() : 'N/A'}</strong></span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 border border-slate-800 rounded-md">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block mb-2">
                  Frontdesk Security Log & Observations
                </label>
                <textarea
                  defaultValue={visitor.notes || ''}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  placeholder="Record badge return details, escort handoffs, or security exceptions..."
                  rows={4}
                  className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-200 p-3 rounded-sm focus:outline-none focus:border-brand-500 font-mono"
                />
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={handleSaveNotes}
                    className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-md transition-colors"
                  >
                    Save Security Note
                  </button>
                </div>
              </div>

              {visitor.isFlagged && (
                <div className="p-4 bg-red-950/60 border border-red-800 rounded-md">
                  <div className="flex items-center gap-2 text-red-300 font-bold text-xs uppercase mb-1">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span>Security Concern Record</span>
                  </div>
                  <p className="text-xs text-red-200 leading-relaxed font-mono">
                    {visitor.flagReason || 'Active incident flag logged against this record.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setActiveDossierVisitor(null)}
            className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};

