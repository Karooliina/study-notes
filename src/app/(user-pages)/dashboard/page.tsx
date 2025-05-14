"use server";
import { Button } from "@/components/ui/button";
import { getNotesAction } from "@/app/actions";
import Link from "next/link";
import { NoteList } from "./components/NoteList/NotesList";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GetNotesQueryParams } from "./types";
import { SortSelect } from "./components/SortSelect/SortSelect";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  const queryParams: GetNotesQueryParams = { order: order as "asc" | "desc" };
  const { data: notes, error } = await getNotesAction(queryParams);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full flex flex-col gap-8">
        <div className="flex items-center justify-between md:flex-row flex-col gap-4">
          <h1 className="text-3xl font-bold">Your Notes</h1>
          <div className="flex items-center gap-4">
            <SortSelect defaultValue={order} />
            <Button size="lg" asChild>
              <Link href="/notes/create">Create Note</Link>
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              {Array.isArray(error) ? error[0]?.message : error}
            </AlertDescription>
          </Alert>
        )}
        <NoteList notes={notes?.data} />
      </div>
    </div>
  );
}
