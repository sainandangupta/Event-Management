'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PlusCircle,
  Archive,
  Search,
  Calendar,
  ChevronRight,
  Eye,
  Edit,
  Building,
  Heart,
  PartyPopper,
  Briefcase,
  ChevronLeft
} from 'lucide-react';
import { useEventManagementStore } from '../../modules/event-management/services/store';
import { EventCategory, EventStatus } from '../../modules/event-management/types';

export default function EventsListDashboard() {
  const router = useRouter();
  const { events, deleteEvent, setCurrentEventId } = useEventManagementStore();

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All Statuses');
  const [categoryFilter, setCategoryFilter] = useState<string>('All Categories');
  const [ownerFilter, setOwnerFilter] = useState<string>('Everyone');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Icons Helper
  const getEventIcon = (category: EventCategory) => {
    switch (category) {
      case 'Corporate':
        return <Building size={20} />;
      case 'Wedding':
        return <Heart size={20} />;
      case 'Gala':
        return <PartyPopper size={20} />;
      default:
        return <Briefcase size={20} />;
    }
  };

  // Bg Colors Helper
  const getEventIconBg = (category: EventCategory) => {
    switch (category) {
      case 'Corporate':
        return 'bg-primary-fixed text-primary';
      case 'Wedding':
        return 'bg-secondary-fixed text-secondary';
      case 'Gala':
        return 'bg-tertiary-fixed text-tertiary';
      default:
        return 'bg-surface-container text-on-surface-variant';
    }
  };

  // Status Badge Colors Helper
  const getStatusStyle = (status: EventStatus) => {
    switch (status) {
      case 'Planned':
        return 'text-emerald-green bg-emerald-green/10';
      case 'In Progress':
        return 'text-sunset-orange bg-sunset-orange/10';
      case 'Completed':
        return 'text-on-surface-variant/80 bg-surface-container';
      default:
        return 'text-on-surface bg-background-alt';
    }
  };

  const getStatusDot = (status: EventStatus) => {
    switch (status) {
      case 'Planned':
        return 'bg-emerald-green';
      case 'In Progress':
        return 'bg-sunset-orange';
      case 'Completed':
        return 'bg-on-surface-variant';
      default:
        return 'bg-on-surface';
    }
  };

  // Filter Logic
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchesSearch =
        evt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.owner.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus =
        statusFilter === 'All Statuses' || evt.status === statusFilter;
      
      const matchesCategory =
        categoryFilter === 'All Categories' || evt.category === categoryFilter;
      
      const matchesOwner =
        ownerFilter === 'Everyone' || evt.owner === ownerFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesOwner;
    });
  }, [events, searchTerm, statusFilter, categoryFilter, ownerFilter]);

  // Pagination Logic
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEvents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEvents, currentPage]);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage) || 1;

  const handleViewDetails = (eventId: string) => {
    setCurrentEventId(eventId);
    router.push(`/events/${eventId}`);
  };

  const handleArchive = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to archive this event?')) {
      deleteEvent(eventId);
    }
  };

  return (
    <div>
      {/* Header welcome & actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-label-sm text-on-surface-variant mb-2">
            <span className="hover:text-primary cursor-pointer">Event Hub</span>
            <ChevronRight size={14} className="opacity-60" />
            <span className="text-primary font-medium">Events</span>
          </nav>
          <h2 className="font-hanken text-headline-lg font-bold text-on-background">Events</h2>
          <p className="text-on-surface-variant mt-1 text-body-md">
            Manage and monitor your upcoming boutique experiences.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 rounded-full border border-border-gray hover:bg-white transition-all font-sans text-label-md flex items-center gap-2 cursor-pointer">
            <Archive size={18} className="opacity-70" />
            <span>Archive</span>
          </button>
          <Link href="/events/create" className="btn-gradient px-8 py-3 rounded-full text-white font-sans text-label-md flex items-center gap-2 shadow-lg shadow-primary/20 cursor-pointer">
            <PlusCircle size={18} />
            <span>Create Event</span>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-card shadow-sm p-6 mb-8 border border-border-gray flex flex-wrap items-end gap-4">
        {/* Search Input within Filter area */}
        <div className="flex-1 min-w-[200px] relative">
          <label className="block text-label-sm text-on-surface-variant mb-2 px-1 font-semibold">Search</label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background-alt border-none rounded-xl py-3 pl-10 pr-4 text-body-sm focus:ring-2 focus:ring-primary/20 focus:bg-white"
              placeholder="Search by name, venue..."
              type="text"
            />
          </div>
        </div>

        {/* Status Select */}
        <div className="w-[180px]">
          <label className="block text-label-sm text-on-surface-variant mb-2 px-1 font-semibold">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-background-alt border-none rounded-xl py-3 px-4 text-body-sm focus:ring-2 focus:ring-primary/20 focus:bg-white cursor-pointer"
          >
            <option>All Statuses</option>
            <option value="Planned">Planned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Category Select */}
        <div className="w-[180px]">
          <label className="block text-label-sm text-on-surface-variant mb-2 px-1 font-semibold">Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-background-alt border-none rounded-xl py-3 px-4 text-body-sm focus:ring-2 focus:ring-primary/20 focus:bg-white cursor-pointer"
          >
            <option>All Categories</option>
            <option value="Corporate">Corporate</option>
            <option value="Wedding">Wedding</option>
            <option value="Gala">Gala</option>
          </select>
        </div>

        {/* Owner Select */}
        <div className="w-[180px]">
          <label className="block text-label-sm text-on-surface-variant mb-2 px-1 font-semibold">Event Owner</label>
          <select
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            className="w-full bg-background-alt border-none rounded-xl py-3 px-4 text-body-sm focus:ring-2 focus:ring-primary/20 focus:bg-white cursor-pointer"
          >
            <option>Everyone</option>
            <option value="Julianne Moore">Julianne Moore</option>
            <option value="David Chen">David Chen</option>
            <option value="Elena Rodriguez">Elena Rodriguez</option>
          </select>
        </div>

        {/* Reset Button */}
        <button
          onClick={() => {
            setSearchTerm('');
            setStatusFilter('All Statuses');
            setCategoryFilter('All Categories');
            setOwnerFilter('Everyone');
          }}
          className="h-[48px] px-6 bg-surface-container text-primary font-sans text-label-md rounded-xl hover:bg-surface-container-high transition-colors cursor-pointer"
        >
          Reset
        </button>
      </div>

      {/* Data Table Section */}
      <div className="bg-white rounded-card shadow-sm border border-border-gray overflow-hidden mb-8">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-border-gray">
                <th className="px-8 py-5 font-sans text-label-md text-on-surface-variant uppercase tracking-wider">
                  Event Name
                </th>
                <th className="px-6 py-5 font-sans text-label-md text-on-surface-variant uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-5 font-sans text-label-md text-on-surface-variant uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-5 font-sans text-label-md text-on-surface-variant uppercase tracking-wider">
                  Est. Revenue
                </th>
                <th className="px-6 py-5 font-sans text-label-md text-on-surface-variant uppercase tracking-wider">
                  Team
                </th>
                <th className="px-6 py-5 font-sans text-label-md text-on-surface-variant uppercase tracking-wider">
                  Status
                </th>
                <th className="px-8 py-5 font-sans text-label-md text-on-surface-variant uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-gray">
              {paginatedEvents.length > 0 ? (
                paginatedEvents.map((evt) => (
                  <tr
                    key={evt.id}
                    onClick={() => handleViewDetails(evt.id)}
                    className="hover:bg-surface/50 transition-colors group cursor-pointer"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getEventIconBg(evt.category)}`}>
                          {getEventIcon(evt.category)}
                        </div>
                        <div>
                          <div className="font-semibold text-on-background group-hover:text-primary transition-colors text-label-md">
                            {evt.name}
                          </div>
                          <div className="text-body-sm text-on-surface-variant">
                            {evt.venue}
                          </div>
                          {/* Mini Progress Bar */}
                          <div className="mt-2 w-32 h-1.5 bg-surface-container rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-green rounded-full"
                              style={{ width: `${evt.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-label-sm font-semibold">
                        {evt.category}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-body-sm text-on-surface font-medium">
                      {evt.dates}
                    </td>
                    <td className="px-6 py-6 font-bold text-on-surface text-label-md">
                      ${evt.estimatedRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex -space-x-2">
                        {evt.team.slice(0, 3).map((member, index) => {
                          const initials = member
                            .split(' ')
                            .map((n) => n[0])
                            .join('');
                          return (
                            <div
                              key={index}
                              className="w-8 h-8 rounded-full border-2 border-white bg-surface-container flex items-center justify-center text-[10px] font-bold text-on-surface"
                            >
                              {initials}
                            </div>
                          );
                        })}
                        {evt.team.length > 3 && (
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-fixed text-primary flex items-center justify-center text-[10px] font-bold">
                            +{evt.team.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full w-fit ${getStatusStyle(evt.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(evt.status)}`}></span>
                        <span className="text-label-sm font-bold">{evt.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleViewDetails(evt.id)}
                          className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => router.push(`/events/edit?id=${evt.id}`)}
                          className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-secondary transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={(e) => handleArchive(evt.id, e)}
                          className="p-1.5 hover:bg-error-container rounded-lg text-error transition-colors cursor-pointer"
                          title="Archive"
                        >
                          <Archive size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-on-surface-variant">
                    No events found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="flex items-center justify-between px-8 py-5 bg-surface-container-low/30 border-t border-border-gray">
          <div className="text-body-sm text-on-surface-variant font-medium">
            Showing <span className="font-semibold text-on-surface">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-semibold text-on-surface">
              {Math.min(currentPage * itemsPerPage, filteredEvents.length)}
            </span>{' '}
            of <span className="font-semibold text-on-surface">{filteredEvents.length}</span> events
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-surface-container transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-9 h-9 rounded-lg font-sans text-label-md flex items-center justify-center cursor-pointer transition-colors ${
                  currentPage === idx + 1
                    ? 'bg-primary text-white font-bold'
                    : 'hover:bg-surface-container text-on-surface-variant'
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-surface-container transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Atmospheric Footer Decor */}
      <div className="mt-12 relative h-60 rounded-card overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-sunset-orange/10 flex items-center justify-center px-12 text-center">
          <div className="max-w-2xl">
            <h3 className="font-hanken text-headline-md font-bold text-primary mb-3">Planning a New Concept?</h3>
            <p className="text-on-surface-variant mb-5 text-body-sm leading-relaxed">
              Our concierge-level AI assistant can help draft your event schedule, coordinate logistics, and estimate revenue pipelines in seconds.
            </p>
            <button className="text-primary font-bold hover:underline flex items-center gap-1.5 mx-auto cursor-pointer text-label-md">
              <span>Learn more about EventHub AI</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-sunset-orange/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
