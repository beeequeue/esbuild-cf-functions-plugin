import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    reporters: ["verbose"],

    coverage: {
      enabled: true,
      include: ["src/**/*"],
      reporter: ["text", "lcov"],
      reportsDirectory: "node_modules/.coverage",
    },
  },
})
