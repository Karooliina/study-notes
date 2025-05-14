import { ValidationRules, GenerateNoteResponseDto } from "@/app/types";

const OPENROUTER_API_URL = process.env.OPENROUTER_API_URL ?? "";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? "";
const MODEL = process.env.AI_MODEL ?? "";

/**
 * Generates note content using AI based on source text
 *
 * @param sourceText - The source text to summarize
 * @returns Promise with the generated content
 */
export async function generateNoteContent(
  sourceText: string
): Promise<GenerateNoteResponseDto> {
  if (sourceText.length > ValidationRules.notes.sourceText.maxLength) {
    throw new Error("Source text exceeds maximum allowed length");
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that summarizes educational materials. Create a concise and clear summary of the provided text. Focus on the most important concepts and information. The summary should be shorter than the original text but preserve all key information.",
          },
          {
            role: "user",
            content: `Summarize the following educational material:\n\n${sourceText}`,
          },
        ],
        max_tokens: 500, // Limit the length of generated text
      }),
      signal: AbortSignal.timeout(30000), // 30 seconds timeout
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Rate limit exceeded by AI service");
      }
      throw new Error(`AI service error: ${response.statusText}`);
    }

    const data = await response.json();

    const generatedContent = data.choices[0]?.message?.content;

    if (!generatedContent) {
      throw new Error("Failed to generate content");
    }

    return {
      content: generatedContent,
    };
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("AI generation timed out");
    }
    throw error;
  }
}
