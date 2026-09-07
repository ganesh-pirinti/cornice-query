import { createClient, SupabaseClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  '';

export const supabaseUrl = rawUrl.trim();
export const supabaseAnonKey = rawKey.trim();

/**
 * Validates whether the Supabase URL is correctly formatted for production / development.
 */
export function validateSupabaseConfig(): { isValid: boolean; error?: string } {
  if (!supabaseUrl) {
    return { isValid: false, error: 'VITE_SUPABASE_URL environment variable is missing.' };
  }
  if (!supabaseAnonKey) {
    return { isValid: false, error: 'VITE_SUPABASE_PUBLISHABLE_KEY / VITE_SUPABASE_ANON_KEY environment variable is missing.' };
  }
  if (!supabaseUrl.startsWith('https://')) {
    return { isValid: false, error: `VITE_SUPABASE_URL must start with "https://". Received: "${supabaseUrl}"` };
  }

  // Detect common misconfigurations like using .co instead of .supabase.co or setting Vercel/Netlify URL as Supabase URL
  if (supabaseUrl.includes('vercel.app') || supabaseUrl.includes('netlify.app')) {
    return {
      isValid: false,
      error: `VITE_SUPABASE_URL is set to a deployment URL ("${supabaseUrl}"). It MUST be your actual Supabase project URL (e.g. "https://<project-ref>.supabase.co").`,
    };
  }

  if (supabaseUrl.endsWith('.co') && !supabaseUrl.endsWith('.supabase.co')) {
    return {
      isValid: false,
      error: `VITE_SUPABASE_URL appears malformed ("${supabaseUrl}"). Supabase project URLs must end with ".supabase.co" (e.g. "https://<project-ref>.supabase.co").`,
    };
  }

  return { isValid: true };
}

const configStatus = validateSupabaseConfig();
export const isSupabaseConfigured = configStatus.isValid;

if (!configStatus.isValid && typeof window !== 'undefined') {
  console.error(`[CQ Supabase Configuration Warning]: ${configStatus.error}`);
}

// Create Supabase client instance (or a dummy client placeholder if unconfigured during initial dev setup)
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);
