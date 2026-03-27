/**
 * lib/auth.ts — Auth utility functions for Acadivon.
 *
 * Re-exports the Firebase client helpers and provides convenience
 * wrappers used across the application.
 */
export {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "@/lib/auth/firebase";

/** Send a Firebase ID token to the backend and return the server response. */
export async function syncUserWithBackend(idToken: string, name?: string | null, email?: string | null) {
  const res = await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken, name, email }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(data.error ?? "Failed to sync user with backend");
  }
  return res.json();
}
