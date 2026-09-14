// Prüft das Build-Ergebnis in apps/web/dist je Stufe (ADR-0004): auf "public" darf keine
// synthetische Regel ausgeliefert werden (CLAUDE.md 4), auf "test" muss jede Seite als
// Teststufe gekennzeichnet und nicht indexierbar sein. Ausserdem bleiben die Gewichte
// im Budget (betrieb.md 2, hier als Rohgrösse von HTML und JavaScript ohne Kompression,
// also strenger als das Budget für die komprimierte Übertragung). Läuft nur, wenn dist/
// existiert; die CI baut vorher.

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { STAGE } from "../src/lib/stage.ts";

const DIST = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const skip = !existsSync(DIST) && "dist/ not built";

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

test("public stage: dist contains no synthetic rule and no draft", { skip: skip || (STAGE !== "public" && "stage is test") }, () => {
  for (const file of walk(DIST).filter((f) => /\.(html|js)$/.test(f))) {
    const text = readFileSync(file, "utf8");
    // Astro serialisiert Insel-Props als [typ, wert]-Paare mit HTML-kodierten Anführungszeichen;
    // beide Schreibweisen werden geprüft, damit ein Formatwechsel nicht unbemerkt durchgeht.
    const unescaped = text.replace(/&quot;/g, "\"");
    assert.doesNotMatch(unescaped, /"synthetic":(\[0,)?true/, file);
    assert.doesNotMatch(unescaped, /"state":(\[0,)?"draft"/, file);
    assert.doesNotMatch(unescaped, /"state":(\[0,)?"unpublished"/, file);
  }
});

test("test stage: every page is marked as test stage and not indexable", { skip: skip || (STAGE !== "test" && "stage is public") }, () => {
  for (const file of walk(DIST).filter((f) => f.endsWith(".html"))) {
    const text = readFileSync(file, "utf8");
    assert.match(text, /<html[^>]*data-stage="test"/, file);
    assert.match(text, /name="robots" content="noindex, nofollow"/, file);
    assert.match(text, /Teststufe/, file);
  }
  // Der Kurzcheck läuft mit Beispielregeln und sagt das auf der Seite.
  const wizard = readFileSync(join(DIST, "mein-weg", "index.html"), "utf8");
  assert.match(wizard, /Synthetische Beispielregeln/);
});

test("page weight stays within the budgets of betrieb.md section 2 (uncompressed, stricter)", { skip }, () => {
  const size = (rel: string) => statSync(join(DIST, rel)).size;
  const scripts = walk(join(DIST, "_astro")).filter((f) => f.endsWith(".js")).reduce((sum, f) => sum + statSync(f).size, 0);
  const footer = size("ef-signature/ef-signature.css") + size("ef-signature/ef-signature.js") + size("ef-signature/ef-logo-on-dark.webp");
  assert.ok(size("index.html") + footer < 150 * 1024, "start page over 150 KB");
  assert.ok(size(join("mein-weg", "index.html")) + scripts + footer < 500 * 1024, "wizard page over 500 KB");
});
