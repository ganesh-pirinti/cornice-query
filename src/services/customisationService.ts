import { isFirebaseConfigured, db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy } from 'firebase/firestore';
import { getCurrentUser } from './authService';

export interface UserCustomisationRequest {
  id: string;
  userId: string;
  quizScore: number;
  fullStack: boolean;
  requirement: string;
  priceShown: string;
  discountPercentage: number;
  pointsUsed: number;
  status: 'Requirement Submitted' | 'WhatsApp Contacted' | 'Under Review' | 'In Discussion' | 'Completed';
  createdAt: string;
}

const CUSTOMISATIONS_STORAGE_KEY = 'cq_user_customisations_v1';

export async function saveUserCustomisationRequest(
  request: Omit<UserCustomisationRequest, 'id' | 'createdAt' | 'status'>
): Promise<UserCustomisationRequest> {
  const user = getCurrentUser();

  if (isFirebaseConfigured && user?.id) {
    try {
      const docRef = await addDoc(collection(db, 'customisation_submissions'), {
        userId: user.id,
        quizScore: request.quizScore,
        fullStack: request.fullStack,
        pointsUsed: request.pointsUsed || user.points || 0,
        discountEligible: user.points >= 100,
        requirement: request.requirement,
        priceShown: request.priceShown,
        status: 'Requirement Submitted',
        createdAt: serverTimestamp(),
      });

      const record: UserCustomisationRequest = {
        id: docRef.id,
        userId: user.id,
        quizScore: request.quizScore,
        fullStack: request.fullStack,
        requirement: request.requirement,
        priceShown: request.priceShown,
        discountPercentage: request.discountPercentage,
        pointsUsed: request.pointsUsed,
        status: 'Requirement Submitted',
        createdAt: new Date().toISOString(),
      };
      saveToLocalStorage(record);
      return record;
    } catch (err) {
      console.warn('[CQ Customisation Firebase Warning]:', err);
    }
  }

  const newRecord: UserCustomisationRequest = {
    ...request,
    id: 'cust_' + Math.random().toString(36).substring(2, 11),
    status: 'Requirement Submitted',
    createdAt: new Date().toISOString(),
  };

  saveToLocalStorage(newRecord);
  return newRecord;
}

function saveToLocalStorage(record: UserCustomisationRequest): void {
  const existingStr = localStorage.getItem(CUSTOMISATIONS_STORAGE_KEY) || '[]';
  const existing: UserCustomisationRequest[] = JSON.parse(existingStr);
  existing.unshift(record);
  localStorage.setItem(CUSTOMISATIONS_STORAGE_KEY, JSON.stringify(existing));
}

export function getUserCustomisations(userId?: string): UserCustomisationRequest[] {
  const existingStr = localStorage.getItem(CUSTOMISATIONS_STORAGE_KEY) || '[]';
  const existing: UserCustomisationRequest[] = JSON.parse(existingStr);
  if (userId) {
    return existing.filter((c) => c.userId === userId);
  }
  return existing;
}

export async function fetchUserCustomisationsFromFirestore(userId: string): Promise<UserCustomisationRequest[]> {
  if (!isFirebaseConfigured) return getUserCustomisations(userId);

  try {
    const q = query(
      collection(db, 'customisation_submissions'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);

    if (snap.empty) return getUserCustomisations(userId);

    return snap.docs.map((docItem) => {
      const data = docItem.data();
      return {
        id: docItem.id,
        userId: data.userId,
        quizScore: data.quizScore,
        fullStack: data.fullStack,
        requirement: data.requirement || '',
        priceShown: data.priceShown || '',
        discountPercentage: data.discountEligible ? 40 : 0,
        pointsUsed: data.pointsUsed,
        status: data.status,
        createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000).toISOString() : new Date().toISOString(),
      };
    });
  } catch {
    return getUserCustomisations(userId);
  }
}
