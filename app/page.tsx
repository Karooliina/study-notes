import { HeroSection } from "./components/landing/HeroSection";
import {
  FeaturesSection,
  type FeatureItemProps,
} from "./components/landing/FeaturesSection";
import { CallToActionButton } from "./components/landing/CallToActionButton";
import { BookOpenCheck, PencilLine, Search } from "lucide-react"; // Przykładowe ikony

// Dane dla sekcji Hero
const heroData = {
  appName: "Study Notes",
  tagline: "Twoje inteligentne notatki, zawsze pod ręką.",
  description:
    "Odkryj nowy wymiar nauki z Study Notes. Twórz, organizuj i przyswajaj wiedzę efektywniej niż kiedykolwiek wcześniej.",
};

// Dane dla sekcji Features
const featuresData: FeatureItemProps[] = [
  {
    title: "Notatki zasilane AI",
    description:
      "Wykorzystaj moc sztucznej inteligencji do generowania streszczeń, kluczowych punktów i odpowiedzi na pytania na podstawie Twoich materiałów.",
    icon: <BookOpenCheck className="w-10 h-10 text-primary mb-4" />,
  },
  {
    title: "Intuicyjne tworzenie i edycja",
    description:
      "Prosty i przejrzysty edytor pozwoli Ci skupić się na treści, a nie na narzędziach. Dodawaj tekst, obrazy i linki bez wysiłku.",
    icon: <PencilLine className="w-10 h-10 text-primary mb-4" />,
  },
  {
    title: "Prosty system sortowania",
    description:
      "Organizuj swoje notatki według daty. Łatwo znajdziesz to, czego szukasz.",
    icon: <Search className="w-10 h-10 text-primary mb-4" />,
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection
        appName={heroData.appName}
        tagline={heroData.tagline}
        description={heroData.description}
      />
      <FeaturesSection
        title="Kluczowe funkcjonalności"
        features={featuresData}
      />
    </main>
  );
}
