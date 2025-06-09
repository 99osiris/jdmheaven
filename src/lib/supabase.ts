import { createClient } from '@supabase/supabase-js';
import type { ContactFormData } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export type Database = {
  public: {
    Tables: {
      contact_submissions: {
        Row: ContactFormData & {
          id: string;
          created_at: string;
          status: 'new' | 'in_progress' | 'completed';
        };
        Insert: Omit<ContactFormData, 'id' | 'created_at' | 'status'>;
      };
    };
  };
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});