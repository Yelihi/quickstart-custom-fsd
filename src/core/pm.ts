/**
 * @description package manager 관리
 * 실제 사용자가 create 명령어 사용시 어떠한 패키지 매니저를 기반으로 해야하는지 감지
 */
export type PackageManager = "npm" | "yarn" | "pnpm";
export type PackageManagerCommands = {
  installCmd: string;
  installArgs: string[];
  runCmd: string;
  runArgs: string[];
}

/**
 * @description package manager 감지
 * npm_config_user_agent 는 npm 이 제공하는 환경변수
 * @returns {PackageManager} package manager 타입
 */
export const getPackageManager = (): PackageManager => {
  const userAgent = process.env.npm_config_user_agent || "";

  if (userAgent.includes("pnpm")) return "pnpm";
  if (userAgent.includes("yarn")) return "yarn";
  return "npm";
}

/**
 * @description pm 에 따른 설치, 실행 명령어 반환
 * @param pm {PackageManager} package manager 타입
 * @returns {PackageManagerCommands} 설치, 실행 명령어 반환
 */
export const pmCommands = (pm: PackageManager): PackageManagerCommands => {
  switch (pm) {
    case "pnpm":
      return {
        installCmd: "pnpm",
        installArgs: ["install"],
        runCmd: "pnpm",
        runArgs: ["run"],
      }
    case "yarn":
      return {
        installCmd: "yarn",
        installArgs: [],
        runCmd: "yarn",
        runArgs: [],
      }
    case "npm":
      return {
        installCmd: "npm",
        installArgs: ["install"],
        runCmd: "npm",
        runArgs: ["run"],
      }
  }

}