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
export async function syncUserWithBackend(
  idToken: string,
  name?: string | null,
  email?: string | null,
  college?: string | null
) {
  const res = await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken, name, email, college }),
  });
  if (!res.ok) {
    let message = "Failed to sync user with backend";
    try {
      const data = await res.json();
      if (data && typeof data === "object" && "error" in data && typeof data.error === "string") {
        message = data.error;
      }
    } catch {
      // ignore JSON parsing errors
    }
    throw new Error(message);
  }
  return res.json();
}
