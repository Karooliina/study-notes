import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NoteCardSkeleton } from "./components/NoteCardSkeleton";

export default function DashboardLoading() {
  return (
    <main className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
      <div className="w-full flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-32" />
          <Button size="lg" disabled>
            Create Note
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="animate-in fade-in duration-500"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <NoteCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
