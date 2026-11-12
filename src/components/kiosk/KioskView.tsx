import React, { useState, useRef, useEffect } from 'react';
import { useVisitor } from '../../context/VisitorContext';
import { Visitor, IdType } from '../../types';
import { 
  TabletSmartphone, 
  UserCheck, 
  Search, 
  ShieldCheck, 
  PenTool, 
  CheckCircle2, 
  Printer, 
  ArrowLeft, 
  ArrowRight, 
  Camera, 
  Building2,
  AlertOctagon,
  RefreshCw,
  QrCode
} from 'lucide-react';

export const KioskView: React.FC = () => {
  const { 
    hosts, 
    visitors, 
    checkInVisitor, 
    kioskSelfCheckIn, 
    setActiveBadgeToPrint,
    selectedSiteId,
    sites
  } = useVisitor();

  const currentSite = sites.find(s => s.id === selectedSiteId) || sites[0];

  // Kiosk Step State: 1 = Welcome, 2 = Lookup / Details, 3 = NDA & Signature, 4 = Confirmation
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [mode, setMode] = useState<'preregistered' | 'walkin'>('preregistered');

  // Lookup state
  const [lookupQuery, setLookupQuery] = useState('');
  const [foundVisitor, setFoundVisitor] = useState<Visitor | null>(null);
  const [lookupError, setLookupError] = useState('');

  // Walk-in form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [selectedHostId, setSelectedHostId] = useState(hosts[0]?.id || '');
  const [purpose, setPurpose] = useState('');
  const [idType, setIdType] = useState<IdType>('Govt ID');

  // Signature canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [ndaAgreed, setNdaAgreed] = useState(false);

  // Result state
  const [completedVisitor, setCompletedVisitor] = useState<Visitor | null>(null);
  const [securityBlockMessage, setSecurityBlockMessage] = useState<string | null>(null);

  // Lookup function
  const handleLookup = () => {
    setLookupError('');
    const clean = lookupQuery.trim().toLowerCase();
    if (!clean) return;

    const match = visitors.find(v => 
      v.siteId === selectedSiteId &&
      (v.badgeNumber.toLowerCase() === clean ||
       v.email.toLowerCase() === clean ||
       v.phone.replace(/[^0-9]/g, '').includes(clean.replace(/[^0-9]/g, '')) ||
       v.fullName.toLowerCase().includes(clean))
    );

    if (match) {
      setFoundVisitor(match);
      setStep(3); // Proceed to NDA
    } else {
      setLookupError('No pre-registered visit found for this input. Please verify or choose Walk-In registration.');
    }
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();
    setHasSigned(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  // Submit check-in
  const handleFinalCheckIn = () => {
    setSecurityBlockMessage(null);

    if (foundVisitor) {
      // Existing pre-registered visitor
      const success = checkInVisitor(foundVisitor.id);
      if (success) {
        setCompletedVisitor({ ...foundVisitor, status: 'checked_in' });
        setStep(4);
      } else {
        setSecurityBlockMessage('Access denied by automated security policy. Please see reception officer.');
      }
    } else {
      // Walk-in visitor self check-in
      const res = kioskSelfCheckIn({
        fullName,
        email,
        phone: phone || '+1 (415) 555-0199',
        company,
        hostId: selectedHostId,
        purpose: purpose || 'Official Business',
        idType,
        idNumberMasked: 'KIOSK-VERIFIED'
      });

      if (res.success && res.visitor) {
        setCompletedVisitor(res.visitor);
        setStep(4);
      } else {
        setSecurityBlockMessage(res.reason || 'Registration flagged. Please report to Security Desk.');
      }
    }
  };

  const resetKiosk = () => {
    setStep(1);
    setMode('preregistered');
    setLookupQuery('');
    setFoundVisitor(null);
    setLookupError('');
    setFullName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setPurpose('');
    setHasSigned(false);
    setNdaAgreed(false);
    setCompletedVisitor(null);
    setSecurityBlockMessage(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Kiosk Mode Device Frame Indicator */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border border-slate-800 rounded-md text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <TabletSmartphone className="w-4 h-4 text-brand-400" />
          <span>RECEPTION TOUCHSCREEN TERMINAL #02 (LOBBY EAST)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400">● Live Kiosk Active</span>
          <button 
            onClick={resetKiosk} 
            className="text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Kiosk</span>
          </button>
        </div>
      </div>

      {/* Main Kiosk iPad Screen Container */}
      <div className="bg-slate-900 border-2 border-slate-700 rounded-md shadow-2xl overflow-hidden min-h-[580px] flex flex-col justify-between">
        
        {/* Step 1: Welcome Screen */}
        {step === 1 && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none">
            <div className="w-16 h-16 bg-brand-600 rounded-md flex items-center justify-center text-white mb-4 shadow-sm">
              <Building2 className="w-9 h-9" />
            </div>

            <span className="text-xs font-mono tracking-widest text-brand-400 uppercase font-bold">
              WELCOME TO APEX ENTERPRISE SYSTEMS
            </span>
            <h1 className="text-3xl font-black text-white tracking-tight mt-1 mb-2">
              Visitor Self-Check-In
            </h1>
            <p className="text-sm text-slate-400 max-w-md mb-8">
              {currentSite.name} • {currentSite.city}. Please select your check-in option to proceed.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg w-full">
              <button
                onClick={() => {
                  setMode('preregistered');
                  setStep(2);
                }}
                className="p-6 bg-slate-950 hover:bg-slate-800 border-2 border-slate-700 hover:border-brand-500 rounded-md text-left transition-all group"
              >
                <div className="w-10 h-10 bg-slate-800 group-hover:bg-brand-600 rounded-sm flex items-center justify-center text-white mb-3 transition-colors">
                  <QrCode className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-100 group-hover:text-brand-300">
                  I Have a Pre-Registration Pass
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Enter your invitation code, phone number, or corporate email.
                </p>
              </button>

              <button
                onClick={() => {
                  setMode('walkin');
                  setStep(2);
                }}
                className="p-6 bg-slate-950 hover:bg-slate-800 border-2 border-slate-700 hover:border-emerald-500 rounded-md text-left transition-all group"
              >
                <div className="w-10 h-10 bg-slate-800 group-hover:bg-emerald-600 rounded-sm flex items-center justify-center text-white mb-3 transition-colors">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-100 group-hover:text-emerald-300">
                  I am a Walk-In Visitor
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Register on-site, specify your host sponsor, and sign safety NDA.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Information Intake / Lookup */}
        {step === 2 && (
          <div className="flex-1 p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {mode === 'preregistered' ? 'Look Up Your Invitation' : 'Walk-In Registration'}
                  </h2>
                  <p className="text-xs text-slate-400">Step 1 of 3: Identity Verification</p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-sm flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              </div>

              {mode === 'preregistered' ? (
                <div className="max-w-md mx-auto space-y-4 pt-4">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Enter Badge Pass Code (e.g. V-8827) or Email
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={lookupQuery}
                      onChange={(e) => setLookupQuery(e.target.value)}
                      placeholder="e.g. V-8827 or dmitri@nordiccyber.io"
                      className="w-full bg-slate-950 border-2 border-slate-700 rounded-md px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-brand-500 font-mono"
                    />
                  </div>

                  {lookupError && (
                    <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-sm">
                      {lookupError}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      onClick={handleLookup}
                      className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider rounded-md border border-brand-500 transition-colors"
                    >
                      Verify Pass & Continue
                    </button>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      onClick={() => setMode('walkin')}
                      className="text-xs text-brand-400 hover:underline"
                    >
                      Cannot find your invite? Register as a Walk-In instead
                    </button>
                  </div>
                </div>
              ) : (
                /* Walk-in Form */
                <div className="max-w-xl mx-auto space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Organization *</label>
                      <input
                        type="text"
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. KPMG Advisory"
                        className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Your Corporate Email *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sjenkins@kpmg.com"
                        className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Mobile Phone *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (415) 555-0181"
                        className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Host Employee *</label>
                      <select
                        value={selectedHostId}
                        onChange={(e) => setSelectedHostId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
                      >
                        {hosts.map(h => (
                          <option key={h.id} value={h.id}>
                            {h.name} — {h.department}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Government ID Type</label>
                      <select
                        value={idType}
                        onChange={(e) => setIdType(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
                      >
                        <option value="Govt ID">Driver License / State ID</option>
                        <option value="Passport">Passport</option>
                        <option value="Corporate Badge">Corporate Work Badge</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Purpose of Visit</label>
                    <input
                      type="text"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      placeholder="e.g. Strategy session & design review"
                      className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      disabled={!fullName || !company || !email}
                      onClick={() => setStep(3)}
                      className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center gap-1.5"
                    >
                      <span>Proceed to NDA Agreement</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: NDA & Digital Signature */}
        {step === 3 && (
          <div className="flex-1 p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Facility Safety & NDA Agreement</h2>
                  <p className="text-xs text-slate-400">Step 2 of 3: Legal Compliance & Signature</p>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-sm flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              </div>

              {securityBlockMessage && (
                <div className="p-3 bg-red-950 border border-red-800 rounded-md text-xs text-red-200 mb-4 flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{securityBlockMessage}</span>
                </div>
              )}

              {/* NDA Legal Terms */}
              <div className="bg-slate-950 p-4 border border-slate-800 rounded-md text-xs text-slate-300 font-mono max-h-36 overflow-y-auto leading-relaxed mb-4">
                <p className="font-bold text-slate-100 mb-1">MUTUAL CONFIDENTIALITY AND SAFETY POLICY</p>
                1. I understand that all work, devices, conversations, and documents inside APEX facilities are confidential.<br />
                2. I will not photograph, record, or duplicate any physical or digital assets.<br />
                3. I will visibly display my printed visitor pass above the waist at all times.<br />
                4. In the event of building emergency or fire alarm, I will follow evacuation marshals to the North Lawn muster station.
              </div>

              {/* Digital Signature Pad */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200 flex items-center gap-1">
                    <PenTool className="w-3.5 h-3.5 text-brand-400" />
                    Draw Digital Signature Below with Touch or Mouse:
                  </span>
                  <button
                    onClick={clearCanvas}
                    className="text-slate-400 hover:text-slate-200 text-xs underline"
                  >
                    Clear Signature
                  </button>
                </div>

                <div className="border-2 border-slate-700 bg-slate-950 rounded-md overflow-hidden h-32 flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    width={700}
                    height={128}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-full cursor-crosshair"
                  />
                </div>
              </div>

              {/* Agreement checkbox */}
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={ndaAgreed}
                  onChange={(e) => setNdaAgreed(e.target.checked)}
                  className="rounded-sm accent-brand-600 cursor-pointer"
                />
                <span>I certify that all information entered is true and I agree to the confidentiality terms above.</span>
              </label>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                disabled={!ndaAgreed || !hasSigned}
                onClick={handleFinalCheckIn}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider rounded-md border border-emerald-500 shadow-sm transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Check-In & Print Badge</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Completion & Badge Dispense */}
        {step === 4 && completedVisitor && (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center select-none space-y-5">
            <div className="w-16 h-16 bg-emerald-600 rounded-md flex items-center justify-center text-white shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-mono text-emerald-400 font-bold tracking-widest uppercase">
                CHECK-IN VERIFIED
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                Welcome, {completedVisitor.fullName}!
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                Your host <strong className="text-slate-200">{completedVisitor.hostName}</strong> has been notified via Slack and SMS. They will meet you in the L18 reception area shortly.
              </p>
            </div>

            {/* Issued Badge Preview Card */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-md max-w-sm w-full text-left space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Security Badge:</span>
                <span className="font-mono font-bold text-brand-300 bg-slate-900 px-2 py-0.5 rounded-sm border border-slate-700">
                  {completedVisitor.badgeNumber}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Guest Wi-Fi Pass:</span>
                <span className="font-mono text-slate-200 font-bold">{completedVisitor.wifiAccessCode}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Permitted Floor:</span>
                <span className="font-semibold text-slate-200">{completedVisitor.accessZones[0]}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setActiveBadgeToPrint(completedVisitor)}
                className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-md border border-brand-500 flex items-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Physical Badge</span>
              </button>
              <button
                onClick={resetKiosk}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-md border border-slate-700 transition-colors"
              >
                Return to Welcome Screen
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

