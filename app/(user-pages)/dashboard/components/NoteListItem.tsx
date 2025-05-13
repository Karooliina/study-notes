import { NoteListItemDto } from "@/app/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { format } from "date-fns";
import { NoteCardViewModel } from "../types";
import { useMemo } from "react";
import styles from "./NoteListItem.module.scss";
import { NoteSourceBadge } from "@/app/(user-pages)/components/NoteSourceBadge";

interface NoteListItemProps {
  note: NoteListItemDto;
}

export function NoteListItem({ note }: NoteListItemProps) {
  const viewModel = useMemo<NoteCardViewModel>(
    () => ({
      id: note.id,
      title: note.title,
      content: note.content,
      source: note.source,
      displayDate: format(new Date(note.created_at), "PPP"),
      detailPath: `/notes/${note.id}`,
    }),
    [note]
  );

  return (
    <Link
      href={viewModel.detailPath}
      className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
    >
      <Card className="h-full transition-colors hover:bg-muted/50">
        <CardHeader>
          <CardTitle className="line-clamp-2">{viewModel.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <NoteSourceBadge source={viewModel.source} />
            </div>
            <p className={`text-sm text-muted-foreground ${styles.content}`}>
              {viewModel.content}
            </p>
          </div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          Created on {viewModel.displayDate}
        </CardFooter>
      </Card>
    </Link>
  );
}
