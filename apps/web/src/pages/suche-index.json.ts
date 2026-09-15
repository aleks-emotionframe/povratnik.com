// Statischer Suchindex für die Live-Suche im Kopf, alle vier Sprachen in einer Datei.
// Wird erst geladen, wenn jemand das Suchfeld benutzt. Enthält nur öffentliche
// Seitentitel und Kurztexte, keine Nutzerdaten.
import { LOCALES } from "../lib/i18n.ts";
import { buildSearchIndex } from "../lib/search.ts";

export function GET() {
  const index = Object.fromEntries(LOCALES.map((l) => [l, buildSearchIndex(l)]));
  return new Response(JSON.stringify(index), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
