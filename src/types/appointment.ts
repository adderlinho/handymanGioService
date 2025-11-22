export interface Appointment {
  id: string;
  fullName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  jobType: string;
  preferredDate: string;
  preferredTime: string;
  description: string;
  status: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
}