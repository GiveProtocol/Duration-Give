import { createClient } from '@supabase/supabase-js';
import { ENV } from '../config/env';

// Supabase client configuration
const supabaseUrl = ENV.SUPABASE_URL;
const supabaseAnonKey = ENV.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

// Create Supabase client with security and performance optimizations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Configure auth settings
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // Use PKCE flow for better security
    // Storage for auth tokens
    storage: {
      getItem: (key: string) => {
        if (typeof window !== 'undefined') {
          return window.localStorage.getItem(key);
        }
        return null;
      },
      setItem: (key: string, value: string) => {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, value);
        }
      },
      removeItem: (key: string) => {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(key);
        }
      },
    },
  },
  db: {
    // Database settings
    schema: 'public',
  },
  global: {
    // Global settings
    headers: {
      'X-Client-Info': 'give-protocol-app',
    },
  },
  realtime: {
    // Realtime settings for live updates
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Helper functions for common operations
export const supabaseHelpers = {
  // Auth helpers
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async refreshSession() {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return data;
  },

  // Database helpers
  async handleError(error: any, context: string) {
    console.error(`Supabase error in ${context}:`, error);
    
    // Log to monitoring if available
    if (typeof window !== 'undefined' && (window as any).MonitoringService) {
      (window as any).MonitoringService.trackMetric('supabase_error', {
        context,
        error: error.message || error.toString(),
        code: error.code,
        details: error.details,
      });
    }
    
    throw error;
  },

  // Connection helpers
  async testConnection() {
    try {
      const { data, error } = await supabase
        .from('_supabase_test')
        .select('*')
        .limit(1);
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = table not found, which is fine for test
        throw error;
      }
      
      return true;
    } catch (error) {
      console.warn('Supabase connection test failed:', error);
      return false;
    }
  },
};

// Types for better TypeScript support
export type SupabaseClient = typeof supabase;

// Export default client
export default supabase;