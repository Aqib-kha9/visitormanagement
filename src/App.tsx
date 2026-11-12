import React, { useState } from 'react';
import { VisitorProvider } from './context/VisitorContext';
import { Header } from './components/common/Header';
import { Sidebar, ActiveTab } from './components/common/Sidebar';
import { Toast } from './components/common/Toast';
import { BadgeModal } from './components/common/BadgeModal';
import { VisitorDetailModal } from './components/visitors/VisitorDetailModal';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { VisitorListView } from './components/visitors/VisitorListView';
import { PreRegisterView } from './components/preregister/PreRegisterView';
import { KioskView } from './components/kiosk/KioskView';
import { DeliveriesView } from './components/deliveries/DeliveriesView';
import { HostDirectoryView } from './components/hosts/HostDirectoryView';
import { WatchlistView } from './components/security/WatchlistView';
import { EvacuationView } from './components/security/EvacuationView';
import { AuditTrailView } from './components/audit/AuditTrailView';
import { SettingsView } from './components/settings/SettingsView';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onNavigate={(tab) => setActiveTab(tab)} />;
      case 'visitors':
        return <VisitorListView />;
      case 'preregister':
        return <PreRegisterView />;
      case 'kiosk':
        return <KioskView />;
      case 'deliveries':
        return <DeliveriesView />;
      case 'hosts':
        return <HostDirectoryView onNavigate={(tab) => setActiveTab(tab)} />;
      case 'watchlist':
        return <WatchlistView />;
      case 'evacuation':
        return <EvacuationView />;
      case 'audit':
        return <AuditTrailView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Toast Alert Engine */}
      <Toast />

      {/* Global Modals */}
      <BadgeModal />
      <VisitorDetailModal />

      {/* Top Application Header */}
      <Header onNavigateToEvacuation={() => setActiveTab('evacuation')} />

      {/* Main Body Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />

        {/* Viewport Content Canvas */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <VisitorProvider>
      <AppContent />
    </VisitorProvider>
  );
};

export default App;

