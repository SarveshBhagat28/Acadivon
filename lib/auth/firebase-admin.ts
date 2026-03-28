import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

let adminApp: App;
let firebaseAdminInitError: string | null = null;

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
};

const requiredFirebaseAdminEnvVars = [
  ["FIREBASE_ADMIN_PROJECT_ID", firebaseAdminConfig.projectId],
  ["FIREBASE_ADMIN_PRIVATE_KEY", firebaseAdminConfig.privateKey],
  ["FIREBASE_ADMIN_CLIENT_EMAIL", firebaseAdminConfig.clientEmail],
] as const;

const missingFirebaseAdminEnvVars = requiredFirebaseAdminEnvVars
  .filter(([, value]) => !value)
  .map(([key]) => key);

function getFirebaseAdminAuthErrorMessageIfAny(): string | null {
  const isDetailedMessage = process.env.NODE_ENV !== "production";
  if (missingFirebaseAdminEnvVars.length > 0) {
    if (!isDetailedMessage) {
      return "Authentication service is not configured. Please contact your administrator.";
    }
    return `Firebase Admin authentication is not configured. Add ${missingFirebaseAdminEnvVars.join(
      ", "
    )} to your environment variables and redeploy.`;
  }
  if (firebaseAdminInitError) {
    if (!isDetailedMessage) {
      return "Authentication service is currently unavailable. Please contact your administrator.";
    }
    return `Firebase Admin authentication failed to initialize (${firebaseAdminInitError}). Check your server environment variables and redeploy.`;
  }
  return null;
}

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const configError = getFirebaseAdminAuthErrorMessageIfAny();
  if (configError) {
    throw new Error(configError);
  }

  try {
    adminApp = initializeApp({
      credential: cert({
        projectId: firebaseAdminConfig.projectId,
        privateKey: firebaseAdminConfig.privateKey?.replace(/\\n/g, "\n"),
        clientEmail: firebaseAdminConfig.clientEmail,
      }),
    });
  } catch (error) {
    firebaseAdminInitError =
      error instanceof Error ? error.message : "Firebase Admin initialization failed.";
    throw new Error(getFirebaseAdminAuthErrorMessageIfAny() ?? "Authentication failed.");
  }

  return adminApp;
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export async function verifyIdToken(token: string) {
  const adminAuth = getAdminAuth();
  return adminAuth.verifyIdToken(token);
}

export { getFirebaseAdminAuthErrorMessageIfAny };
