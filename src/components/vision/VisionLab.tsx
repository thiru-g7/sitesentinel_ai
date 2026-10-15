import React, { useState, useRef, useEffect } from 'react';
import { 
  Scan, 
  Upload, 
  Camera, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Sliders, 
  Save, 
  Eye, 
  RefreshCw, 
  ShieldAlert, 
  HardHat, 
  Sparkles,
  Info
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { SAMPLE_TEST_IMAGES } from '../../data/seedData';
import { DetectionBox, HazardLevel } from '../../types';

interface VisionLabProps {
  initialSampleId?: string;
  onNavigateToTab: (tabId: string, incidentId?: string) => void;
}

export const VisionLab: React.FC<VisionLabProps> = ({ initialSampleId, onNavigateToTab }) => {
  const { activeSite, createIncidentFromAnalysis, currentUser, playAlertSound } = useSafety();

  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_TEST_IMAGES[0].imageUrl);
  const [selectedSampleId, setSelectedSampleId] = useState<string>(initialSampleId || SAMPLE_TEST_IMAGES[0].id);
  const [selectedZoneId, setSelectedZoneId] = useState<string>(activeSite.zones[0]?.id || 'zone-scaffolding');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.75);
  const [filterMode, setFilterMode] = useState<'all' | 'violations' | 'compliant'>('all');
  const [savedSuccessMessage, setSavedSuccessMessage] = useState<string | null>(null);
  const [isWebcamOpen, setIsWebcamOpen] = useState<boolean>(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startWebcam = async () => {
    setWebcamError(null);
    setIsWebcamOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn('Webcam access error:', err);
      setWebcamError(err?.message || 'Camera permission denied or camera not found on this device.');
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsWebcamOpen(false);
    setWebcamError(null);
  };

  const captureWebcamSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setSelectedImage(dataUrl);
    setSelectedSampleId('custom-webcam');
    stopWebcam();
    runInference('custom-webcam', dataUrl);
  };

  useEffect(() => {
    if (initialSampleId) {
      const match = SAMPLE_TEST_IMAGES.find(s => s.id === initialSampleId);
      if (match) {
        setSelectedImage(match.imageUrl);
        setSelectedSampleId(match.id);
      }
    }
    runInference(initialSampleId || SAMPLE_TEST_IMAGES[0].id, SAMPLE_TEST_IMAGES[0].imageUrl);
  }, [initialSampleId]);

  const handleSelectSample = (sample: typeof SAMPLE_TEST_IMAGES[0]) => {
    setSelectedImage(sample.imageUrl);
    setSelectedSampleId(sample.id);
    setAnalysisResult(null);
    setSavedSuccessMessage(null);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result as string;
        setSelectedImage(dataUrl);
        setSelectedSampleId('custom-upload');
        setAnalysisResult(null);
        setSavedSuccessMessage(null);
        runInference('custom-upload', dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const runInference = async (sampleIdToUse?: string, imageToUse?: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setSavedSuccessMessage(null);

    const steps = [
      'Normalizing input tensor (1024x1024)...',
      'Running multimodal object detection backbone...',
      'Segmenting cranial and vest regions of interest...',
      'Evaluating OSHA-1926 & ISO-45001 safety rule graphs...',
    ];

    for (let i = 0; i < steps.length; i++) {
      setAnalysisStep(steps[i]);
      await new Promise(r => setTimeout(r, 260));
    }

    try {
      const targetImg = imageToUse || selectedImage;
      const targetSample = sampleIdToUse || selectedSampleId;

      const res = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: targetImg,
          sampleId: targetSample,
          siteId: activeSite.id,
          zoneId: selectedZoneId,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setAnalysisResult({
          ...json.data,
          provider: json.provider,
        });

        if (json.data.violationsFound > 0) {
          playAlertSound(json.data.overallRiskScore > 75 ? 'Critical' : 'High');
        } else {
          playAlertSound('Low');
        }
      }
    } catch (err) {
      console.error('Inference error:', err);
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const visibleDetections = (analysisResult?.detections || []).filter((det: DetectionBox) => {
    if (det.confidence < confidenceThreshold) return false;
    if (filterMode === 'violations') return det.status === 'Violation';
    if (filterMode === 'compliant') return det.status === 'Compliant';
    return true;
  });

  const handleSaveAsIncident = () => {
    if (!analysisResult) return;

    const severity: HazardLevel = 
      analysisResult.overallRiskScore > 75 ? 'Critical' :
      analysisResult.overallRiskScore > 50 ? 'High' :
      analysisResult.overallRiskScore > 25 ? 'Medium' : 'Low';

    const newIncident = createIncidentFromAnalysis({
      siteId: activeSite.id,
      zoneId: selectedZoneId,
      title: analysisResult.summary || 'AI Vision PPE & Hazard Violation',
      description: `Detected ${analysisResult.violationsFound} safety infractions across ${analysisResult.workerCount} workers. Key recommendation: ${analysisResult.safetyRecommendations?.[0] || 'Enforce PPE compliance.'}`,
      severity,
      priorityScore: analysisResult.overallRiskScore || 85,
      evidenceImageUrl: selectedImage,
      detections: analysisResult.detections || [],
    });

    setSavedSuccessMessage(`Logged as candidate incident ${newIncident.code}! Routed to Supervisor queue.`);
    setTimeout(() => {
      onNavigateToTab('incidents', newIncident.id);
    }, 1400);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header banner */}
      <div className="p-4 rounded-2xl glass-panel-glow border-l-4 border-l-[#00FF9D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">
              AI Computer Vision PPE & Hazard Lab
            </h1>
            <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#10B981]/25 text-[#00FF9D] border border-[#00FF9D]/40 font-bold">
              MULTIMODAL VISION
            </span>
          </div>
          <p className="text-xs text-[#E2E8F0] mt-1">
            Detects Hardhats, High-Vis Vests, Proximity Hazards & Zone Infractions with precise spatial bounding boxes.
          </p>
        </div>

        {/* Action button */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl bg-[#071f16] border border-[#10B981]/40 text-xs text-white hover:bg-[#0e3829] hover:border-[#00FF9D] transition-all flex items-center gap-1.5 font-semibold"
          >
            <Upload className="w-3.5 h-3.5 text-[#00FF9D]" />
            <span>Upload Photo</span>
          </button>

          <button
            onClick={startWebcam}
            className="px-3.5 py-2 rounded-xl bg-[#071f16] border border-[#00FF9D]/40 text-xs text-[#00FF9D] hover:bg-[#0e3829] hover:border-[#00FF9D] transition-all flex items-center gap-1.5 font-bold"
          >
            <Camera className="w-3.5 h-3.5 text-[#00FF9D]" />
            <span>Live Camera</span>
          </button>

          <button
            onClick={() => runInference()}
            disabled={isAnalyzing}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#10B981] via-[#00FF9D] to-[#34D399] text-[#04120c] font-black text-xs shadow-lg shadow-[#10B981]/30 hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-1.5"
          >
            {isAnalyzing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isAnalyzing ? 'Analyzing...' : 'Run Vision Inference'}</span>
          </button>
        </div>
      </div>

      {/* Preset Test Case Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#A7F3D0]">
          <span className="font-mono-code uppercase tracking-wider text-[11px] text-[#00FF9D] font-bold">
            Preset Industrial Test Cases (Click to Test Instantly)
          </span>
          <span className="text-[10px] text-white">Or upload your own construction image above</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SAMPLE_TEST_IMAGES.map((sample) => {
            const isSelected = selectedSampleId === sample.id;
            return (
              <div
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#10B981]/25 border-[#00FF9D] shadow-md shadow-[#10B981]/25'
                    : 'bg-[#071f16]/90 border-[#10B981]/25 hover:border-[#00FF9D]/60 hover:bg-[#0a291e]'
                }`}
              >
                <div className="aspect-[16/10] rounded-lg overflow-hidden mb-2 relative">
                  <img src={sample.imageUrl} alt={sample.title} className="w-full h-full object-cover" />
                  <span className={`absolute top-1 right-1 text-[8px] font-mono-code font-bold px-1.5 py-0.2 rounded uppercase ${
                    sample.riskLevel === 'Critical' ? 'bg-[#EF4444] text-white' :
                    sample.riskLevel === 'Medium' ? 'bg-[#FBBF24] text-black' : 'bg-[#00FF9D] text-black font-black'
                  }`}>
                    {sample.riskLevel}
                  </span>
                </div>
                <div className="font-bold text-xs text-white truncate">{sample.title}</div>
                <div className="text-[10px] text-[#A7F3D0] mt-0.5 line-clamp-1">{sample.subtitle}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Analysis Workspace */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Annotated Vision Canvas */}
        <div className="lg:col-span-2 glass-panel p-4 rounded-2xl space-y-3">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#10B981]/20">
            {/* Filter buttons */}
            <div className="flex items-center space-x-1 p-0.5 rounded-lg bg-[#04120c] border border-[#10B981]/30 text-xs">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-2.5 py-1 rounded text-[11px] font-mono-code transition-colors ${
                  filterMode === 'all' ? 'bg-[#00FF9D] text-[#04120c] font-black' : 'text-slate-200 hover:text-white'
                }`}
              >
                All Detections
              </button>
              <button
                onClick={() => setFilterMode('violations')}
                className={`px-2.5 py-1 rounded text-[11px] font-mono-code transition-colors ${
                  filterMode === 'violations' ? 'bg-[#EF4444] text-white font-bold' : 'text-slate-200 hover:text-white'
                }`}
              >
                Violations Only
              </button>
              <button
                onClick={() => setFilterMode('compliant')}
                className={`px-2.5 py-1 rounded text-[11px] font-mono-code transition-colors ${
                  filterMode === 'compliant' ? 'bg-[#10B981] text-[#04120c] font-black' : 'text-slate-200 hover:text-white'
                }`}
              >
                Compliant Only
              </button>
            </div>

            {/* Confidence Slider */}
            <div className="flex items-center space-x-2 text-xs text-white">
              <Sliders className="w-3.5 h-3.5 text-[#00FF9D]" />
              <span className="text-[11px] font-mono-code font-semibold">Confidence: {Math.round(confidenceThreshold * 100)}%</span>
              <input
                type="range"
                min="0.5"
                max="0.95"
                step="0.05"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                className="w-20 accent-[#00FF9D] cursor-pointer"
              />
            </div>
          </div>

          {/* Interactive Image Display with SVG / HTML Bounding Boxes */}
          <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-950 border border-[#10B981]/35 select-none">
            <img
              src={selectedImage}
              alt="Inspection analysis"
              className="w-full h-full object-cover"
            />

            {/* Loading Overlay */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-[#04120c]/85 backdrop-blur-sm flex flex-col items-center justify-center space-y-3 z-30">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-[#10B981]/25 border-t-[#00FF9D] animate-spin" />
                  <div className="absolute inset-2 rounded-full border-4 border-[#34D399]/30 border-b-[#34D399] animate-spin" />
                  <div className="w-full h-full flex items-center justify-center">
                    <Scan className="w-6 h-6 text-[#00FF9D]" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-heading font-bold text-white">SiteSentinel Vision Inference</div>
                  <div className="text-xs font-mono-code text-[#00FF9D] mt-1 font-bold">{analysisStep}</div>
                </div>
              </div>
            )}

            {/* Bounding Box Overlays */}
            {!isAnalyzing && visibleDetections.map((det: DetectionBox, idx: number) => {
              const [ymin, xmin, ymax, xmax] = det.box_2d;
              const top = `${(ymin / 1000) * 100}%`;
              const left = `${(xmin / 1000) * 100}%`;
              const width = `${((xmax - xmin) / 1000) * 100}%`;
              const height = `${((ymax - ymin) / 1000) * 100}%`;

              const isViolation = det.status === 'Violation';
              const isWarning = det.status === 'Warning';

              const borderColor = isViolation ? '#EF4444' : isWarning ? '#FBBF24' : '#00FF9D';
              const bgBadge = isViolation ? 'bg-[#EF4444] text-white' : isWarning ? 'bg-[#FBBF24] text-black font-bold' : 'bg-[#00FF9D] text-[#04120c] font-black';

              return (
                <div
                  key={det.id || idx}
                  className={`absolute rounded-sm transition-all group pointer-events-auto ${
                    isViolation ? 'pulse-hazard' : ''
                  }`}
                  style={{
                    top,
                    left,
                    width,
                    height,
                    border: `2px solid ${borderColor}`,
                    backgroundColor: `${borderColor}20`,
                  }}
                >
                  {/* Label badge */}
                  <div
                    className={`absolute -top-5 left-0 text-[9px] font-mono-code font-bold px-1.5 py-0.2 rounded-t flex items-center gap-1 shadow-md ${bgBadge}`}
                  >
                    <span>{det.label}</span>
                    <span>• {Math.round(det.confidence * 100)}%</span>
                  </div>

                  {/* Hover detail tooltip */}
                  <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block z-40 w-48 p-2 rounded-lg bg-[#071f16] border border-[#00FF9D]/60 shadow-xl text-left pointer-events-none">
                    <div className="text-[10px] font-bold text-white">{det.label}</div>
                    <div className="text-[9px] text-[#A7F3D0] mt-0.5">{det.description}</div>
                    <div className="mt-1 flex items-center justify-between text-[8px] font-mono-code text-white">
                      <span>Status: {det.status}</span>
                      <span>Severity: {det.severity}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Model Transparency Footer */}
          {analysisResult && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-white font-mono-code pt-1 gap-2">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#00FF9D]" />
                <span>INFERENCE PROVIDER: <strong className="text-[#00FF9D]">{analysisResult.provider}</strong></span>
              </div>
              <div className="text-[#A7F3D0]">
                <span>{visibleDetections.length} objects shown (filtered from {analysisResult.detections?.length || 0})</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Inspection Findings & Incident Creation */}
        <div className="glass-panel p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#10B981]/20">
            <h2 className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#00FF9D]" />
              <span>Inspection Findings</span>
            </h2>

            {analysisResult && (
              <span className={`text-[10px] font-mono-code font-bold px-2 py-0.5 rounded ${
                analysisResult.overallRiskScore > 75 ? 'bg-[#EF4444]/25 text-[#FF6B6B] border border-[#EF4444]/50' :
                analysisResult.overallRiskScore > 40 ? 'bg-[#FBBF24]/25 text-[#FBBF24] border border-[#FBBF24]/50' :
                'bg-[#10B981]/25 text-[#00FF9D] border border-[#00FF9D]/50'
              }`}>
                RISK: {analysisResult.overallRiskScore}/100
              </span>
            )}
          </div>

          {!analysisResult ? (
            <div className="py-12 text-center text-white text-xs">
              <Scan className="w-8 h-8 text-[#00FF9D] mx-auto mb-2 opacity-60" />
              Click "Run Vision Inference" to analyze PPE compliance on the selected scene.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Executive Summary */}
              <div className="p-3 rounded-xl bg-[#071f16]/90 border border-[#10B981]/30">
                <div className="text-[10px] font-mono-code text-[#00FF9D] uppercase font-bold">Vision Summary</div>
                <p className="text-xs text-white mt-1 leading-relaxed font-medium">
                  {analysisResult.summary}
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono-code pt-2 border-t border-[#10B981]/20">
                  <span className="text-[#A7F3D0]">Workers: <strong className="text-white">{analysisResult.workerCount}</strong></span>
                  <span className="text-[#A7F3D0]">Violations: <strong className={analysisResult.violationsFound > 0 ? 'text-[#FF6B6B]' : 'text-[#00FF9D]'}>{analysisResult.violationsFound}</strong></span>
                </div>
              </div>

              {/* Detected Objects Checklist */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-white">Detected Classes & Evidence</div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {visibleDetections.map((det: DetectionBox, idx: number) => (
                    <div
                      key={det.id || idx}
                      className="p-2 rounded-lg bg-[#04120c]/80 border border-[#10B981]/25 text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            det.status === 'Violation' ? 'bg-[#EF4444]' : 'bg-[#00FF9D]'
                          }`} />
                          <span>{det.label}</span>
                        </div>
                        <div className="text-[10px] text-[#A7F3D0] mt-0.5 line-clamp-1">{det.description}</div>
                      </div>
                      <span className="text-[10px] font-mono-code text-[#00FF9D] font-bold">
                        {Math.round(det.confidence * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Recommendations */}
              {analysisResult.safetyRecommendations?.length > 0 && (
                <div className="p-3 rounded-xl bg-[#0a291e]/90 border border-[#10B981]/30 text-xs">
                  <div className="font-bold text-[#00FF9D] mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Recommended Immediate Actions</span>
                  </div>
                  <ul className="text-[11px] text-white space-y-1 list-disc pl-4 font-medium">
                    {analysisResult.safetyRecommendations.map((rec: string, idx: number) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Save As Candidate Incident Section */}
              <div className="pt-3 border-t border-[#10B981]/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#A7F3D0] font-medium">Assign To Site Zone:</span>
                  <select
                    value={selectedZoneId}
                    onChange={(e) => setSelectedZoneId(e.target.value)}
                    className="bg-[#04120c] border border-[#10B981]/40 rounded px-2 py-1 text-xs text-white font-medium"
                  >
                    {activeSite.zones.map(z => (
                      <option key={z.id} value={z.id}>{z.name}</option>
                    ))}
                  </select>
                </div>

                {savedSuccessMessage ? (
                  <div className="p-2.5 rounded-lg bg-[#00FF9D]/25 border border-[#00FF9D] text-[#00FF9D] text-xs font-bold text-center animate-in fade-in">
                    {savedSuccessMessage}
                  </div>
                ) : (
                  <button
                    onClick={handleSaveAsIncident}
                    disabled={currentUser.role === 'viewer'}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#10B981] via-[#00FF9D] to-[#34D399] text-[#04120c] font-black text-xs shadow-lg shadow-[#10B981]/30 hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Analysis as Candidate Incident</span>
                  </button>
                )}

                {currentUser.role === 'viewer' && (
                  <p className="text-[10px] text-[#FBBF24] text-center font-medium">
                    Read-Only viewer mode. Switch to Supervisor or Admin to commit incidents.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Webcam Live Capture Modal */}
      {isWebcamOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="max-w-xl w-full rounded-2xl glass-panel-glow p-5 border border-[#00FF9D]/60 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#10B981]/25">
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-[#00FF9D]" />
                <h3 className="font-heading font-bold text-base text-white">Live Camera Capture</h3>
              </div>
              <button
                onClick={stopWebcam}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                ✕
              </button>
            </div>

            {webcamError ? (
              <div className="p-4 rounded-xl bg-[#EF4444]/20 border border-[#EF4444] text-[#FF6B6B] text-xs">
                {webcamError}
                <div className="mt-2 text-white">Please check camera permissions in browser settings or use the file upload / presets.</div>
              </div>
            ) : (
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black border border-[#10B981]/40">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-8 border border-dashed border-[#00FF9D]/60 rounded-lg pointer-events-none flex items-center justify-center">
                  <span className="text-[10px] font-mono-code text-[#00FF9D] bg-black/60 px-2 py-0.5 rounded">
                    FRAME INSPECTION TARGET
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[#A7F3D0] font-mono-code">
                Captures high-resolution frame for computer vision PPE analysis
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={stopWebcam}
                  className="px-3.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                {!webcamError && (
                  <button
                    type="button"
                    onClick={captureWebcamSnapshot}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#10B981] via-[#00FF9D] to-[#34D399] text-[#04120c] font-black text-xs hover:brightness-110 flex items-center gap-1.5 shadow-lg shadow-[#00FF9D]/25"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capture & Analyze</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
