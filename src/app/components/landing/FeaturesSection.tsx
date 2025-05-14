import React from "react";
import { CheckCircle } from "lucide-react";

export type FeatureItemProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
};

export type FeaturesSectionProps = {
  title: string;
  features: FeatureItemProps[];
};

const FeatureItem = ({ title, description, icon }: FeatureItemProps) => {
  return (
    <div className="flex flex-col items-center p-6 text-center bg-card rounded-lg shadow-md md:items-start md:text-left">
      {icon || <CheckCircle className="w-10 h-10 text-primary mb-4" />}
      <h3 className="text-xl font-semibold mb-2 text-card-foreground">
        {title}
      </h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export const FeaturesSection = ({ title, features }: FeaturesSectionProps) => {
  return (
    <section className="py-12 md:py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 text-foreground">
          {title}
        </h2>
        {features && features.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureItem key={index} {...feature} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No features to display.
          </p>
        )}
      </div>
    </section>
  );
};
