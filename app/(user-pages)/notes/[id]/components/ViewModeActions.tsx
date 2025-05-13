"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Pencil, Trash } from "lucide-react";
import { deleteNoteAction } from "@/app/actions";
import { DeleteConfirmationDialog } from "@/app/(user-pages)/components/DeleteConfirmationDialog";

interface ViewModeActionsProps {
  noteId: string;
}

export function ViewModeActions({ noteId }: ViewModeActionsProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleEdit = () => {
    router.push(`/notes/${noteId}?editMode=true`);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);

      const result = await deleteNoteAction(noteId);

      if (result.error) {
        setDeleteError(
          Array.isArray(result.error) ? result.error[0]?.message : result.error
        );
        setIsDeleting(false);
        return;
      }

      toast.success("Note deleted successfully");
      router.push("/dashboard");
    } catch (error) {
      setDeleteError("An unexpected error occurred while deleting the note");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          onClick={handleEdit}
          className="flex items-center p-3 rounded-full"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={isDeleting}
          className="flex items-center p-3 rounded-full"
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash className="h-4 w-4" />
          )}
        </Button>
      </div>

      {deleteError && (
        <Alert variant="destructive">
          <AlertDescription>{deleteError}</AlertDescription>
        </Alert>
      )}

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </>
  );
}
