export interface ServiceArea {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface ServiceAreaZip {
  id: number;
  service_area_id: string;
  zip_code: string;
}

export interface Worker {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  role: string;
  pay_type: 'hourly' | 'per_job' | 'salary';
  hourly_rate: number | null;
  overtime_rate: number | null;
  status: 'active' | 'inactive';
  neighborhoods: string[] | null;
  start_date: string | null;
  created_at: string;
}

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
  status: 'lead' | 'scheduled' | 'in_progress' | 'completed' | 'invoiced' | 'paid';
  scheduled_date: string | null;
  time_window: string | null;
  travel_fee: number;
  labor_total: number;
  materials_total: number;
  other_fees: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface JobWorker {
  id: number;
  job_id: string;
  worker_id: string;
  hours_regular: number;
  hours_overtime: number;
  labor_rate: number | null;
  labor_cost: number | null;
}