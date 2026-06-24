import type { Priority, TaskStatus } from './common';

export interface PlanningTask {
  id: string;
  title: string;
  subtitle: string;
  status: TaskStatus;
  priority: Priority;
  assignee: {
    name: string;
    avatar?: string;
  };
  dueDate: string;
  isOverdue: boolean;
}

export interface PlanningMilestone {
  id: string;
  title: string;
  description: string;
  date: string;
  month: string;
  day: string;
}

export interface TimelineSummary {
  id: string;
  name: string;
  progress: number;
  status: string;
  statusColor: string;
}
