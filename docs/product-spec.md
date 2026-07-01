# Sunday Desk Product Spec

## Brand

- Name: Sunday Desk
- Subtitle: A quiet Sunday space to shape your work into a portfolio.
- Current local path: `C:\Users\hsjeon\git\sunday_desk`

## 1. 제품 목적

`Sunday Desk`는 공개 포트폴리오 사이트와 관리자용 경험 정리 도구를 함께 제공하는 개인 포트폴리오 웹앱이다.

이 앱의 핵심은 포트폴리오의 디자인을 자유롭게 조립하는 것이 아니라, 개발자가 실제로 수행한 프로젝트 경험을 구조화하고 채용 관점의 언어로 정리한 뒤, 그중 공개할 내용을 포트폴리오 사이트에 반영하는 것이다.

따라서 이 제품은 일반적인 포트폴리오 사이트 빌더가 아니다.

- 드래그앤드롭 편집기가 아니다.
- 테마 마켓플레이스가 아니다.
- 디자인 빌더가 아니다.
- 랜딩 페이지 생성기가 아니다.

대신 다음에 집중한다.

- 프로젝트 경험, 원본 메모, 문제, 해결, 성과, 기여를 구조화한다.
- 정리되지 않은 업무 기록을 포트폴리오 설명, 이력서 bullet, 면접 Q&A로 변환한다.
- 검토된 결과만 공개 포트폴리오에 노출한다.
- 관리자 페이지에서 내 포트폴리오 콘텐츠를 지속적으로 관리한다.

## 2. 1차 목표와 2차 확장 방향

### 1차 목표

1차 목표는 `나의 실제 공개 포트폴리오 사이트`를 완성하는 것이다.

MVP는 한 명의 포트폴리오 소유자가 다음 작업을 할 수 있어야 한다.

- 공개 포트폴리오 방문자에게 About, Skills, Projects, Project Detail, Contact 정보를 보여준다.
- 관리자만 로그인해 프로젝트와 원본 메모를 관리한다.
- 프로젝트별 경험을 포트폴리오 설명, 이력서 bullet, 면접 Q&A로 정리한다.
- 생성된 결과를 저장하고 favorite으로 표시한다.
- 공개할 프로젝트만 published 상태로 전환한다.
- 공개 페이지에는 published project만 노출한다.

### 2차 확장 방향

2차 목표는 다른 개발자나 IT 실무자도 자신의 포트폴리오를 만들 수 있는 도구로 확장하는 것이다.

단, MVP에서는 SaaS 기능을 구현하지 않는다. 지금은 다음 확장을 염두에 두고 구조만 열어 둔다.

- 사용자별 공개 포트폴리오 URL
- 실제 LLM API generator 교체
- 사용자 제공 API key
- GitHub/GitLab import
- 파일 업로드와 문서 파싱
- Notion/PDF export
- pgvector 기반 RAG
- 팀 또는 워크스페이스
- 결제와 SaaS onboarding

## 3. 핵심 사용자 흐름

### 공개 방문자 흐름

1. 방문자가 `/`에 접속한다.
2. About, Skills, 대표 Projects, Contact 요약을 확인한다.
3. `/projects`에서 published project 목록을 본다.
4. `/projects/[slug]`에서 프로젝트 상세 내용을 확인한다.
5. `/contact`에서 연락처와 외부 링크를 확인한다.

### 관리자 흐름

1. 관리자가 `/admin/login`에서 Supabase Auth로 로그인한다.
2. `/admin` 대시보드에서 프로젝트 수, published 상태, 최근 생성 결과를 확인한다.
3. `/admin/projects/new`에서 프로젝트 기본 정보를 입력한다.
4. `/admin/projects/[id]`에서 문제, 해결, 성과, 기여, 기술스택, 링크, 원본 메모를 관리한다.
5. `/admin/generator`에서 프로젝트와 출력 유형을 선택한다.
6. mock/template generator가 입력된 정보만 사용해 결과를 생성한다.
7. 생성 결과를 저장하고 필요한 결과를 favorite으로 표시한다.
8. 공개에 사용할 내용을 프로젝트 필드에 반영하고 published 상태로 전환한다.
9. 공개 페이지에서 반영 결과를 확인한다.
10. 필요한 결과는 Markdown으로 복사한다.

## 4. 공개 페이지 목록

### `/`

홈 페이지다.

- 프로필 요약
- 핵심 기술스택
- 대표 published projects
- Contact 진입 링크

### `/about`

개발자 소개 페이지다.

- 경력 요약
- 강점
- 일하는 방식
- 주요 도메인 경험

### `/projects`

공개 프로젝트 목록 페이지다.

- `is_published = true`인 프로젝트만 표시한다.
- `display_order`, `period_start`, `created_at` 기준으로 정렬한다.
- 각 프로젝트는 title, summary, period, role, tech stack, 대표 성과를 요약 표시한다.

### `/projects/[slug]`

프로젝트 상세 페이지다.

- title
- summary
- period
- role
- company_or_context
- tech_stack
- problem
- solution
- result
- contribution
- links

### `/contact`

연락처 페이지다.

- 이메일
- GitHub
- LinkedIn 또는 기타 공개 링크
- 간단한 contact message

## 5. 관리자 페이지 목록

### `/admin`

관리자 대시보드다.

- 로그인한 사용자만 접근 가능
- 프로젝트 현황
- published/unpublished 요약
- 최근 생성 결과
- 빠른 작업 링크

### `/admin/login`

로그인 페이지다.

- Supabase Auth 기반 로그인
- 이미 로그인한 사용자는 `/admin`으로 이동

### `/admin/projects`

프로젝트 관리 목록이다.

- 내 프로젝트만 조회
- title, slug, published 상태, 수정일 표시
- 생성, 편집, 삭제, publish/unpublish 진입

### `/admin/projects/new`

프로젝트 생성 페이지다.

- 프로젝트 기본 필드 입력
- slug 입력 또는 title 기반 자동 제안
- 생성 후 상세 편집 페이지로 이동

### `/admin/projects/[id]`

프로젝트 상세 편집 페이지다.

- 프로젝트 주요 필드 수정
- 원본 메모 CRUD
- 공개 여부 관리
- generator로 이동

### `/admin/generator`

경험 정리 생성 페이지다.

- 프로젝트 선택
- 출력 유형 선택
- generator 실행
- 결과 미리보기
- 저장

### `/admin/outputs`

생성 결과 히스토리 페이지다.

- 생성 결과 목록
- output type별 필터
- favorite 표시 및 해제
- Markdown 복사
- 프로젝트별 조회

## 6. DB 테이블 구조

### `profiles`

Supabase Auth 사용자와 연결되는 공개/관리자 프로필이다.

- `id uuid primary key references auth.users(id)`
- `display_name text`
- `headline text`
- `bio text`
- `location text`
- `email text`
- `avatar_url text`
- `created_at timestamptz`
- `updated_at timestamptz`

### `projects`

포트폴리오 프로젝트의 중심 테이블이다.

- `id uuid primary key`
- `user_id uuid references auth.users(id)`
- `title text`
- `slug text`
- `summary text`
- `period_start date`
- `period_end date`
- `role text`
- `company_or_context text`
- `tech_stack text[]`
- `problem text`
- `solution text`
- `result text`
- `contribution text`
- `links jsonb`
- `is_published boolean`
- `display_order integer`
- `created_at timestamptz`
- `updated_at timestamptz`

제약 방향:

- `(user_id, slug)` unique
- public route 조회를 고려해 `slug`, `is_published`, `display_order` 인덱스 추가

### `project_sources`

프로젝트의 원본 자료를 저장한다.

- `id uuid primary key`
- `user_id uuid references auth.users(id)`
- `project_id uuid references projects(id)`
- `source_type text`
- `title text`
- `content text`
- `metadata jsonb`
- `created_at timestamptz`
- `updated_at timestamptz`

MVP의 `source_type`은 `manual_note`만 사용한다. 이후 `github_readme`, `git_commit_log`, `git_diff`, `file_upload`, `markdown`, `pdf`, `docx`를 추가할 수 있게 text 또는 enum 구조로 설계한다.

### `generated_outputs`

generator가 만든 결과를 저장한다.

- `id uuid primary key`
- `user_id uuid references auth.users(id)`
- `project_id uuid references projects(id)`
- `output_type text`
- `title text`
- `content_markdown text`
- `input_snapshot jsonb`
- `is_favorite boolean`
- `created_at timestamptz`
- `updated_at timestamptz`

MVP의 `output_type`:

- `portfolio_description`
- `resume_bullets`
- `interview_qa`

확장 후보:

- `self_intro`
- `project_case_study`

### `skills`

공개 포트폴리오에 표시할 기술스택이다.

- `id uuid primary key`
- `user_id uuid references auth.users(id)`
- `name text`
- `category text`
- `level text`
- `display_order integer`
- `is_visible boolean`
- `created_at timestamptz`
- `updated_at timestamptz`

### `profile_links`

연락처와 외부 링크를 관리한다.

- `id uuid primary key`
- `user_id uuid references auth.users(id)`
- `label text`
- `url text`
- `kind text`
- `display_order integer`
- `is_visible boolean`
- `created_at timestamptz`
- `updated_at timestamptz`

## 7. Supabase RLS 정책 방향

모든 사용자 소유 테이블에는 `user_id`를 둔다. RLS는 기본적으로 활성화한다.

### 관리자 데이터 접근

관리자는 자신의 데이터만 조회, 생성, 수정, 삭제할 수 있다.

정책 방향:

- `select`: `auth.uid() = user_id`
- `insert`: `auth.uid() = user_id`
- `update`: `auth.uid() = user_id`
- `delete`: `auth.uid() = user_id`

대상 테이블:

- `projects`
- `project_sources`
- `generated_outputs`
- `skills`
- `profile_links`

### 공개 데이터 접근

방문자는 published 또는 visible 데이터만 읽을 수 있다.

정책 방향:

- `projects`: `is_published = true`인 row만 anonymous select 허용
- `skills`: `is_visible = true`인 row만 anonymous select 허용
- `profile_links`: `is_visible = true`인 row만 anonymous select 허용
- `profiles`: 공개에 필요한 필드만 select 허용하는 방향으로 설계

### 중요한 보안 원칙

- 관리자 페이지는 서버 측에서 인증 여부를 확인한다.
- frontend 조건부 렌더링만으로 보호하지 않는다.
- Supabase service role key는 서버 전용 환경에서도 MVP 앱 로직에 사용하지 않는다.
- public page query도 RLS 정책을 통과하는 anon client 기준으로 동작 가능해야 한다.

## 8. Server Actions 목록

Server Actions는 `/actions` 아래에 기능별로 분리한다.

### Auth

- `signInAction`
- `signOutAction`
- `getCurrentUserAction`

### Projects

- `createProjectAction`
- `updateProjectAction`
- `deleteProjectAction`
- `publishProjectAction`
- `unpublishProjectAction`
- `updateProjectSlugAction`
- `reorderProjectsAction`

### Project Sources

- `createProjectSourceAction`
- `updateProjectSourceAction`
- `deleteProjectSourceAction`

### Generator

- `generatePortfolioDescriptionAction`
- `generateResumeBulletsAction`
- `generateInterviewQaAction`
- `saveGeneratedOutputAction`

### Generated Outputs

- `listGeneratedOutputsAction`
- `deleteGeneratedOutputAction`
- `toggleGeneratedOutputFavoriteAction`
- `copyMarkdown`은 클라이언트 clipboard 기능으로 처리하고, 서버 상태 변경은 하지 않는다.

### Skills and Profile

- `upsertProfileAction`
- `createSkillAction`
- `updateSkillAction`
- `deleteSkillAction`
- `reorderSkillsAction`
- `createProfileLinkAction`
- `updateProfileLinkAction`
- `deleteProfileLinkAction`

## 9. mock/template generator 구조

generator는 `/lib/generator`에 둔다.

MVP에서는 외부 유료 AI API를 호출하지 않는다. 입력된 프로젝트 필드와 원본 메모를 정해진 템플릿에 매핑해 한국어 경력 문장을 생성한다.

### 인터페이스 방향

```ts
export type GeneratorOutputType =
  | "portfolio_description"
  | "resume_bullets"
  | "interview_qa";

export interface GeneratorInput {
  project: Project;
  sources: ProjectSource[];
}

export interface GeneratorResult {
  outputType: GeneratorOutputType;
  title: string;
  contentMarkdown: string;
  inputSnapshot: Record<string, unknown>;
}

export interface PortfolioGenerator {
  generate(input: GeneratorInput, outputType: GeneratorOutputType): GeneratorResult;
}
```

### MVP 구현

- `TemplatePortfolioGenerator`를 기본 구현체로 사용한다.
- 프로젝트 필드가 비어 있으면 빈 내용을 꾸며내지 않는다.
- 성과나 수치가 없으면 반드시 `성과: 추가 확인 필요`을 포함한다.
- 수치, 규모, 개선율, 사용자 수 등은 사용자가 입력한 경우에만 사용한다.
- 표현은 명확하고 현실적인 개발자 경력 문장으로 제한한다.

### 향후 교체 지점

나중에 실제 LLM API를 붙일 때는 같은 `PortfolioGenerator` 인터페이스를 구현하는 `OpenAIPortfolioGenerator` 같은 구현체를 추가한다.

MVP 코드에서 특정 외부 AI SDK에 직접 의존하지 않도록 한다.

## 10. 공개 포트폴리오 표시 규칙

- 공개 페이지는 `is_published = true`인 프로젝트만 표시한다.
- 삭제되었거나 unpublished 상태인 프로젝트는 slug를 알아도 상세 페이지에 노출하지 않는다.
- 프로젝트 목록은 `display_order`를 우선하고, 값이 없으면 최신순 또는 기간순으로 정렬한다.
- 공개 설명은 관리자에서 검토된 프로젝트 필드를 기준으로 표시한다.
- 생성 결과 전체를 자동 공개하지 않는다.
- favorite output은 관리자 판단을 돕는 신호이며, 자동으로 public content가 되지는 않는다.
- links에는 공개 가능한 URL만 저장한다.
- 실명, 사내 IP, 토큰, 계정, 내부 시스템 주소 등 민감 정보는 공개 데이터에 포함하지 않는다.

## 11. MVP 제외 기능

다음 기능은 MVP에서 구현하지 않는다.

- OpenAI API 실제 호출
- Anthropic API 실제 호출
- Gemini API 실제 호출
- 사용자 API key 입력
- GitHub/GitLab 연동
- 파일 업로드
- PDF export
- Notion export
- vector DB/RAG
- 결제
- 팀 기능
- 다중 테마
- 드래그앤드롭 사이트 빌더
- 디자인 빌더
- 테마 마켓플레이스
- public SaaS onboarding
- 사용자별 커스텀 도메인

## 12. 개발 순서

### 1단계: 프로젝트 기반 구성

- Next.js App Router, TypeScript, Tailwind CSS 초기화
- 기본 라우팅 구조 생성
- 공통 레이아웃과 네비게이션 구성
- Supabase 환경 변수 구조 정리

### 2단계: DB 스키마와 RLS

- `/supabase/schema.sql` 작성
- 핵심 테이블 생성
- RLS 활성화
- owner-only 정책과 public read 정책 작성
- seed/sample content 방향 정리

### 3단계: Supabase 클라이언트와 인증

- `/lib/supabase` 구성
- server client, browser client 분리
- `/admin/login` 구현
- admin route 보호
- logout 구현

### 4단계: 프로젝트 CRUD

- `/actions/projects` 구현
- `/admin/projects` 목록 구현
- `/admin/projects/new` 생성 구현
- `/admin/projects/[id]` 편집 구현
- publish/unpublish 구현

### 5단계: 원본 메모 CRUD

- `/actions/project-sources` 구현
- 프로젝트 상세 편집 화면에 manual note 관리 추가
- generator 입력으로 연결

### 6단계: mock/template generator

- `/lib/generator` 인터페이스 작성
- `TemplatePortfolioGenerator` 구현
- 포트폴리오 설명, 이력서 bullet, 면접 Q&A 생성
- `/admin/generator` 화면 구현
- 생성 결과 저장

### 7단계: 생성 결과 관리

- `/admin/outputs` 구현
- output type 필터
- favorite 토글
- Markdown 복사
- 프로젝트별 결과 조회

### 8단계: 공개 포트폴리오

- `/`, `/about`, `/projects`, `/projects/[slug]`, `/contact` 구현
- published project만 조회
- skills, profile links 표시
- 모바일/데스크톱 반응형 확인

### 9단계: 문서화와 검증

- `README.md` setup guide 작성
- Supabase 적용 순서 문서화
- 로컬 실행 방법 정리
- TypeScript, lint, build 검증

## 13. 향후 확장 계획

### LLM generator 교체

MVP의 template generator를 유지하면서, 동일 인터페이스 뒤에 실제 LLM generator를 추가한다.

- OpenAI API generator
- 사용자 제공 API key
- 비용 제한
- 생성 로그와 재시도 정책

### 사용자별 포트폴리오

현재는 개인 사용을 전제로 하지만, 이후 사용자별 공개 페이지를 제공할 수 있다.

- `/u/[username]`
- 사용자별 slug namespace
- profile visibility 설정

### 외부 데이터 import

프로젝트 원본 자료의 `source_type`을 확장한다.

- GitHub README
- commit log
- git diff
- markdown
- pdf
- docx
- file upload

### Export

저장된 생성 결과를 외부 도구로 내보낸다.

- Markdown download
- Notion export
- PDF resume export

### RAG와 검색

프로젝트 원본 메모와 생성 결과가 늘어난 뒤에만 검토한다.

- pgvector
- 프로젝트별 문맥 검색
- 면접 질문 재생성

### SaaS화

MVP 이후 별도 단계로 검토한다.

- onboarding
- plan/usage
- billing
- workspace
- team member
- public sharing
