import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TextAreaInputProps } from "../types";
import { CharCounter } from "@/app/(user-pages)/components/CharCounter";

export function TextAreaInput({
  value,
  onChange,
  maxLength,
  disabled,
  error,
  placeholder,
  label,
}: TextAreaInputProps) {
  const charCount = value.length;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor={label.toLowerCase()} className="text-base">
          {label}
        </Label>
        <CharCounter current={charCount} max={maxLength} />
      </div>
      <Textarea
        id={label.toLowerCase()}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        maxLength={maxLength}
        className={`min-h-[200px] ${error ? "border-destructive" : ""}`}
        placeholder={placeholder}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
