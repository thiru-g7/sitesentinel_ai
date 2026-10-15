import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Incident, 
  ConstructionSite, 
  CameraFeed, 
  SafetyRuleConfig, 
  SiteNotification, 
  UserProfile, 
  UserRole,
  IncidentStatus,
  HazardLevel,
  SiteZone,
  CorrectiveAction,
  DetectionBox
} from '../types';
import { 
  INITIAL_SITES, 
  INITIAL_INCIDENTS, 
  INITIAL_CAMERAS, 
  INITIAL_SAFETY_RULES, 
  INITIAL_NOTIFICATIONS, 
  DEMO_USERS 
} from '../data/seedData';
import confetti from 'canvas-confetti';

interface SafetyContextType {
  currentUser: UserProfile;
  switchUser: (role: UserRole) => void;
  sites: ConstructionSite[];
  activeSite: ConstructionSite;
  setActiveSiteId: (id: string) => void;
  incidents: Incident[];
  cameras: CameraFeed[];
  rules: SafetyRuleConfig[];
  notifications: SiteNotification[];
  unreadNotificationCount: number;
  
  // Incident Operations
  createIncidentFromAnalysis: (data: {
    siteId: string;
    zoneId: string;
    title: string;
    description: string;
    severity: HazardLevel;
    priorityScore: number;
    evidenceImageUrl: string;
    detections: DetectionBox[];
  }) => Incident;
  verifyIncident: (incidentId: string, notes?: string) => void;
  rejectIncident: (incidentId: string, reason: string) => void;
  assignIncident: (incidentId: string, assignee: string, dueDate: string) => void;
  updateIncidentStatus: (incidentId: string, status: IncidentStatus, notes?: string) => void;
  addCorrectiveAction: (incidentId: string, action: Omit<CorrectiveAction, 'id'>) => void;
  updateCorrectiveActionStatus: (incidentId: string, actionId: string, status: 'Pending' | 'In Progress' | 'Completed', resolutionNotes?: string) => void;
  resolveIncident: (incidentId: string, notes: string) => void;
  
  // Rules and Zones
  toggleRule: (ruleId: string) => void;
  addZone: (siteId: string, zone: Omit<SiteZone, 'id' | 'siteId' | 'activeAlertCount'>) => void;
  updateZone: (zoneId: string, updates: Partial<SiteZone>) => void;
  deleteZone: (zoneId: string) => void;
  
  // Camera controls
  updateCameraStatus: (cameraId: string, status: 'online' | 'degraded' | 'offline') => void;
  
  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotification: (id: string) => void;
  
  // Audio & Tactile feedback
  audioEnabled: boolean;
  setAudioEnabled: (val: boolean) => void;
  playAlertSound: (severity?: HazardLevel) => void;
  
  // Reset demo
  resetDemoData: () => void;
  
  // Computed KPIs
  kpis: {
    totalIncidents: number;
    pendingReview: number;
    highAndCritical: number;
    resolved: number;
    complianceRate: number;
    avgResolutionTimeHours: number;
    activeViolationsCount: number;
  };
}

const STORAGE_KEYS = {
  INCIDENTS: 'sitesentinel_incidents_v2',
  SITES: 'sitesentinel_sites_v2',
  CAMERAS: 'sitesentinel_cameras_v2',
  RULES: 'sitesentinel_rules_v2',
  NOTIFICATIONS: 'sitesentinel_notifications_v2',
  ROLE: 'sitesentinel_active_role_v2',
  AUDIO: 'sitesentinel_audio_enabled_v2',
};

const SafetyContext = createContext<SafetyContextType | undefined>(undefined);

export const SafetyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User Profile
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved as UserRole) || 'admin';
  });

  const currentUser = useMemo(() => {
    return DEMO_USERS.find(u => u.role === currentRole) || DEMO_USERS[0];
  }, [currentRole]);

  const switchUser = (role: UserRole) => {
    setCurrentRole(role);
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  };

  // Audio preference
  const [audioEnabled, setAudioEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIO);
    return saved !== null ? saved === 'true' : true;
  });

  const handleSetAudio = (val: boolean) => {
    setAudioEnabled(val);
    localStorage.setItem(STORAGE_KEYS.AUDIO, String(val));
  };

  // Synthesized Web Audio Sound Chime (clean, futuristic cyber audio feedback)
  const playAlertSound = useCallback((severity: HazardLevel = 'Medium') => {
    if (!audioEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (severity === 'Critical') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.3);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (severity === 'High') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now);
        osc.frequency.setValueAtTime(783.99, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      }
    } catch {
      // Audio autoplay policy catch
    }
  }, [audioEnabled]);

  // Sites state
  const [sites, setSites] = useState<ConstructionSite[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SITES);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_SITES;
  });

  const [activeSiteId, setActiveSiteId] = useState<string>('site-apex-01');
  const activeSite = useMemo(() => {
    return sites.find(s => s.id === activeSiteId) || sites[0] || INITIAL_SITES[0];
  }, [sites, activeSiteId]);

  // Incidents state
  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_INCIDENTS;
  });

  // Cameras state
  const [cameras, setCameras] = useState<CameraFeed[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CAMERAS);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_CAMERAS;
  });

  // Safety Rules
  const [rules, setRules] = useState<SafetyRuleConfig[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RULES);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_SAFETY_RULES;
  });

  // Notifications
  const [notifications, setNotifications] = useState<SiteNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Persist changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SITES, JSON.stringify(sites));
  }, [sites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CAMERAS, JSON.stringify(cameras));
  }, [cameras]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Calculate real KPIs from incident records
  const kpis = useMemo(() => {
    const siteIncidents = incidents.filter(inc => inc.siteId === activeSite.id);
    const total = siteIncidents.length;
    const pending = siteIncidents.filter(inc => inc.status === 'Pending Review' || inc.status === 'New').length;
    const highAndCritical = siteIncidents.filter(inc => (inc.severity === 'Critical' || inc.severity === 'High') && inc.status !== 'Resolved' && inc.status !== 'Rejected').length;
    const resolved = siteIncidents.filter(inc => inc.status === 'Resolved').length;
    const activeViolationsCount = siteIncidents.filter(inc => inc.status !== 'Resolved' && inc.status !== 'Rejected').length;

    // Calculation of compliance rate
    // Benchmark 100 - (penalty per active violation)
    const penalty = activeViolationsCount * 2.8;
    const complianceRate = Math.max(55, Math.min(99.5, Number((98.5 - penalty).toFixed(1))));

    // Average resolution time (hours) calculated from resolved incidents
    const resolvedIncidents = siteIncidents.filter(inc => inc.status === 'Resolved');
    let avgHours = 2.4;
    if (resolvedIncidents.length > 0) {
      const totalHours = resolvedIncidents.reduce((acc, inc) => {
        const start = new Date(inc.reportedAt).getTime();
        const end = new Date(inc.updatedAt).getTime();
        const diffHours = Math.max(0.2, (end - start) / (1000 * 60 * 60));
        return acc + diffHours;
      }, 0);
      avgHours = Number((totalHours / resolvedIncidents.length).toFixed(1));
    }

    return {
      totalIncidents: total,
      pendingReview: pending,
      highAndCritical,
      resolved,
      complianceRate,
      avgResolutionTimeHours: avgHours,
      activeViolationsCount,
    };
  }, [incidents, activeSite.id]);

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // Create incident from AI Vision
  const createIncidentFromAnalysis = (data: {
    siteId: string;
    zoneId: string;
    title: string;
    description: string;
    severity: HazardLevel;
    priorityScore: number;
    evidenceImageUrl: string;
    detections: DetectionBox[];
  }): Incident => {
    const codeNumber = incidents.length + 401;
    const zone = activeSite.zones.find(z => z.id === data.zoneId);

    const newIncident: Incident = {
      id: `inc-${Date.now()}`,
      code: `INC-${codeNumber}`,
      siteId: data.siteId,
      zoneId: data.zoneId,
      zoneName: zone ? zone.name : 'Active Site Zone',
      title: data.title,
      description: data.description,
      incidentType: data.title.includes('Helmet') 
        ? 'Missing Helmet' 
        : data.title.includes('Vest') 
        ? 'Missing Vest' 
        : data.title.includes('Proximity') 
        ? 'Machinery Proximity' 
        : 'Restricted Zone Breach',
      severity: data.severity,
      priorityScore: data.priorityScore,
      status: 'Pending Review',
      evidenceImageUrl: data.evidenceImageUrl,
      detections: data.detections,
      reportedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: currentUser.role === 'supervisor' ? currentUser.name : 'Marcus Vance',
      dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      correctiveActions: [
        {
          id: `ca-${Date.now()}-1`,
          description: `Conduct on-site inspection for ${data.title} and enforce mandatory PPE protocol.`,
          assignedTo: currentUser.role === 'supervisor' ? currentUser.name : 'Marcus Vance',
          status: 'Pending',
          dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        },
      ],
      auditHistory: [
        {
          id: `aud-${Date.now()}-1`,
          timestamp: new Date().toISOString(),
          actorName: `${currentUser.name} (${currentUser.title})`,
          actorRole: currentUser.role,
          action: 'Candidate Incident Submitted via AI Vision Lab',
          notes: `Recorded with ${data.detections.length} bounding box annotations.`,
        },
      ],
      isDemoData: true,
    };

    setIncidents(prev => [newIncident, ...prev]);

    // Background sync to server store
    fetch('/api/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newIncident),
    }).catch(() => {});

    // Create Notification
    const newNotif: SiteNotification = {
      id: `notif-${Date.now()}`,
      title: `${data.severity.toUpperCase()} ALERT: ${data.title}`,
      message: `New candidate incident logged in ${newIncident.zoneName}. Awaiting supervisor verification.`,
      severity: data.severity,
      type: 'violation',
      incidentId: newIncident.id,
      read: false,
      timestamp: 'Just now',
    };
    setNotifications(prev => [newNotif, ...prev]);

    playAlertSound(data.severity);

    return newIncident;
  };

  // Supervisor verification
  const verifyIncident = (incidentId: string, notes?: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        const updated: Incident = {
          ...inc,
          status: 'Verified',
          verifiedBy: currentUser.name,
          updatedAt: new Date().toISOString(),
          auditHistory: [
            ...inc.auditHistory,
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              actorName: currentUser.name,
              actorRole: currentUser.role,
              action: 'Incident Verified',
              notes: notes || 'Supervisor verified optical evidence and hazard violation.',
            },
          ],
        };
        return updated;
      }
      return inc;
    }));

    // Background sync to server
    fetch(`/api/incidents/${incidentId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes, verifiedBy: currentUser.name }),
    }).catch(() => {});

    // Notification
    const newNotif: SiteNotification = {
      id: `notif-${Date.now()}`,
      title: `Incident Verified`,
      message: `${currentUser.name} verified incident ${incidentId}. Corrective actions initiated.`,
      severity: 'High',
      type: 'assignment',
      incidentId,
      read: false,
      timestamp: 'Just now',
    };
    setNotifications(prev => [newNotif, ...prev]);
    playAlertSound('High');
  };

  // Reject / False Positive
  const rejectIncident = (incidentId: string, reason: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'Rejected',
          rejectionReason: reason,
          updatedAt: new Date().toISOString(),
          auditHistory: [
            ...inc.auditHistory,
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              actorName: currentUser.name,
              actorRole: currentUser.role,
              action: 'Alert Rejected (False Positive)',
              notes: `Reason: ${reason}`,
            },
          ],
        };
      }
      return inc;
    }));

    fetch(`/api/incidents/${incidentId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason, rejectedBy: currentUser.name }),
    }).catch(() => {});
  };

  // Assign
  const assignIncident = (incidentId: string, assignee: string, dueDate: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          assignedTo: assignee,
          dueDate,
          status: inc.status === 'New' || inc.status === 'Pending Review' ? 'Assigned' : inc.status,
          updatedAt: new Date().toISOString(),
          auditHistory: [
            ...inc.auditHistory,
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              actorName: currentUser.name,
              actorRole: currentUser.role,
              action: `Incident Assigned to ${assignee}`,
              notes: `Target completion deadline: ${new Date(dueDate).toLocaleString()}`,
            },
          ],
        };
      }
      return inc;
    }));

    fetch(`/api/incidents/${incidentId}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignee, dueDate }),
    }).catch(() => {});
  };

  // Status update
  const updateIncidentStatus = (incidentId: string, status: IncidentStatus, notes?: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status,
          updatedAt: new Date().toISOString(),
          auditHistory: [
            ...inc.auditHistory,
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              actorName: currentUser.name,
              actorRole: currentUser.role,
              action: `Status Updated to ${status}`,
              notes,
            },
          ],
        };
      }
      return inc;
    }));

    fetch(`/api/incidents/${incidentId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes, actor: currentUser.name }),
    }).catch(() => {});
  };

  // Add corrective action
  const addCorrectiveAction = (incidentId: string, action: Omit<CorrectiveAction, 'id'>) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        const newAction: CorrectiveAction = {
          ...action,
          id: `ca-${Date.now()}`,
        };
        return {
          ...inc,
          correctiveActions: [...inc.correctiveActions, newAction],
          updatedAt: new Date().toISOString(),
          auditHistory: [
            ...inc.auditHistory,
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              actorName: currentUser.name,
              actorRole: currentUser.role,
              action: 'Corrective Action Created',
              notes: action.description,
            },
          ],
        };
      }
      return inc;
    }));

    fetch(`/api/incidents/${incidentId}/actions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action),
    }).catch(() => {});
  };

  // Update action
  const updateCorrectiveActionStatus = (
    incidentId: string, 
    actionId: string, 
    status: 'Pending' | 'In Progress' | 'Completed', 
    resolutionNotes?: string
  ) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        const updatedActions = inc.correctiveActions.map(act => {
          if (act.id === actionId) {
            return {
              ...act,
              status,
              resolutionNotes: resolutionNotes || act.resolutionNotes,
              completedAt: status === 'Completed' ? new Date().toISOString() : undefined,
            };
          }
          return act;
        });

        return {
          ...inc,
          correctiveActions: updatedActions,
          updatedAt: new Date().toISOString(),
        };
      }
      return inc;
    }));
  };

  // Resolve incident
  const resolveIncident = (incidentId: string, notes: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'Resolved',
          updatedAt: new Date().toISOString(),
          correctiveActions: inc.correctiveActions.map(act => ({
            ...act,
            status: 'Completed',
            completedAt: act.completedAt || new Date().toISOString(),
          })),
          auditHistory: [
            ...inc.auditHistory,
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              actorName: currentUser.name,
              actorRole: currentUser.role,
              action: 'Incident Resolved & Closed',
              notes,
            },
          ],
        };
      }
      return inc;
    }));

    fetch(`/api/incidents/${incidentId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes, resolvedBy: currentUser.name }),
    }).catch(() => {});

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#00FF9D', '#10B981', '#FFFFFF'],
      });
    } catch {}

    const newNotif: SiteNotification = {
      id: `notif-${Date.now()}`,
      title: 'Incident Resolved',
      message: `Incident ${incidentId} was closed with supervisor sign-off.`,
      severity: 'Low',
      type: 'resolution',
      incidentId,
      read: false,
      timestamp: 'Just now',
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Toggle rule
  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(r => {
      if (r.id === ruleId) {
        return { ...r, enabled: !r.enabled };
      }
      return r;
    }));
  };

  // Add Zone
  const addZone = (siteId: string, zoneData: Omit<SiteZone, 'id' | 'siteId' | 'activeAlertCount'>) => {
    const newZone: SiteZone = {
      ...zoneData,
      id: `zone-${Date.now()}`,
      siteId,
      activeAlertCount: 0,
    };
    setSites(prev => prev.map(s => {
      if (s.id === siteId) {
        return {
          ...s,
          zones: [...s.zones, newZone],
        };
      }
      return s;
    }));
  };

  // Update Zone
  const updateZone = (zoneId: string, updates: Partial<SiteZone>) => {
    setSites(prev => prev.map(s => {
      return {
        ...s,
        zones: s.zones.map(z => z.id === zoneId ? { ...z, ...updates } : z),
      };
    }));
  };

  // Delete Zone
  const deleteZone = (zoneId: string) => {
    setSites(prev => prev.map(s => {
      return {
        ...s,
        zones: s.zones.filter(z => z.id !== zoneId),
      };
    }));
  };

  // Camera update
  const updateCameraStatus = (cameraId: string, status: 'online' | 'degraded' | 'offline') => {
    setCameras(prev => prev.map(c => {
      if (c.id === cameraId) {
        return { ...c, status, lastPing: 'Just now' };
      }
      return c;
    }));
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Reset to original demo seed
  const resetDemoData = () => {
    setIncidents(INITIAL_INCIDENTS);
    setSites(INITIAL_SITES);
    setCameras(INITIAL_CAMERAS);
    setRules(INITIAL_SAFETY_RULES);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.INCIDENTS);
    localStorage.removeItem(STORAGE_KEYS.SITES);
    localStorage.removeItem(STORAGE_KEYS.CAMERAS);
    localStorage.removeItem(STORAGE_KEYS.RULES);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);

    fetch('/api/reset-demo', { method: 'POST' }).catch(() => {});

    try {
      confetti({
        particleCount: 40,
        spread: 45,
        colors: ['#00FF9D', '#10B981', '#FFFFFF'],
      });
    } catch {}
  };

  return (
    <SafetyContext.Provider value={{
      currentUser,
      switchUser,
      sites,
      activeSite,
      setActiveSiteId,
      incidents,
      cameras,
      rules,
      notifications,
      unreadNotificationCount,
      createIncidentFromAnalysis,
      verifyIncident,
      rejectIncident,
      assignIncident,
      updateIncidentStatus,
      addCorrectiveAction,
      updateCorrectiveActionStatus,
      resolveIncident,
      toggleRule,
      addZone,
      updateZone,
      deleteZone,
      updateCameraStatus,
      markNotificationRead,
      markAllNotificationsRead,
      clearNotification,
      audioEnabled,
      setAudioEnabled: handleSetAudio,
      playAlertSound,
      resetDemoData,
      kpis,
    }}>
      {children}
    </SafetyContext.Provider>
  );
};

export const useSafety = () => {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
};
