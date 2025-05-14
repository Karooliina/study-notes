"use server";

import { GenerateNoteRequest } from "../schemas/notes";

import { createClient } from "@/utils/supabase/server";
import { GenerateNoteSchema } from "../schemas/notes";
import { generateNoteContent } from "@/services/aiService";
import { z } from "zod";

/**
 * Server action to generate note content using AI
 *
 * @param formData - Data containing source text to summarize
 * @returns Response with generated content or error information
 */
export async function generateNoteAction(formData: GenerateNoteRequest) {
  try {
    // Validate input data
    const validatedData = GenerateNoteSchema.parse(formData);

    // Get user session
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        error: "Unauthorized",
        status: 401,
      };
    }

    // Call AI service
    try {
      const generatedNote = await generateNoteContent(
        validatedData.source_text
      );

      return {
        data: generatedNote,
        status: 200,
      };
    } catch (err) {
      if (err instanceof Error) {
        // Handle specific errors
        if (err.message.includes("Rate limit exceeded")) {
          return {
            error: "Rate limit exceeded. Please try again later.",
            status: 429,
          };
        } else if (err.message.includes("timed out")) {
          return {
            error:
              "AI generation took too long to complete. Please try with a shorter text.",
            status: 504,
          };
        }
      }
      throw err; // Pass other errors to the main catch block
    }
  } catch (error) {
    console.error("Error in generateNoteAction:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return {
        error: error.errors,
        status: 400,
      };
    }

    // Handle other errors
    return {
      error: "Internal Server Error",
      status: 500,
    };
  }
}
