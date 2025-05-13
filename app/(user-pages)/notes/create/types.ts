import { NoteDto, CreateNoteDto } from "@/app/types";
import { ZodIssue } from "zod";

export type NoteMode = "AI" | "Manual";

export interface CreateNoteFormState {
  mode: NoteMode;
  title: string;
  sourceText: string;
  generatedContent: string;
  manualContent: string;

  isGeneratingAiNote: boolean;
  aiGenerationError: string | null;
  isSavingNote: boolean;
  saveNoteError: string | null;

  titleError: string | null;
  sourceTextError: string | null;
  contentError: string | null;
}

export interface ModeSwitcherProps {
  currentMode: NoteMode;
  onModeChange: (newMode: NoteMode) => void;
}

export interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  disabled?: boolean;
  error?: string | null;
}

export interface TextAreaInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  disabled?: boolean;
  error?: string | null;
  placeholder?: string;
  label: string;
}

export interface CreateNoteApiResponse {
  data?: NoteDto;
  error?: string | ZodIssue[];
  status: number;
}
