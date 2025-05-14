"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { ValidationRules } from "@/app/types";
import { FormInput, FormTextArea } from "../../../components/FormFields";
import { ManualNoteFormValues, manualNoteSchema } from "@/app/schemas/forms";
import { useState } from "react";
import { createNoteAction } from "@/app/actions/notes";
import { useRouter } from "next/navigation";
export function ManualNoteForm() {
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const form = useForm<ManualNoteFormValues>({
    resolver: zodResolver(manualNoteSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = async () => {
    if (form.getValues("title") && form.getValues("content")) {
      setIsSaving(true);
      const result = await createNoteAction({
        title: form.getValues("title"),
        content: form.getValues("content") ?? "",
        source: "manual",
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormInput
          name="title"
          label="Title"
          placeholder="Note title"
          maxLength={ValidationRules.notes.title.maxLength}
          disabled={isSaving}
        />

        <FormTextArea
          name="content"
          label="Note Content"
          placeholder="Write your note here..."
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
          <Button type="submit" disabled={isSaving}>
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
    </Form>
  );
}
