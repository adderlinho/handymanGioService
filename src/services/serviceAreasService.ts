import { supabase } from '../lib/supabaseClient';
import type { ServiceArea, ServiceAreaZip } from '../types/serviceAreas';

export const getServiceAreas = async (): Promise<ServiceArea[]> => {
  try {
    const { data, error } = await supabase
      .from('service_areas')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching service areas:', error);
    throw error;
  }
};

export const getZipsByServiceArea = async (serviceAreaId: string): Promise<ServiceAreaZip[]> => {
  try {
    const { data, error } = await supabase
      .from('service_area_zips')
      .select('*')
      .eq('service_area_id', serviceAreaId)
      .order('zip_code');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching zips by service area:', error);
    throw error;
  }
};

export const getServiceAreaByZip = async (zipCode: string): Promise<ServiceArea | null> => {
  try {
    const { data, error } = await supabase
      .from('service_area_zips')
      .select(`
        service_area_id,
        service_areas (
          id,
          name,
          description,
          created_at
        )
      `)
      .eq('zip_code', zipCode)
      .single();
    
    if (error) throw error;
    return data?.service_areas as ServiceArea || null;
  } catch (error) {
    console.error('Error fetching service area by zip:', error);
    return null;
  }
};