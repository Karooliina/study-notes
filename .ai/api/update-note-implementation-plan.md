# API Endpoint Implementation Plan: Update Note

## 1. Przegląd punktu końcowego

Endpoint `PATCH /notes/{noteId}` umożliwia aktualizację istniejącej notatki na podstawie jej identyfikatora. Użytkownik może zaktualizować tytuł oraz treść notatki. Endpoint wymaga autentykacji, a użytkownik może aktualizować tylko własne notatki. Pole `updated_at` jest automatycznie aktualizowane przy zapisie zmian.

## 2. Szczegóły żądania

- Metoda HTTP: `PATCH`
- Struktura URL: `/notes/{noteId}`
- Parametry ścieżki:
  - `noteId`: unikalny identyfikator notatki (UUID)
- Nagłówki:
  - `Authorization`: Bearer {access_token} (wymagany)
  - `Content-Type`: application/json (wymagany)
- Request Body:
  ```json
  {
    "title": "Updated Note Title",
    "content": "Updated note content text"
  }
  ```

## 3. Wykorzystywane typy

```typescript
// Typy już zdefiniowane w app/types.ts
import { NoteDto, UpdateNoteDto, ValidationRules } from "@/app/types";

// Schema walidacji dla parametrów ścieżki i body
import { z } from "zod";

// Schema dla parametru ścieżki
export const UpdateNoteParamsSchema = z.object({
  noteId: z.string().uuid("Nieprawidłowy format ID notatki"),
});

// Schema dla body żądania
export const UpdateNoteBodySchema = z.object({
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
});

export type UpdateNoteParams = z.infer<typeof UpdateNoteParamsSchema>;
export type UpdateNoteBody = z.infer<typeof UpdateNoteBodySchema>;
```

## 4. Szczegóły odpowiedzi

- Format odpowiedzi:
  ```json
  {
    "id": "uuid",
    "title": "Updated Note Title",
    "content": "Updated note content text",
    "source_text": "Original source text (only for AI notes)",
    "source": "AI|Manual",
    "created_at": "2023-05-10T14:30:00Z",
    "updated_at": "2023-05-10T15:00:00Z"
  }
  ```
- Kody statusu:
  - 200 OK: Pomyślna aktualizacja notatki
  - 400 Bad Request: Nieprawidłowe dane wejściowe (błędy walidacji)
  - 401 Unauthorized: Brak autoryzacji użytkownika
  - 403 Forbidden: Notatka nie należy do zalogowanego użytkownika
  - 404 Not Found: Notatka o podanym ID nie istnieje

## 5. Przepływ danych

1. Walidacja parametru `noteId` i danych wejściowych za pomocą Zod
2. Pobranie identyfikatora zalogowanego użytkownika za pomocą Supabase Auth
3. Sprawdzenie, czy notatka o podanym ID istnieje i należy do zalogowanego użytkownika
4. Aktualizacja notatki w bazie danych Supabase
5. Pobranie zaktualizowanej notatki z bazy danych
6. Transformacja danych do formatu odpowiedzi API
7. Zwrócenie odpowiedzi z kodem statusu 200 OK

## 6. Względy bezpieczeństwa

- **Autentykacja**: Weryfikacja tokenu JWT przez middleware Supabase
- **Autoryzacja**: Sprawdzenie, czy notatka należy do zalogowanego użytkownika przed aktualizacją
- **Walidacja danych wejściowych**: Wszystkie pola są walidowane za pomocą Zod pod kątem prawidłowych typów i wartości
- **Sanityzacja danych wyjściowych**: Dane są przekształcane do bezpiecznego formatu przed zwróceniem, usuwając pole `user_id`
- **Ochrona przed atakami IDOR**: Implementacja dodatkowego sprawdzenia autoryzacji, aby zapobiec nieautoryzowanej aktualizacji notatek innych użytkowników

## 7. Obsługa błędów

- **Nieprawidłowy format ID notatki**:
  - Kod statusu: 400 Bad Request
  - Przykład komunikatu: "Invalid note ID format. Must be a valid UUID."
- **Nieprawidłowe dane wejściowe**:
  - Kod statusu: 400 Bad Request
  - Przykłady błędów walidacji:
    - "Tytuł jest wymagany"
    - "Tytuł nie może przekraczać 50 znaków"
    - "Treść notatki jest wymagana"
    - "Treść notatki nie może przekraczać 1000 znaków"
- **Brak autoryzacji**:
  - Kod statusu: 401 Unauthorized
  - Przykład komunikatu: "Authentication required to update notes."
- **Notatka nie należy do użytkownika**:
  - Kod statusu: 403 Forbidden
  - Przykład komunikatu: "You don't have permission to update this note."
- **Notatka nie istnieje**:
  - Kod statusu: 404 Not Found
  - Przykład komunikatu: "Note with the specified ID not found."
- **Błąd bazy danych**:
  - Kod statusu: 500 Internal Server Error
  - Logowanie błędu po stronie serwera, zwrócenie ogólnej informacji użytkownikowi

## 8. Rozważania dotyczące wydajności

- **Atomowe aktualizacje**: Aktualizacja tylko zmienionych pól zamiast całego rekordu
- **Indeksowanie**: Upewnij się, że w bazie danych istnieje indeks dla kolumny `id` dla optymalnej wydajności
- **Transakcje**: Operacje aktualizacji powinny być wykonywane jako transakcje, aby zapewnić spójność danych

## 9. Etapy wdrożenia

1. **Implementacja serwisu obsługującego logikę biznesową**

```typescript
// services/notesService.ts - dodaj do istniejącego pliku
import { createClient } from "@/utils/supabase/server";
import { NoteDto, UpdateNoteDto } from "@/app/types";

export async function updateNote(
  userId: string,
  noteId: string,
  updateData: UpdateNoteDto
): Promise<NoteDto | null> {
  const supabase = await createClient();

  // Najpierw sprawdź, czy notatka istnieje i należy do użytkownika
  const { data: existingNote, error: findError } = await supabase
    .from("notes")
    .select("id, user_id")
    .eq("id", noteId)
    .single();

  if (findError) {
    // Sprawdzenie, czy błąd wynika z nieznalezienia notatki
    if (findError.code === "PGRST116") {
      return null; // Notatka nie została znaleziona
    }
    console.error("Error finding note:", findError);
    throw new Error("Failed to find note");
  }

  // Sprawdzenie, czy notatka należy do zalogowanego użytkownika
  if (existingNote.user_id !== userId) {
    throw new Error("Forbidden: Note does not belong to the current user");
  }

  // Aktualizacja notatki
  const { data, error } = await supabase
    .from("notes")
    .update({
      ...updateData,
      updated_at: new Date().toISOString(), // Jawna aktualizacja znacznika czasu
    })
    .eq("id", noteId)
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
    console.error("Error updating note:", error);
    throw new Error("Failed to update note");
  }

  // Usunięcie pola user_id przed zwróceniem danych
  const { user_id, ...noteData } = data;

  return noteData as NoteDto;
}
```

2. **Implementacja akcji serwerowej w app/actions.ts**

```typescript
// app/actions.ts - dodaj poniższe do istniejącego pliku
import { z } from "zod";
import { updateNote } from "@/services/notesService";
import { createClient } from "@/utils/supabase/server";
import { ValidationRules } from "@/app/types";

// Schematy walidacji
const UpdateNoteParamsSchema = z.object({
  noteId: z.string().uuid("Nieprawidłowy format ID notatki"),
});

const UpdateNoteBodySchema = z.object({
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
});

export type UpdateNoteParams = z.infer<typeof UpdateNoteParamsSchema>;
export type UpdateNoteBody = z.infer<typeof UpdateNoteBodySchema>;

export async function updateNoteAction(
  noteId: string,
  formData: UpdateNoteBody
) {
  try {
    // Walidacja parametru noteId i danych wejściowych
    const validatedParams = UpdateNoteParamsSchema.parse({ noteId });
    const validatedData = UpdateNoteBodySchema.parse(formData);

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

    // Aktualizacja notatki
    try {
      const updatedNote = await updateNote(
        session.user.id,
        validatedParams.noteId,
        validatedData
      );

      if (!updatedNote) {
        return {
          error: "Note not found",
          status: 404,
        };
      }

      return {
        data: updatedNote,
        status: 200,
      };
    } catch (err) {
      // Obsługa błędu autoryzacji
      if (err instanceof Error && err.message.includes("Forbidden")) {
        return {
          error: "You don't have permission to update this note",
          status: 403,
        };
      }
      throw err; // Przepuść inne błędy do głównego bloku catch
    }
  } catch (error) {
    console.error("Error in updateNoteAction:", error);

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
