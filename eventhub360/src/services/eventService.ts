import apiClient from './api';
import type { Event, CreateEventFormData } from '../types/event';
import type { PaginatedResponse } from '../types/common';

export const eventService = {
  getEvents: async (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    category?: string;
    owner?: string;
  }): Promise<PaginatedResponse<Event>> => {
    const response = await apiClient.get('/events', { params });
    return response.data;
  },

  getEvent: async (id: string): Promise<Event> => {
    const response = await apiClient.get(`/events/${id}`);
    return response.data;
  },

  createEvent: async (data: CreateEventFormData): Promise<Event> => {
    const response = await apiClient.post('/events', data);
    return response.data;
  },

  updateEvent: async (id: string, data: Partial<CreateEventFormData>): Promise<Event> => {
    const response = await apiClient.put(`/events/${id}`, data);
    return response.data;
  },

  deleteEvent: async (id: string): Promise<void> => {
    await apiClient.delete(`/events/${id}`);
  },

  archiveEvent: async (id: string): Promise<Event> => {
    const response = await apiClient.post(`/events/${id}/archive`);
    return response.data;
  },
};

export default eventService;
