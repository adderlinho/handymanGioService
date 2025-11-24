import { supabase } from '../lib/supabaseClient';
import { JobPhoto } from '../types/jobPhotos';

export const getPhotosByJob = async (jobId: string): Promise<JobPhoto[]> => {
  const { data, error } = await supabase
    .from('job_photos')
    .select('*')
    .eq('job_id', jobId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching job photos:', error);
    throw error;
  }

  return data || [];
};

export const createJobPhoto = async (input: {
  job_id: string;
  url: string;
  storage_path: string;
  tag?: string | null;
  description?: string | null;
}): Promise<JobPhoto> => {
  const { data, error } = await supabase
    .from('job_photos')
    .insert([input])
    .select()
    .single();

  if (error) {
    console.error('Error creating job photo:', error);
    throw error;
  }

  return data;
};

export const deleteJobPhoto = async (id: string): Promise<JobPhoto> => {
  const { data, error } = await supabase
    .from('job_photos')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error deleting job photo:', error);
    throw error;
  }

  return data;
};