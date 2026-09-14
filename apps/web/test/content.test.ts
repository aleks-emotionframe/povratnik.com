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
  assert.equal(bundle.rules.length, content.rules.length);
  const withdrawn: RuleView = { ...content.rules[0]!, publication: { state: "withdrawn" } };
  const without = bundleFor("dev", { ...content, rules: [withdrawn] });
  assert.deepEqual(without.rules, []);
});
