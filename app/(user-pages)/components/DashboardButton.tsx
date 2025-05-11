import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

export const DashboardButton = () => {
  return (
    <Button variant="outline" asChild>
      <Link href="/dashboard">
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Dashboard
      </Link>
    </Button>
  );
};
