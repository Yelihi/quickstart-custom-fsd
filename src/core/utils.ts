import fs from "node:fs/promises";
import path from "node:path";

/**
 * @description 파일 존재 여부 파악 함수
 * @param {string} path 파일 경로 
 * @returns 파일 존재 여부
 */
export const exists = async (path: string) => {
    try {
        await fs.access(path);
        return true;
    } catch (error) {
        return false;
    }
}


/**
 * @description gitignore 파일 이름을 .gitignore로 변경
 * @param {string} dir 파일경로
 */
export const renameGitignore = async (dir: string) => {
    const gitignorePath = path.join(dir, "gitignore");
    const dotGitignorePath = path.join(dir, ".gitignore");

    if (await exists(gitignorePath)) {
        // 기존에 .gitignore 파일이 있으면 덮어씌울 수 있어서
        if (await exists(dotGitignorePath)) {
            await fs.unlink(dotGitignorePath)
        }

        // rename 진행
        await fs.rename(gitignorePath, dotGitignorePath)
    }

}

/**
 * @description package 의 이름을 변경합니다.
 * @param {string} targetDir 대상 디렉토리
 * @param {string} name 변경할 이름
 */
export const forcePackageName = async (targetDir: string, name: string) => {
    const pkgPath = path.join(targetDir, "package.json");

    if (await exists(pkgPath)) {
        const pkg = JSON.parse(await fs.readFile(pkgPath, "utf-8"));

        pkg.name = name;
        await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8")
    }
}