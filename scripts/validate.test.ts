// Tests for scripts/validate.ts. The positive set is content/ itself. Each negative
// test copies content/ to a temporary directory, breaks exactly one thing and expects
// exactly the matching issue. Run: npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, writeFileSync, rmSync, renameSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { parse, stringify } from "yaml";
import { validateContent, type Issue } from "./validate.ts";

const CONTENT = join(dirname(fileURLToPath(import.meta.url)), "..", "content");

type Doc = Record<string, any>;

function withCopy(fn: (dir: string) => void): Issue[] {
  const dir = mkdtempSync(join(tmpdir(), "lik-content-"));
  try {
    cpSync(CONTENT, dir, { recursive: true });
    fn(dir);
    return validateContent(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function mutate(dir: string, file: string, change: (doc: Doc) => void) {
  const path = join(dir, file);
  const doc = parse(readFileSync(path, "utf8"));
  change(doc);
  writeFileSync(path, stringify(doc));
}

function broken(file: string, change: (doc: Doc) => void): Issue[] {
  return withCopy((dir) => mutate(dir, file, change));
}

function assertIssue(issues: Issue[], file: string, path: string, messagePart: string) {
  const hit = issues.find((i) => i.file === file && i.path === path && i.message.includes(messagePart));
  assert.ok(hit, `expected issue ${file} ${path} "${messagePart}", got:\n${issues.map((i) => `  ${i.file} ${i.path}: ${i.message}`).join("\n")}`);
}

const RULE2 = "rules/example-address-report.2.yaml";
const RULE1 = "rules/example-address-report.1.yaml";
const TASK = "tasks/example-register-address.1.yaml";
const PAGE = "pages/example-registration.de.yaml";
const TEST = "tests/t04-event-date-unknown.yaml";

test("the synthetic examples in content/ are valid", () => {
  assert.deepEqual(validateContent(CONTENT), []);
});

test("schema: a rule with two procedures is rejected", () => {
  const issues = broken(RULE2, (d) => { d.scope.procedure = ["example-registration", "other"]; });
  assertIssue(issues, RULE2, "/scope/procedure", "must be string");
});

test("schema: an operator outside the exhaustive list is rejected", () => {
  const issues = broken(RULE2, (d) => { d.conditions[0].operator = "regex"; });
  assertIssue(issues, RULE2, "/conditions/0/operator", "must be equal to one of the allowed values");
});

test("schema: a fact with a value but availability unknown is rejected", () => {
  const issues = broken(TASK, (d) => { d.duration.value = 5; });
  assertIssue(issues, TASK, "/duration", "must NOT be valid");
});

test("schema: null in a domain field is rejected", () => {
  const issues = broken(TASK, (d) => { d.cost = null; });
  assertIssue(issues, TASK, "/cost", "must be object");
});

test("schema: a dataset without the synthetic flag is rejected", () => {
  const issues = broken(RULE2, (d) => { delete d.synthetic; });
  assertIssue(issues, RULE2, "/", "must have required property 'synthetic'");
});

test("schema: valid_until with kind date needs a date, other kinds forbid one", () => {
  const a = broken(RULE1, (d) => { d.validity.valid_until = { kind: "date", date: null }; });
  assertIssue(a, RULE1, "/validity/valid_until/date", "must be string");
  const b = broken(RULE2, (d) => { d.validity.valid_until = { kind: "open_ended", date: "2027-01-01" }; });
  assertIssue(b, RULE2, "/validity/valid_until/date", "must be null");
});

test("lifecycle: a synthetic dataset can never be approved or published", () => {
  const issues = broken(RULE2, (d) => {
    d.approval = { state: "approved", reviewer: "X", approved_at: "2026-09-13" };
    d.publication.state = "published";
  });
  assertIssue(issues, RULE2, "/approval/state", "synthetic dataset must not be approved");
  assertIssue(issues, RULE2, "/publication/state", "synthetic dataset must not be published");
});

test("lifecycle: published requires approval with reviewer and at least one source", () => {
  const issues = broken(RULE2, (d) => {
    d.synthetic = false;
    d.publication.state = "published";
    d.sources = [];
  });
  assertIssue(issues, RULE2, "/publication/state", "published dataset must be approved");
  assertIssue(issues, RULE2, "/sources", "needs at least one source");
  const noReviewer = broken(RULE2, (d) => {
    d.synthetic = false;
    d.approval = { state: "approved" };
  });
  assertIssue(noReviewer, RULE2, "/approval", "must have required property 'reviewer'");
});

test("references: unknown task, procedure, source and i18n key are reported", () => {
  const issues = broken(RULE2, (d) => {
    d.result.task = "no-such-task";
    d.scope.procedure = "no-such-procedure";
    d.sources[0].id = "no-such-source";
    d.result.status_text_key = "rules.missing.key";
  });
  assertIssue(issues, RULE2, "/result/task", 'unknown task "no-such-task"');
  assertIssue(issues, RULE2, "/scope/procedure", 'unknown procedure "no-such-procedure"');
  assertIssue(issues, RULE2, "/sources/0/id", 'unknown source "no-such-source"');
  assertIssue(issues, RULE2, "/result/status_text_key", 'key "rules.missing.key" missing');
});

test("references: page links and test-case persons must exist", () => {
  const page = broken(PAGE, (d) => { d.links.tasks = ["ghost"]; });
  assertIssue(page, PAGE, "/links/tasks/0", 'unknown task "ghost"');
  const tc = broken(TEST, (d) => {
    d.input.events[0].person = "p9";
    d.expect.results = [{ person: "p1", rule: "example-address-report@7", eligibility: "unclear" }];
  });
  assertIssue(tc, TEST, "/input/events/0/person", 'unknown person "p9"');
  assertIssue(tc, TEST, "/expect/results/0/rule", "unknown rule version");
});

test("version chain: supersedes must point to a lower version that points back", () => {
  const forward = broken(RULE1, (d) => { d.validity.superseded_by = null; });
  assertIssue(forward, RULE2, "/validity/supersedes", "must set superseded_by: example-address-report@2");
  const higher = broken(RULE2, (d) => { d.version = 1; });
  assert.ok(higher.some((i) => i.message.includes("file name must be")));
  const unknown = broken(RULE2, (d) => { d.validity.supersedes = "example-address-report@5"; });
  assertIssue(unknown, RULE2, "/validity/supersedes", 'unknown version');
});

test("trigger: deadline trigger must equal the rule trigger", () => {
  const issues = broken(RULE2, (d) => { d.result.deadline.trigger = "address_change"; });
  assertIssue(issues, RULE2, "/result/deadline/trigger", 'must equal rule trigger "entry"');
  const missing = broken(RULE2, (d) => { delete d.trigger; });
  assertIssue(missing, RULE2, "/", "must have required property 'trigger'");
});

test("validity windows of one rule id must not overlap", () => {
  const overlap = broken(RULE1, (d) => { d.validity.valid_until = { kind: "date", date: "2026-06-01" }; });
  assertIssue(overlap, RULE2, "/validity/valid_from", "validity window overlaps rules/example-address-report.1.yaml");
  const open = broken(RULE1, (d) => { d.validity.valid_until = { kind: "unknown", date: null }; });
  assertIssue(open, RULE2, "/validity/valid_from", "validity window overlaps");
});

test("versions of one rule id share trigger and procedure", () => {
  const trigger = broken(RULE2, (d) => { d.trigger = "address_change"; d.result.deadline.trigger = "address_change"; });
  assertIssue(trigger, RULE2, "/trigger", 'must share trigger "entry"');
  const procedure = broken(RULE2, (d) => { d.scope.procedure = "example-accommodation-report"; });
  assertIssue(procedure, RULE2, "/scope/procedure", 'must share procedure "example-registration"');
});

test("file name must match id and version", () => {
  const issues = withCopy((dir) => {
    renameSync(join(dir, RULE2), join(dir, "rules/renamed.2.yaml"));
  });
  assertIssue(issues, "rules/renamed.2.yaml", "/id", "file name must be example-address-report.2.yaml");
});
