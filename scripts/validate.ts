// Validates every dataset under content/ against the JSON schemas in schemas/ and
// against the cross-file rules from CLAUDE.md section 4 and docs/datenmodell.md.
// Exit code 1 if any issue is found. Run: npm run validate

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, resolve, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Ajv2020 } from "ajv/dist/2020.js";
import type { ValidateFunction } from "ajv";
import addFormatsModule from "ajv-formats";
import { parse as parseYaml } from "yaml";

// ajv-formats is CommonJS; its callable lives on .default for both Node and TypeScript.
const addFormats = addFormatsModule.default;

export type Issue = { file: string; path: string; message: string };

type Dataset = Record<string, unknown>;
type Collection = "rules" | "tasks" | "procedures" | "pages" | "calendars" | "sources" | "tests" | "i18n";

const SCHEMA_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "schemas");
const SCHEMA_BASE = "https://leben-in-kroatien.example/schemas/";

const COLLECTIONS: Record<Collection, string> = {
  rules: "rule",
  tasks: "task",
  procedures: "procedure",
  pages: "page",
  calendars: "calendar",
  sources: "source",
  tests: "test-case",
  i18n: "i18n",
};

// Datasets that carry the lifecycle block (synthetic, approval, publication, validity).
const LIFECYCLE: Collection[] = ["rules", "tasks", "procedures", "pages", "calendars"];

function buildAjv() {
  const ajv = new Ajv2020({ allErrors: true, strict: true, strictRequired: false });
  addFormats(ajv);
  for (const file of readdirSync(SCHEMA_DIR)) {
    ajv.addSchema(JSON.parse(readFileSync(join(SCHEMA_DIR, file), "utf8")));
  }
  return ajv;
}

function loadCollection(contentDir: string, collection: Collection): Map<string, Dataset> {
  const dir = join(contentDir, collection);
  const out = new Map<string, Dataset>();
  if (!existsSync(dir)) return out;
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".yaml")).sort()) {
    const parsed = parseYaml(readFileSync(join(dir, file), "utf8"));
    out.set(`${collection}/${file}`, parsed);
  }
  return out;
}

function str(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

function num(v: unknown): number | undefined {
  return typeof v === "number" ? v : undefined;
}

function obj(v: unknown): Dataset | undefined {
  return v !== null && typeof v === "object" && !Array.isArray(v) ? (v as Dataset) : undefined;
}

function arr(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

function expectedFileName(collection: Collection, d: Dataset): string | undefined {
  const id = str(d.id);
  if (!id) return undefined;
  switch (collection) {
    case "rules":
    case "tasks":
    case "procedures":
      return num(d.version) === undefined ? undefined : `${id}.${d.version}.yaml`;
    case "pages":
      return str(d.lang) === undefined ? undefined : `${id}.${d.lang}.yaml`;
    default:
      return `${id}.yaml`;
  }
}

function hasI18nKey(catalogue: Dataset | undefined, key: string): boolean {
  let node: unknown = catalogue;
  for (const part of key.split(".")) {
    const o = obj(node);
    if (!o || !(part in o)) return false;
    node = o[part];
  }
  return typeof node === "string";
}

export function validateContent(contentDir: string): Issue[] {
  const issues: Issue[] = [];
  const ajv = buildAjv();
  const data = new Map<Collection, Map<string, Dataset>>();

  // 1. Schema validation and file naming.
  for (const collection of Object.keys(COLLECTIONS) as Collection[]) {
    const validate = ajv.getSchema(`${SCHEMA_BASE}${COLLECTIONS[collection]}.schema.json`) as ValidateFunction;
    const items = loadCollection(contentDir, collection);
    data.set(collection, items);
    for (const [file, d] of items) {
      if (!validate(d)) {
        for (const e of validate.errors ?? []) {
          issues.push({ file, path: e.instancePath || "/", message: `${e.message ?? "invalid"}${e.params && "allowedValues" in e.params ? ` (${(e.params.allowedValues as unknown[]).join(", ")})` : ""}` });
        }
        continue;
      }
      if (collection === "i18n") continue;
      const expected = expectedFileName(collection, d);
      if (expected && basename(file) !== expected) {
        issues.push({ file, path: "/id", message: `file name must be ${expected}` });
      }
    }
  }

  // Index of ids per collection, and of id@version for versioned datasets.
  const ids = (c: Collection) => new Set([...data.get(c)!.values()].map((d) => str(d.id)));
  const versions = (c: Collection) => new Map([...data.get(c)!.entries()].map(([f, d]) => [`${d.id}@${d.version}`, { file: f, d }]));
  const ruleIds = ids("rules");
  const taskIds = ids("tasks");
  const procedureIds = ids("procedures");
  const pageIds = ids("pages");
  const sourceIds = ids("sources");
  const catalogueDe = data.get("i18n")!.get("i18n/de.yaml");

  const requireId = (file: string, path: string, id: unknown, known: Set<string | undefined>, what: string) => {
    if (typeof id === "string" && !known.has(id)) {
      issues.push({ file, path, message: `unknown ${what} "${id}"` });
    }
  };

  // 2. Lifecycle rules shared by rules, tasks, procedures and pages.
  for (const collection of LIFECYCLE) {
    const byVersion = versions(collection);
    for (const [file, d] of data.get(collection)!) {
      const approval = obj(d.approval);
      const publication = obj(d.publication);
      const validity = obj(d.validity);
      if (!approval || !publication || !validity) continue; // already reported by schema

      // Synthetic examples never carry an approval or a publication.
      if (d.synthetic === true) {
        if (approval.state === "approved") {
          issues.push({ file, path: "/approval/state", message: "synthetic dataset must not be approved" });
        }
        if (publication.state === "published") {
          issues.push({ file, path: "/publication/state", message: "synthetic dataset must not be published" });
        }
      }

      // Published only when approved and sourced.
      if (publication.state === "published") {
        if (approval.state !== "approved") {
          issues.push({ file, path: "/publication/state", message: "published dataset must be approved" });
        }
        if (arr(d.sources).length === 0) {
          issues.push({ file, path: "/sources", message: "published dataset needs at least one source" });
        }
      }

      for (const [i, s] of arr(d.sources).entries()) {
        requireId(file, `/sources/${i}/id`, obj(s)?.id, sourceIds, "source");
      }

      // Version chain: supersedes points back to a lower version of the same id, and that
      // version points forward to this one. Pages and calendars are not versioned by file.
      if (collection === "pages" || collection === "calendars") continue;
      const self = `${d.id}@${d.version}`;
      const supersedes = str(validity.supersedes);
      if (supersedes) {
        const [sid, sv] = supersedes.split("@");
        const target = byVersion.get(supersedes);
        if (sid !== d.id) {
          issues.push({ file, path: "/validity/supersedes", message: `must reference the same id "${d.id}"` });
        } else if (!target) {
          issues.push({ file, path: "/validity/supersedes", message: `unknown version "${supersedes}"` });
        } else {
          if (Number(sv) >= Number(d.version)) {
            issues.push({ file, path: "/validity/supersedes", message: `must reference a lower version than ${d.version}` });
          }
          if (obj(target.d.validity)?.superseded_by !== self) {
            issues.push({ file, path: "/validity/supersedes", message: `${supersedes} must set superseded_by: ${self}` });
          }
        }
      }
      const supersededBy = str(validity.superseded_by);
      if (supersededBy) {
        const target = byVersion.get(supersededBy);
        if (!target) {
          issues.push({ file, path: "/validity/superseded_by", message: `unknown version "${supersededBy}"` });
        } else if (obj(target.d.validity)?.supersedes !== self) {
          issues.push({ file, path: "/validity/superseded_by", message: `${supersededBy} must set supersedes: ${self}` });
        }
      }
    }
  }

  // 3. Cross references per collection.
  for (const [file, d] of data.get("rules")!) {
    requireId(file, "/scope/procedure", obj(d.scope)?.procedure, procedureIds, "procedure");
    const result = obj(d.result);
    requireId(file, "/result/task", result?.task, taskIds, "task");
    const key = str(result?.status_text_key);
    if (key && !hasI18nKey(catalogueDe, key)) {
      issues.push({ file, path: "/result/status_text_key", message: `key "${key}" missing in i18n/de.yaml` });
    }
    const deadlineTrigger = obj(result?.deadline)?.trigger;
    if (deadlineTrigger !== undefined && deadlineTrigger !== d.trigger) {
      issues.push({ file, path: "/result/deadline/trigger", message: `must equal rule trigger "${d.trigger}"` });
    }
  }

  // Versions of one rule id form one obligation (datenmodell.md 2.4): same trigger, same
  // procedure, and validity windows that do not overlap, otherwise version selection is
  // ambiguous. An open or unknown end counts as unbounded.
  const rulesById = new Map<string, { file: string; d: Dataset; from: string; until: string | undefined }[]>();
  for (const [file, d] of data.get("rules")!) {
    const validity = obj(d.validity);
    const from = str(validity?.valid_from);
    const untilObj = obj(validity?.valid_until);
    if (!from || !untilObj) continue;
    const until = untilObj.kind === "date" ? str(untilObj.date) : undefined;
    const list = rulesById.get(String(d.id)) ?? [];
    list.push({ file, d, from, until });
    rulesById.set(String(d.id), list);
  }
  for (const windows of rulesById.values()) {
    windows.sort((a, b) => a.from.localeCompare(b.from));
    const first = windows[0]!;
    for (let i = 1; i < windows.length; i++) {
      const prev = windows[i - 1]!;
      const cur = windows[i]!;
      if (prev.until === undefined || prev.until >= cur.from) {
        issues.push({ file: cur.file, path: "/validity/valid_from", message: `validity window overlaps ${prev.file}` });
      }
      if (cur.d.trigger !== first.d.trigger) {
        issues.push({ file: cur.file, path: "/trigger", message: `all versions of "${cur.d.id}" must share trigger "${first.d.trigger}"` });
      }
      if (obj(cur.d.scope)?.procedure !== obj(first.d.scope)?.procedure) {
        issues.push({ file: cur.file, path: "/scope/procedure", message: `all versions of "${cur.d.id}" must share procedure "${obj(first.d.scope)?.procedure}"` });
      }
    }
  }

  for (const [file, d] of data.get("tasks")!) {
    for (const [i, id] of arr(d.prerequisites).entries()) requireId(file, `/prerequisites/${i}`, id, taskIds, "task");
    for (const [i, id] of arr(d.follow_ups).entries()) requireId(file, `/follow_ups/${i}`, id, taskIds, "task");
    if (d.page !== undefined) requireId(file, "/page", d.page, pageIds, "page");
  }

  for (const [file, d] of data.get("pages")!) {
    const links = obj(d.links);
    if (!links) continue;
    const targets: [string, Set<string | undefined>, string][] = [
      ["rules", ruleIds, "rule"],
      ["tasks", taskIds, "task"],
      ["procedures", procedureIds, "procedure"],
      ["requires_pages", pageIds, "page"],
      ["followed_by_pages", pageIds, "page"],
    ];
    for (const [field, known, what] of targets) {
      for (const [i, id] of arr(links[field]).entries()) requireId(file, `/links/${field}/${i}`, id, known, what);
    }
  }

  // Calendars: dates unique and in order, so a duplicated or misplaced year is caught.
  for (const [file, d] of data.get("calendars")!) {
    const dates = arr(d.holidays).map((h) => str(obj(h)?.date) ?? "");
    for (const [i, date] of dates.entries()) {
      if (i > 0 && date <= dates[i - 1]!) {
        issues.push({ file, path: `/holidays/${i}/date`, message: `must be later than ${dates[i - 1]}` });
      }
    }
  }

  const ruleVersions = versions("rules");
  for (const [file, d] of data.get("tests")!) {
    const input = obj(d.input);
    const expect = obj(d.expect);
    if (!input || !expect) continue;
    const persons = new Set(arr(input.persons).map((p) => str(obj(p)?.id)));
    for (const [i, r] of arr(input.relationships).entries()) {
      for (const [j, p] of arr(obj(r)?.between).entries()) requireId(file, `/input/relationships/${i}/between/${j}`, p, persons, "person");
    }
    for (const [i, e] of arr(input.events).entries()) requireId(file, `/input/events/${i}/person`, obj(e)?.person, persons, "person");
    for (const field of ["routes", "routes_absent"]) {
      for (const [i, r] of arr(expect[field]).entries()) requireId(file, `/expect/${field}/${i}/person`, obj(r)?.person, persons, "person");
    }
    for (const field of ["tasks", "tasks_absent"]) {
      for (const [i, id] of arr(expect[field]).entries()) requireId(file, `/expect/${field}/${i}`, id, taskIds, "task");
    }
    for (const [i, r] of arr(expect.results).entries()) {
      requireId(file, `/expect/results/${i}/person`, obj(r)?.person, persons, "person");
      const ref = obj(r)?.rule;
      if (typeof ref === "string" && !ruleVersions.has(ref)) {
        issues.push({ file, path: `/expect/results/${i}/rule`, message: `unknown rule version "${ref}"` });
      }
    }
  }

  return issues;
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const contentDir = resolve(process.argv[2] ?? "content");
  const issues = validateContent(contentDir);
  for (const i of issues) console.error(`${i.file} ${i.path}: ${i.message}`);
  if (issues.length > 0) {
    console.error(`\n${issues.length} issue(s) in ${contentDir}`);
    process.exit(1);
  }
  console.log(`content valid: ${contentDir}`);
}
