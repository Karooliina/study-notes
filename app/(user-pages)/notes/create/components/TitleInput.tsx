import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CharCounter } from "@/app/(user-pages)/components/CharCounter";

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  maxLength: number;
  disabled?: boolean;
}

export function TitleInput({
  value,
  onChange,
  maxLength,
  error,
  disabled,
}: TitleInputProps) {
  const charCount = value.length;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="title">Title</Label>
        <CharCounter current={charCount} max={maxLength} />
      </div>
      <Input
        id="title"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        className={error ? "border-destructive" : ""}
        placeholder="Enter note title..."
        disabled={disabled}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
