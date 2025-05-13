"use client";

import { Button } from "@/components/ui/button";
import { ModeSwitcher } from "./components/ModeSwitcher";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CreateNoteForm } from "./components/CreateNoteForm";
import { useCreateNoteForm } from "./hooks/useCreateNoteForm";

export default function CreateNotePage() {
  const {
    state,
    handleStateChange,
    handleModeChange,
    handleGenerate,
    handleSave,
  } = useCreateNoteForm();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="w-full flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Create New Note</h1>
        </div>

        <ModeSwitcher
          currentMode={state.mode}
          onModeChange={handleModeChange}
        />

        <CreateNoteForm
          state={state}
          onStateChange={handleStateChange}
          onGenerate={handleGenerate}
          onSave={handleSave}
        />
      </div>
    </main>
  );
}
