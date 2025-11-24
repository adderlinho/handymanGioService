import { Job } from '../types/job';

export const mockJobs: Job[] = [
  {
    id: '#10524',

    customer_name: 'Ana García',
    address_street: 'Calle Falsa 123, Madrid',
    service_type: 'plumbing',
    description: 'Reparación de tubería en cocina',
    status: 'completed',
    labor_total: 120,
    other_fees: 30,
    total_amount: 150,
    materialsUsed: ['Tubería PVC', 'Codos', 'Sellador'],
    evidenceImages: [],
    internalNotes: 'Cliente muy satisfecho',
    clientNotes: 'Excelente trabajo',
    assignedWorkers: ['worker1']
  },
  {
    id: '#10523',

    customer_name: 'Carlos Pérez',
    address_street: 'Plaza Mayor 5, Barcelona',
    service_type: 'electrical',
    description: 'Instalación de tomas eléctricas',
    status: 'in_progress',
    labor_total: 200,
    other_fees: 75.50,
    total_amount: 275.50,
    materialsUsed: ['Tomas eléctricas', 'Cable', 'Cajas de registro'],
    evidenceImages: [],
    internalNotes: 'Trabajo en progreso',
    clientNotes: '',
    assignedWorkers: ['worker2']
  },
  {
    id: '#10522',

    customer_name: 'Lucía Martínez',
    address_street: 'Avenida del Sol 42, Valencia',
    service_type: 'drywall_paint',
    description: 'Pintura completa de salón',
    status: 'invoiced',
    labor_total: 600,
    other_fees: 250,
    total_amount: 850,
    materialsUsed: ['Pintura blanca', 'Rodillos', 'Brochas'],
    evidenceImages: [],
    internalNotes: 'Factura enviada',
    clientNotes: 'Muy contenta con el resultado',
    assignedWorkers: ['worker1', 'worker3']
  },
  {
    id: '#10521',

    customer_name: 'Javier López',
    address_street: 'Calle Luna 8, Sevilla',
    service_type: 'carpentry',
    description: 'Reparación de puerta principal',
    status: 'scheduled',
    labor_total: 350,
    other_fees: 70,
    total_amount: 420,
    materialsUsed: ['Madera', 'Bisagras', 'Barniz'],
    evidenceImages: [],
    internalNotes: 'Pendiente de confirmación',
    clientNotes: '',
    assignedWorkers: ['worker2']
  }
];