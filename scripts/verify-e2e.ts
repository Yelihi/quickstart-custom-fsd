/**
 * E2E 검증 스크립트
 * 각 프레임워크 preset 으로 프로젝트를 스캐폴딩하고, npm install + npm run build 를 실행하여
 * 에러 없이 빌드되는지 확인합니다.
 *
 * 실행: npx tsx scripts/verify-e2e.ts
 */

import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { scaffold } from "../src/core/scaffold";
import { presetFor } from "../src/core/prompt";
import type { Framework } from "../src/core/prompt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATES_ROOT = path.resolve(__dirname, "../templates");

const FRAMEWORKS: Framework[] = ["react-vite", "next", "vue-vite"];

interface VerifyResult {
    framework: Framework;
    success: boolean;
    error?: string;
    durationMs: number;
}

async function verifyFramework(framework: Framework, workDir: string): Promise<VerifyResult> {
    const start = Date.now();
    const projectName = `e2e-${framework}`;
    const targetDir = path.join(workDir, projectName);

    try {
        const choices = {
            projectName,
            framework,
            ...presetFor(framework),
        };

        await scaffold({ userChoices: choices, targetDir, templatesRoot: TEMPLATES_ROOT });

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

    const failed = results.filter(r => !r.success);
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
