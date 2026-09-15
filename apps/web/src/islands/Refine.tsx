// Vertiefende Fragen nach der Zusammenfassung (wizard-konzept.md 2.3): freiwillig, je
// Frage aufklappbar, «weiss ich nicht» überall gültig. Antworten bleiben im Browser.

import type { Answers } from "../lib/questions.ts";
import { refineQuestions, refineValue, withRefine, type RefineQuestion } from "../lib/refine.ts";
import { t, type Texts } from "./text.ts";

type Props = {
  answers: Answers;
  texts: Texts;
  places: { id: string; name: string }[];
  personLabel: (id: string) => string;
  onChange: (next: Answers) => void;
};

export function Refine({ answers, texts, places, personLabel, onChange }: Props) {
  const questions = refineQuestions(answers, places.map((p) => p.id));
  const total = questions.reduce((n, q) => n + q.fields.length, 0);
  const answered = questions.reduce((n, q) => n + q.fields.filter((f) => refineValue(answers, q, f.key) !== undefined).length, 0);
  const placeName = (id: string) => places.find((p) => p.id === id)?.name ?? id;

  const optionLabel = (q: RefineQuestion, key: string, opt: string) => {
    if (opt === "unknown") return t(texts, "wizard.refine.unknown");
    if (q.id === "place" && opt !== "none") return placeName(opt);
    return t(texts, `wizard.refine.${q.id}.${key}.${opt}`);
  };

  return (
    <section class="plan__section refine no-print">
      <h3>{t(texts, "plan.refine")}</h3>
      <p class="soft">{t(texts, "plan.refine_help")}</p>
      <p class="mono muted">{t(texts, "plan.refine_progress", { n: answered, total })}</p>
      {questions.map((q) => {
        const done = q.fields.every((f) => refineValue(answers, q, f.key) !== undefined);
        const title = t(texts, `wizard.refine.${q.id}.title`, { person: q.person ? personLabel(q.person.id) : "" });
        return (
          <details class="refine__q" key={`${q.id}-${q.person?.id ?? "h"}`}>
            <summary>
              <span class={`state state--${done ? "matches" : "unchecked"}`}>{t(texts, done ? "wizard.refine.done" : "wizard.refine.open")}</span> {title}
            </summary>
            <p class="soft">{t(texts, `wizard.refine.${q.id}.help`)}</p>
            {q.fields.map((f) => {
              const name = `refine-${q.id}-${q.person?.id ?? "h"}-${f.key}`;
              const value = refineValue(answers, q, f.key);
              return (
                <fieldset class="refine__field" key={f.key}>
                  <legend>{t(texts, `wizard.refine.${q.id}.${f.key}.label`)}</legend>
                  <div class="options options--inline">
                    {[...f.options, "unknown"].map((opt) => (
                      <label class="option option--compact" key={opt}>
                        <input type="radio" name={name} value={opt} checked={value === opt} onChange={() => onChange(withRefine(answers, q, f.key, opt))} />
                        <span>{optionLabel(q, f.key, opt)}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              );
            })}
          </details>
        );
      })}
    </section>
  );
}
