// Sprachen (CLAUDE.md 3): Deutsch ist Ausgangssprache und liegt an der Wurzel, Kroatisch,
// Englisch und Spanisch mit Präfix. Der Katalog einer Sprache wird über den deutschen
// gelegt: Fehlt ein Schlüssel, erscheint der deutsche Text, nie ein leerer. Die
// Oberfläche bleibt damit in jeder Sprache vollständig bedienbar, auch wenn eine
// Übersetzung noch eine Arbeitsfassung ist.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { lookup, type Texts } from "../islands/text.ts";

export const LOCALES = ["de", "hr", "en", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "de";
export const LOCALE_NAMES: Record<Locale, string> = { de: "Deutsch", hr: "Hrvatski", en: "English", es: "Español" };

export function asLocale(value: string | undefined): Locale {
  return (LOCALES as readonly string[]).includes(value ?? "") ? (value as Locale) : DEFAULT_LOCALE;
}

/** Pfad in einer Sprache: Deutsch ohne Präfix, sonst /hr, /en, /es davor. */
export function localePath(lang: Locale, path: string): string {
  return lang === DEFAULT_LOCALE ? path : `/${lang}${path === "/" ? "/" : path}`;
}

function deepMerge(base: Texts, over: Texts): Texts {
  const out: Texts = { ...base };
  for (const [k, v] of Object.entries(over)) {
    const b = out[k];
    out[k] = v && typeof v === "object" && b && typeof b === "object" ? deepMerge(b as Texts, v as Texts) : v;
  }
  return out;
}

const cache = new Map<string, Texts>();

/** Katalog einer Sprache, mit dem deutschen als Rückfall für jeden Schlüssel. */
export function loadCatalogue(contentDir: string, lang: Locale): Texts {
  const key = `${contentDir}:${lang}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const read = (l: Locale): Texts => {
    const file = join(contentDir, "i18n", `${l}.yaml`);
    return existsSync(file) ? (parse(readFileSync(file, "utf8")) as Texts) : {};
  };
  const merged = lang === DEFAULT_LOCALE ? read(lang) : deepMerge(read(DEFAULT_LOCALE), read(lang));
  cache.set(key, merged);
  return merged;
}

/** Ob ein Schlüssel in der Sprache selbst übersetzt ist (nicht nur über den Rückfall). */
export function translated(contentDir: string, lang: Locale, key: string): boolean {
  if (lang === DEFAULT_LOCALE) return true;
  const file = join(contentDir, "i18n", `${lang}.yaml`);
  if (!existsSync(file)) return false;
  return typeof lookup(parse(readFileSync(file, "utf8")) as Texts, key) === "string";
}
