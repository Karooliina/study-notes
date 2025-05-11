import { NoteListItemDto } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export const NoteListItem = ({ note }: { note: NoteListItemDto }) => {
  const date = new Date(note.created_at).toLocaleDateString();

  return (
    <Link href={`/notes/${note.id}`}>
      <Card className="w-[800px]">
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge>{note.source}</Badge>
        </CardContent>
        <CardFooter>{date}</CardFooter>
      </Card>
    </Link>
  );
};
