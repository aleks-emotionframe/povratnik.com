// Rubriken (lib/rubrics.ts): jede der zwölf Rubriken steht in genau einer der vier
// Gruppen der Übersicht, und jede Gruppe hat einen Titel im deutschen Katalog (die
// anderen Sprachen erzwingt i18n.test.ts über die Schlüsselparität).

import { test } from "node:test";
import assert from "node:assert/strict";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { RUBRICS, RUBRIC_GROUPS, rubricGroup } from "../src/lib/rubrics.ts";
import { loadCatalogue } from "../src/lib/i18n.ts";
import { lookup } from "../src/islands/text.ts";

const CONTENT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "content");

test("every rubric belongs to exactly one group", () => {
  const seen = RUBRIC_GROUPS.flatMap((g) => g.rubrics);
  assert.deepEqual([...seen].sort(), RUBRICS.map((r) => r.slug).sort());
  assert.equal(new Set(seen).size, seen.length, "a rubric appears in two groups");
  // Bereichsadressen dürfen keine Rubrikadresse überdecken.
  const slugs = RUBRIC_GROUPS.map((g) => g.slug);
  assert.equal(new Set(slugs).size, slugs.length, "two groups share a slug");
  for (const s of slugs) assert.ok(!RUBRICS.some((r) => r.slug === s), `${s} is also a rubric slug`);
  for (const r of RUBRICS) assert.ok(rubricGroup(r.slug), `${r.slug} has no group`);
});

test("every group has a title in the catalogue", () => {
  const de = loadCatalogue(CONTENT, "de");
  for (const g of RUBRIC_GROUPS) assert.equal(typeof lookup(de, `ui.wissen.group_${g.key}`), "string", g.key);
});
