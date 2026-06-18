import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEventManagementStore } from '../services/store';
import { Event, Task, Resource, BudgetExpense, Vendor, Incident, ActivityLog, Document } from '../types';

// ==========================================
// EVENTS HOOKS
// ==========================================

export function useEvents() {
  const events = useEventManagementStore((state) => state.events);
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      // Simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 100));
      return events;
    },
    initialData: events,
  });
}

export function useEvent(id: string | null) {
  const events = useEventManagementStore((state) => state.events);
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      if (!id) return null;
      await new Promise((resolve) => setTimeout(resolve, 100));
      return events.find((e) => e.id === id) || null;
    },
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  const addEvent = useEventManagementStore((state) => state.addEvent);
  const addLog = useEventManagementStore((state) => state.addActivityLog);
  const currentUser = useEventManagementStore((state) => state.currentUser);

  return useMutation({
    mutationFn: async (newEvent: Omit<Event, 'id' | 'progress' | 'actualCost'>) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      addEvent(newEvent);
      addLog({
        eventId: 'event-1', // Log to default event space or newly created
        user: currentUser.name,
        action: 'Event Created',
        details: `New event "${newEvent.name}" was successfully registered.`
      });
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  const updateEvent = useEventManagementStore((state) => state.updateEvent);

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Event> }) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      updateEvent(id, updates);
      return true;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', variables.id] });
    },
  });
}

// ==========================================
// PLANNING (TASKS) HOOKS
// ==========================================

export function useTasks(eventId?: string) {
  const tasks = useEventManagementStore((state) => state.tasks);
  return useQuery({
    queryKey: ['tasks', eventId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (eventId) {
        return tasks.filter((t) => t.eventId === eventId);
      }
      return tasks;
    },
    initialData: eventId ? tasks.filter((t) => t.eventId === eventId) : tasks,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const addTask = useEventManagementStore((state) => state.addTask);

  return useMutation({
    mutationFn: async (newTask: Omit<Task, 'id'>) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      addTask(newTask);
      return true;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.eventId] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const updateTask = useEventManagementStore((state) => state.updateTask);

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      updateTask(id, updates);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

// ==========================================
// RESOURCES HOOKS
// ==========================================

export function useResources() {
  const resources = useEventManagementStore((state) => state.resources);
  return useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return resources;
    },
    initialData: resources,
  });
}

export function useUpdateResource() {
  const queryClient = useQueryClient();
  const updateResource = useEventManagementStore((state) => state.updateResource);

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Resource> }) => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      updateResource(id, updates);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
}

// ==========================================
// BUDGET HOOKS
// ==========================================

export function useBudgets(eventId?: string) {
  const summaries = useEventManagementStore((state) => state.budgetSummaries);
  const expenses = useEventManagementStore((state) => state.budgetExpenses);

  return useQuery({
    queryKey: ['budgets', eventId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const filteredExpenses = eventId ? expenses.filter((e) => e.eventId === eventId) : expenses;
      const filteredSummaries = eventId && summaries[eventId]
        ? { [eventId]: summaries[eventId] }
        : summaries;

      return {
        summaries: filteredSummaries,
        expenses: filteredExpenses,
      };
    },
  });
}

export function useCreateBudgetExpense() {
  const queryClient = useQueryClient();
  const addExpense = useEventManagementStore((state) => state.addBudgetExpense);

  return useMutation({
    mutationFn: async (expense: Omit<BudgetExpense, 'id'>) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      addExpense(expense);
      return true;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['budgets', variables.eventId] });
    },
  });
}

export function useUpdateBudgetExpense() {
  const queryClient = useQueryClient();
  const updateExpense = useEventManagementStore((state) => state.updateBudgetExpense);

  return useMutation({
    mutationFn: async ({ id, updates, eventId }: { id: string; updates: Partial<BudgetExpense>; eventId: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      updateExpense(id, updates);
      return true;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['budgets', variables.eventId] });
    },
  });
}

export function useUpdateBudgetStatus() {
  const queryClient = useQueryClient();
  const updateStatus = useEventManagementStore((state) => state.updateBudgetStatus);

  return useMutation({
    mutationFn: async ({ eventId, status }: { eventId: string; status: 'Pending' | 'Submitted' | 'Approved' | 'Locked' }) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      updateStatus(eventId, status);
      return true;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['budgets', variables.eventId] });
    },
  });
}

// ==========================================
// VENDORS HOOKS
// ==========================================

export function useVendors() {
  const vendors = useEventManagementStore((state) => state.vendors);
  return useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return vendors;
    },
    initialData: vendors,
  });
}

export function useUpdateVendorDeliverable() {
  const queryClient = useQueryClient();
  const updateDeliverable = useEventManagementStore((state) => state.updateVendorDeliverable);

  return useMutation({
    mutationFn: async ({ vendorId, deliverableId, status }: { vendorId: string; deliverableId: string; status: 'Pending' | 'In Progress' | 'Completed' }) => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      updateDeliverable(vendorId, deliverableId, status);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
}

// ==========================================
// INCIDENTS HOOKS
// ==========================================

export function useIncidents(eventId?: string) {
  const incidents = useEventManagementStore((state) => state.incidents);
  return useQuery({
    queryKey: ['incidents', eventId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (eventId) {
        return incidents.filter((i) => i.eventId === eventId);
      }
      return incidents;
    },
    initialData: eventId ? incidents.filter((i) => i.eventId === eventId) : incidents,
  });
}

export function useCreateIncident() {
  const queryClient = useQueryClient();
  const addIncident = useEventManagementStore((state) => state.addIncident);

  return useMutation({
    mutationFn: async (newIncident: Omit<Incident, 'id' | 'reportedTime'>) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      addIncident(newIncident);
      return true;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['incidents', variables.eventId] });
    },
  });
}

export function useResolveIncident() {
  const queryClient = useQueryClient();
  const resolveIncident = useEventManagementStore((state) => state.resolveIncident);

  return useMutation({
    mutationFn: async ({ id, eventId }: { id: string; eventId: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      resolveIncident(id);
      return true;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['incidents', variables.eventId] });
    },
  });
}

// ==========================================
// LOGS HOOKS
// ==========================================

export function useActivityLogs(eventId?: string) {
  const logs = useEventManagementStore((state) => state.activityLogs);
  return useQuery({
    queryKey: ['logs', eventId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (eventId) {
        return logs.filter((l) => l.eventId === eventId);
      }
      return logs;
    },
    initialData: eventId ? logs.filter((l) => l.eventId === eventId) : logs,
  });
}

// ==========================================
// DOCUMENTS HOOKS
// ==========================================

export function useDocuments(eventId?: string) {
  const documents = useEventManagementStore((state) => state.documents);
  return useQuery({
    queryKey: ['documents', eventId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (eventId) {
        return documents.filter((d) => d.eventId === eventId);
      }
      return documents;
    },
    initialData: eventId ? documents.filter((d) => d.eventId === eventId) : documents,
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();
  const addDocument = useEventManagementStore((state) => state.addDocument);

  return useMutation({
    mutationFn: async (newDoc: Omit<Document, 'id' | 'lastModified' | 'version'>) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      addDocument(newDoc);
      return true;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents', variables.eventId] });
    },
  });
}

export function useCreateDocumentVersion() {
  const queryClient = useQueryClient();
  const addVersion = useEventManagementStore((state) => state.addDocumentVersion);

  return useMutation({
    mutationFn: async ({ id, size, eventId }: { id: string; size: string; eventId: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      addVersion(id, size);
      return true;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents', variables.eventId] });
    },
  });
}
