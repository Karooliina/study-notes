"use server";
import { Button } from "@/components/ui/button";
import { checkAuth, getNotesAction } from "../../actions";
import Link from "next/link";

import { NoteList } from "./components/NotesList";

export default async function Dashboard() {
  const { user } = await checkAuth();
  const { data: notes, error } = await getNotesAction();

  return (
    <div className="w-full flex flex-col gap-12">
      <h1 className="text-2xl font-bold sr-only">Dashboard</h1>
      <div className="flex w-full justify-end items-start">
        <Button size="lg">
          <Link href="/notes/create">Create Note</Link>
        </Button>
      </div>
      {notes && notes.data.length > 0 ? (
        <NoteList notes={notes.data} />
      ) : (
        <div className="text-center text-sm text-muted-foreground">
          No notes found
        </div>
      )}
    </div>
  );
}
