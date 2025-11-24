export type PayrollPeriodStatus = 'draft' | 'finalized' | 'paid';
export type PayrollPeriodType = 'weekly' | 'biweekly' | 'monthly';

export interface PayrollPeriod {
  id: string;
  period_type: PayrollPeriodType;
  start_date: string;   // ISO date (YYYY-MM-DD)
  end_date: string;     // ISO date
  status: PayrollPeriodStatus;
  total_amount: number | null;
  created_at: string;
}

export interface PayrollEntry {
  id: number;
  period_id: string;
  worker_id: string;
  hours_regular: number | null;
  hours_overtime: number | null;
  rate_regular: number | null;
  rate_overtime: number | null;
  bonuses: number | null;
  deductions: number | null;
  gross_pay: number | null;
  net_pay: number | null;
  created_at: string;
}

export interface PayrollEntryInput {
  period_id: string;
  worker_id: string;
  hours_regular?: number;
  hours_overtime?: number;
  rate_regular?: number;
  rate_overtime?: number;
  bonuses?: number;
  deductions?: number;
  gross_pay?: number;
  net_pay?: number;
}

export interface AggregatedHoursPerWorker {
  worker_id: string;
  hours_regular: number;
  hours_overtime: number;
}

export interface PayrollEntryWithWorker extends PayrollEntry {
  worker_name: string;
  worker_role: string;
}