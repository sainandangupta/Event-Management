'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  Users,
  Download,
  FileText,
  Table,
  Loader2,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { useEventManagementStore } from '../../modules/event-management/services/store';
import { useEvents, useResources, useBudgets } from '../../modules/event-management/hooks/queries';

function ReportingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const { data: events = [] } = useEvents();
  const { data: resources = [] } = useResources();
  const { data: budgetData } = useBudgets();

  const [exporting, setExporting] = useState<string | null>(null);

  // Calculate high level summaries
  const stats = useMemo(() => {
    const totalRevenue = events.reduce((acc, curr) => acc + curr.estimatedRevenue, 0);
    const totalCost = events.reduce((acc, curr) => acc + curr.actualCost, 0);
    const profit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? Math.round((profit / totalRevenue) * 100) : 0;

    const staffResources = resources.filter(r => r.category === 'Staff');
    const avgUtilization = resources.length > 0 
      ? Math.round(resources.reduce((acc, curr) => acc + curr.utilization, 0) / resources.length) 
      : 0;

    return {
      totalRevenue,
      totalCost,
      profit,
      profitMargin,
      avgUtilization,
      totalResources: resources.length
    };
  }, [events, resources]);

  // Recharts data for Revenue vs Cost
  const profitabilityChartData = useMemo(() => {
    return events.map(e => ({
      name: e.name.length > 15 ? e.name.substring(0, 15) + '...' : e.name,
      Revenue: e.estimatedRevenue,
      Cost: e.actualCost || (budgetData?.summaries[e.id]?.totalActual) || 0,
    }));
  }, [events, budgetData]);

  // Recharts data for Resource Allocation by Category
  const resourceCategoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    resources.forEach(r => {
      categories[r.category] = (categories[r.category] || 0) + 1;
    });

    const colors = ['#ae2f34', '#FF8A5B', '#4CAF8D', '#a88ede', '#fed88e'];
    return Object.keys(categories).map((cat, idx) => ({
      name: cat,
      value: categories[cat],
      color: colors[idx % colors.length]
    }));
  }, [resources]);

  const handleExport = (type: string) => {
    setExporting(type);
    setTimeout(() => {
      setExporting(null);
      alert(`Report exported successfully as ${type.toUpperCase()}!`);
    }, 1500);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h2 className="font-hanken text-headline-lg font-bold text-on-surface">Reporting & Analytics</h2>
          <p className="text-body-lg text-on-surface-variant mt-1">
            Analyze profit margins, cost vs revenue trends, resource allocations, and export executive sheets.
          </p>
        </div>

        <div className="flex gap-2 bg-surface-container p-1 rounded-xl">
          <button
            onClick={() => router.push('/reporting?tab=overview')}
            className={`px-4 py-2 rounded-lg font-bold text-label-md transition-colors cursor-pointer ${
              activeTab === 'overview' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => router.push('/reporting?tab=profitability')}
            className={`px-4 py-2 rounded-lg font-bold text-label-md transition-colors cursor-pointer ${
              activeTab === 'profitability' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Profitability
          </button>
          <button
            onClick={() => router.push('/reporting?tab=resources')}
            className={`px-4 py-2 rounded-lg font-bold text-label-md transition-colors cursor-pointer ${
              activeTab === 'resources' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Resources
          </button>
          <button
            onClick={() => router.push('/reporting?tab=export')}
            className={`px-4 py-2 rounded-lg font-bold text-label-md transition-colors cursor-pointer ${
              activeTab === 'export' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Export Center
          </button>
        </div>
      </div>

      {/* Overview stats cards always shown at top */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <DollarSign size={20} />
          </div>
          <div>
            <p className="text-on-surface-variant font-sans text-label-sm uppercase font-semibold">Total Revenue</p>
            <p className="font-hanken text-headline-md font-bold text-on-surface">
              ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary-container/35 text-secondary flex items-center justify-center">
            <Briefcase size={20} />
          </div>
          <div>
            <p className="text-on-surface-variant font-sans text-label-sm uppercase font-semibold">Total Cost</p>
            <p className="font-hanken text-headline-md font-bold text-on-surface">
              ${stats.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-green/10 text-emerald-green flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-on-surface-variant font-sans text-label-sm uppercase font-semibold">Gross Profit Margin</p>
            <p className="font-hanken text-headline-md font-bold text-emerald-green">
              {stats.profitMargin}%
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/5 text-primary flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <p className="text-on-surface-variant font-sans text-label-sm uppercase font-semibold">Resource Utilization</p>
            <p className="font-hanken text-headline-md font-bold text-primary">
              {stats.avgUtilization}%
            </p>
          </div>
        </div>
      </div>

      {/* ==============================================================
          TAB: OVERVIEW
          ============================================================== */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-card border border-border-gray shadow-sm">
            <h4 className="font-hanken text-headline-md font-bold text-on-surface mb-2">Revenue vs Actual Cost Trend</h4>
            <p className="text-body-sm text-on-surface-variant mb-6">Comparison of total projected revenue against actual costs incurred by event.</p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profitabilityChartData}>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} style={{ fontSize: '11px', fill: '#584140' }} />
                  <YAxis tickLine={false} axisLine={false} style={{ fontSize: '11px', fill: '#584140' }} />
                  <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="Revenue" fill="#ae2f34" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Cost" fill="#FF8A5B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="font-hanken text-headline-md font-bold text-on-surface mb-2">Resource Category Mix</h4>
              <p className="text-body-sm text-on-surface-variant mb-6">Active allocation breakdown of directory resources.</p>
              <div className="relative h-48 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={resourceCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {resourceCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} items`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-headline-md font-bold text-on-surface">{stats.totalResources}</span>
                  <span className="text-label-sm text-on-surface-variant font-medium">Resources</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {resourceCategoryData.map((entry) => (
                <div key={entry.name} className="flex items-center justify-between font-semibold text-body-sm text-on-surface">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
                    <span>{entry.name}</span>
                  </div>
                  <span>{entry.value} ({Math.round((entry.value / stats.totalResources) * 100)}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          TAB: PROFITABILITY
          ============================================================== */}
      {activeTab === 'profitability' && (
        <div className="space-y-8">
          <div className="bg-white rounded-card border border-border-gray shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border-gray">
              <h4 className="font-hanken text-headline-md font-bold text-on-surface">Event Profitability Breakdown</h4>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50 border-b border-border-gray text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                    <th className="px-8 py-5">Event Details</th>
                    <th className="px-6 py-5">Estimated Revenue</th>
                    <th className="px-6 py-5">Actual Cost</th>
                    <th className="px-6 py-5">Net Profit</th>
                    <th className="px-8 py-5 text-right">Profit Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-gray text-body-md font-medium">
                  {events.map((e) => {
                    const cost = e.actualCost || (budgetData?.summaries[e.id]?.totalActual) || 0;
                    const profit = e.estimatedRevenue - cost;
                    const margin = e.estimatedRevenue > 0 ? Math.round((profit / e.estimatedRevenue) * 100) : 0;
                    return (
                      <tr key={e.id} className="hover:bg-surface/30 transition-colors">
                        <td className="px-8 py-5">
                          <div className="font-bold text-on-surface">{e.name}</div>
                          <div className="text-[10px] text-on-surface-variant font-bold mt-0.5 uppercase tracking-wider">{e.venue} | {e.dates}</div>
                        </td>
                        <td className="px-6 py-5 font-bold text-on-surface">
                          ${e.estimatedRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-5 font-bold text-on-surface-variant">
                          ${cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className={`px-6 py-5 font-bold ${profit >= 0 ? 'text-emerald-green' : 'text-error'}`}>
                          ${profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-8 py-5 text-right font-bold text-primary">
                          {margin}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          TAB: RESOURCES
          ============================================================== */}
      {activeTab === 'resources' && (
        <div className="space-y-8">
          <div className="bg-white rounded-card border border-border-gray shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border-gray">
              <h4 className="font-hanken text-headline-md font-bold text-on-surface">Resource Utilization Metrics</h4>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50 border-b border-border-gray text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                    <th className="px-8 py-5">Resource Name</th>
                    <th className="px-6 py-5">Category</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5">Current Assignment</th>
                    <th className="px-8 py-5 text-right">Utilization Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-gray text-body-md font-medium">
                  {resources.map((res) => {
                    const allocatedEvent = events.find(e => e.id === res.allocation);
                    return (
                      <tr key={res.id} className="hover:bg-surface/30 transition-colors">
                        <td className="px-8 py-5">
                          <div className="font-bold text-on-surface">{res.name}</div>
                          <div className="text-[10px] text-on-surface-variant font-bold mt-0.5 uppercase tracking-wider">{res.details}</div>
                        </td>
                        <td className="px-6 py-5 font-bold text-on-surface-variant">
                          {res.category}
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            res.status === 'Available'
                              ? 'bg-emerald-green/10 text-emerald-green'
                              : res.status === 'Conflict'
                              ? 'bg-error/10 text-error'
                              : 'bg-primary/10 text-primary'
                          }`}>
                            {res.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-body-sm font-semibold text-on-surface">
                          {allocatedEvent ? allocatedEvent.name : 'Unassigned'}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className="font-bold text-on-surface">{res.utilization}%</span>
                            <div className="w-16 bg-background-alt h-1.5 rounded-full overflow-hidden hidden md:block">
                              <div className="h-full bg-primary" style={{ width: `${res.utilization}%` }}></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          TAB: EXPORT CENTER
          ============================================================== */}
      {activeTab === 'export' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* PDF Card */}
          <div className="bg-white p-8 rounded-card border border-border-gray shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                <FileText size={24} />
              </div>
              <h4 className="font-hanken text-headline-md font-bold text-on-surface mb-2">Executive Summary (PDF)</h4>
              <p className="text-body-sm text-on-surface-variant mb-6 font-medium">
                Download a fully rendered, executive-ready PDF report summarizing total margins, upcoming events, and active budgets.
              </p>
            </div>
            <button
              onClick={() => handleExport('pdf')}
              disabled={exporting !== null}
              className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-opacity-95 disabled:bg-opacity-50 transition-all text-label-md flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              {exporting === 'pdf' ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>

          {/* CSV Card */}
          <div className="bg-white p-8 rounded-card border border-border-gray shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-full bg-emerald-green/10 text-emerald-green flex items-center justify-center mb-6">
                <Table size={24} />
              </div>
              <h4 className="font-hanken text-headline-md font-bold text-on-surface mb-2">Budget Ledger (CSV)</h4>
              <p className="text-body-sm text-on-surface-variant mb-6 font-medium">
                Export the complete budget ledger expenses and estimates as a raw CSV file suitable for import into other systems.
              </p>
            </div>
            <button
              onClick={() => handleExport('csv')}
              disabled={exporting !== null}
              className="w-full py-3 bg-emerald-green text-white font-bold rounded-xl hover:bg-opacity-95 disabled:bg-opacity-50 transition-all text-label-md flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              {exporting === 'csv' ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Download CSV</span>
                </>
              )}
            </button>
          </div>

          {/* Excel Card */}
          <div className="bg-white p-8 rounded-card border border-border-gray shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-full bg-secondary-container/30 text-secondary flex items-center justify-center mb-6">
                <FileSpreadsheet size={24} />
              </div>
              <h4 className="font-hanken text-headline-md font-bold text-on-surface mb-2">Resource Schedulers (XLSX)</h4>
              <p className="text-body-sm text-on-surface-variant mb-6 font-medium">
                Download a multi-sheet spreadsheet containing detailed staff rosters, vehicle logs, and equipment reservation codes.
              </p>
            </div>
            <button
              onClick={() => handleExport('xlsx')}
              disabled={exporting !== null}
              className="w-full py-3 bg-secondary text-white font-bold rounded-xl hover:bg-opacity-95 disabled:bg-opacity-50 transition-all text-label-md flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              {exporting === 'xlsx' ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Download XLSX</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReportingPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    }>
      <ReportingPageContent />
    </Suspense>
  );
}
