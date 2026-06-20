export type EventCategory = 'Corporate' | 'Wedding' | 'Gala';
export type EventStatus = 'Planned' | 'In Progress' | 'Completed';
export type EventPhase = 'Concept' | 'Planning' | 'Vendor Sourcing' | 'Execution' | 'Post-Event';

export interface Event {
  id: string;
  name: string;
  category: EventCategory;
  venue: string;
  dates: string;
  estimatedRevenue: number;
  actualCost: number;
  progress: number;
  status: EventStatus;
  phase: EventPhase;
  owner: string;
  team: string[];
  description: string;
}

export type TaskStatus = 'Todo' | 'In Progress' | 'In Review' | 'Done';
export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  eventId: string;
  title: string;
  assignee: string;
  status: TaskStatus;
  dueDate: string;
  priority: TaskPriority;
  dependencies: string[];
  isMilestone: boolean;
  progress: number;
}

export type ResourceCategory = 'Staff' | 'Equipment' | 'Venue' | 'Vehicle';
export type ResourceStatus = 'Available' | 'Allocated' | 'Conflict';

export interface Resource {
  id: string;
  name: string;
  category: ResourceCategory;
  status: ResourceStatus;
  allocation: string | null; // Event ID or null
  details: string;
  utilization: number; // Percentage 0-100
  conflictDetails?: string;
}

export type BudgetStatus = 'Pending' | 'Submitted' | 'Approved' | 'Locked';

export interface BudgetExpense {
  id: string;
  eventId: string;
  category: string;
  itemName: string;
  estimatedCost: number;
  actualCost: number;
  status: 'Pending' | 'Approved';
  date: string;
}

export interface BudgetSummary {
  eventId: string;
  status: BudgetStatus;
  totalEstimated: number;
  totalActual: number;
  variance: number;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  rating: number; // 0 to 5
  reliabilityScore: number; // 0 to 100
  activeAssignments: number;
  contact: string;
  email: string;
  deliverables: {
    id: string;
    name: string;
    dueDate: string;
    status: 'Pending' | 'In Progress' | 'Completed';
  }[];
}

export type IncidentSeverity = 'Critical' | 'Major' | 'Minor';
export type IncidentStatus = 'Open' | 'Resolved';

export interface Incident {
  id: string;
  eventId: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  reportedTime: string;
  description: string;
}

export interface ActivityLog {
  id: string;
  eventId: string;
  user: string;
  action: string;
  time: string;
  details: string;
}

export interface Document {
  id: string;
  eventId: string;
  name: string;
  size: string;
  type: string;
  version: string;
  lastModified: string;
  author: string;
  url?: string;
}

export type UserRole = 'Event Manager' | 'Finance Manager' | 'Vendor';

export interface User {
  name: string;
  role: UserRole;
  avatar: string;
  title: string;
}
