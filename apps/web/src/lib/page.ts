// Gemeinsamer Einstieg jeder Seite: Sprache aus der Adresse, Katalog dieser Sprache,
// u() für Oberflächentexte unter ui.*, p() für Pfade mit Sprachpräfix.

import { join } from "node:path";
import { t, type Texts } from "../islands/text.ts";
import { asLocale, loadCatalogue, localePath, type Locale } from "./i18n.ts";

export const CONTENT_DIR = join(process.cwd(), "..", "..", "content");

export type PageContext = {
  lang: Locale;
  texts: Texts;
  u: (key: string, vars?: Record<string, string | number>) => string;
  p: (path: string) => string;
};

export function pageContext(astro: { currentLocale?: string | undefined }): PageContext {
  const lang = asLocale(astro.currentLocale);
  const texts = loadCatalogue(CONTENT_DIR, lang);
  return {
    lang,
    texts,
    u: (key, vars = {}) => t(texts, `ui.${key}`, vars),
    p: (path) => localePath(lang, path),
  };
}

/** Datum tt.mm.jjjj aus ISO. */
export function fmtDate(iso: string): string {
  return iso.split("-").reverse().join(".");
}
