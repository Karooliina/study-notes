import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export type CallToActionButtonProps = {
  text: string;
  href: string;
};

export const CallToActionButton = ({ text, href }: CallToActionButtonProps) => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 text-center">
        <Button
          asChild
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Link href={href}>{text}</Link>
        </Button>
      </div>
    </section>
  );
};
