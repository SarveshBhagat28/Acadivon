import { NextResponse } from "next/server";
import { getFirebaseAdminAuthErrorMessageIfAny } from "@/lib/auth/firebase-admin";

export function getFirebaseAdminConfigErrorResponse() {
  const authConfigError = getFirebaseAdminAuthErrorMessageIfAny();
  if (!authConfigError) return null;
  return NextResponse.json(
    { success: false, error: authConfigError },
    { status: 503 }
  );
}
