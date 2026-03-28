"use client";

import dynamic from "next/dynamic";

// AuthPanel uses Firebase client — must only run in the browser
const AuthPanel = dynamic(() => import("./AuthPanel"), { ssr: false });

/**
 * LoginPage — full-screen authentication layout.
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen w-full">
      {/* Authentication (client-only, uses Firebase) */}
      <AuthPanel />
    </div>
  );
}
