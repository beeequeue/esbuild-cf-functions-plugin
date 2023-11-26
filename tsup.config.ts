import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/plugin.ts"],

  clean: true,
  minify: true,
  splitting: false,

  platform: "node",
  target: "node18",
  format: ["cjs", "esm"],
  sourcemap: true,
  dts: true,
})
