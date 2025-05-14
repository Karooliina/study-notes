"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { EditModeFormProps } from "../types";
import { Button } from "@/src/components/ui/button";
import { Form } from "@/src/components/ui/form";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { Save, X } from "lucide-react";
import { updateNoteAction } from "@/src/app/actions";
import {
  manualNoteSchema,
  ManualNoteFormValues,
} from "@/src/app/schemas/forms";
import {
  FormInput,
  FormTextArea,
} from "@/src/app/(user-pages)/components/FormFields";
import { ValidationRules } from "@/src/app/types";

export function EditModeForm({ noteId, initialData }: EditModeFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ManualNoteFormValues>({
    resolver: zodResolver(manualNoteSchema),
    defaultValues: {
      title: initialData.title,
      content: initialData.content,
    },
  });

  const onSubmit = async (data: ManualNoteFormValues) => {
    try {
      setIsSaving(true);

      const result = await updateNoteAction(noteId, {
        title: data.title,
        content: data.content,
      });

      if (result.error) {
        form.setError("root", {
          message: Array.isArray(result.error)
            ? result.error[0]?.message
            : result.error,
        });
        setIsSaving(false);
        return;
      }

      toast.success("Note updated successfully");
      router.push(`/notes/${noteId}`);
    } catch (error) {
      form.setError("root", {
        message: "Failed to update note",
      });
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/notes/${noteId}`);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-8"
      >
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
          placeholder="Note content"
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

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
