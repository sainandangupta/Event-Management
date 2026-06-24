import { z } from 'zod';
import type { EventStatus, EventCategory, Priority, PhaseStatus } from './common';

export interface Event {
  id: string;
  name: string;
  category: EventCategory;
  status: EventStatus;
  venue: string;
  location: string;
  startDate: string;
  endDate: string;
  estimatedRevenue: number;
  description: string;
  completion: number;
  priority: Priority;
  daysRemaining: number;
  teamMembers: TeamMember[];
  phases: EventPhase[];
  createdAt: string;
  updatedAt: string;
}

export interface EventPhase {
  id: string;
  number: number;
  title: string;
  description: string;
  status: PhaseStatus;
  assignedLead: string;
  startDate: string;
  endDate: string;
  tasks?: PhaseTask[];
  teamAvatars?: string[];
}

export interface PhaseTask {
  label: string;
  status: 'done' | 'in-progress' | 'pending';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar?: string;
  initials?: string;
  status?: 'Available' | 'Busy' | 'On-site specialized' | 'Overloaded';
  isLead?: boolean;
  activeTasks?: number;
  rating?: number;
}

export interface KeyDate {
  id: string;
  month: string;
  day: string;
  title: string;
  subtitle: string;
}

export interface Milestone {
  id: string;
  title: string;
  progress: number;
}

// Zod Schemas
export const createEventSchema = z.object({
  name: z.string().min(1, 'Event name is required').max(100, 'Event name is too long'),
  category: z.enum(['Corporate', 'Wedding', 'Gala', 'Conference', 'Summit', 'Expo', 'Hotel']),
  description: z.string().max(500, 'Description is too long').optional(),
  initialStatus: z.enum(['Draft', 'Planned', 'In Progress', 'Completed', 'Cancelled', 'Archived']).default('Draft'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  venue: z.string().optional(),
  location: z.string().optional(),
  revenue: z.number().min(0).optional(),
  planningHandoff: z.boolean().default(true),
  templateId: z.string().optional(),
  teamMemberIds: z.array(z.string()).optional(),
});

export type CreateEventFormData = z.infer<typeof createEventSchema>;
