"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortSelectProps {
  defaultValue?: string;
}

export function SortSelect({ defaultValue = "desc" }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("order", value);

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Sort:</span>
      <Select defaultValue={defaultValue} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">Newest first</SelectItem>
          <SelectItem value="asc">Oldest first</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
