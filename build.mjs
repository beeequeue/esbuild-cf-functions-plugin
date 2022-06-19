import { build } from "esbuild"

void build({
  entryPoints: ["src/handler.ts"],
  outdir: "dist",

  supported: {
    // Note: The const and let statements are not supported.
    "const-and-let": false,
    // The ES 7 exponentiation operator (**) is supported.
    "exponent-operator": true,
    // ES 6 template literals are supported: multiline strings, expression interpolation, and nesting templates.
    "template-literal": true,
    // ES 6 arrow functions are supported, and ES 6 rest parameter syntax is supported.
    "arrow": true,
    "rest-argument": true,
    //
    // "object-rest-spread": true,
    //
    // "object-rest-spread": true,
    //
    // "object-rest-spread": true,
    //
    // "object-rest-spread": true,
  },

  target: "es5",
  format: "esm",

  minify: false,
})
