
/**
 * 1) copyDir로 기본 템플릿 복사
   my-app/package.json ← templates/react-vite/package.json

2) 사용자가 tailwind 선택 → mergePackageJsonFromOverlay 호출

   target (my-app/package.json):       overlay (overlays/tailwind/package.json):
   {                                    {
     "scripts": { "dev": "vite" },        "scripts": { "build:css": "..." },
     "dependencies": {                    "devDependencies": {
       "react": "^19.0.0"                  "tailwindcss": "^4.0.0",
     }                                     "autoprefixer": "^10.0.0"
   }                                     }
                                        }

3) 병합 결과 → my-app/package.json에 덮어쓰기:
   {
     "scripts": { "dev": "vite", "build:css": "..." },
     "dependencies": { "react": "^19.0.0" },
     "devDependencies": { "tailwindcss": "^4.0.0", "autoprefixer": "^10.0.0" }
   }
 */


import fs from "node:fs/promises";
import path from "node:path";

export type PackageProperties = {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
};

/**
 * @description Record 병합 util 함수
 * @param base 기존 Record
 * @param add 오버레이 Record
 * @returns 병합된 Record
 */
const mergeRecord = <T extends Record<string, string>> (base: T | undefined, add: T | undefined): T => {
  return { ...(base || {}), ...(add || {}) } as T;
}

/**
 * @description package.json 병합 함수
 * @param params 프로젝트 디렉토리 경로, 오버레이 package.json 경로
 */
export const mergePackageJsonFromOverlay = async (params: {
  projectDir: string;
  overlayPackageJsonPath: string;
}): Promise<void> => {
  const targetPath = path.join(params.projectDir, "package.json"); // ../my-app/package.json

  // 각각 js 파일로 parse
  const target: PackageProperties = JSON.parse(await fs.readFile(targetPath, "utf8"));
  const overlay: PackageProperties = JSON.parse(await fs.readFile(params.overlayPackageJsonPath, "utf8"));

  // overlay 가 우선
  target.scripts = mergeRecord(target.scripts, overlay.scripts);

  target.dependencies = mergeRecord(target.dependencies, overlay.dependencies);
  target.devDependencies = mergeRecord(target.devDependencies, overlay.devDependencies);
  target.peerDependencies = mergeRecord(target.peerDependencies, overlay.peerDependencies);
  target.optionalDependencies = mergeRecord(target.optionalDependencies, overlay.optionalDependencies);

  // 병합된 parsded object 를 다시 stringify 하여 package.json 에 다시쓰기 합니다.
  // null, 2 는 2칸 들여쓰기로 보기 좋게 포맷
  // \n 은 줄바꿈 추가
  // utf8 은 파일 인코딩
  await fs.writeFile(targetPath, JSON.stringify(target, null, 2) + "\n", "utf8");
}