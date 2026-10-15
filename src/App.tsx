import React, { useState } from 'react';
import { SafetyProvider, useSafety } from './context/SafetyContext';
import { LandingPage } from './components/landing/LandingPage';
import { TopHeader } from './components/layout/TopHeader';
import { NavigationDock } from './components/layout/NavigationDock';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { VisionLab } from './components/vision/VisionLab';
import { LiveMonitoring } from './components/monitoring/LiveMonitoring';
import { IncidentManager } from './components/incidents/IncidentManager';
import { RestrictedZones } from './components/zones/RestrictedZones';
import { ProximityMonitor } from './components/proximity/ProximityMonitor';
import { HotspotMap } from './components/hotspots/HotspotMap';
import { RepeatIntelligence } from './components/intelligence/RepeatIntelligence';
import { SafetyAssistant } from './components/assistant/SafetyAssistant';
import { ReportsManager } from './components/reports/ReportsManager';
import { EvaluationGuide } from './components/evaluation/EvaluationGuide';

function AppContent() {
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [targetIncidentId, setTargetIncidentId] = useState<string | undefined>(undefined);
  const [targetSampleId, setTargetSampleId] = useState<string | undefined>(undefined);
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);

  // Navigate handler used across child components
  const handleNavigateToTab = (tabId: string, incidentId?: string) => {
    if (tabId === 'landing') {
      setViewMode('landing');
      return;
    }
    setViewMode('app');
    setActiveTab(tabId);
    if (incidentId) {
      setTargetIncidentId(incidentId);
    }
  };

  const handleLaunchApp = () => {
    setViewMode('app');
    setActiveTab('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreDemo = (sampleId?: string) => {
    setViewMode('app');
    setActiveTab('vision-lab');
    if (sampleId) {
      setTargetSampleId(sampleId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEvaluation = () => {
    setViewMode('app');
    setActiveTab('evaluation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (viewMode === 'landing') {
    return (
      <LandingPage
        onLaunchApp={handleLaunchApp}
        onExploreDemo={handleExploreDemo}
        onOpenEvaluation={handleOpenEvaluation}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#04120c] text-white flex flex-col bg-blueprint-grid selection:bg-[#00FF9D]/30 selection:text-white">
      {/* Top Application Header */}
      <TopHeader
        onGoToLanding={() => setViewMode('landing')}
        onNavigateToTab={handleNavigateToTab}
        onOpenEvaluation={handleOpenEvaluation}
      />

      {/* Main App Layout: Dock + Content */}
      <div className="flex-1 flex">
        {/* Navigation Sidebar / Dock */}
        <NavigationDock
          activeTab={activeTab}
          onSelectTab={(tabId) => {
            setActiveTab(tabId);
            setTargetIncidentId(undefined);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isCollapsed={isDockCollapsed}
          onToggleCollapse={() => setIsDockCollapsed(!isDockCollapsed)}
        />

        {/* Dynamic Viewport Container */}
        <main
          className={`flex-1 transition-all duration-300 p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-57px)] overflow-x-hidden ${
            isDockCollapsed ? 'ml-16' : 'ml-16 lg:ml-64'
          }`}
        >
          <div className="max-w-7xl mx-auto pb-12">
            {activeTab === 'overview' && (
              <OverviewDashboard onNavigateToTab={handleNavigateToTab} />
            )}

            {activeTab === 'vision-lab' && (
              <VisionLab
                initialSampleId={targetSampleId}
                onNavigateToTab={handleNavigateToTab}
              />
            )}

            {activeTab === 'live-monitoring' && (
              <LiveMonitoring onNavigateToTab={handleNavigateToTab} />
            )}

            {activeTab === 'incidents' && (
              <IncidentManager
                initialSelectedId={targetIncidentId}
                onNavigateToTab={handleNavigateToTab}
              />
            )}

            {activeTab === 'zones' && <RestrictedZones />}

            {activeTab === 'proximity' && <ProximityMonitor />}

            {activeTab === 'hotspots' && (
              <HotspotMap onNavigateToTab={handleNavigateToTab} />
            )}

            {activeTab === 'intelligence' && <RepeatIntelligence />}

            {activeTab === 'assistant' && <SafetyAssistant />}

            {activeTab === 'reports' && <ReportsManager />}

            {activeTab === 'evaluation' && (
              <EvaluationGuide onNavigateToTab={handleNavigateToTab} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SafetyProvider>
      <AppContent />
    </SafetyProvider>
  );
}
