"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { NoteMode } from "../types";
import { useRouter } from "next/navigation";

export function ModeSwitcher({ currentMode }: { currentMode: NoteMode }) {
  const isAiMode = currentMode === "AI";

  const router = useRouter();

  const handleModeChange = (checked: boolean) => {
    if (checked) router.push(`/notes/create?isAiMode=true`);
    else router.push(`/notes/create`);
  };

  return (
    <div className="flex items-center space-x-8">
      <div className="flex items-center space-x-2">
        <Switch
          id="mode-switch"
          checked={isAiMode}
          onCheckedChange={handleModeChange}
        />
        <Label htmlFor="mode-switch" className="font-medium">
          AI Mode {isAiMode ? "On" : "Off"}
        </Label>
      </div>
      <p className="text-sm text-muted-foreground">
        {isAiMode
          ? "AI will help you create a note from your text"
          : "Write your note manually"}
      </p>
    </div>
  );
}
