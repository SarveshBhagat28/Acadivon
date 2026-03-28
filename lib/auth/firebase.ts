import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  type Auth,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

const firebaseEnvVars = [
  ["NEXT_PUBLIC_FIREBASE_API_KEY", firebaseConfig.apiKey],
  ["NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", firebaseConfig.authDomain],
  ["NEXT_PUBLIC_FIREBASE_PROJECT_ID", firebaseConfig.projectId],
  ["NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", firebaseConfig.storageBucket],
  ["NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", firebaseConfig.messagingSenderId],
  ["NEXT_PUBLIC_FIREBASE_APP_ID", firebaseConfig.appId],
] as const;

const missingFirebaseEnvVars = firebaseEnvVars
  .filter(([, value]) => !value)
  .map(([key]) => key);

const isFirebaseConfigured = missingFirebaseEnvVars.length === 0;

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let firebaseInitError: string | null = null;
let googleProvider: GoogleAuthProvider | undefined;
let githubProvider: GithubAuthProvider | undefined;

if (isFirebaseConfigured) {
  try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    githubProvider = new GithubAuthProvider();
  } catch (error) {
    firebaseInitError =
      error instanceof Error ? error.message : "Firebase initialization failed.";
    if (process.env.NODE_ENV !== "production") {
      console.warn("Firebase client failed to initialize:", error);
    }
  }
} else if (process.env.NODE_ENV !== "production") {
  console.warn(
    "Firebase client config is missing. Set the following environment variables:",
    missingFirebaseEnvVars.join(", ")
  );
}

function getFirebaseAuthErrorMessage(): string | null {
  const isDetailedMessage = process.env.NODE_ENV !== "production";
  if (!isFirebaseConfigured) {
    if (!isDetailedMessage) {
      return "Authentication is not configured. Please contact your administrator.";
    }
    return `Firebase authentication is not configured. Add ${missingFirebaseEnvVars.join(
      ", "
    )} to your environment variables and redeploy. If you don't manage deployments, contact your administrator.`;
  }
  if (firebaseInitError) {
    if (!isDetailedMessage) {
      return "Authentication is currently unavailable. Please contact your administrator.";
    }
    return `Firebase authentication failed to initialize (${firebaseInitError}). Check your environment variables and redeploy, or contact your administrator.`;
  }
  return null;
}

function getFirebaseAuthUnavailableMessage(): string {
  return (
    getFirebaseAuthErrorMessage() ??
    "Authentication is currently unavailable. Please contact your administrator."
  );
}

function getAuthProviderUnavailableMessage(provider: string): string {
  return `${provider} sign-in is currently unavailable. Please contact your administrator.`;
}

export {
  auth,
  googleProvider,
  githubProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  isFirebaseConfigured,
  missingFirebaseEnvVars,
  firebaseInitError,
  getFirebaseAuthErrorMessage,
  getFirebaseAuthUnavailableMessage,
  getAuthProviderUnavailableMessage,
};
