<conversation_summary>
<decisions>

1. Tabela użytkowników będzie zawierać tylko podstawowe dane (username, email, hasło) bez dodatkowych pól.
2. Surowy tekst źródłowy, na podstawie którego generowana jest notatka przez AI, będzie przechowywany.
3. Rozróżnienie notatek będzie poprzez pole Source typu enum z wartościami: AI, Manual.
4. Nie będzie implementacji wersjonowania notatek.
5. Wszyscy użytkownicy będą mieć jednakowe uprawnienia (brak ról).
6. Przewidywana skala to 10-20 notatek na użytkownika, do 10 użytkowników w MVP.
7. Jedyną funkcją wyszukiwania będzie sortowanie po dacie utworzenia.
8. Tytuł notatki będzie ograniczony do 50 znaków.
9. Nie ma potrzeby przechowywania informacji o czasie generowania notatki czy użytym modelu AI.
10. Nie planuje się kategoryzacji ani tagowania notatek.
    </decisions>

<matched_recommendations>

1. Utworzenie tabeli `users` zarządzanej przez Supabase Auth.
2. Utworzenie tabeli `notes` z polami: id, user_id, title (varchar(50), not null), content (text, not null), source_text (text, null), source (enum('AI', 'Manual'), not null), created_at, updated_at.
3. Implementacja Row Level Security (RLS) w Supabase z politykami zapewniającymi dostęp użytkowników wyłącznie do własnych notatek.
4. Dodanie indeksu na kolumnach (user_id, created_at) dla efektywnego pobierania i sortowania notatek.
5. Zastosowanie CHECK constraint dla content (limit 1000 znaków) oraz source_text (limit odpowiadający 5000 słów).
6. Wykorzystanie PostgreSQL enum type dla pola source.
7. Konfiguracja CASCADE DELETE dla notatek powiązanych z usuniętym użytkownikiem.
8. Wykorzystanie funkcji Supabase do automatycznego zarządzania polami created_at i updated_at.
   </matched_recommendations>

<database_planning_summary>
Na podstawie analizy dokumentu PRD i przeprowadzonych rozmów, MVP aplikacji Study Notes będzie wymagać prostego schematu bazy danych składającego się z dwóch głównych encji:

1. Users (zarządzana przez Supabase Auth):

   - Standardowe pola: id, email, username, password (hash)
   - Brak dodatkowych metadanych w ramach MVP

2. Notes:
   - id (UUID): unikalny identyfikator notatki
   - user_id (UUID): klucz obcy do tabeli users
   - title (VARCHAR(50)): tytuł notatki, limit 50 znaków
   - content (TEXT): treść wygenerowanej/stworzonej notatki, limit 1000 znaków
   - source_text (TEXT): oryginalny tekst dla generowania notatki przez AI, do 5000 słów
   - source (ENUM): rozróżnienie między notatkami generowanymi przez AI a tworzonymi ręcznie ('AI' lub 'Manual')
   - created_at (TIMESTAMP WITH TIME ZONE): data utworzenia notatki
   - updated_at (TIMESTAMP WITH TIME ZONE): data ostatniej aktualizacji

Relacje:

- Jeden użytkownik może mieć wiele notatek (one-to-many)
- Każda notatka należy do dokładnie jednego użytkownika

Bezpieczeństwo:

- Row Level Security (RLS) w Supabase zapewni, że użytkownicy mają dostęp tylko do swoich notatek
- Polityki RLS powinny obejmować:
  - SELECT: WHERE user_id = auth.uid()
  - INSERT: z automatycznym ustawieniem user_id = auth.uid()
  - UPDATE: WHERE user_id = auth.uid()
  - DELETE: WHERE user_id = auth.uid()

Optymalizacja wydajności:

- Indeks na kolumnie (user_id, created_at) dla efektywnego pobierania i sortowania notatek użytkownika
- Ze względu na małą skalę (10 użytkowników, 10-20 notatek na użytkownika) nie są wymagane zaawansowane techniki optymalizacyjne

Integralność danych:

- CHECK constraint na polu title ograniczający długość do 50 znaków
- CHECK constraint na polu content ograniczający długość do 1000 znaków
- CHECK constraint na polu source_text ograniczający długość tekstu źródłowego
- Zastosowanie typu ENUM dla pola source zamiast prostego stringa
- CASCADE DELETE dla notatek przy usunięciu użytkownika
  </database_planning_summary>

<unresolved_issues>

1. Dokładny sposób implementacji ograniczenia długości tekstu source_text (do 5000 słów). Warto ustalić, czy będzie to oparte na faktycznej liczbie słów czy przybliżonej liczbie znaków.
2. Dokładny format przechowywania tekstu źródłowego - czy powinien być przechowywany w formie czystego tekstu, czy potrzebne jest zachowanie formatowania.
3. Sposób liczenia i ograniczania długości treści notatki do 1000 znaków - czy liczymy znaki ze spacjami czy bez, oraz czy na poziomie aplikacji czy bazy danych.
4. Metoda obsługi błędów przy przekroczeniu limitów długości na poziomie bazy danych vs. aplikacji.
   </unresolved_issues>
   </conversation_summary>
