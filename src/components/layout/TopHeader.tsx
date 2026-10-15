import React, { useState } from 'react';
import { 
  ShieldAlert, 
  HardHat, 
  Bell, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  ChevronDown, 
  CheckCheck, 
  ExternalLink, 
  AlertTriangle, 
  Building2, 
  Home, 
  Award,
  CheckCircle,
  X,
  Palette
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { UserRole } from '../../types';
import { SiteSentinelLogo, LogoManagerModal } from '../common/SiteSentinelLogo';

interface TopHeaderProps {
  onGoToLanding: () => void;
  onNavigateToTab: (tabId: string, incidentId?: string) => void;
  onOpenEvaluation: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ 
  onGoToLanding, 
  onNavigateToTab,
  onOpenEvaluation
}) => {
  const { 
    currentUser, 
    switchUser, 
    sites, 
    activeSite, 
    setActiveSiteId, 
    notifications, 
    unreadNotificationCount, 
    markNotificationRead, 
    markAllNotificationsRead,
    audioEnabled,
    setAudioEnabled,
    resetDemoData,
    kpis
  } = useSafety();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showSiteMenu, setShowSiteMenu] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [showLogoModal, setShowLogoModal] = useState(false);

  const handleRoleChange = (role: UserRole) => {
    switchUser(role);
    setShowRoleMenu(false);
  };

  const handleReset = () => {
    resetDemoData();
    setResetConfirm(true);
    setTimeout(() => setResetConfirm(false), 2500);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#04120c]/95 backdrop-blur-md border-b border-[#10B981]/25 px-4 lg:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Brand + Site Selector */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <div 
              onClick={onGoToLanding}
              className="flex items-center cursor-pointer group"
              title="Return to Public Landing Page"
            >
              <SiteSentinelLogo 
                size="md" 
                showWordmark={true} 
                showBadge={true} 
                badgeText="PRO" 
                subtitle="Intelligent Safety Surveillance OS" 
              />
            </div>

            {/* Set/Customize Logo button */}
            <button
              onClick={() => setShowLogoModal(true)}
              className="p-1.5 rounded-lg bg-[#071f16] border border-[#10B981]/30 text-[#A7F3D0] hover:text-white hover:border-[#00FF9D] hover:bg-[#0a291e] transition-all text-[11px] font-medium hidden sm:inline-flex items-center gap-1.5"
              title="Customize, change or upload custom logo"
            >
              <Palette className="w-3 h-3 text-[#00FF9D]" />
              <span className="hidden md:inline">Logo</span>
            </button>
          </div>

          <div className="h-6 w-px bg-[#10B981]/20 hidden sm:block" />

          {/* Site Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSiteMenu(!showSiteMenu)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#071f16] border border-[#10B981]/30 text-xs text-white hover:border-[#00FF9D] hover:bg-[#0a291e] transition-all"
            >
              <Building2 className="w-3.5 h-3.5 text-[#00FF9D]" />
              <span className="font-semibold max-w-[130px] sm:max-w-[200px] truncate text-white">{activeSite.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showSiteMenu && (
              <div className="absolute top-full left-0 mt-2 w-72 rounded-xl glass-panel-glow border border-[#10B981]/40 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-2 py-1 text-[10px] font-mono-code text-[#00FF9D] uppercase tracking-wider font-bold">
                  Active Construction Sites
                </div>
                {sites.map(site => (
                  <button
                    key={site.id}
                    onClick={() => {
                      setActiveSiteId(site.id);
                      setShowSiteMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      site.id === activeSite.id ? 'bg-[#10B981]/25 text-[#00FF9D] font-bold' : 'text-white hover:bg-[#0e3829]'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-white">{site.name}</div>
                      <div className="text-[10px] text-[#A7F3D0]">{site.code} • {site.totalWorkersOnSite} workers</div>
                    </div>
                    {site.id === activeSite.id && <span className="w-2 h-2 rounded-full bg-[#00FF9D]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right HUD Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* ECOTHON Hackathon badge */}
          <button
            onClick={onOpenEvaluation}
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#10B981]/20 border border-[#10B981]/50 text-[#00FF9D] hover:bg-[#10B981]/30 transition-all text-xs font-bold"
          >
            <Award className="w-3.5 h-3.5 text-[#00FF9D]" />
            <span>ECOTHON '26 Judge Guide</span>
          </button>

          {/* Audio Chime Toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2 rounded-lg border transition-all text-xs ${
              audioEnabled 
                ? 'bg-[#071f16] border-[#10B981]/40 text-[#00FF9D] hover:bg-[#0a291e]' 
                : 'bg-[#04120c] border-slate-700 text-slate-500 hover:text-white'
            }`}
            title={audioEnabled ? 'Auditory hazard alarms: ON' : 'Auditory hazard alarms: OFF'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={handleReset}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono-code transition-all flex items-center gap-1.5 ${
              resetConfirm
                ? 'bg-[#10B981]/30 border-[#00FF9D] text-[#00FF9D] font-bold'
                : 'bg-[#071f16] border-[#10B981]/30 text-white hover:text-[#00FF9D] hover:border-[#00FF9D]'
            }`}
            title="Reset dataset back to standard demo state"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resetConfirm ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline font-semibold">{resetConfirm ? 'Reset Complete' : 'Reset Demo'}</span>
          </button>

          {/* Notification Center */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg bg-[#071f16] border border-[#10B981]/30 text-white hover:border-[#00FF9D] transition-all"
              title="Incident notifications"
            >
              <Bell className="w-4 h-4 text-[#00FF9D]" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#EF4444] text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl glass-panel-glow border border-[#10B981]/40 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-3 bg-[#071f16] border-b border-[#10B981]/25 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-heading font-bold text-xs text-white">Site Notifications</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-[#EF4444]/25 text-[#FF6B6B] text-[10px] font-bold">
                      {unreadNotificationCount} unread
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-[#00FF9D] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <CheckCheck className="w-3 h-3" />
                      <span>Mark all read</span>
                    </button>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="p-1 hover:text-white text-slate-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-[#10B981]/15">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-300">
                      No notifications at this time.
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.incidentId) {
                            onNavigateToTab('incidents', n.incidentId);
                            setShowNotifications(false);
                          }
                        }}
                        className={`p-3 text-left transition-colors cursor-pointer hover:bg-[#0e3829] ${
                          n.read ? 'bg-transparent opacity-75' : 'bg-[#10B981]/10 font-medium'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center space-x-1.5">
                            <span className={`w-2 h-2 rounded-full ${
                              n.severity === 'Critical' ? 'bg-[#EF4444]' :
                              n.severity === 'High' ? 'bg-[#FBBF24]' : 'bg-[#00FF9D]'
                            }`} />
                            <span className="text-xs text-white font-bold">{n.title}</span>
                          </div>
                          <span className="text-[10px] text-[#A7F3D0] font-mono-code">{n.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-200 mt-1 line-clamp-2">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#071f16] border border-[#10B981]/35 hover:border-[#00FF9D] transition-all text-xs text-left"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover border border-[#00FF9D]/60"
              />
              <div className="hidden sm:block">
                <div className="font-bold text-white leading-tight flex items-center gap-1.5">
                  <span>{currentUser.name}</span>
                  <span className={`text-[9px] font-mono-code px-1 rounded uppercase font-black ${
                    currentUser.role === 'admin' ? 'bg-[#10B981]/25 text-[#00FF9D] border border-[#10B981]/50' :
                    currentUser.role === 'supervisor' ? 'bg-[#34D399]/25 text-white border border-[#34D399]/50' :
                    'bg-white/20 text-white border border-white/40'
                  }`}>
                    {currentUser.role}
                  </span>
                </div>
                <div className="text-[10px] text-[#A7F3D0] truncate max-w-[120px]">{currentUser.title}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl glass-panel-glow border border-[#10B981]/40 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-1 pb-2 border-b border-[#10B981]/20 mb-2">
                  <div className="text-xs font-heading font-bold text-white">Switch Demo User Role</div>
                  <div className="text-[10px] text-[#A7F3D0]">Test role-based access control (RBAC) instantly:</div>
                </div>

                <div className="space-y-1.5">
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      currentUser.role === 'admin' ? 'bg-[#10B981]/30 border border-[#00FF9D]' : 'hover:bg-[#0e3829]'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-[#00FF9D]">1. Admin (Full Control)</div>
                      <div className="text-[10px] text-white">Manage rules, zones, system config & users.</div>
                    </div>
                    {currentUser.role === 'admin' && <CheckCircle className="w-4 h-4 text-[#00FF9D]" />}
                  </button>

                  <button
                    onClick={() => handleRoleChange('supervisor')}
                    className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      currentUser.role === 'supervisor' ? 'bg-[#10B981]/30 border border-[#00FF9D]' : 'hover:bg-[#0e3829]'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-[#34D399]">2. Safety Supervisor</div>
                      <div className="text-[10px] text-white">Verify/reject alerts, assign actions, resolve.</div>
                    </div>
                    {currentUser.role === 'supervisor' && <CheckCircle className="w-4 h-4 text-[#34D399]" />}
                  </button>

                  <button
                    onClick={() => handleRoleChange('viewer')}
                    className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      currentUser.role === 'viewer' ? 'bg-[#10B981]/30 border border-[#00FF9D]' : 'hover:bg-[#0e3829]'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-white">3. Management / Read-Only</div>
                      <div className="text-[10px] text-slate-200">Executive dashboard & audit view only.</div>
                    </div>
                    {currentUser.role === 'viewer' && <CheckCircle className="w-4 h-4 text-white" />}
                  </button>
                </div>

                <div className="mt-3 pt-2 border-t border-[#10B981]/20 text-[10px] text-[#A7F3D0] flex items-center justify-between">
                  <span className="font-mono-code font-bold">Current: {currentUser.role.toUpperCase()}</span>
                  <button onClick={onGoToLanding} className="text-[#00FF9D] hover:underline flex items-center gap-1 font-bold">
                    <Home className="w-3 h-3" />
                    <span>Landing Page</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Logo Manager Modal */}
      <LogoManagerModal 
        isOpen={showLogoModal} 
        onClose={() => setShowLogoModal(false)} 
      />
    </header>
  );
};
