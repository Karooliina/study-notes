import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateNoteFormState, NoteMode } from "../types";
import { validateForm } from "../lib/validation";
import { createNoteAction, generateNoteAction } from "@/app/actions";

const initialState: CreateNoteFormState = {
  mode: "Manual",
  title: "",
  sourceText: "",
  generatedContent: "",
  manualContent: "",
  isGeneratingAiNote: false,
  aiGenerationError: null,
  isSavingNote: false,
  saveNoteError: null,
  titleError: null,
  sourceTextError: null,
  contentError: null,
};

export function useCreateNoteForm() {
  const [state, setState] = useState<CreateNoteFormState>(initialState);
  const router = useRouter();

  const handleStateChange = (newState: Partial<CreateNoteFormState>) => {
    setState((prev) => ({ ...prev, ...newState }));
  };

  const handleModeChange = (newMode: NoteMode) => {
    setState((prev) => ({
      ...prev,
      mode: newMode,
      // Clear errors when switching modes
      titleError: null,
      sourceTextError: null,
      contentError: null,
      aiGenerationError: null,
      saveNoteError: null,
    }));
  };

  const handleGenerate = async () => {
    try {
      const validation = validateForm(state);
      if (!validation.isValid) {
        setState((prev) => ({ ...prev, ...validation.errors }));
        return;
      }

      setState((prev) => ({
        ...prev,
        isGeneratingAiNote: true,
        aiGenerationError: null,
      }));

      const result = await generateNoteAction({
        source_text: state.sourceText,
      });

      if (result.error) {
        setState((prev) => ({
          ...prev,
          isGeneratingAiNote: false,
          aiGenerationError: Array.isArray(result.error)
            ? result.error[0]?.message
            : result.error,
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        isGeneratingAiNote: false,
        generatedContent: result.data?.content || "",
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isGeneratingAiNote: false,
        aiGenerationError: "Failed to generate note. Please try again.",
      }));
    }
  };

  const handleSave = async () => {
    try {
      const validation = validateForm(state);
      if (!validation.isValid) {
        setState((prev) => ({ ...prev, ...validation.errors }));
        return;
      }

      setState((prev) => ({
        ...prev,
        isSavingNote: true,
        saveNoteError: null,
      }));

      const result = await createNoteAction({
        title: state.title,
        content:
          state.mode === "AI" ? state.generatedContent : state.manualContent,
        source: state.mode === "AI" ? "ai" : "manual",
        source_text: state.mode === "AI" ? state.sourceText : null,
      });

      if (result.error) {
        setState((prev) => ({
          ...prev,
          isSavingNote: false,
          saveNoteError: Array.isArray(result.error)
            ? result.error[0]?.message
            : result.error,
        }));
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isSavingNote: false,
        saveNoteError: "Failed to save note. Please try again.",
      }));
    }
  };

  return {
    state,
    handleStateChange,
    handleModeChange,
    handleGenerate,
    handleSave,
  };
}
