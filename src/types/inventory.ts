export interface InventoryItem {
  id: string;
  sku: string | null;
  name: string;
  category: string | null;
  description: string | null;
  unit: string | null;
  quantity: number | null;
  min_quantity: number | null;
  location: string | null;
  cost_per_unit: number | null;
  created_at: string;
}

export type InventoryMovementType = 'in' | 'out' | 'adjust';

export interface InventoryMovement {
  id: number;
  item_id: string;
  job_id: string | null;
  type: InventoryMovementType;
  quantity: number;
  reason: string | null;
  created_at: string;
}

export interface InventoryItemInput {
  sku?: string;
  name: string;
  category?: string;
  description?: string;
  unit?: string;
  quantity?: number;
  min_quantity?: number;
  location?: string;
  cost_per_unit?: number;
}

export interface InventoryMovementInput {
  item_id: string;
  job_id?: string | null;
  type: InventoryMovementType;
  quantity: number;
  reason?: string;
}