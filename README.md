# Sunday Desk

Sunday Desk는 개발자의 프로젝트 경험을 정리하고, 공개 포트폴리오와 이력서/면접용 글감으로 다듬기 위한 개인 포트폴리오 CMS/정리 도구입니다.

이 앱은 단순한 포트폴리오 웹사이트가 아닙니다. 방문자에게 보여줄 공개 포트폴리오 페이지와, 포트폴리오 소유자가 프로젝트 메모를 정리하고 경력 문장으로 변환하는 관리자 스튜디오를 함께 제공합니다.

## 프로젝트 소개

Sunday Desk의 1차 목표는 개인 포트폴리오 웹사이트를 완성하는 것입니다. 2차 목표는 이 구조를 확장해, 다른 개발자나 IT 실무자도 자신의 프로젝트 경험을 포트폴리오, 이력서 bullet, 면접 Q&A로 정리할 수 있는 도구로 발전시키는 것입니다.

핵심 방향은 시각적 웹사이트 빌더가 아니라 개발자 경험 정리 도구입니다.

- 프로젝트 경험을 구조화합니다.
- 원본 메모를 커리어 문장으로 다듬습니다.
- 선택한 콘텐츠만 공개 포트폴리오에 노출합니다.
- Supabase 기반 인증과 RLS로 사용자 데이터를 분리합니다.

## 주요 기능

- 공개 포트폴리오 페이지 제공
- 관리자 로그인/로그아웃
- 프로젝트 생성, 수정, 삭제, 공개/비공개 관리
- 프로젝트 원본 메모 관리
- 템플릿 기반 포트폴리오 설명 생성
- 템플릿 기반 이력서 bullet 생성
- 템플릿 기반 면접 Q&A 생성
- 생성 결과 저장, 즐겨찾기, Markdown 복사
- Supabase Auth, PostgreSQL, Row Level Security 기반 데이터 관리

## 공개 페이지 기능

공개 페이지는 방문자가 보는 최종 포트폴리오입니다.

대상 경로:

- `/`
- `/about`
- `/projects`
- `/projects/[slug]`
- `/contact`

공개 페이지에서는 공개 처리된 프로젝트만 보여줍니다. 프로젝트 상세 페이지는 다음 정보를 중심으로 구성합니다.

- 프로젝트 제목
- 요약
- 기간
- 역할
- 기술 스택
- 프로젝트 배경
- 문제
- 해결 방법
- 기여 내용
- 결과
- 관련 링크

## 관리자 기능

관리자 페이지는 포트폴리오 소유자가 프로젝트 경험을 정리하는 스튜디오입니다.

대상 경로:

- `/admin`
- `/admin/login`
- `/admin/projects`
- `/admin/projects/new`
- `/admin/projects/[id]`
- `/admin/generator`
- `/admin/outputs`

관리자 기능:

- Supabase Auth 기반 로그인/로그아웃
- 프로젝트 CRUD
- 프로젝트 slug와 공개 상태 관리
- 원본 메모 추가, 수정, 삭제
- 포트폴리오 설명, 이력서 bullet, 면접 Q&A 생성
- 생성 결과 저장
- 즐겨찾기 표시
- Markdown 복사
- 공개 사이트에 노출할 콘텐츠 선택

## 기술 스택

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL
- Supabase Row Level Security
- Supabase Storage 준비 구조
- Vercel 배포 대상

## 실행 방법

### 1. 의존성 설치

이 프로젝트는 `pnpm-lock.yaml`을 포함하므로 pnpm 사용을 권장합니다.

```bash
pnpm install
```

### 2. 환경 변수 준비

루트의 `.env.example`을 참고해 `.env.local`을 생성합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Supabase schema.sql 적용

Supabase 프로젝트를 만든 뒤, Supabase SQL Editor에서 아래 파일의 내용을 실행합니다.

```text
supabase/schema.sql
```

이 스키마는 프로젝트에 필요한 테이블과 Row Level Security 정책을 준비하는 용도입니다. 관리자 기능은 Supabase Auth 로그인을 전제로 동작하므로, Supabase 프로젝트에서 이메일 로그인 등 필요한 인증 설정도 함께 완료합니다.

### 4. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 접속합니다.

```text
http://localhost:3000
```

주요 경로:

- 공개 사이트: `http://localhost:3000`
- 관리자 로그인: `http://localhost:3000/admin/login`
- 관리자 프로젝트: `http://localhost:3000/admin/projects`

### 5. 개발 서버 종료

개발 서버를 실행한 터미널에서 아래 키를 누릅니다.

```text
Ctrl+C
```

종료 확인 메시지가 나오면 필요에 따라 `Y`를 입력합니다.

## 검증 명령

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Supabase 설정 방법

1. Supabase에서 새 프로젝트를 생성합니다.
2. Project Settings에서 Project URL과 anon public key를 확인합니다.
3. 루트에 `.env.local` 파일을 만들고 `.env.example` 형식에 맞춰 값을 입력합니다.
4. Supabase SQL Editor에서 `supabase/schema.sql`을 실행합니다.
5. Authentication 설정에서 로컬 테스트에 사용할 로그인 방식을 준비합니다.
6. RLS가 켜진 테이블에서 사용자별 데이터 접근이 정상적으로 제한되는지 확인합니다.

주의:

- Supabase service role key는 클라이언트 코드나 `NEXT_PUBLIC_` 환경 변수에 넣지 않습니다.
- 브라우저에 노출되는 값은 anon public key만 사용합니다.
- 사용자 소유 데이터는 `user_id`와 RLS 정책으로 분리합니다.

## DB 권한과 RLS 정책

`supabase/schema.sql`은 테이블 생성만 담당하는 파일이 아닙니다. Sunday Desk에서 사용하는 테이블, 인덱스, 트리거, Row Level Security 정책, 그리고 `anon`/`authenticated` role에 필요한 GRANT 권한을 함께 정의하는 DB 초기화 파일입니다.

주요 테이블 역할:

- `profiles`: 사용자 공개 프로필과 소개 정보를 저장합니다.
- `projects`: 포트폴리오 프로젝트의 핵심 정보를 저장합니다. 제목, slug, 요약, 기간, 역할, 기술 스택, 문제, 해결, 결과, 기여 내용, 공개 여부를 포함합니다.
- `project_sources`: 프로젝트별 원본 메모를 저장합니다. MVP에서는 `manual_note`를 사용하며, 향후 GitHub README, 파일 업로드, 문서 import 같은 source type으로 확장할 수 있습니다.
- `generated_outputs`: 템플릿 기반 생성 결과를 저장합니다. 포트폴리오 설명, 이력서 bullet, 면접 Q&A 등 생성 결과와 즐겨찾기 여부를 관리합니다.
- `resume_bullets`: 이력서에 사용할 bullet 문장을 프로젝트와 연결해 저장합니다.
- `interview_questions`: 면접 준비용 질문과 답변을 프로젝트와 연결해 저장합니다.
- `skills`: 공개 포트폴리오에 표시할 기술 스택 정보를 저장합니다.
- `profile_links`: 연락처, GitHub, 블로그 등 공개 링크 정보를 저장합니다.

사용자 소유 데이터는 각 테이블의 `user_id`와 Supabase Auth의 `auth.uid()`를 기준으로 분리합니다. RLS 정책은 로그인한 사용자가 자기 `user_id`에 해당하는 데이터만 조회, 생성, 수정, 삭제할 수 있도록 제한합니다.

공개 페이지 조회는 별도 기준으로 제한합니다. 공개 포트폴리오에서는 `projects.is_published = true`인 published project만 조회되도록 설계하고, 생성 결과는 공개용으로 선택된 favorite portfolio description만 공개 조회 대상이 되도록 설계합니다. 관리자 전용 원본 메모나 비공개 생성 결과는 공개 페이지에 노출하지 않습니다.

### permission denied 진단

Supabase API 호출 중 다음 오류가 발생할 수 있습니다.

```text
permission denied for table projects
```

이 오류는 보통 테이블은 존재하지만 Postgres 권한 레벨에서 `anon` 또는 `authenticated` role에 필요한 GRANT 권한이 부족한 상태를 의미합니다. RLS 정책이 올바르게 있어도 role에 테이블 접근 권한이 없으면 Supabase 클라이언트에서 조회나 쓰기가 실패할 수 있습니다.

확인 방법:

1. Supabase SQL Editor에서 `supabase/schema.sql` 전체를 다시 실행합니다.
2. `projects`, `project_sources`, `generated_outputs`, `resume_bullets`, `interview_questions` 등 앱이 사용하는 테이블에 대해 `anon`/`authenticated` role의 GRANT 구문이 포함되어 있는지 확인합니다.
3. GRANT 권한과 RLS 정책을 모두 확인합니다. GRANT는 테이블 접근 자체를 허용하고, RLS는 허용된 접근 안에서 어떤 row를 볼 수 있는지 제한합니다.
4. 공개 페이지에서 필요한 조회는 `anon` role로 가능한지, 관리자 기능에서 필요한 조회/변경은 로그인 후 `authenticated` role로 가능한지 확인합니다.

보안상 service role key로 이 문제를 우회하지 않습니다. service role key는 RLS를 우회할 수 있으므로 클라이언트 코드, `.env.local`의 `NEXT_PUBLIC_` 변수, Vercel의 공개 환경 변수에 넣지 않습니다.

## .env.example 설명

현재 `.env.example`은 다음 값을 포함합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL입니다.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon public key입니다.

`NEXT_PUBLIC_` 접두사가 붙은 값은 브라우저에 노출될 수 있습니다. 따라서 service role key, 비밀 토큰, 개인 계정 정보는 넣지 않습니다.

## 무료 중심 아키텍처

MVP에서는 paid AI API를 호출하지 않습니다.

- OpenAI API, Anthropic API, Gemini API 등 유료 LLM API를 실제 호출하지 않습니다.
- 글 생성 기능은 `/lib/generator`의 템플릿 기반 로직으로 구현합니다.
- 사용자가 입력한 프로젝트 정보와 원본 메모만 바탕으로 문장을 생성합니다.
- 성과 수치, 비용 절감률, 운영 지표를 임의로 만들지 않습니다.
- 제공되지 않은 성과는 `성과: 추가 확인 필요`로 남깁니다.
- 추후 OpenAI API 등으로 교체할 수 있도록 생성 로직은 인터페이스 뒤에 두는 방향을 유지합니다.

## Vercel 배포 방법

1. Git 저장소를 Vercel 프로젝트로 연결합니다.
2. Framework Preset은 Next.js로 설정합니다.
3. Install Command는 pnpm 기준으로 둡니다.

```bash
pnpm install
```

4. Build Command를 확인합니다.

```bash
pnpm build
```

5. Vercel Environment Variables에 Supabase 환경 변수를 등록합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

6. Supabase 프로젝트의 Auth 설정에서 배포 도메인에 맞는 Site URL과 Redirect URL을 설정합니다.
7. 배포 후 공개 페이지와 관리자 로그인 흐름을 확인합니다.

배포 환경에서도 Supabase service role key를 클라이언트 환경 변수에 넣지 않습니다.

## 프로젝트 구조

```text
app/                  Next.js App Router 페이지
actions/              Server Actions
components/           공개 포트폴리오 및 관리자 UI 컴포넌트
lib/generator/        템플릿 기반 글 생성 로직
lib/supabase/         Supabase 클라이언트
supabase/schema.sql   DB 스키마와 RLS 정책
types/                공유 TypeScript 타입
docs/                 제품 문서와 샘플 데이터 문서
```

## MVP 제외 기능

MVP에서는 다음 기능을 구현하지 않습니다.

- 실제 paid AI API 호출
- 사용자가 직접 API key 입력
- GitHub/GitLab 연동
- 파일 업로드
- PDF export
- Notion export
- Vector DB / RAG
- 결제
- 팀 워크스페이스
- 다중 포트폴리오 테마
- 드래그 앤 드롭 사이트 빌더
- 공개 SaaS 온보딩 플로우

## 향후 확장 계획

MVP 이후에는 다음 방향으로 확장할 수 있도록 구조를 유지합니다.

- OpenAI API 연동
- 사용자가 직접 API key 입력
- GitHub/GitLab 연동
- 파일 업로드
- PDF export
- Notion export
- pgvector 기반 RAG
- 다른 사용자도 자기 포트폴리오를 만들 수 있는 SaaS 확장
- 사용자별 공개 포트폴리오 URL
- Supabase Storage 기반 첨부 자료 관리
- 이력서/면접 답변 관리 기능 고도화

## 샘플 데이터

seed/test 데이터로 사용할 샘플 프로젝트 문서는 아래에 정리되어 있습니다.

```text
docs/sample-projects.md
```
