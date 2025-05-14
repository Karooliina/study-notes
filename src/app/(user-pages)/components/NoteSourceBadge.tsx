import { Badge } from "@/components/ui/badge";
import { Edit3, Sparkles } from "lucide-react";
import { SourceType } from "@/app/types";

interface NoteSourceBadgeProps {
  source: SourceType;
}

export function NoteSourceBadge({ source }: NoteSourceBadgeProps) {
  const sourceText = source === "ai" ? "AI Generated" : "Manual";
  const badgeVariant = source === "ai" ? "secondary" : "default";

  return (
    <Badge variant={badgeVariant} className="max-w-fit">
      <div className="flex items-center gap-1">
        {source === "ai" ? (
          <Sparkles className="h-3 w-3 mr-1" />
        ) : (
          <Edit3 className="h-3 w-3 mr-1" />
        )}
        {sourceText}
      </div>
    </Badge>
  );
}
