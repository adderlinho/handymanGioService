import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://ywioqvsdhsygzlkgedem.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3aW9xdnNkaHN5Z3psa2dlZGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzE5NzcsImV4cCI6MjA1MDU0Nzk3N30.H6QPPDdw8V9d3SxE1OkONg_ANQH8y7BqQJxVZQJxVZQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);