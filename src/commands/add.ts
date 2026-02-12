// src/commands/add.ts
import kleur from "kleur";

export const runAdd = async ({ args }: { args: string[] }) => {
    const [kind, name] = args;

    if (!kind || kind === "--help" || kind === "-h") {
        console.log(`
Usage:
  custom-fsd add <kind> <name>

Examples:
  custom-fsd add query users
  custom-fsd add feature auth
`.trim());
        return;
    }

    if (!name) {
        console.log(kleur.red(`✖ Missing name. Example: create-my-fsd add ${kind} users`));
        process.exit(1);
    }

    // TODO (추후):
    // 1) project root 탐색 (package.json 기준)
    // 2) .my-fsd.json 읽어서 framework/language/options 파악
    // 3) kind별 generator 실행
    // 4) 필요시 provider/route 파일에 자동 삽입

    console.log(kleur.cyan(`(stub) add ${kind}: ${name}`));
}