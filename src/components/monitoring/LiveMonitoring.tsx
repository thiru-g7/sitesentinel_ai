import React, { useState, useEffect } from 'react';
import { 
  Video, 
  VideoOff, 
  Play, 
  Pause, 
  RefreshCw, 
  Maximize2, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Eye, 
  Radio, 
  Sliders, 
  Camera,
  Activity,
  ShieldAlert
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { CameraFeed } from '../../types';

interface LiveMonitoringProps {
  onNavigateToTab: (tabId: string, incidentId?: string) => void;
}

export const LiveMonitoring: React.FC<LiveMonitoringProps> = ({ onNavigateToTab }) => {
  const { cameras, updateCameraStatus, playAlertSound } = useSafety();

  const [selectedCameraId, setSelectedCameraId] = useState<string>(cameras[0]?.id || 'cam-01');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);
  const [scannerY, setScannerY] = useState<number>(20);

  const activeCamera = cameras.find(c => c.id === selectedCameraId) || cameras[0];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setScannerY(prev => (prev >= 85 ? 15 : prev + 1.2));
    }, 60);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-4 rounded-2xl glass-panel-glow border-l-4 border-l-[#00FF9D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">
              Live Optical Surveillance Matrix
            </h1>
            <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#10B981]/25 text-[#00FF9D] border border-[#00FF9D]/40 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-ping" />
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs text-[#E2E8F0] mt-1">
            Continuous optical stream monitoring with real-time bounding box edge overlays.
          </p>
        </div>

        {/* Play / Pause stream toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              isPlaying
                ? 'bg-[#071f16] border border-[#10B981]/40 text-[#00FF9D] hover:bg-[#0a291e]'
                : 'bg-gradient-to-r from-[#10B981] via-[#00FF9D] to-[#34D399] text-[#04120c] font-black shadow-lg shadow-[#10B981]/30'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause Streams' : 'Resume Streams'}</span>
          </button>

          <button
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            className={`px-3 py-2 rounded-xl text-xs font-mono-code font-bold border transition-all ${
              showBoundingBoxes
                ? 'bg-[#00FF9D]/25 border-[#00FF9D] text-[#00FF9D]'
                : 'bg-[#04120c] border-slate-700 text-slate-300'
            }`}
          >
            HUD Overlay: {showBoundingBoxes ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Main Stream Matrix: Featured Camera + Camera Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Active Camera Feed HUD */}
        <div className="lg:col-span-2 glass-panel p-4 rounded-2xl space-y-3">
          {/* Stream HUD Controls */}
          <div className="flex items-center justify-between text-xs font-mono-code text-white pb-2 border-b border-[#10B981]/20">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00FF9D] animate-pulse" />
              <span className="font-bold text-white">{activeCamera.name}</span>
              <span className="text-slate-500">|</span>
              <span className="text-[#A7F3D0]">{activeCamera.locationLabel}</span>
            </div>
            <div className="flex items-center space-x-3 text-[11px]">
              <button
                onClick={() => {
                  const nextStatus = activeCamera.status === 'online' ? 'degraded' : activeCamera.status === 'degraded' ? 'offline' : 'online';
                  updateCameraStatus(activeCamera.id, nextStatus);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                  activeCamera.status === 'online' ? 'bg-[#00FF9D]/20 text-[#00FF9D] border-[#00FF9D]/40' :
                  activeCamera.status === 'degraded' ? 'bg-[#FBBF24]/20 text-[#FBBF24] border-[#FBBF24]/40' :
                  'bg-[#EF4444]/20 text-[#FF6B6B] border-[#EF4444]/40'
                }`}
                title="Click to cycle camera health status (online, degraded, offline)"
              >
                Status: {activeCamera.status.toUpperCase()}
              </button>
              <span className="text-[#00FF9D] font-bold">{activeCamera.resolution}</span>
              <span className="text-white font-semibold">{activeCamera.fps} FPS</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                activeCamera.threatLevel === 'Critical' ? 'bg-[#EF4444]/25 text-[#FF6B6B]' :
                activeCamera.threatLevel === 'High' ? 'bg-[#FBBF24]/25 text-[#FBBF24]' : 'bg-[#00FF9D]/25 text-[#00FF9D]'
              }`}>
                {activeCamera.threatLevel} Alert
              </span>
            </div>
          </div>

          {/* Video Stream Canvas */}
          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-950 border border-[#10B981]/35 shadow-2xl">
            <img
              src={activeCamera.previewImage}
              alt={activeCamera.name}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                activeCamera.status === 'offline' ? 'opacity-10 grayscale' : isPlaying ? 'opacity-90' : 'opacity-40 grayscale'
              }`}
            />

            {/* Offline state watermark */}
            {activeCamera.status === 'offline' && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#04120c]/90 backdrop-blur-xs">
                <div className="text-center p-4">
                  <VideoOff className="w-10 h-10 text-[#EF4444] mx-auto mb-2" />
                  <div className="font-heading font-bold text-white text-base">Camera Feed Offline</div>
                  <div className="text-xs text-[#A7F3D0] mt-1">Optical signal lost on {activeCamera.id.toUpperCase()}. Click Status above to reconnect.</div>
                </div>
              </div>
            )}

            {/* Neon Green Laser scanning line */}
            {isPlaying && activeCamera.status !== 'offline' && (
              <div
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00FF9D] to-transparent shadow-[0_0_15px_#00FF9D] pointer-events-none transition-all duration-75"
                style={{ top: `${scannerY}%` }}
              />
            )}

            {/* HUD Bounding Boxes on Active Camera */}
            {showBoundingBoxes && isPlaying && activeCamera.status !== 'offline' && (
              <>
                <div
                  className="absolute border-2 border-[#EF4444] bg-[#EF4444]/15 rounded-sm pointer-events-none pulse-hazard"
                  style={{ top: '22%', left: '34%', width: '22%', height: '62%' }}
                >
                  <div className="absolute -top-5 left-0 bg-[#EF4444] text-white font-mono-code text-[9px] font-bold px-1.5 py-0.2 rounded shadow">
                    ⚠️ HAZARD DETECTED • 95%
                  </div>
                  <div className="absolute top-2 left-2 bg-[#EF4444] text-white font-mono-code text-[8px] font-bold px-1 rounded shadow">
                    NO HARDHAT
                  </div>
                </div>

                {/* Ground helper */}
                <div
                  className="absolute border-2 border-[#00FF9D] bg-[#00FF9D]/15 rounded-sm pointer-events-none"
                  style={{ top: '48%', left: '68%', width: '18%', height: '42%' }}
                >
                  <div className="absolute -top-4 left-0 bg-[#00FF9D] text-[#04120c] font-mono-code text-[8px] font-black px-1 py-0.2 rounded">
                    COMPLIANT • 94%
                  </div>
                </div>

                {/* Virtual restricted polygon outline */}
                <div 
                  className="absolute border-2 border-dashed border-[#FBBF24]/80 bg-[#FBBF24]/10 rounded pointer-events-none"
                  style={{ top: '65%', left: '10%', width: '75%', height: '30%' }}
                >
                  <span className="absolute top-1 left-2 text-[9px] font-mono-code text-[#FBBF24] font-bold bg-[#04120c]/90 px-1 rounded">
                    RESTRICTED MACHINERY EXCLUSION BOUNDARY
                  </span>
                </div>
              </>
            )}

            {/* Paused state watermark */}
            {!isPlaying && activeCamera.status !== 'offline' && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#04120c]/80 backdrop-blur-xs">
                <div className="text-center">
                  <VideoOff className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <div className="font-heading font-bold text-white text-base">Stream Monitoring Paused</div>
                  <div className="text-xs text-[#A7F3D0] mt-1">Click Resume Streams above to restore live telemetry.</div>
                </div>
              </div>
            )}

            {/* Live Camera Watermark */}
            <div className="absolute top-3 left-3 bg-[#04120c]/85 border border-[#10B981]/40 px-2 py-1 rounded text-[10px] font-mono-code text-[#00FF9D] flex items-center gap-1.5 backdrop-blur-sm font-bold">
              <Radio className="w-3 h-3 text-[#EF4444] animate-pulse" />
              <span>LIVE EDGE CV PIPELINE</span>
            </div>

            <div className="absolute bottom-3 left-3 bg-[#04120c]/85 border border-[#10B981]/30 px-2.5 py-1.5 rounded-lg text-[10px] font-mono-code text-white backdrop-blur-sm">
              <span>LATENCY: 14ms • BUFFER: ZERO • FRAME RATE: {activeCamera.fps}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#A7F3D0] pt-1 font-mono-code">
            <span>MODE: Configured Video Simulator & Real-Time Optical Heuristics</span>
            <button
              onClick={() => onNavigateToTab('vision-lab')}
              className="text-[#00FF9D] hover:underline font-bold"
            >
              Analyze High-Res Still in Vision Lab →
            </button>
          </div>
        </div>

        {/* Right Col: Camera Selector Feed List */}
        <div className="glass-panel p-4 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#10B981]/20">
            <h2 className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
              <Video className="w-4 h-4 text-[#00FF9D]" />
              <span>Camera Stream Matrix</span>
            </h2>
            <span className="text-[10px] font-mono-code text-[#A7F3D0] font-bold">
              {cameras.length} Active Feeds
            </span>
          </div>

          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {cameras.map((cam) => {
              const isSelected = cam.id === activeCamera.id;
              return (
                <div
                  key={cam.id}
                  onClick={() => setSelectedCameraId(cam.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#10B981]/25 border-[#00FF9D] shadow-md shadow-[#10B981]/20'
                      : 'bg-[#071f16]/90 border-[#10B981]/20 hover:border-[#00FF9D]/60 hover:bg-[#0a291e]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-900 border border-[#10B981]/30 shrink-0 relative">
                      <img src={cam.previewImage} alt={cam.name} className="w-full h-full object-cover" />
                      <span className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${
                        cam.status === 'online' ? 'bg-[#00FF9D]' : 'bg-[#EF4444]'
                      }`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-mono-code text-[10px] text-[#00FF9D] font-bold">
                          {cam.id.toUpperCase()}
                        </span>
                        <span className={`text-[8px] font-mono-code font-bold px-1 rounded uppercase ${
                          cam.threatLevel === 'Critical' ? 'bg-[#EF4444]/25 text-[#FF6B6B]' :
                          cam.threatLevel === 'High' ? 'bg-[#FBBF24]/25 text-[#FBBF24]' : 'bg-[#00FF9D]/25 text-[#00FF9D]'
                        }`}>
                          {cam.threatLevel}
                        </span>
                      </div>
                      <div className="font-bold text-xs text-white truncate mt-0.5">{cam.name}</div>
                      <div className="text-[10px] text-[#A7F3D0] truncate">{cam.locationLabel}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
