import { NextRequest, NextResponse } from "next/server";
import {
  getFirebaseAdminAuthErrorMessageIfAny,
  verifyIdToken,
} from "@/lib/auth/firebase-admin";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const authConfigError = getFirebaseAdminAuthErrorMessageIfAny();
  if (authConfigError) {
    return NextResponse.json(
      { success: false, error: authConfigError },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { idToken, name, email, college } = body as {
      idToken?: string;
      name?: string;
      email?: string;
      college?: string;
    };
    const sanitizedCollege = college?.trim() || null;

    if (!idToken) {
      return NextResponse.json(
        { success: false, error: "ID token is required" },
        { status: 400 }
      );
    }

    // Verify Firebase token
    const decodedToken = await verifyIdToken(idToken);

    // Upsert user in database
    const user = await prisma.user.upsert({
      where: { firebaseUid: decodedToken.uid },
      update: {
        lastActiveAt: new Date(),
        name: name || decodedToken.name || "Student",
        email: email || decodedToken.email || "",
        college: sanitizedCollege ?? undefined,
      },
      create: {
        firebaseUid: decodedToken.uid,
        email: email || decodedToken.email || "",
        name: name || decodedToken.name || "Student",
        avatar: decodedToken.picture || null,
        college: sanitizedCollege,
      },
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 401 }
    );
  }
}

export async function GET(request: NextRequest) {
  const authConfigError = getFirebaseAdminAuthErrorMessageIfAny();
  if (authConfigError) {
    return NextResponse.json(
      { success: false, error: authConfigError },
      { status: 503 }
    );
  }

  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    const decodedToken = await verifyIdToken(token);

    const user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("Auth GET error:", error);
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
}
