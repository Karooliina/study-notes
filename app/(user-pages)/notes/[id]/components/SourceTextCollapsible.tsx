"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SourceTextCollapsibleProps {
  sourceText: string;
}

export function SourceTextCollapsible({
  sourceText,
}: SourceTextCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center gap-2">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            {isOpen ? (
              <ChevronUp className="h-4 w-4 mr-2" />
            ) : (
              <ChevronDown className="h-4 w-4 mr-2" />
            )}
            Source Text
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-4">
        <div className="prose dark:prose-invert max-w-none">
          <p>{sourceText}</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
