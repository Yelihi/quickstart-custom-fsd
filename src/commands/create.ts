// node
import path from "node:path";
import fs from "node:fs/promises"
import { fileURLToPath } from "node:url";
import kleur from "kleur";

import { ensureEmptyDir } from "../core/copy-template";
import { copyDir } from "../core/copy-template";
import { applyTokenReplacement } from "../core/render";
import { exists, forcePackageName, renameGitignore } from "../core/utils";
import { getPackageManager, pmCommands } from "../core/pm";

import { askUserChoices } from "../core/prompt";
import { validateProjectName } from "../core/validate";

// type
import { Framework, TestTool } from "../interface";
import { mergePackageJsonFromOverlay } from "../core/merge-package";


type Flags = { install: boolean, nogit: boolean }


/**
 * @description 선택된 overlays 에 따른 templates overlay list 반환
 * @param framework 
 * @param opts 
 * @returns 
 */
export const overlaysFor = (framework: Framework, opts: {
    tailwind: boolean,
    store: boolean,
    serverState: boolean,
    test: TestTool,
    husky: boolean,
}): string[] => {
    const list: string[] = [];

    if (opts.tailwind) list.push("tailwind");
    if (opts.store) {
        if (framework === "vue-vite") list.push("store-pinia");
        else list.push("store-zustand");
    }
    if (opts.serverState) list.push("tanstack-query");
    if (opts.test !== "none") list.push(`test-${opts.test}`)
    if (opts.husky) list.push("husky");

    return list;
}


export const runCreate = async (params: {
    flags: Flags,
    args: string[]
}) => {

    // 사용자의 옵션 선택에 따른 options record 반환
    const userChoices = await askUserChoices();

    // 우선 프로젝트의 이름이 적합한지 파악
    const nameCheckResult = validateProjectName(userChoices.projectName);

    if (!nameCheckResult.pass) {
        console.log(kleur.red(`✖ ${nameCheckResult.reason}`))
        process.exit(1); // 프로세스 종료
    }

    // 프로젝트의 해당 루트를 설정 (절대경로/project)
    const targetDir = path.resolve(process.cwd(), userChoices.projectName)

    // dist에서 실행되도 templates 를 안정적으로 찾기 위해
    // import.meta.url 은 현재 실행중 파일의 url (예: file://User/yelihi/project/src/command/create.ts)
    // fileURLToPath 는 url 을 파일 경로로 변경 (앞에 file:// 삭제)
    const __filename = fileURLToPath(import.meta.url);
    // path.dirname 은 파일 경로에서 디렉토리 경로만 추출 (즉, create.ts 를 제거)
    const __dirname = path.dirname(__filename);
    // 해당 파일이 실행되는 부분에서 2번 상위로 이동하여 templates 를 찾기 위함임
    // project/templates
    const templatesRoot = path.resolve(__dirname, "..", "..", "templates");

    // js, ts 에 따라 적용될 기본 템플릿의 경로
    // project/templates/react-vite/base-ts (예시)
    const baseDir = path.join(templatesRoot, userChoices.framework, `base-${userChoices.language}`)

    // 기본 템플릿이 존재하지 않는다면 에러 출력 후 종료
    if (!await exists(baseDir)) {
        console.log(kleur.red(`✖ Base template not found: ${baseDir}`))
        process.exit(1);
    }

    /**
     * 1. 사용자가 설치하고자 하는 폴더가 빈 폴더인지 확인한다
     * 2. 기본 템플릿을 복사하여 설정해준다
     * 3. 추가 사용자의 옵션 선택에 따라 overlay 부분을 적용시킨다
     */
    await ensureEmptyDir(targetDir);
    await copyDir(baseDir, targetDir);

    const overlayNames = overlaysFor(userChoices.framework, userChoices)

    for (const name of overlayNames) {
        // project/templates/react-vite/overlays/tailwind (예시)
        const overlayDir = path.join(templatesRoot, userChoices.framework, "overlays", name);

        // overlays 설정은 선택이기에 존재하지 않는다면 건너뛰면 됩니다.
        if (!await exists(overlayDir)) {
            console.log(kleur.yellow(`⚠ Overlay not found (skipped): ${name}`))
            continue;
        }

        // 기존 baseDir 를 overlay 로 덮어씌어준다.
        // 여기서 전체 변경이 아니라 overlay 내 존재 파일들만 기존 base 에 덮어씌어주는것임
        await copyDir(overlayDir, targetDir);

        // 마지막으로 package.json 을 합쳐준다
        const overlayPkgPath = path.join(overlayDir, "package.json");

        if (await exists(overlayPkgPath)) {
            await mergePackageJsonFromOverlay({ projectDir: targetDir, overlayPackageJsonPath: overlayPkgPath })
        }
    }

    /**
     * 4. gitignore 이름 재 설정
     * 5. 설정한 token (project name 이나 language 등등) 을 적용
     * 6. package.json 이름 재 설정
     */
    await renameGitignore(targetDir);
    await applyTokenReplacement(targetDir, {
        "__PROJECT_NAME__": userChoices.projectName
    });
    await forcePackageName(targetDir, userChoices.projectName);


    /**
     * 최종 output
     */
    const packageManager = getPackageManager();
    const { installCmd, installArgs, runCmd, runArgs } = pmCommands(packageManager);

    console.log("");
    console.log(kleur.green(`✔ Project created: ${targetDir}`));
    console.log("");
    console.log(`   cd ${userChoices.projectName}`);
    console.log(`   ${installCmd} ${installArgs.join(" ")}`);
    console.log(`   ${runCmd} ${runArgs.join(" ")} dev`);
    console.log("");


}



