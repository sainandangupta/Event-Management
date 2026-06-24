export interface Resource {
  id: string;
  name: string;
  type: 'Staff' | 'Equipment' | 'Vehicle' | 'Venue';
  status: 'Available' | 'Allocated' | 'Maintenance' | 'Unavailable';
  allocatedTo?: string;
}

export interface ResourceConflict {
  id: string;
  resourceName: string;
  resourceId: string;
  type: 'DOUBLE BOOKED' | 'MAINTENANCE OVERLAP';
  description: string;
}

export interface UpcomingShift {
  id: string;
  title: string;
  project: string;
  assetsAllocated: number;
  date: string;
  month: string;
  day: string;
}

export interface ResourceDistribution {
  category: string;
  percentage: number;
  color: string;
}
