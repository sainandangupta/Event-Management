import { create } from 'zustand';
import {
  Event,
  Task,
  Resource,
  BudgetExpense,
  BudgetSummary,
  BudgetStatus,
  Vendor,
  Incident,
  ActivityLog,
  Document,
  UserRole,
  User
} from '../types';

interface EventManagementState {
  // Authentication & RBAC
  currentUser: User;
  activeRole: UserRole;
  setRole: (role: UserRole) => void;

  // Navigation context
  currentEventId: string | null;
  setCurrentEventId: (id: string | null) => void;

  // Events Data
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'progress' | 'actualCost'>) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;

  // Tasks Data (Planning)
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  // Resources Data
  resources: Resource[];
  addResource: (resource: Resource) => void;
  updateResource: (id: string, updates: Partial<Resource>) => void;

  // Budget Data
  budgetSummaries: Record<string, BudgetSummary>; // eventId -> summary
  budgetExpenses: BudgetExpense[];
  addBudgetExpense: (expense: Omit<BudgetExpense, 'id'>) => void;
  updateBudgetExpense: (id: string, updates: Partial<BudgetExpense>) => void;
  deleteBudgetExpense: (id: string) => void;
  updateBudgetStatus: (eventId: string, status: BudgetStatus) => void;

  // Vendors Data
  vendors: Vendor[];
  addVendor: (vendor: Vendor) => void;
  updateVendorDeliverable: (vendorId: string, deliverableId: string, status: 'Pending' | 'In Progress' | 'Completed') => void;

  // Execution Data
  incidents: Incident[];
  addIncident: (incident: Omit<Incident, 'id' | 'reportedTime'>) => void;
  resolveIncident: (id: string) => void;
  activityLogs: ActivityLog[];
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'time'>) => void;

  // Documents Data
  documents: Document[];
  addDocument: (doc: Omit<Document, 'id' | 'lastModified' | 'version'>) => void;
  addDocumentVersion: (id: string, size: string) => void;
}

export const useEventManagementStore = create<EventManagementState>((set) => ({
  // Authentication & RBAC Defaults
  currentUser: {
    name: 'Alexander West',
    role: 'Event Manager',
    title: 'Chief Event Architect',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB50DnlD7wFsrWaWo8Bv78YoDS3vDuLqe9YHkrYK7NMQNilSRVl9qdwFB4JBfZdC1AqvBxH-w1vjHfp-3iI0Rlxdr8kT-VZ8ID1S_-7Di_llRjY1cSb4pLZ9nL6IF_XH645TvU2VXjpc0ykFawB8-Z0yDi_u-VgDFRECQkJeWakllbPzu_vXUIaztx6PG5Cl26TI92fJ0SvXwnvtMVnGwDVKZK2NNoKty7BZqqrAARpzumbBtIG3IH1IBv1EgFV3AbMqr3nEYwkKMAI'
  },
  activeRole: 'Event Manager',
  setRole: (role) => set({ activeRole: role }),

  // Current selected event id (defaults to first event)
  currentEventId: 'event-1',
  setCurrentEventId: (id) => set({ currentEventId: id }),

  // Pre-seeded Events Data
  events: [
    {
      id: 'event-1',
      name: 'TechVision Summit 2024',
      category: 'Corporate',
      venue: 'Grand Hyatt Ballroom',
      dates: 'Oct 12 - 14, 2024',
      estimatedRevenue: 145000.00,
      actualCost: 98000.00,
      progress: 40,
      status: 'Planned',
      phase: 'Planning',
      owner: 'Julianne Moore',
      team: ['Julianne Moore', 'David Chen', 'Elena Rodriguez', 'Alexander West'],
      description: 'Annual corporate gathering of top tier tech executives, VCs, and innovators to discuss future product pipelines.'
    },
    {
      id: 'event-2',
      name: 'The Sterling Wedding',
      category: 'Wedding',
      venue: 'Belmond Riviera Maya',
      dates: 'Nov 03, 2024',
      estimatedRevenue: 82400.00,
      actualCost: 61000.00,
      progress: 75,
      status: 'In Progress',
      phase: 'Execution',
      owner: 'Elena Rodriguez',
      team: ['Elena Rodriguez', 'Alexander West'],
      description: 'Luxury destination wedding for Aria & Julian Sterling, focusing on high-end modern hospitality aesthetic.'
    },
    {
      id: 'event-3',
      name: 'Ocean Conservatory Gala',
      category: 'Gala',
      venue: 'The Metropolitan Museum',
      dates: 'Dec 15, 2024',
      estimatedRevenue: 210000.00,
      actualCost: 195000.00,
      progress: 100,
      status: 'Completed',
      phase: 'Post-Event',
      owner: 'Julianne Moore',
      team: ['Julianne Moore', 'Elena Rodriguez', 'David Chen'],
      description: 'Charity fundraising gala supporting ocean preservation, complete with live auctions and orchestra dinner.'
    },
    {
      id: 'event-4',
      name: 'Venture Capitalist Forum',
      category: 'Corporate',
      venue: 'Silicon Valley Marriott',
      dates: 'Jan 22, 2025',
      estimatedRevenue: 55000.00,
      actualCost: 0.00,
      progress: 15,
      status: 'Planned',
      phase: 'Concept',
      owner: 'David Chen',
      team: ['David Chen', 'Alexander West'],
      description: 'An intimate networking session for high-growth tech start-ups and series A investors.'
    }
  ],

  addEvent: (eventData) => set((state) => {
    const newId = `event-${state.events.length + 1}`;
    const newEvent: Event = {
      ...eventData,
      id: newId,
      actualCost: 0,
      progress: 0,
    };
    
    // Auto-create standard budget summary for the new event
    const newSummary: BudgetSummary = {
      eventId: newId,
      status: 'Pending',
      totalEstimated: eventData.estimatedRevenue * 0.7, // Assume 70% cost estimate
      totalActual: 0,
      variance: eventData.estimatedRevenue * 0.7
    };

    return {
      events: [...state.events, newEvent],
      budgetSummaries: {
        ...state.budgetSummaries,
        [newId]: newSummary
      }
    };
  }),

  updateEvent: (id, updates) => set((state) => ({
    events: state.events.map((e) => e.id === id ? { ...e, ...updates } : e)
  })),

  deleteEvent: (id) => set((state) => ({
    events: state.events.filter((e) => e.id !== id),
    currentEventId: state.currentEventId === id ? (state.events[0]?.id || null) : state.currentEventId
  })),

  // Pre-seeded Tasks Data (Planning)
  tasks: [
    {
      id: 'task-1',
      eventId: 'event-1',
      title: 'Vendor Contract Review',
      assignee: 'Julianne Moore',
      status: 'Todo',
      dueDate: '2024-09-15',
      priority: 'High',
      dependencies: [],
      isMilestone: false,
      progress: 85
    },
    {
      id: 'task-2',
      eventId: 'event-1',
      title: 'Venue Walkthrough & Layout Setup',
      assignee: 'Elena Rodriguez',
      status: 'In Progress',
      dueDate: '2024-09-20',
      priority: 'Medium',
      dependencies: ['task-1'],
      isMilestone: false,
      progress: 20
    },
    {
      id: 'task-3',
      eventId: 'event-1',
      title: 'Floral Design Theme Approval',
      assignee: 'Alexander West',
      status: 'In Review',
      dueDate: '2024-09-25',
      priority: 'Low',
      dependencies: ['task-2'],
      isMilestone: false,
      progress: 90
    },
    {
      id: 'task-4',
      eventId: 'event-1',
      title: 'Catering Menu & F&B Selection',
      assignee: 'David Chen',
      status: 'Done',
      dueDate: '2024-09-10',
      priority: 'High',
      dependencies: [],
      isMilestone: true,
      progress: 100
    },
    {
      id: 'task-5',
      eventId: 'event-2',
      title: 'AV Power Supply Hookup',
      assignee: 'Alexander West',
      status: 'In Progress',
      dueDate: '2024-10-28',
      priority: 'High',
      dependencies: [],
      isMilestone: false,
      progress: 45
    },
    {
      id: 'task-6',
      eventId: 'event-2',
      title: 'Guest List Seating Chart Design',
      assignee: 'Elena Rodriguez',
      status: 'Todo',
      dueDate: '2024-11-01',
      priority: 'Medium',
      dependencies: [],
      isMilestone: false,
      progress: 0
    }
  ],

  addTask: (taskData) => set((state) => ({
    tasks: [...state.tasks, { ...taskData, id: `task-${state.tasks.length + 1}` }]
  })),

  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === id ? { ...t, ...updates } : t)
  })),

  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((t) => t.id !== id)
  })),

  // Pre-seeded Resources
  resources: [
    {
      id: 'res-1',
      name: 'Alexander West',
      category: 'Staff',
      status: 'Allocated',
      allocation: 'event-1',
      details: 'Chief Event Coordinator & General Director',
      utilization: 95
    },
    {
      id: 'res-2',
      name: 'Julianne Moore',
      category: 'Staff',
      status: 'Allocated',
      allocation: 'event-1',
      details: 'Senior Operations Lead',
      utilization: 85
    },
    {
      id: 'res-3',
      name: 'David Chen',
      category: 'Staff',
      status: 'Available',
      allocation: null,
      details: 'Logistics Supervisor',
      utilization: 75
    },
    {
      id: 'res-4',
      name: 'Elena Rodriguez',
      category: 'Staff',
      status: 'Allocated',
      allocation: 'event-2',
      details: 'Guest Relations Director',
      utilization: 90
    },
    {
      id: 'res-5',
      name: 'Grand Hyatt Ballroom',
      category: 'Venue',
      status: 'Allocated',
      allocation: 'event-1',
      details: 'Luxury Indoor Ballroom, 500 Capacity',
      utilization: 100
    },
    {
      id: 'res-6',
      name: 'Belmond Riviera Maya',
      category: 'Venue',
      status: 'Allocated',
      allocation: 'event-2',
      details: 'Outdoor beach front private property',
      utilization: 100
    },
    {
      id: 'res-7',
      name: 'LED Video Wall 4K (Model XL)',
      category: 'Equipment',
      status: 'Conflict',
      allocation: 'event-1',
      details: 'Modular high resolution video display system',
      utilization: 100,
      conflictDetails: 'LED Video Wall double booked on Oct 13 with a private photoshoot booking.'
    },
    {
      id: 'res-8',
      name: 'Premium Sound System',
      category: 'Equipment',
      status: 'Allocated',
      allocation: 'event-1',
      details: 'Line array speakers + subwoofers + mixing console',
      utilization: 80
    },
    {
      id: 'res-9',
      name: 'Luxury Shuttle Van',
      category: 'Vehicle',
      status: 'Available',
      allocation: null,
      details: '15 Seater guest transit vehicle',
      utilization: 45
    },
    {
      id: 'res-10',
      name: 'Production Transport Truck',
      category: 'Vehicle',
      status: 'Allocated',
      allocation: 'event-2',
      details: 'Heavy logistics shipping vehicle',
      utilization: 85
    }
  ],

  addResource: (res) => set((state) => ({
    resources: [...state.resources, res]
  })),

  updateResource: (id, updates) => set((state) => ({
    resources: state.resources.map((r) => r.id === id ? { ...r, ...updates } : r)
  })),

  // Pre-seeded Budgets
  budgetSummaries: {
    'event-1': {
      eventId: 'event-1',
      status: 'Approved',
      totalEstimated: 110000.00,
      totalActual: 98000.00,
      variance: 12000.00
    },
    'event-2': {
      eventId: 'event-2',
      status: 'Submitted',
      totalEstimated: 65000.00,
      totalActual: 61000.00,
      variance: 4000.00
    },
    'event-3': {
      eventId: 'event-3',
      status: 'Locked',
      totalEstimated: 200000.00,
      totalActual: 195000.00,
      variance: 5000.00
    },
    'event-4': {
      eventId: 'event-4',
      status: 'Pending',
      totalEstimated: 35000.00,
      totalActual: 0.00,
      variance: 35000.00
    }
  },

  budgetExpenses: [
    {
      id: 'exp-1',
      eventId: 'event-1',
      category: 'Venue',
      itemName: 'Venue Rental Fee',
      estimatedCost: 40000.00,
      actualCost: 40000.00,
      status: 'Approved',
      date: '2024-08-01'
    },
    {
      id: 'exp-2',
      eventId: 'event-1',
      category: 'Catering',
      itemName: 'F&B Gala Banquet Buffet',
      estimatedCost: 35000.00,
      actualCost: 30000.00,
      status: 'Approved',
      date: '2024-08-15'
    },
    {
      id: 'exp-3',
      eventId: 'event-1',
      category: 'Production',
      itemName: 'AV Equipment & Rigging',
      estimatedCost: 25000.00,
      actualCost: 22000.00,
      status: 'Approved',
      date: '2024-08-20'
    },
    {
      id: 'exp-4',
      eventId: 'event-1',
      category: 'Entertainment',
      itemName: 'Guest Keynote Speaker',
      estimatedCost: 10000.00,
      actualCost: 6000.00,
      status: 'Pending',
      date: '2024-09-02'
    },
    {
      id: 'exp-5',
      eventId: 'event-2',
      category: 'Venue',
      itemName: 'Beachfront Setup Permit',
      estimatedCost: 15000.00,
      actualCost: 15000.00,
      status: 'Approved',
      date: '2024-09-10'
    },
    {
      id: 'exp-6',
      eventId: 'event-2',
      category: 'Decor',
      itemName: 'Floral Sourcing & Arcs',
      estimatedCost: 20000.00,
      actualCost: 18000.00,
      status: 'Approved',
      date: '2024-09-15'
    }
  ],

  addBudgetExpense: (expense) => set((state) => {
    const newId = `exp-${state.budgetExpenses.length + 1}`;
    const newExp = { ...expense, id: newId };
    const updatedExpenses = [...state.budgetExpenses, newExp];
    
    // Recalculate summary
    const summary = state.budgetSummaries[expense.eventId];
    if (summary) {
      const isApproved = newExp.status === 'Approved';
      const addedEst = newExp.estimatedCost;
      const addedAct = isApproved ? newExp.actualCost : 0;
      
      const nextSummary: BudgetSummary = {
        ...summary,
        totalEstimated: summary.totalEstimated + addedEst,
        totalActual: summary.totalActual + addedAct,
        variance: summary.totalEstimated + addedEst - (summary.totalActual + addedAct)
      };

      return {
        budgetExpenses: updatedExpenses,
        budgetSummaries: {
          ...state.budgetSummaries,
          [expense.eventId]: nextSummary
        }
      };
    }
    return { budgetExpenses: updatedExpenses };
  }),

  updateBudgetExpense: (id, updates) => set((state) => {
    const updatedExpenses = state.budgetExpenses.map((exp) => exp.id === id ? { ...exp, ...updates } : exp);
    
    // Recalculate summary for this event
    const targetExp = state.budgetExpenses.find((e) => e.id === id);
    if (targetExp) {
      const eventId = targetExp.eventId;
      const eventExps = updatedExpenses.filter((e) => e.eventId === eventId);
      const summary = state.budgetSummaries[eventId];
      if (summary) {
        const totalEstimated = eventExps.reduce((acc, curr) => acc + curr.estimatedCost, 0);
        const totalActual = eventExps.reduce((acc, curr) => acc + (curr.status === 'Approved' ? curr.actualCost : 0), 0);
        
        const nextSummary: BudgetSummary = {
          ...summary,
          totalEstimated,
          totalActual,
          variance: totalEstimated - totalActual
        };

        return {
          budgetExpenses: updatedExpenses,
          budgetSummaries: {
            ...state.budgetSummaries,
            [eventId]: nextSummary
          }
        };
      }
    }

    return { budgetExpenses: updatedExpenses };
  }),

  deleteBudgetExpense: (id) => set((state) => {
    const targetExp = state.budgetExpenses.find((e) => e.id === id);
    const updatedExpenses = state.budgetExpenses.filter((exp) => exp.id !== id);
    
    if (targetExp) {
      const eventId = targetExp.eventId;
      const eventExps = updatedExpenses.filter((e) => e.eventId === eventId);
      const summary = state.budgetSummaries[eventId];
      if (summary) {
        const totalEstimated = eventExps.reduce((acc, curr) => acc + curr.estimatedCost, 0);
        const totalActual = eventExps.reduce((acc, curr) => acc + (curr.status === 'Approved' ? curr.actualCost : 0), 0);
        
        const nextSummary: BudgetSummary = {
          ...summary,
          totalEstimated,
          totalActual,
          variance: totalEstimated - totalActual
        };

        return {
          budgetExpenses: updatedExpenses,
          budgetSummaries: {
            ...state.budgetSummaries,
            [eventId]: nextSummary
          }
        };
      }
    }
    return { budgetExpenses: updatedExpenses };
  }),

  updateBudgetStatus: (eventId, status) => set((state) => {
    const summary = state.budgetSummaries[eventId];
    if (summary) {
      return {
        budgetSummaries: {
          ...state.budgetSummaries,
          [eventId]: { ...summary, status }
        }
      };
    }
    return {};
  }),

  // Pre-seeded Vendors
  vendors: [
    {
      id: 'vend-1',
      name: 'DecoLux Designs',
      category: 'Decor & Styling',
      rating: 4.9,
      reliabilityScore: 98,
      activeAssignments: 3,
      contact: 'Clara Vance',
      email: 'clara@decolux.net',
      deliverables: [
        { id: 'del-1', name: 'Floral Stage Arch Setup', dueDate: '2024-10-12', status: 'Pending' },
        { id: 'del-2', name: 'Entrance Lighting Pillars', dueDate: '2024-10-11', status: 'In Progress' }
      ]
    },
    {
      id: 'vend-2',
      name: 'ProAudio Visual',
      category: 'AV Production',
      rating: 4.8,
      reliabilityScore: 96,
      activeAssignments: 4,
      contact: 'Marcus Brody',
      email: 'marcus@proav.biz',
      deliverables: [
        { id: 'del-3', name: 'Stage Sound Mix Check', dueDate: '2024-10-11', status: 'Completed' },
        { id: 'del-4', name: '4K LED Wall Panel Rigging', dueDate: '2024-10-12', status: 'In Progress' }
      ]
    },
    {
      id: 'vend-3',
      name: 'Elite Catering Group',
      category: 'Food & Beverage',
      rating: 4.7,
      reliabilityScore: 94,
      activeAssignments: 2,
      contact: 'Chef Andre',
      email: 'andre@elitecatering.com',
      deliverables: [
        { id: 'del-5', name: 'Hors d’oeuvres Tasting Session', dueDate: '2024-09-08', status: 'Completed' },
        { id: 'del-6', name: 'Full Dinner Service Plating', dueDate: '2024-10-13', status: 'Pending' }
      ]
    }
  ],

  addVendor: (vendor) => set((state) => ({
    vendors: [...state.vendors, vendor]
  })),

  updateVendorDeliverable: (vendorId, deliverableId, status) => set((state) => ({
    vendors: state.vendors.map((v) => {
      if (v.id === vendorId) {
        return {
          ...v,
          deliverables: v.deliverables.map((d) => d.id === deliverableId ? { ...d, status } : d)
        };
      }
      return v;
    })
  })),

  // Pre-seeded Incident Data
  incidents: [
    {
      id: 'inc-1',
      eventId: 'event-1',
      title: 'AV Power Grid Outage in Section B',
      severity: 'Critical',
      status: 'Resolved',
      reportedTime: '2026-06-17T12:00:00.000Z',
      description: 'Breaker tripped on section B sound rig during pre-setup checks. Resolved by routing to secondary generator.'
    },
    {
      id: 'inc-2',
      eventId: 'event-2',
      title: 'Delivery Truck Delayed - Floral Arch',
      severity: 'Minor',
      status: 'Open',
      reportedTime: '2026-06-17T14:30:00.000Z',
      description: 'Local traffic block on coastal route delaying floral delivery. Estimated arrival delayed by 45 minutes.'
    }
  ],

  addIncident: (incident) => set((state) => ({
    incidents: [
      ...state.incidents,
      {
        ...incident,
        id: `inc-${state.incidents.length + 1}`,
        reportedTime: new Date().toISOString()
      }
    ]
  })),

  resolveIncident: (id) => set((state) => ({
    incidents: state.incidents.map((inc) => inc.id === id ? { ...inc, status: 'Resolved' } : inc)
  })),

  // Pre-seeded Activity Logs
  activityLogs: [
    {
      id: 'log-1',
      eventId: 'event-1',
      user: 'Julianne Moore',
      action: 'Budget Status Updated',
      time: '1 hour ago',
      details: 'Gala Menu budget items updated. Status marked Approved.'
    },
    {
      id: 'log-2',
      eventId: 'event-1',
      user: 'David Chen',
      action: 'Task Completed',
      time: '3 hours ago',
      details: 'F&B Catering selection checklist is marked as 100% completed.'
    },
    {
      id: 'log-3',
      eventId: 'event-2',
      user: 'Elena Rodriguez',
      action: 'Resource Allocated',
      time: '5 hours ago',
      details: 'Production Transport Truck allocated for beach logistics route.'
    }
  ],

  addActivityLog: (log) => set((state) => ({
    activityLogs: [
      {
        ...log,
        id: `log-${state.activityLogs.length + 1}`,
        time: 'Just now'
      },
      ...state.activityLogs
    ]
  })),

  // Pre-seeded Documents Library
  documents: [
    {
      id: 'doc-1',
      eventId: 'event-1',
      name: 'Grand Hyatt Floor Plan Layout.pdf',
      size: '4.2 MB',
      type: 'PDF',
      version: 'v2.1',
      lastModified: '2 days ago',
      author: 'Julianne Moore'
    },
    {
      id: 'doc-2',
      eventId: 'event-1',
      name: 'DecoLux Vendor Service Agreement.pdf',
      size: '1.8 MB',
      type: 'PDF',
      version: 'v1.0',
      lastModified: '5 days ago',
      author: 'Alexander West'
    },
    {
      id: 'doc-3',
      eventId: 'event-2',
      name: 'Sterling Seating Arrangements.csv',
      size: '145 KB',
      type: 'CSV',
      version: 'v1.4',
      lastModified: '1 day ago',
      author: 'Elena Rodriguez'
    }
  ],

  addDocument: (doc) => set((state) => ({
    documents: [
      ...state.documents,
      {
        ...doc,
        id: `doc-${state.documents.length + 1}`,
        version: 'v1.0',
        lastModified: 'Just now'
      }
    ]
  })),

  addDocumentVersion: (id, size) => set((state) => ({
    documents: state.documents.map((doc) => {
      if (doc.id === id) {
        const currentVerNum = parseFloat(doc.version.replace('v', ''));
        const nextVer = `v${(currentVerNum + 0.1).toFixed(1)}`;
        return {
          ...doc,
          version: nextVer,
          size,
          lastModified: 'Just now'
        };
      }
      return doc;
    })
  }))
}));
