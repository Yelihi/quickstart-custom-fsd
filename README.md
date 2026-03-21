# quickstart-custom-plate

FSD(Feature-Sliced Design) 아키텍처 기반의 프론트엔드 프로젝트를 빠르게 scaffolding하는 CLI 도구입니다.

## 빠른 시작

```bash
npx quickstart-custom-plate
```

## 지원 프레임워크

| 프레임워크 | 언어 |
|-----------|------|
| React + Vite | TypeScript / JavaScript |
| Next.js (App Router) | TypeScript / JavaScript |
| Vue.js + Vite | TypeScript / JavaScript |

## 선택 가능한 옵션

| 옵션 | 설명 |
|------|------|
| **Tailwind CSS v4** | `@tailwindcss/vite` 플러그인 방식 |
| **Client State** | React/Next → Zustand v5, Vue → Pinia v3 |
| **Server State** | TanStack Query v5 |
| **Testing** | React/Vue+Vite → Vitest, Next.js → Jest |
| **Git Hooks** | Husky v9 |

## Preset vs Custom

```
? 추천 설정으로 진행할까요?
  ❯ Preset (recommended)   - TypeScript + Tailwind + Store + TanStack Query + Test + Husky
    Custom                 - 옵션을 직접 선택
```

Preset은 프레임워크별로 최적화된 기본 설정을 자동으로 적용합니다.

## 생성되는 프로젝트 구조

```
my-app/
└── src/
    ├── app/          # 앱 레벨 설정 (providers, layout)
    ├── views/        # 페이지 컴포넌트 (Next.js) / pages/ (Vite)
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

## License

ISC
