import { NoteListItemDto } from "@/app/types";
import { NoteListItem } from "./NoteListItem";

export const NoteList = ({ notes }: { notes: NoteListItemDto[] }) => {
  return (
    <ul className="flex flex-col gap-4 w-full items-center">
      {notes.map((note) => (
        <NoteListItem key={note.id} note={note} />
      ))}
    </ul>
  );
};
