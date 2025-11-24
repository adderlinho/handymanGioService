export interface JobWorker {
  id: number;
  job_id: string;
  worker_id: string;
  hours_regular: number | null;
  hours_overtime: number | null;
  labor_rate: number | null;
  labor_cost: number | null;
}