import { defineConfig } from "tsup"

export default defineConfig({
  entryPoints: ["src/plugin.ts"],

  clean: true,
  minify: true,
  splitting: false,

  platform: "node",
  target: "node14",
  format: ["cjs", "esm"],
  sourcemap: true,
  dts: true,
})
