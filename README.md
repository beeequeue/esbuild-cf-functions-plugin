# `esbuild-cf-functions-plugin`

[![npm](https://img.shields.io/npm/v/esbuild-cf-functions-plugin)](https://www.npmjs.com/package/esbuild-cf-functions-plugin)
![node-current](https://img.shields.io/node/v/esbuild-cf-functions-plugin)
![esbuild-current](https://img.shields.io/badge/esbuild-^0.14.46-green)
[![Codecov](https://img.shields.io/codecov/c/github/BeeeQueue/esbuild-cf-functions-plugin?token=S8W0PQDUQ1)](https://app.codecov.io/github/BeeeQueue/esbuild-cf-functions-plugin)

This plugin configures ESBuild for building code [compatible][runtime] with [CloudFront Functions][cf-functions].

As can be seen in the documentation, CloudFront Functions do not run on Node, but on AWS's custom JS runtime.

According to them, it

> ... is compliant with ECMAScript (ES) version 5.1 and also supports some features of ES versions 6 through 9.

This plugin does its best to enable and disable transpiling features as the [documentation says is available][runtime].

**Check out the [example](./example)!**

## Usage

<details>
  <summary>Installation</summary>

```shell
npm i -D esbuild-cf-functions-plugin
```

```shell
pnpm i -D esbuild-cf-functions-plugin
```

```shell
yarn add -D esbuild-cf-functions-plugin
```

</details>

```js
// build.mjs
import { build } from "esbuild"
import { CloudFrontFunctionsPlugin } from "esbuild-cf-functions-plugin"

void build({
  entryPoints: ["src/index.ts"],
  outdir: "dist",

  minify: true,
  logLevel: "info",

  plugins: [CloudFrontFunctionsPlugin()],
})
```

_The plugin overrides the `format` and `target` options, unless I did something wrong._

[cf-functions]: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/functions-javascript-runtime-features.html
[runtime]: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/functions-javascript-runtime-features.html
