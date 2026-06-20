'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarRange,
  CalendarDays,
  Boxes,
  DollarSign,
  Handshake,
  PlayCircle,
  FolderOpen,
  BarChart3,
  HelpCircle,
  Settings
} from 'lucide-react';

const navItems = [
  { label: 'Event Workspace', path: '/', icon: LayoutDashboard },
  { label: 'Events', path: '/events', icon: CalendarRange },
  { label: 'Planning', path: '/planning', icon: CalendarDays },
  { label: 'Resources', path: '/resources', icon: Boxes },
  { label: 'Budget', path: '/budget', icon: DollarSign },
  { label: 'Vendors', path: '/vendors', icon: Handshake },
  { label: 'Execution', path: '/execution', icon: PlayCircle },
  { label: 'Documents', path: '/documents', icon: FolderOpen },
  { label: 'Reporting', path: '/reporting', icon: BarChart3 }
];

export default function Sidebar() {
  const pathname = usePathname();

  // Helper to check if item path matches pathname
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <aside className="flex flex-col h-screen fixed left-0 top-0 py-base px-gutter bg-surface-container-low dark:bg-inverse-surface shadow-sm w-64 z-50 border-r border-border-gray">
      {/* Brand logo section */}
      <div className="mt-4 px-4 mb-8">
        <h1 className="font-hanken text-headline-md font-bold text-primary dark:text-inverse-primary leading-tight">
          EventHub360
        </h1>
        <p className="font-sans text-[10px] tracking-widest uppercase opacity-60 font-semibold text-on-surface-variant">
          Concierge Suite
        </p>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                active
                  ? 'text-primary dark:text-inverse-primary font-bold border-r-4 border-primary dark:border-inverse-primary bg-surface-container-high'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors'
              }`}
            >
              <Icon size={20} className={active ? 'text-primary' : 'opacity-70'} />
              <span className="font-sans text-label-md">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom links */}
      <div className="pt-4 border-t border-border-gray mt-auto pb-4 space-y-1">
        <Link
          href="/help"
          className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-surface-container-high transition-colors text-on-surface-variant"
        >
          <HelpCircle size={18} className="opacity-70" />
          <span className="font-sans text-label-md">Help</span>
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-surface-container-high transition-colors text-on-surface-variant"
        >
          <Settings size={18} className="opacity-70" />
          <span className="font-sans text-label-md">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
