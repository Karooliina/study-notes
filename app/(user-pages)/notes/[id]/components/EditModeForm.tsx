"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EditModeFormProps } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ValidationRules } from "@/app/types";
import { Save, X } from "lucide-react";
import { updateNoteAction } from "@/app/actions";
import { CharCounter } from "@/app/(user-pages)/components/CharCounter";

export function EditModeForm({ noteId, initialData }: EditModeFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.content);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(initialData.title);
    setContent(initialData.content);
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setTitleError(null);
    setContentError(null);
    setError(null);

    // Validate title
    if (!title.trim()) {
      setTitleError("Title is required");
      return;
    }
    if (title.length > ValidationRules.notes.title.maxLength) {
      setTitleError(
        `Title cannot exceed ${ValidationRules.notes.title.maxLength} characters`
      );
      return;
    }

    // Validate content
    if (!content.trim()) {
      setContentError("Content is required");
      return;
    }
    if (content.length > ValidationRules.notes.content.maxLength) {
      setContentError(
        `Content cannot exceed ${ValidationRules.notes.content.maxLength} characters`
      );
      return;
    }

    try {
      setIsSaving(true);

      const result = await updateNoteAction(noteId, {
        title,
        content,
      });

      if (result.error) {
        setError(
          Array.isArray(result.error) ? result.error[0]?.message : result.error
        );
        setIsSaving(false);
        return;
      }

      toast.success("Note updated successfully");
      router.push(`/notes/${noteId}`);
    } catch (error) {
      setError("Failed to update note");
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/notes/${noteId}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Input
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={ValidationRules.notes.title.maxLength}
            className={titleError ? "border-destructive" : ""}
          />
          <CharCounter
            current={title.length}
            max={ValidationRules.notes.title.maxLength}
          />
        </div>
        {titleError && <p className="text-sm text-destructive">{titleError}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <Textarea
            placeholder="Note content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={ValidationRules.notes.content.maxLength}
            className={`min-h-[200px] ${contentError ? "border-destructive" : ""}`}
          />
          <CharCounter
            current={content.length}
            max={ValidationRules.notes.content.maxLength}
          />
        </div>
        {contentError && (
          <p className="text-sm text-destructive">{contentError}</p>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
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
  );
}
