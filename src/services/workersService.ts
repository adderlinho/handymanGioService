import { supabase } from '../lib/supabaseClient';
import type { Worker } from '../types/workers';

export const getWorkers = async (): Promise<Worker[]> => {
  try {
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .order('first_name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching workers:', error);
    throw error;
  }
};

export const getWorkerById = async (id: string): Promise<Worker | null> => {
  try {
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching worker by id:', error);
    throw error;
  }
};

export const createWorker = async (input: Partial<Worker>): Promise<Worker> => {
  try {
    const { data, error } = await supabase
      .from('workers')
      .insert(input)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating worker:', error);
    throw error;
  }
};

export const updateWorker = async (id: string, input: Partial<Worker>): Promise<Worker> => {
  try {
    const { data, error } = await supabase
      .from('workers')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating worker:', error);
    throw error;
  }
};

export const deleteWorker = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('workers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting worker:', error);
    throw error;
  }
};