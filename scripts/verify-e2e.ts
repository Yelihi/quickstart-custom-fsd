/**
 * E2E 검증 스크립트
 * 각 프레임워크 preset 으로 프로젝트를 스캐폴딩하고, npm install + npm run build 를 실행하여
 * 에러 없이 빌드되는지 확인합니다.
 * storybook preset 이 있는 경우 storybook dev 서버를 기동하고 /mcp 엔드포인트도 검증합니다.
 *
 * 실행: npx tsx scripts/verify-e2e.ts
 */

import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { execSync, spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

import { scaffold } from "../src/core/scaffold";
import { presetFor } from "../src/core/prompt";
import type { Framework } from "../src/core/prompt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATES_ROOT = path.resolve(__dirname, "../templates");

const FRAMEWORKS: Framework[] = ["react-vite", "next", "vue-vite"];

const MCP_INIT_PAYLOAD = JSON.stringify({
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "verify-e2e", version: "1.0.0" },
  },
});

interface VerifyResult {
  framework: Framework;
  success: boolean;
  error?: string;
  durationMs: number;
}

/**
 * Storybook dev 서버를 기동하고 /mcp 엔드포인트에 MCP initialize 요청을 보내
 * 유효한 JSON-RPC 응답을 반환하는지 검증합니다.
 */
async function verifyStorybookMcp(targetDir: string): Promise<void> {
  const sb = spawn("npm", ["run", "storybook", "--", "--ci", "--no-open"], {
    cwd: targetDir,
    stdio: "pipe",
  });

  let sbOut = "";
  let detectedPort = "6006";

  const ready = await new Promise<boolean>((resolve) => {
    const onData = (d: Buffer) => {
      const chunk = d.toString();
      sbOut += chunk;
      const clean = chunk.replace(/\x1b\[[0-9;]*m/g, "");
      const portMatch = clean.match(/Local.*localhost:(\d+)/i);
      if (portMatch) {
        detectedPort = portMatch[1];
        resolve(true);
      }
    };
    sb.stdout.on("data", onData);
    sb.stderr.on("data", onData);
    sb.on("exit", (code) => {
      if (code !== 0) resolve(false);
    });
    setTimeout(() => resolve(false), 120_000);
  });

  try {
    if (!ready) {
      throw new Error(`Storybook failed to start.\n${sbOut.slice(-1000)}`);
    }

    // 안정화 대기
    await new Promise((r) => setTimeout(r, 2000));

    const mcpUrl = `http://localhost:${detectedPort}/mcp`;
    let response: string;
    try {
      response = execSync(
        `curl -s --max-time 10 -X POST \
                  -H "Content-Type: application/json" \
                  -H "Accept: application/json, text/event-stream" \
                  -d '${MCP_INIT_PAYLOAD}' \
                  ${mcpUrl}`,
        { encoding: "utf-8", timeout: 15_000 },
      );
    } catch (e) {
      const err = e as NodeJS.ErrnoException & { stdout?: string };
      response = err.stdout ?? "";
      if (!response) throw new Error(`/mcp request failed: ${err.message}`);
    }

    if (!response.includes('"jsonrpc"') || !response.includes('"result"')) {
      throw new Error(
        `/mcp returned unexpected response:\n${response.slice(0, 400)}`,
      );
    }
  } finally {
    sb.kill("SIGTERM");
    await new Promise((r) => setTimeout(r, 500));
  }
}

async function verifyFramework(
  framework: Framework,
  workDir: string,
): Promise<VerifyResult> {
  const start = Date.now();
  const projectName = `e2e-${framework}`;
  const targetDir = path.join(workDir, projectName);

  try {
    const choices = {
      projectName,
      framework,
      ...presetFor(framework),
    };

    await scaffold({
      userChoices: choices,
      targetDir,
      templatesRoot: TEMPLATES_ROOT,
    });

    execSync("npm install", {
      cwd: targetDir,
      stdio: "pipe",
      timeout: 180_000,
    });

    execSync("npm run build", {
      cwd: targetDir,
      stdio: "pipe",
      timeout: 120_000,
    });

    if (choices.storybook) {
      await verifyStorybookMcp(targetDir);
    }

    return { framework, success: true, durationMs: Date.now() - start };
  } catch (e) {
    return {
      framework,
      success: false,
      error: e instanceof Error ? e.message : String(e),
      durationMs: Date.now() - start,
    };
  }
}

async function main() {
  console.log("🚀 E2E 검증 시작\n");

  const workDir = await fs.mkdtemp(path.join(os.tmpdir(), "qs-e2e-"));
  console.log(`임시 디렉토리: ${workDir}\n`);

  const results: VerifyResult[] = [];

  for (const fw of FRAMEWORKS) {
    process.stdout.write(`  ${fw} ... `);
    const result = await verifyFramework(fw, workDir);
    results.push(result);

    if (result.success) {
      console.log(`✓ (${(result.durationMs / 1000).toFixed(1)}s)`);
    } else {
      console.log(`✗ FAILED`);
      console.error(`    ${result.error}`);
    }
  }

  await fs.rm(workDir, { recursive: true, force: true });

  console.log("\n--- 결과 ---");
  for (const r of results) {
    const icon = r.success ? "✓" : "✗";
    console.log(`  ${icon} ${r.framework}`);
  }

  const failed = results.filter((r) => !r.success);
  if (failed.length > 0) {
    console.error(`\n✗ ${failed.length}개 프레임워크 검증 실패`);
    process.exit(1);
  }

  console.log(`\n✓ 전체 ${results.length}개 프레임워크 검증 완료`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
