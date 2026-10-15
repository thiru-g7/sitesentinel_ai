import React from 'react';
import { 
  LayoutDashboard, 
  Scan, 
  Video, 
  AlertOctagon, 
  Layers, 
  Radar, 
  MapPin, 
  TrendingUp, 
  Bot, 
  FileSpreadsheet, 
  Award,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { SiteSentinelLogo } from '../common/SiteSentinelLogo';

export interface TabItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
  description: string;
}

interface NavigationDockProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const NavigationDock: React.FC<NavigationDockProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { kpis, unreadNotificationCount } = useSafety();

  const tabs: TabItem[] = [
    { 
      id: 'overview', 
      label: 'Safety Overview', 
      icon: LayoutDashboard,
      description: 'KPI telemetry, incident velocity & category trends'
    },
    { 
      id: 'vision-lab', 
      label: 'AI Vision PPE Lab', 
      icon: Scan,
      badge: 'CV',
      badgeColor: 'bg-[#10B981]/25 text-[#00FF9D] border-[#10B981]/50',
      description: 'Multimodal PPE detection & bounding box inference'
    },
    { 
      id: 'live-monitoring', 
      label: 'Live Feeds', 
      icon: Video,
      badge: 'LIVE',
      badgeColor: 'bg-[#EF4444]/25 text-[#FF6B6B] border-[#EF4444]/40',
      description: 'Multi-camera stream matrix & optical motion scanning'
    },
    { 
      id: 'incidents', 
      label: 'Incident Manager', 
      icon: AlertOctagon,
      badge: kpis.pendingReview > 0 ? `${kpis.pendingReview} Pnd` : undefined,
      badgeColor: 'bg-[#FBBF24]/25 text-[#FBBF24] border-[#FBBF24]/50',
      description: 'Verification workflow, corrective action & audit trail'
    },
    { 
      id: 'zones', 
      label: 'Restricted Zones', 
      icon: Layers,
      description: 'Virtual geo-fence boundary editor & hazard tiers'
    },
    { 
      id: 'proximity', 
      label: 'Machinery Radar', 
      icon: Radar,
      description: 'Worker-machinery spatial proximity & blindspot alerts'
    },
    { 
      id: 'hotspots', 
      label: 'Site Blueprint Map', 
      icon: MapPin,
      description: 'Interactive 2D spatial layout with hazard pins'
    },
    { 
      id: 'intelligence', 
      label: 'Repeat Intelligence', 
      icon: TrendingUp,
      description: 'Zone heatmaps, recurring patterns & predictive risk'
    },
    { 
      id: 'assistant', 
      label: 'AI Safety Assistant', 
      icon: Bot,
      badge: 'AI',
      badgeColor: 'bg-[#00FF9D]/25 text-[#00FF9D] border-[#00FF9D]/50',
      description: 'Grounded natural language safety queries'
    },
    { 
      id: 'reports', 
      label: 'Reports & Export', 
      icon: FileSpreadsheet,
      description: 'CSV audits, compliance scorecards & summaries'
    },
    { 
      id: 'evaluation', 
      label: 'ECOTHON Guide', 
      icon: Award,
      badge: 'HACK',
      badgeColor: 'bg-[#34D399]/25 text-[#00FF9D] border-[#34D399]/50',
      description: 'Architecture, judge FAQs & evaluation rubric'
    },
  ];

  return (
    <>
      {/* Mobile overlay backdrop when expanded */}
      {!isCollapsed && (
        <div 
          onClick={onToggleCollapse}
          className="fixed inset-0 top-[57px] bg-black/60 backdrop-blur-xs z-20 lg:hidden"
        />
      )}

      <aside 
        className={`fixed left-0 top-[57px] bottom-0 z-30 bg-[#071f16]/95 backdrop-blur-xl border-r border-[#10B981]/25 transition-all duration-300 flex flex-col justify-between ${
          isCollapsed ? 'w-16' : 'w-64 shadow-2xl'
        }`}
      >
        {/* Top Section / Telemetry status */}
        <div className="p-3 border-b border-[#10B981]/20">
        {!isCollapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF9D] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF9D]"></span>
              </span>
              <span className="text-[11px] font-mono-code text-[#A7F3D0] font-bold">TELEMETRY ACTIVE</span>
            </div>
            <button
              onClick={onToggleCollapse}
              className="text-[#A7F3D0] hover:text-white p-1 rounded hover:bg-[#0a291e]"
              title="Collapse navigation"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={onToggleCollapse}
              className="text-[#00FF9D] hover:text-white p-1 rounded hover:bg-[#0a291e]"
              title="Expand navigation"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {!isCollapsed && (
          <div className="mt-2.5 p-2 rounded-xl bg-[#04120c]/90 border border-[#10B981]/30 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-[#A7F3D0] font-mono-code font-bold">SITE COMPLIANCE</div>
              <div className="text-base font-extrabold font-heading text-[#00FF9D]">{kpis.complianceRate}%</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-[#A7F3D0] font-mono-code font-bold">CRITICAL</div>
              <div className="text-base font-extrabold font-heading text-[#EF4444]">{kpis.highAndCritical}</div>
            </div>
          </div>
        )}
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                onSelectTab(tab.id);
                if (typeof window !== 'undefined' && window.innerWidth < 1024 && !isCollapsed) {
                  onToggleCollapse();
                }
              }}
              title={isCollapsed ? `${tab.label} — ${tab.description}` : undefined}
              className={`w-full flex items-center text-left rounded-xl transition-all relative group ${
                isCollapsed ? 'justify-center p-3' : 'justify-between px-3 py-2.5'
              } ${
                isActive
                  ? 'bg-gradient-to-r from-[#10B981]/30 to-[#00FF9D]/20 border border-[#00FF9D]/60 text-white font-bold shadow-md shadow-[#10B981]/20'
                  : 'text-slate-200 hover:text-white hover:bg-[#0a291e]/70 border border-transparent'
              }`}
            >
              {/* Active neon green indicator strip */}
              {isActive && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-[#00FF9D] shadow-sm shadow-[#00FF9D]" />
              )}

              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-[#00FF9D]' : 'text-[#A7F3D0] group-hover:text-white'
                }`} />
                {!isCollapsed && (
                  <span className={`text-xs tracking-tight ${isActive ? 'text-white font-bold' : 'text-slate-100'}`}>
                    {tab.label}
                  </span>
                )}
              </div>

              {!isCollapsed && tab.badge && (
                <span className={`text-[9px] font-mono-code font-bold px-1.5 py-0.2 rounded border ${tab.badgeColor || 'bg-[#10B981]/25 text-[#00FF9D]'}`}>
                  {tab.badge}
                </span>
              )}

              {/* Tooltip on collapsed hover */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-[#071f16] border border-[#10B981]/50 text-xs text-white font-medium shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 transition-opacity">
                  <div className="font-bold text-[#00FF9D]">{tab.label}</div>
                  <div className="text-[10px] text-slate-300">{tab.description}</div>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Widget */}
      <div className="p-3 border-t border-[#10B981]/20">
        {!isCollapsed ? (
          <div className="flex items-center justify-center space-x-2">
            <SiteSentinelLogo size="xs" />
            <div className="text-left">
              <div className="text-[10px] font-mono-code text-[#00FF9D] font-bold tracking-wider">
                SAFETY GUARD V2.4
              </div>
              <div className="text-[9px] text-slate-300 font-medium">
                AI Autonomous Surveillance
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <SiteSentinelLogo size="xs" />
          </div>
        )}
      </div>
    </aside>
  </>
);
};
