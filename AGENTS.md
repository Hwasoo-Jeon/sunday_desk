# AGENTS.md

## Project Name

Sunday Desk

Subtitle: A quiet Sunday space to shape your work into a portfolio.

## Local Project Path

- Current local path: `C:\Users\hsjeon\git\sunday_desk`
- Previous working folder name `portfolio_studio_agent` is no longer the project path.

## Product Definition

This project is a personal portfolio website with an admin studio.

It has two main parts:

1. Public Portfolio Website  
   - Shows my profile, skills, projects, project details, and contact information.
   - This is the final portfolio that visitors will see.

2. Admin Portfolio Studio  
   - Lets me manage projects, raw notes, career descriptions, resume bullets, and interview Q&A.
   - Helps convert messy project experience into structured portfolio content.
   - This is not a generic portfolio site builder.
   - This is a personal portfolio CMS and career writing assistant.

The first goal is to complete my own portfolio website.  
The second goal is to keep the structure extensible so that this can later become a tool other people can use to create their own portfolio.

## Core Product Direction

This app is not a visual website builder.

Do not focus on:
- drag-and-drop editing
- theme marketplace
- complex design builder
- animation-heavy templates
- generic landing page builder features

Focus on:
- organizing developer project experience
- converting raw work notes into career-ready writing
- showing selected content on a clean public portfolio site
- managing portfolio content from an admin page

## Target User

MVP target user: me, the portfolio owner.

Future target user: developers or IT workers who want to organize their experience into a portfolio, resume bullets, and interview answers.

## MVP Goal

Build a working portfolio website and admin studio.

The user should be able to:

1. Visit the public portfolio site.
2. See About, Skills, Projects, Project Detail, and Contact sections.
3. Log into the admin area.
4. Create, edit, delete, and publish projects.
5. Add raw project notes.
6. Generate or draft:
   - portfolio project description
   - resume bullets
   - interview Q&A
7. Save generated content.
8. Choose what content appears on the public site.
9. Copy generated content as Markdown.

## Tech Stack

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL
- Supabase Row Level Security
- Supabase Storage prepared for future use
- Vercel deployment target

## Free-first Policy

The MVP should avoid paid AI API usage.

Do not call OpenAI API, Anthropic API, Gemini API, or any other paid LLM API in the MVP.

Instead, implement a mock/template-based generator that transforms user input into structured Korean career writing.

The generator should be designed behind an interface so that it can later be replaced by an OpenAI API generator.

## Public Site Scope

Public pages:

- `/`
- `/about`
- `/projects`
- `/projects/[slug]`
- `/contact`

The public site should be clean, professional, and developer-oriented.

It should display only published projects.

Each project detail page should show:

- project title
- summary
- period
- role
- tech stack
- context
- contribution
- problem
- solution
- result
- links if available

## Admin Scope

Admin pages:

- `/admin`
- `/admin/login`
- `/admin/projects`
- `/admin/projects/new`
- `/admin/projects/[id]`
- `/admin/generator`
- `/admin/outputs`

Admin features:

- login/logout
- project CRUD
- publish/unpublish project
- source note CRUD
- generated output history
- favorite output
- markdown copy

## MVP Features

Include:

- Public portfolio pages
- Admin login/logout
- Admin dashboard
- Project CRUD
- Project publish status
- Project slug
- Project source note CRUD
- Template-based portfolio description generation
- Template-based resume bullet generation
- Template-based interview Q&A generation
- Save generated outputs
- Favorite generated outputs
- Copy as Markdown
- Basic README setup guide
- Supabase schema SQL
- RLS policies

## Exclude from MVP

Do not implement these yet:

- OpenAI API actual call
- User-provided API key
- GitHub/GitLab integration
- File upload
- PDF export
- Notion export
- Vector DB / RAG
- Payment
- Team workspace
- Multiple portfolio themes
- Drag-and-drop site builder
- Public SaaS onboarding flow

## Future Extension Direction

Keep the structure extensible for:

- Other users creating their own portfolio
- User-specific public portfolio URL
- OpenAI API generator
- User-provided API key
- GitHub/GitLab import
- File upload
- PDF export
- Notion export
- pgvector-based RAG
- Public portfolio sharing
- Team/workspace support

Do not build these in MVP.  
Only design the schema and code structure so these are possible later.

## Data Model

Core entities:

- profiles
- projects
- project_sources
- generated_outputs
- resume_bullets
- interview_questions
- skills
- contacts or profile_links

A user owns projects.  
A project owns sources and generated outputs.  
Generated outputs can be marked as favorite.  
Published projects appear on the public portfolio site.

## Project Fields

A project should support:

- id
- user_id
- title
- slug
- summary
- period_start
- period_end
- role
- company_or_context
- tech_stack
- problem
- solution
- result
- contribution
- links
- is_published
- display_order
- created_at
- updated_at

## Source Types

For MVP, only support:

- manual_note

Design the structure so it can later support:

- github_readme
- git_commit_log
- git_diff
- file_upload
- markdown
- pdf
- docx

## Output Types

Generated outputs should support:

- portfolio_description
- resume_bullets
- interview_qa
- self_intro
- project_case_study

For MVP, implement only:

- portfolio_description
- resume_bullets
- interview_qa

## Product Rules

The generator must not fabricate fake results.

If a metric, impact, or result is not provided, write:

"성과: 추가 확인 필요"

Do not invent numbers.

Do not exaggerate.

Prefer realistic career language.

Generated content should be useful for:

- public portfolio
- resume
- interview preparation
- Notion copy
- Markdown export

## Writing Style Rules

Generated Korean writing should be:

- clear
- professional
- developer-oriented
- not too fluffy
- not overly exaggerated
- based only on user-provided information

When possible, structure the output around:

- project context
- user role
- technical contribution
- problem
- solution
- result
- tech stack
- interview talking point

## Public Portfolio Writing Rules

Public portfolio content should be:

- concise but not empty
- understandable to both developers and non-developers
- specific about contribution
- honest about impact
- structured around problem, action, and result

## Code Rules

- Use TypeScript strictly.
- Prefer Server Actions for mutations.
- Keep components small and readable.
- Do not expose secrets to the client.
- Do not use Supabase service role key in frontend code.
- Use Supabase Row Level Security.
- Create DB schema in `/supabase/schema.sql`.
- Keep generator logic in `/lib/generator`.
- Keep Supabase clients in `/lib/supabase`.
- Keep server actions in `/actions`.
- Keep shared types in `/types`.
- Keep public portfolio components in `/components/portfolio`.
- Keep admin components in `/components/admin`.
- Document setup in `README.md`.

## UX Rules

The admin user should be able to:

1. Log in.
2. Create a project.
3. Add rough notes.
4. Generate career writing.
5. Save generated results.
6. Mark favorite result.
7. Select content for public display.
8. Publish project.
9. See it on the public portfolio site.
10. Copy result as Markdown.

## Security Rules

- Admin pages must require authentication.
- Public pages should only show published projects.
- All user-owned data must have `user_id`.
- RLS must be enabled on user-owned tables.
- Users must only read/write their own data.
- Do not rely only on frontend checks.
- Do not expose secret keys.
- Do not add paid API calls in MVP.

## Seed / Sample Content

Prepare sample content based on these projects:

1. 인천공항 국산화 셀프백드랍 구축
2. 임시출입 키오스크 / Suprema BioStar 연동
3. Python gRPC 기반 비전 처리 서버 PoC

Do not include real secrets, IPs, tokens, or private credentials.
