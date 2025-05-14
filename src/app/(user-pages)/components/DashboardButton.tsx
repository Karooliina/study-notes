"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

export function DashboardButton() {
  const pathname = usePathname();

  if (pathname === "/dashboard") {
    return null;
  }

  return (
    <Button variant="outline" asChild>
      <Link href="/dashboard">
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Dashboard
      </Link>
    </Button>
  );
}
