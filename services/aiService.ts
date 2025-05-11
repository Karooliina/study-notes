import { ValidationRules, GenerateNoteResponseDto } from "@/app/types";

// Configuration for OpenRouter.ai
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "google/palm-2"; // Example model, choose appropriate one

/**
 * Generates note content using AI based on source text
 *
 * @param sourceText - The source text to summarize
 * @returns Promise with the generated content
 */
export async function generateNoteContent(
  sourceText: string
): Promise<GenerateNoteResponseDto> {
  // Check text length (additional safeguard)
  if (sourceText.length > ValidationRules.notes.sourceText.maxLength) {
    throw new Error("Source text exceeds maximum allowed length");
  }

  try {
    // Prepare request to OpenRouter.ai
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": `${process.env.NEXT_PUBLIC_SITE_URL}`, // Domain for billing
        "X-Title": "Study Notes App", // App name for OpenRouter panel
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
      // Timeout to prevent waiting too long
      signal: AbortSignal.timeout(30000), // 30 seconds timeout
    });

    if (!response.ok) {
      // Handle different error codes
      if (response.status === 429) {
        throw new Error("Rate limit exceeded by AI service");
      }
      throw new Error(`AI service error: ${response.statusText}`);
    }

    const data = await response.json();

    // Extract generated content
    const generatedContent = data.choices[0]?.message?.content;

    if (!generatedContent) {
      throw new Error("Failed to generate content");
    }

    // Return generated content
    return {
      content: generatedContent,
    };
  } catch (error: any) {
    // Handle timeout
    if (error.name === "AbortError") {
      throw new Error("AI generation timed out");
    }

    // Throw error further
    throw error;
  }
}
