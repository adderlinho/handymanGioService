export interface Job {
  id: string;
  date: string;
  clientId: string;
  clientName: string;
  address: string;
  jobType: string;
  description: string;
  status: 'pendiente' | 'en-curso' | 'completado' | 'facturado';
  laborAmount: number;
  extraAmount: number;
  totalAmount: number;
  materialsUsed: string[];
  evidenceImages: string[];
  internalNotes: string;
  clientNotes: string;
  assignedWorkers: string[];
}