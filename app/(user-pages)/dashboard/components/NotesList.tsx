import { NoteListItemDto } from "@/app/types";
import { NoteListItem } from "./NoteListItem/NoteListItem";

interface NoteListProps {
  notes: NoteListItemDto[];
}

export function NoteList({ notes }: NoteListProps) {
  return (
    <section aria-label="Your notes" className="w-full">
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
    </section>
  );
}
