export type VisitorStatus = 'expected' | 'checked_in' | 'checked_out' | 'overstay' | 'rejected';

export type VisitorType = 
  | 'Client / Guest'
  | 'Contractor'
  | 'Job Interviewee'
  | 'Vendor / Supplier'
  | 'VIP Partner'
  | 'Board Member'
  | 'Auditor / Inspector'
  | 'Maintenance';

export type IdType = 'Passport' | 'Driver License' | 'Govt ID' | 'Corporate Badge' | 'National Identity';

export interface Visitor {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  avatarUrl?: string;
  purpose: string;
  visitorType: VisitorType;
  hostId: string;
  hostName: string;
  hostDepartment: string;
  hostEmail: string;
  expectedArrival: string; // ISO string
  checkInTime?: string;    // ISO string
  checkOutTime?: string;   // ISO string
  status: VisitorStatus;
  badgeNumber: string;
  accessZones: string[];
  ndaSigned: boolean;
  ndaSignatureDate?: string;
  ndaSignatureUrl?: string;
  idVerified: boolean;
  idType: IdType;
  idNumberMasked: string;
  vehicleRegistration?: string;
  escortRequired: boolean;
  wifiAccessCode: string;
  notes?: string;
  isFlagged?: boolean;
  flagReason?: string;
  siteId: string;
}

export interface Host {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  floor: string;
  officeNumber: string;
  avatarUrl: string;
  isAvailable: boolean;
  siteId: string;
}

export type DeliveryStatus = 'awaiting_pickup' | 'collected' | 'returned_to_sender';

export interface Delivery {
  id: string;
  trackingNumber: string;
  carrier: 'FedEx' | 'DHL' | 'UPS' | 'Amazon Logistics' | 'BlueDart' | 'Courier Direct';
  recipientId: string;
  recipientName: string;
  department: string;
  packageType: 'Documents / Envelope' | 'Parcel / Box' | 'Hardware Crate' | 'Fragile Equipment' | 'Perishable';
  storageLocation: string; // e.g., 'Shelf B-04', 'Locker #12'
  receivedAt: string;
  collectedAt?: string;
  status: DeliveryStatus;
  notes?: string;
  siteId: string;
}

export type WatchlistSeverity = 'CRITICAL' | 'WARNING' | 'VIP_ESCORT';

export interface WatchlistEntry {
  id: string;
  fullName: string;
  company?: string;
  category: 'Terminated Employee' | 'Past Security Incident' | 'Banned Vendor' | 'Litigation Restraint' | 'VIP Protocol';
  severity: WatchlistSeverity;
  actionRequired: string;
  addedAt: string;
  addedBy: string;
  notes: string;
}

export interface EvacuationRecord {
  visitorId: string;
  fullName: string;
  company: string;
  visitorType: VisitorType;
  hostName: string;
  hostDepartment: string;
  checkedInTime: string;
  zone: string;
  isSafe: boolean;
  markedSafeAt?: string;
  markedBy?: string;
}

export type AuditAction = 
  | 'CHECK_IN'
  | 'CHECK_OUT'
  | 'PRE_REGISTER'
  | 'BADGE_PRINTED'
  | 'WATCHLIST_HIT'
  | 'WATCHLIST_ADDED'
  | 'DELIVERY_LOGGED'
  | 'DELIVERY_COLLECTED'
  | 'EVACUATION_ROLL_CALL'
  | 'EMERGENCY_ALARM'
  | 'SETTINGS_UPDATED';

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: AuditAction;
  details: string;
  targetId?: string;
  severity: 'INFO' | 'WARN' | 'DANGER' | 'SUCCESS';
}

export interface SiteLocation {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  capacity: number;
  emergencyContact: string;
}

export interface BadgeConfig {
  companyName: string;
  badgeTitle: string;
  wifiNetwork: string;
  wifiPasswordDefault: string;
  showQrCode: boolean;
  emergencyNumber: string;
  requireEscortDisclaimer: boolean;
}

