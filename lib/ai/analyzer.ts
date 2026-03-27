import OpenAI from "openai";
import { prisma } from "@/lib/db";

let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

export interface AnalyzerInsight {
  type: "ATTENDANCE" | "PERFORMANCE" | "HABIT" | "RECOMMENDATION";
  title: string;
  content: string;
  severity: "INFO" | "WARNING" | "CRITICAL" | "SUCCESS";
}

export async function analyzeStudentPerformance(
  userId: string
): Promise<AnalyzerInsight[]> {
  const [attendances, assignments, studySessions, aiInteractions] =
    await Promise.all([
      prisma.attendance.findMany({
        where: { userId },
        include: { subject: true },
        orderBy: { date: "desc" },
        take: 30,
      }),
      prisma.assignment.findMany({
        where: { userId },
        include: { subject: true },
        orderBy: { dueDate: "desc" },
        take: 20,
      }),
      prisma.studySession.findMany({
        where: { userId },
        orderBy: { startTime: "desc" },
        take: 30,
      }),
      prisma.aIInteraction.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

  const dataContext = JSON.stringify({
    attendance: attendances.map((a) => ({
      subject: a.subject.name,
      status: a.status,
      date: a.date,
    })),
    assignments: assignments.map((a) => ({
      subject: a.subject.name,
      status: a.status,
      dueDate: a.dueDate,
    })),
    studySessions: studySessions.map((s) => ({
      duration: s.duration,
      type: s.type,
      date: s.startTime,
    })),
    aiInteractions: aiInteractions.map((i) => ({
      type: i.type,
      subject: i.subject,
    })),
  });

  const completion = await getOpenAI().chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an AI academic analyzer. Analyze student data and return structured insights as JSON array.
Each insight must have: type (ATTENDANCE|PERFORMANCE|HABIT|RECOMMENDATION), title (short), content (detailed), severity (INFO|WARNING|CRITICAL|SUCCESS).
Return only valid JSON array.`,
      },
      {
        role: "user",
        content: `Analyze this student data and provide 3-5 actionable insights:\n${dataContext}`,
      },
    ],
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  try {
    const parsed = JSON.parse(
      completion.choices[0]?.message?.content || '{"insights":[]}'
    );
    return parsed.insights || [];
  } catch {
    return [];
  }
}
