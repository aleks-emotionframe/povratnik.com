// Die Wizard-Insel: Kurzcheck, Haushaltsleiste, Auswertung im Browser, Plan.
// Antworten bleiben im Browser (sessionStorage), es gibt keinen Endpunkt und keinen
// Link mit Antworten (CLAUDE.md 2.5). Die Engine liest nie die Uhr; das Referenzdatum
// wird hier gesetzt und im Plan angezeigt.

import { useEffect, useMemo, useState } from "preact/hooks";
import { evaluate } from "@povratnik/engine";
import type { Bundle } from "../lib/content.ts";
import { personsInput } from "../lib/facts.ts";
import { buildPlan } from "../lib/plan.ts";
import { answerOf, isAnswered, personsFor, stepsFor, type Answers, type Household, type PersonAnswers, type Role } from "../lib/questions.ts";
import { PlanView } from "./PlanView.tsx";
import { Question } from "./Question.tsx";
import { t } from "./text.ts";

const STORAGE_KEY = "povratnik.kurzcheck";

type Saved = { answers: Answers; step: number; view: "questions" | "plan"; checks?: Record<string, boolean> };

function load(): Saved | undefined {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Saved) : undefined;
  } catch {
    return undefined;
  }
}

function save(s: Saved) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // Ohne Speicher läuft der Kurzcheck trotzdem, nur nicht über ein Neuladen hinweg.
  }
}

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function Wizard({ bundle }: { bundle: Bundle }) {
  const texts = bundle.texts;
  const [answers, setAnswers] = useState<Answers>({ persons: [] });
  const [step, setStep] = useState(0);
  const [view, setView] = useState<"questions" | "plan">("questions");
  const [restored, setRestored] = useState(false);
  // Abgehakte Punkte der Ankommens- und Bleibeliste, nur in diesem Browser.
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = load();
    if (saved) {
      setAnswers(saved.answers);
      setStep(saved.step);
      setView(saved.view);
      setChecks(saved.checks ?? {});
    }
    setRestored(true);
  }, []);
  useEffect(() => {
    if (restored) save({ answers, step, view, checks });
  }, [answers, step, view, checks, restored]);

  const steps = stepsFor(answers);
  const current = steps[Math.min(step, steps.length - 1)];

  const personLabel = (p: PersonAnswers) => {
    const same = answers.persons.filter((o) => o.role === p.role);
    const base = t(texts, `wizard.roles.${p.role}`);
    return same.length > 1 ? `${base} ${same.indexOf(p) + 1}` : base;
  };

  const update = (value: string | string[]) => {
    if (!current) return;
    const q = current.question.id;
    setAnswers((a) => {
      if (q === "stage") return { ...a, stage: value as Answers["stage"] };
      if (q === "horizon") return { ...a, horizon: value as Answers["horizon"] };
      if (q === "household") {
        const household = value as Household;
        // Personen nur neu anlegen, wenn sich die Vorgabe ändert; Antworten bleiben sonst.
        return household === a.household ? a : { ...a, household, persons: personsFor(household) };
      }
      const persons = a.persons.map((p) => {
        if (p.id !== current.person!.id) return p;
        switch (q) {
          case "country": return { ...p, country: value as string };
          case "citizenship": return { ...p, citizenships: value as string[] };
          case "link": return { ...p, link: value as string };
          case "income": return { ...p, income: value as string };
          case "residence": return { ...p, residence: value as string };
          case "entry": return { ...p, entry: value as string };
        }
      });
      return { ...a, persons };
    });
  };

  const addPerson = (role: Role) =>
    setAnswers((a) => {
      // Ids bleiben eindeutig, auch nachdem eine Person entfernt wurde.
      const next = 1 + Math.max(0, ...a.persons.map((p) => Number(p.id.slice(1)) || 0));
      return { ...a, persons: [...a.persons, { id: `p${next}`, role }] };
    });
  const removePerson = (id: string) =>
    setAnswers((a) => ({ ...a, persons: a.persons.filter((p) => p.id !== id) }));

  const plan = useMemo(() => {
    if (view !== "plan") return undefined;
    const out = evaluate(
      { reference_date: today(), persons: personsInput(answers), calendar: { holidays: bundle.holidays } },
      bundle.rules,
      bundle.synthetic ? { include: "all" } : {},
    );
    return buildPlan(out, bundle);
  }, [view, answers, bundle]);

  const restart = () => {
    setAnswers({ persons: [] });
    setStep(0);
    setView("questions");
    setChecks({});
  };

  if (view === "plan" && plan) {
    return (
      <PlanView
        plan={plan}
        answers={answers}
        bundle={bundle}
        personLabel={personLabel}
        onEdit={(i) => {
          setStep(i);
          setView("questions");
        }}
        onRestart={restart}
        onRefine={setAnswers}
        checks={checks}
        onCheck={(id, done) => setChecks((c) => ({ ...c, [id]: done }))}
      />
    );
  }
  if (!current) return null;

  // Erst wenn der Haushalt steht, ist die Schrittliste vollständig.
  const isLast = answers.household !== undefined && step >= steps.length - 1;
  const answered = isAnswered(answers, current);

  return (
    <form
      class="wizard"
      onSubmit={(e) => {
        e.preventDefault();
        if (!answered) return;
        if (isLast) setView("plan");
        else setStep(step + 1);
      }}
    >
      {answers.persons.length > 1 && (
        <ol class="household" aria-label={t(texts, "wizard.household_label")}>
          {answers.persons.map((p) => (
            <li key={p.id} class={current.person?.id === p.id ? "household__person household__person--current" : "household__person"} aria-current={current.person?.id === p.id ? "true" : undefined}>
              {personLabel(p)}
            </li>
          ))}
        </ol>
      )}

      <Question
        step={current}
        value={answerOf(answers, current)}
        onChange={update}
        texts={texts}
        personLabel={current.person ? personLabel(current.person) : undefined}
      />

      {current.question.id === "household" && answers.household && (
        <div class="persons">
          <ul class="persons__list">
            {answers.persons.map((p) => (
              <li key={p.id}>
                {personLabel(p)}
                {p.role !== "self" && (
                  <button class="button button--quiet" type="button" onClick={() => removePerson(p.id)} aria-label={`${personLabel(p)} ${t(texts, "wizard.remove")}`}>
                    {t(texts, "wizard.remove")}
                  </button>
                )}
              </li>
            ))}
          </ul>
          <p class="persons__add">
            <button class="button" type="button" onClick={() => addPerson("child")}>+ {t(texts, "wizard.roles.child")}</button>
            <button class="button" type="button" onClick={() => addPerson("other")}>+ {t(texts, "wizard.roles.other")}</button>
          </p>
        </div>
      )}

      <div class="wizard__nav">
        <button class="button button--quiet" type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
          {t(texts, "wizard.back")}
        </button>
        <p class="wizard__progress">{t(texts, "wizard.progress", { n: step + 1, total: steps.length })}</p>
        <button class="button button--primary" type="submit" disabled={!answered}>
          {isLast ? t(texts, "wizard.finish") : t(texts, "wizard.next")}
        </button>
      </div>
    </form>
  );
}
