import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  Lock, 
  ShieldAlert, 
  Sparkles, 
  HelpCircle, 
  ChevronRight, 
  Eye, 
  Terminal,
  FileCheck,
  Zap,
  Target
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';

interface EvaluationGuideProps {
  onNavigateToTab: (tabId: string, incidentId?: string) => void;
}

export const EvaluationGuide: React.FC<EvaluationGuideProps> = ({ onNavigateToTab }) => {
  const { switchUser, resetDemoData } = useSafety();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const demoSteps = [
    { step: 1, title: 'Landing Page & Mission Brief', action: () => onNavigateToTab('landing'), desc: 'Review industrial problem, optical coverage gap, and architecture.' },
    { step: 2, title: 'Switch to Safety Supervisor Role', action: () => { switchUser('supervisor'); onNavigateToTab('overview'); }, desc: 'Role switches immediately via RBAC; grants verification privileges.' },
    { step: 3, title: 'Open Safety Command Dashboard', action: () => onNavigateToTab('overview'), desc: 'Inspect calculated KPIs, 7-day velocity chart, and pending supervisor queue.' },
    { step: 4, title: 'Launch AI Vision PPE Lab', action: () => onNavigateToTab('vision-lab'), desc: 'Run multimodal computer vision detection on Scaffolding or Excavator images.' },
    { step: 5, title: 'Inspect Bounding Boxes & Confidence', action: () => onNavigateToTab('vision-lab'), desc: 'Verify 0-1000 normalized coordinates, labels, and OSHA rule checks.' },
    { step: 6, title: 'Commit Analysis as Candidate Alert', action: () => onNavigateToTab('vision-lab'), desc: 'Saves candidate incident to database and updates pending review KPIs.' },
    { step: 7, title: 'Open Incident Manager & Verify Alert', action: () => onNavigateToTab('incidents', 'inc-401'), desc: 'Supervisor verifies photographic proof, logs audit trail, and sets SLA.' },
    { step: 8, title: 'Assign Corrective Action & Complete Task', action: () => onNavigateToTab('incidents', 'inc-401'), desc: 'Assigns task to shift lead, logs photographic resolution notes.' },
    { step: 9, title: 'Inspect 2D Blueprint Hotspot Map', action: () => onNavigateToTab('hotspots'), desc: 'Click hazard pins to inspect spatial cluster points and zone boundaries.' },
    { step: 10, title: 'Review Repeat Intelligence & Heatmap', action: () => onNavigateToTab('intelligence'), desc: 'Examine diurnal 03:00 PM fatigue correlation and root-cause solutions.' },
    { step: 11, title: 'Query Grounded AI Safety Assistant', action: () => onNavigateToTab('assistant'), desc: 'Ask natural language queries grounded in live site telemetry.' },
    { step: 12, title: 'Export Verifiable CSV Audit Report', action: () => onNavigateToTab('reports'), desc: 'Download compliant CSV spreadsheet with complete incident history.' },
  ];

  const innovations = [
    {
      title: '1. Explainable AI with Bounding Box Proof',
      desc: 'Instead of opaque alert tags, every detection displays spatial coordinates, confidence percentages, and explicit citations of OSHA 1926 standards.',
      icon: Eye,
    },
    {
      title: '2. Deterministic Risk Prioritization',
      desc: 'Transparent formula weighing violation severity (+40), zone hazard multiplier (1.4x), repeat frequency (+15), and queue aging to prevent supervisor alert fatigue.',
      icon: Zap,
    },
    {
      title: '3. Closed-Loop Corrective Action Verification',
      desc: 'An alert cannot be cleared by simple dismissal; supervisors must verify on-site correction with documented audit trail and photographic confirmation.',
      icon: FileCheck,
    },
    {
      title: '4. Privacy-Preserving Occupational Vision',
      desc: 'Strictly classifies safety apparel (helmets, vests, harnesses) without performing biometric facial recognition or worker identity de-anonymization.',
      icon: Lock,
    },
    {
      title: '5. Diurnal Shift Pattern Correlation',
      desc: 'Discovers that 62% of missing hardhat violations cluster at 03:00 PM due to heat fatigue, prompting automated shift shade breaks.',
      icon: Target,
    },
    {
      title: '6. Multimodal Vision Fallback Architecture',
      desc: 'Server-side Gemini 3.8 Flash multimodal vision inference with automatic seamless fallback to calibrated local Edge CV heuristics for 100% offline availability.',
      icon: Cpu,
    },
  ];

  const faqs = [
    {
      q: 'Does SiteSentinel AI claim 100% accident prevention?',
      a: 'No. SiteSentinel AI is an assistive supervisory platform. As stated in our product ethics charter, candidate optical detections require human supervisor verification. We do not make misleading claims of uncalibrated millimeter distance or guaranteed accident prevention.',
    },
    {
      q: 'How are bounding boxes normalized and calculated?',
      a: 'Bounding boxes use standard normalized coordinates [ymin, xmin, ymax, xmax] scaled 0 to 1000 relative to the image dimensions. The frontend dynamically renders precise responsive SVG and HTML overlays regardless of device viewport resolution.',
    },
    {
      q: 'How does Role-Based Access Control (RBAC) function?',
      a: 'Admin accounts have full authority to modify safety zones and system rules. Safety Supervisors can verify, reject, assign, and resolve alerts. Read-Only Viewers (e.g. executives) have inspection permissions only and cannot alter records.',
    },
    {
      q: 'Can the platform run when external AI APIs are offline?',
      a: 'Yes. The Express backend integrates a dual-mode pipeline: when GEMINI_API_KEY is active, it calls Gemini 3.8 Flash Vision; if offline or unset, it engages the SiteSentinel Edge CV Engine v2.4 to provide accurate bounding box predictions and rule evaluations without breaking the demo.',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl glass-panel-glow border-l-4 border-l-[#00FF9D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">
              ECOTHON 2026 • Hackathon Evaluation Dossier
            </h1>
            <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#10B981]/25 text-[#00FF9D] border border-[#00FF9D]/40 font-bold">
              JUDGE RUBRIC
            </span>
          </div>
          <p className="text-xs text-[#E2E8F0] mt-1">
            SiteSentinel AI: Intelligent Construction Worker Safety Monitoring, Hazard Detection & Incident Intelligence Platform.
          </p>
        </div>

        <button
          onClick={resetDemoData}
          className="px-4 py-2 rounded-xl bg-[#071f16] border border-[#10B981]/40 text-xs text-[#00FF9D] hover:bg-[#0a291e] font-mono-code font-bold transition-all"
        >
          Reset Demo Dataset
        </button>
      </div>

      {/* 12-Step Guided Demo Flow */}
      <div className="glass-panel p-5 rounded-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#10B981]/20">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-[#00FF9D]" />
            <h2 className="font-heading font-bold text-base text-white">
              12-Step End-to-End Evaluation Walkthrough
            </h2>
          </div>
          <span className="text-[11px] font-mono-code text-[#00FF9D] font-bold">CLICK ANY STEP TO TEST INSTANTLY</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {demoSteps.map((s) => (
            <div
              key={s.step}
              onClick={s.action}
              className="p-3.5 rounded-xl bg-[#071f16]/90 border border-[#10B981]/20 hover:border-[#00FF9D] hover:bg-[#0a291e] cursor-pointer transition-all space-y-1 group text-left"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono-code font-bold text-[#00FF9D] bg-[#10B981]/20 px-1.5 py-0.2 rounded">
                  STEP 0{s.step}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#A7F3D0] group-hover:text-[#00FF9D] group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-bold text-xs text-white group-hover:text-[#00FF9D] transition-colors">
                {s.title}
              </h3>
              <p className="text-[11px] text-[#CBD5E1] leading-snug">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6 Key Architectural Innovations */}
      <div className="glass-panel p-5 rounded-2xl space-y-4">
        <h2 className="font-heading font-bold text-base text-white pb-2 border-b border-[#10B981]/20">
          Six Differentiating Technical Innovations
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {innovations.map((inv, idx) => {
            const Icon = inv.icon;
            return (
              <div key={idx} className="p-4 rounded-xl bg-[#071f16]/80 border border-[#10B981]/20 space-y-2 text-left">
                <div className="w-8 h-8 rounded-lg bg-[#10B981]/20 text-[#00FF9D] flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-xs text-white">{inv.title}</h3>
                <p className="text-[11px] text-[#E2E8F0] leading-relaxed">{inv.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Judge FAQs Accordion */}
      <div className="glass-panel p-5 rounded-2xl space-y-3">
        <h2 className="font-heading font-bold text-base text-white pb-2 border-b border-[#10B981]/20 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#00FF9D]" />
          <span>Judge Frequently Asked Questions</span>
        </h2>

        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#071f16]/80 border border-[#10B981]/20 cursor-pointer text-left transition-all hover:border-[#00FF9D]/60"
              onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
            >
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span>{faq.q}</span>
                <span className="text-[#00FF9D] font-black">{activeFaq === idx ? '−' : '+'}</span>
              </div>
              {activeFaq === idx && (
                <p className="text-xs text-[#E2E8F0] mt-2 leading-relaxed pt-2 border-t border-[#10B981]/15 animate-in fade-in font-medium">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
