// Abschlussplan (wizard-konzept.md 6, auf M2a reduziert): Ausgangslage, nächste
// Schritte, Fahrplan nach Phasen, Offenes, Datenstand. Zustände kommen aus der Engine.

import type { RuleResult } from "@povratnik/engine";
import type { Bundle } from "../lib/content.ts";
import type { Plan, PlanItem } from "../lib/plan.ts";
import { UNKNOWN, answerOf, stepsFor, type Answers, type PersonAnswers, type Step } from "../lib/questions.ts";
import { i18n, t, type Texts } from "./text.ts";

type Props = {
  plan: Plan;
  answers: Answers;
  bundle: Bundle;
  personLabel: (p: PersonAnswers) => string;
  onEdit: (stepIndex: number) => void;
  onRestart: () => void;
};

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

function answerLabel(texts: Texts, step: Step, value: string | string[] | undefined): string {
  if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) return t(texts, "wizard.unknown");
  const base = `wizard.q.${step.question.id}.options`;
  if (Array.isArray(value)) return value.map((v) => (v === UNKNOWN ? t(texts, "wizard.unknown") : t(texts, `${base}.${v}`))).join(", ");
  if (value === UNKNOWN) return t(texts, "wizard.unknown");
  if (step.question.kind === "date") return formatDate(value);
  return t(texts, `${base}.${value}`);
}

function holidayNote(bundle: Bundle): string {
  const texts = bundle.texts;
  if (bundle.calendars.length === 0) return t(texts, "plan.no_holidays");
  return bundle.calendars.map((c) => t(texts, "plan.with_holidays", { calendar: i18n(c.title), date: formatDate(c.checked) })).join("; ");
}

function Deadline({ result, bundle }: { result: RuleResult; bundle: Bundle }) {
  const texts = bundle.texts;
  const d = result.deadline;
  if (!d) return null;
  if (d.status === "awaiting_event") {
    return <p class="deadline deadline--awaiting">{t(texts, "deadline.awaiting", { event: t(texts, `events.${d.event}`) })} ({t(texts, `deadline.kinds.${d.kind}`)})</p>;
  }
  return (
    <p class="deadline">
      {t(texts, "deadline.due", { date: formatDate(d.due) })}, {t(texts, `deadline.kinds.${d.kind}`)}
      {d.adjusted !== "none" && `, ${t(texts, `deadline.adjusted.${d.adjusted}`)}`}. {holidayNote(bundle)}
    </p>
  );
}

function Item({ item, texts, bundle, personLabel }: { item: PlanItem; texts: Texts; bundle: Bundle; personLabel: string }) {
  const { result, task, rule } = item;
  const state = result.eligibility;
  return (
    <article class="item">
      <header class="item__head">
        <h3 class="item__title">{i18n(task.title)}</h3>
        <span class={`state state--${state}`}>{t(texts, `eligibility.${state}`)}</span>
      </header>
      <p class="item__person mono">{personLabel}</p>
      <p>{t(texts, result.text_key)}</p>
      {result.version_selection === "by_reference_date_provisional" && <p class="soft">{t(texts, "plan.provisional")}</p>}
      <Deadline result={result} bundle={bundle} />
      <dl class="item__facts">
        <dt>{t(texts, "plan.purpose")}</dt>
        <dd>{i18n(task.purpose)}</dd>
        <dt>{t(texts, "plan.authority")}</dt>
        <dd>{i18n(task.authority.name)}</dd>
        {task.documents.length > 0 && (
          <>
            <dt>{t(texts, "plan.documents")}</dt>
            <dd>
              {task.documents.map((doc, i) => (
                <span key={i}>
                  {i > 0 && ", "}
                  {i18n(doc.name)}
                  {doc.term && <> (<span lang="hr">{doc.term.term_hr}</span>)</>}
                </span>
              ))}
            </dd>
          </>
        )}
      </dl>
      <details class="why">
        <summary>{t(texts, "plan.why")}</summary>
        <dl class="item__facts">
          <dt>{t(texts, "plan.used_facts")}</dt>
          <dd>
            {result.conditions.length === 0
              ? `${t(texts, "facts.person.citizenship_status")}, ${t(texts, "facts.person.residence_status")}`
              : [...new Set(["person.citizenship_status", "person.residence_status", ...result.conditions.map((c) => c.field)])].map((f) => t(texts, `facts.${f}`)).join(", ")}
          </dd>
          <dt>{t(texts, "plan.rule")}</dt>
          <dd>
            {i18n(rule.title)} <span class="mono">({result.rule}, {i18n(bundle.procedures[result.procedure]?.title)})</span>
          </dd>
          {rule.sources.map((s, i) => (
            <>
              <dt key={`s${i}`}>{t(texts, "plan.source")}</dt>
              <dd key={`d${i}`} class="mono">
                {s.id}, {s.reference}, {t(texts, "plan.checked")} {formatDate(s.checked)}
              </dd>
            </>
          ))}
        </dl>
      </details>
    </article>
  );
}

export function PlanView({ plan, answers, bundle, personLabel, onEdit, onRestart }: Props) {
  const texts = bundle.texts;
  const steps = stepsFor(answers);
  const byId = new Map(answers.persons.map((p) => [p.id, p]));
  const label = (id: string) => {
    const p = byId.get(id);
    return p ? personLabel(p) : id;
  };

  return (
    <div class="plan">
      <header class="plan__head">
        <h2>{t(texts, "plan.title")}</h2>
        <div class="plan__actions no-print">
          <button class="button" type="button" onClick={() => window.print()}>{t(texts, "wizard.print")}</button>
          <button class="button button--quiet" type="button" onClick={onRestart}>{t(texts, "wizard.restart")}</button>
        </div>
      </header>

      <section class="plan__section">
        <h3>{t(texts, "plan.situation")}</h3>
        <dl class="situation">
          {steps.map((step, i) => (
            <div class="situation__row" key={i}>
              <dt>
                {step.person && <span class="mono">{personLabel(step.person)}: </span>}
                {t(texts, `wizard.q.${step.question.id}.title`)}
              </dt>
              <dd>
                {answerLabel(texts, step, answerOf(answers, step))}{" "}
                <button class="button button--quiet no-print" type="button" onClick={() => onEdit(i)}>{t(texts, "wizard.edit")}</button>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section class="plan__section">
        <h3>{t(texts, "plan.next")}</h3>
        <p class="soft">{t(texts, "plan.next_help")}</p>
        {plan.next.length === 0 ? (
          <p>{t(texts, "plan.next_empty")}</p>
        ) : (
          <ol class="next">
            {plan.next.map((item) => (
              <li key={`${item.person}-${item.result.rule}`}>
                <Item item={item} texts={texts} bundle={bundle} personLabel={label(item.person)} />
              </li>
            ))}
          </ol>
        )}
      </section>

      <section class="plan__section">
        <h3>{t(texts, "plan.roadmap")}</h3>
        {plan.phases.length === 0 && <p>{t(texts, "plan.next_empty")}</p>}
        {plan.phases.map((g) => (
          <details class="phase" open key={g.phase}>
            <summary>
              <span>{t(texts, `phases.${g.phase}`)}</span> <span class="mono muted">{g.items.length}</span>
            </summary>
            <div class="phase__items">
              {g.items.map((item) => (
                <Item key={`${item.person}-${item.result.rule}`} item={item} texts={texts} bundle={bundle} personLabel={label(item.person)} />
              ))}
            </div>
          </details>
        ))}
      </section>

      <section class="plan__section">
        <h3>{t(texts, "plan.open")}</h3>
        <p class="soft">{t(texts, "plan.open_help")}</p>
        {plan.open.length === 0 ? (
          <p>{t(texts, "plan.open_empty")}</p>
        ) : (
          <ul class="open">
            {plan.open.map((o, i) => {
              const [kind, subject] = o.clarification.split(":") as [string, string];
              const text =
                kind === "missing"
                  ? t(texts, "plan.missing", { fact: t(texts, `facts.${subject}`) })
                  : kind === "rule_conflict"
                    ? t(texts, "plan.conflict", { procedure: i18n(bundle.procedures[subject]?.title) || subject })
                    : o.clarification;
              return (
                <li key={i}>
                  <span class="state state--unclear">{t(texts, "eligibility.unclear")}</span> <span class="mono">{label(o.person)}:</span> {text}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {plan.errors.length > 0 && (
        <section class="plan__section notice">
          <strong>{t(texts, "plan.errors")}</strong>
          <ul class="mono">
            {plan.errors.map((e, i) => (
              <li key={i}>
                {label(e.person)} {e.rule}: {e.message}
              </li>
            ))}
          </ul>
        </section>
      )}

      <p class="datenstand">
        <span>{t(texts, "plan.reference_date")} {formatDate(plan.reference_date)}</span>
        <span>
          {t(texts, "plan.rule_versions")}: {plan.rule_versions.length > 0 ? plan.rule_versions.join(", ") : t(texts, "plan.none")}
        </span>
        <span>
          {t(texts, "plan.calendars")}: {bundle.calendars.length > 0 ? bundle.calendars.map((c) => `${i18n(c.title)} (${formatDate(c.checked)})`).join(", ") : t(texts, "plan.none")}
        </span>
        <span>{t(texts, "plan.recheck")}</span>
      </p>
    </div>
  );
}
