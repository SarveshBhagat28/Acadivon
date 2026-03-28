"use client";

import { useState } from "react";
import GoogleButton from "./GoogleButton";
import AppleButton from "./AppleButton";
import EmailForm from "./EmailForm";
import AuthError from "./Error";
import { Logo } from "@/components/Logo";
import { brandConfig } from "@/lib/branding";
import {
  getFirebaseAuthErrorMessageIfAny,
} from "@/lib/auth/firebase";

export default function AuthPanel() {
  const [globalError, setGlobalError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const configError = getFirebaseAuthErrorMessageIfAny();
  const shouldDisableAuth = authLoading;

  function handleOAuthError(msg: string) {
    if (msg) setGlobalError(msg);
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-6 py-12 lg:px-12">
      <div className="w-full max-w-sm space-y-8">
        {/* Header */}
        <header className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <Logo size="xl" priority />
            <span className="text-3xl font-bold text-[#1e3a5f]">
              {brandConfig.name}
            </span>
          </div>
          <div className="space-y-1.5">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back</h2>
            <p className="text-sm text-gray-500">Sign in to continue your journey</p>
          </div>
        </header>

        {configError && <AuthError message={configError} />}

        {/* Global OAuth error */}
        {globalError && (
          <AuthError message={globalError} onDismiss={() => setGlobalError("")} />
        )}

        {/* OAuth buttons */}
        <div className="space-y-3" aria-label="Social sign-in options">
          <GoogleButton onError={handleOAuthError} disabled={shouldDisableAuth} />
          <AppleButton onError={handleOAuthError} disabled={shouldDisableAuth} />
        </div>

        {/* Divider */}
        <div className="relative" role="separator" aria-label="or">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-gray-400 tracking-widest">or</span>
          </div>
        </div>

        {/* Email / password form */}
        <EmailForm
          disabled={shouldDisableAuth}
          onLoadingChange={setAuthLoading}
        />
      </div>
    </div>
  );
}
