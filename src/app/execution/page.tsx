'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  X,
  FileText,
  User,
  Zap,
  Check,
  Send,
  Loader2,
  Phone
} from 'lucide-react';
import { useEventManagementStore } from '../../modules/event-management/services/store';
import { useIncidents, useCreateIncident, useResolveIncident, useActivityLogs } from '../../modules/event-management/hooks/queries';
import { IncidentSeverity, IncidentStatus } from '../../modules/event-management/types';

// Zod schema for reporting a new incident
const incidentSchema = z.object({
  title: z.string().min(3, 'Incident title must be at least 3 characters'),
  severity: z.enum(['Critical', 'Major', 'Minor']),
  description: z.string().min(10, 'Description must be at least 10 characters')
});

type IncidentFormValues = z.infer<typeof incidentSchema>;

function ExecutionPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'dashboard';

  const { currentEventId, events, currentUser } = useEventManagementStore();
  const currentEvent = events.find((e) => e.id === currentEventId) || events[0];

  const { data: incidents = [], isLoading: incidentsLoading } = useIncidents(currentEventId || undefined);
  const { data: logs = [] } = useActivityLogs(currentEventId || undefined);
  
  const createIncidentMutation = useCreateIncident();
  const resolveIncidentMutation = useResolveIncident();

  // Modal State
  const [reportingIncident, setReportingIncident] = useState(false);

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      title: '',
      severity: 'Minor',
      description: ''
    }
  });

  const onSubmitIncident = async (data: IncidentFormValues) => {
    if (!currentEventId) return;
    try {
      await createIncidentMutation.mutateAsync({
        eventId: currentEventId,
        title: data.title,
        severity: data.severity as IncidentSeverity,
        status: 'Open',
        description: data.description
      });
      alert('Incident reported to Command Center!');
      reset();
      setReportingIncident(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveIncident = async (id: string) => {
    if (confirm('Resolve this incident ticket?')) {
      await resolveIncidentMutation.mutateAsync({ id, eventId: currentEventId || '' });
      alert('Incident resolved.');
    }
  };

  // Stats
  const stats = useMemo(() => {
    const totalIncidents = incidents.length;
    const openIncidents = incidents.filter((i) => i.status === 'Open').length;
    const criticalIncidents = incidents.filter((i) => i.severity === 'Critical' && i.status === 'Open').length;

    return { totalIncidents, openIncidents, criticalIncidents };
  }, [incidents]);

  if (incidentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  // Mobile checklist mock data (or can be loaded dynamically)
  const mockChecklistItems = [
    { id: 'chk-1', label: 'AV main stage check completed', done: true, time: '10:00 AM' },
    { id: 'chk-2', label: 'Caterer arrival & station setup', done: true, time: '11:30 AM' },
    { id: 'chk-3', label: 'VIP shuttle transport arrived', done: false, time: 'Pending' },
    { id: 'chk-4', label: 'Doors open & guest registration start', done: false, time: 'Pending' }
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <span className="text-primary font-bold text-label-sm uppercase tracking-wider block mb-1">
            {currentEvent?.name || 'All Events'}
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-hanken text-headline-lg font-bold text-on-surface">Live Command Center</h2>
            <span className="flex h-3 w-3 rounded-full bg-primary animate-pulse" title="Live System Connection"></span>
          </div>
          <p className="text-body-lg text-on-surface-variant mt-1">
            Real time event status updates, dispatch logs, and immediate incident management.
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => router.push('/execution?view=dashboard')}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 cursor-pointer text-label-md transition-colors ${
              view === 'dashboard' ? 'bg-primary text-white' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            <Activity size={16} />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => router.push('/execution?view=incidents')}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 cursor-pointer text-label-md transition-colors relative ${
              view === 'incidents' ? 'bg-primary text-white' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            <AlertTriangle size={16} />
            <span>Incidents</span>
            {stats.openIncidents > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-error text-white font-sans text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                {stats.openIncidents}
              </span>
            )}
          </button>
          <button
            onClick={() => router.push('/execution?view=checklist')}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 cursor-pointer text-label-md transition-colors ${
              view === 'checklist' ? 'bg-primary text-white' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            <CheckCircle size={16} />
            <span>Mobile Checklist</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Zap size={20} />
          </div>
          <div>
            <p className="text-on-surface-variant font-sans text-label-sm uppercase font-semibold">Total Incidents</p>
            <p className="font-hanken text-headline-md font-bold text-on-surface">{stats.totalIncidents}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary-container/30 text-secondary flex items-center justify-center">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-on-surface-variant font-sans text-label-sm uppercase font-semibold">Active Incidents</p>
            <p className="font-hanken text-headline-md font-bold text-on-surface">{stats.openIncidents}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-on-surface-variant font-sans text-label-sm uppercase font-semibold">Critical Overload</p>
            <p className="font-hanken text-headline-md font-bold text-error">{stats.criticalIncidents}</p>
          </div>
        </div>
      </div>

      {/* ==============================================================
          VIEW 1: COMMAND CENTER DASHBOARD
          ============================================================= */}
      {view === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Live Stream Activity Logs */}
          <div className="lg:col-span-2 bg-white p-8 rounded-card border border-border-gray shadow-sm">
            <h4 className="font-hanken text-headline-md font-bold text-on-surface mb-6">Real Time Status Feed</h4>
            <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border-gray">
              {logs.map((log) => (
                <div key={log.id} className="relative pl-8">
                  <div className="absolute left-0 top-1.5 w-[22px] h-[22px] rounded-full bg-white border-4 border-primary z-10"></div>
                  <p className="text-body-md font-bold text-on-surface">{log.action}</p>
                  <p className="text-body-sm text-on-surface-variant mt-1 font-semibold">{log.details}</p>
                  <span className="text-[10px] text-on-surface-variant font-bold block mt-1">
                    {log.user} • {log.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions & contacts */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm">
              <h4 className="font-sans text-label-md font-bold text-on-surface mb-4">Command Actions</h4>
              <button
                onClick={() => setReportingIncident(true)}
                className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-opacity-95 transition-all text-label-md flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-primary/10"
              >
                <AlertTriangle size={16} />
                <span>Dispatch Incident Ticket</span>
              </button>
            </div>

            <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm">
              <h4 className="font-sans text-label-md font-bold text-on-surface mb-4">Emergency Dispatch Channels</h4>
              <div className="space-y-3 font-semibold text-body-sm text-on-surface">
                <div className="flex justify-between items-center py-2 border-b border-border-gray/30">
                  <span>Operations Lead</span>
                  <a href="tel:+15551221" className="text-primary flex items-center gap-1 hover:underline">
                    <Phone size={12} /> Call Dispatch
                  </a>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border-gray/30">
                  <span>AV Technical Crew</span>
                  <a href="tel:+15551222" className="text-primary flex items-center gap-1 hover:underline">
                    <Phone size={12} /> Call Stage
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          VIEW 2: INCIDENT TICKETS
          ============================================================= */}
      {view === 'incidents' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm flex justify-between items-center">
            <div>
              <h4 className="font-hanken text-headline-md font-bold text-on-surface">Active Incident Logs</h4>
              <p className="text-body-sm text-on-surface-variant mt-1 font-medium">Log and resolve tickets reported on the floor.</p>
            </div>
            <button
              onClick={() => setReportingIncident(true)}
              className="px-4 py-2 bg-primary text-white font-sans text-label-md rounded-xl hover:bg-opacity-95 flex items-center gap-1.5 cursor-pointer shadow"
            >
              <Plus size={16} />
              <span>Report Incident</span>
            </button>
          </div>

          <div className="space-y-4">
            {incidents.map((ticket) => (
              <div
                key={ticket.id}
                className={`p-6 rounded-card border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                  ticket.status === 'Resolved'
                    ? 'bg-white border-border-gray opacity-60'
                    : ticket.severity === 'Critical'
                    ? 'bg-error-container/20 border-error/20'
                    : 'bg-white border-border-gray'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl flex-shrink-0 ${
                    ticket.status === 'Resolved'
                      ? 'bg-emerald-green/10 text-emerald-green'
                      : ticket.severity === 'Critical'
                      ? 'bg-error text-white'
                      : 'bg-secondary-container/20 text-secondary'
                  }`}>
                    {ticket.status === 'Resolved' ? <CheckCircle size={22} /> : <AlertTriangle size={22} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-on-surface">{ticket.title}</h4>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                        ticket.severity === 'Critical' ? 'bg-error text-white' : 'bg-surface-container text-on-surface-variant'
                      }`}>
                        {ticket.severity}
                      </span>
                    </div>
                    <p className="text-body-sm text-on-surface-variant mt-1 font-medium leading-relaxed">
                      {ticket.description}
                    </p>
                    <span className="text-[10px] text-on-surface-variant font-bold mt-2 block">
                      Ticket ID: {ticket.id} • Status: {ticket.status}
                    </span>
                  </div>
                </div>

                {ticket.status === 'Open' && (
                  <button
                    onClick={() => handleResolveIncident(ticket.id)}
                    className="px-5 py-2 bg-emerald-green text-white font-bold rounded-xl hover:bg-opacity-95 transition-all text-label-md cursor-pointer flex items-center gap-1 shadow-sm"
                  >
                    <Check size={14} />
                    <span>Resolve</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==============================================================
          VIEW 3: MOBILE CHECKLIST
          ============================================================= */}
      {view === 'checklist' && (
        <div className="max-w-md mx-auto bg-white rounded-card border border-border-gray shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border-gray bg-surface-container-low/30">
            <h4 className="font-hanken text-headline-md font-bold text-on-surface">Floor Dispatch Checklist</h4>
            <p className="text-body-sm text-on-surface-variant font-medium mt-1">Checklist tracker for floor controllers.</p>
          </div>

          <div className="p-6 space-y-4 font-semibold text-body-sm">
            {mockChecklistItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3.5 bg-background-alt rounded-xl border border-border-gray/30">
                <div className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-white ${
                    item.done ? 'bg-emerald-green border-emerald-green' : 'border-outline-variant bg-white'
                  }`}>
                    {item.done && <Check size={12} />}
                  </span>
                  <span className={`text-on-surface ${item.done ? 'line-through opacity-50' : ''}`}>{item.label}</span>
                </div>
                <span className="text-[10px] text-on-surface-variant">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Report Incident Overlay Modal */}
      {reportingIncident && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-gutter">
          <div className="glass-panel w-full max-w-md p-8 rounded-[32px] border border-white/40 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-hanken text-headline-md font-bold text-on-surface">Report Incident</h3>
              <button
                onClick={() => setReportingIncident(false)}
                className="p-1 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmitIncident)} className="space-y-4 font-sans text-body-sm">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase">Incident Title</label>
                <input
                  {...register('title')}
                  className="w-full bg-background-alt border-none rounded-xl p-3.5 focus:bg-white transition-all text-body-sm font-semibold"
                  placeholder="e.g. Stage B LED screen blackout"
                  type="text"
                />
                {errors.title && <p className="text-xs text-error font-medium">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase">Severity Level</label>
                <select
                  {...register('severity')}
                  className="w-full bg-background-alt border-none rounded-xl p-3.5 focus:bg-white cursor-pointer transition-all font-semibold"
                >
                  <option value="Minor">Minor (Non-blocking)</option>
                  <option value="Major">Major (Partial Delay)</option>
                  <option value="Critical">Critical (Immediate Outage)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase">Description details</label>
                <textarea
                  {...register('description')}
                  className="w-full bg-background-alt border-none rounded-xl p-3.5 focus:bg-white transition-all text-body-sm font-semibold"
                  placeholder="Provide precise details of the incident on the floor..."
                  rows={3}
                ></textarea>
                {errors.description && <p className="text-xs text-error font-medium">{errors.description.message}</p>}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border-gray/50">
                <button
                  type="button"
                  onClick={() => setReportingIncident(false)}
                  className="px-6 py-2 text-on-surface-variant hover:text-primary font-bold cursor-pointer text-label-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white font-bold rounded-xl hover:bg-opacity-95 transition-all cursor-pointer text-label-md shadow-sm"
                >
                  Dispatch Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExecutionPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    }>
      <ExecutionPageContent />
    </Suspense>
  );
}
