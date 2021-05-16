import { describe, expect, test } from "vitest"

import { hello } from "./index"

describe("test", () => {
  test("test", () => {
    expect(hello).toBe("world")
  })
})
