// Website und Wizard (ADR-0002). Informationsseiten statisch ohne JavaScript; nur die
// Wizard-Insel lädt Preact, und nur auf ihrer eigenen Seite (CLAUDE.md 2.6).
import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";

export default defineConfig({
  site: "https://povratnik.com",
  output: "static",
  integrations: [preact()],
  compressHTML: true,
  build: { inlineStylesheets: "always" },
});
