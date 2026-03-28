import { NextRequest } from "next/server";
import { verifyIdToken } from "@/lib/auth/firebase-admin";
import { prisma } from "@/lib/db";

export async function getAuthenticatedUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { error: "Unauthorized", status: 401 as const };
  }

  const token = authHeader.slice(7);
  let decodedToken: { uid: string };
  try {
    decodedToken = await verifyIdToken(token);
  } catch {
    return { error: "Invalid token", status: 401 as const };
  }

  const user = await prisma.user.findUnique({
    where: { firebaseUid: decodedToken.uid },
    select: { id: true },
  });

  if (!user) {
    return { error: "User not found", status: 404 as const };
  }

  return { user };
}
