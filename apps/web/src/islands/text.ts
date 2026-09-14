// Textzugriff auf den Katalog aus content/i18n. Fehlt ein Schlüssel, wird der Schlüssel
// selbst angezeigt: sichtbar statt still, damit es beim Prüfen auffällt.

export type Texts = Record<string, unknown>;

export function lookup(texts: Texts, key: string): unknown {
  return key.split(".").reduce<unknown>((node, part) => (node && typeof node === "object" ? (node as Texts)[part] : undefined), texts);
}

export function t(texts: Texts, key: string, vars: Record<string, string | number> = {}): string {
  const value = lookup(texts, key);
  const s = typeof value === "string" ? value : key;
  return s.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? `{${name}}`));
}

export function i18n(text: { de: string } | undefined): string {
  return text?.de ?? "";
}
