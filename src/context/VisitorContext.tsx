import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Visitor, 
  Host, 
  Delivery, 
  WatchlistEntry, 
  AuditLog, 
  SiteLocation, 
  BadgeConfig, 
  EvacuationRecord,
  VisitorStatus 
} from '../types';
import { 
  INITIAL_VISITORS, 
  INITIAL_HOSTS, 
  INITIAL_DELIVERIES, 
  INITIAL_WATCHLIST, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_SITES, 
  DEFAULT_BADGE_CONFIG 
} from '../mock/data';

interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'danger' | 'warning';
}

interface VisitorContextType {
  visitors: Visitor[];
  hosts: Host[];
  deliveries: Delivery[];
  watchlist: WatchlistEntry[];
  auditLogs: AuditLog[];
  sites: SiteLocation[];
  selectedSiteId: string;
  badgeConfig: BadgeConfig;
  toast: ToastNotification | null;
  activeBadgeToPrint: Visitor | null;
  activeDossierVisitor: Visitor | null;
  isEvacuationActive: boolean;
  evacuationList: EvacuationRecord[];
  
  // Setters / UI actions
  setSelectedSiteId: (siteId: string) => void;
  setActiveBadgeToPrint: (visitor: Visitor | null) => void;
  setActiveDossierVisitor: (visitor: Visitor | null) => void;
  dismissToast: () => void;
  showToast: (title: string, message: string, type: ToastNotification['type']) => void;

  // Domain Actions
  checkInVisitor: (visitorId: string) => boolean;
  checkOutVisitor: (visitorId: string) => void;
  preRegisterVisitor: (data: Omit<Visitor, 'id' | 'badgeNumber' | 'status' | 'siteId' | 'wifiAccessCode'>) => Visitor;
  kioskSelfCheckIn: (data: {
    fullName: string;
    email: string;
    phone: string;
    company: string;
    hostId: string;
    purpose: string;
    idType: Visitor['idType'];
    idNumberMasked: string;
    ndaSignatureUrl?: string;
  }) => { success: boolean; visitor?: Visitor; reason?: string };
  updateVisitor: (visitorId: string, updates: Partial<Visitor>) => void;
  deleteVisitor: (visitorId: string) => void;

  // Security & Watchlist
  addWatchlistEntry: (entry: Omit<WatchlistEntry, 'id' | 'addedAt'>) => void;
  removeWatchlistEntry: (id: string) => void;
  checkWatchlistMatch: (fullName: string) => WatchlistEntry | undefined;

  // Evacuation & Emergency
  triggerEmergencyAlarm: () => void;
  silenceEmergencyAlarm: () => void;
  toggleEvacuationSafe: (visitorId: string) => void;
  markAllEvacueesSafe: () => void;

  // Deliveries
  logDelivery: (data: Omit<Delivery, 'id' | 'receivedAt' | 'status' | 'siteId'>) => void;
  collectDelivery: (deliveryId: string) => void;
  notifyDeliveryRecipient: (deliveryId: string) => void;

  // Badging & Config
  updateBadgeConfig: (newConfig: Partial<BadgeConfig>) => void;
}

const VisitorContext = createContext<VisitorContextType | undefined>(undefined);

export const VisitorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage or fallback to enterprise mock
  const [visitors, setVisitors] = useState<Visitor[]>(() => {
    const saved = localStorage.getItem('aegis_visitors_v2');
    return saved ? JSON.parse(saved) : INITIAL_VISITORS;
  });

  const [hosts, setHosts] = useState<Host[]>(() => {
    const saved = localStorage.getItem('aegis_hosts_v2');
    return saved ? JSON.parse(saved) : INITIAL_HOSTS;
  });

  const [deliveries, setDeliveries] = useState<Delivery[]>(() => {
    const saved = localStorage.getItem('aegis_deliveries_v2');
    return saved ? JSON.parse(saved) : INITIAL_DELIVERIES;
  });

  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>(() => {
    const saved = localStorage.getItem('aegis_watchlist_v2');
    return saved ? JSON.parse(saved) : INITIAL_WATCHLIST;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('aegis_audit_v2');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [sites] = useState<SiteLocation[]>(INITIAL_SITES);
  const [selectedSiteId, setSelectedSiteId] = useState<string>('site-sf');
  const [badgeConfig, setBadgeConfig] = useState<BadgeConfig>(() => {
    const saved = localStorage.getItem('aegis_badge_config');
    return saved ? JSON.parse(saved) : DEFAULT_BADGE_CONFIG;
  });

  const [toast, setToast] = useState<ToastNotification | null>(null);
  const [activeBadgeToPrint, setActiveBadgeToPrint] = useState<Visitor | null>(null);
  const [activeDossierVisitor, setActiveDossierVisitor] = useState<Visitor | null>(null);
  const [isEvacuationActive, setIsEvacuationActive] = useState<boolean>(false);
  const [evacuationList, setEvacuationList] = useState<EvacuationRecord[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('aegis_visitors_v2', JSON.stringify(visitors));
  }, [visitors]);

  useEffect(() => {
    localStorage.setItem('aegis_deliveries_v2', JSON.stringify(deliveries));
  }, [deliveries]);

  useEffect(() => {
    localStorage.setItem('aegis_watchlist_v2', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('aegis_audit_v2', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('aegis_badge_config', JSON.stringify(badgeConfig));
  }, [badgeConfig]);

  // Sync evacuation list whenever visitors or evacuation state changes
  useEffect(() => {
    const currentlyOnSite = visitors.filter(
      v => (v.status === 'checked_in' || v.status === 'overstay') && v.siteId === selectedSiteId
    );

    setEvacuationList(prev => {
      return currentlyOnSite.map(v => {
        const existing = prev.find(p => p.visitorId === v.id);
        return {
          visitorId: v.id,
          fullName: v.fullName,
          company: v.company,
          visitorType: v.visitorType,
          hostName: v.hostName,
          hostDepartment: v.hostDepartment,
          checkedInTime: v.checkInTime || new Date().toISOString(),
          zone: v.accessZones[0] || 'L18 Lobby Area',
          isSafe: existing ? existing.isSafe : false,
          markedSafeAt: existing?.markedSafeAt,
          markedBy: existing?.markedBy
        };
      });
    });
  }, [visitors, selectedSiteId]);

  const showToast = (title: string, message: string, type: ToastNotification['type']) => {
    const id = String(Date.now());
    setToast({ id, title, message, type });
    setTimeout(() => {
      setToast(current => (current?.id === id ? null : current));
    }, 4500);
  };

  const dismissToast = () => setToast(null);

  const addAuditLog = (
    action: AuditLog['action'], 
    details: string, 
    severity: AuditLog['severity'], 
    targetId?: string
  ) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'Reception Operations Console',
      action,
      details,
      severity,
      targetId
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const checkWatchlistMatch = (fullName: string): WatchlistEntry | undefined => {
    const clean = fullName.trim().toLowerCase();
    return watchlist.find(w => w.fullName.trim().toLowerCase() === clean);
  };

  const checkInVisitor = (visitorId: string): boolean => {
    const target = visitors.find(v => v.id === visitorId);
    if (!target) return false;

    // Check watchlist
    const match = checkWatchlistMatch(target.fullName);
    if (match && match.severity === 'CRITICAL') {
      showToast(
        'SECURITY ALERT: Watchlist Hit',
        `Access DENIED for ${target.fullName}. Critical Security Flag: ${match.category}. Incident response notified.`,
        'danger'
      );
      addAuditLog(
        'WATCHLIST_HIT',
        `Blocked check-in attempt for ${target.fullName}. Reason: ${match.notes}`,
        'DANGER',
        target.id
      );
      return false;
    }

    const nowIso = new Date().toISOString();
    const newBadge = target.badgeNumber && target.badgeNumber !== 'PENDING' 
      ? target.badgeNumber 
      : `V-${Math.floor(8800 + Math.random() * 900)}`;

    setVisitors(prev => prev.map(v => {
      if (v.id === visitorId) {
        return {
          ...v,
          status: 'checked_in' as VisitorStatus,
          checkInTime: nowIso,
          badgeNumber: newBadge,
          idVerified: true
        };
      }
      return v;
    }));

    addAuditLog(
      'CHECK_IN',
      `Checked in ${target.fullName} (${target.company}). Issued badge ${newBadge}. Host ${target.hostName} alerted.`,
      'SUCCESS',
      target.id
    );

    showToast(
      'Visitor Checked In',
      `${target.fullName} is now checked in. Host ${target.hostName} notified via Slack & SMS.`,
      'success'
    );

    return true;
  };

  const checkOutVisitor = (visitorId: string) => {
    const target = visitors.find(v => v.id === visitorId);
    if (!target) return;

    const nowIso = new Date().toISOString();

    setVisitors(prev => prev.map(v => {
      if (v.id === visitorId) {
        return {
          ...v,
          status: 'checked_out' as VisitorStatus,
          checkOutTime: nowIso
        };
      }
      return v;
    }));

    addAuditLog(
      'CHECK_OUT',
      `Checked out ${target.fullName} (${target.company}). Badge ${target.badgeNumber} deactivated.`,
      'INFO',
      target.id
    );

    showToast(
      'Visitor Checked Out',
      `${target.fullName} has departed. Badge ${target.badgeNumber} returned.`,
      'info'
    );
  };

  const preRegisterVisitor = (data: Omit<Visitor, 'id' | 'badgeNumber' | 'status' | 'siteId' | 'wifiAccessCode'>): Visitor => {
    const newId = `vis-${Date.now().toString().slice(-6)}`;
    const randomBadge = `V-${Math.floor(9000 + Math.random() * 999)}`;
    const randomWifi = `APEX-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newVisitor: Visitor = {
      ...data,
      id: newId,
      status: 'expected',
      badgeNumber: randomBadge,
      siteId: selectedSiteId,
      wifiAccessCode: randomWifi,
      idVerified: false,
      ndaSigned: data.ndaSigned || false
    };

    setVisitors(prev => [newVisitor, ...prev]);

    addAuditLog(
      'PRE_REGISTER',
      `Pre-registered ${newVisitor.fullName} from ${newVisitor.company} for host ${newVisitor.hostName}.`,
      'SUCCESS',
      newVisitor.id
    );

    showToast(
      'Pre-Registration Created',
      `Secure digital pass issued for ${newVisitor.fullName}. Notification sent to visitor.`,
      'success'
    );

    return newVisitor;
  };

  const kioskSelfCheckIn = (data: {
    fullName: string;
    email: string;
    phone: string;
    company: string;
    hostId: string;
    purpose: string;
    idType: Visitor['idType'];
    idNumberMasked: string;
    ndaSignatureUrl?: string;
  }) => {
    // Check security watchlist
    const match = checkWatchlistMatch(data.fullName);
    if (match && match.severity === 'CRITICAL') {
      addAuditLog(
        'WATCHLIST_HIT',
        `Kiosk denied self check-in for flagged name: ${data.fullName}.`,
        'DANGER'
      );
      return { 
        success: false, 
        reason: 'Security check flagged. Please report to the Security Desk officer immediately.' 
      };
    }

    const host = hosts.find(h => h.id === data.hostId) || hosts[0];
    const newId = `vis-${Date.now().toString().slice(-6)}`;
    const newBadge = `V-${Math.floor(8900 + Math.random() * 900)}`;
    const nowIso = new Date().toISOString();

    const createdVisitor: Visitor = {
      id: newId,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      company: data.company,
      purpose: data.purpose,
      visitorType: 'Client / Guest',
      hostId: host.id,
      hostName: host.name,
      hostDepartment: host.department,
      hostEmail: host.email,
      expectedArrival: nowIso,
      checkInTime: nowIso,
      status: 'checked_in',
      badgeNumber: newBadge,
      accessZones: ['L18 Lobby Area', `${host.floor} Meeting Room`],
      ndaSigned: true,
      ndaSignatureDate: nowIso,
      ndaSignatureUrl: data.ndaSignatureUrl,
      idVerified: true,
      idType: data.idType,
      idNumberMasked: data.idNumberMasked,
      escortRequired: false,
      wifiAccessCode: `APEX-KIOSK-${Math.floor(100 + Math.random() * 899)}`,
      siteId: selectedSiteId
    };

    setVisitors(prev => [createdVisitor, ...prev]);

    addAuditLog(
      'CHECK_IN',
      `Kiosk iPad Self Check-In: ${createdVisitor.fullName} checked in for ${host.name}.`,
      'SUCCESS',
      createdVisitor.id
    );

    showToast(
      'Self Check-In Successful',
      `Welcome, ${createdVisitor.fullName}! Host ${host.name} has been notified. Badge ${newBadge} ready.`,
      'success'
    );

    return { success: true, visitor: createdVisitor };
  };

  const updateVisitor = (visitorId: string, updates: Partial<Visitor>) => {
    setVisitors(prev => prev.map(v => v.id === visitorId ? { ...v, ...updates } : v));
    showToast('Record Updated', 'Visitor information updated successfully.', 'info');
  };

  const deleteVisitor = (visitorId: string) => {
    setVisitors(prev => prev.filter(v => v.id !== visitorId));
    showToast('Record Removed', 'Visitor entry has been deleted from active registry.', 'info');
  };

  const addWatchlistEntry = (entry: Omit<WatchlistEntry, 'id' | 'addedAt'>) => {
    const newEntry: WatchlistEntry = {
      ...entry,
      id: `wl-${Date.now().toString().slice(-5)}`,
      addedAt: new Date().toISOString()
    };
    setWatchlist(prev => [newEntry, ...prev]);
    addAuditLog('WATCHLIST_ADDED', `Added ${newEntry.fullName} to security watchlist. Category: ${newEntry.category}`, 'WARN');
    showToast('Watchlist Updated', `${newEntry.fullName} added to access denial watchlist.`, 'warning');
  };

  const removeWatchlistEntry = (id: string) => {
    const target = watchlist.find(w => w.id === id);
    setWatchlist(prev => prev.filter(w => w.id !== id));
    showToast('Removed from Watchlist', `${target?.fullName || 'Target'} is no longer flagged on the security list.`, 'info');
  };

  const triggerEmergencyAlarm = () => {
    setIsEvacuationActive(true);
    addAuditLog(
      'EMERGENCY_ALARM',
      'EMERGENCY EVACUATION ACTIVATED: Building muster protocol initiated. Roll call system active.',
      'DANGER'
    );
    showToast(
      'EMERGENCY EVACUATION INITIATED',
      'All personnel and on-site visitors must assemble at designated muster stations.',
      'danger'
    );
  };

  const silenceEmergencyAlarm = () => {
    setIsEvacuationActive(false);
    addAuditLog('EVACUATION_ROLL_CALL', 'Emergency state stood down. Normal operations resumed.', 'INFO');
    showToast('Alarm Stood Down', 'Emergency evacuation mode has been deactivated.', 'info');
  };

  const toggleEvacuationSafe = (visitorId: string) => {
    setEvacuationList(prev => prev.map(rec => {
      if (rec.visitorId === visitorId) {
        const nextSafe = !rec.isSafe;
        return {
          ...rec,
          isSafe: nextSafe,
          markedSafeAt: nextSafe ? new Date().toISOString() : undefined,
          markedBy: nextSafe ? 'Safety Marshal (Console)' : undefined
        };
      }
      return rec;
    }));
  };

  const markAllEvacueesSafe = () => {
    const nowIso = new Date().toISOString();
    setEvacuationList(prev => prev.map(rec => ({
      ...rec,
      isSafe: true,
      markedSafeAt: nowIso,
      markedBy: 'Chief Safety Marshal (Bulk Verify)'
    })));
    showToast('Roll Call Completed', 'All on-site visitors have been verified safe.', 'success');
  };

  const logDelivery = (data: Omit<Delivery, 'id' | 'receivedAt' | 'status' | 'siteId'>) => {
    const newDelivery: Delivery = {
      ...data,
      id: `del-${Date.now().toString().slice(-5)}`,
      receivedAt: new Date().toISOString(),
      status: 'awaiting_pickup',
      siteId: selectedSiteId
    };

    setDeliveries(prev => [newDelivery, ...prev]);

    addAuditLog(
      'DELIVERY_LOGGED',
      `Logged package ${newDelivery.trackingNumber} (${newDelivery.carrier}) for ${newDelivery.recipientName}. Location: ${newDelivery.storageLocation}`,
      'INFO',
      newDelivery.id
    );

    showToast(
      'Package Received & Logged',
      `${newDelivery.carrier} delivery logged for ${newDelivery.recipientName}. Host notified.`,
      'info'
    );
  };

  const collectDelivery = (deliveryId: string) => {
    const nowIso = new Date().toISOString();
    setDeliveries(prev => prev.map(d => {
      if (d.id === deliveryId) {
        return {
          ...d,
          status: 'collected',
          collectedAt: nowIso
        };
      }
      return d;
    }));

    addAuditLog('DELIVERY_COLLECTED', `Delivery ${deliveryId} collected by recipient.`, 'SUCCESS', deliveryId);
    showToast('Package Collected', 'Delivery marked as handed over.', 'success');
  };

  const notifyDeliveryRecipient = (deliveryId: string) => {
    const target = deliveries.find(d => d.id === deliveryId);
    if (!target) return;
    showToast(
      'Notification Dispatched',
      `Slack ping and email alert resent to ${target.recipientName} regarding package in ${target.storageLocation}.`,
      'info'
    );
  };

  const updateBadgeConfig = (newConfig: Partial<BadgeConfig>) => {
    setBadgeConfig(prev => ({ ...prev, ...newConfig }));
    addAuditLog('SETTINGS_UPDATED', 'Security badge configuration and print template updated.', 'INFO');
    showToast('Settings Saved', 'Visitor badge template updated.', 'success');
  };

  return (
    <VisitorContext.Provider
      value={{
        visitors,
        hosts,
        deliveries,
        watchlist,
        auditLogs,
        sites,
        selectedSiteId,
        badgeConfig,
        toast,
        activeBadgeToPrint,
        activeDossierVisitor,
        isEvacuationActive,
        evacuationList,
        setSelectedSiteId,
        setActiveBadgeToPrint,
        setActiveDossierVisitor,
        dismissToast,
        showToast,
        checkInVisitor,
        checkOutVisitor,
        preRegisterVisitor,
        kioskSelfCheckIn,
        updateVisitor,
        deleteVisitor,
        addWatchlistEntry,
        removeWatchlistEntry,
        checkWatchlistMatch,
        triggerEmergencyAlarm,
        silenceEmergencyAlarm,
        toggleEvacuationSafe,
        markAllEvacueesSafe,
        logDelivery,
        collectDelivery,
        notifyDeliveryRecipient,
        updateBadgeConfig
      }}
    >
      {children}
    </VisitorContext.Provider>
  );
};

export const useVisitor = () => {
  const context = useContext(VisitorContext);
  if (!context) {
    throw new Error('useVisitor must be used within a VisitorProvider');
  }
  return context;
};

