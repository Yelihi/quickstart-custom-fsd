// node
import path from "node:path";
import { fileURLToPath } from "node:url";
import kleur from "kleur";

import { resolveTemplatesRoot } from "../core/utils";
import { getPackageManager, pmCommands } from "../core/pm";
import { output } from "../core/print";

import { askUserChoices } from "../core/prompt";
import { validateProjectName } from "../core/validate";
import { scaffold } from "../core/scaffold";

// type
import { OutputPrint } from "../interface";

// overlaysFor를 re-export (기존 import 코드와의 호환성)
export { overlaysFor } from "../core/scaffold";


export const runCreate = async (params: { args: string[] }) => {

    // 사용자의 옵션 선택에 따른 options record 반환
    const userChoices = await askUserChoices();

    // 우선 프로젝트의 이름이 적합한지 파악
    const nameCheckResult = validateProjectName(userChoices.projectName);

    if (!nameCheckResult.pass) {
        console.log(kleur.red(`✖ ${nameCheckResult.reason}`))
        process.exit(1);
    }

    // 프로젝트의 해당 루트를 설정 (절대경로/project)
    const targetDir = path.resolve(process.cwd(), userChoices.projectName)

    // dist에서 실행되도 templates 를 안정적으로 찾기 위해
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const templatesRoot = await resolveTemplatesRoot(__dirname);

    await scaffold({ userChoices, targetDir, templatesRoot });

    /**
     * 최종 output
     */
    const packageManager = getPackageManager();
    const { installCmd, installArgs, runCmd, runArgs } = pmCommands(packageManager);

    const args: OutputPrint = {
        projectName: userChoices.projectName,
        pmInstall: installCmd,
        pmInstallArgs: installArgs,
        pmRun: runCmd,
        pmRunArgs: runArgs
    }

    output(args);
}
