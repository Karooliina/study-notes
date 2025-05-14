interface CharCounterProps {
  current: number;
  max: number;
}

export function CharCounter({ current, max }: CharCounterProps) {
  const isOverLimit = current > max;

  return (
    <span
      className={`text-sm ${isOverLimit ? "text-destructive" : "text-muted-foreground"}`}
    >
      {current}/{max}
    </span>
  );
}
