#!/usr/bin/env node // 터미널에서 사용될 것인데, 해당 실행은 Node 기반이라는 점을 명시한다.
import kleur from "kleur";

// commands
import { runCreate } from "./commands/create";
import { runAdd } from "./commands/add";

// core
import { help } from "./core/print";
import { normalizeArgv } from "./core/utils";

// interface
import { Flags, Command } from "./interface";

const command_map: Record<Command, (params: { args: string[] }) => Promise<void>> = {
    create: runCreate,
    add: runAdd
    // 다른 명령어 추가
}

export const main = async () => {
    const argv = normalizeArgv(process.argv)

    // help 요청 시
    if (argv.includes("--help") || argv.includes("-h")) {
        help();
        return;
    }

    const first = argv[0];

    /**
     * command 결정
     * - 인자가 없으면 create
     * - create 또는 add 이면 해당 커맨드
     * - 그 외라면 create 로 처리
     */
    const command = !first || first.startsWith("--") ? "create" : first === "create" || first === "add" ? first : "create";

    const rest = command === "create" || command === "add" ? argv.slice(1) : argv;

    const handler = command_map[command];

    if (!handler) {
        console.log(kleur.red(`✖ Unknown command: ${command}`))
        help();
        process.exit(1);
    }

    try {
        await handler({ args: rest });
    } catch (error) {
        console.log(kleur.red(`✖ Error: ${error}`))
        process.exit(1);
    }

}

main().catch((error) => {
    console.error(kleur.red(String(error.message || error)))
    process.exit(1)
})
