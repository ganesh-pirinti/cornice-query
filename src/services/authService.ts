import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { generateUniqueReferralCode, getPendingReferralCode, clearPendingReferralCode } from './referralService';
import { FIRST_USER_LIMIT, EARLY_USER_POINTS, NORMAL_USER_POINTS, POINTS_PER_REFERRAL, REFERRAL_TARGET } from '../config/boostPoints';

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
 * Perform Google OAuth Authentication via Supabase
 */
export async function signInWithGoogle(): Promise<{ error: Error | null }> {
  if (isSupabaseConfigured) {
    const pendingRef = getPendingReferralCode();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
          pending_referral: pendingRef || '',
        },
      },
    });
    return { error };
  } else {
    // Development fallback mode if Supabase env vars are not set
    const mockEmail = `google.user.${Math.floor(Math.random() * 1000)}@cq-builds.dev`;
    const user = signUp(mockEmail, 'Google Developer', 'password123');
    user.provider = 'google';
    user.avatar_url = 'https://lh3.googleusercontent.com/a/default-user';
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    cachedProfile = user;
    return { error: null };
  }
}

/**
 * Perform Email/Password Sign Up with Supabase backend
 */
export async function signUpWithEmail(
  email: string,
  displayName: string,
  password?: string
): Promise<{ user: UserProfile | null; error: Error | null }> {
  const pendingRef = getPendingReferralCode();

  if (isSupabaseConfigured) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: password || 'CQ_SecurePass_2026!',
      options: {
        data: {
          display_name: displayName,
          full_name: displayName,
          pending_referral: pendingRef || '',
        },
      },
    });

    if (authError) return { user: null, error: authError };

    if (authData.user) {
      // Process pending referral via server-side RPC if present
      if (pendingRef) {
        try {
          await supabase.rpc('process_referral_on_signup', {
            p_new_user_id: authData.user.id,
            p_referral_code: pendingRef,
          });
        } catch {
          // Ignore RPC failure gracefully
        }
        clearPendingReferralCode();
      }

      // Fetch newly created profile from Supabase
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profile) {
        const userProfile = mapDatabaseProfileToUser(profile);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userProfile));
        cachedProfile = userProfile;
        notifyUserUpdated(userProfile);
        return { user: userProfile, error: null };
      }
    }
  }

  const user = signUp(email, displayName, password);
  return { user, error: null };
}

/**
 * Perform Email Sign In with Supabase backend
 */
export async function signInWithEmail(
  email: string,
  password?: string
): Promise<{ user: UserProfile | null; error: Error | null }> {
  if (isSupabaseConfigured) {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: password || 'CQ_SecurePass_2026!',
    });

    if (authError) return { user: null, error: authError };

    if (authData.user) {
      // Check if pending referral needs to be processed
      const pendingRef = getPendingReferralCode();
      if (pendingRef) {
        try {
          await supabase.rpc('process_referral_on_signup', {
            p_new_user_id: authData.user.id,
            p_referral_code: pendingRef,
          });
        } catch {
          // Ignore RPC failure gracefully
        }
        clearPendingReferralCode();
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profile) {
        const userProfile = mapDatabaseProfileToUser(profile);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userProfile));
        cachedProfile = userProfile;
        notifyUserUpdated(userProfile);
        return { user: userProfile, error: null };
      }
    }
  }

  const user = signIn(email);
  return { user, error: null };
}

/**
 * Sign out and clear persistent session
 */
export async function signOutUser(): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore network errors on signout
    }
  }
  localStorage.removeItem(AUTH_USER_KEY);
  cachedProfile = null;
}

export const signOut = signOutUser;

/**
 * Subscribe to Supabase auth state changes & restore persistent session
 */
export function initAuthSessionListener(onUserChange: (user: UserProfile | null) => void): () => void {
  if (isSupabaseConfigured) {
    const { data: subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Process pending referral if present
        const pendingRef = getPendingReferralCode();
        if (pendingRef) {
          try {
            await supabase.rpc('process_referral_on_signup', {
              p_new_user_id: session.user.id,
              p_referral_code: pendingRef,
            });
          } catch {
            // Ignore
          }
          clearPendingReferralCode();
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          const userProfile = mapDatabaseProfileToUser(profile);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userProfile));
          cachedProfile = userProfile;
          onUserChange(userProfile);
          return;
        }
      }

      if (event === 'SIGNED_OUT') {
        localStorage.removeItem(AUTH_USER_KEY);
        cachedProfile = null;
        onUserChange(null);
      }
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }

  return () => {};
}

export function mapDatabaseProfileToUser(row: any): UserProfile {
  return {
    id: row.id,
    auth_user_id: row.id,
    display_name: row.display_name || row.full_name || row.email.split('@')[0],
    email: row.email,
    avatar_url: row.avatar_url,
    provider: row.provider || 'email',
    referral_code: row.referral_code,
    referred_by: row.referred_by,
    points: row.boost_points ?? 10,
    is_early_user: row.first_20_bonus ?? false,
    successful_referrals: 0,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

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
