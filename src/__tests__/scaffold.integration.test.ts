import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { scaffold } from "../core/scaffold";
import { presetFor } from "../core/prompt";
import type { UserChoices, Framework } from "../core/prompt";

const TEMPLATES_ROOT = path.resolve(__dirname, "../../templates");

async function fileExists(filePath: string): Promise<boolean> {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

async function readJson(filePath: string): Promise<Record<string, unknown>> {
    return JSON.parse(await fs.readFile(filePath, "utf-8"));
}

async function containsToken(dir: string, token: string): Promise<boolean> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const ent of entries) {
        if (ent.isDirectory()) {
            if (["node_modules", ".git"].includes(ent.name)) continue;
            if (await containsToken(path.join(dir, ent.name), token)) return true;
        } else {
            try {
                const content = await fs.readFile(path.join(dir, ent.name), "utf-8");
                if (content.includes(token)) return true;
            } catch {
                // binary file 등은 무시
            }
        }
    }
    return false;
}

describe("scaffold integration", () => {
    let tmpDir: string;

    beforeEach(async () => {
        tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "qs-test-"));
    });

    afterEach(async () => {
        await fs.rm(tmpDir, { recursive: true, force: true });
    });

    async function runScaffold(choices: UserChoices) {
        const targetDir = path.join(tmpDir, choices.projectName);
        await scaffold({ userChoices: choices, targetDir, templatesRoot: TEMPLATES_ROOT });
        return targetDir;
    }

    async function assertCommon(targetDir: string, projectName: string) {
        // package.json 유효성
        const pkg = await readJson(path.join(targetDir, "package.json"));
        expect(pkg.name).toBe(projectName);

        // .gitignore 존재, _gitignore/gitignore 미존재
        expect(await fileExists(path.join(targetDir, ".gitignore"))).toBe(true);
        expect(await fileExists(path.join(targetDir, "gitignore"))).toBe(false);
        expect(await fileExists(path.join(targetDir, "_gitignore"))).toBe(false);

        // __PROJECT_NAME__ 토큰이 남아있지 않아야 함
        expect(await containsToken(targetDir, "__PROJECT_NAME__")).toBe(false);
    }

    it("react-vite preset (TS) — 전체 overlay 적용", async () => {
        const choices: UserChoices = {
            projectName: "test-react",
            framework: "react-vite",
            ...presetFor("react-vite"),
        };
        const targetDir = await runScaffold(choices);

        await assertCommon(targetDir, "test-react");

        // tailwind overlay: index.css 에 @import "tailwindcss" 있어야 함
        const indexCss = await fs.readFile(path.join(targetDir, "src/index.css"), "utf-8");
        expect(indexCss).toContain("tailwindcss");

        // store-zustand overlay: zustand 관련 파일 존재
        expect(await fileExists(path.join(targetDir, "src/features/counter-store"))).toBe(true);

        // tanstack-query overlay
        const pkg = await readJson(path.join(targetDir, "package.json")) as { devDependencies?: Record<string, string> };
        expect(pkg.devDependencies?.["tailwindcss"]).toBeDefined();
    });

    it("next preset (TS) — 전체 overlay 적용", async () => {
        const choices: UserChoices = {
            projectName: "test-next",
            framework: "next",
            ...presetFor("next"),
        };
        const targetDir = await runScaffold(choices);

        await assertCommon(targetDir, "test-next");

        // tailwind overlay: globals.css 에 @import "tailwindcss" 있어야 함
        const globalsCss = await fs.readFile(path.join(targetDir, "src/app/globals.css"), "utf-8");
        expect(globalsCss).toContain("tailwindcss");

        // tailwind overlay: HomeView 가 CSS module import 없이 className 사용
        const homeView = await fs.readFile(path.join(targetDir, "src/views/home/ui/HomeView.tsx"), "utf-8");
        expect(homeView).not.toContain("HomeView.module.css");
        expect(homeView).toContain("className=");

        // postcss.config.mjs 존재 (next tailwind overlay)
        expect(await fileExists(path.join(targetDir, "postcss.config.mjs"))).toBe(true);
    });

    it("vue-vite preset (TS) — 전체 overlay 적용", async () => {
        const choices: UserChoices = {
            projectName: "test-vue",
            framework: "vue-vite",
            ...presetFor("vue-vite"),
        };
        const targetDir = await runScaffold(choices);

        await assertCommon(targetDir, "test-vue");

        // tailwind overlay (ts 서브디렉토리): HomePage에 <style scoped> 없어야 함
        const homePage = await fs.readFile(path.join(targetDir, "src/views/home/ui/HomePage.vue"), "utf-8");
        expect(homePage).not.toContain("<style scoped>");
        expect(homePage).toContain("class=");

        // style.css 에 @import "tailwindcss"
        const styleCss = await fs.readFile(path.join(targetDir, "src/style.css"), "utf-8");
        expect(styleCss).toContain("tailwindcss");
    });

    it("react-vite base only (JS) — overlay 미적용", async () => {
        const choices: UserChoices = {
            projectName: "test-base",
            framework: "react-vite",
            language: "js",
            tailwind: false,
            store: false,
            serverState: false,
            test: "none",
            husky: false,
            storybook: false,
        };
        const targetDir = await runScaffold(choices);

        await assertCommon(targetDir, "test-base");

        // tailwind overlay 미적용: index.css 에 @import "tailwindcss" 없어야 함
        const indexCss = await fs.readFile(path.join(targetDir, "src/index.css"), "utf-8");
        expect(indexCss).not.toContain("tailwindcss");

        // zustand 미적용: counter-store 없어야 함
        expect(await fileExists(path.join(targetDir, "src/features/counter-store"))).toBe(false);
    });
});
