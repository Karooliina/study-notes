import { NoteDto } from "@/app/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ViewModeActions } from "./ViewModeActions";
import { SourceTextCollapsible } from "../../../components/SourceTextCollapsible";
import { NoteSourceBadge } from "@/app/(user-pages)/components/NoteSourceBadge";

interface ViewModeContentProps {
  note: NoteDto;
  noteId: string;
}

export function ViewModeContent({ note, noteId }: ViewModeContentProps) {
  const formattedDate = new Date(note.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{note.title}</h2>
            <ViewModeActions noteId={noteId} />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{formattedDate}</span>
            <span>•</span>
            <NoteSourceBadge source={note.source} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose dark:prose-invert max-w-none">
            {note.content}
          </div>

          {note.source_text && (
            <SourceTextCollapsible sourceText={note.source_text} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
