# Schemat bazy danych dla Study Notes

## 1. Tabele

### users (tabela zarządzana przez Supabase Auth)

| Kolumna  | Typ     | Ograniczenia     | Opis                               |
| -------- | ------- | ---------------- | ---------------------------------- |
| id       | UUID    | PRIMARY KEY      | Unikalny identyfikator użytkownika |
| email    | VARCHAR | UNIQUE, NOT NULL | Adres email użytkownika            |
| username | VARCHAR | UNIQUE, NOT NULL | Nazwa użytkownika                  |
| password | VARCHAR | NOT NULL         | Hashowane hasło użytkownika        |

### notes

| Kolumna     | Typ                      | Ograniczenia                                                           | Opis                                       |
| ----------- | ------------------------ | ---------------------------------------------------------------------- | ------------------------------------------ |
| id          | UUID                     | PRIMARY KEY, DEFAULT uuid_generate_v4()                                | Unikalny identyfikator notatki             |
| user_id     | UUID                     | NOT NULL, REFERENCES users(id) ON DELETE CASCADE                       | Identyfikator właściciela notatki          |
| title       | VARCHAR(50)              | NOT NULL, CHECK (char_length(title) <= 50)                             | Tytuł notatki, limitowany do 50 znaków     |
| content     | TEXT                     | NOT NULL, CHECK (char_length(content) <= 1000)                         | Treść notatki, limitowana do 1000 znaków   |
| source_text | TEXT                     | NULL, CHECK (source_text IS NULL OR char_length(source_text) <= 25000) | Oryginalny tekst źródłowy (dla notatek AI) |
| source      | source_type              | NOT NULL                                                               | Typ notatki (AI lub Manual)                |
| created_at  | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT now()                                                | Data utworzenia notatki                    |
| updated_at  | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT now()                                                | Data ostatniej aktualizacji notatki        |

## 2. Typy niestandardowe

```sql
CREATE TYPE source_type AS ENUM ('AI', 'Manual');
```

## 3. Relacje

- Relacja jeden-do-wielu między `users` i `notes`: jeden użytkownik może mieć wiele notatek, każda notatka należy do dokładnie jednego użytkownika.
  - Implementacja: Klucz obcy `user_id` w tabeli `notes` odwołujący się do `id` w tabeli `users`
  - ON DELETE CASCADE: zapewnia usunięcie wszystkich notatek użytkownika w przypadku usunięcia konta

## 4. Indeksy

```sql
-- Indeks dla efektywnego pobierania i sortowania notatek użytkownika według daty utworzenia
CREATE INDEX idx_notes_user_id_created_at ON notes(user_id, created_at DESC);
```

## 5. Polityki bezpieczeństwa na poziomie wierszy (RLS)

```sql
-- Włączenie RLS dla tabeli notes
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Polityka SELECT - użytkownicy mogą odczytywać tylko swoje notatki
CREATE POLICY notes_select_policy ON notes
    FOR SELECT
    USING (user_id = auth.uid());

-- Polityka INSERT - automatyczne przypisanie user_id przy dodawaniu nowej notatki
CREATE POLICY notes_insert_policy ON notes
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Polityka UPDATE - użytkownicy mogą aktualizować tylko swoje notatki
CREATE POLICY notes_update_policy ON notes
    FOR UPDATE
    USING (user_id = auth.uid());

-- Polityka DELETE - użytkownicy mogą usuwać tylko swoje notatki
CREATE POLICY notes_delete_policy ON notes
    FOR DELETE
    USING (user_id = auth.uid());
```

## 6. Wyzwalacze

```sql
-- Automatyczna aktualizacja pola updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notes_updated_at
BEFORE UPDATE ON notes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
```

## 7. Uwagi dodatkowe

1. Supabase Auth automatycznie zarządza tabelą `auth.users`, która zostanie rozszerzona o dodatkowe pola publiczne w schemacie `public.users`.

2. Limit znaków w `source_text` (25000) jest aproksymacją 5000 słów (przy założeniu średnio 5 znaków na słowo).

3. Zastosowano ograniczenia CHECK dla `title` i `content`, aby zapewnić zgodność z wymaganiami dotyczącymi długości.

4. Automatyczne timestampy (`created_at`, `updated_at`) zapewniają śledzenie czasu utworzenia i modyfikacji rekordów.

5. Indeks na kolumnach `(user_id, created_at)` został dodany do optymalizacji zapytań sortujących notatki według daty, co jest główną funkcją wyszukiwania określoną w wymaganiach.

6. RLS zapewnia bezpieczeństwo na poziomie wiersza, kontrolując dostęp użytkowników wyłącznie do ich własnych danych.

7. Schemat jest znormalizowany do 3NF, co jest wystarczające dla prostej struktury danych w tym MVP.
