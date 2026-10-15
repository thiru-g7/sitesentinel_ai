export type UserRole = 'admin' | 'supervisor' | 'viewer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  avatar: string;
  assignedSiteId: string;
}

export type HazardLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type IncidentStatus = 
  | 'New'
  | 'Pending Review'
  | 'Verified'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Rejected';

export type IncidentCategory = 
  | 'Missing Helmet'
  | 'Missing Vest'
  | 'Restricted Zone Breach'
  | 'Machinery Proximity'
  | 'Fall Hazard / Unhitched'
  | 'Overcrowded Slew Zone';

export interface DetectionBox {
  id: string;
  label: string;
  category: 'Worker' | 'Helmet' | 'Vest' | 'Missing_Helmet' | 'Missing_Vest' | 'Machinery' | 'Proximity_Hazard' | 'Zone_Breach';
  box_2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax] 0-1000
  confidence: number;
  status: 'Compliant' | 'Violation' | 'Warning';
  severity: 'None' | 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
}

export interface CorrectiveAction {
  id: string;
  description: string;
  assignedTo: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  dueDate: string;
  resolutionNotes?: string;
  completedAt?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  notes?: string;
}

export interface Incident {
  id: string;
  code: string;
  siteId: string;
  zoneId: string;
  zoneName: string;
  title: string;
  description: string;
  incidentType: IncidentCategory;
  severity: HazardLevel;
  priorityScore: number; // 0 - 100
  status: IncidentStatus;
  evidenceImageUrl: string;
  detections: DetectionBox[];
  reportedAt: string;
  updatedAt: string;
  assignedTo?: string;
  dueDate?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  correctiveActions: CorrectiveAction[];
  auditHistory: AuditLogEntry[];
  isDemoData: boolean;
}

export interface SiteZone {
  id: string;
  siteId: string;
  name: string;
  code: string;
  hazardLevel: HazardLevel;
  isRestricted: boolean;
  cameraIds: string[];
  description: string;
  polygon: { x: number; y: number }[]; // 0-100 percent
  activeAlertCount: number;
}

export interface ConstructionSite {
  id: string;
  name: string;
  code: string;
  location: string;
  status: 'Active' | 'Caution' | 'Halted';
  totalWorkersOnSite: number;
  activeCameras: number;
  complianceRate: number; // percentage
  zones: SiteZone[];
}

export interface CameraFeed {
  id: string;
  siteId: string;
  zoneId: string;
  name: string;
  locationLabel: string;
  sourceType: 'simulated' | 'webcam' | 'rtsp';
  status: 'online' | 'degraded' | 'offline';
  resolution: string;
  fps: number;
  lastDetection: string;
  threatLevel: HazardLevel;
  previewImage: string;
}

export interface SafetyRuleConfig {
  id: string;
  name: string;
  category: IncidentCategory;
  severity: HazardLevel;
  enabled: boolean;
  minConfidence: number; // e.g. 0.75
  autoEscalateMinutes: number;
  soundAlarm: boolean;
  description: string;
  triggerCount24h: number;
}

export interface SiteNotification {
  id: string;
  title: string;
  message: string;
  severity: HazardLevel;
  type: 'violation' | 'assignment' | 'zone' | 'resolution';
  incidentId?: string;
  read: boolean;
  timestamp: string;
}
