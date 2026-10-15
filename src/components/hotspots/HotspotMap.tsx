import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  Filter, 
  Eye, 
  AlertTriangle, 
  CheckCircle2, 
  Maximize2, 
  ShieldAlert, 
  Building2,
  ChevronRight
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { Incident } from '../../types';

interface HotspotMapProps {
  onNavigateToTab: (tabId: string, incidentId?: string) => void;
}

export const HotspotMap: React.FC<HotspotMapProps> = ({ onNavigateToTab }) => {
  const { activeSite, incidents } = useSafety();

  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const siteIncidents = incidents.filter(i => {
    if (i.siteId !== activeSite.id) return false;
    if (filterSeverity !== 'all' && i.severity !== filterSeverity) return false;
    return true;
  });

  // Dynamically map all active site incidents to blueprint coordinates based on zone
  const dynamicPins = React.useMemo(() => {
    const zoneCoordinates: Record<string, { baseX: number; baseY: number }> = {
      'zone-excavation': { baseX: 28, baseY: 30 },
      'zone-scaffolding': { baseX: 74, baseY: 30 },
      'zone-staging': { baseX: 28, baseY: 74 },
      'zone-crane-arc': { baseX: 74, baseY: 74 },
    };

    const zoneCounters: Record<string, number> = {};

    return siteIncidents.map((inc) => {
      const zId = inc.zoneId || 'zone-scaffolding';
      const base = zoneCoordinates[zId] || { baseX: 50, baseY: 50 };
      const count = zoneCounters[zId] || 0;
      zoneCounters[zId] = count + 1;

      // Small offset jitter so multiple pins in same zone remain distinct
      const offsetX = (count % 3 - 1) * 7;
      const offsetY = (Math.floor(count / 3) % 3 - 1) * 7;

      return {
        incident: inc,
        x: Math.max(12, Math.min(88, base.baseX + offsetX)),
        y: Math.max(15, Math.min(85, base.baseY + offsetY)),
      };
    });
  }, [siteIncidents]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl glass-panel-glow border-l-4 border-l-[#00FF9D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">
              Interactive 2D Site Blueprint & Incident Hotspots
            </h1>
            <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#10B981]/25 text-[#00FF9D] border border-[#00FF9D]/40 font-bold">
              CAD BLUEPRINT OVERLAY
            </span>
          </div>
          <p className="text-xs text-[#E2E8F0] mt-1">
            Spatial distribution of safety infractions across active sectors of <span className="text-white font-bold">{activeSite.name}</span>.
          </p>
        </div>

        {/* Severity filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-[#00FF9D]" />
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#071f16] border border-[#10B981]/35 text-xs text-white focus:outline-none font-medium"
          >
            <option value="all">All Severities</option>
            <option value="Critical">Critical Only</option>
            <option value="High">High Only</option>
            <option value="Medium">Medium Only</option>
          </select>
        </div>
      </div>

      {/* Blueprint Canvas Container */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 glass-panel p-4 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs font-mono-code text-white pb-2 border-b border-[#10B981]/20">
            <span>GRID: SECTOR A1 TO D4 • SCALE: 1:250</span>
            <span className="text-[#00FF9D] font-bold">GPS REFERENCE: 40.7128° N, 74.0060° W</span>
          </div>

          {/* Blueprint Layout Area */}
          <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#04120c] border border-[#10B981]/35 shadow-2xl">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-blueprint-grid opacity-90" />

            {/* Architectural zones outlines with green borders and white text */}
            <div className="absolute top-[12%] left-[10%] w-[38%] h-[36%] border-2 border-[#EF4444]/60 bg-[#EF4444]/10 rounded-lg flex items-center justify-center pointer-events-none">
              <span className="text-[10px] font-mono-code text-white font-bold bg-[#04120c]/90 px-2 py-0.5 rounded border border-[#EF4444]/40">
                ZONE A: EXCAVATION PIT
              </span>
            </div>

            <div className="absolute top-[10%] right-[10%] w-[38%] h-[40%] border-2 border-[#10B981]/60 bg-[#10B981]/10 rounded-lg flex items-center justify-center pointer-events-none">
              <span className="text-[10px] font-mono-code text-white font-bold bg-[#04120c]/90 px-2 py-0.5 rounded border border-[#00FF9D]/40">
                ZONE B: NORTH SCAFFOLDING
              </span>
            </div>

            <div className="absolute bottom-[10%] left-[10%] w-[38%] h-[36%] border-2 border-[#00FF9D]/60 bg-[#00FF9D]/10 rounded-lg flex items-center justify-center pointer-events-none">
              <span className="text-[10px] font-mono-code text-white font-bold bg-[#04120c]/90 px-2 py-0.5 rounded border border-[#00FF9D]/40">
                ZONE C: PRECAST STAGING
              </span>
            </div>

            <div className="absolute bottom-[10%] right-[10%] w-[38%] h-[36%] border-2 border-[#FBBF24]/60 bg-[#FBBF24]/10 rounded-lg flex items-center justify-center pointer-events-none">
              <span className="text-[10px] font-mono-code text-white font-bold bg-[#04120c]/90 px-2 py-0.5 rounded border border-[#FBBF24]/40">
                ZONE D: TOWER CRANE #1 SLEW
              </span>
            </div>

            {/* Hotspot Interactive Pins */}
            {dynamicPins.map((pin) => {
              const inc = pin.incident;
              const isCritical = inc.severity === 'Critical';
              const isSelected = selectedIncident?.id === inc.id;

              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group"
                  style={{ top: `${pin.y}%`, left: `${pin.x}%` }}
                >
                  <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-transform group-hover:scale-125 shadow-lg ${
                    isCritical ? 'bg-[#EF4444] border-white shadow-[#EF4444]/60' : 'bg-[#00FF9D] border-[#04120c] shadow-[#00FF9D]/60'
                  } ${isSelected ? 'ring-4 ring-[#00FF9D]' : ''}`}>
                    <ShieldAlert className={`w-4 h-4 ${isCritical ? 'text-white' : 'text-[#04120c]'}`} />
                    {isCritical && (
                      <span className="absolute -inset-1 rounded-full border border-[#EF4444] animate-ping opacity-80" />
                    )}
                  </div>

                  {/* Tooltip on Hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-40 whitespace-nowrap px-2.5 py-1 rounded-lg bg-[#071f16] border border-[#00FF9D] text-[10px] font-mono-code text-white shadow-xl">
                    <span className="font-bold text-[#00FF9D]">{inc.code}:</span> {inc.incidentType}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-[#A7F3D0] font-mono-code flex items-center justify-between">
            <span>* Simulated site coordinate grid for demonstration purposes.</span>
            <span>Click any glowing hazard marker to view event telemetry.</span>
          </div>
        </div>

        {/* Right 4 Cols: Selected Hotspot Incident Card */}
        <div className="lg:col-span-4 glass-panel p-5 rounded-2xl space-y-4">
          <h2 className="font-heading font-bold text-sm text-white flex items-center gap-1.5 pb-2 border-b border-[#10B981]/20">
            <MapPin className="w-4 h-4 text-[#00FF9D]" />
            <span>Hotspot Telemetry Detail</span>
          </h2>

          {!selectedIncident ? (
            <div className="py-16 text-center text-xs text-white">
              <MapPin className="w-8 h-8 text-[#00FF9D] mx-auto mb-2 opacity-60" />
              Click on any map pin on the blueprint to inspect the associated violation and photographic proof.
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-mono-code text-xs font-bold text-[#00FF9D]">{selectedIncident.code}</span>
                <span className={`text-[9px] font-mono-code font-bold px-2 py-0.5 rounded uppercase ${
                  selectedIncident.severity === 'Critical' ? 'bg-[#EF4444]/25 text-[#FF6B6B] border border-[#EF4444]/50' :
                  selectedIncident.severity === 'High' ? 'bg-[#FBBF24]/25 text-[#FBBF24] border border-[#FBBF24]/50' :
                  'bg-[#00FF9D]/25 text-[#00FF9D]'
                }`}>
                  {selectedIncident.severity}
                </span>
              </div>

              <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-900 border border-[#10B981]/35">
                <img
                  src={selectedIncident.evidenceImageUrl}
                  alt={selectedIncident.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="font-bold text-xs text-white">{selectedIncident.title}</h3>
                <div className="text-[10px] text-[#A7F3D0] font-mono-code mt-0.5">{selectedIncident.zoneName}</div>
                <p className="text-xs text-white mt-2 leading-relaxed font-medium">{selectedIncident.description}</p>
              </div>

              <div className="pt-2 border-t border-[#10B981]/20 flex items-center justify-between text-xs">
                <span className="text-[#A7F3D0] font-mono-code">Status: <strong className="text-white">{selectedIncident.status}</strong></span>
                <button
                  onClick={() => onNavigateToTab('incidents', selectedIncident.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#00FF9D] text-[#04120c] font-black text-xs hover:brightness-110 flex items-center gap-1 shadow-md shadow-[#00FF9D]/20"
                >
                  <span>Open Full Record</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
