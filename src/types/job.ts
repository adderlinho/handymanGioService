export type JobStatus =
  | 'lead'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'invoiced'
  | 'paid';

export interface Job {
  id: string;
  title: string;
  customer_name: string;
  customer_phone: string | null;
  customer_email: string | null;
  address_street: string | null;
  address_unit: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  service_area_id: string | null;
  service_type: string;
  description: string | null;
  status: JobStatus;
  scheduled_date: string | null;   // ISO date string
  time_window: string | null;
  travel_fee: number | null;
  labor_total: number | null;
  materials_total: number | null;
  other_fees: number | null;
  total_amount: number | null;
  created_at: string;
  updated_at: string;
}