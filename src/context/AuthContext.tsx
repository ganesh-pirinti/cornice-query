import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  getCurrentUser,
  signInWithGoogle as serviceSignInWithGoogle,
  signInWithEmail as serviceSignInWithEmail,
  signUpWithEmail as serviceSignUpWithEmail,
  signOutUser as serviceSignOutUser,
  type UserProfile,
} from '../services/authService';

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  authUser: User | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signInWithEmail: (email: string, password?: string) => Promise<{ user: UserProfile | null; error: Error | null }>;
  signUpWithEmail: (email: string, displayName: string, password?: string) => Promise<{ user: UserProfile | null; error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(getCurrentUser());
  const [session, setSession] = useState<Session | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    if (!isSupabaseConfigured) return getCurrentUser();
    try {
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        // Fallback: If profile record is not yet in profiles table, retrieve auth user metadata
        const { data: authUserData } = await supabase.auth.getUser();
        const authUser = authUserData?.user;
        if (authUser && authUser.id === userId) {
          const userEmail = authUser.email || '';
          const displayName = authUser.user_metadata?.full_name || authUser.user_metadata?.name || userEmail.split('@')[0] || 'CQ User';
          const avatarUrl = authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture;

          const newProfile = {
            id: userId,
            email: userEmail,
            display_name: displayName,
            avatar_url: avatarUrl,
            provider: 'google',
            referral_code: 'CQ-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
            boost_points: 10,
            first_20_bonus: true,
          };

          await supabase.from('profiles').upsert(newProfile, { onConflict: 'id' });
          const { data: createdProfile } = await supabase.from('profiles').select('*').eq('id', userId).single();
          data = createdProfile || newProfile;
        }
      }

      if (!data) return getCurrentUser();

      const mapped: UserProfile = {
        id: data.id,
        auth_user_id: data.id,
        display_name: data.display_name || data.full_name || data.email?.split('@')[0] || 'CQ User',
        email: data.email || '',
        avatar_url: data.avatar_url,
        provider: data.provider || 'google',
        referral_code: data.referral_code || ('CQ-' + Math.random().toString(36).substring(2, 8).toUpperCase()),
        referred_by: data.referred_by,
        points: data.boost_points ?? 10,
        is_early_user: data.first_20_bonus ?? false,
        successful_referrals: 0,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString(),
      };

      try {
        const { count } = await supabase
          .from('referrals')
          .select('*', { count: 'exact', head: true })
          .eq('referrer_id', data.id);
        mapped.successful_referrals = count || 0;
      } catch {
        // Ignore referrals query error
      }

      localStorage.setItem('cq_current_user_profile_v1', JSON.stringify(mapped));
      setUser(mapped);
      window.dispatchEvent(new CustomEvent('cq_user_updated', { detail: mapped }));
      return mapped;
    } catch {
      return getCurrentUser();
    }
  }, []);

  const refreshProfile = useCallback(async (): Promise<UserProfile | null> => {
    if (authUser?.id) {
      return await fetchProfile(authUser.id);
    }
    const current = getCurrentUser();
    setUser(current);
    return current;
  }, [authUser, fetchProfile]);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase.auth.getSession();
          if (mounted) {
            setSession(data.session);
            setAuthUser(data.session?.user ?? null);
            if (data.session?.user) {
              await fetchProfile(data.session.user.id);
            }
          }
        } catch {
          // Keep current fallback profile
        } finally {
          if (mounted) setLoading(false);
        }
      } else {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    if (isSupabaseConfigured) {
      const { data: listener } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
        if (!mounted) return;
        setSession(currentSession);
        setAuthUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('cq_current_user_profile_v1');
          window.dispatchEvent(new CustomEvent('cq_user_updated', { detail: null }));
        }
      });

      return () => {
        mounted = false;
        listener.subscription.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, [fetchProfile]);

  const signInWithGoogle = async () => {
    return await serviceSignInWithGoogle();
  };

  const signInWithEmail = async (email: string, password?: string) => {
    const result = await serviceSignInWithEmail(email, password);
    if (result.user) {
      setUser(result.user);
    }
    return result;
  };

  const signUpWithEmail = async (email: string, displayName: string, password?: string) => {
    const result = await serviceSignUpWithEmail(email, displayName, password);
    if (result.user) {
      setUser(result.user);
    }
    return result;
  };

  const signOut = async () => {
    await serviceSignOutUser();
    setUser(null);
    setSession(null);
    setAuthUser(null);
    window.dispatchEvent(new CustomEvent('cq_user_updated', { detail: null }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        authUser,
        loading,
        isConfigured: isSupabaseConfigured,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
