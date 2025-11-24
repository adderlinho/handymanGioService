export type WorkerStatus = 'active' | 'inactive';
export type WorkerPayType = 'hourly' | 'per_job' | 'salary';

export interface Worker {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  role: string;
  pay_type: WorkerPayType;
  hourly_rate: number | null;
  overtime_rate: number | null;
  status: WorkerStatus;
  neighborhoods: string[] | null;
  start_date: string | null;
  created_at: string;
}