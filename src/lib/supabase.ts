import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string;
          customer_name: string;
          unique_id: string;
          tracking_number: string;
          status: 'active' | 'completed' | 'pending' | 'cancelled';
          notes: string | null;
          created_at: string;
          updated_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          unique_id: string;
          tracking_number: string;
          status?: 'active' | 'completed' | 'pending' | 'cancelled';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          unique_id?: string;
          tracking_number?: string;
          status?: 'active' | 'completed' | 'pending' | 'cancelled';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'admin' | 'manager' | 'member';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'admin' | 'manager' | 'member';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'admin' | 'manager' | 'member';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};