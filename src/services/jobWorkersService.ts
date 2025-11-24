import { supabase } from '../lib/supabaseClient';
import type { JobWorker } from '../types/jobWorkers';

export const getJobWorkersByJob = async (jobId: string): Promise<JobWorker[]> => {
  try {
    const { data, error } = await supabase
      .from('job_workers')
      .select(`
        *,
        worker:workers(
          id,
          first_name,
          last_name,
          role,
          hourly_rate
        )
      `)
      .eq('job_id', jobId);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching job workers:', error);
    throw error;
  }
};

export const assignWorkerToJob = async (input: {
  job_id: string;
  worker_id: string;
  hours_regular?: number;
  hours_overtime?: number;
  labor_rate?: number;
  labor_cost?: number;
}): Promise<JobWorker> => {
  try {
    const { data, error } = await supabase
      .from('job_workers')
      .insert(input)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error assigning worker to job:', error);
    throw error;
  }
};

export const updateJobWorker = async (id: number, input: Partial<JobWorker>): Promise<JobWorker> => {
  try {
    const { data, error } = await supabase
      .from('job_workers')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating job worker:', error);
    throw error;
  }
};

export const removeJobWorker = async (id: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('job_workers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error removing job worker:', error);
    throw error;
  }
};

export const getJobWorkersByWorker = async (workerId: string): Promise<JobWorker[]> => {
  try {
    const { data, error } = await supabase
      .from('job_workers')
      .select('*')
      .eq('worker_id', workerId);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching job workers by worker:', error);
    throw error;
  }
};