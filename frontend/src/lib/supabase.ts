import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase credentials are missing. Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your frontend .env file."
  );
}

/**
 * Supabase client instance for client-side Auth and DB interactions.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
