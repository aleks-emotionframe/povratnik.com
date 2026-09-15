// Suchindex zur Bauzeit: Themenseiten, Rubriken, Lebenssituationen, Länder, Orte,
// Meldungen und Amtsbegriffe je Sprache. Die Suchseite legt ihn in die Seite, die
// Kopfsuche lädt ihn als statische Datei /suche-index.json nach. Die Suche selbst
// läuft immer im Browser; kein Suchbegriff verlässt ihn (CLAUDE.md 2.5 sinngemäss).
import { RUBRICS, rubricText } from "./rubrics.ts";
import { SITUATIONS, situationText } from "./situations.ts";
import { loadPages, pagePath } from "./pages.ts";
import { loadPlaces, placeName } from "./places.ts";
import { loadNews, newsPath } from "./news.ts";
import { CONTENT_DIR } from "./page.ts";
import { t } from "../islands/text.ts";
import { loadCatalogue, localePath, type Locale } from "./i18n.ts";

export type SearchEntry = { kind: string; title: string; text: string; href: string; terms?: string };

export function buildSearchIndex(lang: Locale): SearchEntry[] {
  const texts = loadCatalogue(CONTENT_DIR, lang);
  const u = (key: string) => t(texts, `ui.${key}`);
  const p = (path: string) => localePath(lang, path);
  const topics = loadPages(CONTENT_DIR, lang);
  const countries = loadPages(CONTENT_DIR, lang, "country");
  return [
    ...topics.map((x) => ({ kind: u("search.kind_topic"), title: x.title, text: x.short_answer, href: p(pagePath(x)), terms: [...x.covers, ...x.terms.map((tm) => tm.term_hr)].join(" ") })),
    ...RUBRICS.map((r) => { const tx = rubricText(r, texts); return { kind: u("search.kind_rubric"), title: tx.title, text: tx.intro, href: p(`/wissen/${r.slug}`), terms: tx.topics.join(" ") }; }),
    ...SITUATIONS.map((s) => { const tx = situationText(s, texts); return { kind: u("search.kind_situation"), title: tx.title, text: tx.intro, href: p(`/wissen/situation/${s.slug}`) }; }),
    ...countries.map((x) => ({ kind: u("search.kind_country"), title: x.title, text: x.short_answer, href: p(pagePath(x)) })),
    ...loadPlaces().map((pl) => ({ kind: u("search.kind_place"), title: placeName(pl), text: pl.summary, href: p(`/orte/${pl.id}`), terms: pl.benefits.map((b) => b.title).join(" ") })),
    ...loadNews(CONTENT_DIR, lang).map((n) => ({ kind: u("news.crumb"), title: n.title, text: n.short_answer, href: p(newsPath(n)) })),
    ...topics.flatMap((x) => x.terms.map((tm) => ({ kind: u("search.kind_term"), title: tm.term_hr, text: tm.term_explained[lang] ?? tm.term_explained.de, href: p(pagePath(x)) }))),
  ];
}
