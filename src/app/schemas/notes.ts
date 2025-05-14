import { z } from "zod";
import { ValidationRules } from "@/app/types";

/**
 * Schema for GET /notes query parameters
 */
export const GetNotesQuerySchema = z.object({
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type GetNotesQueryParams = z.infer<typeof GetNotesQuerySchema>;

/**
 * Schema for GET /notes/{noteId} path parameters
 */
export const GetNoteDetailsParamsSchema = z.object({
  noteId: z.string().uuid("Invalid note ID format. Must be a valid UUID."),
});

export type GetNoteDetailsParams = z.infer<typeof GetNoteDetailsParamsSchema>;

/**
 * Schema for POST /notes request body
 */
export const CreateNoteSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(
      ValidationRules.notes.title.maxLength,
      `Title cannot exceed ${ValidationRules.notes.title.maxLength} characters`
    ),
  content: z
    .string()
    .min(1, "Note content is required")
    .max(
      ValidationRules.notes.content.maxLength,
      `Note content cannot exceed ${ValidationRules.notes.content.maxLength} characters`
    ),
  source_text: z
    .string()
    .max(
      ValidationRules.notes.sourceText.maxLength,
      `Source text cannot exceed ${ValidationRules.notes.sourceText.maxLength} characters`
    )
    .optional()
    .nullable(),
  source: z.enum(["ai", "manual"]),
});

export type CreateNoteRequest = z.infer<typeof CreateNoteSchema>;

/**
 * Schema for PATCH /notes/{noteId} path parameters
 */
export const UpdateNoteParamsSchema = z.object({
  noteId: z.string().uuid("Invalid note ID format. Must be a valid UUID."),
});

/**
 * Schema for PATCH /notes/{noteId} request body
 */
export const UpdateNoteBodySchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(
      ValidationRules.notes.title.maxLength,
      `Title cannot exceed ${ValidationRules.notes.title.maxLength} characters`
    ),
  content: z
    .string()
    .min(1, "Note content is required")
    .max(
      ValidationRules.notes.content.maxLength,
      `Note content cannot exceed ${ValidationRules.notes.content.maxLength} characters`
    ),
});

export type UpdateNoteParams = z.infer<typeof UpdateNoteParamsSchema>;
export type UpdateNoteBody = z.infer<typeof UpdateNoteBodySchema>;

/**
 * Schema for DELETE /notes/{noteId} path parameters
 */
export const DeleteNoteParamsSchema = z.object({
  noteId: z.string().uuid("Invalid note ID format. Must be a valid UUID."),
});

export type DeleteNoteParams = z.infer<typeof DeleteNoteParamsSchema>;

/**
 * Schema for POST /ai/generate-note request body
 */
export const GenerateNoteSchema = z.object({
  source_text: z
    .string()
    .min(1, "Source text is required")
    .max(
      ValidationRules.notes.sourceText.maxLength,
      `Source text cannot exceed ${ValidationRules.notes.sourceText.maxLength} characters`
    ),
});

export type GenerateNoteRequest = z.infer<typeof GenerateNoteSchema>;
