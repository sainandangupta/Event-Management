export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
  initials?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}

export type EventStatus = 
  | 'Draft'
  | 'Planned'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled'
  | 'Archived';

export type EventCategory = 
  | 'Corporate'
  | 'Wedding'
  | 'Gala'
  | 'Conference'
  | 'Summit'
  | 'Expo'
  | 'Hotel';

export type Priority = 
  | 'Low'
  | 'Medium'
  | 'High'
  | 'Critical';

export type TaskStatus = 
  | 'Pending'
  | 'In Progress'
  | 'Review'
  | 'Completed'
  | 'Overdue';

export type PhaseStatus = 
  | 'Complete'
  | 'Active Phase'
  | 'Pending'
  | 'Locked';

export type VendorStatus = 
  | 'Preferred'
  | 'Active'
  | 'Under Review'
  | 'Waitlisted'
  | 'Inactive';

export type ApprovalStatus = 
  | 'Pending'
  | 'Approved'
  | 'Declined';

export type BookingStatus = 
  | 'Confirmed'
  | 'Pending'
  | 'Cancelled';

export interface SelectOption {
  label: string;
  value: string;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface ActivityItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  timestamp: string;
  type: 'event' | 'budget' | 'resource' | 'vendor' | 'document';
}

export interface StatCardData {
  id: string;
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  subtitle?: string;
  variant?: 'primary' | 'success' | 'warning' | 'tertiary' | 'secondary' | 'error';
}
