# components/ui

이 폴더는 공통 UI primitive를 두는 위치다.

현재는 의도적으로 비워 둔다. 기능 구현 중 반복되는 UI가 확인되면 작은 컴포넌트부터 추가한다.

## 역할

이 폴더의 컴포넌트는 도메인 의미를 가지지 않는다.

좋은 예:

- `Button`
- `Input`
- `Textarea`
- `Card`
- `Badge`
- `Table`
- `Tabs`
- `Dialog`

나쁜 예:

- `ProjectCard`
- `GeneratorResultCard`
- `PortfolioHero`
- `AdminProjectForm`

도메인 컴포넌트는 아래 폴더에 둔다.

- 공개 포트폴리오: `components/portfolio`
- 관리자 Studio: `components/admin`

## 외부 디자인 시스템 도입

나중에 shadcn/ui를 도입하면 기본 생성 위치는 이 폴더로 한다.

원칙:

- page에서 shadcn/Radix 컴포넌트를 직접 남발하지 않는다.
- 이 폴더에서 감싼 뒤 `components/admin` 또는 `components/portfolio`에서 조합한다.
- 디자인 토큰은 `app/globals.css`와 `tailwind.config.ts`에서 관리한다.
