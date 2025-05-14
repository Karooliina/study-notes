# Plan implementacji widoku Strony Głównej (/)

## 1. Przegląd

Strona główna pełni rolę wizytówki aplikacji "Study Notes". Jej głównym celem jest zapoznanie potencjalnych użytkowników z kluczowymi funkcjonalnościami aplikacji, przedstawienie jej wartości oraz zachęcenie do rejestracji lub logowania poprzez wyraźne wezwanie do działania (CTA). Widok ma być estetyczny, responsywny i dostępny.

## 2. Routing widoku

Widok Strony Głównej powinien być dostępny pod główną ścieżką aplikacji: `/`.

## 3. Struktura komponentów

```
/ (Route - app/page.tsx)
  └── HomePage (Server Component)
      ├── HeroSection (Server Component)
      ├── FeaturesSection (Server Component)
      │   └── FeatureItem[] (Server Component) // Jeśli funkcje są przedstawiane jako lista/karty
      ├── CallToActionButton (Server Component)
      └── Footer (Server Component)
```

## 4. Szczegóły komponentów

### `HomePage` (Server Component - Plik: `app/page.tsx`)

- **Opis komponentu**: Główny komponent strony dla ścieżki `/`. Odpowiada za złożenie poszczególnych sekcji strony głównej w odpowiedniej kolejności.
- **Główne elementy**: Renderuje komponenty `HeroSection`, `FeaturesSection`, `CallToActionButton` oraz `Footer`.
- **Obsługiwane interakcje**: Brak bezpośrednich interakcji użytkownika; deleguje je do komponentów podrzędnych (np. CTA).
- **Obsługiwana walidacja**: Brak.
- **Typy**: Brak specyficznych propsów wejściowych.
- **Propsy**: Brak.

### `HeroSection` (Server Component)

- **Opis komponentu**: Pierwsza, najbardziej widoczna sekcja strony. Ma za zadanie przyciągnąć uwagę użytkownika, przedstawić nazwę aplikacji i jej główną wartość/opis.
- **Główne elementy**:
  - `h1` lub podobny element na nazwę aplikacji.
  - Paragraf (`p`) na krótki, chwytliwy opis lub tagline.
  - Może zawierać grafikę lub tło związane z tematyką aplikacji.
- **Obsługiwane interakcje**: Brak.
- **Obsługiwana walidacja**: Brak.
- **Typy**: `HeroSectionProps`.
- **Propsy**:
  ```typescript
  interface HeroSectionProps {
    appName: string;
    tagline: string;
    description: string;
  }
  ```

### `FeaturesSection` (Server Component)

- **Opis komponentu**: Sekcja "Jak to działa", prezentująca kluczowe funkcjonalności aplikacji. Ma na celu pokazać użytkownikowi, jakie korzyści może odnieść z używania "Study Notes".
- **Główne elementy**:
  - Tytuł sekcji (np. `h2`: "Jak to działa?").
  - Lista lub siatka (`ul`/`div` z flex/grid) komponentów `FeatureItem`, gdzie każdy `FeatureItem` opisuje jedną funkcjonalność.
- **Obsługiwane interakcje**: Brak.
- **Obsługiwana walidacja**: Brak.
- **Typy**: `FeaturesSectionProps`, `FeatureItemProps`.
- **Propsy**:

  ```typescript
  interface FeatureItemProps {
    title: string;
    description: string;
    icon?: React.ReactNode; // Np. komponent ikony SVG
  }

  interface FeaturesSectionProps {
    title: string;
    features: FeatureItemProps[];
  }
  ```

### `CallToActionButton` (Server Component)

- **Opis komponentu**: Wyraźnie widoczny przycisk wzywający do działania, kierujący użytkownika do strony logowania/rejestracji.
- **Główne elementy**: Komponent `Link` z `next/link` ostylowany jako przycisk (np. przy użyciu klas Tailwind CSS i/lub komponentu `Button` z Shadcn UI).
- **Obsługiwane interakcje**: Kliknięcie - nawiguje do zdefiniowanej ścieżki.
- **Obsługiwana walidacja**: Brak.
- **Typy**: `CallToActionButtonProps`.
- **Propsy**:
  ```typescript
  interface CallToActionButtonProps {
    text: string; // Np. "Sprawdź sam"
    href: string; // Np. "/login" lub "/auth/login"
  }
  ```

### `Footer` (Server Component)

- **Opis komponentu**: Stopka strony, zawierająca informacje o prawach autorskich i ewentualnie inne linki (np. polityka prywatności, regulamin - choć nie wyszczególnione w `ui-plan`).
- **Główne elementy**: Element `footer` HTML z tekstem (`p` lub `small`) zawierającym informacje o prawach autorskich.
- **Obsługiwane interakcje**: Brak (chyba że dodane zostaną linki).
- **Obsługiwana walidacja**: Brak.
- **Typy**: `FooterProps`.
- **Propsy**:
  ```typescript
  interface FooterProps {
    copyrightText: string; // Np. "© 2024 Study Notes. Wszelkie prawa zastrzeżone."
  }
  ```

## 5. Typy

Opisane powyżej w sekcji "Szczegóły komponentów" (`HeroSectionProps`, `FeaturesSectionProps`, `FeatureItemProps`, `CallToActionButtonProps`, `FooterProps`). Nie przewiduje się potrzeby tworzenia dodatkowych, złożonych typów DTO czy ViewModeli, ponieważ strona ma charakter statyczny/informacyjny.

## 6. Zarządzanie stanem

Nie przewiduje się zarządzania stanem po stronie klienta dla tego widoku, ponieważ jest on w dużej mierze statyczny. Wszelkie dane (teksty, opisy funkcji) będą prawdopodobnie zakodowane bezpośrednio w komponentach serwerowych lub przekazywane jako propsy.

- Nie ma potrzeby użycia Zustand ani niestandardowych hooków do zarządzania stanem dla tej strony.

## 7. Integracja API

Brak bezpośredniej integracji z API dla zawartości strony głównej. Strona nie będzie pobierać dynamicznych danych z backendu do swojego renderowania.
Przycisk CTA będzie jedynie nawigował do strony logowania, co jest działaniem routingowym, a nie wywołaniem API z poziomu strony głównej.

## 8. Interakcje użytkownika

- **Przewijanie strony**: Użytkownik może przewijać stronę, aby zapoznać się z całą jej zawartością.
  - _Oczekiwany rezultat_: Płynne przewijanie, wszystkie sekcje są czytelne.
- **Kliknięcie przycisku CTA ("Sprawdź sam")**:
  - _Oczekiwany rezultat_: Użytkownik zostaje przekierowany na stronę logowania (zgodnie z `href` w `CallToActionButtonProps`).
- **Nawigacja za pomocą czytnika ekranu**:
  - _Oczekiwany rezultat_: Użytkownik może efektywnie nawigować po stronie, rozumiejąc strukturę i treść poszczególnych sekcji oraz mając dostęp do interaktywnych elementów (przycisk CTA).

## 9. Warunki i walidacja

- Ponieważ strona jest statyczna, nie ma warunków ani walidacji związanych z danymi wejściowymi od użytkownika czy odpowiedziami API na tej stronie.
- Walidacja na poziomie komponentów ogranicza się do poprawności przekazywanych propsów (zapewnianej przez TypeScript).

## 10. Obsługa błędów

- **Niezaładowane zasoby (np. obrazy, ikony)**: Jeśli ścieżki do zasobów są nieprawidłowe, nie zostaną one wyświetlone.
  - _Obsługa_: Należy zapewnić poprawne ścieżki oraz, w przypadku obrazów, tekst alternatywny (`alt`).
- **Niedziałający link CTA**: Jeśli ścieżka `href` w przycisku CTA jest nieprawidłowa.
  - _Obsługa_: Upewnić się, że link prowadzi do istniejącej, poprawnej strony logowania. W przypadku błędu, Next.js domyślnie wyświetli stronę 404.
- **Problemy z dostępnością**: Niewystarczający kontrast, brak semantyki HTML.
  - _Obsługa_: Stosowanie się do zasad WCAG, testowanie za pomocą narzędzi do badania dostępności i czytników ekranu.

## 11. Kroki implementacji

1.  **Utworzenie struktury plików i katalogów**:
    - Utworzenie pliku `app/page.tsx` dla `HomePage`.
    - Utworzenie katalogu `app/components/landing` (lub podobnego) na komponenty strony głównej: `HeroSection.tsx`, `FeaturesSection.tsx`, `CallToActionButton.tsx`, `Footer.tsx`.
2.  **Zdefiniowanie propsów (interfejsów TypeScript)** dla każdego komponentu zgodnie z sekcją "Szczegóły komponentów".
3.  **Implementacja komponentu `Footer`**:
    - Dodanie elementu `<footer>` z tekstem o prawach autorskich (prop `copyrightText`).
    - Stylizacja za pomocą Tailwind CSS.
4.  **Implementacja komponentu `CallToActionButton`**:
    - Użycie `next/link` do nawigacji.
    - Ostylowanie linku jako przycisk (np. z użyciem `Button` z Shadcn UI i/lub klas Tailwind).
    - Przyjęcie propsów `text` i `href`.
5.  **Implementacja komponentu `FeaturesSection` (i `FeatureItem`)**:
    - Przyjęcie propsów `title` i `features`.
    - Stworzenie layoutu dla listy/siatki funkcji (np. flexbox/grid w Tailwind CSS).
    - Implementacja `FeatureItem` (jeśli jest oddzielnym komponentem) przyjmującego `title`, `description`, `icon`.
    - Dodanie przykładowych danych dla funkcji (lub przygotowanie do ich dynamicznego ładowania, jeśli plan się zmieni).
    - Stylizacja.
6.  **Implementacja komponentu `HeroSection`**:
    - Dodanie elementów HTML na nazwę aplikacji, tagline i opis.
    - Przyjęcie propsów `appName`, `tagline`, `description`.
    - Stylizacja, potencjalnie dodanie tła lub grafiki.
7.  **Implementacja głównego komponentu `HomePage` (`app/page.tsx`)**:
    - Import i umieszczenie w odpowiedniej kolejności komponentów: `HeroSection`, `FeaturesSection`, `CallToActionButton`, `Footer`.
    - Przekazanie odpowiednich (prawdopodobnie statycznych/hardkodowanych na tym etapie) propsów do każdego z nich.
8.  **Dostarczenie treści**: Wypełnienie komponentów rzeczywistą treścią (nazwa aplikacji, opisy, funkcje, tekst CTA, tekst stopki).
9.  **Styling i responsywność (Mobile-First)**:
    - Zastosowanie klas Tailwind CSS do stylizacji wszystkich komponentów.
    - Zapewnienie responsywności na różnych szerokościach ekranu (mobile, tablet, desktop), stosując podejście mobile-first.
10. **Dostępność (a11y)**:
    - Użycie semantycznego HTML.
    - Zapewnienie odpowiedniego kontrastu kolorów.
    - Dodanie atrybutów ARIA, jeśli to konieczne.
    - Testowanie nawigacji klawiaturą i za pomocą czytnika ekranu.
11. **Testowanie manualne**:
    - Sprawdzenie wyglądu i działania na różnych przeglądarkach i urządzeniach.
    - Weryfikacja działania przycisku CTA.
    - Przejrzenie strony pod kątem błędów w treści i literówek.
12. **Refaktoryzacja i czyszczenie kodu**: Przegląd kodu pod kątem zgodności z "frontend-rules", czytelności i optymalizacji.
