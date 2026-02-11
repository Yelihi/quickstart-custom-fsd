/**
 * 
 * 만일 토큰이 
 * {
 *    "{{PROJECT_NAME}}": "my-awesome-app",
 *    "{{DESCRIPTION}}": "나의 프로젝트 설명",
 * }
 * 이렇게 되어있다면 해당 토큰을 가진 파일을 조회하여 value 로 치환합니다.
 * 
 * rootDir 전체 순회 (재귀)
    │
    ├─ 디렉터리?  → 재귀 진입
    ├─ 파일 아님? → skip
    ├─ 텍스트 확장자 아님? → skip     ← looksText()
    ├─ 바이너리 파일? → skip          ← isProbablyBinary()
    │
    └─ 텍스트 파일 확인됨
        ├─ 파일 내용 읽기
        ├─ 모든 토큰 키 → 값으로 치환
        └─ 변경이 있으면 파일에 다시 쓰기
 * 
 */
import fs from "node:fs/promises";
import path from "node:path";

const TEXT_EXT = new Set([
  ".js", ".ts", ".tsx", ".jsx", ".vue",
  ".json", ".md", ".txt",
  ".css", ".scss",
  ".html",
  ".yml", ".yaml",
  ".env",
  ".cjs", ".mjs", ".mts", ".cts",
]);

/**
 * @description 텍스트 파일 확인 함수
 * @param {string} filePath 파일 경로
 * @returns {boolean} 텍스트 파일 여부
 */
export const looksText = (filePath: string) => {
  const base = path.basename(filePath);
  // package.json, _gitignore, .gitignore 는 텍스트 파일로 취급
  if (base === "package.json" || base === "_gitignore" || base === ".gitignore") return true;

  // 확장자를 추출 한 다음, TEXT_EXT 에 포함되어 있는지 확인
  const ext = path.extname(filePath).toLowerCase();
  return TEXT_EXT.has(ext);
}


/**
 * @description 바이너리 파일 확인 함수
 * @param {string} filePath 파일 경로
 * @returns {Promise<boolean>} 바이너리 파일 여부
 */
export const isProbablyBinary = async (filePath: string) => {
  const buf = await fs.readFile(filePath);

  // 파일 앞 8kb 부분을 가져옵니다. (0x00 이 있으면 바이너리 파일)
  const slice = buf.subarray(0, Math.min(buf.length, 8000));
  for (const b of slice) if (b === 0) return true;
  return false;
}

/**
 * @description 토큰 치환 함수
 * @param {string} rootDir 루트 디렉토리
 * @param {Record<string, string>} tokens 토큰 레코드
 * @returns {Promise<void>} 토큰 치환 완료
 */
export const applyTokenReplacement = async (
  rootDir: string,
  tokens: Record<string, string>
): Promise<void> => {
  const entries = await fs.readdir(rootDir, { withFileTypes: true });

  for (const ent of entries) {
    const p = path.join(rootDir, ent.name); // 경로를 조합해줍니다 (재귀)

    if (ent.isDirectory()) {
      // 재귀적 호출을 진행합니다.
      await applyTokenReplacement(p, tokens);
      continue;
    }

    if (!ent.isFile()) continue; // 파일이 아니면 스킵합니다.

    if (!looksText(p)) continue; // 텍스트 파일이 아니면 스킵합니다.
    if (await isProbablyBinary(p)) continue; // 바이너리 파일이면 스킵합니다.

    // 사전 조건을 통과한 파일
    const raw = await fs.readFile(p, "utf8");

    let next = raw; // 변경 예정 파일
    for (const [k, v] of Object.entries(tokens)) {
      next = next.split(k).join(v); // replaceAll(k, v) 와 동일한 리터럴 문자열 치환
    }

    // 변경이 있으면 파일에 다시 쓰기
    if (next !== raw) {
      await fs.writeFile(p, next, "utf8");
    }
  }
}