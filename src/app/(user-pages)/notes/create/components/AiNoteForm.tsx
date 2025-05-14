"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Sparkles } from "lucide-react";
import { ValidationRules } from "@/app/types";
import { FormInput, FormTextArea } from "../../../components/FormFields";
import { AiNoteFormValues, aiNoteSchema } from "@/app/schemas/forms";
import { SourceTextCollapsible } from "../../../components/SourceTextCollapsible";
import { generateNoteAction } from "@/app/actions/ai";
import { createNoteAction } from "@/app/actions/notes";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function AiNoteForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();

  const form = useForm<AiNoteFormValues>({
    resolver: zodResolver(aiNoteSchema),
    defaultValues: {
      title: "",
      sourceText: "",
      generatedContent: "",
    },
  });

  const sourceText = form.watch("sourceText");
  const generatedContent = form.watch("generatedContent");

  const handleGenerate = async () => {
    setIsGenerating(true);

    const result = await generateNoteAction({
      source_text: form.getValues("sourceText"),
    });

    if (result.error) {
      form.setError("generatedContent", {
        message: Array.isArray(result.error)
          ? result.error[0].message
          : result.error,
      });
    } else {
      form.setValue("generatedContent", result.data?.content || "");
    }

    setIsGenerating(false);
  };

  const onSubmit = async () => {
    if (form.getValues("title") && form.getValues("generatedContent")) {
      setIsSaving(true);
      const result = await createNoteAction({
        title: form.getValues("title"),
        content: form.getValues("generatedContent") ?? "",
        source_text: form.getValues("sourceText"),
        source: "ai",
      });

      if (result.error) {
        form.setError("root", {
          message: Array.isArray(result.error)
            ? result.error[0].message
            : result.error,
        });
        setIsSaving(false);
        return;
      }

      setIsSaving(false);
      router.push(`/notes/${result.data?.id}`);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col"
      >
        <FormInput
          name="title"
          label="Title"
          placeholder="Note title"
          maxLength={ValidationRules.notes.title.maxLength}
          disabled={isSaving}
        />

        {!generatedContent ? (
          <>
            <FormTextArea
              name="sourceText"
              label="Source Text"
              placeholder="Paste your text here to generate a note..."
              maxLength={ValidationRules.notes.sourceText.maxLength}
              disabled={isGenerating || isSaving}
            />

            {form.formState.errors.generatedContent && (
              <Alert variant="destructive">
                <AlertDescription>
                  {form.formState.errors.generatedContent.message}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || isSaving || !sourceText}
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
            <SourceTextCollapsible sourceText={sourceText} />
            <FormTextArea
              name="generatedContent"
              label="Generated Note"
              placeholder="Your generated note will appear here..."
              maxLength={ValidationRules.notes.content.maxLength}
              disabled={isSaving}
            />

            {form.formState.errors.root && (
              <Alert variant="destructive">
                <AlertDescription>
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-4">
              <Button type="submit" disabled={isSaving || isGenerating}>
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
    </Form>
  );
}
