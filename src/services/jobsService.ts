import { supabase } from '../lib/supabaseClient';
import type { Job } from '../types/job';

export const getJobs = async (): Promise<Job[]> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('scheduled_date', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

export const getJobById = async (id: string): Promise<Job | null> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching job by id:', error);
    throw error;
  }
};

export const createJob = async (input: Partial<Job>): Promise<Job> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .insert(input)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

export const updateJob = async (id: string, input: Partial<Job>): Promise<Job> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

export const deleteJob = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

export const getJobsByIds = async (ids: string[]): Promise<Job[]> => {
  try {
    if (ids.length === 0) return [];
    
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .in('id', ids)
      .order('scheduled_date', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching jobs by ids:', error);
    throw error;
  }
};

export interface PublicJobLeadInput {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  address_street?: string;
  address_unit?: string;
  city?: string;
  state?: string;
  zip?: string;
  service_area_id?: string | null;
  service_type: string;
  description: string;
  scheduled_date?: string | null;
  time_window?: string | null;
}

export const createLeadFromPublicForm = async (input: PublicJobLeadInput): Promise<Job> => {
  try {
    // Generate title based on service type and location
    const serviceTypeLabels: Record<string, string> = {
      'plumbing': 'Plomería',
      'electrical': 'Electricidad',
      'drywall_paint': 'Drywall y Pintura',
      'carpentry': 'Carpintería',
      'flooring': 'Pisos',
      'other': 'Otro'
    };
    
    const serviceLabel = serviceTypeLabels[input.service_type] || input.service_type;
    const location = input.city || 'Chicago';
    const title = `Solicitud: ${serviceLabel} - ${location}`;

    const jobData = {
      title,
      customer_name: input.customer_name,
      customer_phone: input.customer_phone,
      customer_email: input.customer_email || null,
      address_street: input.address_street || null,
      address_unit: input.address_unit || null,
      city: input.city || 'Chicago',
      state: input.state || 'IL',
      zip: input.zip || null,
      service_area_id: input.service_area_id,
      service_type: input.service_type,
      description: input.description,
      status: 'lead' as const,
      scheduled_date: input.scheduled_date,
      time_window: input.time_window,
      travel_fee: null,
      labor_total: null,
      materials_total: null,
      other_fees: null,
      total_amount: null
    };

    const { data, error } = await supabase
      .from('jobs')
      .insert(jobData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating lead from public form:', error);
    throw error;
  }
};