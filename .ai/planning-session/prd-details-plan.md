<conversation_summary>
<decisions>

1. Generowanie notatek z materiałów edukacyjnych w formie tekstowej, limitowane do 5000 słów wejściowych i 1000 znaków wyjściowych.
2. Prosty interfejs użytkownika z dwoma trybami: generowanie przez AI i tworzenie manualne.
3. Użytkownik musi być zalogowany, aby tworzyć, przeglądać, edytować i usuwać notatki.
4. Proces tworzenia notatki przez AI obejmuje wprowadzenie tekstu, generowanie, opcjonalną edycję i zapisanie.
5. Dashboard zawiera listę notatek z tytułami i datami utworzenia.
6. Widok notatki zawiera tytuł, treść oraz przyciski do edycji i usunięcia.
7. Użytkownik może ręcznie nadawać tytuły notatkom.
8. Brak personalizacji stylu generowanych notatek w MVP.
9. Wykorzystanie PostgreSQL (Supabase) jako bazy danych oraz Next.js dla frontendu.
10. Projektowanie w stylu Mobile first z wykorzystaniem prostego stylu wizualnego (Material UI).
11. Bezpośrednie usuwanie notatek bez kosza.
12. Czas odpowiedzi AI przy generowaniu notatek maksymalnie do 30 sekund.
13. Przechowywanie podstawowych danych użytkownika: username, email, hasło.
14. Termin dostarczenia MVP: 16.05.2025.
    </decisions>

<matched_recommendations>

1. Zdefiniowanie dokładnej struktury notatki (tytuł, treść, data utworzenia).
2. Zastosowanie wyraźnego rozróżnienia wizualnego między trybem AI a trybem manualnym.
3. Zaimplementowanie wskaźnika postępu generowania notatki przez AI (ze względu na czas do 30 sekund).
4. Użycie haszowania haseł i standardowych praktyk bezpieczeństwa dla danych użytkownika.
5. Zaprojektowanie systemu pod kątem przyszłego rozszerzenia o funkcje kategoryzacji i tagowania.
6. Zaimplementowanie mechanizmu walidacji treści wprowadzanej przez użytkownika przed wysłaniem do AI.
7. Uwzględnienie mechanizmu obsługi błędów API AI.
   </matched_recommendations>

<prd_planning_summary>
Projekt Study Notes (MVP) to aplikacja internetowa do tworzenia notatek z materiałów edukacyjnych z wykorzystaniem AI. Głównym celem projektu jest rozwiązanie problemu czasochłonności przygotowywania notatek, co ma pozwolić użytkownikom na efektywniejszą naukę.

**Główne wymagania funkcjonalne:**

- Generowanie notatek (streszczeń) z tekstowych materiałów edukacyjnych przy użyciu AI
- Manualne tworzenie notatek
- Przeglądanie, edycja i usuwanie notatek
- System kont użytkowników do przechowywania notatek
- Sortowanie zapisanych notatek po dacie utworzenia

**Ograniczenia techniczne:**

- Obsługa tylko tekstu jako formatu wejściowego
- Limit tekstu wejściowego: 5000 słów
- Limit notatki wyjściowej: 1000 znaków
- Czas generowania notatki: maksymalnie 30 sekund

**Technologie:**

- Frontend: Next.js
- Backend: Supabase (Backend-as-a-Service)
- Baza danych: PostgreSQL via Supabase
- UI: Prosty styl w duchu Material UI, podejście Mobile first

**Kluczowe historie użytkownika:**

1. Jako użytkownik, chcę się zarejestrować/zalogować, aby móc korzystać z funkcji aplikacji.
2. Jako zalogowany użytkownik, chcę przejrzeć listę moich zapisanych notatek.
3. Jako zalogowany użytkownik, chcę wygenerować notatkę z mojego materiału edukacyjnego przy użyciu AI.
4. Jako zalogowany użytkownik, chcę zweryfikować i edytować wygenerowaną notatkę przed zapisaniem.
5. Jako zalogowany użytkownik, chcę stworzyć notatkę manualnie.
6. Jako zalogowany użytkownik, chcę zobaczyć szczegóły notatki, w tym jej treść.
7. Jako zalogowany użytkownik, chcę edytować istniejącą notatkę.
8. Jako zalogowany użytkownik, chcę usunąć niepotrzebną notatkę.

**Kryteria sukcesu:**

- 75% notatek wygenerowanych przez AI jest akceptowane przez użytkownika
- Użytkownicy tworzą 75% notatek z wykorzystaniem AI

**Interfejs użytkownika:**

- Strona główna z opisem aplikacji i linkiem do strony logowania
- Strona logowania/rejestracji
- Dashboard z listą zapisanych notatek (tytuł, data utworzenia)
- Strona tworzenia notatek z dwoma trybami:
  - Tryb AI: input na tekst źródłowy, przycisk "Generate", wygenerowana notatka, przyciski "Edit"/"Save"
  - Tryb manualny: input na tekst notatki, przycisk "Save"
- Widok szczegółowy notatki: tytuł, treść, przyciski "Edit"/"Delete"

**Dane użytkownika:**

- Username, email, hasło (z odpowiednimi zabezpieczeniami)
  </prd_planning_summary>

<unresolved_issues>

1. Brak zdefiniowanych metryk dla oceny akceptacji notatek generowanych przez AI w MVP.
2. Nie określono mechanizmu autosave podczas edycji notatek.
3. Nie omówiono szczegółów implementacji obsługi błędów API AI.
4. Brak informacji o czasie ładowania i mechanizmach poprawiających UX podczas generowania notatek.
5. Nie sprecyzowano, czy będzie możliwość podglądu oryginalnego tekstu podczas edycji wygenerowanej notatki.
   </unresolved_issues>
   </conversation_summary>
