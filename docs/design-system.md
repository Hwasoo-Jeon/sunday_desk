# Design System And UI Extension Guide

## 목적

이 문서는 `Sunday Desk`의 디자인을 사용자가 직접 수정하거나, 나중에 유명 UI 라이브러리 또는 디자인 시스템을 도입할 때 기준점으로 사용한다.

브랜드 기준:

- Name: Sunday Desk
- Subtitle: A quiet Sunday space to shape your work into a portfolio.

현재 목표는 특정 디자인 시스템을 당장 고정하는 것이 아니다. 핵심은 다음이다.

- 공개 포트폴리오와 관리자 Studio의 역할을 분리한다.
- UI를 바꿀 때 수정해야 하는 위치가 명확해야 한다.
- 나중에 shadcn/ui, Radix UI, Tremor 같은 도구를 도입해도 구조를 크게 갈아엎지 않는다.
- 디자인 변경이 데이터, 인증, generator 로직에 영향을 주지 않게 한다.

## 기본 원칙

이 앱은 포트폴리오 사이트 빌더가 아니다. 따라서 디자인 확장도 테마 마켓플레이스나 드래그앤드롭 편집기를 향하지 않는다.

디자인 구조는 다음 목적을 지원해야 한다.

- 공개 포트폴리오는 개발자 포트폴리오로 읽기 쉽고 신뢰감 있어야 한다.
- 관리자 Studio는 반복 입력, 검토, 생성 결과 관리가 편해야 한다.
- 사용자 또는 개발자가 직접 수정할 때 어느 파일을 고치면 되는지 바로 알 수 있어야 한다.

## UI 계층

UI는 세 계층으로 나눈다.

### 1. Design Tokens

위치:

- `app/globals.css`
- `tailwind.config.ts`

역할:

- 색상
- 배경
- border
- radius
- typography 기본값
- spacing 기준

앞으로 색상이나 전체 분위기를 바꿀 때는 먼저 이 계층을 본다.

현재 토큰:

- `ink`: 주요 텍스트
- `muted`: 보조 텍스트
- `panel`: 관리자/섹션 배경
- `line`: border

향후 CSS variable 기반으로 다음 토큰을 확장한다.

```css
:root {
  --background: #ffffff;
  --foreground: #111827;
  --surface: #ffffff;
  --panel: #f8fafc;
  --border: #e5e7eb;
  --muted: #6b7280;
  --primary: #111827;
  --primary-foreground: #ffffff;
}
```

### 2. Shared UI Primitives

위치:

- `components/ui`

역할:

- 버튼
- 입력
- textarea
- select
- card
- badge
- table
- tabs
- dialog
- dropdown

아직 실제 primitive 컴포넌트는 만들지 않는다. 기능 구현이 시작되면서 반복되는 UI부터 이 폴더로 올린다.

중요한 규칙:

- `components/ui`는 도메인 지식이 없어야 한다.
- `Project`, `Generator`, `Portfolio` 같은 단어가 들어가면 이 폴더에 두지 않는다.
- shadcn/ui를 도입한다면 기본 대상 폴더는 `components/ui`다.

### 3. Domain Components

위치:

- `components/portfolio`
- `components/admin`

역할:

- 공개 포트폴리오 전용 컴포넌트
- 관리자 Studio 전용 컴포넌트

예:

- `components/portfolio/SiteHeader.tsx`
- `components/portfolio/ProjectCard.tsx`
- `components/admin/AdminSidebar.tsx`
- `components/admin/PageHeader.tsx`

이 계층은 `components/ui`의 primitive를 조합해 화면 의미를 만든다.

## 레이아웃 분리 규칙

공개 페이지와 관리자 페이지는 레이아웃을 분리한다.

공개 포트폴리오:

- `app/(portfolio)/layout.tsx`
- `components/portfolio`

관리자 Studio:

- `app/admin/layout.tsx`
- `components/admin`

공개 영역의 스타일 변경이 관리자 영역에 영향을 주면 안 된다. 반대로 관리자 화면 개선이 공개 포트폴리오의 첫인상을 깨면 안 된다.

## 직접 수정할 때 보는 순서

### 전체 색상이나 분위기를 바꾸고 싶을 때

1. `tailwind.config.ts`
2. `app/globals.css`
3. `components/ui`
4. `components/portfolio` 또는 `components/admin`

### 공개 포트폴리오 헤더/푸터를 바꾸고 싶을 때

1. `components/portfolio/SiteHeader.tsx`
2. `components/portfolio/SiteFooter.tsx`
3. `app/(portfolio)/layout.tsx`

### 프로젝트 카드 디자인을 바꾸고 싶을 때

1. `components/portfolio/ProjectCard.tsx`
2. `types/portfolio.ts`
3. 실제 데이터 연결 후에는 public project query 위치

### 관리자 좌측 메뉴를 바꾸고 싶을 때

1. `components/admin/AdminSidebar.tsx`
2. `components/admin/AdminShell.tsx`
3. `app/admin/layout.tsx`

### 관리자 페이지의 공통 제목/설명 UI를 바꾸고 싶을 때

1. `components/admin/PageHeader.tsx`
2. `components/admin/PlaceholderPanel.tsx`

## 외부 UI 라이브러리 도입 기준

### shadcn/ui

가장 현실적인 1순위 후보.

적합한 이유:

- Tailwind와 잘 맞는다.
- 컴포넌트 코드가 프로젝트 안에 들어와 직접 수정 가능하다.
- 관리자 Studio에 필요한 form, dialog, table, tabs, dropdown 구성이 좋다.

도입 시 원칙:

- 설치 위치는 `components/ui`
- 기존 `components/admin`, `components/portfolio`는 shadcn 컴포넌트를 조합하는 계층으로 유지
- 한 번에 전부 바꾸지 말고 Button, Input, Card부터 단계적으로 교체

### Radix UI

상태와 접근성이 중요한 headless primitive가 필요할 때 사용한다.

적합한 영역:

- Dialog
- Dropdown
- Select
- Tabs
- Tooltip

도입 시 원칙:

- Radix를 직접 page에서 사용하지 않는다.
- `components/ui`에서 감싼 뒤 사용한다.

### Tremor 또는 Dashboard UI

관리자 통계 화면이 늘어난 뒤 검토한다.

적합한 영역:

- Dashboard metric card
- Chart
- Table

MVP 초기에는 과하다. 프로젝트 CRUD와 generator 흐름이 잡힌 뒤에 판단한다.

## public/admin 디자인 방향

### 공개 포트폴리오

목표:

- 읽기 쉬움
- 신뢰감
- 개발자 포트폴리오다운 구조
- 과한 랜딩 페이지 느낌 지양

권장:

- 명확한 타이포그래피
- 충분한 여백
- 프로젝트별 문제, 해결, 기여, 성과가 잘 보이는 구성
- published project 중심의 단순한 탐색

피할 것:

- 과한 애니메이션
- 의미 없는 gradient 장식
- 카드만 반복되는 SaaS 랜딩 페이지 형태
- 기술스택만 나열하고 실제 기여가 보이지 않는 구성

### 관리자 Studio

목표:

- 입력과 검토가 편한 업무 도구
- 반복 작업에 피로가 적은 UI
- 프로젝트, 원본 메모, 생성 결과 사이를 빠르게 이동

권장:

- 좌측 사이드바
- 중앙 콘텐츠
- 명확한 form group
- 저장, 생성, publish 같은 주요 액션의 위치 고정
- table/list/detail 구조

피할 것:

- 마케팅 페이지 같은 큰 hero
- 장식적인 카드 중첩
- 기능 설명 텍스트가 화면을 과하게 차지하는 구조

## 확장 순서

### 1단계: 현재 구조 유지

- public/admin 레이아웃 분리 유지
- placeholder UI로 라우팅과 정보 구조 확인
- 데이터 연결 전까지 디자인을 과하게 확정하지 않음

### 2단계: UI primitive 추가

기능 구현 중 반복되는 컴포넌트부터 추가한다.

- `Button`
- `Input`
- `Textarea`
- `Card`
- `Badge`
- `Table`

### 3단계: 관리자 form 정리

프로젝트 CRUD가 구현될 때 form 컴포넌트를 정리한다.

- field label
- validation message
- action button
- destructive action
- publish toggle

### 4단계: 공개 포트폴리오 polish

실제 프로젝트 데이터가 들어간 뒤 공개 페이지를 다듬는다.

- Project detail readability
- About content density
- Skills grouping
- Contact links

### 5단계: 외부 UI 시스템 선택

반복 UI가 충분히 보이면 shadcn/ui 도입 여부를 결정한다.

도입 판단 기준:

- 직접 만든 primitive가 5개 이상 반복된다.
- form, dialog, select, table 접근성 구현 비용이 커진다.
- 관리자 화면에서 일관성이 흔들리기 시작한다.

## 유지보수 규칙

- 디자인 변경 때문에 데이터 타입을 바꾸지 않는다.
- UI 컴포넌트에서 Supabase query를 직접 호출하지 않는다.
- Server Actions와 generator 로직은 UI primitive에 들어가지 않는다.
- public/admin 도메인 컴포넌트는 공통 primitive를 조합한다.
- `components/ui`는 최대한 작고 예측 가능하게 유지한다.
- 새 UI 라이브러리를 도입할 때는 한 화면을 완전히 바꾸기보다 primitive부터 바꾼다.

## 현재 상태

현재 프로젝트는 디자인 시스템 도입 전의 초기 구조다.

이미 준비된 것:

- 공개/관리자 레이아웃 분리
- 공개/관리자 컴포넌트 폴더 분리
- Tailwind 기반 기본 토큰
- `components/ui` 확장 위치

아직 하지 않은 것:

- shadcn/ui 도입
- 공통 primitive 구현
- form 컴포넌트 구현
- table/list/detail 패턴 정리
- theme switcher 구현

이 상태가 MVP 초기에 적절하다. 기능과 실제 콘텐츠가 들어간 뒤 반복되는 UI를 기준으로 디자인 시스템을 키운다.
