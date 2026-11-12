import React from 'react';
import { useVisitor } from '../../context/VisitorContext';
import { Printer, X, Shield, QrCode, Wifi, Clock, User, AlertCircle } from 'lucide-react';

export const BadgeModal: React.FC = () => {
  const { activeBadgeToPrint, setActiveBadgeToPrint, badgeConfig } = useVisitor();

  if (!activeBadgeToPrint) return null;

  const visitor = activeBadgeToPrint;

  const handlePrint = () => {
    window.print();
  };

  const getBadgeTypeBadgeColor = () => {
    switch (visitor.visitorType) {
      case 'VIP Partner':
      case 'Board Member':
        return 'bg-purple-700 text-white';
      case 'Contractor':
      case 'Maintenance':
        return 'bg-amber-600 text-white';
      case 'Auditor / Inspector':
        return 'bg-red-700 text-white';
      case 'Job Interviewee':
        return 'bg-blue-700 text-white';
      default:
        return 'bg-brand-600 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-md max-w-lg w-full shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-brand-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Thermal Badge Dispatch Preview
            </h3>
          </div>
          <button
            onClick={() => setActiveBadgeToPrint(null)}
            className="text-slate-400 hover:text-slate-100 p-1 rounded-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Badge Preview Area */}
        <div className="p-6 bg-slate-950 flex flex-col items-center">
          {/* Printable Badge Sheet */}
          <div 
            id="printable-badge-container"
            className="w-80 bg-white text-slate-950 rounded-md border-2 border-slate-400 shadow-md p-5 flex flex-col select-none"
            style={{ minHeight: '440px' }}
          >
            {/* Header with Company & Pass Type */}
            <div className="text-center pb-3 border-b-2 border-slate-900">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Shield className="w-4 h-4 text-slate-900 fill-slate-900" />
                <span className="font-extrabold text-xs tracking-widest text-slate-900 uppercase">
                  {badgeConfig.companyName}
                </span>
              </div>
              <div className={`py-1 px-2 font-mono text-[11px] font-bold uppercase tracking-wider rounded-sm ${getBadgeTypeBadgeColor()}`}>
                {visitor.visitorType}
              </div>
            </div>

            {/* Visitor Identity */}
            <div className="my-4 text-center">
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold">
                AUTHORIZED VISITOR
              </span>
              <h2 className="text-2xl font-black text-slate-900 leading-tight uppercase tracking-tight mt-0.5">
                {visitor.fullName}
              </h2>
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mt-0.5">
                {visitor.company}
              </p>
            </div>

            {/* Access Zones Matrix */}
            <div className="bg-slate-100 border border-slate-300 rounded-sm p-2.5 mb-3 text-left">
              <div className="text-[9px] uppercase font-mono font-bold text-slate-600 mb-1">
                Permitted Security Zones:
              </div>
              <div className="flex flex-wrap gap-1">
                {visitor.accessZones.map((zone, idx) => (
                  <span 
                    key={idx}
                    className="text-[9px] font-mono font-bold bg-slate-900 text-white px-1.5 py-0.5 rounded-sm"
                  >
                    {zone}
                  </span>
                ))}
              </div>
            </div>

            {/* Host & Timestamps */}
            <div className="grid grid-cols-2 gap-2 text-[10px] mb-3">
              <div className="bg-slate-50 p-2 border border-slate-200 rounded-sm">
                <span className="text-[8px] text-slate-500 font-mono uppercase block">Sponsor / Host:</span>
                <span className="font-bold text-slate-900 truncate block">{visitor.hostName}</span>
                <span className="text-slate-600 text-[9px] block truncate">{visitor.hostDepartment}</span>
              </div>
              <div className="bg-slate-50 p-2 border border-slate-200 rounded-sm">
                <span className="text-[8px] text-slate-500 font-mono uppercase block">Valid Until:</span>
                <span className="font-bold text-slate-900 font-mono block">18:00 TODAY</span>
                <span className="text-slate-600 text-[9px] font-mono block">
                  Badge: {visitor.badgeNumber}
                </span>
              </div>
            </div>

            {/* Wi-Fi & QR Section */}
            <div className="mt-auto pt-2 border-t border-slate-300 flex items-center justify-between">
              <div className="text-[9px] space-y-0.5">
                <div className="flex items-center gap-1 font-mono font-semibold text-slate-800">
                  <Wifi className="w-3 h-3 text-slate-600" />
                  <span>Wi-Fi: {badgeConfig.wifiNetwork}</span>
                </div>
                <div className="font-mono text-slate-600">
                  Key: <strong className="text-slate-900">{visitor.wifiAccessCode}</strong>
                </div>
                {visitor.escortRequired && (
                  <div className="text-red-700 font-bold text-[8px] uppercase tracking-wider flex items-center gap-0.5 mt-1">
                    <AlertCircle className="w-2.5 h-2.5" />
                    <span>Escort Required at all times</span>
                  </div>
                )}
              </div>

              {/* Realistic QR Matrix Simulation */}
              <div className="w-16 h-16 bg-slate-900 p-1 rounded-sm flex items-center justify-center">
                <QrCode className="w-14 h-14 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            Destination: <span className="text-slate-200">Zebra ZD621 Thermal (USB)</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveBadgeToPrint(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-md border border-brand-500 shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Badge</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

