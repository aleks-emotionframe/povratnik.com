// Website und Wizard (ADR-0002). Informationsseiten statisch ohne JavaScript; nur die
// Wizard-Insel lädt Preact, und nur auf ihrer eigenen Seite (CLAUDE.md 2.6).
// Sprachen (CLAUDE.md 3): Deutsch an der Wurzel, hr, en, es mit Präfix. Fehlt eine Seite
// in einer Sprache, wird die deutsche Seite unter der Sprachadresse gerendert; die
// Seite liest Astro.currentLocale und zeigt den Hinweis «Arbeitsfassung fehlt».
import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";

export default defineConfig({
  site: "https://povratnik.com",
  output: "static",
  integrations: [preact()],
  compressHTML: true,
  build: { inlineStylesheets: "always" },
  i18n: {
    defaultLocale: "de",
    locales: ["de", "hr", "en", "es"],
    fallback: { hr: "de", en: "de", es: "de" },
    routing: { prefixDefaultLocale: false, fallbackType: "rewrite" },
  },
});
