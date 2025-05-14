import { Database } from "../../db/database.types";

// Type alias for better readability
type NoteRow = Database["public"]["Tables"]["notes"]["Row"];
type NoteInsert = Database["public"]["Tables"]["notes"]["Insert"];
type NoteUpdate = Database["public"]["Tables"]["notes"]["Update"];
export type SourceType = Database["public"]["Enums"]["source_type"];

/**
 * Simplified note representation for listing
 * Based on notes table, excluding source_text and user_id
 */
export interface NoteListItemDto {
  id: string;
  title: string;
  content: string;
  source: SourceType;
  created_at: string;
  updated_at: string;
}

/**
 * Response DTO for listing notes
 */
export interface ListNotesResponseDto {
  data: NoteListItemDto[];
}

/**
 * Full note representation
 * Based on notes table, excluding user_id which is handled by auth
 */
export type NoteDto = Omit<NoteRow, "user_id">;

/**
 * Command model for creating a new note
 * Based on notes insert type, excluding system-managed fields
 */
export type CreateNoteDto = Pick<
  NoteInsert,
  "title" | "content" | "source" | "source_text"
>;

/**
 * Command model for updating an existing note
 * Only allows updating title and content
 */
export type UpdateNoteDto = Pick<NoteUpdate, "title" | "content">;

/**
 * Request DTO for AI note generation
 * Based on the source_text field from notes table
 */
export interface GenerateNoteRequestDto {
  source_text: string;
}

/**
 * Response DTO for AI note generation
 * Based on the content field from notes table
 */
export interface GenerateNoteResponseDto {
  content: string;
}

/**
 * Validation constraints based on API plan
 */
export const ValidationRules = {
  notes: {
    title: {
      required: true,
      maxLength: 50,
    },
    content: {
      required: true,
      maxLength: 1000,
    },
    sourceText: {
      maxLength: 25000, // ~5,000 words
    },
  },
};
