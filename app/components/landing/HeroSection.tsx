import React from "react";
import { CallToActionButton } from "./CallToActionButton";

export type HeroSectionProps = {
  appName: string;
  tagline: string;
  description: string;
};

export const HeroSection = ({
  appName,
  tagline,
  description,
}: HeroSectionProps) => {
  return (
    <section className="bg-gradient-to-b from-background to-muted py-20 md:py-32 lg:py-40 w-full">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6">
          {appName}
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          {tagline}
        </p>
        <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto">
          {description}
        </p>
        <CallToActionButton text="Wypróbuj" href="/sign-in" />
      </div>
    </section>
  );
};
