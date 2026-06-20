'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, MessageSquare, Search, ShieldCheck, Calendar } from 'lucide-react';
import { useEventManagementStore } from '../../modules/event-management/services/store';
import { UserRole } from '../../modules/event-management/types';

export default function Header() {
  const pathname = usePathname();
  const {
    events,
    currentEventId,
    setCurrentEventId,
    activeRole,
    setRole,
    currentUser
  } = useEventManagementStore();

  // Find current active event
  const currentEvent = events.find((e) => e.id === currentEventId) || events[0];

  // Contextual Sub-navigation based on paths
  const getSubTabs = () => {
    if (pathname.startsWith('/events')) {
      const eventId = currentEventId || 'event-1';
      return [
        { label: 'Overview', path: '/events' },
        { label: 'Lifecycle', path: `/events/${eventId}/lifecycle` },
        { label: 'Team', path: `/events/${eventId}/team` },
      ];
    }
    if (pathname.startsWith('/planning')) {
      return [
        { label: 'Dashboard', path: '/planning' },
        { label: 'Kanban', path: '/planning?view=kanban' },
        { label: 'Gantt', path: '/planning?view=gantt' },
        { label: 'Calendar', path: '/planning?view=calendar' },
      ];
    }
    if (pathname.startsWith('/resources')) {
      return [
        { label: 'Dashboard', path: '/resources' },
        { label: 'Directory', path: '/resources?view=directory' },
        { label: 'Allocation', path: '/resources?view=allocation' },
        { label: 'Conflicts', path: '/resources?view=conflicts' },
      ];
    }
    if (pathname.startsWith('/budget')) {
      return [
        { label: 'Dashboard', path: '/budget' },
        { label: 'Expenses', path: '/budget?view=expenses' },
        { label: 'Approval', path: '/budget?view=approval' },
      ];
    }
    if (pathname.startsWith('/vendors')) {
      return [
        { label: 'Directory', path: '/vendors' },
        { label: 'Assignments', path: '/vendors?view=assignments' },
        { label: 'Performance', path: '/vendors?view=performance' },
      ];
    }
    if (pathname.startsWith('/execution')) {
      return [
        { label: 'Command Center', path: '/execution' },
        { label: 'Incidents', path: '/execution?view=incidents' },
        { label: 'Checklist', path: '/execution?view=checklist' },
      ];
    }
    if (pathname.startsWith('/documents')) {
      return [
        { label: 'Library', path: '/documents' },
        { label: 'Attachments', path: '/documents?view=attachments' },
      ];
    }
    if (pathname.startsWith('/reporting')) {
      return [
        { label: 'Overview', path: '/reporting' },
        { label: 'Profitability', path: '/reporting?view=profitability' },
        { label: 'Utilization', path: '/reporting?view=utilization' },
      ];
    }
    return [
      { label: 'Overview', path: '/' },
      { label: 'Directives', path: '/directives' },
    ];
  };

  const subTabs = getSubTabs();

  return (
    <header className="flex justify-between items-center w-[calc(100%-16rem)] h-16 px-gutter fixed top-0 z-40 ml-64 bg-surface/60 backdrop-blur-xl border-b border-border-gray shadow-sm">
      {/* Left section: Search & Sub-tabs */}
      <div className="flex items-center gap-6 flex-1">
        {/* Global Search Bar */}
        <div className="relative w-full max-w-xs group">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-50 group-focus-within:text-primary transition-colors"
          />
          <input
            className="w-full bg-background-alt border-none rounded-full py-1.5 pl-10 pr-4 text-body-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
            placeholder="Search suite..."
            type="text"
          />
        </div>

        {/* Dynamic Contextual Sub-tabs */}
        <nav className="hidden md:flex items-center gap-6">
          {subTabs.map((tab) => {
            const active = pathname === tab.path || (typeof window !== 'undefined' && pathname + window.location.search === tab.path);
            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={`${
                  active
                    ? 'text-primary border-b-2 border-primary pb-1 font-bold'
                    : 'text-on-surface-variant hover:text-primary transition-all'
                } font-sans text-label-md`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right section: Event Context, RBAC Role switcher, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Global Event Context Selector */}
        <div className="flex items-center gap-1.5 bg-background-alt px-3 py-1.5 rounded-full border border-border-gray shadow-sm">
          <Calendar size={14} className="text-primary" />
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Event:</span>
          <select
            value={currentEventId || ''}
            onChange={(e) => setCurrentEventId(e.target.value || null)}
            className="bg-transparent border-none py-0 pl-1 pr-6 text-xs font-bold text-on-surface focus:ring-0 focus:shadow-none cursor-pointer"
          >
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.name}
              </option>
            ))}
          </select>
        </div>

        {/* RBAC Role Switcher */}
        <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 shadow-sm">
          <ShieldCheck size={14} className="text-primary" />
          <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Role:</span>
          <select
            value={activeRole}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="bg-transparent border-none py-0 pl-1 pr-6 text-xs font-bold text-primary focus:ring-0 focus:shadow-none cursor-pointer"
          >
            <option value="Event Manager" className="text-on-surface">Event Manager</option>
            <option value="Finance Manager" className="text-on-surface">Finance Manager</option>
            <option value="Vendor" className="text-on-surface">Vendor</option>
          </select>
        </div>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-border-gray"></div>

        {/* Messages & Notifications Icons */}
        <div className="flex gap-2 items-center">
          <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors relative" title="Notifications">
            <Bell size={18} className="text-on-surface-variant" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full border border-surface"></span>
          </button>
          <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors" title="Messages">
            <MessageSquare size={18} className="text-on-surface-variant" />
          </button>
        </div>

        {/* Profile image & Info */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="h-8 w-8 rounded-full overflow-hidden border border-border-gray group-hover:border-primary transition-colors">
            <img
              alt="Manager profile"
              className="w-full h-full object-cover"
              src={currentUser.avatar}
            />
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-[11px] font-bold text-on-surface leading-tight group-hover:text-primary transition-colors">
              {currentUser.name}
            </p>
            <p className="text-[9px] text-on-surface-variant opacity-75">
              {activeRole}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
