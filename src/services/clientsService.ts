import { supabase } from '../lib/supabaseClient';
import type { Client } from '../types/client';

export interface ClientInput {
  fullName: string;
  phone: string;
  whatsapp: string;
  email: string;
  mainAddress: string;
  notes: string;
}

export const clientsService = {
  async getAll(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('fullName');
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(client: ClientInput): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<ClientInput>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async searchByName(query: string): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .ilike('fullName', `%${query}%`)
      .order('fullName')
      .limit(10);
    
    if (error) throw error;
    return data || [];
  }
};