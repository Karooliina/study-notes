"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  listUserNotes,
  getNoteDetails,
  createNote,
  updateNote,
  deleteNote,
} from "@/services/notesService";
import { generateNoteContent } from "@/services/aiService";
import {
  GetNotesQuerySchema,
  GetNotesQueryParams,
  GetNoteDetailsParamsSchema,
  CreateNoteSchema,
  CreateNoteRequest,
  UpdateNoteParamsSchema,
  UpdateNoteBodySchema,
  UpdateNoteBody,
  DeleteNoteParamsSchema,
  DeleteNoteParams,
  GenerateNoteSchema,
  GenerateNoteRequest,
} from "@/app/schemas/notes";
import { ListNotesResponseDto } from "./types";
import { z } from "zod";

export const checkAuth = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  return { user };
};

export const signUpAction = async (formData: FormData) => {
  const userName = formData.get("userName")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required"
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        user_name: userName,
      },
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/dashboard",
      "Thanks for signing up! Now you can start creating your notes."
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/dashboard");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
};

/**
 * Server action to retrieve a user's notes
 *
 * @param queryParams - Optional query parameters (order)
 * @returns Response with notes data or error information
 */
export async function getNotesAction(
  queryParams?: Partial<GetNotesQueryParams>
) {
  try {
    // Validate query parameters
    const validatedParams = GetNotesQuerySchema.parse(queryParams || {});

    // Get user session
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return {
        error: "Unauthorized",
        status: 401,
      };
    }

    // Fetch user's notes
    const notes = await listUserNotes(session.user.id, validatedParams.order);

    return {
      data: notes,
      status: 200,
    };
  } catch (error) {
    console.error("Error in getNotesAction:", error);

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

/**
 * Server action to retrieve details of a specific note
 *
 * @param noteId - ID of the note to retrieve
 * @returns Response with note data or error information
 */
export async function getNoteDetailsAction(noteId: string) {
  try {
    // Validate noteId parameter
    const validatedParams = GetNoteDetailsParamsSchema.parse({ noteId });

    // Get user session
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return {
        error: "Unauthorized",
        status: 401,
      };
    }

    // Fetch note details
    try {
      const note = await getNoteDetails(
        session.user.id,
        validatedParams.noteId
      );

      if (!note) {
        return {
          error: "Note not found",
          status: 404,
        };
      }

      return {
        data: note,
        status: 200,
      };
    } catch (err) {
      // Handle authorization error
      if (err instanceof Error && err.message.includes("Forbidden")) {
        return {
          error: "You don't have permission to access this note",
          status: 403,
        };
      }
      throw err; // Pass other errors to the main catch block
    }
  } catch (error) {
    console.error("Error in getNoteDetailsAction:", error);

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

/**
 * Server action to create a new note
 *
 * @param formData - Data for the new note
 * @returns Response with created note data or error information
 */
export async function createNoteAction(formData: CreateNoteRequest) {
  try {
    // Validate input data
    const validatedData = CreateNoteSchema.parse(formData);

    // Get user session
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return {
        error: "Unauthorized",
        status: 401,
      };
    }

    // Create the note
    const newNote = await createNote(session.user.id, validatedData);

    return {
      data: newNote,
      status: 201,
    };
  } catch (error) {
    console.error("Error in createNoteAction:", error);

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

/**
 * Server action to update an existing note
 *
 * @param noteId - ID of the note to update
 * @param formData - Updated note data
 * @returns Response with updated note data or error information
 */
export async function updateNoteAction(
  noteId: string,
  formData: UpdateNoteBody
) {
  try {
    // Validate noteId parameter and input data
    const validatedParams = UpdateNoteParamsSchema.parse({ noteId });
    const validatedData = UpdateNoteBodySchema.parse(formData);

    // Get user session
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return {
        error: "Unauthorized",
        status: 401,
      };
    }

    // Update the note
    try {
      const updatedNote = await updateNote(
        session.user.id,
        validatedParams.noteId,
        validatedData
      );

      if (!updatedNote) {
        return {
          error: "Note not found",
          status: 404,
        };
      }

      return {
        data: updatedNote,
        status: 200,
      };
    } catch (err) {
      // Handle authorization error
      if (err instanceof Error && err.message.includes("Forbidden")) {
        return {
          error: "You don't have permission to update this note",
          status: 403,
        };
      }
      throw err; // Pass other errors to the main catch block
    }
  } catch (error) {
    console.error("Error in updateNoteAction:", error);

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

/**
 * Server action to delete a note
 *
 * @param noteId - ID of the note to delete
 * @returns Response with status information
 */
export async function deleteNoteAction(noteId: string) {
  try {
    // Validate noteId parameter
    const validatedParams = DeleteNoteParamsSchema.parse({ noteId });

    // Get user session
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return {
        error: "Unauthorized",
        status: 401,
      };
    }

    // Delete the note
    try {
      const isDeleted = await deleteNote(
        session.user.id,
        validatedParams.noteId
      );

      if (!isDeleted) {
        return {
          error: "Note not found",
          status: 404,
        };
      }

      return {
        status: 204,
      };
    } catch (err) {
      // Handle authorization error
      if (err instanceof Error && err.message.includes("Forbidden")) {
        return {
          error: "You don't have permission to delete this note",
          status: 403,
        };
      }
      throw err; // Pass other errors to the main catch block
    }
  } catch (error) {
    console.error("Error in deleteNoteAction:", error);

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
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
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
