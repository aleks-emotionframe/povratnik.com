// Die Stufe "public" (ADR-0004) setzt eine benannte Fachprüfung voraus. Solange in
// docs/rollen.md ein Platzhalter steht, darf die Konstante nicht auf "public" stehen.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { STAGE, bundleMode } from "../src/lib/stage.ts";

const ROLES = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "docs", "rollen.md");

test("public stage requires a named expert reviewer in docs/rollen.md", () => {
  const row = readFileSync(ROLES, "utf8").split("\n").find((l) => l.startsWith("| Fachprüfung Recht und Steuern"));
  assert.ok(row, "role row missing");
  const person = row.split("|")[3].trim();
  if (STAGE === "public") assert.doesNotMatch(person, /Platzhalter|^offen$/, "public stage without named expert reviewer");
});

test("bundle mode follows the stage", () => {
  assert.equal(bundleMode(false), "dev");
  assert.equal(bundleMode(true), STAGE === "public" ? "build" : "dev");
});
