import type { ApprovalStatus } from './common';

export interface BudgetSummary {
  planned: number;
  actualSpend: number;
  totalVariance: number;
  averageMargin: number;
  percentUtilized: number;
  remaining: number;
}

export interface BudgetCategory {
  id: string;
  name: string;
  actual: number;
  planned: number;
  overBudget?: boolean;
}

export interface Expense {
  id: string;
  description: string;
  vendor: string;
  category: string;
  amount: number;
  date: string;
  icon?: string;
}

export interface BudgetApproval {
  id: string;
  title: string;
  amount: number;
  description: string;
  requestedBy: {
    name: string;
    avatar?: string;
  };
  status: ApprovalStatus;
}
