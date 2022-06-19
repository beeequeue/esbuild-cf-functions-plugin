import fs from "fs/promises"
import { tmpdir } from "os"
import path from "path"

import { build, BuildOptions, BuildResult, OutputFile } from "esbuild"
import { nanoid } from "nanoid"
import dedent from "ts-dedent"
import { beforeEach, describe, expect, test, TestContext } from "vitest"

import { CloudFrontFunctionsPlugin } from "./plugin"

const getOutput = (result: BuildResult & { outputFiles: OutputFile[] }) => `
${Buffer.from(result.outputFiles[0].contents)
  .toString()
  .trim()
  // Remove path comments
  .split("\n")
  .filter((line) => !line.startsWith("//"))
  .join("\n")}
`

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface TestContext {
    tempDirPath: string
  }
}

beforeEach(async (ctx) => {
  ctx.tempDirPath = path.join(tmpdir(), nanoid())
  await fs.mkdir(ctx.tempDirPath, { recursive: true })

  return async () => {
    await fs.rmdir(ctx.tempDirPath, { recursive: true })
  }
})

const buildFile = async (
  ctx: TestContext,
  contents: string,
  extraOptions?: BuildOptions,
) => {
  const inputFilePath = path.join(ctx.tempDirPath, "index.ts")
  await fs.writeFile(inputFilePath, dedent(contents))

  return build({
    entryPoints: [inputFilePath],
    plugins: [CloudFrontFunctionsPlugin()],

    ...extraOptions,
    write: false,
  })
}

describe("const, let, var", () => {
  test("lets vars through", async (ctx) => {
    const result = await buildFile(
      ctx,
      `
        var foo = "bar"
        console.log(foo)
      `,
    )

    expect(result.outputFiles).toBeDefined()
    expect(getOutput(result)).toMatchSnapshot()
  })

  test("does not allow const", async (ctx) => {
    const promise = buildFile(
      ctx,
      `
        const foo = "bar"
        console.log(foo)
      `,
    )

    await expect(promise).rejects.toThrowError(
      "Transforming const to the configured target environment",
    )
  })

  test("does not allow let", async (ctx) => {
    const promise = buildFile(
      ctx,
      `
        let foo = "bar"
        console.log(foo)
      `,
    )

    await expect(promise).rejects.toThrowError(
      "Transforming let to the configured target environment",
    )
  })
})

test("does not allow destructing", async (ctx) => {
  const promise = buildFile(
    ctx,
    `
      var foo = { bar: true }
      var { bar } = foo
      console.log(bar)
    `,
  )

  await expect(promise).rejects.toThrowError(
    "Transforming destructuring to the configured target",
  )
})

test("allows exponent operator", async (ctx) => {
  const result = await buildFile(
    ctx,
    `
      var foo = 2 ** 2
      console.log(foo)
    `,
  )

  expect(result.outputFiles).toBeDefined()
  expect(getOutput(result)).toMatchSnapshot()
})

test("allows template strings", async (ctx) => {
  const result = await buildFile(
    ctx,
    `
      var foo = \`Hello\`
      var bar = \`\${foo}\`
    `,
  )

  expect(result.outputFiles).toBeDefined()
  expect(getOutput(result)).toMatchSnapshot()
})

describe("functions", () => {
  test("allows arrow functions", async (ctx) => {
    const result = await buildFile(
      ctx,
      `
        var foo = () => {
          return true
        }
        console.log(foo())
      `,
    )

    expect(result.outputFiles).toBeDefined()
    expect(getOutput(result)).toMatchSnapshot()
  })

  test("allows spread parameters", async (ctx) => {
    const result = await buildFile(
      ctx,
      `
        var foo = (...rest: string[]) => {
          return rest[0]
        }
        console.log(foo("test"))
      `,
    )

    expect(result.outputFiles).toBeDefined()
    expect(getOutput(result)).toMatchSnapshot()
  })
})

test("does not modify supported functions", async (ctx) => {
  const input = dedent`
    var foo = String.fromCodePoint(12);
    var foo = "bar".codePointAt(0);
    var foo = "bar".includes("ar");
    var foo = "bar".startsWith("ba");
    var foo = "bar".endsWith("ar");
    var foo = "bar".repeat(2);
    var foo = "bar".padStart(10);
    var foo = "bar".padEnd(10);
    var foo = "bar".trimStart();
    var foo = "bar".trimEnd();
  `

  const result = await buildFile(ctx, input)

  expect(result.outputFiles).toBeDefined()

  const output = getOutput(result)
  expect(output.trim()).toStrictEqual(input)
  expect(output).toMatchSnapshot()
})

test("does not modify supported functions", async (ctx) => {
  const input = dedent`
    var foo = Number.isFinite(10);
    var foo = Number.isInteger(10);
    var foo = Number.isNaN(10);
    var foo = Number.isSafeInteger(10);
    var foo = Number.parseFloat("10.0");
    var foo = Number.parseInt("10");
    var foo = Number.EPSILON;
    var foo = Number.MAX_SAFE_INTEGER;
    var foo = Number.MAX_VALUE;
    var foo = Number.MIN_SAFE_INTEGER;
    var foo = Number.MIN_VALUE;
    var foo = Number.NEGATIVE_INFINITY;
    var foo = Number.NaN;
    var foo = Number.POSITIVE_INFINITY;
    var foo = 10 .toExponential();
    var foo = 10 .toFixed();
    var foo = 10 .toPrecision(10);
  `

  const result = await buildFile(ctx, input)

  expect(result.outputFiles).toBeDefined()

  const output = getOutput(result)
  expect(output.trim()).toStrictEqual(input)
  expect(output).toMatchSnapshot()
})

describe("arrays", () => {
  test("does not modify supported functions", async (ctx) => {
    const input = dedent`
      var foo = Array.of(1, 2, 3);
      var foo = [].copyWithin(10, 0, 2);
      var foo = [].fill("foo", 0, 20);
      var foo = [].find(() => true);
      var foo = [].findIndex(() => true);
      var foo = [].includes("1");
    `

    const result = await buildFile(ctx, input)

    expect(result.outputFiles).toBeDefined()

    const output = getOutput(result)
    expect(output.trim()).toStrictEqual(input)
    expect(output).toMatchSnapshot()
  })

  test("does not modify supported typed arrays", async (ctx) => {
    const input = dedent`
      var foo = new Int8Array([1, 2, 3]);
      var foo = new Uint8Array([1, 2, 3]);
      var foo = new Uint8ClampedArray([1, 2, 3]);
      var foo = new Int16Array([1, 2, 3]);
      var foo = new Uint16Array([1, 2, 3]);
      var foo = new Int32Array([1, 2, 3]);
      var foo = new Uint32Array([1, 2, 3]);
      var foo = new Float32Array([1, 2, 3]);
      var foo = new Float64Array([1, 2, 3]);
      var foo = new Float64Array([1, 2, 3]);
      var foo = new Float64Array([1, 2, 3]).copyWithin(10, 0, 2);
      var foo = new Float64Array([1, 2, 3]).fill(1, 20);
      var foo = new Float64Array([1, 2, 3]).join("\\n");
      new Float64Array([1, 2, 3]).set([1, 2, 3]);
      var foo = new Float64Array([1, 2, 3]).slice(0, 1);
      var foo = new Float64Array([1, 2, 3]).subarray(0, 1);
      var foo = new Float64Array([1, 2, 3]).toString();
    `

    const result = await buildFile(ctx, input)

    expect(result.outputFiles).toBeDefined()

    const output = getOutput(result)
    expect(output.trim()).toStrictEqual(input)
    expect(output).toMatchSnapshot()
  })
})

test("does not modify named capture groups", async (ctx) => {
  const input = dedent`
    var regex = /(?<foo>.*+)/;
    var matches = regex.exec("Hello world");
  `

  const result = await buildFile(ctx, input)

  expect(result.outputFiles).toBeDefined()

  const output = getOutput(result)
  expect(output.trim()).toStrictEqual(input)
  expect(output).toMatchSnapshot()
})

test("does not modify supported functions", async (ctx) => {
  const input = dedent`
    new Promise((resolve, reject) => resolve());
    new Promise((resolve, reject) => reject());
    new Promise((resolve, reject) => reject()).catch(console.log);
    new Promise((resolve, reject) => reject()).then(console.log);
    new Promise((resolve, reject) => reject()).finally(console.log);
  `

  const result = await buildFile(ctx, input)

  expect(result.outputFiles).toBeDefined()

  const output = getOutput(result)
  expect(output.trim()).toStrictEqual(input)
  expect(output).toMatchSnapshot()
})

test("does not allow await/async", async (ctx) => {
  const input = dedent`
    void (async () => {
      var func = async () => true
  
      var result = await func()
    })()
  `

  const promise = buildFile(ctx, input)

  await expect(promise).rejects.toThrowError(
    "Transforming async functions to the configured target environment",
  )
})

test("does not modify crypto imports", async (ctx) => {
  const input = dedent`
    import crypto from "crypto"

    var hash = crypto.createHash("sha1")
    hash.update("data")
    hash.digest("base64")
  `

  const result = await buildFile(ctx, input)

  expect(result.outputFiles).toBeDefined()

  const output = getOutput(result)
  expect(output).toMatchSnapshot()
})

test("minification does not rename handler function", async (ctx) => {
  const input = dedent`
    function handler(event: Record<string, unknkown>) {
      console.log("test")
    }
  `

  const result = await buildFile(ctx, input, { minify: true })

  expect(result.outputFiles).toBeDefined()

  const output = getOutput(result)
  expect(output).toContain("handler(event)")
  expect(output).toMatchSnapshot()
})
