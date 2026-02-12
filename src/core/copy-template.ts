/**
 * 조건에 맞는 templates 내 프로젝트 초기 셋팅을 사용자의 root directory 내 복사
 * 폴더의 경우 재귀를 통해 하위 폴더까지 복사
 */

import fs from "node:fs/promises";
import path from "node:path";

import { exists } from "./utils";

const SKIP_DIRS = new Set([
  "node_modules",
  ".vscode",
  ".idea",
  ".DS_Store",
  "dist",
  "build",
  "coverage",
  "logs",
  "temp",
  "tmp",
  "cache",
]);


/**
 * @description 빈 디렉토리 보장 함수 및 빈 디렉토리 생성 함수
 * @param {string} dir 디렉토리 경로
 */
export const ensureEmptyDir = async (dir: string) => {
  if (await exists(dir)) {
    const entries = await fs.readdir(dir);

    if (entries.length > 0) {
      throw new Error(`Directory ${dir} is not empty`);
    }

    return;
  }

  await fs.mkdir(dir, { recursive: true });
}

/**
 * 
 * copyDir("templates/src", "my-app/src")
  → entries: [App.tsx, components/]
    → copyFile(App.tsx)          ✅ 파일 → 재귀 X
    → copyDir("components/")     🔄 재귀 진입
      → entries: [Button.tsx]
        → copyFile(Button.tsx)   ✅ 파일 → 재귀 X
      → entries 순회 끝 → return  ⬅️ 탈출!
  → entries 순회 끝 → return      ⬅️ 탈출!
 * 
 * 
 * @param from 원본 경로
 * @param to 목적지 경로
 */
export const copyDir = async (from: string, to: string) => {
  // 사용자의 directory 내 폴더 생성
  await fs.mkdir(to, { recursive: true });

  // from 에서 존재하는 파일들을 읽어오기 (dirent)
  // entries 가 배열을 반환하지 않으면 (즉, 파일) 아래 반복문은 돌지 않기 때문에 재귀 탈출
  const entries = await fs.readdir(from, { withFileTypes: true });

  for (const ent of entries) {
    if (SKIP_DIRS.has(ent.name)) continue;

    // 원본 경로(src), 목적지 경로(dest) 조합
    // from = templates/react-vite, to = my-app, ent.name = src 라고 한다면
    // src = templates/react-vite/src, dest = my-app/src
    const src = path.join(from, ent.name);
    const dest = path.join(to, ent.name);

    if (ent.isDirectory()) {
      // 재귀 호출
      await copyDir(src, dest);
      continue;
    }

    // 심볼릭 링크는 복사하지 않음 (순환 참조 방지)
    if (ent.isSymbolicLink()) continue;

    // 여기서 핵심: 같은 파일이 이미 있으면 덮어쓰기 됨
    await fs.copyFile(src, dest);
  }
}