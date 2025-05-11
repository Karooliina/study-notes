# API Endpoint Implementation Plan: Create Note

## 1. Przegląd punktu końcowego

Endpoint `POST /notes` umożliwia utworzenie nowej notatki przez zalogowanego użytkownika. Notatka może być stworzona manualnie przez użytkownika lub wygenerowana przez AI. Endpoint wymaga autentykacji, a nowa notatka jest automatycznie przypisywana do zalogowanego użytkownika.

## 2. Szczegóły żądania

- Metoda HTTP: `POST`
- Struktura URL: `/notes`
- Nagłówki:
  - `Authorization`: Bearer {access_token} (wymagany)
  - `Content-Type`: application/json (wymagany)
- Request Body:
  ```json
  {
    "title": "Note Title",
    "content": "Note content text",
    "source_text": "Original source text (only for AI notes)",
    "source": "AI|Manual"
  }
  ```

## 3. Wykorzystywane typy

```typescript
// Typy już zdefiniowane w app/types.ts
import { NoteDto, CreateNoteDto, ValidationRules } from "@/app/types";

// Schema walidacji dla body żądania
import { z } from "zod";

// Schema dla body żądania
export const CreateNoteSchema = z.object({
  title: z
    .string()
    .min(1, "Tytuł jest wymagany")
    .max(
      ValidationRules.notes.title.maxLength,
      `Tytuł nie może przekraczać ${ValidationRules.notes.title.maxLength} znaków`
    ),
  content: z
    .string()
    .min(1, "Treść notatki jest wymagana")
    .max(
      ValidationRules.notes.content.maxLength,
      `Treść notatki nie może przekraczać ${ValidationRules.notes.content.maxLength} znaków`
    ),
  source_text: z
    .string()
    .max(
      ValidationRules.notes.sourceText.maxLength,
      `Tekst źródłowy nie może przekraczać ${ValidationRules.notes.sourceText.maxLength} znaków`
    )
    .optional()
    .nullable(),
  source: z.enum(["AI", "Manual"]),
});

export type CreateNoteRequest = z.infer<typeof CreateNoteSchema>;
```

## 4. Szczegóły odpowiedzi

- Format odpowiedzi:
  ```json
  {
    "id": "uuid",
    "title": "Note Title",
    "content": "Note content text",
    "source_text": "Original source text (only for AI notes)",
    "source": "AI|Manual",
    "created_at": "2023-05-10T14:30:00Z",
    "updated_at": "2023-05-10T14:30:00Z"
  }
  ```
- Kody statusu:
  - 201 Created: Pomyślne utworzenie notatki
  - 400 Bad Request: Nieprawidłowe dane wejściowe (błędy walidacji)
  - 401 Unauthorized: Brak autoryzacji użytkownika

## 5. Przepływ danych

1. Walidacja danych wejściowych za pomocą Zod
2. Pobranie identyfikatora zalogowanego użytkownika za pomocą Supabase Auth
3. Dodanie nowej notatki do bazy danych Supabase
4. Transformacja danych do formatu odpowiedzi API
5. Zwrócenie odpowiedzi z kodem statusu 201 Created

## 6. Względy bezpieczeństwa

- **Autentykacja**: Weryfikacja tokenu JWT przez middleware Supabase
- **Walidacja danych wejściowych**: Wszystkie pola są walidowane za pomocą Zod pod kątem prawidłowych typów i wartości, zgodnie z ograniczeniami w bazie danych
- **Sanityzacja danych wyjściowych**: Dane są przekształcane do bezpiecznego formatu przed zwróceniem
- **Ograniczenia długości**: Tytuł i treść mają ograniczenia długości zgodne z bazą danych
- **Zapobieganie atakom XSS**: Tekst wprowadzany przez użytkownika powinien być odpowiednio kodowany przy wyświetlaniu (po stronie frontendu)

## 7. Obsługa błędów

- **Nieprawidłowe dane wejściowe**:
  - Kod statusu: 400 Bad Request
  - Przykłady błędów walidacji:
    - "Tytuł jest wymagany"
    - "Tytuł nie może przekraczać 50 znaków"
    - "Treść notatki jest wymagana"
    - "Treść notatki nie może przekraczać 1000 znaków"
    - "Tekst źródłowy nie może przekraczać 25000 znaków"
    - "Nieprawidłowe źródło. Dozwolone wartości: AI, Manual"
- **Brak autoryzacji**:
  - Kod statusu: 401 Unauthorized
  - Przykład komunikatu: "Authentication required to create notes."
- **Błąd bazy danych**:
  - Kod statusu: 500 Internal Server Error
  - Logowanie błędu po stronie serwera, zwrócenie ogólnej informacji użytkownikowi

## 8. Rozważania dotyczące wydajności

- **Indeksowanie**: Upewnij się, że w bazie danych istnieją odpowiednie indeksy dla optymalnej wydajności.
- **Duże pole source_text**: Monitoruj użycie pola source_text, ponieważ może zawierać duże ilości danych (do 25000 znaków).
- **Transakcje**: Operacje zapisu powinny być wykonywane jako transakcje, aby zapewnić spójność danych.

## 9. Etapy wdrożenia

1. **Implementacja serwisu obsługującego logikę biznesową**

```typescript
// services/notesService.ts - dodaj do istniejącego pliku
import { createClient } from "@/utils/supabase/server";
import { NoteDto, CreateNoteDto } from "@/app/types";

export async function createNote(
  userId: string,
  noteData: CreateNoteDto
): Promise<NoteDto> {
  const supabase = await createClient();

  // Przygotowanie danych do zapisu w bazie
  const newNote = {
    ...noteData,
    user_id: userId,
    // Nie potrzebujemy podawać created_at i updated_at,
    // bo baza danych uzupełni je automatycznie
  };

  const { data, error } = await supabase
    .from("notes")
    .insert(newNote)
    .select(
      `
      id, 
      title, 
      content, 
      source_text, 
      source, 
      created_at, 
      updated_at
    `
    )
    .single();

  if (error) {
    console.error("Error creating note:", error);
    throw new Error("Failed to create note");
  }

  // Usunięcie pola user_id przed zwróceniem danych
  const { user_id, ...noteDto } = data;

  return noteDto as NoteDto;
}
```

2. **Implementacja akcji serwerowej w app/actions.ts**

```typescript
// app/actions.ts - dodaj poniższe do istniejącego pliku
import { z } from "zod";
import { createNote } from "@/services/notesService";
import { createClient } from "@/utils/supabase/server";
import { ValidationRules } from "@/app/types";

// Schema walidacji dla tworzenia notatki
const CreateNoteSchema = z.object({
  title: z
    .string()
    .min(1, "Tytuł jest wymagany")
    .max(
      ValidationRules.notes.title.maxLength,
      `Tytuł nie może przekraczać ${ValidationRules.notes.title.maxLength} znaków`
    ),
  content: z
    .string()
    .min(1, "Treść notatki jest wymagana")
    .max(
      ValidationRules.notes.content.maxLength,
      `Treść notatki nie może przekraczać ${ValidationRules.notes.content.maxLength} znaków`
    ),
  source_text: z
    .string()
    .max(
      ValidationRules.notes.sourceText.maxLength,
      `Tekst źródłowy nie może przekraczać ${ValidationRules.notes.sourceText.maxLength} znaków`
    )
    .optional()
    .nullable(),
  source: z.enum(["AI", "Manual"]),
});

export type CreateNoteRequest = z.infer<typeof CreateNoteSchema>;

export async function createNoteAction(formData: CreateNoteRequest) {
  try {
    // Walidacja danych wejściowych
    const validatedData = CreateNoteSchema.parse(formData);

    // Pobranie sesji użytkownika
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return {
        error: "Unauthorized",
        status: 401,
      };
    }

    // Utworzenie notatki
    const newNote = await createNote(session.user.id, validatedData);

    return {
      data: newNote,
      status: 201,
    };
  } catch (error) {
    console.error("Error in createNoteAction:", error);

    // Obsługa błędów walidacji
    if (error instanceof z.ZodError) {
      return {
        error: error.errors,
        status: 400,
      };
    }

    // Obsługa pozostałych błędów
    return {
      error: "Internal Server Error",
      status: 500,
    };
  }
}
```
