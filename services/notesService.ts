import { createClient } from "@/utils/supabase/server";
import {
  NoteListItemDto,
  ListNotesResponseDto,
  NoteDto,
  CreateNoteDto,
  UpdateNoteDto,
} from "@/app/types";

/**
 * Retrieves a list of notes for the specified user
 *
 * @param userId - The ID of the user whose notes to retrieve
 * @param order - Sort order by creation date ('asc' or 'desc')
 * @returns Promise with the list of notes
 */
export async function listUserNotes(
  userId: string,
  order: "asc" | "desc" = "desc"
): Promise<ListNotesResponseDto> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notes")
    .select(
      `
      id, 
      title, 
      content, 
      source, 
      created_at, 
      updated_at
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: order === "asc" });

  if (error) {
    console.error("Error fetching notes:", error);
    throw new Error("Failed to retrieve notes");
  }

  return {
    data: data as NoteListItemDto[],
  };
}

/**
 * Retrieves details of a specific note by ID
 *
 * @param userId - The ID of the user requesting the note
 * @param noteId - The ID of the note to retrieve
 * @returns Promise with the note details or null if not found
 */
export async function getNoteDetails(
  userId: string,
  noteId: string
): Promise<NoteDto | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notes")
    .select(
      `
      id, 
      title, 
      content, 
      source_text, 
      source, 
      created_at, 
      updated_at,
      user_id
    `
    )
    .eq("id", noteId)
    .single();

  if (error) {
    // Check if error is due to note not found
    if (error.code === "PGRST116") {
      return null; // Note not found
    }
    console.error("Error fetching note details:", error);
    throw new Error("Failed to retrieve note details");
  }

  // Check if note belongs to the current user
  if (data.user_id !== userId) {
    throw new Error("Forbidden: Note does not belong to the current user");
  }

  // Remove user_id field before returning data
  const { user_id, ...noteData } = data;

  return noteData as NoteDto;
}

/**
 * Creates a new note for the specified user
 *
 * @param userId - The ID of the user creating the note
 * @param noteData - Data for the new note
 * @returns Promise with the created note
 */
export async function createNote(
  userId: string,
  noteData: CreateNoteDto
): Promise<NoteDto> {
  const supabase = await createClient();

  // Prepare data for database insertion
  const newNote = {
    ...noteData,
    user_id: userId,
    // created_at and updated_at will be added automatically by the database
  };

  const { data, error } = await supabase
    .from("notes")
    .insert(newNote)
    .select(
      `
      id, 
      title, 
      content, 
      source_text, 
      source, 
      created_at, 
      updated_at,
      user_id
    `
    )
    .single();

  if (error) {
    console.error("Error creating note:", error);
    throw new Error("Failed to create note");
  }

  // Remove user_id field before returning data
  const { user_id, ...noteDto } = data;

  return noteDto as NoteDto;
}

/**
 * Updates an existing note
 *
 * @param userId - The ID of the user requesting the update
 * @param noteId - The ID of the note to update
 * @param updateData - Data to update in the note
 * @returns Promise with the updated note or null if not found
 */
export async function updateNote(
  userId: string,
  noteId: string,
  updateData: UpdateNoteDto
): Promise<NoteDto | null> {
  const supabase = await createClient();

  // First check if note exists and belongs to the user
  const { data: existingNote, error: findError } = await supabase
    .from("notes")
    .select("id, user_id")
    .eq("id", noteId)
    .single();

  if (findError) {
    // Check if error is due to note not found
    if (findError.code === "PGRST116") {
      return null; // Note not found
    }
    console.error("Error finding note:", findError);
    throw new Error("Failed to find note");
  }

  // Check if note belongs to the current user
  if (existingNote.user_id !== userId) {
    throw new Error("Forbidden: Note does not belong to the current user");
  }

  // Update the note
  const { data, error } = await supabase
    .from("notes")
    .update({
      ...updateData,
      updated_at: new Date().toISOString(), // Explicitly update timestamp
    })
    .eq("id", noteId)
    .select(
      `
      id, 
      title, 
      content, 
      source_text, 
      source, 
      created_at, 
      updated_at,
      user_id
    `
    )
    .single();

  if (error) {
    console.error("Error updating note:", error);
    throw new Error("Failed to update note");
  }

  // Remove user_id field before returning data
  const { user_id, ...noteData } = data;

  return noteData as NoteDto;
}

/**
 * Deletes a note by ID
 *
 * @param userId - The ID of the user requesting deletion
 * @param noteId - The ID of the note to delete
 * @returns Promise with boolean indicating success
 */
export async function deleteNote(
  userId: string,
  noteId: string
): Promise<boolean> {
  const supabase = await createClient();

  // First check if note exists and belongs to the user
  const { data: existingNote, error: findError } = await supabase
    .from("notes")
    .select("id, user_id")
    .eq("id", noteId)
    .single();

  if (findError) {
    // Check if error is due to note not found
    if (findError.code === "PGRST116") {
      return false; // Note not found
    }
    console.error("Error finding note:", findError);
    throw new Error("Failed to find note");
  }

  // Check if note belongs to the current user
  if (existingNote.user_id !== userId) {
    throw new Error("Forbidden: Note does not belong to the current user");
  }

  // Delete the note
  const { error } = await supabase.from("notes").delete().eq("id", noteId);

  if (error) {
    console.error("Error deleting note:", error);
    throw new Error("Failed to delete note");
  }

  return true; // Successfully deleted the note
}
