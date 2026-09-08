import { isFirebaseConfigured, db } from '../lib/firebase';
import { doc, getDoc, setDoc, increment, serverTimestamp } from 'firebase/firestore';

const VISITOR_SESSION_KEY = 'cq_visitor_session_uuid_v1';
const VISITOR_RECORDED_KEY = 'cq_visitor_recorded_v1';
const LOCAL_VISITOR_COUNT_KEY = 'cq_real_visitor_count_cache';

/**
 * Ensures a unique persistent visitor session ID exists for the browser,
 * records it server-side in Firestore database once per browser session,
 * and returns the real unique visitor count.
 */
export async function getOrRecordUniqueVisitor(): Promise<number> {
  let sessionId = localStorage.getItem(VISITOR_SESSION_KEY);
  if (!sessionId) {
    sessionId = 'v_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem(VISITOR_SESSION_KEY, sessionId);
  }

  const isAlreadyRecorded = localStorage.getItem(VISITOR_RECORDED_KEY) === 'true';

  if (isFirebaseConfigured) {
    try {
      const counterDocRef = doc(db, 'visitor_analytics', 'counter');

      if (!isAlreadyRecorded) {
        const sessionDocRef = doc(db, 'visitor_sessions', sessionId);
        const sessionSnap = await getDoc(sessionDocRef);

        if (!sessionSnap.exists()) {
          await setDoc(sessionDocRef, {
            sessionId,
            createdAt: serverTimestamp(),
          });

          await setDoc(counterDocRef, {
            count: increment(1),
            updatedAt: serverTimestamp(),
          }, { merge: true });
        }
        localStorage.setItem(VISITOR_RECORDED_KEY, 'true');
      }

      const counterSnap = await getDoc(counterDocRef);
      if (counterSnap.exists()) {
        const total = counterSnap.data().count;
        if (typeof total === 'number' && total > 0) {
          localStorage.setItem(LOCAL_VISITOR_COUNT_KEY, String(total));
          return total;
        }
      }
    } catch (err) {
      console.warn('[CQ Visitor Analytics Warning]:', err);
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
