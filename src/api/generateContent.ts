// src/api/generateContent.ts

export type TemplateType =
  | "lesson-plan"
  | "study-guide"
  | "quiz"
  | "learning-objectives"
  | "activity";

export type LearningStyle =
  | "visual"
  | "auditory"
  | "kinesthetic"
  | "reading-writing";

export interface GenerateContentPayload {
  templateType: TemplateType;
  gradeLevel: string;
  subject: string;
  duration: string;
  learningStyle: LearningStyle;
  topic?: string;
}

export interface GenerateContentResponse {
  content: string;
}

export async function generateContent(
  payload: GenerateContentPayload
): Promise<GenerateContentResponse> {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-content`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to generate content: ${errorText}`);
    }

    const data = await res.json();
    return data as GenerateContentResponse;
  } catch (err) {
    console.error("Error calling generateContent:", err);
    throw err;
  }
}
