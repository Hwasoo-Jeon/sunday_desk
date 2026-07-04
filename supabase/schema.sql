-- My Portfolio Studio Supabase schema
-- Apply this file in the Supabase SQL editor or through Supabase migrations.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text not null default '',
  headline text,
  bio text,
  location text,
  email text,
  avatar_url text,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text,
  level text,
  display_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint skills_name_not_blank check (length(btrim(name)) > 0)
);

create table if not exists public.profile_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null,
  url text not null,
  kind text not null default 'other',
  display_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profile_links_label_not_blank check (length(btrim(label)) > 0),
  constraint profile_links_url_not_blank check (length(btrim(url)) > 0)
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  slug text not null,
  summary text,
  period_start date,
  period_end date,
  role text,
  company_or_context text,
  tech_stack text[] not null default '{}',
  problem text,
  solution text,
  result text,
  contribution text,
  links jsonb not null default '[]'::jsonb,
  is_published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_title_not_blank check (length(btrim(title)) > 0),
  constraint projects_slug_not_blank check (length(btrim(slug)) > 0),
  constraint projects_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint projects_user_slug_unique unique (user_id, slug)
);

create table if not exists public.project_sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  source_type text not null default 'manual_note',
  title text,
  content text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint project_sources_source_type_not_blank check (length(btrim(source_type)) > 0)
);

create table if not exists public.generated_outputs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  output_type text not null,
  title text not null,
  content_markdown text not null,
  input_snapshot jsonb not null default '{}'::jsonb,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint generated_outputs_type_allowed check (
    output_type in (
      'portfolio_description',
      'resume_bullets',
      'interview_qa',
      'self_intro',
      'project_case_study'
    )
  ),
  constraint generated_outputs_title_not_blank check (length(btrim(title)) > 0)
);

create table if not exists public.resume_bullets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  generated_output_id uuid references public.generated_outputs(id) on delete set null,
  content text not null,
  display_order integer not null default 0,
  is_visible boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint resume_bullets_content_not_blank check (length(btrim(content)) > 0)
);

create table if not exists public.interview_questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  generated_output_id uuid references public.generated_outputs(id) on delete set null,
  question text not null,
  answer text not null,
  display_order integer not null default 0,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint interview_questions_question_not_blank check (length(btrim(question)) > 0),
  constraint interview_questions_answer_not_blank check (length(btrim(answer)) > 0)
);

create index if not exists profiles_user_id_idx on public.profiles(user_id);
create index if not exists skills_user_visible_order_idx on public.skills(user_id, is_visible, display_order);
create index if not exists profile_links_user_visible_order_idx on public.profile_links(user_id, is_visible, display_order);
create index if not exists projects_user_published_order_idx on public.projects(user_id, is_published, display_order);
create index if not exists projects_slug_published_idx on public.projects(slug, is_published);
create index if not exists project_sources_project_id_idx on public.project_sources(project_id);
create index if not exists project_sources_user_id_idx on public.project_sources(user_id);
create index if not exists generated_outputs_project_type_idx on public.generated_outputs(project_id, output_type);
create index if not exists generated_outputs_user_favorite_idx on public.generated_outputs(user_id, is_favorite);
create index if not exists resume_bullets_project_order_idx on public.resume_bullets(project_id, display_order);
create index if not exists interview_questions_project_order_idx on public.interview_questions(project_id, display_order);

grant usage on schema public to anon, authenticated;

grant select on public.profiles to anon, authenticated;
grant select on public.skills to anon, authenticated;
grant select on public.profile_links to anon, authenticated;
grant select on public.projects to anon, authenticated;
grant select on public.generated_outputs to anon, authenticated;

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.skills to authenticated;
grant select, insert, update, delete on public.profile_links to authenticated;
grant select, insert, update, delete on public.projects to authenticated;
grant select, insert, update, delete on public.project_sources to authenticated;
grant select, insert, update, delete on public.generated_outputs to authenticated;
grant select, insert, update, delete on public.resume_bullets to authenticated;
grant select, insert, update, delete on public.interview_questions to authenticated;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_skills_updated_at on public.skills;
create trigger set_skills_updated_at
before update on public.skills
for each row execute function public.set_updated_at();

drop trigger if exists set_profile_links_updated_at on public.profile_links;
create trigger set_profile_links_updated_at
before update on public.profile_links
for each row execute function public.set_updated_at();

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists set_project_sources_updated_at on public.project_sources;
create trigger set_project_sources_updated_at
before update on public.project_sources
for each row execute function public.set_updated_at();

drop trigger if exists set_generated_outputs_updated_at on public.generated_outputs;
create trigger set_generated_outputs_updated_at
before update on public.generated_outputs
for each row execute function public.set_updated_at();

drop trigger if exists set_resume_bullets_updated_at on public.resume_bullets;
create trigger set_resume_bullets_updated_at
before update on public.resume_bullets
for each row execute function public.set_updated_at();

drop trigger if exists set_interview_questions_updated_at on public.interview_questions;
create trigger set_interview_questions_updated_at
before update on public.interview_questions
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.skills enable row level security;
alter table public.profile_links enable row level security;
alter table public.projects enable row level security;
alter table public.project_sources enable row level security;
alter table public.generated_outputs enable row level security;
alter table public.resume_bullets enable row level security;
alter table public.interview_questions enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "profiles_select_public" on public.profiles;
create policy "profiles_select_public"
on public.profiles
for select
to anon, authenticated
using (is_public = true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own"
on public.profiles
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "skills_select_own" on public.skills;
create policy "skills_select_own"
on public.skills
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "skills_select_visible" on public.skills;
create policy "skills_select_visible"
on public.skills
for select
to anon, authenticated
using (is_visible = true);

drop policy if exists "skills_insert_own" on public.skills;
create policy "skills_insert_own"
on public.skills
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "skills_update_own" on public.skills;
create policy "skills_update_own"
on public.skills
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "skills_delete_own" on public.skills;
create policy "skills_delete_own"
on public.skills
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "profile_links_select_own" on public.profile_links;
create policy "profile_links_select_own"
on public.profile_links
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "profile_links_select_visible" on public.profile_links;
create policy "profile_links_select_visible"
on public.profile_links
for select
to anon, authenticated
using (is_visible = true);

drop policy if exists "profile_links_insert_own" on public.profile_links;
create policy "profile_links_insert_own"
on public.profile_links
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "profile_links_update_own" on public.profile_links;
create policy "profile_links_update_own"
on public.profile_links
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "profile_links_delete_own" on public.profile_links;
create policy "profile_links_delete_own"
on public.profile_links
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "projects_select_own" on public.projects;
create policy "projects_select_own"
on public.projects
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "projects_select_published" on public.projects;
create policy "projects_select_published"
on public.projects
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "projects_insert_own" on public.projects;
create policy "projects_insert_own"
on public.projects
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "projects_update_own" on public.projects;
create policy "projects_update_own"
on public.projects
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "projects_delete_own" on public.projects;
create policy "projects_delete_own"
on public.projects
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "project_sources_select_own" on public.project_sources;
create policy "project_sources_select_own"
on public.project_sources
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "project_sources_insert_own" on public.project_sources;
create policy "project_sources_insert_own"
on public.project_sources
for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.projects
    where projects.id = project_sources.project_id
      and projects.user_id = auth.uid()
  )
);

drop policy if exists "project_sources_update_own" on public.project_sources;
create policy "project_sources_update_own"
on public.project_sources
for update
to authenticated
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.projects
    where projects.id = project_sources.project_id
      and projects.user_id = auth.uid()
  )
);

drop policy if exists "project_sources_delete_own" on public.project_sources;
create policy "project_sources_delete_own"
on public.project_sources
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "generated_outputs_select_own" on public.generated_outputs;
create policy "generated_outputs_select_own"
on public.generated_outputs
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "generated_outputs_select_public_favorite_portfolio" on public.generated_outputs;
create policy "generated_outputs_select_public_favorite_portfolio"
on public.generated_outputs
for select
to anon, authenticated
using (
  output_type = 'portfolio_description'
  and is_favorite = true
  and exists (
    select 1
    from public.projects
    where projects.id = generated_outputs.project_id
      and projects.is_published = true
  )
);

drop policy if exists "generated_outputs_insert_own" on public.generated_outputs;
create policy "generated_outputs_insert_own"
on public.generated_outputs
for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.projects
    where projects.id = generated_outputs.project_id
      and projects.user_id = auth.uid()
  )
);

drop policy if exists "generated_outputs_update_own" on public.generated_outputs;
create policy "generated_outputs_update_own"
on public.generated_outputs
for update
to authenticated
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.projects
    where projects.id = generated_outputs.project_id
      and projects.user_id = auth.uid()
  )
);

drop policy if exists "generated_outputs_delete_own" on public.generated_outputs;
create policy "generated_outputs_delete_own"
on public.generated_outputs
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "resume_bullets_select_own" on public.resume_bullets;
create policy "resume_bullets_select_own"
on public.resume_bullets
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "resume_bullets_insert_own" on public.resume_bullets;
create policy "resume_bullets_insert_own"
on public.resume_bullets
for insert
to authenticated
with check (
  auth.uid() = user_id
  and (
    project_id is null
    or exists (
      select 1
      from public.projects
      where projects.id = resume_bullets.project_id
        and projects.user_id = auth.uid()
    )
  )
  and (
    generated_output_id is null
    or exists (
      select 1
      from public.generated_outputs
      where generated_outputs.id = resume_bullets.generated_output_id
        and generated_outputs.user_id = auth.uid()
    )
  )
);

drop policy if exists "resume_bullets_update_own" on public.resume_bullets;
create policy "resume_bullets_update_own"
on public.resume_bullets
for update
to authenticated
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and (
    project_id is null
    or exists (
      select 1
      from public.projects
      where projects.id = resume_bullets.project_id
        and projects.user_id = auth.uid()
    )
  )
  and (
    generated_output_id is null
    or exists (
      select 1
      from public.generated_outputs
      where generated_outputs.id = resume_bullets.generated_output_id
        and generated_outputs.user_id = auth.uid()
    )
  )
);

drop policy if exists "resume_bullets_delete_own" on public.resume_bullets;
create policy "resume_bullets_delete_own"
on public.resume_bullets
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "interview_questions_select_own" on public.interview_questions;
create policy "interview_questions_select_own"
on public.interview_questions
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "interview_questions_insert_own" on public.interview_questions;
create policy "interview_questions_insert_own"
on public.interview_questions
for insert
to authenticated
with check (
  auth.uid() = user_id
  and (
    project_id is null
    or exists (
      select 1
      from public.projects
      where projects.id = interview_questions.project_id
        and projects.user_id = auth.uid()
    )
  )
  and (
    generated_output_id is null
    or exists (
      select 1
      from public.generated_outputs
      where generated_outputs.id = interview_questions.generated_output_id
        and generated_outputs.user_id = auth.uid()
    )
  )
);

drop policy if exists "interview_questions_update_own" on public.interview_questions;
create policy "interview_questions_update_own"
on public.interview_questions
for update
to authenticated
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and (
    project_id is null
    or exists (
      select 1
      from public.projects
      where projects.id = interview_questions.project_id
        and projects.user_id = auth.uid()
    )
  )
  and (
    generated_output_id is null
    or exists (
      select 1
      from public.generated_outputs
      where generated_outputs.id = interview_questions.generated_output_id
        and generated_outputs.user_id = auth.uid()
    )
  )
);

drop policy if exists "interview_questions_delete_own" on public.interview_questions;
create policy "interview_questions_delete_own"
on public.interview_questions
for delete
to authenticated
using (auth.uid() = user_id);
