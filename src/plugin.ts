import type { Plugin } from "esbuild"

const config = {
  // Note: The const and let statements are not supported.
  "const-and-let": false,
  // The ES 7 exponentiation operator (**) is supported.
  "exponent-operator": true,
  // ES 6 template literals are supported: multiline strings, expression interpolation, and nesting templates.
  "template-literal": true,
  // ES 6 arrow functions are supported, and ES 6 rest parameter syntax is supported.
  arrow: true,
  "rest-argument": true,
  // ES 9 named capture groups are supported.
  "regexp-named-capture-groups": true,
  //
  // "object-rest-spread": true,
  //
  // "object-rest-spread": true,
  //
  // "object-rest-spread": true,
}

export const CloudFrontPlugin = (): Plugin => ({
  name: "cloudfront",

  setup: (build) => {
    build.initialOptions.bundle = true
    build.initialOptions.target = "es5"
    build.initialOptions.format = "cjs"

    build.initialOptions.external = [...(build.initialOptions.external ?? []), "crypto"]

    build.initialOptions.supported = {
      ...config,
      ...build.initialOptions.supported,
    }
  },
})
