import React from 'react';
import { 
  TrendingUp, 
  Activity, 
  Clock, 
  Layers, 
  AlertTriangle, 
  ShieldCheck, 
  Info,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';

export const RepeatIntelligence: React.FC = () => {
  const { incidents, activeSite } = useSafety();

  const hourlyTrends = [
    { hour: '07:00 AM', label: 'Shift Start', count: 5, alert: 'High Vest Infraction rate during site gate entry' },
    { hour: '09:00 AM', label: 'Morning Peak', count: 3, alert: 'Scaffolding elevated deck activity' },
    { hour: '11:00 AM', label: 'Pre-Lunch Rush', count: 4, alert: 'Excavation trench machine proximity' },
    { hour: '01:00 PM', label: 'Post-Lunch', count: 2, alert: 'Staging yard sorting' },
    { hour: '03:00 PM', label: 'Afternoon Fatigue', count: 6, alert: 'Highest hardhat detachment rate due to heat/fatigue' },
    { hour: '05:00 PM', label: 'Shift Handover', count: 2, alert: 'Perimeter lockup' },
  ];

  const recurringPatterns = [
    {
      category: 'Missing Helmet (Afternoon Shift)',
      location: 'Zone B — North Scaffolding',
      occurrences: 5,
      rootCause: 'Worker fatigue during 02:00–04:00 PM peak ambient temperatures causing workers to unclip chin straps.',
      preventiveAction: 'Institute mandatory 15-minute hydration shade break at 02:30 PM with chin-strap inspections.',
    },
    {
      category: 'Machine Exclusion Zone Breach',
      location: 'Zone A — Heavy Excavation Pit',
      occurrences: 4,
      rootCause: 'Lack of secondary physical barrier ribbons along trench edge during dynamic excavator repositioning.',
      preventiveAction: 'Deploy motorized wireless exclusion beacons that flash red when swing brake is disengaged.',
    },
    {
      category: 'Unreflective Dark Clothing at Twilight',
      location: 'Zone C — Precast Staging Yard',
      occurrences: 3,
      rootCause: 'Third-party delivery drivers arriving without mandated ANSI Class 2 high-vis garments.',
      preventiveAction: 'Equip site gatehouse with loaner high-vis vests and reject delivery flatbeds without vest compliance.',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl glass-panel-glow border-l-4 border-l-[#00FF9D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">
              Repeat-Violation Intelligence & Risk Patterns
            </h1>
            <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#10B981]/25 text-[#00FF9D] border border-[#00FF9D]/40 font-bold">
              ROOT-CAUSE CORRELATION
            </span>
          </div>
          <p className="text-xs text-[#E2E8F0] mt-1">
            Detect systemic contractor patterns across time-of-day, zone hazard levels, and shift cycles.
          </p>
        </div>

        <div className="text-xs text-[#A7F3D0] font-mono-code font-bold">
          BASED ON {incidents.length} HISTORICAL AUDIT RECORDS
        </div>
      </div>

      {/* Hourly Infraction Chronology */}
      <div className="glass-panel p-5 rounded-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#10B981]/20">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#00FF9D]" />
            <h2 className="font-heading font-bold text-sm text-white">Diurnal Violation Pattern (Time-of-Day)</h2>
          </div>
          <span className="text-[10px] font-mono-code text-[#FBBF24] font-bold">PEAK INFRACTIONS: 03:00 PM (FATIGUE WINDOW)</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-2">
          {hourlyTrends.map((h, i) => (
            <div key={i} className="p-3 rounded-xl bg-[#071f16]/90 border border-[#10B981]/20 text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono-code text-xs font-bold text-[#00FF9D]">{h.hour}</span>
                <span className={`text-[10px] font-mono-code font-bold px-1.5 rounded ${
                  h.count >= 5 ? 'bg-[#EF4444]/25 text-[#FF6B6B]' : 'bg-[#10B981]/25 text-[#00FF9D]'
                }`}>
                  {h.count} Alerts
                </span>
              </div>
              <div className="text-[11px] font-bold text-white">{h.label}</div>
              <p className="text-[10px] text-[#CBD5E1] leading-snug">{h.alert}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Repeat Violation Clusters & Root-Cause Remediation */}
      <div className="glass-panel p-5 rounded-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#10B981]/20">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-[#00FF9D]" />
            <h2 className="font-heading font-bold text-sm text-white">Top Recurring Risk Clusters & Root Causes</h2>
          </div>
          <span className="text-[10px] font-mono-code text-[#A7F3D0] font-bold">ACTIONABLE INTERVENTIONS</span>
        </div>

        <div className="space-y-4">
          {recurringPatterns.map((pat, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#071f16]/90 border border-[#10B981]/25 space-y-2.5 text-left"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-[#EF4444]/25 text-[#FF6B6B] font-mono-code text-xs font-bold flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <span className="font-heading font-bold text-sm text-white">{pat.category}</span>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="text-[#A7F3D0] font-semibold">{pat.location}</span>
                  <span className="px-2 py-0.5 rounded bg-[#EF4444]/25 text-[#FF6B6B] font-mono-code text-[10px] font-bold">
                    {pat.occurrences} Repeat Incidents
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-2.5 rounded-lg bg-[#04120c] border border-[#10B981]/20 text-white">
                  <span className="text-[10px] font-mono-code text-[#FBBF24] uppercase block mb-1 font-bold">
                    Hypothesized Root Cause
                  </span>
                  <p className="text-[11px] leading-relaxed text-[#E2E8F0]">{pat.rootCause}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-[#04120c] border border-[#10B981]/20 text-white">
                  <span className="text-[10px] font-mono-code text-[#00FF9D] uppercase block mb-1 font-bold">
                    Targeted Engineering Countermeasure
                  </span>
                  <p className="text-[11px] leading-relaxed text-[#E2E8F0]">{pat.preventiveAction}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ethical AI & Privacy Statement */}
      <div className="p-4 rounded-2xl glass-panel border border-[#10B981]/25 text-xs flex items-start space-x-3 text-white">
        <Info className="w-5 h-5 text-[#00FF9D] shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-white mb-0.5">Ethical AI & Privacy Safeguard Guarantee</div>
          <p className="text-[11px] leading-relaxed text-[#CBD5E1]">
            SiteSentinel AI analyzes occupational safety equipment and geometric hazard boundaries only. The platform deliberately avoids biometric facial recognition or worker identity de-anonymization to ensure full compliance with worker privacy rights and ethical AI safety standards.
          </p>
        </div>
      </div>
    </div>
  );
};
