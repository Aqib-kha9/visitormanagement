import React, { useState } from 'react';
import { useVisitor } from '../../context/VisitorContext';
import { Delivery, DeliveryStatus } from '../../types';
import { 
  Package, 
  Plus, 
  Search, 
  CheckCircle2, 
  Bell, 
  Clock, 
  Archive, 
  Truck, 
  MapPin, 
  User 
} from 'lucide-react';

export const DeliveriesView: React.FC = () => {
  const { 
    deliveries, 
    hosts, 
    selectedSiteId, 
    logDelivery, 
    collectDelivery, 
    notifyDeliveryRecipient 
  } = useVisitor();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | DeliveryStatus>('all');
  const [showLogModal, setShowLogModal] = useState(false);

  // Form state
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState<Delivery['carrier']>('FedEx');
  const [recipientId, setRecipientId] = useState(hosts[0]?.id || '');
  const [packageType, setPackageType] = useState<Delivery['packageType']>('Parcel / Box');
  const [storageLocation, setStorageLocation] = useState('Shelf A-04');
  const [notes, setNotes] = useState('');

  const siteDeliveries = deliveries.filter(d => d.siteId === selectedSiteId);

  const filtered = siteDeliveries.filter(d => {
    const matchesSearch = 
      d.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.carrier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const awaitingCount = siteDeliveries.filter(d => d.status === 'awaiting_pickup').length;
  const collectedCount = siteDeliveries.filter(d => d.status === 'collected').length;

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const recipient = hosts.find(h => h.id === recipientId) || hosts[0];

    logDelivery({
      trackingNumber,
      carrier,
      recipientId: recipient.id,
      recipientName: recipient.name,
      department: recipient.department,
      packageType,
      storageLocation,
      notes: notes || undefined
    });

    setShowLogModal(false);
    setTrackingNumber('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-md p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Courier & Delivery Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track package intake, mailroom locker allocation, and instant employee collection notifications
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-md border border-brand-500 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Log Incoming Package</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-md">
          <div className="text-xs font-mono uppercase text-slate-400">Total Packages Today</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">{siteDeliveries.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Received at dock</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-md">
          <div className="text-xs font-mono uppercase text-slate-400">Awaiting Recipient Pickup</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{awaitingCount}</div>
          <div className="text-[11px] text-amber-400/80 mt-1">Stored in Mailroom</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-md">
          <div className="text-xs font-mono uppercase text-slate-400">Handed Over / Collected</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{collectedCount}</div>
          <div className="text-[11px] text-emerald-400/80 mt-1">Recipient signed</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-md p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tracking number, recipient employee, or carrier..."
            className="w-full bg-slate-950 border border-slate-700 rounded-sm pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'awaiting_pickup', 'collected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm border transition-colors ${
                statusFilter === tab
                  ? 'bg-slate-800 text-white border-brand-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {tab === 'all' ? 'All Packages' : tab === 'awaiting_pickup' ? 'Awaiting Pickup' : 'Collected'}
            </button>
          ))}
        </div>
      </div>

      {/* Deliveries Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                <th className="py-3 px-4">Tracking & Carrier</th>
                <th className="py-3 px-3">Recipient Staff</th>
                <th className="py-3 px-3">Package Classification</th>
                <th className="py-3 px-3">Storage Location</th>
                <th className="py-3 px-3">Received At</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    No delivery records match your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(d => (
                  <tr key={d.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-200">{d.trackingNumber}</div>
                      <div className="text-[11px] text-brand-400 font-medium">{d.carrier}</div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200">{d.recipientName}</div>
                      <div className="text-[10px] text-slate-400">{d.department}</div>
                    </td>

                    <td className="py-3 px-3 text-slate-300">
                      <div>{d.packageType}</div>
                      {d.notes && <div className="text-[10px] text-slate-500 italic">{d.notes}</div>}
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-mono text-xs bg-slate-950 px-2 py-0.5 rounded-sm border border-slate-800 text-slate-300 font-bold">
                        {d.storageLocation}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-400">
                      {new Date(d.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className="py-3 px-3">
                      {d.status === 'awaiting_pickup' ? (
                        <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm">
                          AWAITING PICKUP
                        </span>
                      ) : (
                        <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm">
                          COLLECTED
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right space-x-1.5">
                      {d.status === 'awaiting_pickup' && (
                        <>
                          <button
                            onClick={() => notifyDeliveryRecipient(d.id)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-brand-300 rounded-sm border border-slate-700 transition-colors"
                            title="Resend Slack / Email Ping"
                          >
                            <Bell className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => collectDelivery(d.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-sm transition-colors"
                          >
                            Mark Handed Over
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Package Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-md max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Package className="w-4 h-4 text-brand-400" />
                <span>Log Incoming Delivery</span>
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-slate-400 hover:text-slate-100 font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLogSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Carrier / Courier *</label>
                  <select
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
                  >
                    <option value="FedEx">FedEx</option>
                    <option value="DHL">DHL Express</option>
                    <option value="UPS">UPS</option>
                    <option value="Amazon Logistics">Amazon Logistics</option>
                    <option value="BlueDart">BlueDart</option>
                    <option value="Courier Direct">Direct Courier</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Tracking Number *</label>
                  <input
                    type="text"
                    required
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. FX-9921-8812"
                    className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Recipient Staff Member *</label>
                  <select
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
                  >
                    {hosts.map(h => (
                      <option key={h.id} value={h.id}>
                        {h.name} ({h.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Package Type</label>
                  <select
                    value={packageType}
                    onChange={(e) => setPackageType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
                  >
                    <option value="Parcel / Box">Parcel / Box</option>
                    <option value="Documents / Envelope">Documents / Envelope</option>
                    <option value="Hardware Crate">Hardware Crate</option>
                    <option value="Fragile Equipment">Fragile Equipment</option>
                    <option value="Perishable">Perishable / Catering</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Storage Shelf / Locker *</label>
                <input
                  type="text"
                  required
                  value={storageLocation}
                  onChange={(e) => setStorageLocation(e.target.value)}
                  placeholder="e.g. Locker #08 or Bay 2"
                  className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Handling Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Signature required or fragile glass components"
                  className="w-full bg-slate-950 border border-slate-700 rounded-sm px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-md border border-brand-500 shadow-sm"
                >
                  Log & Dispatch Slack Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

