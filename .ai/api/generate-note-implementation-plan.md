# API Endpoint Implementation Plan: Generate Note with AI

## 1. Przegląd punktu końcowego

Endpoint `POST /ai/generate-note` umożliwia generowanie treści notatki na podstawie dostarczonego tekstu źródłowego przy użyciu modeli sztucznej inteligencji. Użytkownik przesyła oryginalny tekst źródłowy (np. materiał edukacyjny), a endpoint zwraca wygenerowane przez AI podsumowanie. Endpoint wymaga autentykacji i podlega limitom szybkości żądań, aby kontrolować wykorzystanie zasobów AI.

## 2. Szczegóły żądania

- Metoda HTTP: `POST`
- Struktura URL: `/ai/generate-note`
- Nagłówki:
  - `Authorization`: Bearer {access_token} (wymagany)
  - `Content-Type`: application/json (wymagany)
- Request Body:
  ```json
  {
    "source_text": "Original educational material text to summarize"
  }
  ```

## 3. Wykorzystywane typy

```typescript
// Typy już zdefiniowane w app/types.ts
import {
  GenerateNoteRequestDto,
  GenerateNoteResponseDto,
  ValidationRules,
} from "@/app/types";

// Schema walidacji dla body żądania
import { z } from "zod";

// Schema dla body żądania
export const GenerateNoteSchema = z.object({
  source_text: z
    .string()
    .min(1, "Tekst źródłowy jest wymagany")
    .max(
      ValidationRules.notes.sourceText.maxLength,
      `Tekst źródłowy nie może przekraczać ${ValidationRules.notes.sourceText.maxLength} znaków`
    ),
});

export type GenerateNoteRequest = z.infer<typeof GenerateNoteSchema>;
```

## 4. Szczegóły odpowiedzi

- Format odpowiedzi:
  ```json
  {
    "content": "AI generated summary content"
  }
  ```
- Kody statusu:
  - 200 OK: Pomyślne wygenerowanie treści notatki
  - 400 Bad Request: Nieprawidłowe dane wejściowe (tekst zbyt długi lub nieprawidłowy format)
  - 401 Unauthorized: Brak autoryzacji użytkownika
  - 429 Too Many Requests: Przekroczono limit szybkości żądań
  - 500 Internal Server Error: Błąd usługi AI
  - 504 Gateway Timeout: Generowanie notatki zajęło zbyt dużo czasu

## 5. Przepływ danych

1. Walidacja danych wejściowych za pomocą Zod (sprawdzenie, czy tekst nie jest zbyt długi)
2. Pobranie identyfikatora zalogowanego użytkownika za pomocą Supabase Auth
3. Sprawdzenie limitów użycia usługi AI przez użytkownika (opcjonalne)
4. Wywołanie zewnętrznego API AI (OpenRouter.ai) z tekstem źródłowym
5. Odebranie i przetworzenie odpowiedzi od usługi AI
6. Zwrócenie wygenerowanej treści notatki do klienta

## 6. Względy bezpieczeństwa

- **Autentykacja**: Weryfikacja tokenu JWT przez middleware Supabase
- **Walidacja danych wejściowych**: Sprawdzenie czy tekst źródłowy nie przekracza dozwolonych limitów
- **Bezpieczeństwo API**: Bezpieczne przechowywanie i używanie kluczy API do usługi AI
- **Limity użycia**: Implementacja limitów szybkości żądań, aby zapobiec nadużyciom
- **Kontrola kosztów**: Monitorowanie i kontrolowanie kosztów użycia usługi AI
- **Sanityzacja danych wyjściowych**: Upewnienie się, że wygenerowana zawartość nie zawiera niebezpiecznych danych

## 7. Obsługa błędów

- **Nieprawidłowe dane wejściowe**:
  - Kod statusu: 400 Bad Request
  - Przykłady błędów walidacji:
    - "Tekst źródłowy jest wymagany"
    - "Tekst źródłowy nie może przekraczać 25000 znaków"
- **Brak autoryzacji**:
  - Kod statusu: 401 Unauthorized
  - Przykład komunikatu: "Authentication required to access AI generation."
- **Przekroczono limit szybkości żądań**:
  - Kod statusu: 429 Too Many Requests
  - Przykład komunikatu: "Rate limit exceeded. Please try again later."
- **Błąd usługi AI**:
  - Kod statusu: 500 Internal Server Error
  - Przykład komunikatu: "AI service encountered an error. Please try again later."
- **Timeout generowania**:
  - Kod statusu: 504 Gateway Timeout
  - Przykład komunikatu: "AI generation took too long to complete. Please try with a shorter text."

## 8. Rozważania dotyczące wydajności

- **Limity czasowe**: Ustawienie odpowiednich limitów czasowych (timeoutów) dla żądań do usługi AI
- **Buforowanie wyników**: Rozważenie buforowania wyników generowania dla często używanych tekstów źródłowych
- **Asynchroniczne przetwarzanie**: Dla długich tekstów rozważyć asynchroniczne przetwarzanie z powiadomieniami
- **Optymalizacja zapytań**: Odpowiednie przygotowanie prompta dla modelu AI, aby uzyskać najlepsze wyniki

## 9. Etapy wdrożenia

1. **Implementacja usługi integracji z AI**

```typescript
// services/aiService.ts
import { ValidationRules } from "@/app/types";
import { GenerateNoteResponseDto } from "@/app/types";

// Konfiguracja dla OpenRouter.ai
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "google/palm-2"; // Przykładowy model, wybierz odpowiedni

// Funkcja do sprawdzania limitów użycia (przykład)
async function checkRateLimits(userId: string): Promise<boolean> {
  // Implementacja sprawdzania limitów użycia
  // W rzeczywistym przypadku można użyć Redis lub innej bazy danych
  // do przechowywania liczników użycia
  return true; // Zwraca true, jeśli użytkownik nie przekroczył limitów
}

export async function generateNoteContent(
  userId: string,
  sourceText: string
): Promise<GenerateNoteResponseDto> {
  // Sprawdź limity użycia
  const withinLimits = await checkRateLimits(userId);
  if (!withinLimits) {
    throw new Error("Rate limit exceeded");
  }

  // Sprawdź długość tekstu (dodatkowe zabezpieczenie)
  if (sourceText.length > ValidationRules.notes.sourceText.maxLength) {
    throw new Error("Source text exceeds maximum allowed length");
  }

  try {
    // Przygotowanie zapytania do OpenRouter.ai
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": `${process.env.NEXT_PUBLIC_SITE_URL}`, // Domena dla rozliczeń
        "X-Title": "Study Notes App", // Nazwa aplikacji dla panelu OpenRouter
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "Jesteś pomocnym asystentem, który podsumowuje materiały edukacyjne. Stwórz zwięzłe i przejrzyste podsumowanie dostarczonego tekstu. Skup się na najważniejszych pojęciach i informacjach. Podsumowanie powinno być krótsze niż oryginalny tekst, ale zachowywać wszystkie kluczowe informacje.",
          },
          {
            role: "user",
            content: `Podsumuj poniższy materiał edukacyjny:\n\n${sourceText}`,
          },
        ],
        max_tokens: 500, // Limit długości generowanego tekstu
      }),
      // Timeout aby zapobiec zbyt długiemu oczekiwaniu
      signal: AbortSignal.timeout(30000), // 30 sekund timeout
    });

    if (!response.ok) {
      // Obsługa różnych kodów błędów
      if (response.status === 429) {
        throw new Error("Rate limit exceeded by AI service");
      }
      throw new Error(`AI service error: ${response.statusText}`);
    }

    const data = await response.json();

    // Ekstrakcja wygenerowanej zawartości
    const generatedContent = data.choices[0]?.message?.content;

    if (!generatedContent) {
      throw new Error("Failed to generate content");
    }

    // Zwróć wygenerowaną zawartość
    return {
      content: generatedContent,
    };
  } catch (error) {
    // Obsługa timeoutu
    if (error.name === "AbortError") {
      throw new Error("AI generation timed out");
    }

    // Rzucanie błędu dalej
    throw error;
  }
}
```

2. **Implementacja akcji serwerowej w app/actions.ts**

```typescript
// app/actions.ts - dodaj poniższe do istniejącego pliku
import { z } from "zod";
import { generateNoteContent } from "@/services/aiService";
import { createClient } from "@/utils/supabase/server";
import { ValidationRules } from "@/app/types";

// Schema walidacji dla generowania notatki
const GenerateNoteSchema = z.object({
  source_text: z
    .string()
    .min(1, "Tekst źródłowy jest wymagany")
    .max(
      ValidationRules.notes.sourceText.maxLength,
      `Tekst źródłowy nie może przekraczać ${ValidationRules.notes.sourceText.maxLength} znaków`
    ),
});

export type GenerateNoteRequest = z.infer<typeof GenerateNoteSchema>;

export async function generateNoteAction(formData: GenerateNoteRequest) {
  try {
    // Walidacja danych wejściowych
    const validatedData = GenerateNoteSchema.parse(formData);

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

    // Wywołanie usługi AI
    try {
      const generatedNote = await generateNoteContent(
        session.user.id,
        validatedData.source_text
      );

      return {
        data: generatedNote,
        status: 200,
      };
    } catch (err) {
      if (err instanceof Error) {
        // Obsługa specyficznych błędów
        if (err.message.includes("Rate limit exceeded")) {
          return {
            error: "Rate limit exceeded. Please try again later.",
            status: 429,
          };
        } else if (err.message.includes("timed out")) {
          return {
            error:
              "AI generation took too long to complete. Please try with a shorter text.",
            status: 504,
          };
        }
      }
      throw err; // Przepuść inne błędy do głównego bloku catch
    }
  } catch (error) {
    console.error("Error in generateNoteAction:", error);

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

3. **Konfiguracja zmiennych środowiskowych**

Dodaj następujące zmienne środowiskowe do projektu:

```
OPENROUTER_API_KEY=your_api_key_here
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```
