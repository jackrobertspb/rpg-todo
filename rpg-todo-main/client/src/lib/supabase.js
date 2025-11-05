import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug: Log environment variables (remove in production)
console.log('Supabase URL:', supabaseUrl ? 'Loaded' : 'MISSING');
console.log('Supabase Key:', supabaseAnonKey ? 'Loaded' : 'MISSING');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
  console.error('VITE_SUPABASE_URL:', supabaseUrl);
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'exists' : 'missing');
  throw new Error('Missing Supabase environment variables. Please check your .env file and restart the dev server.');
}

// Create Supabase client for frontend
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

