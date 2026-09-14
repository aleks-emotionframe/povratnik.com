// The engine must never read the clock: the reference date is an input, so a plan can
// be reproduced later (datenmodell.md section 7). This test is the structural net.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "src");

test("engine source never calls Date.now() or new Date() without an argument", () => {
  for (const file of readdirSync(SRC).filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"))) {
    const code = readFileSync(join(SRC, file), "utf8");
    assert.doesNotMatch(code, /Date\.now\(/, `${file} reads the clock`);
    assert.doesNotMatch(code, /new Date\(\s*\)/, `${file} reads the clock`);
  }
});
