// Keine Schreibmaschinenschrift auf der Website (Entscheid der Produktverantwortung vom
// 15.09.2026, designsystem.md 2). Der Test lehnt jede Schriftangabe mit Monospace-Familien
// in Stylesheets, Seiten und Inseln ab, damit sie nicht über eine Einzelregel zurückkommt.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "src");
const FORBIDDEN = /monospace|ui-monospace|Consolas|Courier|Menlo|Cascadia|SF Mono|DejaVu Sans Mono|Plex Mono/i;

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

test("no monospace font family anywhere in the web sources", () => {
  const files = walk(SRC).filter((f) => /.(css|astro|tsx|ts)$/.test(f));
  for (const f of files) {
    const text = readFileSync(f, "utf8");
    assert.doesNotMatch(text, FORBIDDEN, f);
  }
});
