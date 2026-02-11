import prompts from "prompts";

export type Framework = "react-vite" | "next" | "vue-vite";
export type Language = "js" | "ts";
export type TestTool = "none" | "jest" | "vitest";

export type SetupMode = "preset" | "custom";

export type UserChoices = {
  projectName: string;
  framework: Framework;
  language: Language;
  tailwind: boolean;
  store: boolean;
  serverState: boolean;
  test: TestTool;
  husky: boolean;
};

function presetFor(framework: Framework): Omit<UserChoices, "projectName" | "framework"> {
  switch (framework) {
    case "next":
      return {
        language: "ts",
        tailwind: true,
        store: true,         // zustand
        serverState: true,   // tanstack-query
        test: "jest",
        husky: true,
      }
    case "vue-vite":
      return {
        language: "ts",
        tailwind: true,
        store: true,         // pinia
        serverState: true,   // tanstack-query
        test: "vitest",
        husky: true,
      }
    case "react-vite":
      return {
        language: "ts",
        tailwind: true,
        store: true,         // zustand
        serverState: true,   // tanstack-query
        test: "vitest",
        husky: true,
      }
    default:
      throw new Error(`Unsupported framework: ${framework}`);
  }
}

export async function askUserChoices(): Promise<UserChoices> {
  const onCancel = () => process.exit(1);

  const r1 = await prompts(
    {
      type: "text",
      name: "projectName",
      message: "1) 프로젝트의 이름을 입력해주세요",
      initial: "my-fsd-app",
    },
    { onCancel }
  );

  const r2 = await prompts(
    {
      type: "select",
      name: "framework",
      message: "2) 프레임워크를 선택해주세요",
      choices: [
        { title: "React + Vite", value: "react-vite" },
        { title: "Next.js", value: "next" },
        { title: "Vue.js + Vite", value: "vue-vite" },
      ],
      initial: 0, // 첫 번째 옵션을 기본값으로 설정
    },
    { onCancel }
  );

  const rMode = await prompts(
    {
      type: "select",
      name: "mode",
      message: "추천 설정으로 진행할까요?",
      choices: [
        { title: "Preset (recommended)", value: "preset" },
        { title: "Custom", value: "custom" },
      ],
      initial: 0,
    },
    { onCancel }
  );

  const projectName = String(r1.projectName || "").trim();
  const framework = r2.framework as Framework;
  const mode = rMode.mode as SetupMode;

  if (mode === "preset") {
    const presetSettings = presetFor(framework);
    return { projectName, framework, ...presetSettings };
  }

  /**
   * mode = custom 인 경우 추가적인 설정을 진행합니다.
   */
  const r3 = await prompts(
    {
      type: "select",
      name: "language",
      message: "3) 언어를 선택해주세요",
      choices: [
        { title: "JavaScript", value: "js" },
        { title: "TypeScript", value: "ts" },
      ],
      initial: 1,
    },
    { onCancel }
  );

  const r4 = await prompts(
    {
      type: "toggle",
      name: "tailwind",
      message: "4) TailwindCSS를 사용할까요?",
      initial: true,
      active: "yes",
      inactive: "no",
    },
    { onCancel }
  );

  const r5 = await prompts(
    {
      type: "toggle",
      name: "store",
      message: "5) 클라이언트 스토어를 추가할까요? (React/Next: zustand, Vue: pinia)",
      initial: true,
      active: "yes",
      inactive: "no",
    },
    { onCancel }
  );

  const r6 = await prompts(
    {
      type: "toggle",
      name: "serverState",
      message: "6) 서버 상태 관리를 추가할까요? (TanStack Query)",
      initial: true,
      active: "yes",
      inactive: "no",
    },
    { onCancel }
  );

  const r7 = await prompts(
    {
      type: "select",
      name: "test",
      message: "7) 테스트 도구를 추가할까요?",
      choices: [
        { title: "No test", value: "none" },
        { title: "yes", value: framework === "next" ? "jest" : "vitest" },
      ],
      initial: 0
    },
    { onCancel }
  );

  const r8 = await prompts(
    {
      type: "toggle",
      name: "husky",
      message: "8) Husky를 추가할까요?",
      initial: true,
      active: "yes",
      inactive: "no",
    },
    { onCancel }
  );

  return {
    projectName,
    framework,
    language: r3.language as Language,
    tailwind: !!r4.tailwind,
    store: !!r5.store,
    serverState: !!r6.serverState,
    test: r7.test as TestTool,
    husky: !!r8.husky,
  };
}