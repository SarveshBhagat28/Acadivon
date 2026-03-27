import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/auth/firebase-admin";
import { prisma } from "@/lib/db";
import { tutorChat, type TutorMessage } from "@/lib/ai/tutor";

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const {
      messages,
      subject,
      level,
    }: {
      messages: TutorMessage[];
      subject?: string;
      level?: "beginner" | "advanced";
    } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: "Messages are required" },
        { status: 400 }
      );
    }

    const response = await tutorChat({
      messages,
      subject,
      level: level || "beginner",
      userId: user.id,
    });

    // Store interaction
    const lastUserMessage = messages.filter((m) => m.role === "user").pop();
    if (lastUserMessage) {
      await prisma.aIInteraction.create({
        data: {
          userId: user.id,
          type: "TUTOR",
          prompt: lastUserMessage.content,
          response: response.message,
          subject: subject || null,
          tokens: response.tokensUsed,
        },
      });

      // Award XP for using tutor
      await prisma.user.update({
        where: { id: user.id },
        data: { xp: { increment: 5 } },
      });
    }

    return NextResponse.json({
      success: true,
      data: { message: response.message, tokensUsed: response.tokensUsed },
    });
  } catch (error) {
    console.error("Tutor API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
