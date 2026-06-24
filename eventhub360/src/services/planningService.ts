import apiClient from './api';
import type { PlanningTask } from '../types/planning';
import type { PaginatedResponse } from '../types/common';

export const planningService = {
  getTasks: async (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    priority?: string;
    assignee?: string;
  }): Promise<PaginatedResponse<PlanningTask>> => {
    const response = await apiClient.get('/planning/tasks', { params });
    return response.data;
  },

  createTask: async (data: Partial<PlanningTask>): Promise<PlanningTask> => {
    const response = await apiClient.post('/planning/tasks', data);
    return response.data;
  },

  updateTask: async (id: string, data: Partial<PlanningTask>): Promise<PlanningTask> => {
    const response = await apiClient.put(`/planning/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await apiClient.delete(`/planning/tasks/${id}`);
  },

  getMilestones: async () => {
    const response = await apiClient.get('/planning/milestones');
    return response.data;
  },

  getTimelines: async () => {
    const response = await apiClient.get('/planning/timelines');
    return response.data;
  },

  getDashboard: async () => {
    const response = await apiClient.get('/planning/dashboard');
    return response.data;
  },
};

export default planningService;
