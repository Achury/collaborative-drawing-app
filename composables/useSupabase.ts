import { createClient } from '@supabase/supabase-js';

let supabase: ReturnType<typeof createClient> | null = null;

export const useSupabase = () => {
  if (!supabase) {
    const config = useRuntimeConfig();
    const supabaseUrl = config.public.supabaseUrl as string;
    const supabaseAnonKey = config.public.supabaseAnonKey as string;

    console.log(supabaseUrl, supabaseAnonKey);

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Supabase URL and anon key must be provided in runtime config.'
      );
    }

    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabase;
};
