# Architektura UI dla Study Notes

## 1. Przegląd struktury UI

Architektura UI Study Notes jest zaprojektowana jako intuicyjna, responsywna aplikacja webowa wykorzystująca podejście Mobile First. System składa się z trzech głównych sekcji: obszar publiczny (strona główna i strony autentykacji), obszar zalogowany z dashboardem oraz widoki zarządzania notatkami. Architektura opiera się na następujących założeniach:

- Prosty, intuicyjny interfejs zgodny z praktykami UX
- Wyraźne rozróżnienie między trybem AI a trybem manualnym
- Spójny system nawigacji z łatwym dostępem do dashboardu
- Przejrzysta komunikacja stanów systemu (ładowanie, błędy, pustych stanów)
- Czytelna prezentacja notatek z oznaczeniem źródła pochodzenia (AI vs Manual)

## 2. Lista widoków

### Strona Główna (/)

- **Ścieżka widoku**: `/`
- **Główny cel**: Wprowadzenie użytkownika do funkcjonalności aplikacji i zachęcenie do rejestracji/logowania
- **Kluczowe informacje**:
  - Opis aplikacji
  - Sekcja "Jak to działa"
  - Przycisk CTA "Sprawdź sam" kierujący do logowania
- **Kluczowe komponenty**:
  - Hero section z nazwą aplikacji i opisem
  - Sekcja prezentująca funkcjonalności
  - Przycisk CTA
  - Footer z informacjami o prawach autorskich
- **UX/Dostępność/Bezpieczeństwo**:
  - Przejrzysty komunikat wartości aplikacji
  - Responsywny design dla wszystkich urządzeń
  - Dostępna nawigacja dla czytników ekranu

### Strona Logowania (/sign-in)

Aktualnie zaimplementowane. Pomiń.

- **Ścieżka widoku**: `/sign-in`
- **Główny cel**: Autentykacja istniejących użytkowników
- **Kluczowe informacje**:
  - Formularz z polami email i hasło
  - Komunikaty błędów walidacji
  - Link do strony rejestracji
- **Kluczowe komponenty**:
  - Form z shadcn/ui
  - Pola input dla danych uwierzytelniających
  - Przycisk logowania
  - Toast dla komunikatów błędów
- **UX/Dostępność/Bezpieczeństwo**:
  - Walidacja pól formularza
  - Zabezpieczone przesyłanie danych uwierzytelniających
  - Obsługa błędów autentykacji z czytelnymi komunikatami
  - Dostępność za pomocą klawiatury i czytników ekranu

### Strona Rejestracji (/sign-up)

Aktualnie zaimplementowane. Pomiń.

- **Ścieżka widoku**: `/sign-up`
- **Główny cel**: Rejestracja nowych użytkowników
- **Kluczowe informacje**:
  - Formularz z polami username, email, hasło
  - Komunikaty walidacji
  - Link do strony logowania
- **Kluczowe komponenty**:
  - Form z shadcn/ui
  - Pola input dla danych rejestracyjnych
  - Przycisk rejestracji
  - Toast dla komunikatów błędów
- **UX/Dostępność/Bezpieczeństwo**:
  - Walidacja pól (min. 6 znaków dla hasła)
  - Zabezpieczone przesyłanie danych
  - Czytelne komunikaty błędów
  - Dostępność za pomocą klawiatury i czytników ekranu

### Dashboard (/dashboard)

- **Ścieżka widoku**: `/dashboard`
- **Główny cel**: Prezentacja listy notatek użytkownika i nawigacja do funkcji zarządzania notatkami
- **Kluczowe informacje**:
  - Lista notatek z tytułami i datami utworzenia
  - Oznaczenie źródła notatki (AI vs Manual)
  - Opcje sortowania
  - Nazwa użytkownika w headerze
- **Kluczowe komponenty**:
  - Header z nazwą użytkownika i przyciskiem wylogowania
  - Dropdown do sortowania (najnowsze/najstarsze)
  - Lista notatek z Badge komponentem wskazującym źródło
  - EmptyState komponent dla pustej listy
  - Skeleton dla stanu ładowania
  - Przycisk tworzenia nowej notatki
- **UX/Dostępność/Bezpieczeństwo**:
  - Responsywna lista notatek
  - Czytelne formatowanie dat (DD/MM/YYYY)
  - Wyraźne oznaczenia źródła notatki

### Strona Tworzenia Notatki (/notes/create)

- **Ścieżka widoku**: `/notes/create`
- **Główny cel**: Umożliwienie tworzenia notatek w trybie AI lub manualnym
- **Kluczowe informacje**:
  - Przełącznik trybu (AI vs Manual)
  - Formularz dostosowany do wybranego trybu
  - Licznik słów/znaków
  - Podgląd wygenerowanej notatki (dla trybu AI)
- **Kluczowe komponenty**:
  - Switch z shadcn/ui do wyboru trybu
  - TextArea z automatycznym resize (max 400px)
  - WordCounter pokazujący użyte/maksymalne znaki
  - Button dla generowania notatki AI
  - LoadingIndicator z rotującymi komunikatami
  - EditableText dla edycji wygenerowanej notatki
  - Przyciski Save/Cancel
  - ButtonLink "Dashboard" kierujący do /dashboard
- **UX/Dostępność/Bezpieczeństwo**:
  - Walidacja długości tekstu źródłowego (max 5000 słów)
  - Wyraźna informacja o stanie generowania
  - Możliwość edycji wygenerowanej notatki przed zapisaniem
  - Czytelne komunikaty o błędach API AI

### Szczegóły Notatki (/notes/[id])

- **Ścieżka widoku**: `/notes/[id]`
- **Główny cel**: Wyświetlenie pełnej treści notatki wraz z opcjami zarządzania
- **Kluczowe informacje**:
  - Tytuł notatki
  - Treść notatki
  - Data utworzenia
  - Źródło notatki (AI vs Manual)
  - Tekst źródłowy (dla notatek AI) w komponencie Collapsible z shadcn/ui
- **Kluczowe komponenty**:
  - Pełnoekranowy widok notatki na urządzeniach mobilnych
  - Badge wskazujący źródło
  - Przyciski Edit i Delete
  - ButtonLink "Dashboard" kierujący do /dashboard
  - AlertDialog dla potwierdzenia usunięcia
- **UX/Dostępność/Bezpieczeństwo**:
  - Czytelna prezentacja treści
  - Potwierdzenie przed usunięciem
  - Toast dla potwierdzenia akcji
  - Animacje przejść z framer-motion

### Edycja Notatki (/notes/[id]?editMode=true)

- **Ścieżka widoku**: `/notes/[id]?editMode=true`
- **Główny cel**: Umożliwienie edycji istniejącej notatki
- **Kluczowe informacje**:
  - Formularz z aktualną treścią notatki
  - Licznik słów/znaków
  - Opcje zapisania lub anulowania zmian
- **Kluczowe komponenty**:
  - Form z shadcn/ui
  - TextArea dla edycji treści
  - WordCounter
  - Przyciski Save/Cancel
  - ButtonLink "Dashboard" kierujący do /dashboard
- **UX/Dostępność/Bezpieczeństwo**:
  - Walidacja długości treści (max 1000 znaków)

## 3. Mapa podróży użytkownika

### Główna podróż: Tworzenie notatki przy pomocy AI

1. Użytkownik wchodzi na stronę główną
2. Klika przycisk "Sprawdź sam"
3. Loguje się lub rejestruje nowe konto
4. Zostaje przekierowany do dashboardu
5. Klika przycisk "Stwórz notatkę"
6. Upewnia się, że tryb AI jest wybrany (domyślny)
7. Wprowadza tekst źródłowy
8. Klika przycisk "Generuj"
9. Obserwuje wskaźnik postępu z komunikatami
10. Przegląda wygenerowaną notatkę
11. Opcjonalnie edytuje treść i tytuł
12. Klika przycisk "Zapisz"
13. Zostaje przekierowany do dashboardu, gdzie widzi nową notatkę
14. Może kliknąć na notatkę, aby zobaczyć szczegóły

### Alternatywne podróże

#### Tworzenie notatki manualnie

1. Użytkownik przechodzi kroki 1-5 jak wyżej
2. Przełącza tryb na "Manual" za pomocą Switch
3. Wprowadza tytuł i treść notatki
4. Klika przycisk "Zapisz"
5. Zostaje przekierowany do dashboardu z nową notatką

#### Edycja notatki

1. Użytkownik przechodzi do dashboardu
2. Klika na notatkę, aby zobaczyć szczegóły
3. Klika przycisk "Edytuj"
4. Modyfikuje tytuł i/lub treść
5. Klika przycisk "Zapisz"
6. Zostaje przekierowany do widoku szczegółów zaktualizowanej notatki

#### Usuwanie notatki

1. Użytkownik przechodzi do dashboardu
2. Klika na notatkę, aby zobaczyć szczegóły
3. Klika przycisk "Usuń"
4. Potwierdza chęć usunięcia w AlertDialog
5. Zostaje przekierowany do dashboardu, gdzie notatka jest już usunięta

## 4. Układ i struktura nawigacji

### Nawigacja publiczna (niezalogowany)

- **Header**:
  - Logo/Nazwa aplikacji (link do strony głównej)
  - Przyciski Logowanie/Rejestracja
- **Footer**:
  - Informacje o prawach autorskich

### Nawigacja zalogowanego użytkownika

- **Header**:
  - Logo/Nazwa aplikacji (link do dashboardu)
  - Nazwa użytkownika (nieinteraktywna)
  - Przycisk wylogowania
- **Nawigacja dashboardu**:
  - Przycisk "Stwórz notatkę"
  - Lista notatek (klikalnych)
  - Dropdown sortowania
- **Nawigacja widoku notatki**:
  - ButtonLink "Dashboard" z ikoną strzałki w lewo
  - Przyciski akcji (Edytuj, Usuń)
- **Nawigacja formularza**:
  - ButtonLink "Dashboard" z ikoną strzałki w lewo
  - Przyciski akcji (Zapisz, Anuluj)

### Konsystencja nawigacji

- ButtonLink "Dashboard" widoczny na wszystkich stronach dla zalogowanego użytkownika oprócz strony Dashboard
- Spójne oznaczenie aktualnej lokalizacji
- Animacje przejść między widokami z framer-motion

## 5. Kluczowe komponenty

### AuthLayout

- Komponent layoutu dla stron wymagających autentykacji
- Zapewnia konsystentny wygląd i nawigację dla zalogowanych użytkowników
- Zawiera Header z nazwą użytkownika i przyciskiem wylogowania
- Weryfikuje stan sesji i przekierowuje na stronę logowania w razie potrzeby

### Header

- Logo aplikacji (link do dashboardu lub strony głównej zależnie od stanu logowania)
- Nazwa użytkownika (dla zalogowanych)
- Przycisk wylogowania (dla zalogowanych)
- Przyciski logowania/rejestracji (dla niezalogowanych)

### NotesList

- Lista notatek użytkownika
- Każdy element zawiera tytuł, datę utworzenia i Badge źródła
- Umożliwia sortowanie przez Dropdown
- Obsługuje stany ładowania (Skeleton) i pusty stan (EmptyState)

### EditableText

- Custom komponent przełączający się między TextArea a paragrafem
- Przyjmuje parametry content i editMode
- Używany do edycji treści notatki
- Integruje się z WordCounter dla liczenia znaków

### NoteForm

- Formularz do tworzenia i edycji notatek
- Obsługuje oba tryby (AI i Manual)
- Zawiera walidację pól i przesyłanie danych do API
- Integruje WordCounter i Switch dla wyboru trybu

### Switch

- Komponent z shadcn/ui do przełączania między trybami AI i Manual
- Wyraźne oznaczenie aktualnego trybu
- Dostępny dla nawigacji klawiaturą

### WordCounter

- Wyświetla liczbę użytych/maksymalnych znaków (np. 11/1000)
- Zmienia kolor na czerwony przy przekroczeniu limitu
- Znajduje się w prawym dolnym rogu TextArea

### LoadingIndicator

- Wyświetla rotujące komunikaty podczas generowania notatki przez AI
- Wizualnie informuje o postępie procesu
- Zapobiega poczuciu "zamrożenia" interfejsu

### EmptyState

- Komponent wyświetlany gdy lista notatek jest pusta
- Zawiera komunikat i sugestię utworzenia pierwszej notatki
- Opcjonalnie zawiera przycisk CTA

### Badge

- Komponent z shadcn/ui oznaczający źródło notatki (AI vs Manual)
- Konsystentny wizualnie w całej aplikacji
- Zapewnia szybką identyfikację typu notatki

### Toast

- System powiadomień dla komunikatów o błędach, sukcesach i ostrzeżeniach
- Wyświetlany przez 5 sekund
- Niski poziom szczegółowości błędów dla użytkownika

### AlertDialog

- Komponent potwierdzenia dla krytycznych akcji (np. usunięcie notatki)
- Zawiera przyciski potwierdzenia i anulowania
- Zabezpiecza przed przypadkowym wykonaniem nieodwracalnych operacji

### ButtonLink

- Komponent nawigacyjny do powrotu do dashboardu
- Zawiera ikonę strzałki w lewo i tekst "Dashboard"
- Widoczny na wszystkich stronach dla zalogowanego użytkownika
