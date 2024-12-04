import { defineConfig } from "tsup";

export default defineConfig({
  minify: true,
  clean: true,
  entry: ["src/*.ts"],
  outDir: "dist",
  format: ["cjs", "esm"],
  dts: true,
  platform: "node",
});
