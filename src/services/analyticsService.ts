import { isFirebaseConfigured, db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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

    if (isFirebaseConfigured) {
      addDoc(collection(db, 'cq_events'), {
        event_name: event,
        payload: payload || {},
        createdAt: serverTimestamp(),
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
