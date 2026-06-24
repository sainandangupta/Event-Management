import type { VendorStatus } from './common';

export interface Vendor {
  id: string;
  name: string;
  email: string;
  category: string;
  status: VendorStatus;
  activeProjects: number;
  initials: string;
  projectAvatars?: string[];
}

export interface VendorAssignment {
  id: string;
  vendorId: string;
  eventId: string;
  deliverables: VendorDeliverable[];
  status: string;
}

export interface VendorDeliverable {
  id: string;
  title: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  progress: number;
}
