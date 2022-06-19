import fs from "fs/promises"
import { tmpdir } from "os"
import path from "path"

import { build, BuildResult, OutputFile } from "esbuild"
import { nanoid } from "nanoid"
import dedent from "ts-dedent"
import { beforeEach, describe, expect, test, TestContext } from "vitest"

import { CloudFrontPlugin } from "./plugin"

const getOutput = (result: BuildResult & { outputFiles: OutputFile[] }) => `
${Buffer.from(result.outputFiles[0].contents).toString().trim()}
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

const buildFile = async (ctx: TestContext, contents: string) => {
  const inputFilePath = path.join(ctx.tempDirPath, "index.ts")
  await fs.writeFile(inputFilePath, dedent(contents))

  return build({
    entryPoints: [inputFilePath],
    plugins: [CloudFrontPlugin()],

    target: "es5",
    format: "esm",
    write: false,
  })
}

describe("const, let, var", () => {
  test("lets vars through", async (ctx) => {
    const result = await buildFile(
      ctx,
      `
        var foo = "bar"
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
          var bar = true
        }
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
          var bar = rest[0]
        }
      `,
    )

    expect(result.outputFiles).toBeDefined()
    expect(getOutput(result)).toMatchSnapshot()
  })
})

describe("strings", () => {
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
})

describe("number", () => {
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
})

describe("arrays", () => {
  test("does not modify supported functions", async (ctx) => {
    const input = dedent`
      var foo = Array.of(1, 2, 3);
      var foo = [].copyWithin(10, 0, 2);
      var foo = [].fill("foo", 0, 20);
      var foo = [].find(() => true);
      var foo = [].findIndex(() => true);
    `

    const result = await buildFile(ctx, input)

    expect(result.outputFiles).toBeDefined()

    const output = getOutput(result)
    expect(output.trim()).toStrictEqual(input)
    expect(output).toMatchSnapshot()
  })
})

describe("regex", () => {
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
})
