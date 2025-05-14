import { NoteMode } from "../types";
import { ManualNoteForm } from "./ManualNoteForm";
import { AiNoteForm } from "./AiNoteForm";

export function CreateNoteForm({ mode }: { mode: NoteMode }) {
  const isAiMode = mode === "AI";
  console.log(mode);

  if (isAiMode) {
    return <AiNoteForm />;
  }

  return <ManualNoteForm />;
}
