import React, { useState, useMemo } from 'react';
import { 
  AlertOctagon, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  Clock, 
  Calendar, 
  ShieldAlert, 
  Plus, 
  Check, 
  FileText, 
  History, 
  ChevronRight, 
  ArrowLeft,
  Eye,
  SlidersHorizontal,
  HardHat,
  AlertTriangle
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { Incident, IncidentStatus, HazardLevel, IncidentCategory } from '../../types';

interface IncidentManagerProps {
  initialSelectedId?: string;
  onNavigateToTab: (tabId: string, incidentId?: string) => void;
}

export const IncidentManager: React.FC<IncidentManagerProps> = ({ 
  initialSelectedId, 
  onNavigateToTab 
}) => {
  const { 
    incidents, 
    activeSite, 
    verifyIncident, 
    rejectIncident, 
    assignIncident, 
    updateIncidentStatus, 
    addCorrectiveAction, 
    updateCorrectiveActionStatus, 
    resolveIncident, 
    createIncidentFromAnalysis,
    currentUser 
  } = useSafety();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(initialSelectedId || null);

  // Sync initialSelectedId when navigating from other views
  React.useEffect(() => {
    if (initialSelectedId) {
      setSelectedIncidentId(initialSelectedId);
    }
  }, [initialSelectedId]);

  // Manual incident modal state
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [createTitle, setCreateTitle] = useState<string>('');
  const [createZoneId, setCreateZoneId] = useState<string>(activeSite.zones[0]?.id || '');
  const [createSeverity, setCreateSeverity] = useState<HazardLevel>('High');
  const [createDescription, setCreateDescription] = useState<string>('');

  // Rejection modal state
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [rejectionReasonInput, setRejectionReasonInput] = useState<string>('');

  // Assign modal state
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
  const [assigneeInput, setAssigneeInput] = useState<string>(currentUser.name);
  const [dueHoursInput, setDueHoursInput] = useState<number>(4);

  // New action input
  const [newActionDescription, setNewActionDescription] = useState<string>('');
  const [showAddAction, setShowAddAction] = useState<boolean>(false);

  // Resolution modal state
  const [showResolveModal, setShowResolveModal] = useState<boolean>(false);
  const [resolutionNotesInput, setResolutionNotesInput] = useState<string>('');

  // Filtered list
  const filteredIncidents = useMemo(() => {
    return incidents.filter(inc => {
      if (inc.siteId !== activeSite.id) return false;
      if (statusFilter !== 'all' && inc.status !== statusFilter) return false;
      if (severityFilter !== 'all' && inc.severity !== severityFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = inc.title.toLowerCase().includes(q);
        const matchCode = inc.code.toLowerCase().includes(q);
        const matchZone = inc.zoneName.toLowerCase().includes(q);
        const matchType = inc.incidentType.toLowerCase().includes(q);
        if (!matchTitle && !matchCode && !matchZone && !matchType) return false;
      }
      return true;
    });
  }, [incidents, activeSite.id, statusFilter, severityFilter, searchQuery]);

  const selectedIncident = useMemo(() => {
    if (!selectedIncidentId) return null;
    return incidents.find(inc => inc.id === selectedIncidentId) || null;
  }, [incidents, selectedIncidentId]);

  const handleConfirmReject = () => {
    if (!selectedIncidentId || !rejectionReasonInput.trim()) return;
    rejectIncident(selectedIncidentId, rejectionReasonInput.trim());
    setShowRejectModal(false);
    setRejectionReasonInput('');
  };

  const handleConfirmAssign = () => {
    if (!selectedIncidentId) return;
    const dueDate = new Date(Date.now() + dueHoursInput * 60 * 60 * 1000).toISOString();
    assignIncident(selectedIncidentId, assigneeInput, dueDate);
    setShowAssignModal(false);
  };

  const handleCreateAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncidentId || !newActionDescription.trim()) return;
    addCorrectiveAction(selectedIncidentId, {
      description: newActionDescription.trim(),
      assignedTo: currentUser.name,
      status: 'Pending',
      dueDate: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    });
    setNewActionDescription('');
    setShowAddAction(false);
  };

  const handleConfirmResolve = () => {
    if (!selectedIncidentId) return;
    resolveIncident(selectedIncidentId, resolutionNotesInput || 'All corrective actions completed and supervisor verified on-site.');
    setShowResolveModal(false);
    setResolutionNotesInput('');
  };

  const handleCreateManualIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createTitle.trim()) return;

    const newInc = createIncidentFromAnalysis({
      siteId: activeSite.id,
      zoneId: createZoneId || activeSite.zones[0]?.id || 'zone-scaffolding',
      title: createTitle.trim(),
      description: createDescription.trim() || 'Manual field safety observation recorded by supervisor.',
      severity: createSeverity,
      priorityScore: createSeverity === 'Critical' ? 90 : createSeverity === 'High' ? 75 : 55,
      evidenceImageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=1200&auto=format&fit=crop&q=80',
      detections: [],
    });

    setSelectedIncidentId(newInc.id);
    setShowCreateModal(false);
    setCreateTitle('');
    setCreateDescription('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="p-4 rounded-2xl glass-panel-glow border-l-4 border-l-[#00FF9D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">
              Incident Management & Verification
            </h1>
            <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#10B981]/25 text-[#00FF9D] border border-[#00FF9D]/40 font-bold">
              AUDIT TRAIL ENFORCED
            </span>
          </div>
          <p className="text-xs text-[#E2E8F0] mt-1">
            Supervisory review, root-cause verification, corrective action assignment, and audit history.
          </p>
        </div>

        {/* Search, Filter & Log Observation Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {currentUser.role !== 'viewer' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#10B981] via-[#00FF9D] to-[#34D399] text-[#04120c] font-black text-xs shadow-md shadow-[#10B981]/25 hover:brightness-110 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Observation</span>
            </button>
          )}

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#A7F3D0] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search code, zone, type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[#071f16] border border-[#10B981]/35 text-xs text-white focus:outline-none focus:border-[#00FF9D] w-44 sm:w-56 font-medium"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#071f16] border border-[#10B981]/35 text-xs text-white focus:outline-none cursor-pointer font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Verified">Verified</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#071f16] border border-[#10B981]/35 text-xs text-white focus:outline-none cursor-pointer font-medium"
          >
            <option value="all">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Incident List */}
        <div className={`${selectedIncident ? 'lg:col-span-5' : 'lg:col-span-12'} glass-panel p-4 rounded-2xl space-y-3`}>
          <div className="flex items-center justify-between pb-2 border-b border-[#10B981]/20 text-xs font-mono-code text-[#A7F3D0] font-bold">
            <span>{filteredIncidents.length} RECORDS FOUND</span>
            <span>SORT: BY PRIORITY SCORE</span>
          </div>

          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredIncidents.length === 0 ? (
              <div className="p-8 text-center text-xs text-white">
                No incidents matching active filters.
              </div>
            ) : (
              filteredIncidents.map((incident) => {
                const isSelected = selectedIncidentId === incident.id;
                return (
                  <div
                    key={incident.id}
                    onClick={() => setSelectedIncidentId(incident.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#10B981]/25 border-[#00FF9D] shadow-md shadow-[#10B981]/25'
                        : 'bg-[#071f16]/90 border-[#10B981]/20 hover:border-[#00FF9D]/60 hover:bg-[#0a291e]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono-code text-[11px] font-bold text-[#00FF9D]">{incident.code}</span>
                        <span className={`text-[9px] font-mono-code font-bold px-1.5 py-0.2 rounded uppercase ${
                          incident.severity === 'Critical' ? 'bg-[#EF4444]/25 text-[#FF6B6B] border border-[#EF4444]/50' :
                          incident.severity === 'High' ? 'bg-[#FBBF24]/25 text-[#FBBF24] border border-[#FBBF24]/50' :
                          'bg-[#00FF9D]/25 text-[#00FF9D]'
                        }`}>
                          {incident.severity}
                        </span>
                      </div>

                      <span className={`text-[9px] font-mono-code px-1.5 py-0.2 rounded font-bold ${
                        incident.status === 'Resolved' ? 'bg-[#00FF9D]/25 text-[#00FF9D]' :
                        incident.status === 'Rejected' ? 'bg-slate-700 text-slate-200' :
                        incident.status === 'Verified' ? 'bg-[#34D399]/25 text-[#00FF9D]' :
                        'bg-[#FBBF24]/25 text-[#FBBF24]'
                      }`}>
                        {incident.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-xs text-white mt-1.5 line-clamp-1">{incident.title}</h3>
                    <p className="text-[11px] text-[#CBD5E1] mt-0.5 line-clamp-1">{incident.zoneName}</p>

                    <div className="mt-2 pt-2 border-t border-[#10B981]/15 flex items-center justify-between text-[10px] text-white font-mono-code">
                      <span>Priority: <strong className="text-[#00FF9D]">{incident.priorityScore}/100</strong></span>
                      <span className="text-[#A7F3D0]">{new Date(incident.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Incident Detail Drawer */}
        {selectedIncident && (
          <div className="lg:col-span-7 glass-panel p-5 rounded-2xl space-y-5 animate-in fade-in">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#10B981]/20">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono-code text-xs font-bold text-[#00FF9D]">{selectedIncident.code}</span>
                  <span className={`text-[10px] font-mono-code font-bold px-2 py-0.5 rounded uppercase ${
                    selectedIncident.severity === 'Critical' ? 'bg-[#EF4444]/25 text-[#FF6B6B] border border-[#EF4444]/50' :
                    selectedIncident.severity === 'High' ? 'bg-[#FBBF24]/25 text-[#FBBF24] border border-[#FBBF24]/50' :
                    'bg-[#00FF9D]/25 text-[#00FF9D]'
                  }`}>
                    {selectedIncident.severity} Severity
                  </span>
                  <span className="text-[10px] font-mono-code text-white">
                    Priority Score: <strong className="text-[#00FF9D] font-bold">{selectedIncident.priorityScore}</strong>
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold font-heading text-white mt-1">
                  {selectedIncident.title}
                </h2>
                <div className="text-xs text-[#A7F3D0] mt-0.5">{selectedIncident.zoneName}</div>
              </div>

              <button
                onClick={() => setSelectedIncidentId(null)}
                className="text-slate-300 hover:text-white p-1 rounded hover:bg-[#071f16]"
                title="Close detail panel"
              >
                ✕
              </button>
            </div>

            {/* Evidence Image Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-white">
                <span className="font-semibold">Computer Vision Evidence Ingestion</span>
                <span className="font-mono-code text-[10px] text-[#00FF9D] font-bold">
                  {selectedIncident.detections?.length || 0} Detections Logged
                </span>
              </div>
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-900 border border-[#10B981]/35">
                <img
                  src={selectedIncident.evidenceImageUrl}
                  alt={selectedIncident.title}
                  className="w-full h-full object-cover"
                />
                {selectedIncident.detections?.map((d, i) => {
                  const [ymin, xmin, ymax, xmax] = d.box_2d;
                  return (
                    <div
                      key={i}
                      className="absolute border-2 border-[#EF4444] bg-[#EF4444]/20 rounded-sm pointer-events-none"
                      style={{
                        top: `${(ymin / 1000) * 100}%`,
                        left: `${(xmin / 1000) * 100}%`,
                        width: `${((xmax - xmin) / 1000) * 100}%`,
                        height: `${((ymax - ymin) / 1000) * 100}%`,
                      }}
                    >
                      <span className="absolute -top-4 left-0 bg-[#EF4444] text-white font-mono-code text-[8px] font-bold px-1 rounded">
                        {d.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Description & Triggering Rule */}
            <div className="p-3.5 rounded-xl bg-[#071f16]/90 border border-[#10B981]/25 space-y-2">
              <div className="text-[10px] font-mono-code text-[#00FF9D] uppercase font-bold">
                Triggered Rule & Incident Narrative
              </div>
              <p className="text-xs text-white leading-relaxed font-medium">
                {selectedIncident.description}
              </p>
              <div className="pt-2 border-t border-[#10B981]/15 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono-code text-[#A7F3D0]">
                <span>Reported: {new Date(selectedIncident.reportedAt).toLocaleString()}</span>
                {selectedIncident.verifiedBy && (
                  <span className="text-[#00FF9D] font-bold">Verified by: {selectedIncident.verifiedBy}</span>
                )}
                {selectedIncident.rejectionReason && (
                  <span className="text-rose-300">Rejected: {selectedIncident.rejectionReason}</span>
                )}
              </div>
            </div>

            {/* Supervisor Action Bar or Viewer Notice */}
            {currentUser.role === 'viewer' && selectedIncident.status !== 'Resolved' && selectedIncident.status !== 'Rejected' && (
              <div className="p-3 rounded-xl bg-[#071f16] border border-[#10B981]/30 text-xs text-[#A7F3D0] flex items-center gap-2 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#00FF9D]" />
                <span>Read-Only Viewer Access: Verification and resolution actions require Supervisor or Admin role.</span>
              </div>
            )}

            {currentUser.role !== 'viewer' && selectedIncident.status !== 'Resolved' && selectedIncident.status !== 'Rejected' && (
              <div className="p-3 rounded-xl bg-[#071f16] border border-[#10B981]/35 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-white">Supervisor Actions:</span>
                <div className="flex flex-wrap items-center gap-2">
                  {selectedIncident.status === 'Pending Review' && (
                    <>
                      <button
                        onClick={() => verifyIncident(selectedIncident.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#00FF9D] text-[#04120c] font-black text-xs hover:bg-[#34D399] transition-all flex items-center gap-1.5 shadow-md shadow-[#00FF9D]/20"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verify Incident</span>
                      </button>

                      <button
                        onClick={() => setShowRejectModal(true)}
                        className="px-3 py-1.5 rounded-lg bg-[#EF4444]/25 border border-[#EF4444]/60 text-white hover:bg-[#EF4444]/40 text-xs font-bold flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5 text-[#FF6B6B]" />
                        <span>Reject Alert</span>
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => setShowAssignModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-[#10B981]/25 border border-[#10B981]/60 text-white hover:border-[#00FF9D] text-xs font-bold flex items-center gap-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-[#00FF9D]" />
                    <span>Assign Supervisor</span>
                  </button>

                  <button
                    onClick={() => setShowResolveModal(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#10B981] via-[#00FF9D] to-[#34D399] text-[#04120c] text-xs font-black shadow-md shadow-[#00FF9D]/25 hover:brightness-110 flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Resolve & Close</span>
                  </button>
                </div>
              </div>
            )}

            {/* Corrective Actions Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#00FF9D]" />
                  <span>Corrective Action Tasks ({selectedIncident.correctiveActions?.length || 0})</span>
                </h3>
                {currentUser.role !== 'viewer' && (
                  <button
                    onClick={() => setShowAddAction(!showAddAction)}
                    className="text-xs text-[#00FF9D] hover:underline flex items-center gap-1 font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Task</span>
                  </button>
                )}
              </div>

              {showAddAction && (
                <form onSubmit={handleCreateAction} className="p-3 rounded-xl bg-[#04120c] border border-[#10B981]/35 space-y-2">
                  <input
                    type="text"
                    placeholder="e.g., Provide Class 2 reflective vests to logistics crew"
                    value={newActionDescription}
                    onChange={(e) => setNewActionDescription(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#071f16] border border-[#10B981]/30 text-xs text-white focus:outline-none"
                    autoFocus
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowAddAction(false)}
                      className="px-2.5 py-1 text-xs text-slate-300 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 rounded-lg bg-[#00FF9D] text-[#04120c] font-black text-xs hover:brightness-110"
                    >
                      Save Task
                    </button>
                  </div>
                </form>
              )}

              {/* Actions list */}
              <div className="space-y-2">
                {selectedIncident.correctiveActions?.length === 0 ? (
                  <div className="text-xs text-white p-3 rounded-xl bg-[#071f16]/60 border border-[#10B981]/15">
                    No corrective actions assigned yet.
                  </div>
                ) : (
                  selectedIncident.correctiveActions.map((action) => (
                    <div
                      key={action.id}
                      className="p-3 rounded-xl bg-[#071f16]/90 border border-[#10B981]/25 flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="text-xs text-white font-bold">{action.description}</div>
                        <div className="text-[10px] text-[#A7F3D0] font-mono-code mt-1 flex items-center gap-2">
                          <span>Assigned: {action.assignedTo}</span>
                          <span>•</span>
                          <span>Due: {new Date(action.dueDate).toLocaleDateString()}</span>
                        </div>
                        {action.resolutionNotes && (
                          <div className="text-[10px] text-[#00FF9D] mt-1 bg-[#10B981]/15 px-2 py-0.5 rounded font-semibold">
                            Resolution proof: {action.resolutionNotes}
                          </div>
                        )}
                      </div>

                      {currentUser.role !== 'viewer' && (
                        <button
                          onClick={() => {
                            const next = action.status === 'Completed' ? 'Pending' : 'Completed';
                            updateCorrectiveActionStatus(
                              selectedIncident.id, 
                              action.id, 
                              next, 
                              next === 'Completed' ? 'Verified completed by site supervisor' : undefined
                            );
                          }}
                          className={`px-2.5 py-1 rounded text-[10px] font-mono-code font-black transition-all shrink-0 ${
                            action.status === 'Completed'
                              ? 'bg-[#00FF9D]/30 text-[#00FF9D] border border-[#00FF9D]'
                              : 'bg-[#FBBF24]/25 text-[#FBBF24] border border-[#FBBF24]/50 hover:bg-[#00FF9D]/20 hover:text-[#00FF9D]'
                          }`}
                        >
                          {action.status === 'Completed' ? '✓ Completed' : 'Mark Done'}
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Audit History Log */}
            <div className="space-y-2 pt-2 border-t border-[#10B981]/20">
              <h3 className="font-heading font-bold text-xs text-white flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-[#00FF9D]" />
                <span>Chain of Custody & Audit Log</span>
              </h3>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {selectedIncident.auditHistory?.map((log) => (
                  <div key={log.id} className="p-2 rounded-lg bg-[#04120c]/70 border border-[#10B981]/15 text-[10px] font-mono-code">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-[#00FF9D] font-bold">{log.action}</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-white mt-0.5 font-semibold">{log.actorName} ({log.actorRole})</div>
                    {log.notes && <div className="text-[#A7F3D0] mt-0.5 italic">{log.notes}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="max-w-md w-full rounded-2xl glass-panel-glow p-5 border border-[#EF4444]/50 space-y-4">
            <div className="flex items-center space-x-2 text-[#EF4444]">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-heading font-bold text-base text-white">Reject Alert as False Positive</h3>
            </div>
            <p className="text-xs text-[#E2E8F0]">
              Per SiteSentinel compliance guidelines, rejecting an optical detection requires a documented operational justification.
            </p>
            <textarea
              rows={3}
              placeholder="e.g., Driver was seated inside enclosed, stationary cab with no overhead fall risk."
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#04120c] border border-[#10B981]/35 text-xs text-white focus:outline-none"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={!rejectionReasonInput.trim()}
                className="px-4 py-1.5 rounded-lg bg-[#EF4444] text-white font-bold text-xs hover:brightness-110 disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="max-w-md w-full rounded-2xl glass-panel-glow p-5 border border-[#10B981]/50 space-y-4">
            <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#00FF9D]" />
              <span>Assign Incident to Field Supervisor</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#A7F3D0] block mb-1 font-semibold">Supervisor Name:</label>
                <input
                  type="text"
                  value={assigneeInput}
                  onChange={(e) => setAssigneeInput(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#04120c] border border-[#10B981]/35 text-white font-medium"
                />
              </div>
              <div>
                <label className="text-[#A7F3D0] block mb-1 font-semibold">Resolution SLA (Hours):</label>
                <select
                  value={dueHoursInput}
                  onChange={(e) => setDueHoursInput(parseInt(e.target.value))}
                  className="w-full p-2 rounded-lg bg-[#04120c] border border-[#10B981]/35 text-white font-medium"
                >
                  <option value={1}>1 Hour (Emergency)</option>
                  <option value={2}>2 Hours (Critical)</option>
                  <option value={4}>4 Hours (Standard Shift)</option>
                  <option value={8}>8 Hours (End of Day)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssign}
                className="px-4 py-1.5 rounded-lg bg-[#00FF9D] text-[#04120c] font-black text-xs hover:brightness-110"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="max-w-md w-full rounded-2xl glass-panel-glow p-5 border border-[#00FF9D]/60 space-y-4">
            <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#00FF9D]" />
              <span>Sign Off & Resolve Incident</span>
            </h3>
            <p className="text-xs text-[#E2E8F0]">
              Provide photographic inspection confirmation or notes on how the hazard was permanently mitigated.
            </p>
            <textarea
              rows={3}
              placeholder="e.g., Worker issued certified helmet with chin strap. Toolbox safety talk completed with crew."
              value={resolutionNotesInput}
              onChange={(e) => setResolutionNotesInput(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#04120c] border border-[#10B981]/35 text-xs text-white focus:outline-none"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowResolveModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResolve}
                className="px-4 py-1.5 rounded-lg bg-[#00FF9D] text-[#04120c] font-black text-xs hover:brightness-110"
              >
                Verify & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Observation / Incident Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <form onSubmit={handleCreateManualIncident} className="max-w-md w-full rounded-2xl glass-panel-glow p-5 border border-[#00FF9D]/60 space-y-4">
            <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#00FF9D]" />
              <span>Log On-Site Hazard Observation</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#A7F3D0] block mb-1 font-semibold">Incident / Hazard Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Unsecured perimeter guardrail or missing chin strap"
                  value={createTitle}
                  onChange={(e) => setCreateTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#04120c] border border-[#10B981]/35 text-white font-medium focus:outline-none focus:border-[#00FF9D]"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#A7F3D0] block mb-1 font-semibold">Site Zone:</label>
                  <select
                    value={createZoneId}
                    onChange={(e) => setCreateZoneId(e.target.value)}
                    className="w-full p-2 rounded-lg bg-[#04120c] border border-[#10B981]/35 text-white font-medium focus:outline-none"
                  >
                    {activeSite.zones.map(z => (
                      <option key={z.id} value={z.id}>{z.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[#A7F3D0] block mb-1 font-semibold">Severity:</label>
                  <select
                    value={createSeverity}
                    onChange={(e) => setCreateSeverity(e.target.value as HazardLevel)}
                    className="w-full p-2 rounded-lg bg-[#04120c] border border-[#10B981]/35 text-white font-medium focus:outline-none"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#A7F3D0] block mb-1 font-semibold">Description & Corrective Action Context:</label>
                <textarea
                  rows={3}
                  placeholder="Provide context regarding the observed condition and any immediate verbal directions given."
                  value={createDescription}
                  onChange={(e) => setCreateDescription(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#04120c] border border-[#10B981]/35 text-white font-medium focus:outline-none focus:border-[#00FF9D]"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#10B981] via-[#00FF9D] to-[#34D399] text-[#04120c] font-black text-xs hover:brightness-110"
              >
                Create Incident
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
