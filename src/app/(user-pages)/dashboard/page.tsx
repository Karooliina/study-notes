"use server";
import { Button } from "@/components/ui/button";
import { getNotesAction } from "@/app/actions";
import Link from "next/link";
import { NoteList } from "./components/NoteList/NotesList";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GetNotesQueryParams } from "./types";

export default async function Dashboard() {
  const queryParams: GetNotesQueryParams = { order: "desc" };
  const { data: notes, error } = await getNotesAction(queryParams);

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
        <NoteList notes={notes?.data} />
      </div>
    </main>
  );
}
