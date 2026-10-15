import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  ShieldCheck, 
  Building2,
  FileText
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { SiteSentinelLogo } from '../common/SiteSentinelLogo';
import confetti from 'canvas-confetti';

export const ReportsManager: React.FC = () => {
  const { incidents, activeSite, kpis } = useSafety();
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const handleExportCSV = () => {
    const headers = [
      'Incident Code',
      'Site Name',
      'Zone Name',
      'Title',
      'Category',
      'Severity',
      'Priority Score',
      'Status',
      'Reported At',
      'Verified By',
      'Corrective Actions Count',
    ];

    const rows = incidents.map(inc => [
      `"${inc.code}"`,
      `"${activeSite.name}"`,
      `"${inc.zoneName}"`,
      `"${inc.title.replace(/"/g, '""')}"`,
      `"${inc.incidentType}"`,
      `"${inc.severity}"`,
      inc.priorityScore,
      `"${inc.status}"`,
      `"${inc.reportedAt}"`,
      `"${inc.verifiedBy || 'N/A'}"`,
      inc.correctiveActions?.length || 0,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SiteSentinel_${activeSite.code}_Audit_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    try {
      confetti({
        particleCount: 30,
        spread: 50,
        colors: ['#00FF9D', '#10B981'],
      });
    } catch {}

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl glass-panel-glow border-l-4 border-l-[#00FF9D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">
              Safety Compliance Reports & Data Exports
            </h1>
            <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#10B981]/25 text-[#00FF9D] border border-[#00FF9D]/40 font-bold">
              ISO 45001 AUDIT READY
            </span>
          </div>
          <p className="text-xs text-[#E2E8F0] mt-1">
            Generate verifiable safety audit scorecards, OSHA records, and downloadable CSV incident tables.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="px-3 py-2 rounded-xl bg-[#071f16] border border-[#10B981]/40 text-xs text-white hover:bg-[#0a291e] hover:border-[#00FF9D] transition-all flex items-center gap-1.5 font-semibold"
          >
            <Printer className="w-3.5 h-3.5 text-[#00FF9D]" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#10B981] via-[#00FF9D] to-[#34D399] text-[#04120c] font-black text-xs shadow-lg shadow-[#10B981]/30 hover:brightness-110 transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadSuccess ? 'Downloaded CSV!' : 'Export Incident CSV'}</span>
          </button>
        </div>
      </div>

      {/* Printable Executive Summary Card */}
      <div className="glass-panel p-6 rounded-2xl space-y-6 print:bg-white print:text-black">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#10B981]/20 gap-4">
          <div className="flex items-start space-x-3.5">
            <SiteSentinelLogo size="md" />
            <div>
              <div className="text-xs font-mono-code text-[#00FF9D] uppercase font-bold">Site Compliance Audit Certificate</div>
              <h2 className="text-lg sm:text-xl font-bold font-heading text-white mt-0.5">
                {activeSite.name}
              </h2>
              <div className="text-xs text-[#A7F3D0] mt-0.5 font-medium">
                Code: {activeSite.code} • Generated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#071f16] border border-[#10B981]/35 text-right font-mono-code">
            <div className="text-[10px] text-[#A7F3D0] font-bold">OVERALL COMPLIANCE SCORE</div>
            <div className="text-2xl font-bold font-heading text-[#00FF9D]">{kpis.complianceRate}%</div>
          </div>
        </div>

        {/* Audit Metric Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-[#071f16]/90 border border-[#10B981]/20">
            <span className="text-[10px] font-mono-code text-[#A7F3D0] font-bold">TOTAL REPORTED</span>
            <div className="text-xl font-bold font-heading text-white mt-1">{kpis.totalIncidents}</div>
            <div className="text-[10px] text-white mt-0.5">All optical alerts logged</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#071f16]/90 border border-[#10B981]/20">
            <span className="text-[10px] font-mono-code text-[#00FF9D] font-bold">VERIFIED INCIDENTS</span>
            <div className="text-xl font-bold font-heading text-[#00FF9D] mt-1">{kpis.resolved + kpis.pendingReview}</div>
            <div className="text-[10px] text-white mt-0.5">Confirmed by supervisor</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#071f16]/90 border border-[#10B981]/20">
            <span className="text-[10px] font-mono-code text-[#EF4444] font-bold">CRITICAL INCIDENTS</span>
            <div className="text-xl font-bold font-heading text-[#FF6B6B] mt-1">{kpis.highAndCritical}</div>
            <div className="text-[10px] text-white mt-0.5">Priority score &gt; 80</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#071f16]/90 border border-[#10B981]/20">
            <span className="text-[10px] font-mono-code text-[#A7F3D0] font-bold">FALSE POSITIVES</span>
            <div className="text-xl font-bold font-heading text-white mt-1">
              {incidents.filter(i => i.status === 'Rejected').length}
            </div>
            <div className="text-[10px] text-white mt-0.5">Rejected with reasons</div>
          </div>
        </div>

        {/* Detailed Incidents Audit Table */}
        <div className="space-y-3">
          <h3 className="font-heading font-bold text-sm text-white">Authorized Incident Records</h3>
          <div className="overflow-x-auto rounded-xl border border-[#10B981]/25">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#071f16] border-b border-[#10B981]/25 font-mono-code text-[11px] text-[#00FF9D]">
                <tr>
                  <th className="p-3">Code</th>
                  <th className="p-3">Zone</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Supervisor Sign-Off</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#10B981]/15 bg-[#04120c]/70 text-white font-medium">
                {incidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-[#071f16]/90">
                    <td className="p-3 font-mono-code text-[#00FF9D] font-bold">{inc.code}</td>
                    <td className="p-3 text-white">{inc.zoneName}</td>
                    <td className="p-3 text-white font-bold">{inc.incidentType}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold ${
                        inc.severity === 'Critical' ? 'bg-[#EF4444]/25 text-[#FF6B6B]' :
                        inc.severity === 'High' ? 'bg-[#FBBF24]/25 text-[#FBBF24]' : 'bg-[#00FF9D]/25 text-[#00FF9D]'
                      }`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td className="p-3 font-mono-code text-[#00FF9D] font-bold">{inc.priorityScore}/100</td>
                    <td className="p-3">
                      <span className="text-[10px] font-mono-code text-white font-semibold">{inc.status}</span>
                    </td>
                    <td className="p-3 text-[#A7F3D0] font-mono-code">
                      {inc.verifiedBy || (inc.status === 'Rejected' ? 'Rejected' : 'Pending')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
