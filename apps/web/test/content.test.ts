import { test } from "node:test";
import assert from "node:assert/strict";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { bundleFor, loadContent, type RuleView } from "../src/lib/content.ts";

const CONTENT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "content");
const content = loadContent(CONTENT);

test("build mode never includes a synthetic, unapproved or unpublished rule", () => {
  const bundle = bundleFor("build", content);
  assert.equal(bundle.synthetic, false);
  assert.deepEqual(bundle.rules, []);
  assert.deepEqual(bundle.tasks, {});
});

test("build mode includes an approved, published, non-synthetic rule and its task", () => {
  const live: RuleView = {
    ...content.rules[0]!,
    synthetic: false,
    approval: { state: "approved" },
    publication: { state: "published" },
  };
  const bundle = bundleFor("build", { ...content, rules: [live] });
  assert.equal(bundle.synthetic, false);
  assert.equal(bundle.rules.length, 1);
  assert.ok(bundle.tasks[live.result.task]);
  assert.ok(bundle.procedures[live.scope.procedure]);
});

test("dev mode includes drafts and flags the bundle as synthetic, but never withdrawn rules", () => {
  const bundle = bundleFor("dev", content);
  assert.equal(bundle.synthetic, true);
  const notWithdrawn = content.rules.filter((r) => r.publication.state !== "withdrawn");
  assert.equal(bundle.rules.length, notWithdrawn.length);
  assert.ok(content.rules.length > notWithdrawn.length, "the withdrawn probe version must exist in content/");
  const withdrawn: RuleView = { ...content.rules[0]!, publication: { state: "withdrawn" } };
  const without = bundleFor("dev", { ...content, rules: [withdrawn] });
  assert.deepEqual(without.rules, []);
});

test("holiday calendars follow the same gate: none in build until approved and published, all dates in dev", () => {
  assert.deepEqual(bundleFor("build", content).holidays, []);
  assert.deepEqual(bundleFor("build", content).calendars, []);
  const dev = bundleFor("dev", content);
  assert.equal(dev.holidays.length, 28);
  assert.ok(dev.holidays.includes("2026-06-04"), "Tijelovo 2026");
  assert.deepEqual(dev.calendars.map((c) => c.id), ["hr"]);
  const approved = { ...content.calendars[0]!, approval: { state: "approved", reviewer: "X", approved_at: "2026-09-14" }, publication: { state: "published" } };
  assert.equal(bundleFor("build", { ...content, calendars: [approved] }).holidays.length, 28);
});
