'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  ChevronRight,
  Plus,
  Edit,
  Hourglass,
  CheckCircle,
  Calendar,
  Lock,
  Loader2,
  AlertCircle,
  X,
  User,
  Activity,
  ArrowLeft
} from 'lucide-react';
import { useEvent, useUpdateEvent } from '../../../../modules/event-management/hooks/queries';
import { useEventManagementStore } from '../../../../modules/event-management/services/store';
import { EventPhase } from '../../../../modules/event-management/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

const mockVelocityData = [
  { name: 'Inception', Planned: 18, Actual: 15 },
  { name: 'Planning', Planned: 40, Actual: 35 },
  { name: 'Logistics', Planned: 45, Actual: 50 },
  { name: 'Execution', Planned: 3, Actual: 0 }
];

export default function EventLifecyclePage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;

  const { data: event, isLoading: eventLoading } = useEvent(eventId);
  const updateEventMutation = useUpdateEvent();
  const { activeRole } = useEventManagementStore();

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [newPhaseName, setNewPhaseName] = useState('');
  const [newPhaseLead, setNewPhaseLead] = useState('');
  const [newPhaseStart, setNewPhaseStart] = useState('');
  const [newPhaseEnd, setNewPhaseEnd] = useState('');

  if (eventLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="bg-white rounded-card p-12 text-center border border-border-gray shadow-sm max-w-lg mx-auto mt-12">
        <AlertCircle size={48} className="text-error mx-auto mb-4" />
        <h3 className="font-hanken text-headline-md font-bold text-on-surface mb-2">Event Not Found</h3>
        <button onClick={() => router.push('/events')} className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl cursor-pointer">
          Return to Events
        </button>
      </div>
    );
  }

  // Phase Helpers based on event status
  const getPhaseNumber = (phase: EventPhase) => {
    switch (phase) {
      case 'Concept': return 1;
      case 'Planning': return 2;
      case 'Vendor Sourcing': return 3;
      case 'Execution': return 4;
      case 'Post-Event': return 5;
    }
  };

  const currentPhaseIndex = getPhaseNumber(event.phase);

  const handleAddPhaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhaseName) return;

    alert(`Phase "${newPhaseName}" added to timeline flow!`);
    setModalOpen(false);
    // Reset form
    setNewPhaseName('');
    setNewPhaseLead('');
    setNewPhaseStart('');
    setNewPhaseEnd('');
  };

  const handleAdvancePhase = async () => {
    let nextPhase: EventPhase = 'Concept';
    if (event.phase === 'Concept') nextPhase = 'Planning';
    else if (event.phase === 'Planning') nextPhase = 'Vendor Sourcing';
    else if (event.phase === 'Vendor Sourcing') nextPhase = 'Execution';
    else if (event.phase === 'Execution') nextPhase = 'Post-Event';
    else {
      alert('Event is already in final Post-Event phase!');
      return;
    }

    if (confirm(`Advance event lifecycle to "${nextPhase}"?`)) {
      await updateEventMutation.mutateAsync({
        id: event.id,
        updates: { phase: nextPhase, progress: Math.min(event.progress + 20, 100) }
      });
      alert('Event phase updated successfully.');
    }
  };

  const subTabs = [
    { label: 'Overview', path: `/events/${event.id}` },
    { label: 'Phases', path: `/events/${event.id}/lifecycle`, active: true },
    { label: 'Team', path: `/events/${event.id}/team` },
    { label: 'Planning', path: `/planning` },
    { label: 'Resources', path: `/resources` },
    { label: 'Budget', path: `/budget` },
    { label: 'Vendors', path: `/vendors` },
    { label: 'Documents', path: `/documents` }
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          {/* Breadcrumb */}
          <nav className="flex text-label-sm text-on-surface-variant mb-2 gap-2">
            <Link href="/events" className="hover:text-primary">Events</Link>
            <ChevronRight size={14} className="opacity-60" />
            <Link href={`/events/${event.id}`} className="hover:text-primary">{event.name}</Link>
            <ChevronRight size={14} className="opacity-60" />
            <span className="font-bold text-primary">Phases</span>
          </nav>
          
          <h2 className="font-hanken text-headline-lg font-bold text-on-surface">Event Phases</h2>
          <p className="text-body-lg text-on-surface-variant mt-2">
            Manage and view the sequential stages of your event lifecycle.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-high text-on-surface font-sans text-label-md rounded-xl hover:bg-surface-variant transition-colors border border-border-gray cursor-pointer">
            <Edit size={16} />
            <span>Edit Flow</span>
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-sans text-label-md rounded-xl hover:shadow-lg transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Phase</span>
          </button>
        </div>
      </div>

      {/* Sub tab navigation */}
      <div className="glass-card mb-8 p-1.5 overflow-x-auto custom-scrollbar">
        <div className="flex items-center min-w-max gap-1">
          {subTabs.map((tab) => (
            <Link
              key={tab.label}
              href={tab.path}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all text-label-md ${
                tab.active
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:bg-background-alt'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-12">
        {/* Progress Card */}
        <div className="bg-white p-6 rounded-card shadow-sm border border-border-gray flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
              <Hourglass size={20} />
            </div>
            <span className="text-label-sm text-on-surface-variant font-medium">Progress</span>
          </div>
          <div>
            <div className="text-headline-md font-bold text-on-surface">Phase {currentPhaseIndex} of 5</div>
            <div className="w-full bg-surface-container-low h-2 rounded-full mt-4">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentPhaseIndex / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white p-6 rounded-card shadow-sm border border-border-gray flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-green/10 rounded-2xl text-emerald-green">
              <CheckCircle size={20} />
            </div>
            <span className="text-label-sm text-on-surface-variant font-medium">Status</span>
          </div>
          <div>
            <div className="text-headline-md font-bold text-on-surface">
              {currentPhaseIndex - 1} Complete
            </div>
            <p className="text-body-sm text-on-surface-variant mt-1 font-medium">
              Current: <span className="text-primary font-bold">{event.phase}</span>
            </p>
          </div>
        </div>

        {/* Deadline Card */}
        <div className="bg-white p-6 rounded-card shadow-sm border border-border-gray flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
              <Calendar size={20} />
            </div>
            <span className="text-label-sm text-on-surface-variant font-medium">Deadline</span>
          </div>
          <div>
            <div className="text-headline-md font-bold text-on-surface">14 Days Left</div>
            <p className="text-body-sm text-on-surface-variant mt-1 font-medium">
              Until Execution phase
            </p>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="relative mb-12">
        {/* Legend */}
        <div className="flex flex-wrap gap-6 mb-8 p-4 bg-surface-container-low rounded-xl border border-border-gray">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-green"></span>
            <span className="text-label-sm text-on-surface-variant font-semibold">Complete</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary animate-pulse"></span>
            <span className="text-label-sm text-on-surface-variant font-semibold">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-surface-container-highest"></span>
            <span className="text-label-sm text-on-surface-variant font-semibold">Pending</span>
          </div>
        </div>

        {/* Connector vertical line */}
        <div className="absolute left-[39px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-emerald-green to-border-gray hidden md:block"></div>

        {/* Timeline Stack */}
        <div className="space-y-8 relative">
          
          {/* Phase 1: Concept */}
          <div className="flex flex-col md:flex-row gap-8 items-start group">
            <div className="hidden md:flex flex-col items-center pt-2">
              <div className="w-20 h-20 rounded-full bg-emerald-green text-white flex items-center justify-center z-10 border-4 border-white shadow-md group-hover:scale-105 transition-transform flex-shrink-0 font-bold">
                <CheckCircle size={24} />
              </div>
            </div>
            <div className="flex-1 bg-white p-8 rounded-card shadow-sm border border-border-gray hover:shadow-md transition-shadow">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <span className="px-3 py-1 bg-emerald-green/10 text-emerald-green text-label-sm rounded-full mb-3 inline-block font-bold">
                    Complete
                  </span>
                  <h3 className="font-hanken text-headline-md font-bold text-on-surface">Phase 01: Inception & Discovery</h3>
                  <p className="text-body-md text-on-surface-variant mt-2 font-medium">
                    Initial project concept brainstorming, guest capacity checks, and venue scoping.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-border-gray/50 text-body-sm font-medium">
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1 font-bold">Lead Owner</p>
                  <p className="text-on-surface font-semibold">Alexander West</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1 font-bold">Start Date</p>
                  <p className="text-on-surface font-semibold">Oct 12, 2023</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1 font-bold">End Date</p>
                  <p className="text-on-surface font-semibold">Oct 30, 2023</p>
                </div>
                <div className="flex justify-end items-end">
                  <button className="text-primary font-bold hover:underline cursor-pointer">View Docs</button>
                </div>
              </div>
            </div>
          </div>

          {/* Phase 2: Planning */}
          <div className="flex flex-col md:flex-row gap-8 items-start group">
            <div className="hidden md:flex flex-col items-center pt-2">
              <div className={`w-20 h-20 rounded-full text-white flex items-center justify-center z-10 border-4 border-white shadow-md group-hover:scale-105 transition-transform flex-shrink-0 font-bold ${
                currentPhaseIndex > 2 ? 'bg-emerald-green' : 'bg-primary animate-pulse step-active-glow'
              }`}>
                {currentPhaseIndex > 2 ? <CheckCircle size={24} /> : <Activity size={24} />}
              </div>
            </div>
            <div className={`flex-1 bg-white p-8 rounded-card shadow-sm border hover:shadow-md transition-all ${
              event.phase === 'Planning' ? 'border-2 border-primary/20 shadow-md' : 'border-border-gray'
            }`}>
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <span className={`px-3 py-1 text-label-sm rounded-full mb-3 inline-block font-bold ${
                    currentPhaseIndex > 2
                      ? 'bg-emerald-green/10 text-emerald-green'
                      : event.phase === 'Planning'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    {currentPhaseIndex > 2 ? 'Complete' : event.phase === 'Planning' ? 'Active Phase' : 'Pending'}
                  </span>
                  <h3 className="font-hanken text-headline-md font-bold text-on-surface">Phase 02: Strategic Planning</h3>
                  <p className="text-body-md text-on-surface-variant mt-2 font-medium">
                    Detailed task layout, milestones schedule map, vendor deliverables setting, and allocation drafts.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-border-gray/50 text-body-sm font-medium">
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1 font-bold">Lead Owner</p>
                  <p className="text-on-surface font-semibold">David Chen</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1 font-bold">Start Date</p>
                  <p className="text-on-surface font-semibold">Nov 05, 2023</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1 font-bold">End Date</p>
                  <p className="text-on-surface font-semibold">Dec 15, 2023</p>
                </div>
                <div className="flex justify-end items-end gap-3">
                  {event.phase === 'Planning' && (
                    <button
                      onClick={handleAdvancePhase}
                      className="px-3 py-1 bg-primary text-white text-[10px] rounded-lg font-bold hover:bg-opacity-90 transition-all cursor-pointer shadow-sm"
                    >
                      Advance Phase
                    </button>
                  )}
                  <button className="text-primary font-bold hover:underline cursor-pointer">View Roadmap</button>
                </div>
              </div>
            </div>
          </div>

          {/* Phase 3: Sourcing */}
          <div className="flex flex-col md:flex-row gap-8 items-start group">
            <div className="hidden md:flex flex-col items-center pt-2">
              <div className={`w-20 h-20 rounded-full text-white flex items-center justify-center z-10 border-4 border-white shadow-md group-hover:scale-105 transition-transform flex-shrink-0 font-bold ${
                currentPhaseIndex > 3
                  ? 'bg-emerald-green'
                  : event.phase === 'Vendor Sourcing'
                  ? 'bg-primary animate-pulse step-active-glow'
                  : 'bg-surface-container-highest text-on-surface-variant'
              }`}>
                {currentPhaseIndex > 3 ? <CheckCircle size={24} /> : currentPhaseIndex === 3 ? <Activity size={24} /> : <Lock size={20} />}
              </div>
            </div>
            <div className={`flex-1 bg-white p-8 rounded-card shadow-sm border hover:shadow-md transition-all ${
              event.phase === 'Vendor Sourcing' ? 'border-2 border-primary/20 shadow-md' : 'border-border-gray'
            } ${currentPhaseIndex < 3 ? 'opacity-60' : ''}`}>
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <span className={`px-3 py-1 text-label-sm rounded-full mb-3 inline-block font-bold ${
                    currentPhaseIndex > 3
                      ? 'bg-emerald-green/10 text-emerald-green'
                      : event.phase === 'Vendor Sourcing'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    {currentPhaseIndex > 3 ? 'Complete' : event.phase === 'Vendor Sourcing' ? 'Active Phase' : 'Pending'}
                  </span>
                  <h3 className="font-hanken text-headline-md font-bold text-on-surface">Phase 03: Technical & Vendor Sourcing</h3>
                  <p className="text-body-md text-on-surface-variant mt-2 font-medium">
                    Reallocate equipment resources, sign AV rental agreements, secure catering menus, and start training teams.
                  </p>
                </div>
              </div>
              
              {/* Active Sub-tasks Checklist (Only shown if active/completed) */}
              {currentPhaseIndex >= 3 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-background-alt p-4 rounded-xl border border-border-gray/30 text-body-sm font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-green" />
                    <span>Venue Contract Signed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-primary" />
                    <span>AV Rentals (In Progress)</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-50">
                    <span className="w-4 h-4 rounded border border-outline-variant inline-block"></span>
                    <span>Staff Coordination briefing</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-border-gray/50 text-body-sm font-medium">
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1 font-bold">Lead Owner</p>
                  <p className="text-on-surface font-semibold">Elena Rodriguez</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1 font-bold">Start Date</p>
                  <p className="text-on-surface font-semibold">Jan 02, 2024</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1 font-bold">Target End</p>
                  <p className="text-on-surface font-semibold">Feb 15, 2024</p>
                </div>
                <div className="flex justify-end items-end gap-3">
                  {event.phase === 'Vendor Sourcing' && (
                    <button
                      onClick={handleAdvancePhase}
                      className="px-3 py-1 bg-primary text-white text-[10px] rounded-lg font-bold hover:bg-opacity-90 transition-all cursor-pointer shadow-sm"
                    >
                      Advance Phase
                    </button>
                  )}
                  <button className="text-primary font-bold hover:underline cursor-pointer">Manage Tasks</button>
                </div>
              </div>
            </div>
          </div>

          {/* Phase 4: Execution */}
          <div className="flex flex-col md:flex-row gap-8 items-start group">
            <div className="hidden md:flex flex-col items-center pt-2">
              <div className={`w-20 h-20 rounded-full text-white flex items-center justify-center z-10 border-4 border-white shadow-md group-hover:scale-105 transition-transform flex-shrink-0 font-bold ${
                currentPhaseIndex > 4
                  ? 'bg-emerald-green'
                  : event.phase === 'Execution'
                  ? 'bg-primary animate-pulse step-active-glow'
                  : 'bg-surface-container-highest text-on-surface-variant'
              }`}>
                {currentPhaseIndex > 4 ? <CheckCircle size={24} /> : currentPhaseIndex === 4 ? <Activity size={24} /> : <Lock size={20} />}
              </div>
            </div>
            <div className={`flex-1 bg-white p-8 rounded-card shadow-sm border hover:shadow-md transition-all ${
              event.phase === 'Execution' ? 'border-2 border-primary/20 shadow-md' : 'border-border-gray'
            } ${currentPhaseIndex < 4 ? 'opacity-60' : ''}`}>
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <span className={`px-3 py-1 text-label-sm rounded-full mb-3 inline-block font-bold ${
                    currentPhaseIndex > 4
                      ? 'bg-emerald-green/10 text-emerald-green'
                      : event.phase === 'Execution'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    {currentPhaseIndex > 4 ? 'Complete' : event.phase === 'Execution' ? 'Active Phase' : 'Pending'}
                  </span>
                  <h3 className="font-hanken text-headline-md font-bold text-on-surface">Phase 04: Live Event Execution</h3>
                  <p className="text-body-md text-on-surface-variant mt-2 font-medium">
                    Command center deployment, immediate incident resolution, live checklists, and attendee registrations tracker.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-border-gray/50 text-body-sm font-medium">
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1 font-bold">Lead Owner</p>
                  <p className="text-on-surface font-semibold">Alexander West</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1 font-bold">Start Date</p>
                  <p className="text-on-surface font-semibold">Mar 10, 2024</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1 font-bold">End Date</p>
                  <p className="text-on-surface font-semibold">Mar 12, 2024</p>
                </div>
                <div className="flex justify-end items-end gap-3">
                  {event.phase === 'Execution' && (
                    <button
                      onClick={handleAdvancePhase}
                      className="px-3 py-1 bg-primary text-white text-[10px] rounded-lg font-bold hover:bg-opacity-90 transition-all cursor-pointer shadow-sm"
                    >
                      Advance Phase
                    </button>
                  )}
                  <button className="text-primary font-bold hover:underline cursor-pointer">Command Center</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Phase Insights Graph */}
      <div className="mt-12">
        <h3 className="font-hanken text-headline-lg font-bold text-on-surface mb-8">
          Phase Efficiency & Insights
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {/* Chart Card */}
          <div className="lg:col-span-2 bg-white p-8 rounded-card border border-border-gray shadow-sm flex flex-col justify-between overflow-hidden relative">
            <div>
              <h4 className="font-hanken text-headline-md font-bold text-on-surface mb-2">Phase Velocity</h4>
              <p className="text-body-md text-on-surface-variant font-medium">
                Comparison of planned vs. actual completion time (Days) across phases.
              </p>
            </div>
            
            <div className="h-56 mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockVelocityData}>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} style={{ fontSize: '11px', fill: '#584140' }} />
                  <YAxis tickLine={false} axisLine={false} style={{ fontSize: '11px', fill: '#584140' }} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Bar dataKey="Planned" fill="#dee9fc" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Actual" fill="#ae2f34" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expedite CTA Card */}
          <div className="bg-primary text-white p-8 rounded-card shadow-lg flex flex-col justify-between overflow-hidden relative group">
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
            <div className="relative z-10">
              <span className="text-[40px] block mb-4">⚡</span>
              <h4 className="font-hanken text-headline-md font-bold leading-tight">Expedite Current Phase</h4>
              <p className="text-body-sm text-white/80 mt-2 font-medium">
                Are some tasks lagging? Generate an optimized staff or equipment reallocation plan automatically to meet deadlines.
              </p>
            </div>
            <button className="mt-8 py-3 bg-white text-primary font-bold rounded-xl hover:bg-off-white transition-colors cursor-pointer text-label-md relative z-10 shadow-md active:scale-98">
              Start Optimization
            </button>
          </div>
        </div>
      </div>

      {/* Add Phase Modal Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-gutter">
          <div className="glass-panel w-full max-w-lg p-8 rounded-[32px] border border-white/40 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-hanken text-headline-md font-bold text-on-surface">Add New Phase</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 hover:bg-black/5 rounded-full text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddPhaseSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-label-sm text-on-surface-variant font-bold uppercase">Phase Title</label>
                <input
                  value={newPhaseName}
                  onChange={(e) => setNewPhaseName(e.target.value)}
                  className="w-full bg-background-alt border-none rounded-xl p-4 font-sans text-body-md focus:bg-white transition-all"
                  placeholder="e.g. Stage Logistics & Dry Runs"
                  type="text"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-label-sm text-on-surface-variant font-bold uppercase">Start Date</label>
                  <input
                    value={newPhaseStart}
                    onChange={(e) => setNewPhaseStart(e.target.value)}
                    className="w-full bg-background-alt border-none rounded-xl p-4 font-sans text-body-md focus:bg-white transition-all cursor-pointer"
                    type="date"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] text-on-surface-variant font-bold uppercase">Target End</label>
                  <input
                    value={newPhaseEnd}
                    onChange={(e) => setNewPhaseEnd(e.target.value)}
                    className="w-full bg-background-alt border-none rounded-xl p-4 font-sans text-body-md focus:bg-white transition-all cursor-pointer"
                    type="date"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] text-on-surface-variant font-bold uppercase">Assign Owner Lead</label>
                <select
                  value={newPhaseLead}
                  onChange={(e) => setNewPhaseLead(e.target.value)}
                  className="w-full bg-background-alt border-none rounded-xl p-4 font-sans text-body-md focus:bg-white transition-all cursor-pointer"
                >
                  <option value="">Select team member...</option>
                  <option value="Alexander West">Alexander West</option>
                  <option value="Julianne Moore">Julianne Moore</option>
                  <option value="David Chen">David Chen</option>
                  <option value="Elena Rodriguez">Elena Rodriguez</option>
                </select>
              </div>
              
              <button
                type="submit"
                className="w-full py-4 btn-gradient text-white font-hanken text-label-md font-bold rounded-2xl shadow-lg mt-4 cursor-pointer"
              >
                Create Phase
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
