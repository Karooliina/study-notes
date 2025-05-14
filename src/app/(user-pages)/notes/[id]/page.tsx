import { ViewModeContent } from "./components/ViewModeContent";
import { EditModeForm } from "./components/EditModeForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Toaster } from "sonner";
import { getNoteDetailsAction } from "@/app/actions";
import { ZodIssue } from "zod";

interface NoteDetailPageProps {
  params: {
    id: string;
  };
  searchParams: {
    editMode?: string;
  };
}

interface ErrorDisplayProps {
  error: string | ZodIssue[] | null;
}

function ErrorDisplay({ error }: ErrorDisplayProps) {
  const errorMessage = error
    ? Array.isArray(error)
      ? error[0]?.message || "Validation error"
      : error
    : "An error occurred";

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="w-full flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Error</h1>
        </div>
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      </div>
    </main>
  );
}

export default async function NoteDetailPage({
  params,
  searchParams,
}: NoteDetailPageProps) {
  const isEditMode = searchParams.editMode === "true";

  try {
    const result = await getNoteDetailsAction(params.id);

    if (result.error) {
      return <ErrorDisplay error={result.error} />;
    }

    if (!result.data) {
      return <ErrorDisplay error="Note not found" />;
    }

    return (
      <main className="container mx-auto px-4 py-8">
        <div className="w-full flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold sr-only">
              {isEditMode ? "Edit Note" : "Note Details"}
            </h1>
          </div>

          {isEditMode ? (
            <EditModeForm
              noteId={params.id}
              initialData={{
                title: result.data.title,
                content: result.data.content,
              }}
            />
          ) : (
            <ViewModeContent note={result.data} noteId={params.id} />
          )}
        </div>
        <Toaster />
      </main>
    );
  } catch (error) {
    return (
      <ErrorDisplay error="An unexpected error occurred. Please try again later." />
    );
  }
}
