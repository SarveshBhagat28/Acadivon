"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, signInWithPopup, syncUserWithBackend } from "@/lib/auth";
import { getFirebaseConfigErrorMessage } from "@/lib/auth/firebase";
import { OAuthProvider } from "firebase/auth";
import Loading from "./Loading";

interface AppleButtonProps {
  onError: (msg: string) => void;
  disabled?: boolean;
}

export default function AppleButton({ onError, disabled }: AppleButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleAppleSignIn() {
    try {
      setLoading(true);
      onError("");
      if (!auth) {
        onError(
          getFirebaseConfigErrorMessage() ??
            "Firebase authentication isn't configured. Update your environment variables and redeploy."
        );
        return;
      }
      const appleProvider = new OAuthProvider("apple.com");
      appleProvider.addScope("email");
      appleProvider.addScope("name");

      const result = await signInWithPopup(auth, appleProvider);
      const idToken = await result.user.getIdToken();

      await syncUserWithBackend(
        idToken,
        result.user.displayName,
        result.user.email
      );

      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      if (error.code === "auth/popup-closed-by-user") {
        onError("");
        return;
      }
      onError(error.message ?? "Apple sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleAppleSignIn}
      disabled={disabled || loading}
      aria-label="Sign in with Apple"
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-black px-4 py-3 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-gray-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? (
        <Loading message="Connecting to Apple…" />
      ) : (
        <>
          {/* Apple logo */}
          <svg aria-hidden="true" className="h-5 w-5 fill-white" viewBox="0 0 814 1000">
            <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 405.5 1 293.9 1 188.3C1 84.4 62.3 25.5 122.2 25.5c58.8 0 99.2 35.5 155.4 35.5 54.4 0 102.4-37.5 167.6-37.5 58.8 0 135.4 28.2 182.7 104.4zM552.5 68.4c28.3-36.4 48.5-88.2 48.5-139.9 0-7.1-.6-14.3-1.9-20.1-46.9 1.9-103.5 31.3-137.4 73.7-27 31.6-51.7 83.2-51.7 135.6 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 42.2 0 95.1-28.2 126.9-68.7z" />
          </svg>
          <span>Continue with Apple</span>
        </>
      )}
    </button>
  );
}
