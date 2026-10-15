import React, { useState } from 'react';
import { 
  Radar, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Sliders, 
  RefreshCw, 
  Truck, 
  User, 
  Activity,
  Info
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';

export const ProximityMonitor: React.FC = () => {
  const { playAlertSound } = useSafety();

  const [thresholdMeters, setThresholdMeters] = useState<number>(5.0);

  const targets = [
    {
      id: 'target-01',
      type: 'Worker',
      name: 'Rigger (Apprentice)',
      distanceMeters: 2.8,
      status: 'Critical Danger',
      bearing: '042° NE',
      blindspot: true,
      machineryId: 'CAT 325 Excavator (Trench 4)',
    },
    {
      id: 'target-02',
      type: 'Worker',
      name: 'Surveyor Lead',
      distanceMeters: 7.4,
      status: 'Caution (Approaching)',
      bearing: '185° S',
      blindspot: false,
      machineryId: 'Komatsu D65 Bulldozer',
    },
    {
      id: 'target-03',
      type: 'Worker',
      name: 'Rebar Welder',
      distanceMeters: 14.2,
      status: 'Safe Buffer',
      bearing: '290° W',
      blindspot: false,
      machineryId: 'Tower Crane Jib Arc',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl glass-panel-glow border-l-4 border-l-[#00FF9D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">
              Worker–Machinery Spatial Proximity Radar
            </h1>
            <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#10B981]/25 text-[#00FF9D] border border-[#00FF9D]/40 font-bold">
              OPTICAL PROXIMITY HEURISTIC
            </span>
          </div>
          <p className="text-xs text-[#E2E8F0] mt-1">
            Real-time blindspot tracking and image-space proximity estimation between mobile heavy plant and workers.
          </p>
        </div>

        {/* Warning threshold slider */}
        <div className="flex items-center space-x-3 bg-[#071f16] border border-[#10B981]/35 px-3 py-1.5 rounded-xl">
          <Sliders className="w-4 h-4 text-[#00FF9D]" />
          <span className="text-xs text-white font-mono-code font-bold">
            Exclusion Radius: <strong className="text-[#00FF9D]">{thresholdMeters.toFixed(1)}m</strong>
          </span>
          <input
            type="range"
            min="3.0"
            max="10.0"
            step="0.5"
            value={thresholdMeters}
            onChange={(e) => setThresholdMeters(parseFloat(e.target.value))}
            className="w-24 accent-[#00FF9D] cursor-pointer"
          />
        </div>
      </div>

      {/* Main Grid: Radar Screen + Proximity Targets */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Circular Radar Screen HUD */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between text-xs font-mono-code text-white mb-4">
            <span className="text-[#00FF9D] font-bold">360° DYNAMIC SLEW RADIUS</span>
            <span className="text-[#34D399] font-bold">RADAR SYNC: 60Hz</span>
          </div>

          {/* Radar Circles Container in neon emerald */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border-2 border-[#10B981]/40 bg-[#04120c] flex items-center justify-center shadow-2xl">
            {/* Concentric rings */}
            <div className="absolute inset-8 rounded-full border border-[#10B981]/25" />
            <div className="absolute inset-16 rounded-full border border-[#10B981]/30" />
            <div className="absolute inset-24 rounded-full border border-dashed border-[#00FF9D]/40" />

            {/* Crosshairs */}
            <div className="absolute inset-x-0 top-1/2 h-px bg-[#10B981]/30" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-[#10B981]/30" />

            {/* Sweep Beam in glowing green */}
            <div className="absolute inset-0 rounded-full animate-radar pointer-events-none bg-gradient-to-tr from-transparent via-[#00FF9D]/15 to-transparent" />

            {/* Machinery Center Icon */}
            <div className="relative z-10 w-10 h-10 rounded-full bg-[#071f16] border-2 border-[#00FF9D] flex items-center justify-center shadow-lg shadow-[#00FF9D]/30">
              <Truck className="w-5 h-5 text-[#00FF9D]" />
            </div>

            {/* Blip 1: Critical (Worker 1 @ 2.8m) */}
            <div
              className="absolute top-20 right-24 z-20 flex flex-col items-center cursor-pointer group"
              onClick={() => playAlertSound('Critical')}
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF4444] opacity-80"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#EF4444]"></span>
              </span>
              <span className="text-[9px] font-mono-code font-bold text-[#FF6B6B] bg-[#04120c]/90 px-1 rounded mt-0.5 shadow">
                2.8m (BREACH)
              </span>
            </div>

            {/* Blip 2: Caution (Worker 2 @ 7.4m) */}
            <div className="absolute bottom-16 left-32 z-20 flex flex-col items-center">
              <span className="relative flex h-2.5 w-2.5">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FBBF24]"></span>
              </span>
              <span className="text-[8px] font-mono-code text-[#FBBF24] font-bold bg-[#04120c]/90 px-1 rounded mt-0.5">
                7.4m
              </span>
            </div>

            {/* Blip 3: Safe (Worker 3 @ 14.2m) */}
            <div className="absolute top-12 left-14 z-20 flex flex-col items-center">
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00FF9D]"></span>
              <span className="text-[8px] font-mono-code text-[#00FF9D] font-bold bg-[#04120c]/90 px-1 rounded mt-0.5">
                14.2m
              </span>
            </div>
          </div>

          <div className="mt-4 text-[11px] text-[#A7F3D0] text-center font-mono-code">
            Estimated spatial distance is computed via calibrated ground plane projection and worker bbox aspect ratios.
          </div>
        </div>

        {/* Right 6 Cols: Proximity Incident Feed */}
        <div className="lg:col-span-6 glass-panel p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#10B981]/20">
            <h2 className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
              <span>Active Proximity Hazard Alerts</span>
            </h2>
            <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#EF4444]/25 text-[#FF6B6B] font-bold">
              1 Critical Violation
            </span>
          </div>

          <div className="space-y-3">
            {targets.map((target) => (
              <div
                key={target.id}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  target.distanceMeters < thresholdMeters
                    ? 'bg-[#EF4444]/20 border-[#EF4444]/60 shadow-md shadow-[#EF4444]/15'
                    : 'bg-[#071f16]/90 border-[#10B981]/25'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className={`w-4 h-4 ${target.distanceMeters < thresholdMeters ? 'text-[#FF6B6B]' : 'text-slate-300'}`} />
                    <span className="font-bold text-xs text-white">{target.name}</span>
                  </div>
                  <span className={`text-[10px] font-mono-code font-bold px-2 py-0.5 rounded uppercase ${
                    target.distanceMeters < thresholdMeters ? 'bg-[#EF4444] text-white' :
                    target.distanceMeters < 8.0 ? 'bg-[#FBBF24]/25 text-[#FBBF24]' : 'bg-[#00FF9D]/25 text-[#00FF9D]'
                  }`}>
                    {target.distanceMeters}m • {target.status}
                  </span>
                </div>

                <div className="mt-2 text-xs text-white">
                  Relative Machinery: <strong className="text-[#00FF9D]">{target.machineryId}</strong>
                </div>

                <div className="mt-1 flex items-center justify-between text-[10px] font-mono-code text-[#A7F3D0]">
                  <span>Bearing: {target.bearing}</span>
                  {target.blindspot && (
                    <span className="text-[#FF6B6B] font-bold">⚠️ IN OPERATOR BLINDSPOT</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-[#0a291e]/90 border border-[#10B981]/30 text-xs space-y-1">
            <div className="font-bold text-[#00FF9D] flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              <span>Standard Operating Protocol (SOP 402)</span>
            </div>
            <p className="text-[11px] text-white leading-relaxed font-medium">
              When a worker breaches the 5.0-meter exclusion zone, an acoustic alarm sounds inside the equipment cabin, prompting the operator to halt swing hydraulic pressure until ground clearance is restored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
