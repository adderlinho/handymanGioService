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