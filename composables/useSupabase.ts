import { createClient } from '@supabase/supabase-js';

export const useSupabase = () => {
  // Use runtimeConfig for secure access to environment variables
  const config = useRuntimeConfig();

  const supabaseUrl: string = config.public.supabaseUrl as string;
  const supabaseAnonKey: string = config.public.supabaseAnonKey as string;

  return createClient(supabaseUrl, supabaseAnonKey);
};
