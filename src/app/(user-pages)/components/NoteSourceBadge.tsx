import { Badge } from "@/components/ui/badge";
import { Edit3, Sparkles } from "lucide-react";
import { SourceType } from "@/app/types";

interface NoteSourceBadgeProps {
  source: SourceType;
}

export function NoteSourceBadge({ source }: NoteSourceBadgeProps) {
  const sourceText = source === "ai" ? "AI Generated" : "Manual";
  const badgeVariant = source === "ai" ? "secondary" : "default";

  const badgeColor =
    source === "ai"
      ? "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/40"
      : "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/40";

  return (
    <Badge variant={badgeVariant} className={`max-w-fit ${badgeColor}`}>
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
