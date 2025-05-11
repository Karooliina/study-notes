# Dokument wymagań produktu (PRD) - Study Notes

## 1. Przegląd produktu

Study Notes to aplikacja internetowa zaprojektowana do tworzenia zwięzłych notatek z materiałów edukacyjnych przy użyciu sztucznej inteligencji (AI). Aplikacja posiada dwa główne tryby działania: generowanie notatek przez AI oraz tworzenie notatek manualnie. Celem produktu jest przyspieszenie procesu przygotowania notatek, co pozwala użytkownikom na bardziej efektywne wykorzystanie czasu na naukę.

Aplikacja będzie zbudowana z wykorzystaniem Next.js dla frontendu, Supabase jako Backend-as-a-Service oraz bazy danych PostgreSQL. Interfejs użytkownika będzie zaprojektowany zgodnie z zasadą Mobile first, zachowując prosty i intuicyjny styl inspirowany Material UI.

Termin dostarczenia MVP został ustalony na 16.05.2025.

## 2. Problem użytkownika

Przygotowanie notatek z materiałów edukacyjnych jest czasochłonnym procesem, który zabiera czas, który mógłby zostać przeznaczony na faktyczną naukę. Studenci i osoby uczące się często spędzają znaczną część czasu na tworzeniu streszczeń i wyodrębnianiu kluczowych informacji z obszernych materiałów edukacyjnych.

Study Notes rozwiązuje ten problem poprzez:

- Automatyczne generowanie zwięzłych i jakościowych notatek z dostarczonych materiałów przy pomocy AI
- Oferowanie prostego interfejsu do tworzenia, przechowywania i zarządzania notatkami
- Umożliwienie szybkiego dostępu do wcześniej utworzonych notatek

## 3. Wymagania funkcjonalne

1. Rejestracja i uwierzytelnianie użytkowników

   - System kont użytkowników z podstawowymi danymi: username, email, hasło
   - Bezpieczne przechowywanie danych użytkowników
   - Wymagane logowanie do korzystania z funkcjonalności aplikacji

2. Generowanie notatek przez AI

   - Przyjmowanie tekstu źródłowego do maksymalnie 5000 słów
   - Generowanie notatek o długości do 1000 znaków
   - Czas odpowiedzi AI: maksymalnie 30 sekund
   - Wskaźnik postępu podczas generowania notatki
   - Możliwość edycji wygenerowanej notatki przed zapisaniem
   - Obsługa błędów API AI
   - Nadawanie tytułów notatkom
   - Zapisywanie notatek w bazie danych

3. Manualne tworzenie notatek

   - Interfejs do wprowadzania własnych notatek
   - Nadawanie tytułów notatkom
   - Zapisywanie notatek w bazie danych

4. Zarządzanie notatkami

   - Lista zapisanych notatek z tytułami i datami utworzenia
   - Sortowanie notatek według daty utworzenia
   - Przeglądanie szczegółów notatek
   - Edycja istniejących notatek
   - Usuwanie notatek

5. Interfejs użytkownika
   - Strona główna z opisem aplikacji
   - Dashboard z listą zapisanych notatek
   - Wyraźne rozróżnienie wizualne między trybem AI a trybem manualnym
   - Widok szczegółowy notatki
   - Responsywny design z podejściem Mobile first

## 4. Granice produktu

W zakres MVP Study Notes NIE wchodzą następujące funkcjonalności:

1. Eksportowanie notatek do różnych formatów
2. Import materiałów w formatach innych niż tekst (PDF, DOCX, itp.)
3. Współdzielenie notatek między użytkownikami
4. Integracje z zewnętrznymi platformami edukacyjnymi
5. Aplikacje mobilne (na początek tylko wersja webowa)
6. Filtrowanie notatek według kryteriów innych niż data utworzenia
7. Kategoryzowanie notatek według tematu czy przedmiotu
8. Dodawanie tagów do notatek
9. Zmiana ustawień użytkownika
10. Personalizacja stylu generowanych notatek
11. Mechanizm kosza (usunięte notatki są usuwane bezpośrednio)

## 5. Historyjki użytkowników

### US-001: Rejestracja użytkownika

Jako nowy użytkownik, chcę utworzyć konto w aplikacji, aby móc korzystać z jej funkcjonalności.

Kryteria akceptacji:

- Formularz rejestracji zawiera pola: nazwa użytkownika, email i hasło
- System weryfikuje unikalność adresu email
- Hasło jest przechowywane w bezpieczny sposób (hashowanie)
- Po udanej rejestracji, użytkownik otrzymuje potwierdzenie
- W przypadku błędów podczas rejestracji, użytkownik dostaje odpowiednie komunikaty

### US-002: Logowanie użytkownika

Jako zarejestrowany użytkownik, chcę zalogować się do aplikacji, aby uzyskać dostęp do moich notatek.

Kryteria akceptacji:

- Formularz logowania zawiera pola: email i hasło
- System weryfikuje poprawność wprowadzonych danych
- Po udanym logowaniu, użytkownik jest przekierowany do dashboardu
- W przypadku błędnych danych, system wyświetla odpowiedni komunikat

### US-003: Wylogowanie użytkownika

Jako zalogowany użytkownik, chcę wylogować się z aplikacji, aby zabezpieczyć moje konto.

Kryteria akceptacji:

- Przycisk wylogowania jest dostępny w interfejsie
- Po wylogowaniu, użytkownik traci dostęp do chronionych zasobów
- Użytkownik jest przekierowany na stronę główną

### US-004: Przeglądanie dashboardu z notatkami

Jako zalogowany użytkownik, chcę zobaczyć listę moich notatek, aby szybko znaleźć potrzebne informacje.

Kryteria akceptacji:

- Dashboard wyświetla listę notatek z tytułami i datami utworzenia
- Notatki są domyślnie sortowane według daty utworzenia (od najnowszych)
- Interfejs jest przejrzysty i responsywny
- Wyświetlany jest komunikat, gdy użytkownik nie ma jeszcze żadnych notatek

### US-005: Generowanie notatki przez AI

Jako zalogowany użytkownik, chcę wygenerować notatkę z dostarczonego materiału edukacyjnego przy pomocy AI, aby zaoszczędzić czas.

Kryteria akceptacji:

- Interfejs pozwala na wprowadzenie tekstu źródłowego
- System weryfikuje, czy wprowadzony tekst nie przekracza limitu 5000 słów
- Po naciśnięciu przycisku "Generuj", system wysyła zapytanie do API AI
- Podczas generowania wyświetlany jest wskaźnik postępu
- Wygenerowana notatka nie przekracza 1000 znaków
- Czas generowania nie przekracza 30 sekund
- System obsługuje błędy API AI i wyświetla odpowiednie komunikaty

### US-006: Edycja wygenerowanej notatki przed zapisaniem

Jako zalogowany użytkownik, chcę zweryfikować i edytować wygenerowaną notatkę przed zapisaniem, aby dopasować ją do moich potrzeb.

Kryteria akceptacji:

- Po wygenerowaniu notatki, system wyświetla jej treść w edytowalnym polu
- Użytkownik może modyfikować treść notatki
- Istnieje możliwość wprowadzenia lub edycji tytułu notatki
- Dostępne są przyciski "Zapisz" i "Anuluj"
- Po zapisaniu, system potwierdza zapisanie notatki

### US-007: Manualne tworzenie notatki

Jako zalogowany użytkownik, chcę stworzyć notatkę ręcznie, gdy wolę napisać ją samodzielnie.

Kryteria akceptacji:

- Interfejs pozwala na przełączenie się na tryb manualny
- Dostępne są pola do wprowadzenia tytułu i treści notatki
- Po naciśnięciu przycisku "Zapisz", notatka jest zapisywana w systemie
- System potwierdza zapisanie notatki

### US-008: Przeglądanie szczegółów notatki

Jako zalogowany użytkownik, chcę zobaczyć pełną treść notatki, aby zapoznać się z jej zawartością.

Kryteria akceptacji:

- Po kliknięciu na notatkę w dashboardzie, system wyświetla jej szczegóły
- Widok szczegółowy zawiera tytuł i pełną treść notatki
- Dostępne są opcje edycji i usunięcia notatki
- Interfejs jest czytelny i responsywny

### US-009: Edycja istniejącej notatki

Jako zalogowany użytkownik, chcę edytować wcześniej utworzoną notatkę, aby zaktualizować jej zawartość.

Kryteria akceptacji:

- W widoku szczegółowym notatki dostępny jest przycisk "Edytuj"
- Po naciśnięciu przycisku, system wyświetla edytowalny formularz z aktualną treścią notatki
- Użytkownik może modyfikować tytuł i treść notatki
- Po zapisaniu zmian, system aktualizuje notatkę i wyświetla komunikat potwierdzający

### US-010: Usuwanie notatki

Jako zalogowany użytkownik, chcę usunąć niepotrzebną notatkę, aby utrzymać porządek w swoich materiałach.

Kryteria akceptacji:

- W widoku szczegółowym notatki dostępny jest przycisk "Usuń"
- Przed usunięciem, system prosi o potwierdzenie operacji
- Po potwierdzeniu, notatka jest trwale usuwana z systemu
- System wyświetla komunikat potwierdzający usunięcie
- Użytkownik jest przekierowany z powrotem do dashboardu

### US-011: Obsługa błędów generowania przez AI

Jako zalogowany użytkownik, chcę otrzymać jasne komunikaty w przypadku problemów z generowaniem notatki przez AI, aby wiedzieć, co poszło nie tak.

Kryteria akceptacji:

- System wykrywa i obsługuje typowe błędy API AI
- Użytkownik otrzymuje czytelne komunikaty o błędach
- W przypadku problemów z połączeniem, system sugeruje ponowną próbę
- Jeśli tekst przekracza limity, system informuje o tym przed wysłaniem zapytania

### US-012: Walidacja wprowadzanego tekstu

Jako zalogowany użytkownik, chcę otrzymać informację o limitach tekstu, aby nie przekroczyć dozwolonych wartości.

Kryteria akceptacji:

- System wyświetla licznik słów podczas wprowadzania tekstu źródłowego
- Tekst przekraczający limit 5000 słów jest oznaczany wizualnie
- System zapobiega wysłaniu zbyt długiego tekstu do API AI
- Użytkownik otrzymuje jasne komunikaty o limitach

## 6. Metryki sukcesu

1. Akceptacja notatek generowanych przez AI

   - Cel: 75% notatek wygenerowanych przez AI jest akceptowanych przez użytkowników bez edycji
   - Pomiar: Stosunek notatek zaakceptowanych bez edycji do wszystkich wygenerowanych notatek

2. Wykorzystanie AI do tworzenia notatek

   - Cel: 75% wszystkich notatek w systemie jest tworzonych z wykorzystaniem AI
   - Pomiar: Stosunek notatek wygenerowanych przez AI do wszystkich notatek w systemie
