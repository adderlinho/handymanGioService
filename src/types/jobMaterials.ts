export interface JobMaterial {
  id: number;
  job_id: string;
  item_id: string;
  quantity: number;
  unit_cost: number | null;
  total_cost: number | null;
}

export interface JobMaterialInput {
  job_id: string;
  item_id: string;
  quantity: number;
  unit_cost?: number | null;
}

export interface JobMaterialWithItem extends JobMaterial {
  item_name: string;
  item_unit: string | null;
}