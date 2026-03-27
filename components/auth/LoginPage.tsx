"use client";

import dynamic from "next/dynamic";
import BrandPanel from "./BrandPanel";

// AuthPanel uses Firebase client — must only run in the browser
const AuthPanel = dynamic(() => import("./AuthPanel"), { ssr: false });

/**
 * LoginPage — main split-screen layout.
 * Left: BrandPanel (gradient + patterns, hidden on mobile)
 * Right: AuthPanel (authentication form)
 */
export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — brand identity */}
      <BrandPanel />

      {/* Right — authentication (client-only, uses Firebase) */}
      <AuthPanel />
    </div>
  );
}
