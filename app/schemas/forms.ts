import { z } from "zod";
import { ValidationRules } from "@/app/types";

const titleSchema = z
  .string()
  .min(1, "Title is required")
  .max(
    ValidationRules.notes.title.maxLength,
    `Title cannot exceed ${ValidationRules.notes.title.maxLength} characters`
  );

const contentSchema = z
  .string()
  .min(1, "Content is required")
  .max(
    ValidationRules.notes.content.maxLength,
    `Content cannot exceed ${ValidationRules.notes.content.maxLength} characters`
  );

export const manualNoteSchema = z.object({
  title: titleSchema,
  content: contentSchema,
});

export const aiNoteSchema = z.object({
  title: titleSchema,
  sourceText: z
    .string()
    .min(1, "Source text is required")
    .max(
      ValidationRules.notes.sourceText.maxLength,
      `Source text cannot exceed ${ValidationRules.notes.sourceText.maxLength} characters`
    ),
  generatedContent: contentSchema.optional(),
});

export type ManualNoteFormValues = z.infer<typeof manualNoteSchema>;
export type AiNoteFormValues = z.infer<typeof aiNoteSchema>;
