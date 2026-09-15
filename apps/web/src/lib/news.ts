// Meldungen «Aktuelles»: Seiten vom Typ news aus content/pages, neueste zuerst. Auf der
// Teststufe (ADR-0004) erscheinen auch synthetische Beispielmeldungen, sichtbar als
// Beispiel gekennzeichnet; auf der Stufe public nur freigegebene, veröffentlichte,
// nicht synthetische. Sprache mit Rückfall auf Deutsch wie bei den Themenseiten.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { STAGE } from "./stage.ts";
import type { PageView } from "./pages.ts";

export type NewsView = PageView & { synthetic: boolean; news: { published_on: string; body: string[]; image: { file: string; alt: string } } };

// Bilder liegen in src/assets/news und werden zur Bauzeit von Astro als WebP in mehreren
// Breiten erzeugt; der Dateiname kommt aus dem Datensatz.
const IMAGES = import.meta.glob<{ default: ImageMetadata }>("../assets/news/*.webp", { eager: true });
export function newsImage(n: NewsView): ImageMetadata | undefined {
  return IMAGES[`../assets/news/${n.news.image.file}`]?.default;
}

function visible(n: NewsView): boolean {
  if (STAGE === "public") return !n.synthetic && n.approval.state === "approved" && n.publication.state === "published";
  return n.publication.state !== "withdrawn";
}

export function loadNews(contentDir: string, lang = "de"): NewsView[] {
  const dir = join(contentDir, "pages");
  const all = readdirSync(dir)
    .filter((f) => f.endsWith(".yaml"))
    .map((f) => parse(readFileSync(join(dir, f), "utf8")) as NewsView)
    .filter((n) => n.type === "news")
    .filter(visible);
  const base = all.filter((n) => n.lang === "de");
  const own = new Map(all.filter((n) => n.lang === lang).map((n) => [n.id, n]));
  const list = lang === "de" ? base : base.map((n) => own.get(n.id) ?? { ...n, fallback: true });
  return list.sort((a, b) => b.news.published_on.localeCompare(a.news.published_on));
}

export function newsPath(n: NewsView): string {
  return `/aktuell/${n.id}`;
}
