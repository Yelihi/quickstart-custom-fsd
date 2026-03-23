import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  { ignores: [".next", "out", "dist", "build", "node_modules"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    plugins: {
      "@next/next": nextPlugin,
      "react-hooks": reactHooks,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      ...reactHooks.configs.recommended.rules,
    },
  },
  eslintConfigPrettier,
];
