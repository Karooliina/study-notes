"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full flex flex-col gap-8 items-center justify-center min-h-[400px]">
        <Alert variant="destructive" className="max-w-[500px]">
          <AlertTitle>Something went wrong!</AlertTitle>
          <AlertDescription className="mt-2">
            {"An unexpected error occurred while loading your notes."}
          </AlertDescription>
        </Alert>

        <div className="flex gap-4">
          <Button onClick={() => reset()} variant="default">
            Try again
          </Button>
          <Button variant="outline" asChild>
            <a href="/">Return to Homepage</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
