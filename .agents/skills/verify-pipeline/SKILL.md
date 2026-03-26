---
name: verify-pipeline
description: 템플릿 또는 scaffold 로직 변경 후 전체 검증 파이프라인 실행. 타입 체크 → CLI 빌드 → 구조 테스트 → 실제 scaffold+install+build 순으로 검증합니다.
---

## Context

이 skill은 `templates/` 또는 `src/core/scaffold.ts`, `src/commands/create.ts` 등 핵심 파일 변경 후 실행합니다.

검증 단계:

1. **타입 체크** — TypeScript 타입 오류 검출
2. **빌드** — CLI를 빌드하여 dist/ 생성
3. **Integration 테스트** — 파일 구조/내용 검증 (빠름, ~10초)
4. **E2E 검증** — 실제 scaffold + npm install + npm run build (느림, ~3-5분)

## Steps

### Step 1: 타입 체크

```bash
npm run typecheck
```

타입 오류 발생 시 즉시 중단하고 에러를 사용자에게 보고합니다.

### Step 2: CLI 빌드

```bash
npm run build
```

빌드 실패 시 중단하고 에러를 사용자에게 보고합니다.

### Step 3: Integration 테스트 (구조 검증)

```bash
npm run test:integration
```

각 프레임워크 preset 및 base-only 스캐폴딩 결과를 검증합니다:

- package.json 유효성 및 name 필드
- `__PROJECT_NAME__` 토큰 미잔존
- `.gitignore` 존재 여부
- tailwind overlay 적용 시 CSS 내 `@import "tailwindcss"` 존재
- Next.js tailwind 적용 시 HomeView가 CSS Module import 없이 className 사용

### Step 4: E2E 검증 (scaffold + install + build + storybook /mcp)

```bash
npm run verify:e2e
```

3개 프레임워크(react-vite, next, vue-vite) 각각에 대해:

1. preset 설정으로 프로젝트 스캐폴딩
2. `npm install` 실행
3. `npm run build` 실행
4. storybook preset이 포함된 경우:
   - `npm run storybook --ci --no-open` 기동
   - Storybook ready 감지 후 `/mcp` 엔드포인트에 MCP initialize POST 요청
   - 유효한 JSON-RPC 응답(`"jsonrpc"` + `"result"`) 확인
5. 에러 없이 완료되는지 확인

### Step 5: 결과 리포트

각 단계별 성공/실패를 요약하여 보고합니다.

## Notes

- E2E 검증은 네트워크 상태에 따라 5-10분 소요됩니다 (storybook 기동 포함)
- 템플릿 내용이 아닌 CLI 프롬프트/출력 포맷만 변경한 경우 Step 1-3만 실행해도 충분합니다
- 테스트 중 생성되는 임시 프로젝트는 자동으로 정리됩니다
