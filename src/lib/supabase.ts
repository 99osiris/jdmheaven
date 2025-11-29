import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { ContactFormData } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate environment variables
const isConfigured = !!(supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseAnonKey !== 'placeholder-key' &&
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.length > 20);

if (!isConfigured) {
  console.warn('⚠️ Missing or invalid Supabase environment variables.');
  console.warn('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
  console.warn('Get your credentials from: https://app.supabase.com/project/_/settings/api');
  console.warn('The app will run in development mode but Supabase features will not work.');
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

// Create Supabase client with proper configuration
export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  }
);

// Connection test utility
export interface ConnectionStatus {
  connected: boolean;
  configured: boolean;
  error?: string;
  details?: {
    url: string;
    hasKey: boolean;
    keyLength: number;
  };
}

/**
 * Test Supabase connection
 */
export async function testSupabaseConnection(): Promise<ConnectionStatus> {
  const status: ConnectionStatus = {
    connected: false,
    configured: isConfigured,
    details: {
      url: supabaseUrl || 'Not set',
      hasKey: !!supabaseAnonKey,
      keyLength: supabaseAnonKey?.length || 0
    }
  };

  if (!isConfigured) {
    status.error = 'Supabase is not configured. Please set environment variables.';
    return status;
  }

  try {
    // Test 1: Check if we can reach the Supabase API
    const { data: healthCheck, error: healthError } = await supabase
      .from('contact_submissions')
      .select('count')
      .limit(0);

    if (healthError) {
      // If it's a schema error, connection is working but table might not exist
      if (healthError.code === 'PGRST116' || healthError.message?.includes('relation') || healthError.message?.includes('does not exist')) {
        status.connected = true;
        status.error = 'Connected but table "contact_submissions" does not exist. This is normal if migrations haven\'t been run.';
        return status;
      }
      
      // If it's an auth error, connection is working but RLS might be blocking
      if (healthError.code === 'PGRST301' || healthError.message?.includes('permission') || healthError.message?.includes('RLS')) {
        status.connected = true;
        status.error = 'Connected but access denied. Check Row Level Security policies.';
        return status;
      }

      throw healthError;
    }

    status.connected = true;
    return status;
  } catch (error: any) {
    status.error = error?.message || 'Failed to connect to Supabase';
    
    // Check if it's a network error
    if (error?.message?.includes('fetch') || error?.message?.includes('network')) {
      status.error = 'Network error. Check your internet connection and Supabase URL.';
    }
    
    // Check if it's an invalid URL
    if (error?.message?.includes('Invalid URL') || error?.message?.includes('URL')) {
      status.error = 'Invalid Supabase URL. Please check VITE_SUPABASE_URL.';
    }

    return status;
  }
}

/**
 * Get connection status synchronously (without testing)
 */
export function getConnectionStatus(): ConnectionStatus {
  return {
    connected: false, // Will be determined by async test
    configured: isConfigured,
    details: {
      url: supabaseUrl || 'Not set',
      hasKey: !!supabaseAnonKey,
      keyLength: supabaseAnonKey?.length || 0
    },
    error: !isConfigured ? 'Supabase is not configured' : undefined
  };
}