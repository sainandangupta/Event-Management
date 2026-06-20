'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle,
  FileSpreadsheet,
  Plus,
  Trash2,
  Lock,
  Loader2,
  AlertCircle,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useEventManagementStore } from '../../modules/event-management/services/store';
import { useBudgets, useCreateBudgetExpense, useUpdateBudgetExpense, useUpdateBudgetStatus } from '../../modules/event-management/hooks/queries';
import { BudgetStatus, BudgetExpense } from '../../modules/event-management/types';

// Zod schema for new expense item
const expenseSchema = z.object({
  itemName: z.string().min(3, 'Item name must be at least 3 characters'),
  category: z.string().min(1, 'Category is required'),
  estimatedCost: z.number().min(0, 'Estimated cost must be positive'),
  actualCost: z.number().min(0, 'Actual cost must be positive'),
  status: z.enum(['Pending', 'Approved'])
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

function BudgetPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'dashboard';

  const { currentEventId, activeRole, events } = useEventManagementStore();
  const currentEvent = events.find((e) => e.id === currentEventId) || events[0];

  const { data: budgetData, isLoading: budgetsLoading } = useBudgets(currentEventId || undefined);
  const createExpenseMutation = useCreateBudgetExpense();
  const updateExpenseMutation = useUpdateBudgetExpense();
  const updateBudgetStatusMutation = useUpdateBudgetStatus();

  // Add Expense form state
  const [addingExpense, setAddingExpense] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      itemName: '',
      category: 'Venue',
      estimatedCost: 0,
      actualCost: 0,
      status: 'Pending'
    }
  });

  const onSubmitExpense = async (data: ExpenseFormValues) => {
    if (!currentEventId) return;
    try {
      await createExpenseMutation.mutateAsync({
        eventId: currentEventId,
        category: data.category,
        itemName: data.itemName,
        estimatedCost: data.estimatedCost,
        actualCost: data.actualCost,
        status: data.status,
        date: new Date().toISOString().split('T')[0]
      });
      alert('Expense item added successfully!');
      reset();
      setAddingExpense(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Status metrics
  const summary = budgetData?.summaries?.[currentEventId || ''] || {
    eventId: currentEventId || '',
    status: 'Pending' as BudgetStatus,
    totalEstimated: 0,
    totalActual: 0,
    variance: 0
  };

  const expenses = budgetData?.expenses || [];

  // Approve expense action
  const handleApproveExpense = async (expenseId: string) => {
    await updateExpenseMutation.mutateAsync({
      id: expenseId,
      eventId: currentEventId || '',
      updates: { status: 'Approved' }
    });
    alert('Expense marked as Approved.');
  };

  // Workflow Status Advance triggers
  const handleAdvanceStatus = async (targetStatus: BudgetStatus) => {
    // RBAC validation
    if (targetStatus === 'Submitted' && activeRole !== 'Event Manager') {
      alert('Only the Event Manager role can submit the budget for review.');
      return;
    }
    if ((targetStatus === 'Approved' || targetStatus === 'Locked') && activeRole !== 'Finance Manager') {
      alert('Only the Finance Manager role can approve or lock the budget.');
      return;
    }

    if (confirm(`Change budget status to "${targetStatus}"?`)) {
      await updateBudgetStatusMutation.mutateAsync({
        eventId: currentEventId || '',
        status: targetStatus
      });
      alert(`Budget status updated to ${targetStatus}.`);
    }
  };

  // Chart aggregation: group by category
  const chartData = useMemo(() => {
    const categories: Record<string, { name: string; Estimated: number; Actual: number }> = {};
    expenses.forEach((exp) => {
      if (!categories[exp.category]) {
        categories[exp.category] = { name: exp.category, Estimated: 0, Actual: 0 };
      }
      categories[exp.category].Estimated += exp.estimatedCost;
      if (exp.status === 'Approved') {
        categories[exp.category].Actual += exp.actualCost;
      }
    });
    return Object.values(categories);
  }, [expenses]);

  if (budgetsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  // Workflow stages visual states
  const stages: { label: BudgetStatus; description: string }[] = [
    { label: 'Pending', description: 'Budget details compile stage.' },
    { label: 'Submitted', description: 'Under review by Finance Manager.' },
    { label: 'Approved', description: 'Budget approved. Sourcing unlocked.' },
    { label: 'Locked', description: 'Budget sealed. Variance audit active.' }
  ];

  const currentStageIdx = stages.findIndex((s) => s.label === summary.status);

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <span className="text-primary font-bold text-label-sm uppercase tracking-wider block mb-1">
            {currentEvent?.name || 'All Events'}
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-hanken text-headline-lg font-bold text-on-surface">Budget &amp; Ledger</h2>
            <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider bg-primary/10 text-primary`}>
              {summary.status}
            </span>
          </div>
          <p className="text-body-lg text-on-surface-variant mt-1">
            Track variance allocations, approve expense sheets, and manage approvals.
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => router.push('/budget?view=dashboard')}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 cursor-pointer text-label-md transition-colors ${
              view === 'dashboard' ? 'bg-primary text-white' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            <DollarSign size={16} />
            <span>Overview</span>
          </button>
          <button
            onClick={() => router.push('/budget?view=expenses')}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 cursor-pointer text-label-md transition-colors ${
              view === 'expenses' ? 'bg-primary text-white' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            <FileSpreadsheet size={16} />
            <span>Ledger Items</span>
          </button>
          <button
            onClick={() => router.push('/budget?view=approval')}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 cursor-pointer text-label-md transition-colors ${
              view === 'approval' ? 'bg-primary text-white' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            <CheckCircle size={16} />
            <span>Approvals Workflow</span>
          </button>
        </div>
      </div>

      {/* Overview Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Estimated Budget</p>
          <h3 className="font-hanken text-headline-md font-bold text-on-surface mt-1">
            ${summary.totalEstimated.toLocaleString()}
          </h3>
          <p className="text-body-sm text-on-surface-variant mt-2 font-medium">Approved reference cost</p>
        </div>

        <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 font-semibold">Actual Spent</p>
          <h3 className="font-hanken text-headline-md font-bold text-primary mt-1">
            ${summary.totalActual.toLocaleString()}
          </h3>
          <p className="text-body-sm text-on-surface-variant mt-2 font-medium">Spent from approved ledger items</p>
        </div>

        <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Variance remaining</p>
          <h3 className={`font-hanken text-headline-md font-bold mt-1 ${
            summary.variance >= 0 ? 'text-emerald-green' : 'text-error'
          }`}>
            ${summary.variance.toLocaleString()}
          </h3>
          <p className="text-body-sm text-on-surface-variant mt-2 font-medium">Difference remaining</p>
        </div>
      </div>

      {/* ==============================================================
          VIEW 1: DASHBOARD OVERVIEW
          ============================================================== */}
      {view === 'dashboard' && (
        <div className="bg-white p-8 rounded-card border border-border-gray shadow-sm">
          <h4 className="font-hanken text-headline-md font-bold text-on-surface mb-2">Category Variance Graph</h4>
          <p className="text-body-sm text-on-surface-variant mb-6 font-medium">
            Comparison of Estimated (target) vs Actual (spent) allocations by category.
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} style={{ fontSize: '12px', fill: '#584140' }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: '11px', fill: '#584140' }} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="Estimated" fill="#dee9fc" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Actual" fill="#ae2f34" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ==============================================================
          VIEW 2: BUDGET ITEMS LEDGER
          ============================================================== */}
      {view === 'expenses' && (
        <div className="space-y-6">
          <div className="bg-white rounded-card border border-border-gray shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border-gray flex justify-between items-center">
              <h4 className="font-hanken text-headline-md font-bold text-on-surface">Ledger Sheets</h4>
              {summary.status !== 'Locked' ? (
                <button
                  onClick={() => setAddingExpense(true)}
                  className="px-4 py-2 bg-primary text-white font-sans text-label-md rounded-xl hover:bg-opacity-95 flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus size={16} />
                  <span>Add Expense</span>
                </button>
              ) : (
                <div className="text-xs text-on-surface-variant font-bold flex items-center gap-1">
                  <Lock size={12} /> Budget Locked
                </div>
              )}
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50 border-b border-border-gray text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                    <th className="px-8 py-5">Expense Details</th>
                    <th className="px-6 py-5">Category</th>
                    <th className="px-6 py-5">Estimated Cost</th>
                    <th className="px-6 py-5">Actual Cost</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-gray text-body-md font-medium">
                  {expenses.length > 0 ? (
                    expenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-surface/30 transition-colors">
                        <td className="px-8 py-5">
                          <div className="font-bold text-on-surface">{exp.itemName}</div>
                          <div className="text-[10px] text-on-surface-variant font-semibold mt-0.5">{exp.date}</div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-xs font-semibold">
                            {exp.category}
                          </span>
                        </td>
                        <td className="px-6 py-5 font-bold text-on-surface">
                          ${exp.estimatedCost.toLocaleString()}
                        </td>
                        <td className="px-6 py-5 font-bold text-primary">
                          ${exp.actualCost.toLocaleString()}
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            exp.status === 'Approved'
                              ? 'bg-emerald-green/10 text-emerald-green'
                              : 'bg-secondary-container/20 text-secondary'
                          }`}>
                            {exp.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            {exp.status === 'Pending' && summary.status !== 'Locked' && activeRole === 'Finance Manager' && (
                              <button
                                onClick={() => handleApproveExpense(exp.id)}
                                className="px-3 py-1 bg-emerald-green text-white text-[10px] font-bold rounded hover:bg-opacity-90 transition-colors cursor-pointer"
                              >
                                Approve
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-on-surface-variant font-medium">
                        No ledger expense items found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          VIEW 3: APPROVALS WORKFLOW
          ============================================================== */}
      {view === 'approval' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline workflow path */}
          <div className="lg:col-span-2 bg-white p-8 rounded-card border border-border-gray shadow-sm">
            <h4 className="font-hanken text-headline-md font-bold text-on-surface mb-8">Sign-off Pipeline</h4>
            
            <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border-gray">
              {stages.map((stage, idx) => {
                const active = idx === currentStageIdx;
                const passed = idx < currentStageIdx;
                
                return (
                  <div key={stage.label} className="relative pl-10 flex gap-4">
                    <div className={`absolute left-0 top-1 w-10 h-10 rounded-full flex items-center justify-center z-10 border-4 border-white shadow-sm font-bold text-xs ${
                      passed
                        ? 'bg-emerald-green text-white'
                        : active
                        ? 'bg-primary text-white step-active-glow animate-pulse'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}>
                      {passed ? '✓' : idx + 1}
                    </div>
                    <div>
                      <h5 className={`font-bold text-on-surface text-base ${active ? 'text-primary' : ''}`}>
                        {stage.label}
                      </h5>
                      <p className="text-body-sm text-on-surface-variant mt-1 font-medium">{stage.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action controller card */}
          <div className="bg-white p-8 rounded-card border border-border-gray shadow-sm h-fit">
            <h4 className="font-sans text-label-md font-bold text-on-surface mb-4">Workflow Actions</h4>
            
            {/* Conditional triggers based on role & status */}
            <div className="space-y-4">
              {activeRole === 'Vendor' ? (
                <div className="p-4 bg-background-alt border border-border-gray/30 rounded-xl text-on-surface-variant text-xs font-semibold flex items-center gap-2">
                  <ShieldAlert size={16} className="text-primary" />
                  <span>Vendor accounts have Read-only access to budgets.</span>
                </div>
              ) : (
                <>
                  {summary.status === 'Pending' && (
                    <button
                      onClick={() => handleAdvanceStatus('Submitted')}
                      disabled={activeRole !== 'Event Manager'}
                      className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-opacity-95 transition-all text-label-md flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                    >
                      <span>Submit for Review</span>
                      <ArrowRight size={16} />
                    </button>
                  )}
                  
                  {summary.status === 'Submitted' && (
                    <button
                      onClick={() => handleAdvanceStatus('Approved')}
                      disabled={activeRole !== 'Finance Manager'}
                      className="w-full py-3 bg-emerald-green text-white font-bold rounded-xl hover:bg-opacity-95 transition-all text-label-md flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                    >
                      <span>Approve Budget</span>
                      <CheckCircle size={16} />
                    </button>
                  )}

                  {summary.status === 'Approved' && (
                    <button
                      onClick={() => handleAdvanceStatus('Locked')}
                      disabled={activeRole !== 'Finance Manager'}
                      className="w-full py-3 bg-inverse-surface text-white font-bold rounded-xl hover:bg-opacity-95 transition-all text-label-md flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                    >
                      <Lock size={16} />
                      <span>Lock Budget Sheet</span>
                    </button>
                  )}

                  {summary.status === 'Locked' && (
                    <div className="p-4 bg-emerald-green/10 border border-emerald-green/20 rounded-xl text-emerald-green text-xs font-bold flex items-center gap-2">
                      <Lock size={16} />
                      <span>Budget Sealed & Locked. No edits allowed.</span>
                    </div>
                  )}

                  {/* Role error reminder warnings */}
                  {summary.status === 'Pending' && activeRole !== 'Event Manager' && (
                    <p className="text-[10px] text-error font-bold tracking-tight">
                      * Switch role to Event Manager to submit budget.
                    </p>
                  )}
                  {(summary.status === 'Submitted' || summary.status === 'Approved') && activeRole !== 'Finance Manager' && (
                    <p className="text-[10px] text-error font-bold tracking-tight">
                      * Switch role to Finance Manager to approve/lock budget.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {addingExpense && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-gutter">
          <div className="glass-panel w-full max-w-md p-8 rounded-[32px] border border-white/40 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-hanken text-headline-md font-bold text-on-surface">Add Expense Item</h3>
              <button
                onClick={() => setAddingExpense(false)}
                className="p-1 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmitExpense)} className="space-y-4 font-sans text-body-sm">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase">Item Details Name</label>
                <input
                  {...register('itemName')}
                  className="w-full bg-background-alt border-none rounded-xl p-3.5 focus:bg-white transition-all text-body-sm font-semibold"
                  placeholder="e.g. VIP Limousines fleet hire"
                  type="text"
                />
                {errors.itemName && <p className="text-xs text-error font-medium">{errors.itemName.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase">Category</label>
                <select
                  {...register('category')}
                  className="w-full bg-background-alt border-none rounded-xl p-3.5 focus:bg-white cursor-pointer transition-all font-semibold"
                >
                  <option value="Venue">Venue Rental</option>
                  <option value="Catering">Food &amp; Beverage</option>
                  <option value="Production">AV Production</option>
                  <option value="Decor">Decor &amp; Styling</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Logistics">Transport Logistics</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase">Estimated Cost</label>
                  <input
                    {...register('estimatedCost', { valueAsNumber: true })}
                    className="w-full bg-background-alt border-none rounded-xl p-3.5 focus:bg-white transition-all text-body-sm font-semibold"
                    type="number"
                  />
                  {errors.estimatedCost && <p className="text-xs text-error font-medium">{errors.estimatedCost.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase">Actual Cost</label>
                  <input
                    {...register('actualCost', { valueAsNumber: true })}
                    className="w-full bg-background-alt border-none rounded-xl p-3.5 focus:bg-white transition-all text-body-sm font-semibold"
                    type="number"
                  />
                  {errors.actualCost && <p className="text-xs text-error font-medium">{errors.actualCost.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase">Initial Status</label>
                <select
                  {...register('status')}
                  className="w-full bg-background-alt border-none rounded-xl p-3.5 focus:bg-white cursor-pointer transition-all font-semibold"
                >
                  <option value="Pending">Pending Approval</option>
                  <option value="Approved">Approved</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border-gray/50">
                <button
                  type="button"
                  onClick={() => setAddingExpense(false)}
                  className="px-6 py-2 text-on-surface-variant hover:text-primary font-bold cursor-pointer text-label-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white font-bold rounded-xl hover:bg-opacity-95 transition-all cursor-pointer text-label-md shadow-sm"
                >
                  Create Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BudgetPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    }>
      <BudgetPageContent />
    </Suspense>
  );
}
