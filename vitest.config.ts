import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    reporters: ["verbose"],

    coverage: {
      enabled: true,
      reporter: ["text", "lcov"],
      reportsDirectory: "node_modules/.coverage",
    },
  },
})
