# API Endpoint Implementation Plan: Get Note Details

## 1. Przegląd punktu końcowego

Endpoint `GET /notes/{noteId}` umożliwia pobranie szczegółów konkretnej notatki na podstawie jej identyfikatora. Endpoint wymaga autentykacji, a użytkownik może uzyskać dostęp tylko do własnych notatek. W przypadku notatek utworzonych przez AI, zwracane jest również pole `source_text` zawierające oryginalny tekst źródłowy.

## 2. Szczegóły żądania

- Metoda HTTP: `GET`
- Struktura URL: `/notes/{noteId}`
- Parametry ścieżki:
  - `noteId`: unikalny identyfikator notatki (UUID)
- Nagłówki:
  - `Authorization`: Bearer {access_token} (wymagany)

## 3. Wykorzystywane typy

```typescript
// Typy już zdefiniowane w app/types.ts
import { NoteDto } from "@/app/types";

// Schema walidacji dla parametrów ścieżki
import { z } from "zod";

// Schema dla parametrów ścieżki
export const GetNoteDetailsParamsSchema = z.object({
  noteId: z.string().uuid("Nieprawidłowy format ID notatki"),
});

export type GetNoteDetailsParams = z.infer<typeof GetNoteDetailsParamsSchema>;
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
  - 200 OK: Pomyślne pobranie szczegółów notatki
  - 401 Unauthorized: Brak autoryzacji użytkownika
  - 403 Forbidden: Notatka nie należy do zalogowanego użytkownika
  - 404 Not Found: Notatka o podanym ID nie istnieje

## 5. Przepływ danych

1. Walidacja parametru `noteId` za pomocą Zod
2. Pobranie identyfikatora zalogowanego użytkownika za pomocą Supabase Auth
3. Zapytanie do bazy danych Supabase o notatkę o podanym ID
4. Sprawdzenie, czy notatka należy do zalogowanego użytkownika
5. Transformacja danych do formatu odpowiedzi API
6. Zwrócenie danych do klienta

## 6. Względy bezpieczeństwa

- **Autentykacja**: Weryfikacja tokenu JWT przez middleware Supabase
- **Autoryzacja**: Sprawdzenie, czy notatka należy do zalogowanego użytkownika przed zwróceniem jej szczegółów
- **Walidacja danych wejściowych**: Parametr `noteId` jest walidowany za pomocą Zod jako prawidłowy UUID
- **Sanityzacja danych wyjściowych**: Dane są przekształcane do bezpiecznego formatu przed zwróceniem, usuwając pole `user_id`
- **Ochrona przed atakami IDOR**: Implementacja dodatkowego sprawdzenia autoryzacji, aby zapobiec nieautoryzowanemu dostępowi do notatek innych użytkowników

## 7. Obsługa błędów

- **Nieprawidłowy format ID notatki**:
  - Kod statusu: 400 Bad Request
  - Przykład komunikatu: "Invalid note ID format. Must be a valid UUID."
- **Brak autoryzacji**:
  - Kod statusu: 401 Unauthorized
  - Przykład komunikatu: "Authentication required to access this endpoint."
- **Notatka nie należy do użytkownika**:
  - Kod statusu: 403 Forbidden
  - Przykład komunikatu: "You don't have permission to access this note."
- **Notatka nie istnieje**:
  - Kod statusu: 404 Not Found
  - Przykład komunikatu: "Note with the specified ID not found."
- **Błąd bazy danych**:
  - Kod statusu: 500 Internal Server Error
  - Logowanie błędu po stronie serwera, zwrócenie ogólnej informacji użytkownikowi

## 8. Rozważania dotyczące wydajności

- **Indeksowanie**: Upewnij się, że w bazie danych istnieje indeks dla kolumny `id` dla optymalnej wydajności (choć zazwyczaj klucz główny jest już indeksowany).
- **Caching**: Można rozważyć implementację cachingu odpowiedzi na kliencie, ponieważ szczegóły konkretnej notatki mogą nie zmieniać się często.
- **Monitorowanie**: Monitoruj długość pola `source_text` dla notatek AI, gdyż może zawierać duże ilości tekstu.

## 9. Etapy wdrożenia

1. **Implementacja serwisu obsługującego logikę biznesową**

```typescript
// services/notesService.ts - dodaj do istniejącego pliku
import { createClient } from "@/utils/supabase/server";
import { NoteDto } from "@/app/types";

export async function getNoteDetails(
  userId: string,
  noteId: string
): Promise<NoteDto | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notes")
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
    .eq("id", noteId)
    .single();

  if (error) {
    // Sprawdzenie, czy błąd wynika z nieznalezienia notatki
    if (error.code === "PGRST116") {
      return null; // Notatka nie została znaleziona
    }
    console.error("Error fetching note details:", error);
    throw new Error("Failed to retrieve note details");
  }

  // Sprawdzenie, czy notatka należy do zalogowanego użytkownika
  if (data.user_id !== userId) {
    throw new Error("Forbidden: Note does not belong to the current user");
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
import { getNoteDetails } from "@/services/notesService";
import { createClient } from "@/utils/supabase/server";

const GetNoteDetailsParamsSchema = z.object({
  noteId: z.string().uuid("Nieprawidłowy format ID notatki"),
});

type GetNoteDetailsParams = z.infer<typeof GetNoteDetailsParamsSchema>;

export async function getNoteDetailsAction(noteId: string) {
  try {
    // Walidacja parametru noteId
    const validatedParams = GetNoteDetailsParamsSchema.parse({ noteId });

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

    // Pobranie szczegółów notatki
    try {
      const note = await getNoteDetails(
        session.user.id,
        validatedParams.noteId
      );

      if (!note) {
        return {
          error: "Note not found",
          status: 404,
        };
      }

      return {
        data: note,
        status: 200,
      };
    } catch (err) {
      // Obsługa błędu autoryzacji
      if (err instanceof Error && err.message.includes("Forbidden")) {
        return {
          error: "You don't have permission to access this note",
          status: 403,
        };
      }
      throw err; // Przepuść inne błędy do głównego bloku catch
    }
  } catch (error) {
    console.error("Error in getNoteDetailsAction:", error);

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
