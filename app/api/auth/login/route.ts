import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/auth/firebase-admin";
import { prisma } from "@/lib/db";

/**
 * POST /api/auth/login
 * Called after client-side Firebase email/password sign-in.
 * Verifies the Firebase ID token and upserts the user record.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken, email } = body as { idToken?: string; email?: string };

    if (!idToken) {
      return NextResponse.json(
        { success: false, error: "ID token is required" },
        { status: 400 }
      );
    }

    const decodedToken = await verifyIdToken(idToken);

    const user = await prisma.user.upsert({
      where: { firebaseUid: decodedToken.uid },
      update: { lastActiveAt: new Date() },
      create: {
        firebaseUid: decodedToken.uid,
        email: email ?? decodedToken.email ?? "",
        name: decodedToken.name ?? "Student",
        avatar: decodedToken.picture ?? null,
      },
    });

    return NextResponse.json({ success: true, data: { id: user.id } });
  } catch (error) {
    console.error("Email login error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 401 }
    );
  }
}
