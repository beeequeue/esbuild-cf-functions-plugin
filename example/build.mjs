import { build } from "esbuild"
import { CloudFrontFunctionsPlugin } from "esbuild-cf-functions-plugin"

void build({
  entryPoints: ["src/handler.ts"],
  outdir: "dist",

  minify: false,
  logLevel: "info",

  plugins: [CloudFrontFunctionsPlugin()],
})
