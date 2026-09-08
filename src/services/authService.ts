import { generateUniqueReferralCode, getPendingReferralCode, clearPendingReferralCode } from './referralService';
import { FIRST_USER_LIMIT, EARLY_USER_POINTS, NORMAL_USER_POINTS, POINTS_PER_REFERRAL, REFERRAL_TARGET } from '../config/boostPoints';
import { signInWithGoogleFirebase, signOutFirebase } from './firebaseAuthService';

export interface UserProfile {
  id: string;
  auth_user_id: string;
  display_name: string;
  email: string;
  avatar_url?: string;
  provider?: string;
  referral_code: string;
  referred_by?: string;
  points: number;
  is_early_user: boolean;
  successful_referrals: number;
  created_at: string;
  updated_at: string;
}

const AUTH_USER_KEY = 'cq_current_user_profile_v1';
const ALL_USERS_KEY = 'cq_registered_accounts_v1';

let cachedProfile: UserProfile | null = null;

export function getCurrentUser(): UserProfile | null {
  if (cachedProfile) return cachedProfile;
  const data = localStorage.getItem(AUTH_USER_KEY);
  if (!data) return null;
  try {
    cachedProfile = JSON.parse(data);
    return cachedProfile;
  } catch {
    return null;
  }
}

export function getAllUsers(): UserProfile[] {
  const data = localStorage.getItem(ALL_USERS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * Perform Google OAuth Authentication via Firebase
 */
export async function signInWithGoogle(): Promise<{ user: UserProfile | null; error: Error | null }> {
  const res = await signInWithGoogleFirebase();
  if (res.user) {
    cachedProfile = res.user;
  }
  return { user: res.user, error: res.error };
}

/**
 * Perform Email/Password Sign Up (Local / Firebase Fallback)
 */
export async function signUpWithEmail(
  email: string,
  displayName: string,
  _password?: string
): Promise<{ user: UserProfile | null; error: Error | null }> {
  const user = signUp(email, displayName, _password);
  return { user, error: null };
}

/**
 * Perform Email Sign In (Local / Firebase Fallback)
 */
export async function signInWithEmail(
  email: string,
  _password?: string
): Promise<{ user: UserProfile | null; error: Error | null }> {
  const user = signIn(email);
  return { user, error: null };
}

/**
 * Sign out and clear persistent session
 */
export async function signOutUser(): Promise<void> {
  await signOutFirebase();
  localStorage.removeItem(AUTH_USER_KEY);
  cachedProfile = null;
}

export const signOut = signOutUser;

export function signUp(email: string, displayName: string, _password?: string): UserProfile {
  const allUsers = getAllUsers();
  const existing = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(existing));
    cachedProfile = existing;
    return existing;
  }

  const isEarlyUser = allUsers.length < FIRST_USER_LIMIT;
  const initialPoints = isEarlyUser ? EARLY_USER_POINTS : NORMAL_USER_POINTS;

  let referralCode = generateUniqueReferralCode();
  while (allUsers.some((u) => u.referral_code === referralCode)) {
    referralCode = generateUniqueReferralCode();
  }

  const pendingRef = getPendingReferralCode();
  let referredByCode: string | undefined = undefined;

  if (pendingRef && pendingRef !== referralCode) {
    const referrer = allUsers.find((u) => u.referral_code === pendingRef);
    if (referrer) {
      referredByCode = referrer.referral_code;
      if (referrer.successful_referrals < REFERRAL_TARGET) {
        referrer.successful_referrals += 1;
        referrer.points += POINTS_PER_REFERRAL;
        referrer.updated_at = new Date().toISOString();
      }
    }
  }

  const newUser: UserProfile = {
    id: 'usr_' + Math.random().toString(36).substring(2, 11),
    auth_user_id: 'auth_' + Math.random().toString(36).substring(2, 11),
    display_name: displayName || email.split('@')[0],
    email: email.toLowerCase(),
    referral_code: referralCode,
    referred_by: referredByCode,
    points: initialPoints,
    is_early_user: isEarlyUser,
    successful_referrals: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  allUsers.push(newUser);
  localStorage.setItem(ALL_USERS_KEY, JSON.stringify(allUsers));
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
  cachedProfile = newUser;

  clearPendingReferralCode();
  notifyUserUpdated(newUser);
  return newUser;
}

export function signIn(email: string): UserProfile {
  const allUsers = getAllUsers();
  let user = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    user = signUp(email, email.split('@')[0]);
  } else {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    cachedProfile = user;
    notifyUserUpdated(user);
  }

  return user;
}

export function notifyUserUpdated(user?: UserProfile | null): void {
  const target = user !== undefined ? user : getCurrentUser();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cq_user_updated', { detail: target }));
  }
}

export function logout(): void {
  signOutUser();
  notifyUserUpdated(null);
}
