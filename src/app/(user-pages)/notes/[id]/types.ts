import { NoteDto } from "@/app/types";
import { ZodError } from "zod";

export interface NoteDetailState {
  noteData: NoteDto | null;
  isLoadingNote: boolean;
  loadNoteError: string | null;

  editableTitle: string;
  editableContent: string;
  isSaving: boolean;
  saveError: string | ZodError["errors"] | null;
  titleEditError: string | null;
  contentEditError: string | null;

  isDeleteDialogOpen: boolean;
  isDeleting: boolean;
  deleteError: string | null;
}

export interface ViewModeContentProps {
  note: NoteDto;
  noteId: string;
}

export interface EditModeFormProps {
  noteId: string;
  initialData: Pick<NoteDto, "title" | "content">;
}
