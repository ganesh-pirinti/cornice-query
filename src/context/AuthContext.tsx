import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase';
import {
  signInWithGoogleFirebase,
  fetchFirebaseUserProfile,
  signOutFirebase,
} from '../services/firebaseAuthService';
import {
  getCurrentUser,
  signInWithEmail as serviceSignInWithEmail,
  signUpWithEmail as serviceSignUpWithEmail,
  type UserProfile,
} from '../services/authService';

interface AuthContextType {
  user: UserProfile | null;
  authUser: FirebaseUser | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<{ user: UserProfile | null; isNewUser?: boolean; error: Error | null }>;
  signInWithEmail: (email: string, password?: string) => Promise<{ user: UserProfile | null; error: Error | null }>;
  signUpWithEmail: (email: string, displayName: string, password?: string) => Promise<{ user: UserProfile | null; error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshProfile = useCallback(async (): Promise<UserProfile | null> => {
    if (authUser?.uid && isFirebaseConfigured) {
      const updated = await fetchFirebaseUserProfile(authUser.uid, authUser);
      if (updated) {
        setUser(updated);
        return updated;
      }
    }
    const current = getCurrentUser();
    setUser(current);
    return current;
  }, [authUser]);

  useEffect(() => {
    let mounted = true;

    const handleUserUpdate = (e: CustomEvent) => {
      if (mounted) {
        const detailUser = e.detail !== undefined ? e.detail : getCurrentUser();
        console.log('[CQ AUTH DEBUG] AuthContext received cq_user_updated event:', detailUser?.email || detailUser?.id);
        setUser(detailUser);
        setLoading(false);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('cq_user_updated', handleUserUpdate as EventListener);
    }

    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (!mounted) return;
        setAuthUser(fbUser);

        if (fbUser) {
          const profile = await fetchFirebaseUserProfile(fbUser.uid, fbUser);
          if (mounted) {
            const realUser = profile || {
              id: fbUser.uid,
              auth_user_id: fbUser.uid,
              display_name: fbUser.displayName || fbUser.email?.split('@')[0] || 'CQ User',
              email: fbUser.email || '',
              avatar_url: fbUser.photoURL || undefined,
              provider: 'google',
              referral_code: 'CQ' + fbUser.uid.substring(0, 6).toUpperCase(),
              points: 10,
              is_early_user: false,
              successful_referrals: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            console.log('[CQ AUTH DEBUG] AuthContext user updated via onAuthStateChanged:', realUser.email);
            setUser(realUser);
            setLoading(false);
          }
        } else {
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
        }
      });

      return () => {
        mounted = false;
        unsubscribe();
        if (typeof window !== 'undefined') {
          window.removeEventListener('cq_user_updated', handleUserUpdate as EventListener);
        }
      };
    } else {
      if (mounted) {
        setUser(getCurrentUser());
        setLoading(false);
      }
      return () => {
        mounted = false;
        if (typeof window !== 'undefined') {
          window.removeEventListener('cq_user_updated', handleUserUpdate as EventListener);
        }
      };
    }
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const res = await signInWithGoogleFirebase();
      if (res.user) {
        setUser(res.user);
      }
      return res;
    } finally {
      setLoading(false);
    }
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
    await signOutFirebase();
    setUser(null);
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authUser,
        loading,
        isConfigured: isFirebaseConfigured,
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
