# API Endpoint Implementation Plan: Delete Note

## 1. Przegląd punktu końcowego

Endpoint `DELETE /notes/{noteId}` umożliwia usunięcie istniejącej notatki na podstawie jej identyfikatora. Endpoint wymaga autentykacji, a użytkownik może usuwać tylko własne notatki. Po pomyślnym usunięciu zwracana jest pusta odpowiedź z kodem statusu 204 No Content.

## 2. Szczegóły żądania

- Metoda HTTP: `DELETE`
- Struktura URL: `/notes/{noteId}`
- Parametry ścieżki:
  - `noteId`: unikalny identyfikator notatki (UUID)
- Nagłówki:
  - `Authorization`: Bearer {access_token} (wymagany)

## 3. Wykorzystywane typy

```typescript
// Schema walidacji dla parametru ścieżki
import { z } from "zod";

// Schema dla parametru ścieżki
export const DeleteNoteParamsSchema = z.object({
  noteId: z.string().uuid("Nieprawidłowy format ID notatki"),
});

export type DeleteNoteParams = z.infer<typeof DeleteNoteParamsSchema>;
```

## 4. Szczegóły odpowiedzi

- Format odpowiedzi: Brak zawartości (pusta odpowiedź)
- Kody statusu:
  - 204 No Content: Pomyślne usunięcie notatki
  - 401 Unauthorized: Brak autoryzacji użytkownika
  - 403 Forbidden: Notatka nie należy do zalogowanego użytkownika
  - 404 Not Found: Notatka o podanym ID nie istnieje

## 5. Przepływ danych

1. Walidacja parametru `noteId` za pomocą Zod
2. Pobranie identyfikatora zalogowanego użytkownika za pomocą Supabase Auth
3. Sprawdzenie, czy notatka o podanym ID istnieje i należy do zalogowanego użytkownika
4. Usunięcie notatki z bazy danych Supabase
5. Zwrócenie pustej odpowiedzi z kodem statusu 204 No Content

## 6. Względy bezpieczeństwa

- **Autentykacja**: Weryfikacja tokenu JWT przez middleware Supabase
- **Autoryzacja**: Sprawdzenie, czy notatka należy do zalogowanego użytkownika przed usunięciem
- **Kaskadowe usuwanie**: Upewnienie się, że wszystkie powiązane dane są usuwane zgodnie z intencją (tabela notes ma ograniczenie ON DELETE CASCADE dla user_id)
- **Ochrona przed atakami IDOR**: Implementacja dodatkowego sprawdzenia autoryzacji, aby zapobiec nieautoryzowanemu usunięciu notatek innych użytkowników
- **Nieprzywracalność operacji**: Jasne komunikowanie użytkownikowi, że operacja usunięcia jest nieodwracalna

## 7. Obsługa błędów

- **Nieprawidłowy format ID notatki**:
  - Kod statusu: 400 Bad Request
  - Przykład komunikatu: "Invalid note ID format. Must be a valid UUID."
- **Brak autoryzacji**:
  - Kod statusu: 401 Unauthorized
  - Przykład komunikatu: "Authentication required to delete notes."
- **Notatka nie należy do użytkownika**:
  - Kod statusu: 403 Forbidden
  - Przykład komunikatu: "You don't have permission to delete this note."
- **Notatka nie istnieje**:
  - Kod statusu: 404 Not Found
  - Przykład komunikatu: "Note with the specified ID not found."
- **Błąd bazy danych**:
  - Kod statusu: 500 Internal Server Error
  - Logowanie błędu po stronie serwera, zwrócenie ogólnej informacji użytkownikowi

## 8. Rozważania dotyczące wydajności

- **Transakcje**: Operacje usuwania powinny być wykonywane jako transakcje, aby zapewnić spójność danych
- **Miękkie usuwanie**: Rozważenie implementacji "miękkiego usuwania" (soft delete) zamiast fizycznego usuwania danych w przyszłych wersjach
- **Indeksowanie**: Upewnij się, że w bazie danych istnieje indeks dla kolumny `id` dla optymalnej wydajności

## 9. Etapy wdrożenia

1. **Implementacja serwisu obsługującego logikę biznesową**

```typescript
// services/notesService.ts - dodaj do istniejącego pliku
import { createClient } from "@/utils/supabase/server";

export async function deleteNote(
  userId: string,
  noteId: string
): Promise<boolean> {
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
      return false; // Notatka nie została znaleziona
    }
    console.error("Error finding note:", findError);
    throw new Error("Failed to find note");
  }

  // Sprawdzenie, czy notatka należy do zalogowanego użytkownika
  if (existingNote.user_id !== userId) {
    throw new Error("Forbidden: Note does not belong to the current user");
  }

  // Usunięcie notatki
  const { error } = await supabase.from("notes").delete().eq("id", noteId);

  if (error) {
    console.error("Error deleting note:", error);
    throw new Error("Failed to delete note");
  }

  return true; // Pomyślnie usunięto notatkę
}
```

2. **Implementacja akcji serwerowej w app/actions.ts**

```typescript
// app/actions.ts - dodaj poniższe do istniejącego pliku
import { z } from "zod";
import { deleteNote } from "@/services/notesService";
import { createClient } from "@/utils/supabase/server";

// Schema walidacji dla parametru ścieżki
const DeleteNoteParamsSchema = z.object({
  noteId: z.string().uuid("Nieprawidłowy format ID notatki"),
});

export type DeleteNoteParams = z.infer<typeof DeleteNoteParamsSchema>;

export async function deleteNoteAction(noteId: string) {
  try {
    // Walidacja parametru noteId
    const validatedParams = DeleteNoteParamsSchema.parse({ noteId });

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

    // Usunięcie notatki
    try {
      const isDeleted = await deleteNote(
        session.user.id,
        validatedParams.noteId
      );

      if (!isDeleted) {
        return {
          error: "Note not found",
          status: 404,
        };
      }

      return {
        status: 204,
      };
    } catch (err) {
      // Obsługa błędu autoryzacji
      if (err instanceof Error && err.message.includes("Forbidden")) {
        return {
          error: "You don't have permission to delete this note",
          status: 403,
        };
      }
      throw err; // Przepuść inne błędy do głównego bloku catch
    }
  } catch (error) {
    console.error("Error in deleteNoteAction:", error);

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
