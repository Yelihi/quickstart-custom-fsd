
import { spawn } from "node:child_process"

/**
 * @description cli 명령어 실행 (콜백, 이벤트 api 이기에 Promise 사용)
 * @param cmd 명령어 (예를 들어 'npm')
 * @param args 명령어 인자 (예를 들어 ['install', '--save-dev']) - 공백 포함될 수 있어 이를 안전하게 처리하기 위해 명령어와 분리
 * @param opts 옵션 (현재 cwd만 사용 - 작업 디렉토리 경로)
 * @returns 
 */
export const runCommand = (
  cmd: string,
  args: string[],
  opts: { cwd: string }
): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 자식 프로세스를 생성합니다. (외부 명령어를 실행)
    const child = spawn(cmd, args, {
      cwd: opts.cwd, // 실행 시점의 경로를 넣는다.
      stdio: "inherit", // 자식 프로세스의 stdout/stderr 이 그대로 보임 (즉, 자식 프로세스의 터미널을 부모 프로세스의 터미널에서 볼 수 있음)
      shell: process.platform === "win32", // 윈도우 환경에서는 cmd.exe를 사용하도록 설정 (윈도우는 셸을 통해서만 실행 가능)
    });

    // 자식 프로세스 종료 시
    child.on("close", (code) => {
      if (code === 0) resolve(); // 정상 종료 (resolve)
      else reject(new Error(`${cmd} ${args.join(" ")} exited with code ${code}`));
    });

    // 프로세스 자체를 실행할 수 없을 때
    child.on("error", reject);
  });
}