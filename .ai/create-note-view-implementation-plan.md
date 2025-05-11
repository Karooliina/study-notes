# Plan implementacji widoku Tworzenia Notatki (/notes/create)

## 1. Przegląd

Widok "Tworzenie Notatki" umożliwia użytkownikom tworzenie nowych notatek na dwa sposoby: manualnie lub z pomocą sztucznej inteligencji (AI). Użytkownik może przełączać się między tymi trybami. Widok zawiera formularze dostosowane do wybranego trybu, walidację wprowadzanych danych, wskaźniki postępu oraz obsługę błędów. Po utworzeniu notatki użytkownik powinien otrzymać potwierdzenie, a notatka powinna zostać zapisana w systemie.

## 2. Routing widoku

Widok Tworzenia Notatki powinien być dostępny pod ścieżką `/notes/create`. Dostęp do tej ścieżki powinien być chroniony i wymagać zalogowanego użytkownika.

## 3. Struktura komponentów

```
/notes/create (Route - Client Component Page)
  └── CreateNotePage (Client Component - główny kontener)
      ├── PageHeader (Prezentacyjny)
      │   └── ButtonLink (do /dashboard)
      ├── ModeSwitcher (Client Component - shadcn/ui Switch)
      ├── CreateNoteForm (Client Component - zarządza logiką formularza)
      │   ├── TitleInput (Client Component - shadcn/ui Input)
      │   ├── AiModeFields (Client Component - widoczne gdy tryb AI)
      │   │   ├── SourceTextInput (Client Component - shadcn/ui Textarea + CharCounter)
      │   │   ├── GenerateButton (Client Component - shadcn/ui Button)
      │   │   ├── LoadingIndicator (Client Component - z rotującymi komunikatami)
      │   │   └── GeneratedNotePreview (Client Component - shadcn/ui Textarea + CharCounter)
      │   ├── ManualModeFields (Client Component - widoczne gdy tryb Manual)
      │   │   └── ManualContentInput (Client Component - shadcn/ui Textarea + CharCounter)
      │   └── FormActions (Client Component)
      │       ├── SaveButton (Client Component - shadcn/ui Button)
      │       └── CancelButton (Client Component - shadcn/ui Button, może czyścić formularz lub nawigować)
      └── ErrorDisplay (Client Component - do wyświetlania błędów API/walidacji)
```

## 4. Szczegóły komponentów

### `CreateNotePage` (Client Component - plik np. `app/notes/create/page.tsx`)

- **Opis komponentu**: Główny komponent strony, oznaczony jako `'use client'`. Zarządza ogólnym layoutem strony, stanem wyboru trybu (AI/Manual) oraz inicjalizuje i koordynuje komponent `CreateNoteForm`.
- **Główne elementy**: Renderuje `PageHeader`, `ModeSwitcher`, `CreateNoteForm` i `ErrorDisplay`.
- **Obsługiwane interakcje**: Brak bezpośrednich, deleguje do komponentów potomnych.
- **Obsługiwana walidacja**: Brak bezpośredniej.
- **Typy**: Brak specyficznych propsów.
- **Propsy**: Brak.

### `PageHeader` (Komponent Prezentacyjny)

- **Opis komponentu**: Wyświetla tytuł strony i link powrotny do Dashboardu.
- **Główne elementy**: `h1` z tytułem (np. "Stwórz nową notatkę"), `ButtonLink`.
- **Propsy**:
  ```typescript
  interface PageHeaderProps {
    title: string;
    dashboardPath: string;
  }
  ```

### `ModeSwitcher` (Client Component)

- **Opis komponentu**: Pozwala użytkownikowi wybrać tryb tworzenia notatki: AI lub Manualny.
- **Główne elementy**: Komponent `Switch` z biblioteki Shadcn UI. Etykiety dla trybów.
- **Obsługiwane interakcje**: Zmiana stanu przełącznika.
- **Typy**:
  - `mode: 'AI' | 'Manual'`
- **Propsy**:
  ```typescript
  interface ModeSwitcherProps {
    currentMode: "AI" | "Manual";
    onModeChange: (newMode: "AI" | "Manual") => void;
  }
  ```

### `CreateNoteForm` (Client Component)

- **Opis komponentu**: Sercem widoku, zarządza stanem formularza, walidacją, wywołaniami akcji serwerowych (`generateNoteAction`, `createNoteAction`) i wyświetlaniem odpowiednich pól w zależności od trybu.
- **Główne elementy**: `TitleInput`, `AiModeFields`, `ManualModeFields`, `FormActions`.
- **Obsługiwane interakcje**: Wprowadzanie danych, kliknięcie "Generuj", "Zapisz", "Anuluj".
- **Obsługiwana walidacja**: Tytuł (wymagany, max 50 znaków), Tekst źródłowy (max 25000 znaków / ~5000 słów), Treść notatki (wymagana, max 1000 znaków).
- **Typy**: Wykorzystuje `CreateNoteFormViewModel` (opisany w sekcji 6).
- **Propsy**:
  ```typescript
  interface CreateNoteFormProps {
    mode: "AI" | "Manual";
  }
  ```

### `TitleInput` (Client Component)

- **Opis komponentu**: Pole do wprowadzania tytułu notatki.
- **Główne elementy**: `Label`, `Input` z Shadcn UI, opcjonalnie licznik znaków.
- **Obsługiwane interakcje**: Wprowadzanie tekstu.
- **Propsy**:
  ```typescript
  interface TitleInputProps {
    value: string;
    onChange: (value: string) => void;
    maxLength: number;
    disabled?: boolean;
    error?: string;
  }
  ```

### `AiModeFields` (Client Component)

- **Opis komponentu**: Kontener na pola specyficzne dla trybu AI.
- **Główne elementy**: `SourceTextInput`, `GenerateButton`, `LoadingIndicator`, `GeneratedNotePreview`.

### `SourceTextInput` (Client Component)

- **Opis komponentu**: Pole `Textarea` do wprowadzania tekstu źródłowego dla AI. Powinno mieć automatyczne dopasowanie wysokości (do max 400px) oraz licznik słów/znaków.
- **Główne elementy**: `Label`, `Textarea` (Shadcn UI), `WordCounter`.
- **Propsy**:
  ```typescript
  interface SourceTextInputProps {
    value: string;
    onChange: (value: string) => void;
    maxLengthChars: number; // ValidationRules.notes.sourceText.maxLength
    maxWordsEstimate: number; // np. 5000
    disabled?: boolean;
    error?: string;
  }
  ```

### `CharCounter` (Komponent Prezentacyjny lub Kliencki)

- **Opis komponentu**: Wyświetla liczbę wprowadzonych znaków w stosunku do maksymalnej dozwolonej liczby.
- **Główne elementy**: Tekst, np. "Znaki: 1234 / 25000". Kolor może się zmieniać po przekroczeniu limitu.

### `GenerateButton` (Client Component)

- **Opis komponentu**: Przycisk uruchamiający generowanie notatki przez AI.
- **Główne elementy**: `Button` (Shadcn UI).
- **Propsy**:
  ```typescript
  interface GenerateButtonProps {
    onClick: () => void;
    disabled?: boolean;
    isLoading?: boolean;
  }
  ```

### `LoadingIndicator` (Client Component)

- **Opis komponentu**: Wyświetlany podczas generowania notatki przez AI. Może pokazywać rotujące komunikaty.
- **Główne elementy**: Ikona ładowania (spinner), tekst z komunikatem (np. "Analizuję tekst...", "Generuję konspekt...", "Tworzę podsumowanie...").

### `GeneratedNotePreview` (Client Component)

- **Opis komponentu**: Pole `Textarea` (lub podobny edytowalny komponent) do wyświetlania i edycji notatki wygenerowanej przez AI. Zawiera licznik znaków.
- **Główne elementy**: `Label`, `Textarea` (Shadcn UI), `CharCounter` (do 1000 znaków).
- **Propsy**:
  ```typescript
  interface GeneratedNotePreviewProps {
    value: string;
    onChange: (value: string) => void;
    maxLength: number; // ValidationRules.notes.content.maxLength
    disabled?: boolean;
    error?: string;
  }
  ```

### `ManualModeFields` (Client Component)

- **Opis komponentu**: Kontener na pola specyficzne dla trybu manualnego.
- **Główne elementy**: `ManualContentInput`.

### `ManualContentInput` (Client Component)

- **Opis komponentu**: Pole `Textarea` do manualnego wprowadzania treści notatki. Zawiera licznik znaków.
- **Główne elementy**: `Label`, `Textarea` (Shadcn UI), `CharCounter` (do 1000 znaków).
- **Propsy**:
  ```typescript
  interface ManualContentInputProps {
    value: string;
    onChange: (value: string) => void;
    maxLength: number; // ValidationRules.notes.content.maxLength
    disabled?: boolean;
    error?: string;
  }
  ```

### `FormActions` (Client Component)

- **Opis komponentu**: Zawiera przyciski "Zapisz" i "Anuluj".
- **Główne elementy**: `SaveButton`, `CancelButton`.

### `SaveButton`, `CancelButton` (Client Components)

- **Opis komponentu**: Standardowe przyciski akcji.
- **Główne elementy**: `Button` (Shadcn UI).
- **Propsy**: Standardowe propsy przycisku (`onClick`, `disabled`, `isLoading` dla Zapisz).

### `ErrorDisplay` (Client Component)

- **Opis komponentu**: Wyświetla komunikaty o błędach (walidacji formularza, błędach API).
- **Główne elementy**: Komponent `Alert` z Shadcn UI lub podobny.

## 5. Typy

### `CreateNoteDto` (zdefiniowany w `app/types.ts`)

Używany jako payload dla akcji `createNoteAction`.

```typescript
export type CreateNoteDto = Pick<
  Database["public"]["Tables"]["notes"]["Insert"],
  "title" | "content" | "source" | "source_text"
>;
```

### `NoteDto` (zdefiniowany w `app/types.ts`)

Reprezentuje odpowiedź z `createNoteAction`.

```typescript
export type NoteDto = Omit<
  Database["public"]["Tables"]["notes"]["Row"],
  "user_id"
>;
```

### `GenerateNoteRequestDto` (zdefiniowany w `app/types.ts`)

Używany jako payload dla akcji `generateNoteAction`.

```typescript
export interface GenerateNoteRequestDto {
  source_text: string;
}
```

### `GenerateNoteResponseDto` (zdefiniowany w `app/types.ts`)

Reprezentuje odpowiedź z `generateNoteAction`.

```typescript
export interface GenerateNoteResponseDto {
  content: string;
}
```

### `ValidationRules` (zdefiniowany w `app/types.ts`)

Definiuje limity dla pól.

- `notes.title.maxLength: 50`
- `notes.content.maxLength: 1000`
- `notes.sourceText.maxLength: 25000` (ok. 5000 słów)

## 6. Zarządzanie stanem

Stan formularza będzie zarządzany w komponencie `CreateNoteForm` lub dedykowanym hooku `useCreateNoteForm`.

### `CreateNoteFormViewModel` (stan wewnętrzny `CreateNoteForm` lub hooka)

```typescript
interface CreateNoteFormState {
  mode: "AI" | "Manual";
  title: string;
  sourceText: string; // Dla trybu AI
  generatedContent: string; // Dla trybu AI, po wygenerowaniu
  manualContent: string; // Dla trybu Manual

  isGeneratingAiNote: boolean;
  aiGenerationError: string | null;
  isSavingNote: boolean;
  saveNoteError: string | null;

  // Stany walidacji dla poszczególnych pól
  titleError: string | null;
  sourceTextError: string | null;
  contentError: string | null; // Wspólny dla generatedContent i manualContent
}
```

- **Niestandardowy Hook (`useCreateNoteForm`)**: Zalecany do enkapsulacji logiki.
  - Odpowiedzialny za inicjalizację stanu, aktualizację pól, walidację, wywoływanie akcji serwerowych (`generateNoteAction`, `createNoteAction`) i obsługę ich odpowiedzi (sukces/błąd).
  - Funkcje udostępniane przez hooka: `handleTitleChange`, `handleSourceTextChange`, `handleGeneratedContentChange`, `handleManualContentChange`, `handleGenerateAiNote`, `handleSaveNote`, `handleCancel`, `setMode`.

## 7. Integracja API

### Generowanie notatki przez AI

- **Akcja serwerowa**: `generateNoteAction(formData: GenerateNoteRequestDto)`
- **Lokalizacja wywołania**: W `useCreateNoteForm` / `CreateNoteForm` po kliknięciu "Generuj".
- **Żądanie**: `GenerateNoteRequestDto { source_text: string }`
- **Odpowiedź (sukces)**: `GenerateNoteResponseDto { content: string }`
- **Odpowiedź (błąd)**: `{ error: string | ZodError['errors'], status: number }`

### Zapisywanie notatki

- **Akcja serwerowa**: `createNoteAction(formData: CreateNoteDto)`
- **Lokalizacja wywołania**: W `useCreateNoteForm` / `CreateNoteForm` po kliknięciu "Zapisz".
- **Żądanie**: `CreateNoteDto` (zawartość zależy od trybu):
  - Tryb AI: `{ title, content: generatedContent, source: 'AI', source_text: sourceText }`
  - Tryb Manual: `{ title, content: manualContent, source: 'Manual', source_text: null }`
- **Odpowiedź (sukces)**: `{ data: NoteDto, status: 201 }`
- **Odpowiedź (błąd)**: `{ error: string | ZodError['errors'], status: number }`

## 8. Interakcje użytkownika

- **Zmiana trybu (AI/Manual)**: Zmienia widoczne pola formularza.
- **Wpisywanie w `SourceTextInput`**: Licznik słów/znaków aktualizuje się. Przycisk "Generuj" jest aktywny tylko jeśli tekst źródłowy jest poprawny.
- **Kliknięcie "Generuj"**: Pokazuje `LoadingIndicator`. Po zakończeniu (sukces/błąd) `LoadingIndicator` znika, `GeneratedNotePreview` jest wypełniany lub pojawia się błąd.
- **Wpisywanie w `TitleInput`, `GeneratedNotePreview`, `ManualContentInput`**: Stan formularza jest aktualizowany, liczniki znaków działają.
- **Kliknięcie "Zapisz"**: Wywołanie `createNoteAction`. Wskaźnik ładowania na przycisku. Po sukcesie, przekierowanie na dashboard lub komunikat. W razie błędu, komunikat.
- **Kliknięcie "Anuluj"**: Czyści formularz i/lub przekierowuje (do ustalenia, UI plan nie specyfikuje, ale `ButtonLink "Dashboard"` jest osobno).
- **Kliknięcie `ButtonLink "Dashboard"`**: Przekierowanie na `/dashboard`.

## 9. Warunki i walidacja

- **Dostęp do widoku**: Wymaga zalogowanego użytkownika (obsługa przez middleware/layout).
- **Walidacja `SourceTextInput` (tryb AI)**:
  - Wymagany do generowania.
  - Max 25000 znaków (`ValidationRules.notes.sourceText.maxLength`). Komunikat i blokada generowania przy przekroczeniu.
  - US-012: Wizualne oznaczenie przekroczenia limitu, zapobieganie wysłaniu.
- **Walidacja `TitleInput`**:
  - Wymagany do zapisu.
  - Max 50 znaków (`ValidationRules.notes.title.maxLength`). Komunikat przy przekroczeniu.
- **Walidacja `GeneratedNotePreview` / `ManualContentInput` (treść notatki)**:
  - Wymagana do zapisu.
  - Max 1000 znaków (`ValidationRules.notes.content.maxLength`). Komunikat przy przekroczeniu.
- Przycisk "Zapisz" aktywny tylko, gdy formularz jest poprawny dla danego trybu.
- Przycisk "Generuj" aktywny tylko, gdy `sourceText` jest poprawny.

## 10. Obsługa błędów

- **Błędy walidacji formularza**: Komunikaty wyświetlane bezpośrednio przy odpowiednich polach lub w globalnym `ErrorDisplay`.
- **`generateNoteAction` errors**:
  - 400 (np. tekst źródłowy za długi/pusty): Komunikat dla użytkownika.
  - 401 (Unauthorized): Globalna obsługa (np. przekierowanie do logowania).
  - 422 (AI processing error): Komunikat typu "Nie udało się przetworzyć tekstu przez AI. Spróbuj ponownie lub zmień tekst źródłowy." (US-011)
  - 500 (Internal Server Error): Ogólny komunikat "Wystąpił błąd serwera podczas generowania notatki." (US-011)
- **`createNoteAction` errors**:
  - 400 (Błędy walidacji Zod): Komunikaty przy polach.
  - 401 (Unauthorized): Globalna obsługa.
  - 500 (Internal Server Error): Ogólny komunikat "Wystąpił błąd serwera podczas zapisywania notatki."
- **US-011**: W przypadku problemów z połączeniem, system powinien sugerować ponowną próbę (można to zrealizować przez pozwolenie na ponowne kliknięcie przycisku po błędzie).

## 11. Kroki implementacji

1.  **Struktura plików**: Utworzenie `app/notes/create/page.tsx` oraz katalogu na komponenty potomne (np. `app/notes/create/components/`).
2.  **Definicja typów i stanu**: Zdefiniowanie `CreateNoteFormState` i interfejsów propsów dla komponentów.
3.  **Implementacja `CreateNotePage`**: Podstawowy layout, inicjalizacja stanu trybu.
4.  **Implementacja `ModeSwitcher`**: Logika zmiany trybu.
5.  **Implementacja `CreateNoteForm` (lub hooka `useCreateNoteForm`)**: Główna logika formularza, obsługa stanu, walidacji i wywołań akcji.
6.  **Implementacja komponentów pól formularza**: `TitleInput`, `SourceTextInput` (z `WordCounter`), `GeneratedNotePreview` (z `CharCounter`), `ManualContentInput` (z `CharCounter`). Zapewnienie auto-resize dla `TextArea`.
7.  **Implementacja `GenerateButton`, `LoadingIndicator`**: Logika związana z generowaniem AI.
8.  **Implementacja `FormActions` (`SaveButton`, `CancelButton`)**.
9.  **Implementacja `PageHeader` i `ButtonLink`**.
10. **Integracja z akcjami serwerowymi**: Podłączenie wywołań `generateNoteAction` i `createNoteAction`.
11. **Obsługa błędów**: Wyświetlanie komunikatów o błędach walidacji i błędach z API.
12. **Walidacja front-end**: Implementacja logiki walidacyjnej zgodnie z `ValidationRules` i user stories (US-012).
13. **Styling i responsywność**: Użycie Tailwind CSS i komponentów Shadcn UI, zapewnienie responsywności (mobile-first).
14. **Dostępność (a11y)**: Semantyczny HTML, ARIA (jeśli potrzebne), kontrast, nawigacja klawiaturą.
15. **Testowanie manualne**: Przetestowanie wszystkich user stories (US-005, US-006, US-007, US-011, US-012), przepływów, walidacji i obsługi błędów.
16. **Refaktoryzacja**: Przegląd kodu, zgodność z "frontend-rules".

```

```
