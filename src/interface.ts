export type Framework = "react-vite" | "next" | "vue-vite";
export type TestTool = "none" | "jest" | "vitest";

export interface Flags {
    install: boolean;
    noGit: boolean;
}

/** command */
export type Command =
    | "create"
    | "add"

/** print */
export interface OutputPrint {
    projectName: string;
    pmInstall: string;
    pmInstallArgs: string[];
    pmRun: string;
    pmRunArgs: string[];
}