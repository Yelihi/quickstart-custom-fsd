# quickstart-custom-plate

FSD(Feature-Sliced Design) 아키텍처 기반의 프론트엔드 프로젝트를 빠르게 scaffolding하는 CLI 도구입니다.

## 빠른 시작

```bash
npx quickstart-custom-plate
```

## 지원 프레임워크

| 프레임워크           | 언어                    |
| -------------------- | ----------------------- |
| React + Vite         | TypeScript / JavaScript |
| Next.js (App Router) | TypeScript / JavaScript |
| Vue.js + Vite        | TypeScript / JavaScript |

## 기본 포함 설정 (항상 포함)

| 설정                    | 내용                                                            |
| ----------------------- | --------------------------------------------------------------- |
| **ESLint 9**            | flat config, 프레임워크별 plugin (react-hooks, @next/next, vue) |
| **Prettier**            | `.prettierrc` 공통 포맷 규칙 + `.prettierignore`                |
| **lint/format scripts** | `lint`, `lint:fix`, `format`, `format:check`                    |

## 선택 가능한 옵션

| 옵션                | 설명                                                                               |
| ------------------- | ---------------------------------------------------------------------------------- |
| **Tailwind CSS v4** | `@tailwindcss/vite` 플러그인 방식                                                  |
| **Client State**    | React/Next → Zustand v5, Vue → Pinia v3                                            |
| **Server State**    | TanStack Query v5 + `@lukemorales/query-key-factory`                               |
| **Testing**         | React/Vue+Vite → Vitest, Next.js → Jest                                            |
| **Storybook**       | Storybook 10.3.3, 프레임워크별 renderer + 예제 story + `@storybook/addon-mcp` 포함 |
| **Git Hooks**       | Husky v9 + lint-staged (커밋 전 자동 lint/format)                                  |

## Preset vs Custom

```
? 추천 설정으로 진행할까요?
  ❯ Preset (recommended)   - TypeScript + Tailwind + Store + TanStack Query + Test + Storybook + Husky
    Custom                 - 옵션을 직접 선택
```

Preset은 프레임워크별로 최적화된 기본 설정을 자동으로 적용합니다.

## 생성되는 프로젝트 구조

```
my-app/
└── src/
    ├── app/          # 앱 레벨 설정 (providers, layout)
    ├── views/        # 페이지 컴포넌트
    ├── widgets/      # 여러 페이지에서 재사용되는 복합 컴포넌트
    ├── features/     # 사용자 상호작용 단위 (mutation, form, query)
    ├── entities/     # 도메인 모델 (DTO, enum, repository)
    └── shared/       # 공통 리소스
        ├── components/
        │   ├── atomics/  # 외부 UI 라이브러리 래핑
        │   └── ui/       # 공통 UI 컴포넌트
        ├── hooks/
        ├── lib/
        └── utils/
```

**레이어 의존 방향:** `shared` ← `entities` ← `features` ← `widgets` ← `views` ← `app`

각 레이어는 자신보다 하위 레이어만 import할 수 있습니다.

## 포함된 FSD 예시 코드

생성된 프로젝트에는 FSD 패턴을 바로 참고할 수 있는 예시 코드가 포함됩니다.

### base 예시 (`entities/counter` + `features/increment-counter`)

```
entities/counter/
  models/dtos.ts       # CounterDto 인터페이스
  models/enums.ts      # CounterStatus enum
  index.ts

features/increment-counter/
  ui/IncrementCounterButton.tsx
  index.ts

views/home/
  ui/HomePage.tsx      # feature를 조합하는 페이지
  index.ts
```

### TanStack Query 선택 시 추가 예시 (`entities/todo` + `features/filter-todos`, `create-todo`)

```
entities/todo/
  models/dtos.ts       # TodoDto, 요청/응답 DTO
  models/enums.ts      # TodoStatus enum
  models/repository.ts # Repository 인터페이스
  services/TodoRepositoryImpl.ts

features/filter-todos/
  config/query-keys.ts           # createQueryKeys 기반 typed keys
  services/query/useFilterTodos.ts
  ui/TodoList.tsx

features/create-todo/
  services/query/useCreateTodo.ts  # useMutation + invalidateQueries
  ui/CreateTodoButton.tsx

shared/lib/query/keys.ts           # mergeQueryKeys 기반 앱 전체 키 관리
```

### Zustand / Pinia 선택 시 추가 예시 (`features/counter-store`)

```
features/counter-store/
  model/store/interface.ts   # 스토어 상태 인터페이스
  model/store/index.ts       # createStore / defineStore
  ui/CounterWithStore.tsx
```

### Storybook 선택 시 — 예제 story (`src/__stories__/`)

```
src/__stories__/                     # FSD 구조를 그대로 반영
  features/
    increment-counter/
      ui/
        IncrementCounterButton.stories.tsx  # Default, WithHighCount story
```

`.storybook/main.ts` — stories glob, `@storybook/addon-mcp` addon 설정
`.storybook/preview.ts` — 전역 CSS import, controls 설정

#### Storybook addon-mcp

Storybook 기동(`npm run storybook`) 후 `/mcp` 엔드포인트가 활성화됩니다. Claude Code 등 MCP 클라이언트에서 아래와 같이 연결하면 컴포넌트 목록 조회, story preview 등의 도구를 사용할 수 있습니다.

```json
{
  "mcpServers": {
    "storybook": {
      "url": "http://localhost:6006/mcp"
    }
  }
}
```

### TypeScript 전용 내장 라이브러리 (base-ts)

| 라이브러리                      | 용도                                      |
| ------------------------------- | ----------------------------------------- |
| `zod`                           | 스키마 검증 (form, request DTO)           |
| `tsyringe` + `reflect-metadata` | DI 컨테이너 (`@injectable`, `@singleton`) |

## 로컬 개발

```bash
# 의존성 설치
npm install

# 타입 체크
npm run typecheck

# 빌드
npm run build

# 테스트
npm run test:run

# 로컬 실행 (빌드 후)
node dist/index.js
```

## 변경 이력

### Storybook 10.3.3 업그레이드 (feature/update-storybook)

- **버전**: `storybook ^8.6.0` → `^10.3.3`
- **Next.js 프레임워크**: `@storybook/nextjs` → `@storybook/nextjs-vite` (Vite 기반 마이그레이션)
- **Addon 정리**: `addon-essentials`, `addon-interactions`는 v10 core에 통합되어 제거
- **`@storybook/test` 제거**: v10에 호환 버전 없음 — story 파일의 `fn()` import를 `() => {}` no-op으로 교체
- **`@storybook/addon-mcp ^0.4.2` 추가**: `/mcp` 엔드포인트 제공
- **E2E 검증 강화**: `verify:e2e` 스크립트에 Storybook `/mcp` MCP initialize 응답 검증 추가

## 알려진 이슈

### Next.js + Jest 선택 시 npm install 경고

Next.js 템플릿에서 Testing(Jest) 옵션을 선택한 경우, scaffold된 프로젝트에서 `npm install` 실행 시 아래와 같은 deprecated 경고가 출력됩니다.

```
npm warn deprecated inflight@1.0.6
npm warn deprecated rimraf@3.0.2
npm warn deprecated abab@2.0.6
npm warn deprecated glob@7.2.3
npm warn deprecated whatwg-encoding@2.0.0
npm warn deprecated domexception@4.0.0
```

**원인**: `jest@29.x` 및 `jest-environment-jsdom@29.x`의 transitive dependency 문제입니다.

- `jest-environment-jsdom` → `jsdom` → `abab`, `whatwg-encoding`, `domexception`
- `jest` 내부 → `rimraf@3` → `glob@7` → `inflight`

**영향**: 기능 동작에는 문제 없습니다. Jest 30.x 업그레이드 시 자연히 해소될 예정입니다.

## License

ISC
