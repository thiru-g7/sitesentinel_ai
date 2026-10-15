import React, { useState } from 'react';
import { 
  ShieldAlert, 
  HardHat, 
  Scan, 
  ChevronRight, 
  Eye, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Cpu, 
  Sparkles,
  ArrowRight,
  Maximize2,
  FileCheck,
  Zap,
  Lock,
  Layers,
  Award,
  Palette
} from 'lucide-react';
import { SiteSentinelLogo, LogoManagerModal } from '../common/SiteSentinelLogo';

interface LandingPageProps {
  onLaunchApp: () => void;
  onExploreDemo: (presetId?: string) => void;
  onOpenEvaluation?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp, onExploreDemo, onOpenEvaluation }) => {
  const [showLogoModal, setShowLogoModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#04120c] text-white bg-blueprint-grid selection:bg-[#10B981]/30 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-[#10B981]/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="flex items-center cursor-pointer group" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <SiteSentinelLogo 
                size="lg" 
                showWordmark={true} 
                showBadge={true} 
                badgeText="v2.4 PRO" 
                subtitle="Industrial Safety & Computer Vision Intelligence" 
              />
            </div>

            <button
              onClick={() => setShowLogoModal(true)}
              className="px-2 py-1 rounded-lg bg-[#071f16] border border-[#10B981]/30 text-[#A7F3D0] hover:text-[#00FF9D] hover:border-[#00FF9D] hover:bg-[#0a291e] transition-all text-xs font-medium hidden lg:inline-flex items-center gap-1.5"
              title="Change or upload custom logo"
            >
              <Palette className="w-3.5 h-3.5 text-[#00FF9D]" />
              <span>Change Logo</span>
            </button>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-200">
            <a href="#capabilities" className="hover:text-[#00FF9D] transition-colors">Capabilities</a>
            <a href="#pipeline" className="hover:text-[#00FF9D] transition-colors">How It Works</a>
            <a href="#architecture" className="hover:text-[#00FF9D] transition-colors">Architecture</a>
            <a href="#ecothon" className="hover:text-[#00FF9D] transition-colors flex items-center gap-1 font-semibold text-[#34D399]">
              <Award className="w-4 h-4 text-[#00FF9D]" /> ECOTHON '26
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onExploreDemo('sample-scaffold-violation')}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#0a291e] border border-[#10B981]/35 text-[#00FF9D] hover:bg-[#0e3829] hover:border-[#00FF9D] transition-all flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Interactive Vision Lab</span>
            </button>
            <button
              onClick={onLaunchApp}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-[#10B981] via-[#00FF9D] to-[#34D399] text-[#04120c] hover:brightness-110 shadow-lg shadow-[#10B981]/30 transition-all flex items-center gap-1.5"
            >
              <span>Launch Sentinel OS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-6 overflow-hidden">
        {/* Glow ambient spots in green */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-[#10B981]/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-[#00FF9D]/12 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#071f16]/90 border border-[#10B981]/40 text-xs text-[#00FF9D] font-mono-code mb-8 backdrop-blur-md shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#00FF9D] animate-ping" />
            <span className="font-semibold text-white">ECOTHON 2026 INITIATIVE • AI PPE & HAZARD VISION PLATFORM</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-heading max-w-4xl mx-auto leading-[1.1] text-white">
            See the Risk. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] via-[#34D399] to-[#FFFFFF]">
              Secure the Site.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-[#E2E8F0] max-w-2xl mx-auto font-normal leading-relaxed">
            Real-time computer vision and explainable AI for construction safety. Detect missing hardhats, reflective vest violations, restricted-zone incursions, and heavy machinery proximity hazards before incidents occur.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onLaunchApp}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#10B981] via-[#00FF9D] to-[#34D399] text-[#04120c] font-black text-sm shadow-xl shadow-[#10B981]/30 hover:shadow-[#00FF9D]/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Enter Safety Command Center</span>
            </button>
            <button
              onClick={() => onExploreDemo('sample-machinery-zone')}
              className="px-6 py-3.5 rounded-xl glass-panel-interactive border border-[#10B981]/40 text-white font-semibold text-sm hover:border-[#00FF9D] flex items-center gap-2"
            >
              <Scan className="w-4 h-4 text-[#00FF9D]" />
              <span>Simulate Detection Pipeline</span>
            </button>
          </div>

          {/* Realistic Live Simulation Hero Card with Computer Vision Bounding Boxes */}
          <div className="mt-16 max-w-5xl mx-auto relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#10B981]/40 via-[#00FF9D]/30 to-[#34D399]/40 blur-xl opacity-80 group-hover:opacity-100 transition duration-1000" />
            
            <div className="relative rounded-2xl glass-panel-glow overflow-hidden border border-[#10B981]/40 shadow-2xl bg-[#071f16]">
              {/* HUD Header Bar */}
              <div className="bg-[#04120c]/95 border-b border-[#10B981]/25 px-4 py-2.5 flex items-center justify-between text-xs font-mono-code text-white">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-pulse" />
                  <span className="text-[#00FF9D] font-bold">FEED: CAM-03 • NORTH SCAFFOLDING TOWER</span>
                  <span className="text-slate-500">|</span>
                  <span className="text-[#E2E8F0]">FPS: 30.0 • 2560x1440</span>
                </div>
                <div className="flex items-center space-x-3 text-[11px]">
                  <span className="bg-[#EF4444]/25 text-[#FF6B6B] border border-[#EF4444]/50 px-2 py-0.5 rounded font-bold">
                    CRITICAL HAZARD DETECTED
                  </span>
                  <span className="text-[#34D399] font-bold">INFERENCE: 18ms</span>
                </div>
              </div>

              {/* Visual Preview with Bounding Boxes */}
              <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=1400&auto=format&fit=crop&q=80"
                  alt="Construction worker on scaffold with safety detection overlay"
                  className="w-full h-full object-cover opacity-85"
                />

                {/* Reticle / Scanline Animation */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#00FF9D]/10 to-transparent h-24 animate-scanline" />

                {/* Bounding Box 1: Worker */}
                <div 
                  className="absolute border-2 border-[#EF4444] bg-[#EF4444]/15 rounded-sm shadow-lg pointer-events-none transition-all"
                  style={{ top: '16%', left: '32%', width: '28%', height: '68%' }}
                >
                  <div className="absolute -top-6 left-0 bg-[#EF4444] text-white font-mono-code text-[10px] font-bold px-1.5 py-0.5 rounded-t flex items-center gap-1 shadow">
                    <span>WORKER #01</span>
                    <span>• 96%</span>
                  </div>
                </div>

                {/* Bounding Box 2: Missing Helmet Box */}
                <div 
                  className="absolute border-2 border-dashed border-[#EF4444] bg-[#EF4444]/30 rounded pulse-hazard pointer-events-none"
                  style={{ top: '16%', left: '41%', width: '11%', height: '15%' }}
                >
                  <div className="absolute -bottom-6 left-0 bg-[#EF4444] text-white font-mono-code text-[9px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                    ⚠️ MISSING HELMET (CRITICAL)
                  </div>
                </div>

                {/* Bounding Box 3: Compliant Vest in Crisp Green */}
                <div 
                  className="absolute border-2 border-[#00FF9D] bg-[#00FF9D]/15 rounded-sm pointer-events-none"
                  style={{ top: '38%', left: '38%', width: '17%', height: '26%' }}
                >
                  <div className="absolute top-1 right-1 bg-[#00FF9D] text-[#04120c] font-mono-code text-[8px] font-bold px-1 py-0.2 rounded">
                    VEST ✓ 92%
                  </div>
                </div>

                {/* Floating Telemetry HUD card */}
                <div className="absolute bottom-4 left-4 max-w-sm rounded-xl glass-panel p-3.5 border border-[#10B981]/35 text-left text-xs font-mono-code shadow-2xl">
                  <div className="flex items-center justify-between text-[#00FF9D] font-bold text-[11px] mb-1">
                    <span>AI RULE EVALUATION</span>
                    <span className="text-[#FF6B6B]">PRIORITY: 94/100</span>
                  </div>
                  <p className="text-white text-[11px] font-sans font-medium">
                    Rule <strong className="text-[#00FF9D]">OSHA-1926.100</strong> breached. Worker at 12m height without hardhat under crane radius.
                  </p>
                  <div className="mt-2 pt-2 border-t border-[#10B981]/20 flex items-center justify-between text-[10px] text-slate-300">
                    <span>STATUS: Pending Verification</span>
                    <span className="text-[#00FF9D] font-bold">Candidate INC-401</span>
                  </div>
                </div>

                {/* Quick Action Button overlay */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button 
                    onClick={onLaunchApp}
                    className="px-3.5 py-1.5 rounded-lg bg-[#00FF9D] text-[#04120c] font-mono-code font-bold text-xs hover:bg-[#34D399] shadow-lg transition-all flex items-center gap-1.5"
                  >
                    <span>Inspect Incident In Console</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section className="py-20 px-6 border-t border-[#10B981]/20 bg-[#071f16]/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono-code text-[#00FF9D] uppercase tracking-wider font-bold">Industrial Reality</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white mt-2">
              Why Manual Inspections Fail High-Risk Sites
            </h2>
            <p className="text-[#E2E8F0] text-sm mt-3">
              Modern high-rise, infrastructure and mining projects cover thousands of square meters with hundreds of dynamic workers. Manual spot-checks miss 82% of temporary violations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* The Manual Problem */}
            <div className="glass-panel p-8 rounded-2xl border-l-4 border-l-[#EF4444] relative overflow-hidden">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#EF4444]/20 flex items-center justify-center text-[#EF4444]">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">The Manual Inspection Gap</h3>
                  <p className="text-xs text-[#CBD5E1]">Traditional Safety Clipboards & Walkthroughs</p>
                </div>
              </div>
              <ul className="space-y-4 text-sm text-[#E2E8F0]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#EF4444] font-bold">✕</span>
                  <span><strong className="text-white">Blindspots:</strong> Human supervisors can only observe one zone at a time; 85% of perimeter scaffolding remains unmonitored.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#EF4444] font-bold">✕</span>
                  <span><strong className="text-white">Subjective & Untracked:</strong> Informal verbal reminders leave no audit trail for contractor compliance accountability.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#EF4444] font-bold">✕</span>
                  <span><strong className="text-white">Lagging Reaction:</strong> Near-misses are investigated only after an injury occurs, rather than intercepted dynamically.</span>
                </li>
              </ul>
            </div>

            {/* The SiteSentinel AI Solution */}
            <div className="glass-panel p-8 rounded-2xl border-l-4 border-l-[#00FF9D] relative overflow-hidden">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#00FF9D]/20 flex items-center justify-center text-[#00FF9D]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">The SiteSentinel AI Paradigm</h3>
                  <p className="text-xs text-[#00FF9D] font-semibold">Continuous Computer Vision + Supervisor Verification</p>
                </div>
              </div>
              <ul className="space-y-4 text-sm text-[#E2E8F0]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#00FF9D] font-bold">✓</span>
                  <span><strong className="text-white">Full Optical Coverage:</strong> Analyzes RTSP, webcam, and static photos simultaneously across all active hazardous zones.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#00FF9D] font-bold">✓</span>
                  <span><strong className="text-white">Explainable AI with Proof:</strong> Every alert produces visual bounding boxes, confidence score, and OSHA rule justification.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#00FF9D] font-bold">✓</span>
                  <span><strong className="text-white">Closed-Loop Resolution:</strong> Tracks corrective actions from assignment to verified resolution with zero lost records.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Key Capabilities */}
      <section id="capabilities" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono-code text-[#00FF9D] uppercase tracking-wider font-bold">Engineered For Zero Harm</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white mt-2">
              Comprehensive Safety Intelligence Modules
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="glass-panel-interactive p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#00FF9D] mb-4">
                <HardHat className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-white mb-2">Automated PPE Vision Detection</h3>
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                Detects safety helmets, reflective vests, and identifies unequipped workers with pinpoint bounding box coordinates and confidence levels.
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass-panel-interactive p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-[#EF4444]/20 border border-[#EF4444]/40 flex items-center justify-center text-[#EF4444] mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-white mb-2">Restricted Zone Geo-Fencing</h3>
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                Define virtual spatial polygons over deep excavation pits, high-voltage areas, or crane slew arcs to flag unauthorized entry instantly.
              </p>
            </div>

            {/* Card 3 */}
            <div className="glass-panel-interactive p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-[#FBBF24]/20 border border-[#FBBF24]/40 flex items-center justify-center text-[#FBBF24] mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-white mb-2">Machinery Proximity Radar</h3>
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                Estimates image-space proximity between ground workers and operating 25-ton excavators or mobile cranes to prevent blindspot collisions.
              </p>
            </div>

            {/* Card 4 */}
            <div className="glass-panel-interactive p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-[#34D399]/20 border border-[#34D399]/40 flex items-center justify-center text-[#00FF9D] mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-white mb-2">Smart Safety Risk Prioritization</h3>
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                Deterministic priority engine factors violation severity, zone hazard level, repeat occurrence frequency, and review latency.
              </p>
            </div>

            {/* Card 5 */}
            <div className="glass-panel-interactive p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-[#00FF9D]/20 border border-[#00FF9D]/40 flex items-center justify-center text-[#00FF9D] mb-4">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-white mb-2">Closed-Loop Incident Management</h3>
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                End-to-end lifecycle from AI detection to supervisor verification, task assignment, corrective actions, and verifiable resolution.
              </p>
            </div>

            {/* Card 6 */}
            <div className="glass-panel-interactive p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#00FF9D] mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-white mb-2">Grounded AI Safety Assistant</h3>
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                Query OSHA regulations, zone compliance statistics, and pending action items in natural language with strict site-data grounding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Pipeline */}
      <section id="pipeline" className="py-20 px-6 border-t border-[#10B981]/20 bg-[#071f16]/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono-code text-[#00FF9D] uppercase tracking-wider font-bold">End-to-End Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white mt-2">
              From Optical Ingestion to Verified Resolution
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { step: '01', title: 'Feed Ingest', desc: 'RTSP camera, mobile photo upload, or drone feed.' },
              { step: '02', title: 'AI Inference', desc: 'Bounding box detection of workers, helmets, and vests.' },
              { step: '03', title: 'Rule Check', desc: 'Evaluates zone boundaries and PPE requirements.' },
              { step: '04', title: 'Risk Score', desc: 'Computes deterministic priority score (0-100).' },
              { step: '05', title: 'Supervisor Verify', desc: 'Field supervisor confirms or rejects candidate alert.' },
              { step: '06', title: 'Corrective Action', desc: 'Assigns task and records photographic proof of closure.' },
            ].map((item, idx) => (
              <div key={idx} className="glass-panel p-4 rounded-xl border-t-2 border-t-[#00FF9D] text-left">
                <span className="font-mono-code text-xs font-bold text-[#00FF9D]">{item.step}</span>
                <h4 className="font-heading font-bold text-sm text-white mt-2">{item.title}</h4>
                <p className="text-[11px] text-[#A7F3D0] mt-1 leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture & Tech Stack */}
      <section id="architecture" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono-code text-[#00FF9D] uppercase tracking-wider font-bold">Engineering Specs</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white mt-2">
              Modern Enterprise Tech Stack
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="glass-panel p-6 rounded-2xl border border-[#10B981]/30">
              <div className="flex items-center gap-2 text-[#00FF9D] font-bold text-sm mb-3">
                <Cpu className="w-4 h-4" />
                <span>Frontend Client</span>
              </div>
              <ul className="text-xs text-white space-y-2 font-mono-code">
                <li>• React 19 + TypeScript SPA</li>
                <li>• Tailwind CSS v4 Engine</li>
                <li>• Emerald & Pure White Aesthetics</li>
                <li>• Fluid Motion micro-animations</li>
                <li>• Web Audio API synthesized HUD chimes</li>
              </ul>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-[#10B981]/30">
              <div className="flex items-center gap-2 text-[#00FF9D] font-bold text-sm mb-3">
                <Layers className="w-4 h-4" />
                <span>Backend & Vision Engine</span>
              </div>
              <ul className="text-xs text-white space-y-2 font-mono-code">
                <li>• Express API Server + Vite middleware</li>
                <li>• Gemini 3.8 Flash Multimodal Vision</li>
                <li>• Local Edge CV Heuristic Engine</li>
                <li>• Deterministic Safety Rule Engine</li>
                <li>• REST API Endpoints with validation</li>
              </ul>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-[#10B981]/30">
              <div className="flex items-center gap-2 text-[#00FF9D] font-bold text-sm mb-3">
                <Lock className="w-4 h-4" />
                <span>Data & Governance</span>
              </div>
              <ul className="text-xs text-white space-y-2 font-mono-code">
                <li>• Supabase PostgreSQL schema design</li>
                <li>• RBAC: Admin, Supervisor, Viewer</li>
                <li>• Persistent audit history logs</li>
                <li>• CSV report export generation</li>
                <li>• Zero-hallucination explainable AI</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ECOTHON 2026 Hackathon Section */}
      <section id="ecothon" className="py-20 px-6 border-t border-[#10B981]/25 bg-[#071f16]/70">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10B981]/20 border border-[#00FF9D]/40 text-xs text-[#00FF9D] font-mono-code mb-4 font-bold">
            <Award className="w-4 h-4 text-[#00FF9D]" />
            <span>ECOTHON 2026 HACKATHON ENTRY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white">
            Evaluation Dossier & Guided Walkthrough
          </h2>
          <p className="mt-3 text-sm text-[#E2E8F0] max-w-2xl mx-auto">
            Includes a 12-step guided demo flow, six technical architectural innovations, judge FAQs, and prompt alignment rubric.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                if (onOpenEvaluation) {
                  onOpenEvaluation();
                } else {
                  onLaunchApp();
                }
              }}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#10B981] via-[#00FF9D] to-[#34D399] text-[#04120c] font-black text-xs shadow-xl shadow-[#10B981]/30 hover:brightness-110 transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Launch 12-Step Evaluation Walkthrough</span>
            </button>
            <button
              onClick={() => onExploreDemo('sample-scaffold-violation')}
              className="px-6 py-3.5 rounded-xl bg-[#0a291e] border border-[#10B981]/40 text-white font-bold text-xs hover:border-[#00FF9D] flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-[#00FF9D]" />
              <span>Test AI PPE Vision Lab</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#10B981]/20 bg-[#04120c] py-12 px-6 text-xs text-slate-300">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <SiteSentinelLogo size="sm" showWordmark={true} />
            <span className="text-[#A7F3D0] hidden md:inline">— “See the Risk. Secure the Site.”</span>
          </div>

          <div className="text-center sm:text-right">
            <p className="text-[11px] text-white">
              Developed for the ECOTHON Hackathon 2026. Prototypes use clearly labelled sample data.
            </p>
            <p className="text-[10px] text-[#A7F3D0] mt-1">
              Disclaimer: AI detections require human safety supervisor verification before formal disciplinary action.
            </p>
          </div>
        </div>
      </footer>

      {/* Logo Customizer Modal */}
      <LogoManagerModal 
        isOpen={showLogoModal} 
        onClose={() => setShowLogoModal(false)} 
      />
    </div>
  );
};
