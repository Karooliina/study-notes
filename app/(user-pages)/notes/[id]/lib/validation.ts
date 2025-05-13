import { ValidationRules } from "@/app/types";

interface ValidationFormData {
  title: string;
  content: string;
}

interface ValidationResult {
  errors: {
    titleEditError: string | null;
    contentEditError: string | null;
  };
  isValid: boolean;
}

export function validateForm(data: ValidationFormData): ValidationResult {
  const errors = {
    titleEditError: null,
    contentEditError: null,
  };

  // Title validation
  if (!data.title.trim()) {
    errors.titleEditError = "Title is required";
  } else if (data.title.length > ValidationRules.notes.title.maxLength) {
    errors.titleEditError = `Title cannot exceed ${ValidationRules.notes.title.maxLength} characters`;
  }

  // Content validation
  if (!data.content.trim()) {
    errors.contentEditError = "Content is required";
  } else if (data.content.length > ValidationRules.notes.content.maxLength) {
    errors.contentEditError = `Content cannot exceed ${ValidationRules.notes.content.maxLength} characters`;
  }

  const hasErrors = Object.values(errors).some((error) => error !== null);
  return { errors, isValid: !hasErrors };
}
