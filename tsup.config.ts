import { defineConfig } from "tsup"

export default defineConfig({
  entryPoints: ["src/index.ts"],

  target: "node16",
  format: ["cjs"],
  sourcemap: true,
  dts: true,

  clean: true,
  minify: true,
})
