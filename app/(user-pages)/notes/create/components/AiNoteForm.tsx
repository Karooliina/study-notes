import { Button } from "@/components/ui/button";
import { CreateNoteFormState } from "../types";
import { TitleInput } from "./TitleInput";
import { TextAreaInput } from "./TextAreaInput";
import { ValidationRules } from "@/app/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Sparkles } from "lucide-react";
import { SourceTextCollapsible } from "../../../components/SourceTextCollapsible";

interface AiNoteFormProps {
  state: CreateNoteFormState;
  onStateChange: (state: Partial<CreateNoteFormState>) => void;
  onGenerate: () => void;
  onSave: () => void;
}

export function AiNoteForm({
  state,
  onStateChange,
  onGenerate,
  onSave,
}: AiNoteFormProps) {
  const isGenerating = state.isGeneratingAiNote;
  const isSaving = state.isSavingNote;

  return (
    <form
      className="space-y-8 flex flex-col"
      onSubmit={(e) => e.preventDefault()}
    >
      <TitleInput
        value={state.title}
        onChange={(value) => onStateChange({ title: value })}
        maxLength={ValidationRules.notes.title.maxLength}
        disabled={isSaving}
        error={state.titleError}
      />
      {!state.generatedContent ? (
        <>
          <TextAreaInput
            label="Source Text"
            value={state.sourceText}
            onChange={(value) => onStateChange({ sourceText: value })}
            maxLength={ValidationRules.notes.sourceText.maxLength}
            disabled={isGenerating || isSaving}
            error={state.sourceTextError}
            placeholder="Paste your text here to generate a note..."
          />
          {state.aiGenerationError && (
            <Alert variant="destructive">
              <AlertDescription>{state.aiGenerationError}</AlertDescription>
            </Alert>
          )}
          <Button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating || isSaving || !state.sourceText}
            className="w-fit self-end"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Note...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Note
              </>
            )}
          </Button>
        </>
      ) : (
        <>
          <SourceTextCollapsible sourceText={state.sourceText} />
          <TextAreaInput
            label="Generated Note"
            value={state.generatedContent}
            onChange={(value) => onStateChange({ generatedContent: value })}
            maxLength={ValidationRules.notes.content.maxLength}
            disabled={isSaving}
            error={state.contentError}
            placeholder="Your generated note will appear here..."
          />

          {state.saveNoteError && (
            <Alert variant="destructive">
              <AlertDescription>{state.saveNoteError}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-4">
            <Button
              type="submit"
              onClick={onSave}
              disabled={isSaving || isGenerating}
            >
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
        </>
      )}
    </form>
  );
}
