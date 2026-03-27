import OpenAI from "openai";

let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

export interface PlannerInput {
  userId: string;
  timetable: Array<{
    subject: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }>;
  assignments: Array<{
    subject: string;
    title: string;
    dueDate: string;
    status: string;
  }>;
  insights: Array<{
    type: string;
    content: string;
  }>;
  goals?: string[];
}

export interface StudyPlanContent {
  weeklyPlan: Array<{
    day: string;
    sessions: Array<{
      time: string;
      subject: string;
      activity: string;
      duration: number;
    }>;
  }>;
  dailyGoals: string[];
  revisionCycles: Array<{
    subject: string;
    frequency: string;
    nextRevision: string;
  }>;
  tips: string[];
}

export async function generateStudyPlan(
  input: PlannerInput
): Promise<StudyPlanContent> {
  const context = JSON.stringify({
    timetable: input.timetable,
    assignments: input.assignments,
    insights: input.insights,
    goals: input.goals || [],
  });

  const completion = await getOpenAI().chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an AI study planner. Create a personalized weekly study plan based on the student's timetable, assignments, and performance insights.
Return a JSON object with: weeklyPlan (array of days with sessions), dailyGoals (string array), revisionCycles (subjects with frequencies), tips (string array).
Be practical and realistic with time allocations.`,
      },
      {
        role: "user",
        content: `Generate a study plan for this week based on:\n${context}`,
      },
    ],
    temperature: 0.4,
    response_format: { type: "json_object" },
  });

  try {
    const parsed = JSON.parse(
      completion.choices[0]?.message?.content ||
        '{"weeklyPlan":[],"dailyGoals":[],"revisionCycles":[],"tips":[]}'
    );
    return parsed;
  } catch {
    return { weeklyPlan: [], dailyGoals: [], revisionCycles: [], tips: [] };
  }
}
