import type { StorybookConfig } from "@storybook/vue3-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx|js|jsx)"],
  addons: ["@storybook/addon-mcp"],
  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },
};

export default config;
