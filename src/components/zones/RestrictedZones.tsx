import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Edit3, 
  AlertTriangle, 
  Lock, 
  Unlock, 
  Camera, 
  MapPin, 
  ShieldAlert, 
  Check, 
  X,
  Sliders
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { SiteZone, HazardLevel } from '../../types';

export const RestrictedZones: React.FC = () => {
  const { activeSite, addZone, updateZone, deleteZone, incidents, currentUser } = useSafety();

  const [selectedZoneId, setSelectedZoneId] = useState<string>(activeSite.zones[0]?.id || '');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form states for new zone
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneCode, setNewZoneCode] = useState('');
  const [newZoneHazard, setNewZoneHazard] = useState<HazardLevel>('High');
  const [newZoneRestricted, setNewZoneRestricted] = useState(true);
  const [newZoneDescription, setNewZoneDescription] = useState('');

  const selectedZone = activeSite.zones.find(z => z.id === selectedZoneId) || activeSite.zones[0];

  const handleAddZoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName.trim()) return;

    addZone(activeSite.id, {
      name: newZoneName.trim(),
      code: newZoneCode.trim() || `ZN-${activeSite.zones.length + 1}`,
      hazardLevel: newZoneHazard,
      isRestricted: newZoneRestricted,
      cameraIds: ['cam-01'],
      description: newZoneDescription.trim() || 'Configured monitored safety sector.',
      polygon: [
        { x: 20, y: 20 },
        { x: 80, y: 20 },
        { x: 80, y: 80 },
        { x: 20, y: 80 },
      ],
    });

    setShowAddModal(false);
    setNewZoneName('');
    setNewZoneCode('');
  };

  const zoneIncidents = incidents.filter(inc => inc.zoneId === selectedZone?.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl glass-panel-glow border-l-4 border-l-[#00FF9D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">
              Restricted Zones & Optical Geo-Fencing
            </h1>
            <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#10B981]/25 text-[#00FF9D] border border-[#00FF9D]/40 font-bold">
              POLYGON BOUNDARIES
            </span>
          </div>
          <p className="text-xs text-[#E2E8F0] mt-1">
            Configure virtual 2D spatial boundaries and link exclusion rules to optical video cameras.
          </p>
        </div>

        {currentUser.role === 'admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#10B981] via-[#00FF9D] to-[#34D399] text-[#04120c] font-black text-xs shadow-lg shadow-[#10B981]/30 hover:brightness-110 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Zone</span>
          </button>
        )}
      </div>

      {/* Main Grid: Zone Selector & Interactive Visual Boundary Canvas */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left 4 Cols: Zone list */}
        <div className="lg:col-span-4 glass-panel p-4 rounded-2xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#10B981]/20 text-xs font-mono-code text-[#A7F3D0] font-bold">
            <span>{activeSite.zones.length} CONFIGURED ZONES</span>
            <span>SITE: {activeSite.code}</span>
          </div>

          <div className="space-y-2.5">
            {activeSite.zones.map((zone) => {
              const isSelected = zone.id === selectedZone?.id;
              const incidentCount = incidents.filter(i => i.zoneId === zone.id).length;

              return (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZoneId(zone.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#10B981]/25 border-[#00FF9D] shadow-md shadow-[#10B981]/25'
                      : 'bg-[#071f16]/90 border-[#10B981]/20 hover:border-[#00FF9D]/60 hover:bg-[#0a291e]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono-code text-[11px] font-bold text-[#00FF9D]">{zone.code}</span>
                    <span className={`text-[8px] font-mono-code font-bold px-1.5 py-0.2 rounded uppercase ${
                      zone.hazardLevel === 'Critical' ? 'bg-[#EF4444]/25 text-[#FF6B6B] border border-[#EF4444]/50' :
                      zone.hazardLevel === 'High' ? 'bg-[#FBBF24]/25 text-[#FBBF24] border border-[#FBBF24]/50' :
                      'bg-[#00FF9D]/25 text-[#00FF9D]'
                    }`}>
                      {zone.hazardLevel}
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-white mt-1">{zone.name}</h3>
                  <div className="text-[10px] text-slate-300 mt-1 flex items-center justify-between">
                    <span className="flex items-center gap-1 font-semibold">
                      {zone.isRestricted ? (
                        <span className="text-[#FF6B6B] flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" /> Restricted
                        </span>
                      ) : (
                        <span className="text-[#00FF9D] flex items-center gap-0.5">
                          <Unlock className="w-2.5 h-2.5" /> Controlled
                        </span>
                      )}
                    </span>
                    <span className="font-mono-code text-[#00FF9D] font-bold">{incidentCount} Incidents Logged</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 8 Cols: Visual Polygon Boundary Display & Settings */}
        {selectedZone && (
          <div className="lg:col-span-8 glass-panel p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#10B981]/20">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono-code text-xs text-[#00FF9D] font-bold">{selectedZone.code}</span>
                  <h2 className="font-heading font-bold text-base text-white">{selectedZone.name}</h2>
                </div>
                <p className="text-xs text-[#A7F3D0] mt-0.5 font-medium">{selectedZone.description}</p>
              </div>

              {currentUser.role === 'admin' && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      updateZone(selectedZone.id, {
                        isRestricted: !selectedZone.isRestricted,
                      });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#071f16] border border-[#10B981]/40 text-xs text-white hover:border-[#00FF9D] font-semibold"
                  >
                    Toggle: {selectedZone.isRestricted ? 'Restricted' : 'Open'}
                  </button>
                  <button
                    onClick={() => deleteZone(selectedZone.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#EF4444] hover:bg-[#EF4444]/15"
                    title="Delete zone"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Spatial Boundary Canvas Simulation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-white font-mono-code">
                <span>VIRTUAL GEO-FENCE ENVELOPE (CANVAS CALIBRATION)</span>
                <span className="text-[#00FF9D] font-bold">ACTIVE TRACKING: ONLINE</span>
              </div>

              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-950 border border-[#10B981]/35">
                <img
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80"
                  alt="Zone boundary view"
                  className="w-full h-full object-cover opacity-60"
                />

                {/* SVG Geo-Fence Polygon in green with responsive viewBox */}
                <svg viewBox="0 0 800 450" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none">
                  <polygon
                    points={selectedZone.polygon.map(p => `${p.x * 8},${p.y * 4.5}`).join(' ')}
                    fill={selectedZone.hazardLevel === 'Critical' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(0, 255, 157, 0.25)'}
                    stroke={selectedZone.hazardLevel === 'Critical' ? '#EF4444' : '#00FF9D'}
                    strokeWidth="3"
                    strokeDasharray="6 4"
                  />
                  {selectedZone.polygon.map((p, idx) => (
                    <circle
                      key={idx}
                      cx={p.x * 8}
                      cy={p.y * 4.5}
                      r="6"
                      fill="#00FF9D"
                      stroke="#04120c"
                      strokeWidth="2"
                    />
                  ))}
                </svg>

                <div className="absolute bottom-3 left-3 bg-[#04120c]/90 border border-[#10B981]/35 px-2.5 py-1.5 rounded-lg text-[10px] font-mono-code text-white font-semibold">
                  <span>ASSOCIATED CAMERAS: {selectedZone.cameraIds.join(', ')}</span>
                </div>
              </div>

              <div className="text-[11px] text-[#A7F3D0] italic">
                * Note: Geo-fence accuracy relies on calibrated camera height and lens distortion correction. Do not assume millimeter physical distance without calibrated depth sensors.
              </div>
            </div>

            {/* Zone Violations History */}
            <div className="space-y-2 pt-2 border-t border-[#10B981]/20">
              <h3 className="font-heading font-bold text-xs text-white">
                Recent Incident History in this Zone ({zoneIncidents.length})
              </h3>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {zoneIncidents.map(inc => (
                  <div key={inc.id} className="p-2 rounded-lg bg-[#071f16] border border-[#10B981]/20 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-mono-code font-bold text-[#00FF9D] mr-2">{inc.code}</span>
                      <span className="text-white font-medium">{inc.title}</span>
                    </div>
                    <span className="text-[10px] font-mono-code text-[#A7F3D0]">{inc.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Zone Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <form onSubmit={handleAddZoneSubmit} className="max-w-md w-full rounded-2xl glass-panel-glow p-5 border border-[#00FF9D]/60 space-y-4">
            <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#00FF9D]" />
              <span>Define New Site Safety Zone</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#A7F3D0] block mb-1 font-semibold">Zone Name:</label>
                <input
                  type="text"
                  placeholder="e.g., Zone E — Concrete Batching Plant"
                  value={newZoneName}
                  onChange={(e) => setNewZoneName(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#04120c] border border-[#10B981]/35 text-white font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A7F3D0] block mb-1 font-semibold">Zone Code:</label>
                  <input
                    type="text"
                    placeholder="e.g., BAT-E1"
                    value={newZoneCode}
                    onChange={(e) => setNewZoneCode(e.target.value)}
                    className="w-full p-2 rounded-lg bg-[#04120c] border border-[#10B981]/35 text-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-[#A7F3D0] block mb-1 font-semibold">Hazard Tier:</label>
                  <select
                    value={newZoneHazard}
                    onChange={(e) => setNewZoneHazard(e.target.value as HazardLevel)}
                    className="w-full p-2 rounded-lg bg-[#04120c] border border-[#10B981]/35 text-white font-medium"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#A7F3D0] block mb-1 font-semibold">Description:</label>
                <textarea
                  rows={2}
                  placeholder="Operational context and mandatory PPE requirements"
                  value={newZoneDescription}
                  onChange={(e) => setNewZoneDescription(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#04120c] border border-[#10B981]/35 text-white font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#00FF9D] text-[#04120c] font-black text-xs hover:brightness-110"
              >
                Create Zone
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
