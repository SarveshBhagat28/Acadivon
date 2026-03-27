"use client";

import { useState } from "react";
import GoogleButton from "./GoogleButton";
import AppleButton from "./AppleButton";
import EmailForm from "./EmailForm";
import AuthError from "./Error";

export default function AuthPanel() {
  const [globalError, setGlobalError] = useState("");
  const [oauthLoading, setOauthLoading] = useState(false);

  function handleOAuthError(msg: string) {
    if (msg) setGlobalError(msg);
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-6 py-12 lg:px-12">
      <div className="w-full max-w-sm space-y-8">
        {/* Header */}
        <header className="space-y-1.5 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back</h2>
          <p className="text-sm text-gray-500">Sign in to continue your journey</p>
        </header>

        {/* Global OAuth error */}
        {globalError && (
          <AuthError message={globalError} onDismiss={() => setGlobalError("")} />
        )}

        {/* OAuth buttons */}
        <div className="space-y-3" aria-label="Social sign-in options">
          <GoogleButton onError={handleOAuthError} disabled={oauthLoading} />
          <AppleButton onError={handleOAuthError} disabled={oauthLoading} />
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
          disabled={oauthLoading}
          onLoadingChange={setOauthLoading}
        />
      </div>
    </div>
  );
}
