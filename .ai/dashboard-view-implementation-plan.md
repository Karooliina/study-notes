# Plan implementacji widoku Dashboard

## 1. Przegląd

Widok Dashboard jest głównym interfejsem użytkownika po zalogowaniu. Jego celem jest wyświetlenie listy notatek użytkownika, umożliwiając szybki dostęp do informacji oraz nawigację do szczegółów poszczególnych notatek. Widok powinien być responsywny i wyświetlać komunikat w przypadku braku notatek.

## 2. Routing widoku

Widok Dashboard powinien być dostępny pod ścieżką `/dashboard`. Dostęp do tej ścieżki powinien być chroniony i wymagać zalogowanego użytkownika.

## 3. Struktura komponentów

```
/dashboard (Route)
  └── DashboardPage (Server Component)
      └── NoteListClient (Client Component)
          ├── NoteCard[] (Client Component) - Wyświetla pojedynczą notatkę
          └── EmptyNotesMessage (Presentational Component) - Wyświetlany, gdy brak notatek
```

## 4. Szczegóły komponentów

### `DashboardPage` (Server Component)

- **Opis komponentu**: Główny komponent strony dla ścieżki `/dashboard`. Odpowiedzialny za pobranie początkowych danych notatek po stronie serwera i przekazanie ich do komponentu klienckiego.
- **Główne elementy**: Wywołuje Server Action `getNotesAction` do pobrania notatek. Renderuje `NoteListClient` przekazując mu pobrane dane lub informacje o błędzie.
- **Obsługiwane interakcje**: Brak bezpośrednich interakcji użytkownika.
- **Obsługiwana walidacja**: Pośrednio, poprzez Server Action, weryfikuje sesję użytkownika. Jeśli użytkownik nie jest zalogowany, powinien zostać przekierowany na stronę logowania (obsługa przez middleware lub logikę strony).
- **Typy**:
  - Dane wejściowe: Brak bezpośrednich propsów.
  - Dane wyjściowe/stan: Wynik z `getNotesAction` (powinien pasować do `{ data: NoteListItemDto[] | null, error: string | null, status: number }`).
- **Propsy**: Brak.

### `NoteListClient` (Client Component)

- **Opis komponentu**: Komponent kliencki renderujący listę notatek (`NoteCard`) lub wiadomość o braku notatek (`EmptyNotesMessage`). Oznaczony jako `'use client'`.
- **Główne elementy**:
  - Kontener listy (np. `div` z odpowiednimi klasami Tailwind CSS).
  - Mapowanie po tablicy notatek i renderowanie komponentu `NoteCard` dla każdej notatki.
  - Warunkowe renderowanie `EmptyNotesMessage` jeśli lista notatek jest pusta.
  - Wyświetlanie komunikatu o błędzie, jeśli wystąpił problem z pobraniem danych.
- **Obsługiwane interakcje**: Kliknięcie na `NoteCard` (delegowane do `NoteCard`).
- **Obsługiwana walidacja**: Sprawdzenie, czy tablica notatek jest pusta.
- **Typy**:
  - `notes: NoteListItemDto[] | null`
  - `error: string | null`
- **Propsy**:
  ```typescript
  interface NoteListClientProps {
    initialNotes: NoteListItemDto[] | null;
    error?: string | null;
  }
  ```

### `NoteCard` (Client Component)

- **Opis komponentu**: Wyświetla podsumowanie pojedynczej notatki (tytuł, data utworzenia) i umożliwia nawigację do jej szczegółów. Oznaczony jako `'use client'` dla obsługi nawigacji.
- **Główne elementy**:
  - Komponent `Card` z Shadcn UI jako kontener.
  - `CardHeader` z `CardTitle` (tytuł notatki).
  - `CardContent` lub `CardFooter` do wyświetlenia daty utworzenia.
  - Element `Link` z Next.js (`next/link`) opakowujący kartę, kierujący do `/notes/[id]`.
- **Obsługiwane interakcje**:
  - Kliknięcie: Nawigacja do widoku szczegółów notatki (`/notes/[note.id]`).
- **Obsługiwana walidacja**: Brak.
- **Typy**:
  - `note: NoteCardViewModel` (ViewModel stworzony na podstawie `NoteListItemDto`).
- **Propsy**:
  ```typescript
  interface NoteCardProps {
    note: NoteCardViewModel;
  }
  ```

### `EmptyNotesMessage` (Presentational Component)

- **Opis komponentu**: Prosty komponent wyświetlający komunikat informujący użytkownika, że nie ma jeszcze żadnych notatek.
- **Główne elementy**:
  - `div` lub `p` z tekstem, np. "Nie masz jeszcze żadnych notatek. Utwórz swoją pierwszą notatkę!".
  - Opcjonalnie przycisk/link do strony tworzenia nowej notatki.
- **Obsługiwane interakcje**: Brak.
- **Obsługiwana walidacja**: Brak.
- **Typy**: Brak.
- **Propsy**: Brak.

## 5. Typy

### `NoteListItemDto` (zdefiniowany w `app/types.ts`)

```typescript
export interface NoteListItemDto {
  id: string;
  title: string;
  content: string; // Może być skrócony lub nieużywany bezpośrednio w NoteCard
  source: SourceType; // 'AI' | 'Manual'
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}
```

### `ListNotesResponseDto` (zdefiniowany w `app/types.ts`)

```typescript
export interface ListNotesResponseDto {
  data: NoteListItemDto[];
}
```

### `NoteCardViewModel` (nowy ViewModel)

ViewModel przygotowany specjalnie dla komponentu `NoteCard` w celu ułatwienia wyświetlania danych.

```typescript
interface NoteCardViewModel {
  id: string;
  title: string;
  displayDate: string; // Sformatowana data utworzenia, np. "10 maja 2023"
  detailPath: string; // Ścieżka do szczegółów notatki, np. "/notes/uuid-123"
  // Opcjonalnie:
  // sourceTypeIndicator?: string; // Np. "AI" lub "Ręczna" dla wizualnej wskazówki
}
```

- **`id`**: `string` - ID notatki, używane do nawigacji.
- **`title`**: `string` - Tytuł notatki.
- **`displayDate`**: `string` - Sformatowana data `created_at` z `NoteListItemDto`.
- **`detailPath`**: `string` - Wygenerowana ścieżka do widoku szczegółów notatki.

## 6. Zarządzanie stanem

- **Pobieranie danych**: `DashboardPage` (Server Component) wywoła Server Action `getNotesAction` do pobrania danych. Stan ładowania i błędy będą zarządzane na poziomie `DashboardPage` i przekazywane jako propsy do `NoteListClient`.
- **Stan listy notatek**: `initialNotes` przekazane jako prop do `NoteListClient`. Na tym etapie nie przewiduje się klienckiego zarządzania stanem listy notatek (np. przez Zustand), ponieważ sortowanie odbywa się po stronie serwera, a lista jest ładowana w całości przy wejściu na stronę.
- **Stan błędu**: Informacja o błędzie z `getNotesAction` będzie przekazana do `NoteListClient` i tam wyświetlona.
- **Niestandardowe hooki**: Na tym etapie nie są wymagane. Jeśli w przyszłości dodane zostaną funkcje takie jak filtrowanie po stronie klienta lub bardziej złożone interakcje, można rozważyć `useReducer` lub niestandardowy hook w `NoteListClient`.

## 7. Integracja API

- **Endpoint**: Server Action `getNotesAction(queryParams?: Partial<GetNotesQueryParams>)`.
- **Lokalizacja wywołania**: W komponencie serwerowym `DashboardPage`.
- **Parametry żądania**:
  - Domyślnie wywołanie `getNotesAction()` lub `getNotesAction({ order: 'desc' })` w celu posortowania od najnowszych, zgodnie z US-004 i opisem API. Typ `GetNotesQueryParams` pochodzi z `app/actions.ts` (zakładając, że jest tam zdefiniowany `GetNotesQuerySchema`).
- **Typy żądania (dla `getNotesAction`)**:
  ```typescript
  // Zakładany na podstawie GetNotesQuerySchema
  interface GetNotesQueryParams {
    order?: "asc" | "desc";
  }
  ```
- **Typy odpowiedzi (z `getNotesAction`)**:
  ```typescript
  // Odpowiedź z Server Action
  interface GetNotesActionResult {
    data?: NoteListItemDto[] | null; // Zmieniono z ListNotesResponseDto['data'] na bezpośrednio tablicę lub null
    error?: string | ZodError["errors"] | null; // Błąd może być stringiem lub błędami Zod
    status: number;
  }
  ```
  Komponent `DashboardPage` otrzyma obiekt tego typu i przekaże `data` oraz `error` do `NoteListClient`.

## 8. Interakcje użytkownika

- **Wejście na stronę `/dashboard`**:
  - System pobiera listę notatek użytkownika.
  - Wyświetlana jest lista notatek (`NoteCard`) posortowana od najnowszych.
  - Jeśli brak notatek, wyświetlany jest `EmptyNotesMessage`.
  - Jeśli wystąpi błąd, wyświetlany jest komunikat o błędzie.
- **Kliknięcie na `NoteCard`**:
  - Użytkownik jest przekierowywany na stronę szczegółów danej notatki (`/notes/[id]`).

## 9. Warunki i walidacja

- **Dostęp do widoku**:
  - Komponent `DashboardPage` (lub middleware Next.js) musi sprawdzić, czy użytkownik jest zalogowany. Jeśli nie, przekierować na stronę logowania. Server Action `getNotesAction` również weryfikuje sesję.
- **Brak notatek**:
  - `NoteListClient` sprawdza, czy `initialNotes` jest `null` lub pustą tablicą. Jeśli tak, renderuje `EmptyNotesMessage`.
- **Błąd API**:
  - `NoteListClient` sprawdza, czy prop `error` nie jest `null`. Jeśli tak, wyświetla odpowiedni komunikat błędu (np. używając komponentu `Alert` z Shadcn UI).

## 10. Obsługa błędów

- **Brak autoryzacji (401)**: Server Action `getNotesAction` zwraca status 401. `DashboardPage` powinien obsłużyć ten przypadek, np. poprzez przekierowanie na stronę logowania (chociaż middleware jest lepszym miejscem na globalną obsługę tego).
- **Błąd walidacji parametrów (400)**: Mało prawdopodobne przy domyślnym sortowaniu, ale Server Action obsługuje błędy Zod. `NoteListClient` powinien wyświetlić ogólny komunikat błędu.
- **Błąd serwera (500)**: Server Action zwraca status 500. `NoteListClient` powinien wyświetlić ogólny komunikat błędu, np. "Wystąpił błąd podczas ładowania notatek. Spróbuj ponownie później."
- **Błędy sieciowe po stronie klienta (jeśli implementowane byłoby odświeżanie/sortowanie klienckie)**: Standardowe `try/catch` wokół wywołania Server Action i ustawienie stanu błędu.

## 11. Kroki implementacji

1.  **Utworzenie struktury plików**:
    - `app/dashboard/page.tsx` (dla `DashboardPage`)
    - `app/dashboard/components/NoteListClient.tsx`
    - `app/dashboard/components/NoteCard.tsx`
    - `app/dashboard/components/EmptyNotesMessage.tsx`
2.  **Implementacja `DashboardPage` (Server Component)**:
    - Dodanie logiki pobierania notatek przy użyciu Server Action `getNotesAction`.
    - Przekazanie pobranych notatek (lub błędu) do `NoteListClient`.
    - Obsługa przypadku, gdy `getNotesAction` zwróci błąd autoryzacji (np. poprzez `redirect` jeśli to konieczne na tym poziomie, choć middleware jest preferowane).
3.  **Definicja `NoteCardViewModel`**: Zdefiniować typ w odpowiednim miejscu (np. w `app/types.ts` lub lokalnie, jeśli używany tylko w obrębie dashboardu).
4.  **Implementacja `NoteCard`**:
    - Przyjęcie propsa `note: NoteCardViewModel`.
    - Użycie komponentów Shadcn UI (`Card`, `CardHeader`, `CardTitle`, `CardDescription` lub `CardContent`) do wyświetlenia tytułu i sformatowanej daty.
    - Implementacja formatowania daty (np. za pomocą `date-fns` lub `Intl.DateTimeFormat`).
    - Dodanie `Link` z `next/link` do nawigacji do `/notes/[note.id]`.
    - Stylizacja za pomocą Tailwind CSS.
5.  **Implementacja `EmptyNotesMessage`**:
    - Stworzenie prostego komponentu wyświetlającego stosowny komunikat.
    - Stylizacja za pomocą Tailwind CSS.
6.  **Implementacja `NoteListClient`**:
    - Przyjęcie propsów `initialNotes` i `error`.
    - Warunkowe renderowanie:
      - Komunikatu o błędzie, jeśli `error` istnieje.
      - `EmptyNotesMessage`, jeśli `initialNotes` jest pusty lub `null` (a nie ma błędu).
      - Listy `NoteCard`, jeśli są notatki.
    - Mapowanie `initialNotes` do `NoteCardViewModel` przed przekazaniem do `NoteCard` (lub transformacja może się odbyć w `DashboardPage`).
    - Użycie Tailwind CSS do layoutu listy (np. grid dla kart).
7.  **Styling i responsywność**:
    - Zapewnienie responsywności dla wszystkich komponentów przy użyciu Tailwind CSS (mobile-first).
    - Dostosowanie wyglądu komponentów Shadcn UI, jeśli jest to potrzebne.
8.  **Routing i ochrona ścieżki**:
    - Upewnienie się, że ścieżka `/dashboard` jest poprawnie skonfigurowana.
    - Weryfikacja, czy ochrona ścieżki (np. przez middleware) działa poprawnie, przekierowując niezalogowanych użytkowników.
9.  **Testowanie**:
    - Manualne testowanie różnych scenariuszy:
      - Użytkownik zalogowany, ma notatki.
      - Użytkownik zalogowany, nie ma notatek.
      - Błąd API podczas ładowania notatek.
      - Dostęp do `/dashboard` przez niezalogowanego użytkownika.
      - Responsywność na różnych urządzeniach.
      - Nawigacja po kliknięciu `NoteCard`.
10. **Refaktoryzacja i czyszczenie kodu**: Przegląd kodu pod kątem zgodności z "frontend-rules", czytelności i wydajności.
