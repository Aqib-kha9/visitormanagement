import React, { useState } from 'react';
import { useVisitor } from '../../context/VisitorContext';
import { VisitorType, IdType } from '../../types';
import { 
  UserPlus, 
  Mail, 
  Calendar, 
  Clock, 
  Building, 
  ShieldCheck, 
  QrCode, 
  Copy, 
  Check, 
  Upload, 
  Sparkles,
  Car,
  FileText
} from 'lucide-react';

export const PreRegisterView: React.FC = () => {
  const { hosts, preRegisterVisitor, selectedSiteId } = useVisitor();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [hostId, setHostId] = useState(hosts[0]?.id || '');
  const [visitorType, setVisitorType] = useState<VisitorType>('Client / Guest');
  const [purpose, setPurpose] = useState('');
  const [arrivalDate, setArrivalDate] = useState('2026-11-13');
  const [arrivalTime, setArrivalTime] = useState('10:00');
  const [escortRequired, setEscortRequired] = useState(false);
  const [parkingBay, setParkingBay] = useState('');
  const [ndaPreSigned, setNdaPreSigned] = useState(true);
  const [selectedZones, setSelectedZones] = useState<string[]>(['L18 Lobby Area', 'L21 Meeting Suites']);

  // Success state preview
  const [createdPass, setCreatedPass] = useState<{
    passUrl: string;
    visitorName: string;
    badgeCode: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');

  const availableZones = [
    'L18 Lobby Area',
    'L19 People Ops & Training',
    'L21 Meeting Suites',
    'L22 Engineering Core',
    'L23 Product & Architecture Lab',
    'L24 Executive Penthouse',
    'Server Room Annex (Escort Only)',
    'Loading Bay & Freight Elevator'
  ];

  const handleToggleZone = (zone: string) => {
    setSelectedZones(prev => 
      prev.includes(zone) ? prev.filter(z => z !== zone) : [...prev, zone]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const host = hosts.find(h => h.id === hostId) || hosts[0];
    const arrivalIso = new Date(`${arrivalDate}T${arrivalTime}:00.000Z`).toISOString();

    const created = preRegisterVisitor({
      fullName,
      email,
      phone: phone || '+1 (555) 019-8812',
      company,
      purpose: purpose || 'Official Business Meeting',
      visitorType,
      hostId: host.id,
      hostName: host.name,
      hostDepartment: host.department,
      hostEmail: host.email,
      expectedArrival: arrivalIso,
      accessZones: selectedZones.length > 0 ? selectedZones : ['L18 Lobby Area'],
      ndaSigned: ndaPreSigned,
      idVerified: false,
      idType: 'Govt ID' as IdType,
      idNumberMasked: 'PENDING CHECK',
      vehicleRegistration: parkingBay ? `Reserved: ${parkingBay}` : undefined,
      escortRequired,
      notes: 'Pre-registered via Security Console invitation link.'
    });

    setCreatedPass({
      passUrl: `https://visit.apexgroup.internal/pass/${created.badgeNumber.toLowerCase()}`,
      visitorName: created.fullName,
      badgeCode: created.badgeNumber
    });

    // Reset fields
    setFullName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setPurpose('');
  };

  const handleCopyLink = () => {
    if (!createdPass) return;
    navigator.clipboard.writeText(createdPass.passUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Bulk CSV import simulation
  const handleBulkImport = () => {
    const mockBulk = [
      { name: 'Dr. Gregory House', comp: 'Princeton Diagnostics', type: 'Auditor / Inspector' as VisitorType },
      { name: 'Miranda Lawson', comp: 'Cerberus Capital Systems', type: 'VIP Partner' as VisitorType },
      { name: 'Tali Zorah', comp: 'Quarian Fleet Engineering', type: 'Contractor' as VisitorType },
    ];

    mockBulk.forEach(b => {
      preRegisterVisitor({
        fullName: b.name,
        email: `${b.name.toLowerCase().replace(/[^a-z]/g, '')}@enterprise.corp`,
        phone: '+1 (555) 019-3321',
        company: b.comp,
        purpose: 'Quarterly Systems Review & Audit',
        visitorType: b.type,
        hostId: hosts[0].id,
        hostName: hosts[0].name,
        hostDepartment: hosts[0].department,
        hostEmail: hosts[0].email,
        expectedArrival: new Date().toISOString(),
        accessZones: ['L18 Lobby Area', 'L22 Engineering Core'],
        ndaSigned: true,
        idVerified: false,
        idType: 'Govt ID',
        idNumberMasked: 'PENDING',
        escortRequired: false,
        notes: 'Bulk imported delegation pass'
      });
    });
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-md p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Pre-Registration & Digital Invites</h1>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch digital security passes, automate NDA execution, and expedite front-desk clearance
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-sm border border-slate-800">
          <button
            onClick={() => setActiveTab('single')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors ${
              activeTab === 'single'
                ? 'bg-brand-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Single Invitation
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors ${
              activeTab === 'bulk'
                ? 'bg-brand-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bulk CSV Manifest
          </button>
        </div>
      </div>

      {activeTab === 'single' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Column */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-md p-6">
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-brand-400" />
              <span>Schedule Visitor Arrival</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: Name and Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Visitor Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Julian Vance"
                    className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Organization / Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Lockheed Martin Defense"
                    className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>
              </div>

              {/* Row 2: Email and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Corporate Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="julian.vance@lockheed.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Mobile Phone (For SMS Pass)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (415) 555-0182"
                    className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>
              </div>

              {/* Row 3: Host Sponsor & Classification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Sponsoring Internal Host *
                  </label>
                  <select
                    value={hostId}
                    onChange={(e) => setHostId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
                  >
                    {hosts.map(h => (
                      <option key={h.id} value={h.id}>
                        {h.name} — {h.department} ({h.floor})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Visitor Classification
                  </label>
                  <select
                    value={visitorType}
                    onChange={(e) => setVisitorType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
                  >
                    <option value="Client / Guest">Client / Guest</option>
                    <option value="Contractor">Contractor</option>
                    <option value="Job Interviewee">Job Interviewee</option>
                    <option value="Vendor / Supplier">Vendor / Supplier</option>
                    <option value="VIP Partner">VIP Partner</option>
                    <option value="Board Member">Board Member</option>
                    <option value="Auditor / Inspector">Auditor / Inspector</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Scheduled Arrival Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Expected Arrival Time
                  </label>
                  <input
                    type="time"
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>
              </div>

              {/* Row 5: Access Zones Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Designated Building Security Zones
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-950 p-3 border border-slate-800 rounded-sm">
                  {availableZones.map(zone => {
                    const isChecked = selectedZones.includes(zone);
                    return (
                      <label 
                        key={zone}
                        className={`flex items-center gap-2 p-1.5 text-xs rounded-sm cursor-pointer border transition-colors ${
                          isChecked 
                            ? 'bg-slate-900 border-brand-500 text-slate-100 font-medium'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleZone(zone)}
                          className="rounded-sm accent-brand-600 cursor-pointer"
                        />
                        <span className="truncate">{zone}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Security Preferences */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-sm space-y-3">
                <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block">
                  Security Protocol & Perks
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={escortRequired}
                      onChange={(e) => setEscortRequired(e.target.checked)}
                      className="rounded-sm accent-red-600"
                    />
                    <span className="text-slate-300">Continuous Staff Escort</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ndaPreSigned}
                      onChange={(e) => setNdaPreSigned(e.target.checked)}
                      className="rounded-sm accent-brand-600"
                    />
                    <span className="text-slate-300">Require Pre-arrival NDA</span>
                  </label>

                  <div>
                    <input
                      type="text"
                      value={parkingBay}
                      onChange={(e) => setParkingBay(e.target.value)}
                      placeholder="Reserved Parking Bay (e.g. P1-09)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-sm px-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Purpose */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Purpose / Meeting Agenda
                </label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Q4 Platform Architecture review and cloud infrastructure sizing..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Submit */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-md border border-brand-500 shadow-sm transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Generate Pre-Clearance & Dispatch Pass</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Pass Preview & Output */}
          <div className="space-y-4">
            {createdPass ? (
              <div className="bg-slate-900 border border-brand-600 rounded-md p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pass Issued Successfully</span>
                  </div>
                  <span className="text-[10px] font-mono text-brand-300 bg-brand-950 border border-brand-800 px-2 py-0.5 rounded-sm font-bold">
                    {createdPass.badgeCode}
                  </span>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-md text-center">
                  <p className="text-[10px] text-slate-500 font-mono uppercase">Pre-Registration Code</p>
                  <p className="text-lg font-mono font-bold text-white mt-0.5">{createdPass.badgeCode}</p>

                  <div className="my-4 flex justify-center">
                    <div className="w-36 h-36 bg-white p-2 rounded-sm flex items-center justify-center">
                      <QrCode className="w-32 h-32 text-slate-950" />
                    </div>
                  </div>

                  <p className="text-xs font-bold text-slate-200">{createdPass.visitorName}</p>
                  <p className="text-[11px] text-slate-400">Scan at any front-desk iPad kiosk for 5-second check-in</p>
                </div>

                {/* Secure Link */}
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    Visitor Self-Check-in Pass URL
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      readOnly
                      value={createdPass.passUrl}
                      className="flex-1 bg-slate-950 border border-slate-700 text-xs font-mono text-slate-300 px-2.5 py-1.5 rounded-sm"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-sm transition-colors"
                      title="Copy Pass Link"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 bg-slate-950 p-3 border border-slate-800 rounded-sm leading-relaxed">
                  Pass has also been queued to be sent via SMS & Corporate Email with calendar invite attached (.ics).
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-md p-6 text-center text-slate-400 space-y-3">
                <QrCode className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Digital Security Pass Engine
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Fill out the visitor details to the left to automatically generate a pre-cleared access pass with encrypted QR turnstile credential.
                </p>
                <div className="pt-2 text-[11px] text-brand-400 font-mono">
                  Average kiosk check-in time: 4.8 seconds
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Bulk CSV View */
        <div className="bg-slate-900 border border-slate-800 rounded-md p-6 space-y-5">
          <div>
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-1">
              Bulk Visitor Manifest Ingestion
            </h2>
            <p className="text-xs text-slate-400">
              Pre-clear entire delegations, vendor crews, or board meeting attendees from a single CSV upload.
            </p>
          </div>

          <div className="border-2 border-dashed border-slate-700 bg-slate-950 p-8 rounded-md text-center space-y-3">
            <Upload className="w-10 h-10 text-brand-400 mx-auto" />
            <p className="text-xs font-semibold text-slate-200">
              Drag & Drop your visitor manifest file (.csv or .xlsx)
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Headers: FullName, Email, Company, HostEmail, VisitorType, AccessDate
            </p>
            <div className="pt-2">
              <button
                onClick={handleBulkImport}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-md border border-brand-500 shadow-sm transition-colors"
              >
                Import Sample 3-Person Delegation Manifest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

