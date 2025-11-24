import { supabase } from '../lib/supabaseClient';

export const uploadJobPhoto = async (file: File, jobId: string): Promise<{ url: string; path: string }> => {
  const timestamp = Date.now();
  const fileName = `${timestamp}-${file.name}`;
  const filePath = `job-${jobId}/${fileName}`;

  const { error } = await supabase.storage
    .from('job-photos')
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('job-photos')
    .getPublicUrl(filePath);

  return {
    url: publicUrl,
    path: filePath
  };
};

export const deleteJobPhotoFromStorage = async (path: string): Promise<void> => {
  const { error } = await supabase.storage
    .from('job-photos')
    .remove([path]);

  if (error) {
    console.error('Error deleting photo from storage:', error);
    throw error;
  }
};