import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: [], // 필요한 경우 setup 파일을 추가할 수 있습니다.
    },
});
