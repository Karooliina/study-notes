# API Endpoint Implementation Plan: List Notes

## 1. Przegląd punktu końcowego

Endpoint `GET /notes` umożliwia pobranie paginowanej listy notatek zalogowanego użytkownika. Notatki są sortowane wg daty utworzenia (domyślnie malejąco, z opcją sortowania rosnąco). Endpoint wymaga autentykacji.

## 2. Szczegóły żądania

- Metoda HTTP: `GET`
- Struktura URL: `/notes`
- Parametry:
  - Opcjonalne:
    - `order`: określa porządek sortowania ('asc' lub 'desc', domyślnie: 'desc')
- Nagłówki:
  - `Authorization`: Bearer {access_token} (wymagany)

## 3. Wykorzystywane typy

```typescript
// Typy już zdefiniowane w app/types.ts
import { NoteListItemDto, ListNotesResponseDto } from "@/app/types";

// Schema walidacji dla parametrów zapytania
import { z } from "zod";

// Schema dla Query Parameters
export const GetNotesQuerySchema = z.object({
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type GetNotesQueryParams = z.infer<typeof GetNotesQuerySchema>;
```

## 4. Szczegóły odpowiedzi

- Format odpowiedzi:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "title": "Note Title",
        "content": "Note content text",
        "source": "AI|Manual",
        "created_at": "2023-05-10T14:30:00Z",
        "updated_at": "2023-05-10T14:30:00Z"
      }
    ]
  }
  ```
- Kody statusu:
  - 200 OK: Pomyślne pobranie listy notatek
  - 400 Bad Request: Nieprawidłowe parametry zapytania
  - 401 Unauthorized: Brak autoryzacji użytkownika

## 5. Przepływ danych

1. Walidacja parametrów zapytania za pomocą Zod
2. Pobranie identyfikatora zalogowanego użytkownika za pomocą Supabase Auth
3. Zapytanie do bazy danych Supabase o notatki użytkownika (sortowanie wg parametru `order`)
4. Transformacja danych do formatu odpowiedzi API
5. Zwrócenie danych do klienta

## 6. Względy bezpieczeństwa

- **Autentykacja**: Weryfikacja tokenu JWT przez middleware Supabase
- **Autoryzacja**: Zapytanie do bazy danych zawiera filtr `user_id` równy identyfikatorowi zalogowanego użytkownika, co zapobiega dostępowi do notatek innych użytkowników
- **Walidacja danych wejściowych**: Parametry zapytania są walidowane za pomocą Zod
- **Sanityzacja danych wyjściowych**: Dane są przekształcane do bezpiecznego formatu przed zwróceniem, usuwając pole `user_id`

## 7. Obsługa błędów

- **Nieprawidłowe parametry zapytania**:
  - Kod statusu: 400 Bad Request
  - Przykład komunikatu: "Invalid order parameter. Must be 'asc' or 'desc'."
- **Brak autoryzacji**:
  - Kod statusu: 401 Unauthorized
  - Przykład komunikatu: "Authentication required to access this endpoint."
- **Błąd bazy danych**:
  - Kod statusu: 500 Internal Server Error
  - Logowanie błędu po stronie serwera, zwrócenie ogólnej informacji użytkownikowi

## 8. Rozważania dotyczące wydajności

- **Paginacja**: Endpoint zwraca wszystkie notatki użytkownika. Przyszłe wersje powinny zawierać paginację.
- **Indeksowanie**: Upewnij się, że w bazie danych istnieją indeksy dla kolumn `user_id` i `created_at` dla optymalnej wydajności.
- **Caching**: Można rozważyć implementację cachingu strony na kliencie, ponieważ notatki mogą nie zmieniać się często.

## 9. Etapy wdrożenia

1. **Implementacja serwisu obsługującego logikę biznesową**

```typescript
// services/notesService.ts
import { createClient } from "@/utils/supabase/server";
import { NoteListItemDto, ListNotesResponseDto } from "@/app/types";

export async function listUserNotes(
  userId: string,
  order: "asc" | "desc" = "desc"
): Promise<ListNotesResponseDto> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notes")
    .select(
      `
      id, 
      title, 
      content, 
      source, 
      created_at, 
      updated_at
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: order === "asc" });

  if (error) {
    console.error("Error fetching notes:", error);
    throw new Error("Failed to retrieve notes");
  }

  return {
    data: data as NoteListItemDto[],
  };
}
```

2. **Implementacja akcji serwerowej w app/actions.ts**

```typescript
// app/actions.ts - dodaj poniższe do istniejącego pliku
import { z } from "zod";
import { listUserNotes } from "@/services/notesService";
import { createClient } from "@/utils/supabase/server";

const GetNotesQuerySchema = z.object({
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

type GetNotesQueryParams = z.infer<typeof GetNotesQuerySchema>;

export async function getNotesAction(
  queryParams?: Partial<GetNotesQueryParams>
) {
  try {
    // Walidacja parametrów zapytania
    const validatedParams = GetNotesQuerySchema.parse(queryParams || {});

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

    // Pobranie notatek użytkownika
    const notes = await listUserNotes(session.user.id, validatedParams.order);

    return {
      data: notes,
      status: 200,
    };
  } catch (error) {
    console.error("Error in getNotesAction:", error);

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

```

```
