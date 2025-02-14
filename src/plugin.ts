import type { PartialMessage, Plugin } from "esbuild"

// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/functions-javascript-runtime-features.html
const supportedV1 = {
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

const supportedV2 = {
  ...supportedV1,
  // Const and let statements are supported in v2.
  "const-and-let": true,
  // ES 6 await expressions are supported in v2.
  "async-await": true,
}

export type PluginConfig = {
  /**
   * CloudFront Functions JavaScript runtime environment version to build for
   *
   * @default 1
   */
  runtimeVersion?: 1 | 2
}
export const CloudFrontFunctionsPlugin = ({
  runtimeVersion,
}: PluginConfig = {}): Plugin => ({
  name: "cloudfront",

  setup: (build) => {
    build.onStart(() => {
      const warnings: PartialMessage[] = []

      if (build.initialOptions.platform != null) {
        warnings.push({
          text: `'platform' is set to '${build.initialOptions.platform}'\n  CloudFront Functions run on a platform that is neither 'node' or 'browser', so configuring your code to build for them is pointless.`,
        })
      }
      if (build.initialOptions.minifyIdentifiers) {
        warnings.push({
          text: `'minifyIdentifiers' is set to true but was forced to false.\n  It would break functions as the handler function would be renamed.`,
        })
      }
      if (build.initialOptions.format && build.initialOptions.format !== "esm") {
        warnings.push({
          text: `'format' is set to ${build.initialOptions.format} but was forced to 'esm'.\n  'esm' produces the smallest files while still working.`,
        })
      }

      return {
        warnings,
      }
    })

    build.initialOptions.target = "es5"
    build.initialOptions.format = "esm"
    // If identifiers are minified `handler` will be, and will break the function
    build.initialOptions.minifyIdentifiers = false

    if (build.initialOptions.minify) {
      build.initialOptions.minify = false
      build.initialOptions.minifyWhitespace = true
      build.initialOptions.minifySyntax = true
    }

    build.initialOptions.supported = {
      ...(runtimeVersion === 2 ? supportedV2 : supportedV1),
      ...build.initialOptions.supported,
    }
  },
})
