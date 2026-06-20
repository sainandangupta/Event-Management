'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  MapPin,
  CheckCircle,
  Share2,
  Settings,
  Mail,
  Video,
  ChevronRight,
  TrendingUp,
  Image as ImageIcon,
  Plus,
  AlertCircle
} from 'lucide-react';
import { useEvent, useActivityLogs, useTasks, useBudgets } from '../../../modules/event-management/hooks/queries';
import { useEventManagementStore } from '../../../modules/event-management/services/store';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EventDetailsPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;

  const { data: event, isLoading: eventLoading } = useEvent(eventId);
  const { data: logs } = useActivityLogs(eventId);
  const { data: tasks } = useTasks(eventId);
  const { data: budgetData } = useBudgets(eventId);
  const { activeRole } = useEventManagementStore();

  if (eventLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="bg-white rounded-card p-12 text-center border border-border-gray shadow-sm max-w-lg mx-auto mt-12">
        <AlertCircle size={48} className="text-error mx-auto mb-4" />
        <h3 className="font-hanken text-headline-md font-bold text-on-surface mb-2">Event Not Found</h3>
        <p className="text-on-surface-variant mb-6">The event you are looking for does not exist or has been archived.</p>
        <button
          onClick={() => router.push('/events')}
          className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-opacity-90 transition-all cursor-pointer"
        >
          Return to Events List
        </button>
      </div>
    );
  }

  // Calculate days remaining (mock based on current local date and start month)
  const daysRemaining = event.status === 'Completed' ? 0 : 42;

  // Calculate stats from query layers
  const completionPercentage = event.progress || 0;
  const currentSummary = budgetData?.summaries?.[event.id];
  const totalEstimated = currentSummary?.totalEstimated || 350000;
  const totalActual = currentSummary?.totalActual || 240000;
  const budgetSpentPercent = Math.min(Math.round((totalActual / totalEstimated) * 100), 100) || 70;

  // Sub tab navigation items
  const tabs = [
    { label: 'Overview', path: `/events/${event.id}`, active: true },
    { label: 'Phases', path: `/events/${event.id}/lifecycle` },
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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-6">
        <div className="space-y-2">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-sans text-on-surface-variant font-medium mb-2">
            <Link href="/events" className="hover:text-primary">Events</Link>
            <ChevronRight size={12} className="opacity-60" />
            <span className="text-primary font-bold">Event Details</span>
          </nav>
          
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-hanken text-headline-lg font-bold text-on-surface">{event.name}</h2>
            <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
              event.status === 'Planned'
                ? 'text-emerald-green bg-emerald-green/10'
                : event.status === 'In Progress'
                ? 'text-sunset-orange bg-sunset-orange/10'
                : 'text-on-surface-variant bg-surface-container'
            }`}>
              {event.status}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-on-surface-variant opacity-85">
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-primary" />
              <span className="text-body-sm font-semibold">{event.venue}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} className="text-primary" />
              <span className="text-body-sm font-semibold">{event.dates}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => router.push(`/planning`)}
            className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface py-2.5 px-5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer text-label-md border border-border-gray/30"
          >
            <CheckCircle size={16} className="text-primary" />
            <span>Planning Handoff</span>
          </button>
          <button className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface py-2.5 px-5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer text-label-md border border-border-gray/30">
            <Share2 size={16} />
            <span>Export Report</span>
          </button>
          <button
            onClick={() => router.push(`/events/create`)}
            className="btn-gradient text-white py-2.5 px-6 rounded-xl font-bold shadow-lg shadow-primary/20 cursor-pointer text-label-md"
          >
            Edit Details
          </button>
        </div>
      </div>

      {/* Navigation tabs inside Details Panel */}
      <div className="glass-card mb-8 p-1.5 overflow-x-auto custom-scrollbar">
        <div className="flex items-center min-w-max gap-1">
          {tabs.map((tab) => (
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

      {/* Bento Layout Grid */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Left Side: Summary & Progress & Timelines */}
        <div className="col-span-12 lg:col-span-8 space-y-gutter">
          {/* Summary Hero Card */}
          <div className="glass-card p-8 min-h-[300px] flex flex-col relative overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl transition-all group-hover:bg-primary/10"></div>
            
            <div className="relative z-10">
              <span className="text-primary font-bold uppercase tracking-widest text-[10px] bg-primary/10 px-2.5 py-1 rounded-full">
                Project Summary
              </span>
              <h3 className="font-hanken text-[22px] font-bold mt-4 mb-4 text-on-surface leading-snug">
                {event.description}
              </h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed max-w-2xl font-medium">
                The {event.name} project is currently in the <span className="text-primary font-semibold">{event.phase}</span> phase. Our logistics coordinators, catering partners, and event hosts are aligned to maintain a premium hospitality experience for all registered delegates.
              </p>
            </div>

            {/* Micro KPI meters */}
            <div className="mt-auto pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-border-gray/50">
              <div className="space-y-1">
                <p className="text-[10px] text-on-surface-variant font-bold opacity-60 uppercase tracking-wider">COMPLETION</p>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-on-surface">{completionPercentage}%</span>
                  <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-on-surface-variant font-bold opacity-60 uppercase tracking-wider">DAYS REMAINING</p>
                <p className="text-xl font-bold text-on-surface">{daysRemaining}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-on-surface-variant font-bold opacity-60 uppercase tracking-wider">PRIORITY LEVEL</p>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-error animate-pulse"></span>
                  <p className="text-xl font-bold text-error">High</p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Dates & Milestones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {/* Key Dates Widget */}
            <div className="glass-card p-6">
              <div className="flex justify-between items-start mb-6">
                <h4 className="font-sans text-label-md font-bold text-primary">Key Dates</h4>
                <Calendar size={18} className="text-on-surface-variant" />
              </div>
              <ul className="space-y-4">
                <li className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-surface-container-low flex flex-col items-center justify-center border border-border-gray text-on-surface flex-shrink-0">
                    <span className="text-[9px] font-bold opacity-70">SEP</span>
                    <span className="text-base font-bold leading-none">28</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Catering Menu Tasting</p>
                    <p className="text-[11px] text-on-surface-variant font-medium">Confirmed • 2:00 PM</p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-surface-container-low flex flex-col items-center justify-center border border-border-gray text-on-surface flex-shrink-0">
                    <span className="text-[9px] font-bold opacity-70">OCT</span>
                    <span className="text-base font-bold leading-none">05</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Ballroom Production Rigging</p>
                    <p className="text-[11px] text-on-surface-variant font-medium">Pending Approval</p>
                  </div>
                </li>
                <li className="flex items-center gap-4 opacity-50">
                  <div className="w-11 h-11 rounded-xl bg-surface-container-low flex flex-col items-center justify-center border border-border-gray text-on-surface flex-shrink-0">
                    <span className="text-[9px] font-bold opacity-70">OCT</span>
                    <span className="text-base font-bold leading-none">14</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Event Launch & Dinner</p>
                    <p className="text-[11px] text-on-surface-variant font-medium">Opening Session</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Upcoming Milestones Widget */}
            <div className="glass-card p-6">
              <div className="flex justify-between items-start mb-6">
                <h4 className="font-sans text-label-md font-bold text-primary">Upcoming Milestones</h4>
                <TrendingUp size={18} className="text-on-surface-variant" />
              </div>
              <div className="space-y-5">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-bold mb-1 text-on-surface">
                    <span>Technical Rigging Setup</span>
                    <span>80%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[80%] rounded-full"></div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-bold mb-1 text-on-surface-variant">
                    <span>Guest List Finalization</span>
                    <span>45%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[45%] rounded-full"></div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-bold mb-1 text-on-surface-variant">
                    <span>Vendor Payments Dispatch</span>
                    <span>95%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div className="bg-emerald-green h-full w-[95%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Lead Manager, Incident Stream, & Stats */}
        <div className="col-span-12 lg:col-span-4 space-y-gutter">
          {/* Lead Manager Profile */}
          <div className="glass-card p-6">
            <h4 className="font-sans text-[10px] font-bold text-on-surface-variant mb-6 uppercase tracking-widest">
              Lead Owner
            </h4>
            <div className="flex items-center gap-4 mb-6">
              <img
                alt="Lead Owner"
                className="w-14 h-14 rounded-2xl object-cover shadow-sm border border-white"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuChYCJ6hzLqFe9WSsOPKslwerH33xk3SS24HeWsvuSasPlHPYwR5kztvp-xtSKLhgGXYyetj4zLbkiuzPaywrxzvNEiW1tHmEzve_dVYMIPHolstIP3em2A1cCREFwz_nBpCrOExKHvY3Pxe_FR3UwkgPMnNjPFOEgnfHAOOMXM10K8uISSe52Mx7WElmvH57j7W-9E0sFXKdIIfnfalAzdCPnyE4F_66U6qsYsTyA6y7oTyrBT6gGiuAQ7pd-GYyvzPygQMvGZKSIO"
              />
              <div>
                <p className="font-bold text-label-md text-on-surface text-base">{event.owner}</p>
                <p className="text-[11px] text-primary font-bold">Senior Event Director</p>
              </div>
            </div>
            
            <div className="space-y-2.5">
              <a
                href={`mailto:owner@eventhub360.com`}
                className="w-full py-2.5 rounded-xl border border-border-gray hover:bg-background-alt transition-colors font-semibold flex items-center justify-center gap-2 cursor-pointer text-label-md text-on-surface"
              >
                <Mail size={16} className="text-on-surface-variant" />
                <span>Contact Manager</span>
              </a>
              <button className="w-full py-2.5 rounded-xl border border-border-gray hover:bg-background-alt transition-colors font-semibold flex items-center justify-center gap-2 cursor-pointer text-label-md text-on-surface">
                <Video size={16} className="text-on-surface-variant" />
                <span>Join Sync Meeting</span>
              </button>
            </div>
          </div>

          {/* Activity Stream */}
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Activity Stream
              </h4>
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            </div>
            
            <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-border-gray">
              {logs && logs.length > 0 ? (
                logs.slice(0, 3).map((log) => (
                  <div key={log.id} className="relative pl-8">
                    <div className="absolute left-0 top-1 w-[22px] h-[22px] rounded-full bg-white border-4 border-primary z-10"></div>
                    <p className="text-xs font-bold text-on-surface">{log.action}</p>
                    <p className="text-[10px] text-on-surface-variant font-medium">
                      by {log.user} • {log.time}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-xs text-on-surface-variant font-medium">
                  No recent activity logged.
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 text-center">
              <p className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase mb-1">Guests Assigned</p>
              <p className="text-xl font-bold text-on-surface">1,240</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase mb-1">Active Vendors</p>
              <p className="text-xl font-bold text-on-surface">18</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Segment: Budget Ring and Visual concept board */}
      <div className="mt-gutter grid grid-cols-12 gap-gutter">
        {/* Budget Health circular diagram */}
        <div className="col-span-12 lg:col-span-4 glass-card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-sans text-label-md font-bold text-primary">Budget Health</h4>
            <span className="text-xs font-bold text-on-surface">
              ${totalActual.toLocaleString()} / ${totalEstimated.toLocaleString()}
            </span>
          </div>
          
          <div className="relative h-48 flex items-center justify-center">
            {/* SVG Ring */}
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                className="text-surface-container-high"
                cx="72"
                cy="72"
                fill="transparent"
                r="62"
                stroke="currentColor"
                strokeWidth="8"
              ></circle>
              <circle
                className="text-primary"
                cx="72"
                cy="72"
                fill="transparent"
                r="62"
                stroke="currentColor"
                strokeDasharray="389.5"
                strokeDashoffset={389.5 - (389.5 * budgetSpentPercent) / 100}
                strokeWidth="8"
                strokeLinecap="round"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-on-surface">{budgetSpentPercent}%</span>
              <span className="text-[9px] font-bold opacity-60 uppercase tracking-wider">Spent</span>
            </div>
          </div>
        </div>

        {/* Visual Concept Board */}
        <div className="col-span-12 lg:col-span-8 glass-card p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-sans text-label-md font-bold text-primary">Visual Concept Board</h4>
            <div className="flex items-center gap-4">
              <button className="text-xs font-bold text-on-surface-variant hover:text-primary flex items-center gap-1 cursor-pointer">
                <ImageIcon size={14} />
                <span>Manage Gallery</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 flex-1">
            <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group shadow-sm border border-border-gray/30">
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt="Main Ballroom Layout"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFNk6Sn1VQeXUtrUoX0VhsCg6juNDNjPOySFmz-VqOLgPgEQp_-CsIA_mU8nJpg3znHHiPPqKWQXufx47iQzOs9kjpdWMuBQCDfUEp2dk-2cKI1U5NwABZwkrWBkII_UotJq1JtpKQHsCRTIT8FwIwiD77GH9cdfH3J7ifgwdKK-LDxvvvejjz8ar_zOxYY0DeHddL0RFVnUSXSkVCiQYiIekKSPO-Hbu6pFIPMHo2r8Uh1ta9qe99-hd7WRWpnjn5cOHsWTARcJof"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <p className="text-white text-xs font-bold">Main Ballroom Layout</p>
              </div>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden group shadow-sm border border-border-gray/30">
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt="Cocktail Setup"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBM3RbWbU-Kll6tw1X4IVmPeSCMB288pJbAv__CVfDR3__KKXeETjxNGga5q_U79NphO8qvP09ElA_8_FJ0RZENhybeyN4TQ_nRieEXv_qjlvt8Lz_JKHmkW2JC4ssclsR5K4uRQCnEsxoYNGrI-jarmdbOQM1HtZSvKPH6RZxpAeQOG4tlws0ZxBN-hqIrEuVKRX3cGWvRcEGUmBYX9DS0wHwUKj2X1I3Nf0IbBSYcn-0H5RbrkMCqR0K1KcTg0F5tW4S-XbJWHJgs"
              />
            </div>
            
            <div className="relative rounded-2xl overflow-hidden group shadow-sm border border-border-gray/30">
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt="Light Installation"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4edrVEVlSqaemRMS1jQtfocwDQ-ZfiIBxkHvZtU2HRRpmSQBF8pu5wJdec4F7yzWvbVn9zWS6-sOx2Jffso_y5aZdYjHqO-wC68SZHCjMghlMdk6e53M9Ju4_i_3P7eIU4QT64dFV9m-dnAK_F32bV9hVS2poDclfsjTZBpaIPnKg6FM7un3v0XZA6GCW7VZBS7HJBvRNnf6zn_7RnFNhioTyNpnvx-C8Xh_b8AEtynSQJrbO5wZHbnPik0p_6XOa7Ve5lghF7XOr"
              />
            </div>
            
            <div className="relative rounded-2xl overflow-hidden group shadow-sm border border-border-gray/30">
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt="Premium Stationery"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDF80MnMAI38eJLzeKNo2yNajqKj9Q5gAn95tpIaDlv6l-YKS2zUxg89mCT6MAPr4d5OZ8eq2Bphc0NvOxplUuPcbTZiZS7SBvlQedieKgKrqyaCCoUlOKnZ1gVs7hDtZ0me5rmgPJtBEBNTufqUzPvgzSJHc0X1SnrZbhfZeJ7iN2rUwmjcjDpuJHgMdDLFpeOokUPtCkZTZ7Mi4PIVdk9JXYkjOyi1AcmaPLCAxzK8ilHGVsdgCze6GVKaAjRdCiiL6db6F27-Y-m"
              />
            </div>
            
            <div className="relative rounded-2xl overflow-hidden group shadow-sm border border-border-gray/30 cursor-pointer">
              <div className="w-full h-full bg-surface-container-high flex flex-col items-center justify-center gap-2 hover:bg-primary/5 transition-colors text-on-surface-variant hover:text-primary">
                <Plus size={22} />
                <span className="text-[9px] font-bold uppercase tracking-wider">Add Image</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
