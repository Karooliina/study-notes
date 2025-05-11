# Plan implementacji widoku Szczegółów i Edycji Notatki (/notes/[id])

## 1. Przegląd

Widok ten łączy w sobie dwie funkcjonalności: wyświetlanie szczegółów istniejącej notatki oraz jej edycję. Domyślnie, po wejściu na ścieżkę `/notes/[id]`, użytkownik widzi szczegóły notatki. Przejście do trybu edycji odbywa się poprzez parametr w URL (`?editMode=true`) lub kliknięcie przycisku "Edytuj". Widok musi być responsywny, zapewniać czytelną prezentację treści, obsługiwać walidację i błędy, a także umożliwiać bezpieczne usuwanie notatek z potwierdzeniem.

## 2. Routing widoku

- **Szczegóły Notatki**: Dostępne pod dynamiczną ścieżką `/notes/[id]`, gdzie `[id]` to identyfikator notatki.
- **Edycja Notatki**: Dostępna pod tą samą ścieżką `/notes/[id]` z dodatkowym parametrem zapytania `?editMode=true`.
- Dostęp do obu widoków powinien być chroniony i wymagać zalogowanego użytkownika oraz weryfikacji, czy notatka należy do użytkownika.

## 3. Struktura komponentów

```
/notes/[id] (Route - Dynamiczna strona)
  └── NoteDetailPage (Server Component - główny kontener)
      ├── PageHeader (Prezentacyjny)
      │   └── ButtonLink (do /dashboard)
      ├── ViewModeContent (Client Component - widoczny gdy nie ma `editMode=true`)
      │   ├── NoteTitleDisplay (Prezentacyjny)
      │   ├── NoteMetadata (Prezentacyjny - data utworzenia, źródło)
      │   │   └── Badge (shadcn/ui - dla źródła)
      │   ├── NoteContentDisplay (Prezentacyjny - sformatowana treść)
      │   ├── SourceTextCollapsible (Client Component - shadcn/ui Collapsible, tylko dla notatek AI)
      │   │   └── SourceTextDisplay (Prezentacyjny)
      │   ├── ViewModeActions (Client Component)
      │   │   ├── EditButton (Client Component - shadcn/ui Button, nawiguje do ?editMode=true)
      │   │   └── DeleteButton (Client Component - shadcn/ui Button, otwiera AlertDialog)
      │   └── DeleteConfirmationDialog (Client Component - shadcn/ui AlertDialog)
      ├── EditModeForm (Client Component - widoczny gdy `editMode=true`)
      │   ├── TitleInput (Client Component - shadcn/ui Input)
      │   ├── ContentTextarea (Client Component - shadcn/ui Textarea + CharCounter)
      │   └── EditModeActions (Client Component)
      │       ├── SaveButton (Client Component - shadcn/ui Button)
      │       └── CancelButton (Client Component - shadcn/ui Button, nawiguje do widoku bez `editMode`)
      └── ErrorDisplay (Client Component - do wyświetlania błędów API/walidacji)
      └── ToastContainer (dla potwierdzeń akcji, np. z `sonner`)
```

## 4. Szczegóły komponentów

### `NoteDetailPage` (Client Component - plik np. `app/notes/[id]/page.tsx`)

- **Opis komponentu**: Główny komponent strony, oznaczony jako `'use server'`. Odpowiedzialny za pobranie danych notatki na podstawie `id` z server action, zarządzanie trybem (widok/edycja) na podstawie parametru `editMode` z url params, oraz koordynację komponentów podrzędnych.
- **Główne elementy**: `PageHeader`, `ViewModeContent`, `EditModeForm`, `ErrorDisplay`, `ToastContainer`.
- **Obsługiwane interakcje**: Przełączanie między trybem widoku a edycji na podstawie url param.
- **Propsy**: Pobiera `id` z parametrów ścieżki i `editMode` z parametrów zapytania.

### `PageHeader` (Komponent Prezentacyjny)

- **Opis komponentu**: Taki sam jak w widoku tworzenia notatki. Wyświetla tytuł i link powrotny.

### `ViewModeContent` (Client Component)

- **Opis komponentu**: Wyświetla szczegóły notatki w trybie tylko do odczytu.
- **Główne elementy**: `NoteTitleDisplay`, `NoteMetadata`, `NoteContentDisplay`, `SourceTextCollapsible` (warunkowo), `ViewModeActions`.
- **Propsy**:
  ```typescript
  interface ViewModeContentProps {
    note: NoteDto; // Pełne dane notatki
    onEdit: () => void;
    onDelete: () => void;
  }
  ```

### `NoteTitleDisplay`, `NoteMetadata`, `NoteContentDisplay`, `SourceTextDisplay` (Komponenty Prezentacyjne)

- **Opis komponentu**: Odpowiedzialne za estetyczne wyświetlanie poszczególnych części notatki.
- `NoteMetadata` użyje `Badge` z Shadcn do oznaczenia źródła.

### `SourceTextCollapsible` (Client Component)

- **Opis komponentu**: Używa `Collapsible` z Shadcn UI do pokazania/ukrycia tekstu źródłowego dla notatek AI.
- **Propsy**: `sourceText: string | null`.

### `ViewModeActions` (Client Component)

- **Opis komponentu**: Zawiera przyciski "Edytuj" i "Usuń".
- **Główne elementy**: `EditButton`, `DeleteButton`.

### `EditButton` (Client Component)

- **Opis komponentu**: Przycisk przełączający do trybu edycji (dodaje `?editMode=true` do URL).
- **Główne elementy**: `Button` (Shadcn UI).

### `DeleteButton` (Client Component)

- **Opis komponentu**: Przycisk inicjujący proces usuwania notatki (otwiera `DeleteConfirmationDialog`).
- **Główne elementy**: `Button` (Shadcn UI, wariant `destructive`).

### `DeleteConfirmationDialog` (Client Component)

- **Opis komponentu**: Dialog (Shadcn UI `AlertDialog`) z prośbą o potwierdzenie usunięcia notatki.
- **Obsługiwane interakcje**: Potwierdzenie (wywołuje akcję usunięcia), Anulowanie.
- **Propsy**:
  ```typescript
  interface DeleteConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
  }
  ```

### `EditModeForm` (Client Component)

- **Opis komponentu**: Formularz do edycji tytułu i treści notatki.
- **Główne elementy**: `TitleInput`, `ContentTextarea`, `EditModeActions`.
- **Obsługiwana walidacja**: Tytuł (max 50 znaków), Treść (max 1000 znaków).
- **Propsy**:
  ```typescript
  interface EditModeFormProps {
    initialData: Pick<NoteDto, "title" | "content">;
    onSubmit: (data: UpdateNoteDto) => void;
    onCancel: () => void;
    isSaving: boolean;
    error?: string | ZodError["errors"] | null;
  }
  ```

### `TitleInput` (Client Component)

- Taki sam jak w widoku tworzenia notatki, ale inicjalizowany wartością z `initialData`.

### `ContentTextarea` (Client Component)

- **Opis komponentu**: Pole `Textarea` do edycji treści notatki, z licznikiem znaków.
- **Główne elementy**: `Label`, `Textarea` (Shadcn UI), `CharCounter`.
- **Propsy**: Podobne do `ManualContentInput` z widoku tworzenia.

### `EditModeActions` (Client Component)

- **Opis komponentu**: Zawiera przyciski "Zapisz" i "Anuluj" dla trybu edycji.
- **Główne elementy**: `SaveButton`, `CancelButton`.

### `ErrorDisplay` (Client Component)

- Taki sam jak w widoku tworzenia notatki.

### `ToastContainer` (Client Component)

- Kontener na powiadomienia toast (np. z biblioteki `sonner`) do potwierdzania akcji (zapis, usunięcie).

## 5. Typy

### `NoteDto` (zdefiniowany w `app/types.ts`)

Reprezentuje pełne dane notatki, używane do wyświetlania szczegółów i inicjalizacji formularza edycji.

```typescript
export type NoteDto = Omit<
  Database["public"]["Tables"]["notes"]["Row"],
  "user_id"
>;
```

### `UpdateNoteDto` (zdefiniowany w `app/types.ts`)

Payload dla akcji `updateNoteAction`.

```typescript
export type UpdateNoteDto = Pick<
  Database["public"]["Tables"]["notes"]["Update"],
  "title" | "content"
>;
```

### `ValidationRules` (zdefiniowany w `app/types.ts`)

- `notes.title.maxLength: 50`
- `notes.content.maxLength: 1000`

## 6. Zarządzanie stanem

Stan będzie zarządzany w głównym komponencie `NoteDetailPage` lub dedykowanych hookach.

### `NoteDetailState` (stan wewnętrzny `NoteDetailPage` lub hooka)

```typescript
interface NoteDetailState {
  noteData: NoteDto | null; // Załadowane dane notatki
  isLoadingNote: boolean;
  loadNoteError: string | null;

  isEditMode: boolean; // Na podstawie ?editMode=true

  // Stan dla formularza edycji (jeśli nie ma dedykowanego hooka do formularza)
  editableTitle: string;
  editableContent: string;
  isSaving: boolean;
  saveError: string | ZodError["errors"] | null;
  titleEditError: string | null;
  contentEditError: string | null;

  // Stan dla dialogu usuwania
  isDeleteDialogOpen: boolean;
  isDeleting: boolean;
  deleteError: string | null;
}
```

- **Niestandardowe Hooki**:
  - `useNoteData(noteId: string)`: Do pobierania danych notatki (`getNoteAction`).
  - `useEditNoteForm(initialData: Pick<NoteDto, 'title' | 'content'>)`: Do zarządzania stanem i walidacją formularza edycji (opcjonalnie, logika może być w `NoteDetailPage`).

## 7. Integracja API

### Pobieranie szczegółów notatki

- **Akcja serwerowa**: `getNoteAction(noteId: string)`
- **Lokalizacja wywołania**: W `NoteDetailPage` (lub hooku `useNoteData`) przy montowaniu komponentu.
- **Żądanie**: `noteId` jako parametr.
- **Odpowiedź (sukces)**: `{ data: NoteDto, status: 200 }`
- **Odpowiedź (błąd)**: `{ error: string, status: number }` (np. 404 Not Found, 401 Unauthorized, 403 Forbidden).

### Aktualizacja notatki

- **Akcja serwerowa**: `updateNoteAction(noteId: string, formData: UpdateNoteDto)`
- **Lokalizacja wywołania**: W `NoteDetailPage` (lub hooku `useEditNoteForm`) po kliknięciu "Zapisz" w trybie edycji.
- **Żądanie**: `noteId` i `UpdateNoteDto { title, content }`.
- **Odpowiedź (sukces)**: `{ data: NoteDto, status: 200 }`.
- **Odpowiedź (błąd)**: `{ error: string | ZodError['errors'], status: number }` (np. 400, 401, 403, 404, 500).

### Usuwanie notatki

- **Akcja serwerowa**: `deleteNoteAction(noteId: string)`
- **Lokalizacja wywołania**: W `NoteDetailPage` po potwierdzeniu w `DeleteConfirmationDialog`.
- **Żądanie**: `noteId` jako parametr.
- **Odpowiedź (sukces)**: `{ status: 204 }`.
- **Odpowiedź (błąd)**: `{ error: string, status: number }` (np. 401, 403, 404, 500).

## 8. Interakcje użytkownika

- **Wejście na `/notes/[id]`**: Pobierane są dane notatki; wyświetlany jest `ViewModeContent`. Komunikat błędu jeśli notatka nie istnieje lub brak dostępu.
- **Kliknięcie "Edytuj" (`EditButton`)**: URL zmienia się na `?editMode=true`; `ViewModeContent` jest ukrywany, a `EditModeForm` jest wyświetlany z danymi notatki.
- **Wpisywanie w `TitleInput` / `ContentTextarea` (tryb edycji)**: Stan formularza jest aktualizowany, liczniki znaków działają.
- **Kliknięcie "Zapisz" (`SaveButton` w trybie edycji)**: Wywołanie `updateNoteAction`. Wskaźnik ładowania. Po sukcesie: toast potwierdzający, powrót do trybu widoku (URL bez `?editMode=true`), zaktualizowane dane. W razie błędu: toast, komunikat błędu.
- **Kliknięcie "Anuluj" (`CancelButton` w trybie edycji)**: Porzucenie zmian, powrót do trybu widoku (URL bez `?editMode=true`).
- **Kliknięcie "Usuń" (`DeleteButton`)**: Otwiera `DeleteConfirmationDialog`.
- **Potwierdzenie w `DeleteConfirmationDialog`**: Wywołanie `deleteNoteAction`. Wskaźnik ładowania. Po sukcesie: toast potwierdzający, przekierowanie na `/dashboard`. W razie błędu: toast, komunikat błędu.
- **Anulowanie w `DeleteConfirmationDialog`**: Zamyka dialog.
- **Rozwijanie/Zwijanie `SourceTextCollapsible`**: Pokazuje/ukrywa tekst źródłowy.

## 9. Warunki i walidacja

- **Dostęp do widoku**: Wymaga zalogowanego użytkownika. Akcje serwerowe weryfikują, czy notatka należy do użytkownika (zwracają 403 Forbidden lub 404 Not Found).
- **Walidacja formularza edycji (`EditModeForm`)**:
  - `TitleInput`: Max 50 znaków (`ValidationRules.notes.title.maxLength`).
  - `ContentTextarea`: Wymagany, max 1000 znaków (`ValidationRules.notes.content.maxLength`).
  - Komunikaty o błędach walidacji wyświetlane przy polach lub w `ErrorDisplay`.
- Przycisk "Zapisz" w trybie edycji aktywny tylko, gdy formularz jest poprawny i dane się zmieniły.

## 10. Obsługa błędów

- **`getNoteAction` errors**:
  - 401/403/404: Wyświetlenie odpowiedniego komunikatu w `ErrorDisplay` (np. "Nie znaleziono notatki" lub "Brak dostępu"), brak możliwości edycji/usuwania.
  - 500: Ogólny błąd serwera.
- **`updateNoteAction` errors**:
  - 400 (Błędy walidacji Zod): Wyświetlenie przy polach / w `ErrorDisplay`.
  - 401/403/404/500: Wyświetlenie komunikatu w `ErrorDisplay` lub jako toast.
- **`deleteNoteAction` errors**:
  - 401/403/404/500: Wyświetlenie komunikatu w `ErrorDisplay` lub jako toast.
- **Animacje przejść z `framer-motion`**: Należy zadbać o płynność i fallbacki, jeśli animacje są kluczowe dla UX.
- **Potwierdzenia Toast**: Wykorzystanie `sonner` lub podobnej biblioteki do informowania o sukcesie operacji (zapis, usunięcie).

## 11. Kroki implementacji

1.  **Struktura plików**: Utworzenie `app/notes/[id]/page.tsx` i komponentów potomnych.
2.  **Definicja typów i stanu**: `NoteDetailState` i interfejsy propsów.
3.  **Implementacja `NoteDetailPage`**: Logika pobierania danych notatki (`getNoteAction`), zarządzanie trybem `editMode` na podstawie parametru URL.
4.  **Implementacja `ViewModeContent`**: Wyświetlanie danych notatki, w tym `NoteTitleDisplay`, `NoteMetadata`, `NoteContentDisplay`.
5.  **Implementacja `SourceTextCollapsible`**: Dla notatek AI.
6.  **Implementacja `ViewModeActions`**: Przyciski `EditButton` (nawigacja) i `DeleteButton`.
7.  **Implementacja `DeleteConfirmationDialog`**: Logika dialogu potwierdzającego usunięcie.
8.  **Implementacja `EditModeForm`**: Formularz edycji z `TitleInput`, `ContentTextarea` i `EditModeActions` (`SaveButton`, `CancelButton`).
9.  **Integracja z akcjami serwerowymi**: Podłączenie `getNoteAction`, `updateNoteAction`, `deleteNoteAction`.
10. **Walidacja front-end dla formularza edycji**.
11. **Obsługa błędów**: Wyświetlanie komunikatów (globalnie w `ErrorDisplay` i/lub przy polach).
12. **Implementacja powiadomień Toast** (np. `sonner`) dla potwierdzeń.
13. **Animacje przejść** (jeśli `framer-motion` ma być użyty).
14. **Styling i responsywność**: Użycie Tailwind CSS, komponentów Shadcn UI. Zapewnienie pełnoekranowego widoku notatki na mobile.
15. **Dostępność (a11y)**.
16. **Testowanie manualne**: Wszystkie user stories (US-008, US-009, US-010), tryby, walidacje, błędy, potwierdzenia, responsywność.
17. **Refaktoryzacja**.
