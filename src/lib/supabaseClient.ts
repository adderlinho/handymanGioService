import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://ywioqvsdhsygzlkgedem.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3aW9xdnNkaHN5Z3psa2dlZGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NjYxMDgsImV4cCI6MjA3OTQ0MjEwOH0.R646G2q3bgW45WJMeEpL7bPIthuvnUlN_BbqC6ucFj8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);