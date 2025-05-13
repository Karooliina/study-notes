"use server";
import { Button } from "@/components/ui/button";
import { checkAuth, getNotesAction } from "../../actions";
import Link from "next/link";
import { NoteList } from "./components/NotesList";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GetNotesQueryParams } from "./types";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const { user } = await checkAuth();

  try {
    const queryParams: GetNotesQueryParams = { order: "desc" };
    const { data: notes, error, status } = await getNotesAction(queryParams);

    // Handle unauthorized access (though middleware should handle this)
    if (status === 401) {
      redirect("/login");
    }

    // Handle other error statuses
    if (status >= 400 && !error) {
      throw new Error("Failed to load notes");
    }

    return (
      <main className="container mx-auto px-4 py-8">
        <div className="w-full flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Your Notes</h1>
            <Button size="lg" asChild>
              <Link href="/notes/create">Create Note</Link>
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                {Array.isArray(error) ? error[0]?.message : error}
              </AlertDescription>
            </Alert>
          )}

          {notes && notes.data.length > 0 ? (
            <NoteList notes={notes.data} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg text-muted-foreground mb-4">
                You don't have any notes yet
              </p>
              <Button asChild>
                <Link href="/notes/create">Create your first note</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    );
  } catch (error) {
    // Let the error boundary handle any unexpected errors
    throw error;
  }
}
