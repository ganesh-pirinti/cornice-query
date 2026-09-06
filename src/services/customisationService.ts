import { supabase, isSupabaseConfigured } from '../lib/supabase';
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

  if (isSupabaseConfigured && user?.id) {
    try {
      const { data, error } = await supabase
        .from('customisation_submissions')
        .insert({
          user_id: user.id,
          qualification_score: request.quizScore,
          full_stack_interest: request.fullStack,
          boost_points: request.pointsUsed || user.points || 0,
          discount_eligible: user.points >= 100,
          requirements: request.requirement,
          price_shown: request.priceShown,
          status: 'Requirement Submitted',
        })
        .select()
        .single();

      if (!error && data) {
        const record: UserCustomisationRequest = {
          id: data.id,
          userId: data.user_id,
          quizScore: data.qualification_score,
          fullStack: data.full_stack_interest,
          requirement: data.requirements || '',
          priceShown: data.price_shown || '',
          discountPercentage: request.discountPercentage,
          pointsUsed: data.boost_points,
          status: data.status as any,
          createdAt: data.created_at,
        };
        saveToLocalStorage(record);
        return record;
      }
    } catch {
      // Fallback to local storage
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

export async function fetchUserCustomisationsFromSupabase(userId: string): Promise<UserCustomisationRequest[]> {
  if (!isSupabaseConfigured) return getUserCustomisations(userId);

  try {
    const { data, error } = await supabase
      .from('customisation_submissions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return getUserCustomisations(userId);

    return data.map((item) => ({
      id: item.id,
      userId: item.user_id,
      quizScore: item.qualification_score,
      fullStack: item.full_stack_interest,
      requirement: item.requirements || '',
      priceShown: item.price_shown || '',
      discountPercentage: item.discount_eligible ? 40 : 0,
      pointsUsed: item.boost_points,
      status: item.status as any,
      createdAt: item.created_at,
    }));
  } catch {
    return getUserCustomisations(userId);
  }
}
