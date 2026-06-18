'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Store,
  Star,
  Activity,
  Award,
  CheckCircle,
  Clock,
  Mail,
  User,
  Plus,
  Loader2,
  AlertCircle,
  Search,
  Check
} from 'lucide-react';
import { useEventManagementStore } from '../../modules/event-management/services/store';
import { useVendors, useUpdateVendorDeliverable } from '../../modules/event-management/hooks/queries';

function VendorsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'directory';

  const { data: vendors = [], isLoading: vendorsLoading } = useVendors();
  const updateDeliverableMutation = useUpdateVendorDeliverable();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');

  // Stats calculation
  const stats = useMemo(() => {
    const total = vendors.length;
    const totalAssignments = vendors.reduce((acc, curr) => acc + curr.activeAssignments, 0);
    const avgReliability = Math.round(
      vendors.reduce((acc, curr) => acc + curr.reliabilityScore, 0) / (total || 1)
    );

    return { total, totalAssignments, avgReliability };
  }, [vendors]);

  // Aggregate all deliverables from all vendors
  const allDeliverables = useMemo(() => {
    return vendors.flatMap((v) =>
      v.deliverables.map((d) => ({
        vendorId: v.id,
        vendorName: v.name,
        ...d
      }))
    );
  }, [vendors]);

  const handleUpdateDeliverableStatus = async (vendorId: string, deliverableId: string, status: 'Completed' | 'In Progress') => {
    await updateDeliverableMutation.mutateAsync({
      vendorId,
      deliverableId,
      status
    });
    alert('Deliverable status updated!');
  };

  // Filtered vendors
  const filteredVendors = useMemo(() => {
    return vendors.filter((v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.contact.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [vendors, searchTerm]);

  // Chart data: Reliability score
  const chartData = useMemo(() => {
    return vendors.map((v) => ({
      name: v.name,
      Score: v.reliabilityScore,
    }));
  }, [vendors]);

  if (vendorsLoading) {
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
          <h2 className="font-hanken text-headline-lg font-bold text-on-surface">Vendor Management</h2>
          <p className="text-body-lg text-on-surface-variant mt-1">
            Browse corporate vendors directory, assign deliverables, and monitor performance.
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => router.push('/vendors?view=directory')}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 cursor-pointer text-label-md transition-colors ${
              view === 'directory' ? 'bg-primary text-white' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            <Store size={16} />
            <span>Directory</span>
          </button>
          <button
            onClick={() => router.push('/vendors?view=assignments')}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 cursor-pointer text-label-md transition-colors ${
              view === 'assignments' ? 'bg-primary text-white' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            <Clock size={16} />
            <span>Deliverables</span>
          </button>
          <button
            onClick={() => router.push('/vendors?view=performance')}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 cursor-pointer text-label-md transition-colors ${
              view === 'performance' ? 'bg-primary text-white' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            <Award size={16} />
            <span>Performance</span>
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Store size={20} />
          </div>
          <div>
            <p className="text-on-surface-variant font-sans text-label-sm uppercase font-semibold">Registered Vendors</p>
            <p className="font-hanken text-headline-md font-bold text-on-surface">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary-container/30 text-secondary flex items-center justify-center">
            <Activity size={20} />
          </div>
          <div>
            <p className="text-on-surface-variant font-sans text-label-sm uppercase font-semibold font-bold">Active Deliverables</p>
            <p className="font-hanken text-headline-md font-bold text-on-surface">{allDeliverables.filter(d => d.status !== 'Completed').length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-green/10 text-emerald-green flex items-center justify-center">
            <Award size={20} />
          </div>
          <div>
            <p className="text-on-surface-variant font-sans text-label-sm uppercase font-semibold">Avg Reliability Index</p>
            <p className="font-hanken text-headline-md font-bold text-emerald-green">{stats.avgReliability}%</p>
          </div>
        </div>
      </div>

      {/* ==============================================================
          VIEW 1: DIRECTORY & CARDS
          ============================================================== */}
      {view === 'directory' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm flex items-center gap-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background-alt border-none rounded-xl py-3 pl-10 pr-4 text-body-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                placeholder="Search vendors by name, category..."
                type="text"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <div key={vendor.id} className="bg-white p-6 rounded-card border border-border-gray shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-xs font-semibold">
                      {vendor.category}
                    </span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: Math.round(vendor.rating) }).map((_, i) => (
                        <Star key={i} size={12} className="text-sunset-orange fill-sunset-orange" />
                      ))}
                    </div>
                  </div>

                  <h4 className="font-hanken text-headline-md font-bold text-on-surface mb-2">{vendor.name}</h4>
                  
                  <div className="space-y-2 mt-4 text-body-sm font-medium text-on-surface-variant">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-primary" />
                      <span>Contact: {vendor.contact}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-primary" />
                      <span className="truncate">{vendor.email}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-border-gray/50 flex justify-between items-center text-body-sm font-semibold">
                  <div>
                    <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider block">Reliability</span>
                    <span className="text-emerald-green font-bold">{vendor.reliabilityScore}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider block text-right">Assignments</span>
                    <span className="text-on-surface font-bold text-right block">{vendor.activeAssignments} Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==============================================================
          VIEW 2: DELIVERABLES TRACKING
          ============================================================== */}
      {view === 'assignments' && (
        <div className="bg-white rounded-card border border-border-gray shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border-gray">
            <h4 className="font-hanken text-headline-md font-bold text-on-surface">Vendor Assignments Ledger</h4>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50 border-b border-border-gray text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                  <th className="px-8 py-5">Deliverable details</th>
                  <th className="px-6 py-5">Vendor Partner</th>
                  <th className="px-6 py-5">Due Date</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-gray text-body-md font-medium">
                {allDeliverables.map((item) => (
                  <tr key={item.id} className="hover:bg-surface/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="font-bold text-on-surface">{item.name}</div>
                      <div className="text-[10px] text-on-surface-variant font-bold mt-0.5 uppercase tracking-wider">{item.id}</div>
                    </td>
                    <td className="px-6 py-5 text-on-surface font-bold">
                      {item.vendorName}
                    </td>
                    <td className="px-6 py-5 text-body-sm text-on-surface font-medium">
                      {item.dueDate}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        item.status === 'Completed'
                          ? 'bg-emerald-green/10 text-emerald-green'
                          : 'bg-secondary-container/20 text-secondary'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        {item.status !== 'Completed' && (
                          <button
                            onClick={() => handleUpdateDeliverableStatus(item.vendorId, item.id, 'Completed')}
                            className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded hover:bg-opacity-95 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                          >
                            <Check size={10} />
                            <span>Mark Complete</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==============================================================
          VIEW 3: PERFORMANCE GRAPH
          ============================================================== */}
      {view === 'performance' && (
        <div className="bg-white p-8 rounded-card border border-border-gray shadow-sm">
          <h4 className="font-hanken text-headline-md font-bold text-on-surface mb-2">Reliability Indices</h4>
          <p className="text-body-sm text-on-surface-variant mb-6 font-medium">
            Comparative vendor performance score (%) based on timelines delivery and quality audit reviews.
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} style={{ fontSize: '11px', fill: '#584140' }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: '11px', fill: '#584140' }} />
                <Tooltip />
                <Bar dataKey="Score" fill="#ae2f34" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VendorsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    }>
      <VendorsPageContent />
    </Suspense>
  );
}
