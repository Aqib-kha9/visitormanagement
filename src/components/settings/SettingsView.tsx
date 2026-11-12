import React, { useState } from 'react';
import { useVisitor } from '../../context/VisitorContext';
import { BadgeConfig } from '../../types';
import { 
  Settings, 
  Printer, 
  Building2, 
  Wifi, 
  ShieldCheck, 
  Save, 
  RotateCcw, 
  Radio, 
  Bell, 
  Check 
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { badgeConfig, updateBadgeConfig, sites, selectedSiteId } = useVisitor();

  const [companyName, setCompanyName] = useState(badgeConfig.companyName);
  const [badgeTitle, setBadgeTitle] = useState(badgeConfig.badgeTitle);
  const [wifiNetwork, setWifiNetwork] = useState(badgeConfig.wifiNetwork);
  const [wifiPasswordDefault, setWifiPasswordDefault] = useState(badgeConfig.wifiPasswordDefault);
  const [emergencyNumber, setEmergencyNumber] = useState(badgeConfig.emergencyNumber);
  const [showQrCode, setShowQrCode] = useState(badgeConfig.showQrCode);
  const [requireEscortDisclaimer, setRequireEscortDisclaimer] = useState(badgeConfig.requireEscortDisclaimer);

  const [slackEnabled, setSlackEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [turnstilesEnabled, setTurnstilesEnabled] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBadgeConfig({
      companyName,
      badgeTitle,
      wifiNetwork,
      wifiPasswordDefault,
      emergencyNumber,
      showQrCode,
      requireEscortDisclaimer
    });
  };

  const handleResetData = () => {
    if (window.confirm('Reset all visitor registry and mock data to initial corporate demo state?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-md p-5">
        <h1 className="text-xl font-bold text-white tracking-tight">System Settings & Badge Policies</h1>
        <p className="text-xs text-slate-400 mt-1">
          Customize physical thermal badge templates, Wi-Fi credentials, site security policies, and integrations
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Thermal Badge Designer Configuration */}
        <div className="bg-slate-900 border border-slate-800 rounded-md p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-800">
            <Printer className="w-4 h-4 text-brand-400" />
            <span>Thermal Security Badge Specifications</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Company Legal Entity (Header Banner)
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Badge Pass Title
              </label>
              <input
                type="text"
                value={badgeTitle}
                onChange={(e) => setBadgeTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Guest Wi-Fi Network SSID
              </label>
              <input
                type="text"
                value={wifiNetwork}
                onChange={(e) => setWifiNetwork(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Default Wi-Fi Passphrase
              </label>
              <input
                type="text"
                value={wifiPasswordDefault}
                onChange={(e) => setWifiPasswordDefault(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Security Emergency Hotline
              </label>
              <input
                type="text"
                value={emergencyNumber}
                onChange={(e) => setEmergencyNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showQrCode}
                onChange={(e) => setShowQrCode(e.target.checked)}
                className="rounded-sm accent-brand-600"
              />
              <span>Encode 2D QR Code on printed thermal badges</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={requireEscortDisclaimer}
                onChange={(e) => setRequireEscortDisclaimer(e.target.checked)}
                className="rounded-sm accent-brand-600"
              />
              <span>Print mandatory staff escort disclaimer</span>
            </label>
          </div>
        </div>

        {/* Real-time Hardware & Notification Integrations */}
        <div className="bg-slate-900 border border-slate-800 rounded-md p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-800">
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>Hardware Relay & Notification Webhooks</span>
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-sm">
              <div>
                <p className="text-xs font-bold text-slate-200">Slack Host Notification Bot</p>
                <p className="text-[11px] text-slate-400">Pings internal host immediately via direct message upon visitor badge issue</p>
              </div>
              <button
                type="button"
                onClick={() => setSlackEnabled(!slackEnabled)}
                className={`px-3 py-1 text-xs font-mono font-bold rounded-sm border ${
                  slackEnabled 
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}
              >
                {slackEnabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-sm">
              <div>
                <p className="text-xs font-bold text-slate-200">Twilio SMS Guest Pass Dispatcher</p>
                <p className="text-[11px] text-slate-400">Sends 4-digit QR pass link to visitor mobile upon pre-registration</p>
              </div>
              <button
                type="button"
                onClick={() => setSmsEnabled(!smsEnabled)}
                className={`px-3 py-1 text-xs font-mono font-bold rounded-sm border ${
                  smsEnabled 
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}
              >
                {smsEnabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-sm">
              <div>
                <p className="text-xs font-bold text-slate-200">OSDP / Wiegand Turnstile Gate Relay</p>
                <p className="text-[11px] text-slate-400">Synchronizes barcode scanning directly with physical speed gates and elevators</p>
              </div>
              <button
                type="button"
                onClick={() => setTurnstilesEnabled(!turnstilesEnabled)}
                className={`px-3 py-1 text-xs font-mono font-bold rounded-sm border ${
                  turnstilesEnabled 
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}
              >
                {turnstilesEnabled ? 'ARMED & ACTIVE' : 'DISARMED'}
              </button>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleResetData}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-red-400 bg-slate-900 border border-slate-800 rounded-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Registry Data</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-md border border-brand-500 shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

