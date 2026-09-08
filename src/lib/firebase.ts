import { initializeApp, getApps, getApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

const rawApiKey = import.meta.env.VITE_FIREBASE_API_KEY || '';

export const isFirebaseConfigured: boolean = !!(
  rawApiKey &&
  rawApiKey !== 'placeholder' &&
  rawApiKey.trim() !== ''
);

if (!isFirebaseConfigured && import.meta.env.DEV) {
  console.error(
    '=================================================================\n' +
    '[CQ Firebase Configuration Warning]\n' +
    'Required environment variable missing: VITE_FIREBASE_API_KEY\n' +
    'Project ID: cornice-query\n' +
    'Please add your real Firebase Web API Key to .env.local:\n' +
    'VITE_FIREBASE_API_KEY=AIzaSy...\n' +
    'Firebase Console -> Project Settings -> General -> Your apps -> Web app.\n' +
    '================================================================='
  );
}

const firebaseConfig = {
  apiKey: rawApiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'cornice-query.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'cornice-query',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

let app: FirebaseApp | undefined;
let authInstance: Auth;
let dbInstance: Firestore;
let googleProviderInstance: GoogleAuthProvider;

if (isFirebaseConfigured) {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);
  googleProviderInstance = new GoogleAuthProvider();
  googleProviderInstance.setCustomParameters({
    prompt: 'select_account',
  });
} else {
  // Safe dummy object references so top-level imports do not throw synchronous syntax/runtime errors before configuration is loaded
  authInstance = {} as Auth;
  dbInstance = {} as Firestore;
  googleProviderInstance = {} as GoogleAuthProvider;
}

export const auth = authInstance;
export const db = dbInstance;
export const googleProvider = googleProviderInstance;
export { app };

