# Sunday Desk

조용한 Sunday 공간에서 프로젝트 경험을 정리하고, 포트폴리오로 보여줄 수 있게 다듬는 개인 포트폴리오 CMS/정리 도구입니다.

Sunday Desk는 단순한 공개 포트폴리오 사이트가 아닙니다. 공개 페이지로 보여줄 프로젝트, 기술 스택, 소개 문구를 관리하면서, 관리자 화면에서 원본 메모를 구조화된 포트폴리오 설명, 이력서 bullet, 면접 Q&A 형태로 정리하는 개인용 포트폴리오 스튜디오를 목표로 합니다.

## 주요 기능

- 공개 포트폴리오 페이지: 소개, 기술 스택, 프로젝트 목록, 프로젝트 상세, 연락처
- 관리자 스튜디오: 프로젝트 CRUD, 공개/비공개 관리, 원본 메모 관리
- 템플릿 기반 글 생성: 포트폴리오 설명, 이력서 bullet, 면접 Q&A
- 생성 결과 저장, 즐겨찾기, Markdown 복사
- Supabase Auth, PostgreSQL, Row Level Security 기반 데이터 관리

## 기술 스택

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL
- Supabase Row Level Security
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

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon public key

서비스 role key 같은 비밀 키는 클라이언트에 노출하지 않습니다.

### 3. Supabase 스키마 적용

Supabase SQL Editor에서 `supabase/schema.sql`의 내용을 실행해 테이블과 RLS 정책을 준비합니다.

관리자 기능은 Supabase Auth 로그인을 전제로 동작합니다. 로컬에서 관리자 페이지를 사용하려면 Supabase 프로젝트에서 이메일 로그인 등 필요한 Auth 설정을 먼저 완료하세요.

### 4. 개발 서버 실행

```bash
pnpm dev
```

기본 접속 주소:

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
pnpm lint
pnpm typecheck
pnpm build
```

## 무료 중심 아키텍처

MVP에서는 paid AI API를 사용하지 않습니다.

- OpenAI API, Anthropic API, Gemini API 등 유료 LLM API를 호출하지 않습니다.
- 글 생성 기능은 `/lib/generator`의 템플릿 기반 로직으로 구현합니다.
- 사용자가 제공한 내용만 바탕으로 작성하며, 성과 수치나 영향도를 임의로 만들지 않습니다.
- 추후 유료 AI API로 교체할 수 있도록 생성 로직은 인터페이스 뒤에 두는 방향을 유지합니다.

## 프로젝트 구조

```text
app/                  Next.js App Router 페이지
actions/              Server Actions
components/           공개 포트폴리오 및 관리자 UI 컴포넌트
lib/generator/        템플릿 기반 글 생성 로직
lib/supabase/         Supabase 클라이언트
supabase/schema.sql   DB 스키마와 RLS 정책
types/                공유 TypeScript 타입
```

## MVP 범위

현재 목표는 개인 포트폴리오 웹사이트와 관리자 스튜디오를 동작 가능한 형태로 완성하는 것입니다.

포함:

- 공개 포트폴리오 페이지
- 관리자 로그인/로그아웃
- 프로젝트 CRUD와 공개 상태 관리
- 원본 메모 관리
- 템플릿 기반 결과 생성과 저장
- Markdown 복사

제외:

- 실제 paid AI API 호출
- GitHub/GitLab 연동
- 파일 업로드
- PDF/Notion 내보내기
- 결제, 팀 워크스페이스, 다중 테마
