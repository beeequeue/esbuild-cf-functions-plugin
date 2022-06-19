import type { Plugin } from "esbuild"

// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/functions-javascript-runtime-features.html
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
}

export const CloudFrontFunctionsPlugin = (): Plugin => ({
  name: "cloudfront",

  setup: (build) => {
    build.initialOptions.target = "es5"
    build.initialOptions.format = "esm"

    if (build.initialOptions.minify) {
      build.initialOptions.minify = false
      build.initialOptions.minifyIdentifiers = false
      build.initialOptions.minifyWhitespace = true
      build.initialOptions.minifySyntax = true
    }

    build.initialOptions.supported = {
      ...config,
      ...build.initialOptions.supported,
    }
  },
})
