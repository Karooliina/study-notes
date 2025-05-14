Directory structure:
└── karooliina-study-notes/
    ├── README.md
    ├── components.json
    ├── jest.config.js
    ├── next.config.ts
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── .env.example
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── middleware.ts
    │   ├── page.tsx
    │   ├── types.ts
    │   ├── (auth-pages)/
    │   │   ├── layout.tsx
    │   │   ├── sign-in/
    │   │   │   └── page.tsx
    │   │   └── sign-up/
    │   │       └── page.tsx
    │   ├── (user-pages)/
    │   │   ├── layout.tsx
    │   │   ├── components/
    │   │   │   ├── CharCounter.tsx
    │   │   │   ├── DashboardButton.tsx
    │   │   │   ├── DeleteConfirmationDialog.tsx
    │   │   │   ├── FormFields.tsx
    │   │   │   ├── NoteSourceBadge.tsx
    │   │   │   └── SourceTextCollapsible.tsx
    │   │   ├── dashboard/
    │   │   │   ├── error.tsx
    │   │   │   ├── loading.tsx
    │   │   │   ├── page.tsx
    │   │   │   ├── types.ts
    │   │   │   └── components/
    │   │   │       ├── NoteCardSkeleton.tsx
    │   │   │       ├── NotesList.tsx
    │   │   │       └── NoteListItem/
    │   │   │           ├── NoteListItem.module.scss
    │   │   │           └── NoteListItem.tsx
    │   │   └── notes/
    │   │       ├── [id]/
    │   │       │   ├── page.tsx
    │   │       │   ├── types.ts
    │   │       │   └── components/
    │   │       │       ├── EditModeForm.tsx
    │   │       │       ├── ViewModeActions.tsx
    │   │       │       └── ViewModeContent.tsx
    │   │       └── create/
    │   │           ├── page.tsx
    │   │           ├── types.ts
    │   │           └── components/
    │   │               ├── AiNoteForm.tsx
    │   │               ├── CreateNoteForm.tsx
    │   │               ├── ManualNoteForm.tsx
    │   │               └── ModeSwitcher.tsx
    │   ├── actions/
    │   │   ├── ai.ts
    │   │   ├── auth.ts
    │   │   ├── index.ts
    │   │   └── notes.ts
    │   ├── auth/
    │   │   └── callback/
    │   │       └── route.ts
    │   ├── components/
    │   │   ├── Footer.tsx
    │   │   ├── FormMessage.tsx
    │   │   ├── Header.tsx
    │   │   ├── HeaderAuth.tsx
    │   │   ├── LoadingSpinner.tsx
    │   │   ├── SubmitButton.tsx
    │   │   └── landing/
    │   │       ├── CallToActionButton.tsx
    │   │       ├── FeaturesSection.tsx
    │   │       └── HeroSection.tsx
    │   └── schemas/
    │       ├── forms.ts
    │       └── notes.ts
    ├── components/
    │   ├── typography/
    │   │   └── inline-code.tsx
    │   └── ui/
    │       ├── alert-dialog.tsx
    │       ├── alert.tsx
    │       ├── badge.tsx
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── checkbox.tsx
    │       ├── collapsible.tsx
    │       ├── dropdown-menu.tsx
    │       ├── form.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       ├── skeleton.tsx
    │       ├── sonner.tsx
    │       ├── switch.tsx
    │       └── textarea.tsx
    ├── db/
    │   └── database.types.ts
    ├── lib/
    │   └── utils.ts
    ├── services/
    │   ├── aiService.ts
    │   └── notesService.ts
    ├── supabase/
    │   ├── config.toml
    │   ├── .gitignore
    │   └── migrations/
    │       └── 20250511103623_create_notes_schema.sql
    ├── tests/
    │   └── test-example.test.ts
    └── utils/
        ├── utils.ts
        └── supabase/
            ├── client.ts
            ├── server.ts
            └── updateSession.ts
