import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  platform: "node",
  target: "node18",
  outDir: "dist",
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  // templates 폴더는 번들에 포함되는 게 아니라 npm files로 같이 배포됨
});