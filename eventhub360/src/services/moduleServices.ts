import apiClient from './api';

export const resourceService = {
  getDashboard: async () => {
    const response = await apiClient.get('/resources/dashboard');
    return response.data;
  },
  getResources: async (params?: Record<string, string>) => {
    const response = await apiClient.get('/resources', { params });
    return response.data;
  },
  getConflicts: async () => {
    const response = await apiClient.get('/resources/conflicts');
    return response.data;
  },
  getAllocations: async () => {
    const response = await apiClient.get('/resources/allocations');
    return response.data;
  },
  resolveConflict: async (id: string) => {
    const response = await apiClient.post(`/resources/conflicts/${id}/resolve`);
    return response.data;
  },
};

export const budgetService = {
  getDashboard: async () => {
    const response = await apiClient.get('/budget/dashboard');
    return response.data;
  },
  getExpenses: async (params?: Record<string, string>) => {
    const response = await apiClient.get('/budget/expenses', { params });
    return response.data;
  },
  recordExpense: async (data: Record<string, unknown>) => {
    const response = await apiClient.post('/budget/expenses', data);
    return response.data;
  },
  getApprovals: async () => {
    const response = await apiClient.get('/budget/approvals');
    return response.data;
  },
  processApproval: async (id: string, action: 'approve' | 'decline') => {
    const response = await apiClient.post(`/budget/approvals/${id}/${action}`);
    return response.data;
  },
};

export const vendorService = {
  getVendors: async (params?: Record<string, string>) => {
    const response = await apiClient.get('/vendors', { params });
    return response.data;
  },
  getVendor: async (id: string) => {
    const response = await apiClient.get(`/vendors/${id}`);
    return response.data;
  },
  addVendor: async (data: Record<string, unknown>) => {
    const response = await apiClient.post('/vendors', data);
    return response.data;
  },
};

export const executionService = {
  getDashboard: async () => {
    const response = await apiClient.get('/execution/dashboard');
    return response.data;
  },
  getActivityStream: async () => {
    const response = await apiClient.get('/execution/activity-stream');
    return response.data;
  },
  reportIncident: async (data: Record<string, unknown>) => {
    const response = await apiClient.post('/execution/incidents', data);
    return response.data;
  },
};

export const documentService = {
  getDocuments: async (params?: Record<string, string>) => {
    const response = await apiClient.get('/documents', { params });
    return response.data;
  },
  uploadDocument: async (formData: FormData) => {
    const response = await apiClient.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export const reportingService = {
  getDashboard: async () => {
    const response = await apiClient.get('/reporting/dashboard');
    return response.data;
  },
  getPerformanceTrends: async (params?: Record<string, string>) => {
    const response = await apiClient.get('/reporting/performance-trends', { params });
    return response.data;
  },
  exportReport: async (type: string) => {
    const response = await apiClient.get(`/reporting/export/${type}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
