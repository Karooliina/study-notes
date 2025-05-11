"use client";
import { Label } from "@/components/ui/label";

import { SubmitButton } from "@/components/submit-button";
import { createNoteAction, generateNoteAction } from "@/app/actions";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const AIModeForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedNote, setGeneratedNote] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (generatedNote) {
    return (
      <form>
        <Label htmlFor="title">Title</Label>
        <Input name="title" placeholder="Title" required />
        <Label htmlFor="generated_note">Generated Note</Label>
        <Textarea
          name="generated_note"
          placeholder="Generated Note"
          required
          value={generatedNote}
          onChange={(e) => setGeneratedNote(e.target.value)}
          readOnly={!editMode}
        />
        {editMode ? (
          <>
            <Button onClick={() => setEditMode(false)}>Cancel</Button>
            <Button
              onSubmit={() => {
                setEditMode(false);
              }}
            >
              Accept
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setEditMode(true)}>Edit</Button>
            <SubmitButton
              formAction={async (formData) => {
                await createNoteAction({
                  title: formData.get("title") as string,
                  content: generatedNote,
                  source: "ai",
                });
              }}
            >
              Save
            </SubmitButton>
          </>
        )}
      </form>
    );
  }

  if (editMode) {
    return <div>Edit</div>;
  }

  return (
    <form className="flex flex-col gap-4">
      <Label htmlFor="source_text">Learning materials</Label>
      <Textarea name="source_text" placeholder="Content" required />
      <SubmitButton
        className="w-fit self-end"
        formAction={async (formData) => {
          const { data, error } = await generateNoteAction({
            source_text: formData.get("source_text") as string,
          });

          setIsLoading(true);
          if (error) {
            setIsLoading(false);
            console.error(error);
          }
          if (data) {
            console.log(data);
            setIsLoading(false);
            setGeneratedNote(data.content);
          }
        }}
        pendingText="Generating note..."
      >
        Generate Note
      </SubmitButton>
    </form>
  );
};
