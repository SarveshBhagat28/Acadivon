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

export interface TutorMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface TutorRequest {
  messages: TutorMessage[];
  subject?: string;
  level?: "beginner" | "advanced";
  userId: string;
}

export interface TutorResponse {
  message: string;
  tokensUsed: number;
}

const SYSTEM_PROMPT = `You are Acadivon AI Tutor, an intelligent educational assistant for students.
Your role is to:
- Explain concepts clearly and adaptively based on the student's level
- Help with academic subjects including math, science, coding, and humanities
- Generate examples and practice problems
- Break down complex topics into digestible parts
- Be encouraging and supportive

Guidelines:
- Beginner mode: Use simple language, analogies, and step-by-step explanations
- Advanced mode: Use technical terminology, deeper dives, and academic references
- Always verify understanding by asking follow-up questions
- For code: provide well-commented examples`;

export async function tutorChat(
  request: TutorRequest
): Promise<TutorResponse> {
  const systemMessage =
    request.level === "advanced"
      ? `${SYSTEM_PROMPT}\n\nMode: Advanced - Provide in-depth, technical explanations.${request.subject ? `\nSubject focus: ${request.subject}` : ""}`
      : `${SYSTEM_PROMPT}\n\nMode: Beginner - Keep explanations simple and clear.${request.subject ? `\nSubject focus: ${request.subject}` : ""}`;

  const completion = await getOpenAI().chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o",
    messages: [
      { role: "system", content: systemMessage },
      ...request.messages,
    ],
    temperature: 0.7,
    max_tokens: 1500,
  });

  const message = completion.choices[0]?.message?.content || "";
  const tokensUsed = completion.usage?.total_tokens || 0;

  return { message, tokensUsed };
}
