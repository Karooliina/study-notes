import { CreateNoteFormState } from "../types";
import { ManualNoteForm } from "./ManualNoteForm";
import { AiNoteForm } from "./AiNoteForm";

interface CreateNoteFormProps {
  state: CreateNoteFormState;
  onStateChange: (state: Partial<CreateNoteFormState>) => void;
  onGenerate: () => void;
  onSave: () => void;
}

export function CreateNoteForm({
  state,
  onStateChange,
  onGenerate,
  onSave,
}: CreateNoteFormProps) {
  const isAiMode = state.mode === "AI";

  if (isAiMode) {
    return (
      <AiNoteForm
        state={state}
        onStateChange={onStateChange}
        onGenerate={onGenerate}
        onSave={onSave}
      />
    );
  }

  return (
    <ManualNoteForm
      state={state}
      onStateChange={onStateChange}
      onSave={onSave}
    />
  );
}
