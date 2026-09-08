import {
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  getCountFromServer,
  query,
  where,
  getDocs,
  increment,
} from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseConfigured } from '../lib/firebase';
import {
  getPendingReferralCode,
  clearPendingReferralCode,
} from './referralService';
import type { UserProfile } from './authService';

const AUTH_USER_KEY = 'cq_current_user_profile_v1';

export async function signInWithGoogleFirebase(): Promise<{ user: UserProfile | null; isNewUser: boolean; error: Error | null }> {
  console.log('[CQ AUTH DEBUG] STEP 2: Starting Firebase popup');
  console.log('[CQ AUTH DEBUG] Firebase auth instance available:', !!auth && typeof auth === 'object');
  console.log('[CQ AUTH DEBUG] GoogleAuthProvider created:', !!googleProvider);

  if (!isFirebaseConfigured) {
    console.warn('[CQ AUTH DEBUG] FAILED STEP: STEP 2: Firebase configuration check');
    return { user: null, isNewUser: false, error: new Error('Firebase is not configured yet. Please check environment variables.') };
  }

  let fbUser: any;
  try {
    console.log('[CQ AUTH DEBUG] Calling signInWithPopup');
    const result = await signInWithPopup(auth, googleProvider);
    console.log('[CQ AUTH DEBUG] STEP 3: Firebase popup resolved');
    fbUser = result.user;
    console.log('[CQ AUTH DEBUG] STEP 4: Firebase user received:', fbUser?.email || fbUser?.uid);

    // [AUTH IDENTITY DEBUG] & [REAL AUTH CHECK] Log non-sensitive Google account identity verification details
    const currentAuthUser = auth.currentUser;
    console.log('[REAL AUTH CHECK]');
    console.log('Firebase Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID || 'cornice-query');
    console.log('Firebase UID:', currentAuthUser?.uid || fbUser.uid);
    console.log('Firebase Email:', currentAuthUser?.email || fbUser.email);
    console.log('Firebase Display Name:', currentAuthUser?.displayName || fbUser.displayName);
    console.log('Firebase Photo URL:', currentAuthUser?.photoURL || fbUser.photoURL);
    console.log('auth.currentUser === authenticatedUser:', currentAuthUser?.uid === fbUser.uid);
  } catch (authErr: any) {
    console.error('[CQ AUTH DEBUG] FAILED STEP: STEP 2 / STEP 3: Firebase Popup Authentication');
    console.error('[CQ AUTH DEBUG] ERROR CODE:', authErr?.code);
    console.error('[CQ AUTH DEBUG] ERROR NAME:', authErr?.name);
    console.error('[CQ AUTH DEBUG] ERROR MESSAGE:', authErr?.message);
    console.error('[CQ AUTH DEBUG] FULL ERROR:', authErr);
    return { user: null, isNewUser: false, error: authErr };
  }

  console.log('[CQ AUTH DEBUG] STEP 6: Firestore/profile operation started');
  let profile: UserProfile;
  let isNewUser = false;

  const realEmail = fbUser.email || '';
  const realDisplayName = fbUser.displayName || (realEmail ? realEmail.split('@')[0] : 'CQ User');
  const realPhotoURL = fbUser.photoURL || undefined;

  try {
    const userDocRef = doc(db, 'users', fbUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap && userDocSnap.exists()) {
      // Existing User: Update lastLoginAt and read points/referral metadata while maintaining real Google Auth identity
      const data = userDocSnap.data();
      try {
        await updateDoc(userDocRef, {
          lastLoginAt: serverTimestamp(),
          displayName: realDisplayName,
          email: realEmail,
          photoURL: fbUser.photoURL || '',
        });
      } catch (updateErr) {
        console.warn('[CQ AUTH DEBUG] Non-blocking Firestore updateDoc warning:', updateErr);
      }

      profile = {
        id: fbUser.uid, // Strictly authoritative Firebase UID
        auth_user_id: fbUser.uid, // Strictly authoritative Firebase UID
        display_name: realDisplayName, // Strictly real Google Display Name
        email: realEmail, // Strictly real Google Email
        avatar_url: realPhotoURL, // Strictly real Google Photo URL
        provider: 'google',
        referral_code: data.referralCode || ('CQ' + fbUser.uid.substring(0, 6).toUpperCase()),
        referred_by: data.referredBy || undefined,
        points: data.boostPoints ?? 10,
        is_early_user: data.isEarlyUser ?? false,
        successful_referrals: data.referralCount ?? 0,
        created_at: data.createdAt ? new Date(data.createdAt.seconds * 1000).toISOString() : new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } else {
      // New User Initialization
      isNewUser = true;

      let totalUsersCount = 0;
      try {
        const snapshot = await getCountFromServer(collection(db, 'users'));
        totalUsersCount = snapshot.data().count;
      } catch {
        totalUsersCount = 0;
      }

      const isEarlyUser = totalUsersCount < 20;
      const initialPoints = isEarlyUser ? 100 : 10;
      const referralCode = 'CQ' + fbUser.uid.substring(0, 6).toUpperCase();
      const pendingRef = getPendingReferralCode();
      let referredByCode: string | undefined = undefined;

      if (pendingRef && pendingRef !== referralCode) {
        try {
          const q = query(collection(db, 'users'), where('referralCode', '==', pendingRef));
          const querySnap = await getDocs(q);

          if (!querySnap.empty) {
            const referrerDoc = querySnap.docs[0];
            if (referrerDoc.id !== fbUser.uid) {
              referredByCode = pendingRef;
              await updateDoc(doc(db, 'users', referrerDoc.id), {
                boostPoints: increment(10),
                referralCount: increment(1),
              });
            }
          }
        } catch (e) {
          console.warn('[CQ AUTH DEBUG] Non-blocking referral credit warning:', e);
        }
        clearPendingReferralCode();
      }

      const newUserData = {
        uid: fbUser.uid,
        displayName: realDisplayName,
        email: realEmail,
        photoURL: fbUser.photoURL || '',
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        boostPoints: initialPoints,
        referralCode: referralCode,
        referralCount: 0,
        isEarlyUser: isEarlyUser,
        discountEligible: initialPoints >= 100,
        referredBy: referredByCode || null,
      };

      try {
        await setDoc(userDocRef, newUserData);
      } catch (setErr) {
        console.warn('[CQ AUTH DEBUG] Non-blocking Firestore setDoc warning:', setErr);
      }

      profile = {
        id: fbUser.uid,
        auth_user_id: fbUser.uid,
        display_name: realDisplayName,
        email: realEmail,
        avatar_url: realPhotoURL,
        provider: 'google',
        referral_code: referralCode,
        referred_by: referredByCode,
        points: initialPoints,
        is_early_user: isEarlyUser,
        successful_referrals: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
    console.log('[CQ AUTH DEBUG] STEP 7: Firestore/profile operation completed');
  } catch (fsErr: any) {
    console.warn('[CQ AUTH DEBUG] Non-critical Firestore warning (using exact Firebase Auth User identity):', {
      code: fsErr?.code,
      message: fsErr?.message,
      fsErr,
    });
    // Build user profile directly from real Firebase Auth User object without identity fabrication
    profile = {
      id: fbUser.uid,
      auth_user_id: fbUser.uid,
      display_name: realDisplayName,
      email: realEmail,
      avatar_url: realPhotoURL,
      provider: 'google',
      referral_code: 'CQ' + fbUser.uid.substring(0, 6).toUpperCase(),
      points: 10,
      is_early_user: false,
      successful_referrals: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    console.log('[CQ AUTH DEBUG] STEP 7: Real Firebase Auth User profile generated');
  }

  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(profile));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cq_user_updated', { detail: profile }));
  }

  return { user: profile, isNewUser, error: null };
}

export async function fetchFirebaseUserProfile(uid: string, fbUserObj?: any): Promise<UserProfile | null> {
  if (!isFirebaseConfigured) return null;
  const currentFbUser = fbUserObj || auth.currentUser;
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    const realEmail = currentFbUser?.email || '';
    const realDisplayName = currentFbUser?.displayName || (realEmail ? realEmail.split('@')[0] : 'CQ User');
    const realPhotoURL = currentFbUser?.photoURL || undefined;

    if (userDocSnap && userDocSnap.exists()) {
      const data = userDocSnap.data();
      const profile: UserProfile = {
        id: uid,
        auth_user_id: uid,
        display_name: realDisplayName || data.displayName || 'CQ User',
        email: realEmail || data.email || '',
        avatar_url: realPhotoURL || data.photoURL || undefined,
        provider: 'google',
        referral_code: data.referralCode || ('CQ' + uid.substring(0, 6).toUpperCase()),
        referred_by: data.referredBy || undefined,
        points: data.boostPoints ?? 10,
        is_early_user: data.isEarlyUser ?? false,
        successful_referrals: data.referralCount ?? 0,
        created_at: data.createdAt ? new Date(data.createdAt.seconds * 1000).toISOString() : new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(profile));
      return profile;
    }
  } catch (err) {
    console.warn('[CQ Firebase Profile Fetch Warning]:', err);
  }
  return null;
}

export async function signOutFirebase(): Promise<void> {
  if (isFirebaseConfigured) {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('[CQ Firebase SignOut Warning]:', e);
    }
  }
  localStorage.removeItem(AUTH_USER_KEY);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cq_user_updated', { detail: null }));
  }
}
