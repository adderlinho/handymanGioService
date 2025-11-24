export type JobPhotoTag = 'before' | 'during' | 'after' | null;

export interface JobPhoto {
  id: string;
  job_id: string;
  url: string;
  storage_path: string;
  tag: JobPhotoTag;
  description: string | null;
  created_at: string;
}