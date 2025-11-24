import { supabase } from '../lib/supabaseClient';
import type { InventoryItem, InventoryMovement, InventoryItemInput, InventoryMovementInput } from '../types/inventory';

export const inventoryService = {
  async getInventoryItems(): Promise<InventoryItem[]> {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async getLowStockItems(): Promise<InventoryItem[]> {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .filter('quantity', 'lte', 'min_quantity')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async getInventoryItemById(id: string): Promise<InventoryItem | null> {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createInventoryItem(input: InventoryItemInput): Promise<InventoryItem> {
    const { data, error } = await supabase
      .from('inventory_items')
      .insert(input)
      .select()
      .single();
    
    if (error) throw error;

    // Create initial movement if quantity > 0
    if (input.quantity && input.quantity > 0) {
      await this.createMovement({
        item_id: data.id,
        type: 'in',
        quantity: input.quantity,
        reason: 'Stock inicial'
      });
    }

    return data;
  },

  async updateInventoryItem(id: string, input: Partial<InventoryItemInput>): Promise<InventoryItem> {
    const { data, error } = await supabase
      .from('inventory_items')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteInventoryItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getMovementsByItem(itemId: string): Promise<InventoryMovement[]> {
    const { data, error } = await supabase
      .from('inventory_movements')
      .select('*')
      .eq('item_id', itemId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async createMovement(input: InventoryMovementInput): Promise<InventoryMovement> {
    // Create movement record
    const { data: movement, error: movementError } = await supabase
      .from('inventory_movements')
      .insert(input)
      .select()
      .single();
    
    if (movementError) throw movementError;

    // Update item quantity
    const { data: item, error: itemError } = await supabase
      .from('inventory_items')
      .select('quantity')
      .eq('id', input.item_id)
      .single();
    
    if (itemError) throw itemError;

    const currentQuantity = item.quantity || 0;
    let newQuantity = currentQuantity;

    switch (input.type) {
      case 'in':
        newQuantity = currentQuantity + input.quantity;
        break;
      case 'out':
        newQuantity = currentQuantity - input.quantity;
        break;
      case 'adjust':
        newQuantity = currentQuantity + input.quantity; // Treat as delta
        break;
    }

    const { error: updateError } = await supabase
      .from('inventory_items')
      .update({ quantity: newQuantity })
      .eq('id', input.item_id);
    
    if (updateError) throw updateError;

    return movement;
  }
};