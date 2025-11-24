import { supabase } from './supabase';
import type { ServiceArea, Worker, Job, JobWorker } from '../types/database';

// Service Areas
export const serviceAreasApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('service_areas')
      .select('*')
      .order('name');
    if (error) throw error;
    return data as ServiceArea[];
  },

  create: async (serviceArea: Omit<ServiceArea, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('service_areas')
      .insert(serviceArea)
      .select()
      .single();
    if (error) throw error;
    return data as ServiceArea;
  }
};

// Workers
export const workersApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .order('first_name');
    if (error) throw error;
    return data as Worker[];
  },

  create: async (worker: Omit<Worker, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('workers')
      .insert(worker)
      .select()
      .single();
    if (error) throw error;
    return data as Worker;
  }
};

// Jobs
export const jobsApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Job[];
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Job;
  },

  create: async (job: Omit<Job, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('jobs')
      .insert(job)
      .select()
      .single();
    if (error) throw error;
    return data as Job;
  }
};

// Job Workers
export const jobWorkersApi = {
  getByJobId: async (jobId: string) => {
    const { data, error } = await supabase
      .from('job_workers')
      .select(`
        *,
        worker:workers(first_name, last_name, role)
      `)
      .eq('job_id', jobId);
    if (error) throw error;
    return data as (JobWorker & { worker: Pick<Worker, 'first_name' | 'last_name' | 'role'> })[];
  },

  create: async (jobWorker: Omit<JobWorker, 'id'>) => {
    const { data, error } = await supabase
      .from('job_workers')
      .insert(jobWorker)
      .select()
      .single();
    if (error) throw error;
    return data as JobWorker;
  }
};