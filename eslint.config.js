import antfu from "@antfu/eslint-config"
import e18e from "@e18e/eslint-plugin"

export default antfu(
  {
    ignores: ["**/*.json"],
    markdown: false,
    stylistic: false,
    jsonc: false,
    jsx: false,
    pnpm: false,
    toml: false,
    test: { overrides: { "test/no-import-node-test": "off" } },
    typescript: {
      tsconfigPath: "tsconfig.json",
      ignoresTypeAware: ["copy.ts", "*.config.*"],

      overrides: {
        "no-console": "off",
        "antfu/no-top-level-await": "off",
        "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
        "node/prefer-global/process": "off",
        "ts/consistent-type-definitions": "off",
        "ts/consistent-type-imports": [
          "error",
          { fixStyle: "inline-type-imports", disallowTypeAnnotations: false },
        ],
        "ts/no-unsafe-argument": "off",
        "ts/no-unsafe-assignment": "off",
        "ts/no-use-before-define": "off",
        "unicorn/number-literal-case": "off",
        "unused-imports/no-unused-vars": "off",

        "perfectionist/sort-imports": [
          "error",
          {
            type: "natural",
            internalPattern: ["^@/", "^~/", "^#[a-zA-Z0-9-]+/"],
            newlinesBetween: 1,
            groups: [
              "builtin",
              "external",
              "internal",
              "parent",
              "sibling",
              "index",
              "unknown",
            ],
          },
        ],
      },
    },
  },
  e18e.configs.recommended,
  {
    files: ["example/**"],
    rules: {
      "no-var": "off",
      "vars-on-top": "off",
      "no-console": "off",
      "prefer-destructuring": "off",
      "unused-imports/no-unused-vars": "off",
      "unicorn/prefer-node-protocol": "off",
    },
  },
)
