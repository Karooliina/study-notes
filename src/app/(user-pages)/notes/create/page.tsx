"use server";

import { ModeSwitcher } from "./components/ModeSwitcher";
import { CreateNoteForm } from "./components/CreateNoteForm";

export default async function CreateNotePage({
  searchParams,
}: {
  searchParams: Promise<{ isAiMode: string }>;
}) {
  const mode = (await searchParams).isAiMode ? "AI" : "Manual";

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="w-full flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Create New Note</h1>
        </div>

        <ModeSwitcher currentMode={mode} />
        <CreateNoteForm mode={mode} />
      </div>
    </main>
  );
}
