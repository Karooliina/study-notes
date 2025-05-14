import { NoteListItemDto } from "@/app/types";
import { NoteListItem } from "../NoteListItem/NoteListItem";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface NoteListProps {
  notes?: NoteListItemDto[];
}

export function NoteList({ notes }: NoteListProps) {
  return (
    <section aria-label="Your notes" className="w-full">
      {notes && notes.length > 0 ? (
        <ul
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full"
          role="list"
        >
          {notes.map((note) => (
            <li key={note.id} className="w-full">
              <NoteListItem note={note} />
            </li>
          ))}
        </ul>
      ) : (
        <div
          className="flex flex-col items-center justify-center py-12 text-center"
          data-testid="no-notes-message"
        >
          <p className="text-lg text-muted-foreground mb-4">
            You don't have any notes yet
          </p>
          <Button asChild>
            <Link href="/notes/create">Create your first note</Link>
          </Button>
        </div>
      )}
    </section>
  );
}
