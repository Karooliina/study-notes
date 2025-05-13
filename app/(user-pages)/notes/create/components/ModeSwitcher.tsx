import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ModeSwitcherProps, NoteMode } from "../types";

export function ModeSwitcher({ currentMode, onModeChange }: ModeSwitcherProps) {
  const isAiMode = currentMode === "AI";

  return (
    <div className="flex items-center space-x-8">
      <div className="flex items-center space-x-2">
        <Switch
          id="mode-switch"
          checked={isAiMode}
          onCheckedChange={(checked) => onModeChange(checked ? "AI" : "Manual")}
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
