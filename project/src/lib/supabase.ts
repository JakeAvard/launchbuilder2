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
      organizations: {
        Row: {
          id: string;
          name: string;
          category: string;
          description: string;
          logo_url: string | null;
          location: string | null;
          website: string | null;
          verified: boolean;
          created_at: string;
        };
      };
      campaigns: {
        Row: {
          id: string;
          organization_id: string;
          title: string;
          description: string;
          goal_amount: number;
          current_amount: number;
          start_date: string;
          end_date: string | null;
          image_url: string | null;
          created_at: string;
        };
      };
      donations: {
        Row: {
          id: string;
          user_id: string;
          organization_id: string;
          campaign_id: string | null;
          amount: number;
          original_amount: number | null;
          round_up_amount: number;
          is_recurring: boolean;
          frequency: string;
          status: string;
          donation_date: string;
          created_at: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          display_name: string | null;
          email: string | null;
          location: string | null;
          monthly_goal: number;
          annual_goal: number;
          round_up_enabled: boolean;
          round_up_multiplier: number;
          created_at: string;
          updated_at: string;
        };
      };
      alerts: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          is_read: boolean;
          related_id: string | null;
          created_at: string;
        };
      };
      round_up_settings: {
        Row: {
          id: string;
          user_id: string;
          enabled: boolean;
          round_to: number;
          auto_donate: boolean;
          accumulation_threshold: number;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
};
