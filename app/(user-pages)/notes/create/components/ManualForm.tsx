import { Label } from "@/components/ui/label";

import { createNoteAction } from "@/app/actions";

import { SubmitButton } from "@/components/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";

export const ManualForm = () => {
  return (
    <form className="flex flex-col gap-4">
      <Label htmlFor="title">Title</Label>
      <Input name="title" placeholder="Title" required />
      <Label htmlFor="content">Content</Label>
      <Textarea name="content" placeholder="Content" required />
      <SubmitButton
        className="w-fit self-end"
        formAction={async (formData) => {
          "use server";
          await createNoteAction({
            title: formData.get("title") as string,
            content: formData.get("content") as string,
            source: "manual",
          });
          redirect("/dashboard");
        }}
        pendingText="Creating note..."
      >
        Create Note
      </SubmitButton>
    </form>
  );
};
