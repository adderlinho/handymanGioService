import { supabase } from '../lib/supabaseClient';
import type { 
  PayrollPeriod, 
  PayrollEntry, 
  PayrollEntryInput, 
  AggregatedHoursPerWorker,
  PayrollEntryWithWorker 
} from '../types/payroll';

export const payrollService = {
  // Payroll Periods
  async getPayrollPeriods(): Promise<PayrollPeriod[]> {
    const { data, error } = await supabase
      .from('payroll_periods')
      .select('*')
      .order('start_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getPayrollPeriodById(id: string): Promise<PayrollPeriod | null> {
    const { data, error } = await supabase
      .from('payroll_periods')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createPayrollPeriod(input: Partial<PayrollPeriod>): Promise<PayrollPeriod> {
    const { data, error } = await supabase
      .from('payroll_periods')
      .insert(input)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updatePayrollPeriod(id: string, input: Partial<PayrollPeriod>): Promise<PayrollPeriod> {
    const { data, error } = await supabase
      .from('payroll_periods')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deletePayrollPeriod(id: string): Promise<void> {
    const { error } = await supabase
      .from('payroll_periods')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Payroll Entries
  async getPayrollEntriesByPeriod(periodId: string): Promise<PayrollEntryWithWorker[]> {
    const { data, error } = await supabase
      .from('payroll_entries')
      .select(`
        *,
        workers!inner(first_name, last_name, role)
      `)
      .eq('period_id', periodId);
    
    if (error) throw error;
    
    return (data || []).map(entry => ({
      id: entry.id,
      period_id: entry.period_id,
      worker_id: entry.worker_id,
      hours_regular: entry.hours_regular,
      hours_overtime: entry.hours_overtime,
      rate_regular: entry.rate_regular,
      rate_overtime: entry.rate_overtime,
      bonuses: entry.bonuses,
      deductions: entry.deductions,
      gross_pay: entry.gross_pay,
      net_pay: entry.net_pay,
      created_at: entry.created_at,
      worker_name: `${entry.workers.first_name} ${entry.workers.last_name}`,
      worker_role: entry.workers.role
    }));
  },

  async createPayrollEntry(input: PayrollEntryInput): Promise<PayrollEntry> {
    const { data, error } = await supabase
      .from('payroll_entries')
      .insert(input)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updatePayrollEntry(id: number, input: Partial<PayrollEntryInput>): Promise<PayrollEntry> {
    const { data, error } = await supabase
      .from('payroll_entries')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deletePayrollEntry(id: number): Promise<void> {
    const { error } = await supabase
      .from('payroll_entries')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Helper: Aggregate hours from jobs
  async aggregateHoursByWorkerForRange(
    startDate: string,
    endDate: string
  ): Promise<AggregatedHoursPerWorker[]> {
    // Query job_workers joined with jobs for the date range
    const { data, error } = await supabase
      .from('job_workers')
      .select(`
        worker_id,
        hours_regular,
        hours_overtime,
        jobs!inner(scheduled_date)
      `)
      .gte('jobs.scheduled_date', startDate)
      .lte('jobs.scheduled_date', endDate);
    
    if (error) throw error;

    // Aggregate hours by worker_id
    const aggregated = new Map<string, { hours_regular: number; hours_overtime: number }>();
    
    (data || []).forEach(item => {
      const workerId = item.worker_id;
      const regular = item.hours_regular || 0;
      const overtime = item.hours_overtime || 0;
      
      if (aggregated.has(workerId)) {
        const existing = aggregated.get(workerId)!;
        aggregated.set(workerId, {
          hours_regular: existing.hours_regular + regular,
          hours_overtime: existing.hours_overtime + overtime
        });
      } else {
        aggregated.set(workerId, {
          hours_regular: regular,
          hours_overtime: overtime
        });
      }
    });

    return Array.from(aggregated.entries()).map(([worker_id, hours]) => ({
      worker_id,
      hours_regular: hours.hours_regular,
      hours_overtime: hours.hours_overtime
    }));
  }
};