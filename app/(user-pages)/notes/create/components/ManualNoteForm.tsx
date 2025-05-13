import { Button } from "@/components/ui/button";
import { CreateNoteFormState } from "../types";
import { TitleInput } from "./TitleInput";
import { TextAreaInput } from "./TextAreaInput";
import { ValidationRules } from "@/app/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface ManualNoteFormProps {
  state: CreateNoteFormState;
  onStateChange: (state: Partial<CreateNoteFormState>) => void;
  onSave: () => void;
}

export function ManualNoteForm({
  state,
  onStateChange,
  onSave,
}: ManualNoteFormProps) {
  const isSaving = state.isSavingNote;

  return (
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
      <TitleInput
        value={state.title}
        onChange={(value) => onStateChange({ title: value })}
        maxLength={ValidationRules.notes.title.maxLength}
        disabled={isSaving}
        error={state.titleError}
      />

      <TextAreaInput
        label="Note Content"
        value={state.manualContent}
        onChange={(value) => onStateChange({ manualContent: value })}
        maxLength={ValidationRules.notes.content.maxLength}
        disabled={isSaving}
        error={state.contentError}
        placeholder="Write your note here..."
      />

      {state.saveNoteError && (
        <Alert variant="destructive">
          <AlertDescription>{state.saveNoteError}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-4">
        <Button type="submit" onClick={onSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Note"
          )}
        </Button>
      </div>
    </form>
  );
}
