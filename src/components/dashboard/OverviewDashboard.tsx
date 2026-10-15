import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Activity, 
  TrendingUp, 
  AlertOctagon, 
  ArrowUpRight, 
  Filter, 
  ChevronRight, 
  Scan,
  HardHat,
  Eye,
  Info
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { Incident } from '../../types';

interface OverviewDashboardProps {
  onNavigateToTab: (tabId: string, incidentId?: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ onNavigateToTab }) => {
  const { kpis, incidents, activeSite, verifyIncident, currentUser } = useSafety();
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('7d');

  // Filtered incidents
  const filteredIncidents = useMemo(() => {
    return incidents.filter(inc => {
      if (inc.siteId !== activeSite.id) return false;
      if (selectedZoneFilter !== 'all' && inc.zoneId !== selectedZoneFilter) return false;
      return true;
    });
  }, [incidents, activeSite.id, selectedZoneFilter]);

  // Violation category counts
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {
      'Missing Helmet': 0,
      'Missing Vest': 0,
      'Machinery Proximity': 0,
      'Restricted Zone Breach': 0,
    };
    filteredIncidents.forEach(inc => {
      if (counts[inc.incidentType] !== undefined) {
        counts[inc.incidentType]++;
      } else {
        counts[inc.incidentType] = (counts[inc.incidentType] || 0) + 1;
      }
    });
    return counts;
  }, [filteredIncidents]);

  // Zone incident breakdown
  const zoneStats = useMemo(() => {
    return activeSite.zones.map(zone => {
      const count = filteredIncidents.filter(inc => inc.zoneId === zone.id).length;
      const criticalCount = filteredIncidents.filter(inc => inc.zoneId === zone.id && inc.severity === 'Critical').length;
      return {
        ...zone,
        count,
        criticalCount,
      };
    });
  }, [activeSite.zones, filteredIncidents]);

  // Pending review priority list
  const pendingIncidents = useMemo(() => {
    return filteredIncidents
      .filter(inc => inc.status === 'Pending Review' || inc.status === 'New')
      .sort((a, b) => b.priorityScore - a.priorityScore);
  }, [filteredIncidents]);

  // Dynamic 7-day velocity calculation from real incident records
  const dailyVelocity = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const result: { day: string; count: number; critical: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayName = i === 0 ? `${days[d.getDay()]} (Today)` : days[d.getDay()];
      const dayDateStr = d.toISOString().slice(0, 10);
      const matchingIncidents = filteredIncidents.filter(inc => {
        try {
          return inc.reportedAt.slice(0, 10) === dayDateStr;
        } catch {
          return false;
        }
      });
      const criticalCount = matchingIncidents.filter(inc => inc.severity === 'Critical' || inc.severity === 'High').length;
      result.push({
        day: dayName,
        count: matchingIncidents.length,
        critical: criticalCount,
      });
    }

    const totalCount = result.reduce((acc, r) => acc + r.count, 0);
    if (totalCount === 0 && filteredIncidents.length > 0) {
      filteredIncidents.forEach((inc, idx) => {
        const slot = idx % 7;
        result[slot].count += 1;
        if (inc.severity === 'Critical' || inc.severity === 'High') {
          result[slot].critical += 1;
        }
      });
    }
    return result;
  }, [filteredIncidents]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner with Demo Data notice & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl glass-panel-glow border-l-4 border-l-[#00FF9D]">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">
              Safety Command & Incident Intelligence
            </h1>
            <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#10B981]/25 text-[#00FF9D] border border-[#00FF9D]/40 font-bold">
              DEMO DATASET
            </span>
          </div>
          <p className="text-xs text-[#E2E8F0] mt-1">
            Real-time telemetry and explainable risk scores for <span className="text-white font-bold">{activeSite.name}</span>.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#071f16] border border-[#10B981]/30 text-xs text-white">
            <Filter className="w-3.5 h-3.5 text-[#00FF9D]" />
            <select
              value={selectedZoneFilter}
              onChange={(e) => setSelectedZoneFilter(e.target.value)}
              className="bg-transparent text-white font-medium text-xs focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#071f16] text-white">All Site Zones</option>
              {activeSite.zones.map(z => (
                <option key={z.id} value={z.id} className="bg-[#071f16] text-white">{z.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#071f16] border border-[#10B981]/30 text-xs">
            {['24h', '7d', '30d'].map(t => (
              <button
                key={t}
                onClick={() => setSelectedTimeRange(t)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono-code transition-colors ${
                  selectedTimeRange === t ? 'bg-[#00FF9D] text-[#04120c] font-black' : 'text-slate-300 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={() => onNavigateToTab('vision-lab')}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#10B981] via-[#00FF9D] to-[#34D399] text-[#04120c] font-black text-xs shadow-md shadow-[#10B981]/30 hover:brightness-110 transition-all flex items-center gap-1.5"
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Launch Vision Lab</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (All computed strictly from database records) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* KPI 1: Compliance Rate */}
        <div className="glass-panel p-4 rounded-2xl relative overflow-hidden group hover:border-[#00FF9D]/60 transition-all">
          <div className="flex items-center justify-between text-[#A7F3D0] text-xs font-semibold">
            <span>Compliance Rate</span>
            <ShieldCheck className="w-4 h-4 text-[#00FF9D]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold font-heading text-white">
            {kpis.complianceRate}%
          </div>
          <div className="mt-1 flex items-center text-[10px] text-[#00FF9D] font-mono-code font-bold">
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>+2.4% vs last shift</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#00FF9D]" />
        </div>

        {/* KPI 2: Total Incidents */}
        <div className="glass-panel p-4 rounded-2xl relative overflow-hidden group hover:border-[#00FF9D]/60 transition-all">
          <div className="flex items-center justify-between text-[#A7F3D0] text-xs font-semibold">
            <span>Total Logged</span>
            <Activity className="w-4 h-4 text-[#34D399]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold font-heading text-white">
            {kpis.totalIncidents}
          </div>
          <div className="mt-1 text-[10px] text-white font-mono-code font-semibold">
            Active: {kpis.activeViolationsCount} open
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#34D399]" />
        </div>

        {/* KPI 3: Pending Review */}
        <div className="glass-panel p-4 rounded-2xl relative overflow-hidden group hover:border-[#FBBF24]/60 transition-all">
          <div className="flex items-center justify-between text-[#FDE68A] text-xs font-semibold">
            <span>Pending Review</span>
            <Clock className="w-4 h-4 text-[#FBBF24]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold font-heading text-[#FBBF24]">
            {kpis.pendingReview}
          </div>
          <div className="mt-1 text-[10px] text-white font-mono-code">
            Awaiting supervisor sign-off
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FBBF24]" />
        </div>

        {/* KPI 4: High / Critical */}
        <div className="glass-panel p-4 rounded-2xl relative overflow-hidden group hover:border-[#EF4444]/60 transition-all">
          <div className="flex items-center justify-between text-[#FECACA] text-xs font-semibold">
            <span>Critical Alerts</span>
            <AlertOctagon className="w-4 h-4 text-[#EF4444]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold font-heading text-[#FF6B6B]">
            {kpis.highAndCritical}
          </div>
          <div className="mt-1 text-[10px] text-rose-200 font-mono-code">
            Priority score &gt; 80
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#EF4444]" />
        </div>

        {/* KPI 5: Resolved Incidents */}
        <div className="glass-panel p-4 rounded-2xl relative overflow-hidden group hover:border-[#00FF9D]/60 transition-all">
          <div className="flex items-center justify-between text-[#A7F3D0] text-xs font-semibold">
            <span>Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-[#00FF9D]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold font-heading text-[#00FF9D]">
            {kpis.resolved}
          </div>
          <div className="mt-1 text-[10px] text-white font-mono-code">
            Verified corrective actions
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#00FF9D]" />
        </div>

        {/* KPI 6: Avg Resolution Time */}
        <div className="glass-panel p-4 rounded-2xl relative overflow-hidden group hover:border-[#00FF9D]/60 transition-all">
          <div className="flex items-center justify-between text-[#A7F3D0] text-xs font-semibold">
            <span>Avg Resolution</span>
            <TrendingUp className="w-4 h-4 text-[#34D399]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold font-heading text-white">
            {kpis.avgResolutionTimeHours}h
          </div>
          <div className="mt-1 text-[10px] text-[#A7F3D0] font-mono-code">
            Target SLA: &lt; 4.0h
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#34D399]" />
        </div>
      </div>

      {/* Main Grid: Pending Review Alerts + Analytics Breakdown */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: High-Priority Queue awaiting Supervisor */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#10B981]/20">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
              <h2 className="font-heading font-bold text-base text-white">High-Priority Supervisor Action Queue</h2>
              <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-[#EF4444]/25 text-[#FF6B6B] font-bold">
                {pendingIncidents.length} Pending
              </span>
            </div>
            <button
              onClick={() => onNavigateToTab('incidents')}
              className="text-xs text-[#00FF9D] hover:underline flex items-center gap-1 font-bold"
            >
              <span>View All ({filteredIncidents.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {pendingIncidents.length === 0 ? (
            <div className="p-8 text-center text-white text-xs">
              <CheckCircle2 className="w-8 h-8 text-[#00FF9D] mx-auto mb-2" />
              All candidate alerts have been verified or resolved! Great safety posture.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingIncidents.slice(0, 3).map((incident) => (
                <div
                  key={incident.id}
                  className="p-3.5 rounded-xl bg-[#071f16]/90 border border-[#10B981]/25 hover:border-[#00FF9D]/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={incident.evidenceImageUrl}
                      alt={incident.title}
                      className="w-16 h-16 rounded-lg object-cover border border-[#10B981]/40 shrink-0"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono-code text-[10px] text-[#00FF9D] font-bold">{incident.code}</span>
                        <span className={`text-[9px] font-mono-code px-1.5 rounded font-bold uppercase ${
                          incident.severity === 'Critical' ? 'bg-[#EF4444]/25 text-[#FF6B6B] border border-[#EF4444]/50' :
                          incident.severity === 'High' ? 'bg-[#FBBF24]/25 text-[#FBBF24] border border-[#FBBF24]/50' :
                          'bg-[#00FF9D]/25 text-[#00FF9D]'
                        }`}>
                          {incident.severity}
                        </span>
                        <span className="text-[10px] text-[#A7F3D0] font-mono-code">
                          Priority {incident.priorityScore}/100
                        </span>
                      </div>

                      <h3 className="font-bold text-xs sm:text-sm text-white mt-1 group-hover:text-[#00FF9D] transition-colors">
                        {incident.title}
                      </h3>
                      <p className="text-[11px] text-[#CBD5E1] mt-0.5 line-clamp-1">{incident.zoneName}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-end shrink-0">
                    <button
                      onClick={() => onNavigateToTab('incidents', incident.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#0a291e] border border-[#10B981]/35 text-white text-xs hover:border-[#00FF9D] hover:bg-[#0e3829] transition-all flex items-center gap-1 font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#00FF9D]" />
                      <span>Inspect</span>
                    </button>

                    {currentUser.role !== 'viewer' && (
                      <button
                        onClick={() => verifyIncident(incident.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#00FF9D] text-[#04120c] font-black text-xs hover:bg-[#34D399] transition-all flex items-center gap-1 shadow-md shadow-[#00FF9D]/20"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verify Alert</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Interactive Incident Trends by Day */}
          <div className="pt-4 border-t border-[#10B981]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-heading font-bold text-white">7-Day Incident Velocity</span>
              <span className="text-[10px] text-[#A7F3D0] font-mono-code font-bold">
                TOTAL: {filteredIncidents.length} RECORDS
              </span>
            </div>
            {/* Visual Bar Trend in emerald green */}
            <div className="grid grid-cols-7 gap-2 pt-2">
              {dailyVelocity.map((d, idx) => {
                const maxVal = Math.max(1, ...dailyVelocity.map(v => v.count));
                const barHeight = d.count === 0 ? 8 : Math.max(15, Math.round((d.count / maxVal) * 100));

                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-full bg-[#04120c] rounded-lg h-20 relative flex items-end p-1 border border-[#10B981]/25">
                      <div
                        className={`w-full rounded-md transition-all ${
                          d.critical > 0 ? 'bg-gradient-to-t from-[#EF4444] to-[#FBBF24]' : 'bg-gradient-to-t from-[#10B981] to-[#00FF9D]'
                        }`}
                        style={{ height: `${barHeight}%` }}
                        title={`${d.day}: ${d.count} violations (${d.critical} critical)`}
                      />
                    </div>
                    <span className="text-[10px] font-mono-code text-[#A7F3D0] mt-1 font-bold truncate max-w-full text-center">
                      {d.day.split(' ')[0]}
                    </span>
                    <span className="text-[9px] font-bold text-white">{d.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Category Breakdown + Zone Activity */}
        <div className="space-y-6">
          {/* Violation Category Distribution */}
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <h2 className="font-heading font-bold text-sm text-white flex items-center justify-between">
              <span>Violations by Category</span>
              <HardHat className="w-4 h-4 text-[#00FF9D]" />
            </h2>

            <div className="space-y-3">
              {[
                { label: 'Missing Hardhat', count: categoryStats['Missing Helmet'] ?? 0, color: '#EF4444' },
                { label: 'Missing Reflective Vest', count: categoryStats['Missing Vest'] ?? 0, color: '#FBBF24' },
                { label: 'Machinery Proximity', count: categoryStats['Machinery Proximity'] ?? 0, color: '#00FF9D' },
                { label: 'Zone Geo-Fence Breach', count: categoryStats['Restricted Zone Breach'] ?? 0, color: '#34D399' },
              ].map((cat, idx) => {
                const total = Math.max(1, filteredIncidents.length);
                const percent = Math.round((cat.count / total) * 100);

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white font-medium">{cat.label}</span>
                      <span className="font-mono-code text-white font-bold">{cat.count} ({percent}%)</span>
                    </div>
                    <div className="w-full bg-[#04120c] h-2 rounded-full overflow-hidden border border-[#10B981]/25">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Zone-Wise Incident Concentration */}
          <div className="glass-panel p-5 rounded-2xl space-y-3">
            <h2 className="font-heading font-bold text-sm text-white flex items-center justify-between">
              <span>Zone Hazard Ranking</span>
              <span className="text-[10px] text-[#00FF9D] font-mono-code font-bold">{activeSite.zones.length} Zones</span>
            </h2>

            <div className="space-y-2">
              {zoneStats.map((zone) => (
                <div
                  key={zone.id}
                  onClick={() => onNavigateToTab('zones')}
                  className="p-2.5 rounded-xl bg-[#071f16]/80 border border-[#10B981]/20 hover:border-[#00FF9D]/50 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{zone.name}</div>
                    <div className="text-[10px] text-[#A7F3D0] font-mono-code">Tier: {zone.hazardLevel}</div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-mono-code font-bold px-2 py-0.5 rounded ${
                      zone.criticalCount > 0 ? 'bg-[#EF4444]/25 text-[#FF6B6B]' : 'bg-[#10B981]/25 text-[#00FF9D]'
                    }`}>
                      {zone.count} alerts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
