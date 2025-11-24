export interface WizardJobData {
  // Step 1 - Customer & Address
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  address_street: string;
  address_unit: string;
  city: string;
  state: string;
  zip: string;
  service_area_id: string | null;
  service_area_name: string | null;

  // Step 2 - Job Details
  title: string;
  service_type: string;
  description: string;
  scheduled_date: string;
  time_window: string;
  status: 'scheduled' | 'lead';

  // Step 3 - Workers
  selectedWorkers: string[];

  // Step 4 - Pricing
  travel_fee: number;
  labor_total: number;
  materials_total: number;
  other_fees: number;
  total_amount: number;
}