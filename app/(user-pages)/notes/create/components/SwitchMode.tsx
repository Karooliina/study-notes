"use client";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
export const SwitchMode = ({ aiMode }: { aiMode: boolean }) => {
  const router = useRouter();
  const handleSwitchChange = (checked: boolean) => {
    if (checked) {
      router.push(`/notes/create?aiMode=true`);
    } else {
      router.push(`/notes/create`);
    }
  };
  return (
    <div className="flex items-center gap-2">
      <Switch
        id="create-mode"
        checked={aiMode}
        onCheckedChange={handleSwitchChange}
      />
      <Label htmlFor="create-mode">AI Mode</Label>
    </div>
  );
};
