import { ValidationRules } from "@/app/types";
import { CreateNoteFormState, NoteMode } from "../types";

export function validateForm(state: CreateNoteFormState) {
  const errors: Partial<CreateNoteFormState> = {
    titleError: null,
    sourceTextError: null,
    contentError: null,
  };

  // Title validation
  if (!state.title.trim()) {
    errors.titleError = "Title is required";
  } else if (state.title.length > ValidationRules.notes.title.maxLength) {
    errors.titleError = `Title cannot exceed ${ValidationRules.notes.title.maxLength} characters`;
  }

  // Content validation based on mode
  if (state.mode === "AI") {
    // Source text validation for AI mode
    if (!state.sourceText.trim() && !state.generatedContent) {
      errors.sourceTextError = "Source text is required";
    } else if (
      state.sourceText.length > ValidationRules.notes.sourceText.maxLength
    ) {
      errors.sourceTextError = `Source text cannot exceed ${ValidationRules.notes.sourceText.maxLength} characters`;
    }

    // Generated content validation
    if (state.generatedContent) {
      if (
        state.generatedContent.length > ValidationRules.notes.content.maxLength
      ) {
        errors.contentError = `Note content cannot exceed ${ValidationRules.notes.content.maxLength} characters`;
      }
    }
  } else {
    // Manual content validation
    if (!state.manualContent.trim()) {
      errors.contentError = "Note content is required";
    } else if (
      state.manualContent.length > ValidationRules.notes.content.maxLength
    ) {
      errors.contentError = `Note content cannot exceed ${ValidationRules.notes.content.maxLength} characters`;
    }
  }

  const hasErrors = Object.values(errors).some((error) => error !== null);
  return { errors, isValid: !hasErrors };
}
