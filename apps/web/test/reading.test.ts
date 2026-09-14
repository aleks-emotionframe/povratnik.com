// Leseempfehlung (lib/reading.ts): Produktregel, keine Anspruchsprüfung. Unbekannt
// schliesst nie aus, Kinder bekommen die Schulseite, Grundseiten kommen immer.

import { test } from "node:test";
import assert from "node:assert/strict";
import { documentsFor, readingFor, type ReadingPage } from "../src/lib/reading.ts";

const ids = ["oib", "wohnsitz-anmelden", "krankenversicherung", "staatsangehoerigkeit-abstammung", "bescheinigung-auswanderer", "apostille-und-uebersetzung", "digitaler-nomade", "pauschalgewerbe", "biram-hrvatsku", "lohnsteuerbefreiung", "schule-und-zeugnisse", "fuehrerschein-umschreiben"];
const pages: ReadingPage[] = ids.map((id) => ({ id, title: id, path: `/wissen/x/${id}`, category: "x", documents: [`Dok ${id}`, "Reisepass"] }));
const pick = (r: ReturnType<typeof readingFor>) => r.map((x) => x.page.id).sort();

test("base pages always, status pages when citizenship is unknown", () => {
  const r = readingFor({ stage: "planning", persons: [{ id: "p1", role: "self" }] }, pages);
  for (const id of ["oib", "wohnsitz-anmelden", "krankenversicherung", "staatsangehoerigkeit-abstammung", "bescheinigung-auswanderer"]) assert.ok(pick(r).includes(id), id);
});

test("croatian citizen employed: tax exemption yes, status pages no", () => {
  const r = readingFor({ stage: "planning", persons: [{ id: "p1", role: "self", citizenships: ["hr"], income: "employment" }] }, pages);
  assert.ok(pick(r).includes("lohnsteuerbefreiung"));
  assert.ok(!pick(r).includes("staatsangehoerigkeit-abstammung"));
  assert.ok(!pick(r).includes("digitaler-nomade"));
});

test("child gets the school page, persons are listed per page", () => {
  const r = readingFor({ stage: "arrived", household: "alone_children", persons: [{ id: "p1", role: "self", citizenships: ["hr"] }, { id: "p2", role: "child", citizenships: ["hr"] }] }, pages);
  const school = r.find((x) => x.page.id === "schule-und-zeugnisse");
  assert.deepEqual(school?.persons, ["p2"]);
  assert.deepEqual(r.find((x) => x.page.id === "oib")?.persons, ["p1", "p2"]);
  assert.deepEqual(r.find((x) => x.page.id === "fuehrerschein-umschreiben")?.persons, ["p1"]);
});

test("documents are deduplicated across pages", () => {
  const r = readingFor({ stage: "planning", persons: [{ id: "p1", role: "self", citizenships: ["hr"], income: "employment" }] }, pages);
  const docs = documentsFor(r);
  assert.equal(docs.filter((d) => d === "Reisepass").length, 1);
});
