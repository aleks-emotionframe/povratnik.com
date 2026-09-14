// Eine Hauptfrage je Ansicht, darunter die Erklärung, wozu die Angabe gebraucht wird
// (designsystem.md 5). «Weiss ich noch nicht» ist eine gleichwertige Option.

import { UNKNOWN, type Step } from "../lib/questions.ts";
import { t, type Texts } from "./text.ts";

type Props = {
  step: Step;
  value: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
  texts: Texts;
  personLabel?: string;
};

export function Question({ step, value, onChange, texts, personLabel }: Props) {
  const q = step.question;
  const base = `wizard.q.${q.id}`;
  const name = `${q.id}-${step.person?.id ?? "household"}`;

  return (
    <fieldset class="question">
      <legend>
        {personLabel && <span class="question__person">{t(texts, "wizard.for_person", { person: personLabel })}</span>}
        <span class="question__title">{t(texts, `${base}.title`)}</span>
      </legend>
      <p class="question__help">{t(texts, `${base}.help`)}</p>

      {q.kind === "single" && (
        <div class="options">
          {[...q.options, ...(q.unknownOption ? [UNKNOWN] : [])].map((opt) => (
            <label class="option" key={opt}>
              <input type="radio" name={name} value={opt} checked={value === opt} onChange={() => onChange(opt)} />
              <span>{opt === UNKNOWN ? t(texts, "wizard.unknown") : t(texts, `${base}.options.${opt}`)}</span>
            </label>
          ))}
        </div>
      )}

      {q.kind === "multi" && (
        <div class="options">
          {[...q.options, UNKNOWN].map((opt) => {
            const list = Array.isArray(value) ? value : [];
            const checked = list.includes(opt);
            const toggle = () => {
              // «Weiss ich nicht» schliesst die anderen aus und umgekehrt.
              if (opt === UNKNOWN) return onChange(checked ? [] : [UNKNOWN]);
              const next = checked ? list.filter((v) => v !== opt) : [...list.filter((v) => v !== UNKNOWN), opt];
              onChange(next);
            };
            return (
              <label class="option" key={opt}>
                <input type="checkbox" name={name} value={opt} checked={checked} onChange={toggle} />
                <span>{opt === UNKNOWN ? t(texts, "wizard.unknown") : t(texts, `${base}.options.${opt}`)}</span>
              </label>
            );
          })}
        </div>
      )}

      {q.kind === "date" && (
        <div class="options">
          <label class="option option--date">
            <span class="visually-hidden">{t(texts, `${base}.title`)}</span>
            <input
              type="date"
              name={name}
              value={value === UNKNOWN || value === undefined ? "" : (value as string)}
              onInput={(e) => onChange((e.currentTarget as HTMLInputElement).value)}
            />
          </label>
          <label class="option">
            <input type="checkbox" name={`${name}-unknown`} checked={value === UNKNOWN} onChange={() => onChange(value === UNKNOWN ? "" : UNKNOWN)} />
            <span>{t(texts, "wizard.unknown")}</span>
          </label>
        </div>
      )}
    </fieldset>
  );
}
