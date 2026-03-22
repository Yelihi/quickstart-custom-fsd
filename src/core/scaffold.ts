import path from "node:path";
import kleur from "kleur";

import { copyDir, ensureEmptyDir } from "./copy-template";
import { mergePackageJsonFromOverlay } from "./merge-package";
import { applyTokenReplacement } from "./render";
import { exists, forcePackageName, renameGitignore } from "./utils";

import type { UserChoices } from "./prompt";
import type { Framework, TestTool } from "../interface";

export interface ScaffoldOptions {
    userChoices: UserChoices;
    targetDir: string;
    templatesRoot: string;
}

export interface ScaffoldResult {
    overlaysApplied: string[];
}

/**
 * @description 선택된 overlays 에 따른 templates overlay list 반환
 */
export const overlaysFor = (framework: Framework, opts: {
    tailwind: boolean;
    store: boolean;
    serverState: boolean;
    test: TestTool;
    husky: boolean;
}): string[] => {
    const list: string[] = [];

    if (opts.tailwind) list.push("tailwind");
    if (opts.store) {
        if (framework === "vue-vite") list.push("store-pinia");
        else list.push("store-zustand");
    }
    if (opts.serverState) list.push("tanstack-query");
    if (opts.test !== "none") list.push(`test-${opts.test}`);
    if (opts.husky) list.push("husky");

    return list;
};

/**
 * @description UserChoices 를 받아 프로젝트를 스캐폴딩하는 순수 함수
 * process.exit() 없이 에러를 throw 함
 */
export async function scaffold(options: ScaffoldOptions): Promise<ScaffoldResult> {
    const { userChoices, targetDir, templatesRoot } = options;

    const baseDir = path.join(templatesRoot, userChoices.framework, `base-${userChoices.language}`);

    if (!await exists(baseDir)) {
        throw new Error(`Base template not found: ${baseDir}`);
    }

    await ensureEmptyDir(targetDir);
    await copyDir(baseDir, targetDir);

    const overlayNames = overlaysFor(userChoices.framework, userChoices);
    const overlaysApplied: string[] = [];

    for (const name of overlayNames) {
        const overlayDir = path.join(templatesRoot, userChoices.framework, "overlays", name);

        if (!await exists(overlayDir)) {
            console.log(kleur.yellow(`⚠ Overlay not found (skipped): ${name}`));
            continue;
        }

        await copyDir(overlayDir, targetDir, new Set(["package.json", "ts", "js"]));

        const langOverlayDir = path.join(overlayDir, userChoices.language);
        if (await exists(langOverlayDir)) {
            await copyDir(langOverlayDir, targetDir, new Set(["package.json"]));
        }

        const overlayPkgPath = path.join(overlayDir, "package.json");
        if (await exists(overlayPkgPath)) {
            await mergePackageJsonFromOverlay({ projectDir: targetDir, overlayPackageJsonPath: overlayPkgPath });
        }

        overlaysApplied.push(name);
    }

    await renameGitignore(targetDir);
    await applyTokenReplacement(targetDir, {
        "__PROJECT_NAME__": userChoices.projectName
    });
    await forcePackageName(targetDir, userChoices.projectName);

    return { overlaysApplied };
}
