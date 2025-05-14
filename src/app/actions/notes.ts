"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import {
  listUserNotes,
  getNoteDetails,
  createNote,
  updateNote,
  deleteNote,
} from "@/services/notesService";
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
} from "@/app/schemas/notes";

/**
 * Server action to retrieve a user's notes
 */
export async function getNotesAction(
  queryParams?: Partial<GetNotesQueryParams>
) {
  try {
    const validatedParams = GetNotesQuerySchema.parse(queryParams || {});
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Unauthorized", status: 401 };
    }

    const notes = await listUserNotes(user.id, validatedParams.order);
    return { data: notes, status: 200 };
  } catch (error) {
    console.error("Error in getNotesAction:", error);

    if (error instanceof z.ZodError) {
      return { error: error.errors, status: 400 };
    }

    return { error: "Internal Server Error", status: 500 };
  }
}

/**
 * Server action to retrieve details of a specific note
 */
export async function getNoteDetailsAction(noteId: string) {
  try {
    const validatedParams = GetNoteDetailsParamsSchema.parse({ noteId });
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Unauthorized", status: 401 };
    }

    try {
      const note = await getNoteDetails(user.id, validatedParams.noteId);

      if (!note) {
        return { error: "Note not found", status: 404 };
      }

      return { data: note, status: 200 };
    } catch (err) {
      if (err instanceof Error && err.message.includes("Forbidden")) {
        return {
          error: "You don't have permission to access this note",
          status: 403,
        };
      }
      throw err;
    }
  } catch (error) {
    console.error("Error in getNoteDetailsAction:", error);

    if (error instanceof z.ZodError) {
      return { error: error.errors, status: 400 };
    }

    return { error: "Internal Server Error", status: 500 };
  }
}

/**
 * Server action to create a new note
 */
export async function createNoteAction(formData: CreateNoteRequest) {
  try {
    const validatedData = CreateNoteSchema.parse(formData);
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Unauthorized", status: 401 };
    }

    const newNote = await createNote(user.id, validatedData);
    return { data: newNote, status: 201 };
  } catch (error) {
    console.error("Error in createNoteAction:", error);

    if (error instanceof z.ZodError) {
      return { error: error.errors, status: 400 };
    }

    return { error: "Internal Server Error", status: 500 };
  }
}

/**
 * Server action to update an existing note
 */
export async function updateNoteAction(
  noteId: string,
  formData: UpdateNoteBody
) {
  try {
    const validatedParams = UpdateNoteParamsSchema.parse({ noteId });
    const validatedData = UpdateNoteBodySchema.parse(formData);
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Unauthorized", status: 401 };
    }

    try {
      const updatedNote = await updateNote(
        user.id,
        validatedParams.noteId,
        validatedData
      );

      if (!updatedNote) {
        return { error: "Note not found", status: 404 };
      }

      return { data: updatedNote, status: 200 };
    } catch (err) {
      if (err instanceof Error && err.message.includes("Forbidden")) {
        return {
          error: "You don't have permission to update this note",
          status: 403,
        };
      }
      throw err;
    }
  } catch (error) {
    console.error("Error in updateNoteAction:", error);

    if (error instanceof z.ZodError) {
      return { error: error.errors, status: 400 };
    }

    return { error: "Internal Server Error", status: 500 };
  }
}

/**
 * Server action to delete a note
 */
export async function deleteNoteAction(noteId: string) {
  try {
    const validatedParams = DeleteNoteParamsSchema.parse({ noteId });
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Unauthorized", status: 401 };
    }

    try {
      const isDeleted = await deleteNote(user.id, validatedParams.noteId);

      if (!isDeleted) {
        return { error: "Note not found", status: 404 };
      }

      return { status: 204 };
    } catch (err) {
      if (err instanceof Error && err.message.includes("Forbidden")) {
        return {
          error: "You don't have permission to delete this note",
          status: 403,
        };
      }
      throw err;
    }
  } catch (error) {
    console.error("Error in deleteNoteAction:", error);

    if (error instanceof z.ZodError) {
      return { error: error.errors, status: 400 };
    }

    return { error: "Internal Server Error", status: 500 };
  }
}
