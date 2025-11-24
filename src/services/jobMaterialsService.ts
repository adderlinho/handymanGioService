import { supabase } from '../lib/supabaseClient';
import { inventoryService } from './inventoryService';
import type { JobMaterial, JobMaterialInput, JobMaterialWithItem } from '../types/jobMaterials';

export const jobMaterialsService = {
  async getJobMaterials(jobId: string): Promise<JobMaterialWithItem[]> {
    const { data, error } = await supabase
      .from('job_materials')
      .select(`
        *,
        inventory_items!inner(name, unit)
      `)
      .eq('job_id', jobId);
    
    if (error) throw error;
    
    return (data || []).map(item => ({
      id: item.id,
      job_id: item.job_id,
      item_id: item.item_id,
      quantity: item.quantity,
      unit_cost: item.unit_cost,
      total_cost: item.total_cost,
      item_name: item.inventory_items.name,
      item_unit: item.inventory_items.unit
    }));
  },

  async addMaterialToJob(input: JobMaterialInput): Promise<JobMaterial> {
    // Get item cost if unit_cost not provided
    let unitCost = input.unit_cost;
    if (!unitCost) {
      const item = await inventoryService.getInventoryItemById(input.item_id);
      unitCost = item?.cost_per_unit || 0;
    }

    const totalCost = input.quantity * (unitCost || 0);

    // Create job material record
    const { data, error } = await supabase
      .from('job_materials')
      .insert({
        job_id: input.job_id,
        item_id: input.item_id,
        quantity: input.quantity,
        unit_cost: unitCost,
        total_cost: totalCost
      })
      .select()
      .single();
    
    if (error) throw error;

    // Create inventory movement (out)
    await inventoryService.createMovement({
      item_id: input.item_id,
      job_id: input.job_id,
      type: 'out',
      quantity: input.quantity,
      reason: `Usado en trabajo`
    });

    return data;
  },

  async removeJobMaterial(id: number): Promise<void> {
    const { error } = await supabase
      .from('job_materials')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getJobMaterialsTotal(jobId: string): Promise<number> {
    const { data, error } = await supabase
      .from('job_materials')
      .select('total_cost')
      .eq('job_id', jobId);
    
    if (error) throw error;
    
    return (data || []).reduce((sum, item) => sum + (item.total_cost || 0), 0);
  }
};