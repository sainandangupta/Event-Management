'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Boxes,
  Users,
  Building,
  Wrench,
  Truck,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Calendar,
  Search,
  Check,
  Loader2
} from 'lucide-react';
import { useEventManagementStore } from '../../modules/event-management/services/store';
import { useResources, useUpdateResource } from '../../modules/event-management/hooks/queries';
import { ResourceCategory, ResourceStatus } from '../../modules/event-management/types';

function ResourcesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'dashboard';

  const { events } = useEventManagementStore();
  const { data: resources = [], isLoading: resourcesLoading } = useResources();
  const updateResourceMutation = useUpdateResource();

  // Filter & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  
  // Allocation form state
  const [selectedResId, setSelectedResId] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');

  // Statistics
  const stats = useMemo(() => {
    const total = resources.length;
    const allocated = resources.filter((r) => r.status === 'Allocated').length;
    const conflicts = resources.filter((r) => r.status === 'Conflict').length;
    const available = total - allocated - conflicts;

    const staffCount = resources.filter((r) => r.category === 'Staff').length;
    const venueCount = resources.filter((r) => r.category === 'Venue').length;
    const equipCount = resources.filter((r) => r.category === 'Equipment').length;
    const vehicleCount = resources.filter((r) => r.category === 'Vehicle').length;

    return { total, allocated, conflicts, available, staffCount, venueCount, equipCount, vehicleCount };
  }, [resources]);

  // Chart Data: Utilization rates per resource
  const chartData = useMemo(() => {
    return resources.map((r) => ({
      name: r.name.length > 15 ? r.name.substring(0, 15) + '...' : r.name,
      utilization: r.utilization,
    }));
  }, [resources]);

  // Filtered resources list for Directory
  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.details.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory =
        categoryFilter === 'All' || r.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [resources, searchTerm, categoryFilter]);

  // Handle resource assignment
  const handleAssignResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResId || !selectedEventId) return;

    await updateResourceMutation.mutateAsync({
      id: selectedResId,
      updates: {
        status: 'Allocated',
        allocation: selectedEventId,
        utilization: Math.min(Math.round(Math.random() * 30) + 70, 100) // Mock high utilization
      }
    });

    alert('Resource allocated successfully!');
    setSelectedResId('');
    setSelectedEventId('');
  };

  // Handle Resolve Conflict
  const handleResolveConflict = async (resId: string) => {
    if (confirm('Resolve booking conflict for this resource?')) {
      await updateResourceMutation.mutateAsync({
        id: resId,
        updates: {
          status: 'Allocated',
          conflictDetails: undefined
        }
      });
      alert('Conflict resolved. Resource marked as Allocated.');
    }
  };

  if (resourcesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h2 className="font-hanken text-headline-lg font-bold text-on-surface">Resource Management</h2>
          <p className="text-body-lg text-on-surface-variant mt-1">
            Track staff allocation schedules, venue capacity settings, equipment, and vehicles.
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => router.push('/resources?view=dashboard')}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 cursor-pointer text-label-md transition-colors ${
              view === 'dashboard' ? 'bg-primary text-white' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            <Boxes size={16} />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => router.push('/resources?view=directory')}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 cursor-pointer text-label-md transition-colors ${
              view === 'directory' ? 'bg-primary text-white' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            <Search size={16} />
            <span>Directory</span>
          </button>
          <button
            onClick={() => router.push('/resources?view=allocation')}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 cursor-pointer text-label-md transition-colors ${
              view === 'allocation' ? 'bg-primary text-white' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            <Calendar size={16} />
            <span>Allocation Center</span>
          </button>
          <button
            onClick={() => router.push('/resources?view=conflicts')}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 cursor-pointer text-label-md transition-colors relative ${
              view === 'conflicts' ? 'bg-primary text-white' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            <AlertTriangle size={16} />
            <span>Conflicts</span>
            {stats.conflicts > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-error text-white font-sans text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                {stats.conflicts}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <p className="text-on-surface-variant font-sans text-label-sm uppercase font-semibold">Total Staff</p>
            <p className="font-hanken text-headline-md font-bold text-on-surface">{stats.staffCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary-container/30 text-secondary flex items-center justify-center">
            <Building size={20} />
          </div>
          <div>
            <p className="text-on-surface-variant font-sans text-label-sm uppercase font-semibold">Venues Managed</p>
            <p className="font-hanken text-headline-md font-bold text-on-surface">{stats.venueCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-tertiary-container/30 text-tertiary flex items-center justify-center">
            <Wrench size={20} />
          </div>
          <div>
            <p className="text-on-surface-variant font-sans text-label-sm uppercase font-semibold">Equipment kits</p>
            <p className="font-hanken text-headline-md font-bold text-on-surface">{stats.equipCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center">
            <Truck size={20} />
          </div>
          <div>
            <p className="text-on-surface-variant font-sans text-label-sm uppercase font-semibold">Vehicles fleets</p>
            <p className="font-hanken text-headline-md font-bold text-on-surface">{stats.vehicleCount}</p>
          </div>
        </div>
      </div>

      {/* ==============================================================
          VIEW 1: DASHBOARD
          ============================================================== */}
      {view === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Bar Chart of utilization */}
          <div className="lg:col-span-2 bg-white p-8 rounded-card border border-border-gray shadow-sm">
            <h4 className="font-hanken text-headline-md font-bold text-on-surface mb-2">Resource Utilization</h4>
            <p className="text-body-sm text-on-surface-variant mb-6 font-medium">
              Current workload percentage allocation across active assets.
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} style={{ fontSize: '9px', fill: '#584140' }} />
                  <YAxis tickLine={false} axisLine={false} style={{ fontSize: '10px', fill: '#584140' }} />
                  <Tooltip />
                  <Bar dataKey="utilization" fill="#ae2f34" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Allocation details info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm">
              <h4 className="font-sans text-label-md font-bold text-on-surface mb-4">Availability Summary</h4>
              <div className="space-y-3 font-semibold text-body-sm text-on-surface">
                <div className="flex justify-between items-center py-2 border-b border-border-gray/30">
                  <span>Available Assets</span>
                  <span className="text-emerald-green">{stats.available}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border-gray/30">
                  <span>Allocated Assets</span>
                  <span className="text-primary">{stats.allocated}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border-gray/30">
                  <span>Active Double Bookings</span>
                  <span className="text-error">{stats.conflicts}</span>
                </div>
              </div>
            </div>

            {/* Incident helper warning */}
            {stats.conflicts > 0 && (
              <div className="bg-error-container p-6 rounded-card text-on-error-container shadow-sm border border-error/10">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={20} className="text-error" />
                  <h4 className="font-hanken text-label-md font-bold text-error uppercase">Active Conflict Alert</h4>
                </div>
                <p className="text-body-sm leading-relaxed font-medium">
                  We detected an AV double booking conflict on October 13th for the LED Video Wall 4K. Immediate re-scheduler reallocation recommended.
                </p>
                <button
                  onClick={() => router.push('/resources?view=conflicts')}
                  className="mt-4 px-4 py-2 bg-error text-white text-xs font-bold rounded-lg hover:bg-opacity-95 transition-all cursor-pointer shadow"
                >
                  Resolve Conflicts
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==============================================================
          VIEW 2: RESOURCE DIRECTORY
          ============================================================== */}
      {view === 'directory' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px] relative">
              <label className="block text-label-sm text-on-surface-variant mb-2 px-1 font-semibold">Search Assets</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-background-alt border-none rounded-xl py-3 pl-10 pr-4 text-body-sm focus:ring-2 focus:ring-primary/20 focus:bg-white"
                  placeholder="Search staff,venues,sound rigs..."
                  type="text"
                />
              </div>
            </div>

            <div className="w-[180px]">
              <label className="block text-label-sm text-on-surface-variant mb-2 px-1 font-semibold">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-background-alt border-none rounded-xl py-3 px-4 text-body-sm focus:ring-2 focus:ring-primary/20 focus:bg-white cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Staff">Staff Members</option>
                <option value="Venue">Venues</option>
                <option value="Equipment">Equipment</option>
                <option value="Vehicle">Vehicles</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-card border border-border-gray shadow-sm overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50 border-b border-border-gray text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                    <th className="px-8 py-5">Asset Name</th>
                    <th className="px-6 py-5">Category</th>
                    <th className="px-6 py-5">Description details</th>
                    <th className="px-6 py-5">Utilization rate</th>
                    <th className="px-6 py-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-gray text-body-md font-medium">
                  {filteredResources.map((res) => (
                    <tr key={res.id} className="hover:bg-surface/30 transition-colors">
                      <td className="px-8 py-5">
                        <div className="font-bold text-on-surface">{res.name}</div>
                        <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-0.5">{res.id}</div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-xs font-semibold">
                          {res.category}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-on-surface-variant text-body-sm font-medium">
                        {res.details}
                      </td>
                      <td className="px-6 py-5 font-bold text-on-surface">
                        {res.utilization}%
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          res.status === 'Available'
                            ? 'bg-emerald-green/10 text-emerald-green'
                            : res.status === 'Conflict'
                            ? 'bg-error-container text-error'
                            : 'bg-primary/10 text-primary'
                        }`}>
                          {res.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          VIEW 3: ALLOCATION CENTER
          ============================================================== */}
      {view === 'allocation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Allocation form */}
          <div className="bg-white p-8 rounded-card border border-border-gray shadow-sm h-fit">
            <h4 className="font-hanken text-headline-md font-bold text-on-surface mb-4">Allocate Asset</h4>
            <p className="text-body-sm text-on-surface-variant mb-6 font-medium">
              Schedule staff, gear or transport for an active event.
            </p>
            
            <form onSubmit={handleAssignResource} className="space-y-4 font-sans text-body-sm">
              <div className="space-y-2">
                <label className="block text-label-sm font-bold text-on-surface-variant uppercase">Select Resource</label>
                <select
                  value={selectedResId}
                  onChange={(e) => setSelectedResId(e.target.value)}
                  className="w-full bg-background-alt border-none rounded-xl p-3.5 focus:bg-white cursor-pointer transition-all font-semibold"
                  required
                >
                  <option value="">Choose asset...</option>
                  {resources.filter(r => r.status === 'Available').map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-label-sm font-bold text-on-surface-variant uppercase">Assign to Event</label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full bg-background-alt border-none rounded-xl p-3.5 focus:bg-white cursor-pointer transition-all font-semibold"
                  required
                >
                  <option value="">Choose event...</option>
                  {events.map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-opacity-95 transition-all cursor-pointer shadow shadow-primary/20 text-label-md"
              >
                Confirm Allocation
              </button>
            </form>
          </div>

          {/* Active Allocations overview list */}
          <div className="lg:col-span-2 bg-white p-8 rounded-card border border-border-gray shadow-sm">
            <h4 className="font-hanken text-headline-md font-bold text-on-surface mb-6">Active Allocations</h4>
            
            <div className="space-y-4">
              {resources.filter(r => r.status === 'Allocated').map((res) => {
                const assignedEvent = events.find(e => e.id === res.allocation);
                return (
                  <div key={res.id} className="flex justify-between items-center p-4 bg-background-alt rounded-xl border border-border-gray/30">
                    <div>
                      <h5 className="font-bold text-on-surface text-body-md">{res.name}</h5>
                      <p className="text-xs text-on-surface-variant font-medium mt-0.5">{res.details}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider block w-fit ml-auto mb-1">
                        {assignedEvent?.name || 'Assigned'}
                      </span>
                      <span className="text-[10px] font-bold text-on-surface-variant">Workload: {res.utilization}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          VIEW 4: CONFLICT CENTER
          ============================================================== */}
      {view === 'conflicts' && (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-card border border-border-gray shadow-sm">
            <h4 className="font-hanken text-headline-md font-bold text-on-surface mb-4">Double-Bookings & Schedule Overlaps</h4>
            <p className="text-body-md text-on-surface-variant font-medium">
              We proactively audit all system reservations to detect over-allocations.
            </p>
          </div>

          <div className="space-y-4">
            {resources.filter(r => r.status === 'Conflict').map((res) => (
              <div key={res.id} className="bg-error-container p-6 rounded-card border border-error/15 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-error text-white rounded-2xl flex-shrink-0">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-error">{res.name} ({res.category})</h4>
                    <p className="text-body-sm text-on-error-container mt-1 font-semibold leading-relaxed">
                      {res.conflictDetails || 'Double booking reservation flagged on key dates.'}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleResolveConflict(res.id)}
                  className="px-6 py-2.5 bg-error text-white font-bold rounded-xl hover:bg-opacity-95 shadow text-label-md cursor-pointer transition-all flex-shrink-0"
                >
                  Resolve Conflict
                </button>
              </div>
            ))}
            
            {resources.filter(r => r.status === 'Conflict').length === 0 && (
              <div className="bg-white p-12 text-center rounded-card border border-border-gray shadow-sm font-medium">
                <CheckCircle size={48} className="text-emerald-green mx-auto mb-4" />
                <h4 className="text-lg font-bold text-on-surface">No Active Conflicts</h4>
                <p className="text-on-surface-variant text-body-sm mt-1">All resource allocation schedules are healthy.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    }>
      <ResourcesPageContent />
    </Suspense>
  );
}
