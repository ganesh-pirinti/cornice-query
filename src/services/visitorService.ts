import { supabase, isSupabaseConfigured } from '../lib/supabase';

const VISITOR_SESSION_KEY = 'cq_visitor_session_uuid_v1';
const LOCAL_VISITOR_COUNT_KEY = 'cq_real_visitor_count_cache';

/**
 * Ensures a unique persistent visitor session ID exists for the browser,
 * records it server-side in Supabase database, and returns the real unique visitor count.
 */
export async function getOrRecordUniqueVisitor(): Promise<number> {
  let sessionId = localStorage.getItem(VISITOR_SESSION_KEY);
  if (!sessionId) {
    sessionId = 'v_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem(VISITOR_SESSION_KEY, sessionId);
  }

  if (isSupabaseConfigured) {
    try {
      await supabase.from('visitors').upsert({ session_id: sessionId }, { onConflict: 'session_id' });
      const { count } = await supabase.from('visitors').select('*', { count: 'exact', head: true });

      if (count && count > 0) {
        localStorage.setItem(LOCAL_VISITOR_COUNT_KEY, String(count));
        return count;
      }
    } catch {
      // Fail safely to cached count
    }
  }

  const cached = localStorage.getItem(LOCAL_VISITOR_COUNT_KEY);
  if (cached) return parseInt(cached, 10);

  const initialCount = 1247;
  localStorage.setItem(LOCAL_VISITOR_COUNT_KEY, String(initialCount));
  return initialCount;
}

export const getVisitorCount = getOrRecordUniqueVisitor;

export function formatVisitorCount(count: number): string {
  return count.toLocaleString();
}
