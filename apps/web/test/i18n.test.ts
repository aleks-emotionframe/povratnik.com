// Sprachkataloge (lib/i18n.ts): jede Sprache trägt dieselben Schlüssel wie Deutsch
// (Rubriken, Situationen und Fallprofile sind nur in den Übersetzungen, weil Deutsch
// dort aus den TS-Strukturen kommt), und der Rückfall auf Deutsch füllt jede Lücke.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import { LOCALES, loadCatalogue, localePath } from "../src/lib/i18n.ts";
import { lookup } from "../src/islands/text.ts";

const CONTENT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "content");
const OWN = ["rubrics.", "situations.", "cases."];
const flat = (o: Record<string, unknown>, p = ""): string[] =>
  Object.entries(o).flatMap(([k, v]) => (v && typeof v === "object" ? flat(v as Record<string, unknown>, `${p}${k}.`) : [`${p}${k}`]));
const read = (l: string) => parse(readFileSync(join(CONTENT, "i18n", `${l}.yaml`), "utf8")) as Record<string, unknown>;

test("every language carries the same keys as German", () => {
  const de = new Set(flat(read("de")));
  for (const l of LOCALES.filter((x) => x !== "de")) {
    const own = new Set(flat(read(l)));
    const missing = [...de].filter((k) => !own.has(k));
    const extra = [...own].filter((k) => !de.has(k) && !OWN.some((p) => k.startsWith(p)));
    assert.deepEqual(missing, [], `${l} missing keys`);
    assert.deepEqual(extra, [], `${l} extra keys`);
  }
});

test("merged catalogue falls back to German for missing keys", () => {
  const hr = loadCatalogue(CONTENT, "hr");
  assert.equal(lookup(hr, "wizard.unknown"), "Još ne znam");
  // Regeltitel und Ergebnistexte bleiben auswertbar, auch wenn eine Sprache sie nicht trägt.
  assert.equal(typeof lookup(hr, "results.unclear"), "string");
});

test("locale paths: German at the root, others with prefix", () => {
  assert.equal(localePath("de", "/wissen"), "/wissen");
  assert.equal(localePath("es", "/wissen"), "/es/wissen");
  assert.equal(localePath("hr", "/"), "/hr/");
});
