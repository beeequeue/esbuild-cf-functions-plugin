import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/plugin.ts"],

  clean: true,
  splitting: false,

  platform: "node",
  target: "node20",
  format: "esm",
  dts: true,
})
