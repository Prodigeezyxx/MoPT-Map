/**
 * Supabase Client — Cloud database connection
 * Uses the new Supabase key format (sb_publishable_* / sb_secret_*)
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ Supabase credentials missing — falling back to localStorage only.\n" +
    "Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file."
  );
}

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
        global: {
          headers: {
            "x-my-custom-header": "mopt-map",
          },
        },
      })
    : null;

/**
 * Health check — verifies the Supabase connection is alive.
 * Returns true if the database is reachable.
 */
export async function checkSupabaseConnection(): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from("app_data")
      .select("key")
      .limit(1);
    if (error) {
      // If table doesn't exist yet, treat as "connection works but needs setup"
      if (error.code === "42P01") {
        console.warn("⚠️ Supabase connected but tables not found. Run supabase-setup.sql first.");
        return false;
      }
      console.warn("⚠️ Supabase query error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("⚠️ Supabase connection failed:", err);
    return false;
  }
}
