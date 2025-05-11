-- Migration: Create Schema for Study Notes Application
-- Description: Initial schema creation with notes table, enum types, RLS policies, and triggers
-- Created at: 2025-05-11T10:36:23Z
-- Author: Database Migration System

-- Create custom enum type for note source
create type source_type as enum ('ai', 'manual');

-- Create notes table with constraints
create table notes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title varchar(50) not null check (char_length(title) <= 50),
  content text not null check (char_length(content) <= 1000),
  source_text text null check (source_text is null or char_length(source_text) <= 25000),
  source source_type not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create index for efficient retrieval of user notes sorted by creation date
create index idx_notes_user_id_created_at on notes(user_id, created_at desc);

-- Create trigger function to automatically update the updated_at column
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger to update the updated_at column on row update
create trigger notes_updated_at
before update on notes
for each row
execute function update_updated_at();

-- Enable Row Level Security for notes table
alter table notes enable row level security;

-- RLS Policies for anon role
-- Note: anon users should not have access to notes
create policy "Anon users cannot read notes"
  on notes for select
  to anon
  using (false);

create policy "Anon users cannot insert notes"
  on notes for insert
  to anon
  with check (false);

create policy "Anon users cannot update notes"
  on notes for update
  to anon
  using (false);

create policy "Anon users cannot delete notes"
  on notes for delete
  to anon
  using (false);

-- RLS Policies for authenticated role
-- SELECT policy: users can only read their own notes
create policy "Users can read their own notes"
  on notes for select
  to authenticated
  using (user_id = auth.uid());

-- INSERT policy: users can only create notes with their own user_id
create policy "Users can create their own notes"
  on notes for insert
  to authenticated
  with check (user_id = auth.uid());

-- UPDATE policy: users can only update their own notes
create policy "Users can update their own notes"
  on notes for update
  to authenticated
  using (user_id = auth.uid());

-- DELETE policy: users can only delete their own notes
create policy "Users can delete their own notes"
  on notes for delete
  to authenticated
  using (user_id = auth.uid());

-- Add comment to explain the purpose of the table
comment on table notes is 'Study notes created by users, either manually or through AI assistance'; 