/**
 * ==============================================================================
 * CORNICE & QUERY — REAL ANALYTICS & FUNNEL SERVICE
 * ==============================================================================
 * 
 * Tracks genuine user actions across the Customise qualification funnel.
 * NO FAKE STATS OR GENERATED NUMBERS.
 */

export type AnalyticsEvent =
  | 'website_visit'
  | 'customise_clicked'
  | 'quiz_started'
  | 'quiz_completed'
  | 'qualification_passed'
  | 'qualification_failed'
  | 'fullstack_yes'
  | 'fullstack_no'
  | 'pricing_viewed'
  | 'whatsapp_clicked'
  | 'whatsapp_channel_clicked';

const ANALYTICS_PREFIX = 'cq_metric_v1_';

export function trackEvent(event: AnalyticsEvent, payload?: Record<string, any>): void {
  try {
    const current = parseInt(localStorage.getItem(ANALYTICS_PREFIX + event) || '0', 10);
    localStorage.setItem(ANALYTICS_PREFIX + event, String(current + 1));

    // Optional Supabase logging if env variables are present
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) {
      fetch(`${supabaseUrl}/rest/v1/cq_events`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_name: event,
          payload: payload || {},
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});
    }
  } catch (err) {
    // Silent fail safely
  }
}

export function getEventCount(event: AnalyticsEvent): number {
  try {
    const val = localStorage.getItem(ANALYTICS_PREFIX + event);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}
