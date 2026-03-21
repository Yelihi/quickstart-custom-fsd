import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        globals: true,
        setupFiles: [],
        exclude: ["**/node_modules/**", "**/dist/**", "**/templates/**"],
    },
});
