import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { ScannedTimetableData } from "@/components/attendance/types";

let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

const SCAN_PROMPT = `You are an academic timetable parser. Analyze this image of a timetable or attendance sheet.
Extract all class schedule entries and return them as a JSON object with the following structure:

{
  "classes": [
    {
      "subject": "Subject Name",
      "room": "Room/Lab identifier (optional, null if not visible)",
      "dayOfWeek": <integer 0-5 where 0=Monday, 1=Tuesday, 2=Wednesday, 3=Thursday, 4=Friday, 5=Saturday>,
      "startTime": "<hour>:00 in 24-hour format (e.g. '8:00', '14:00')",
      "status": <"PRESENT" | "ABSENT" | "LATE" | "CANCELLED" | null>
    }
  ],
  "batch": "Batch name if visible in the image, otherwise null"
}

Rules:
- Only include time slots where a class is actually scheduled.
- If attendance status is marked in the image (P/A/L/C or Present/Absent/Late/Cancelled), extract it.
- If no status is visible, use null.
- Return only valid JSON, no additional text or markdown.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, mimeType, batch } = body as {
      image?: string;
      mimeType?: string;
      batch?: string;
    };

    if (!image) {
      return NextResponse.json(
        { success: false, error: "No image provided" },
        { status: 400 }
      );
    }

    const validMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const resolvedMimeType =
      mimeType && validMimeTypes.includes(mimeType)
        ? (mimeType as "image/jpeg" | "image/png" | "image/webp" | "image/gif")
        : "image/jpeg";

    const openai = getOpenAI();

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${resolvedMimeType};base64,${image}`,
                detail: "high",
              },
            },
            {
              type: "text",
              text: SCAN_PROMPT,
            },
          ],
        },
      ],
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { success: false, error: "No response from AI" },
        { status: 500 }
      );
    }

    let parsed: ScannedTimetableData;
    try {
      parsed = JSON.parse(content) as ScannedTimetableData;
    } catch {
      return NextResponse.json(
        { success: false, error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    // Merge batch from request if not found in image
    if (!parsed.batch && batch) {
      parsed.batch = batch;
    }

    // Validate and clamp values
    parsed.classes = (parsed.classes ?? [])
      .filter(
        (c) =>
          typeof c.subject === "string" &&
          c.subject.length > 0 &&
          typeof c.dayOfWeek === "number" &&
          c.dayOfWeek >= 0 &&
          c.dayOfWeek <= 5
      )
      .map((c) => ({
        ...c,
        status:
          c.status === "PRESENT" ||
          c.status === "ABSENT" ||
          c.status === "LATE" ||
          c.status === "CANCELLED"
            ? c.status
            : null,
      }));

    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error("Attendance scan error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to scan image" },
      { status: 500 }
    );
  }
}
