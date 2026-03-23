import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  { ignores: ["dist", "build", "node_modules"] },
  js.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  eslintConfigPrettier,
];
