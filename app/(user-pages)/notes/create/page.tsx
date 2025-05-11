"use server";

import { checkAuth } from "../../../actions";
import { AIModeForm } from "./components/AIModeForm";

import { ManualForm } from "./components/ManualForm";
import { SwitchMode } from "./components/SwitchMode";
import { DashboardButton } from "@/app/(user-pages)/components/DashboardButton";

export default async function CreateNote({
  searchParams,
}: {
  searchParams: { aiMode: string };
}) {
  const { user } = await checkAuth();

  const isAiMode = (await searchParams).aiMode === "true";

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <h1 className="text-2xl font-bold sr-only">Create Note</h1>
      <div>
        <DashboardButton />
      </div>
      <div className="flex flex-col gap-2 justify-center items-center">
        <div className="flex items-center gap-2">
          <SwitchMode aiMode={isAiMode} />
        </div>
        <div className="flex w-[800px] flex-col gap-4">
          {isAiMode ? <AIModeForm /> : <ManualForm />}
        </div>
      </div>
    </div>
  );
}
