// Die Stufe der Website (ADR-0004). Einzige Stelle, an der sie festgelegt wird; kein
// Umgebungsschalter. "test": Kurzcheck wertet auch synthetische und nicht freigegebene
// Regeln aus, jede Seite ist gekennzeichnet und nicht indexierbar. "public": nur
// freigegebene Regeln; der Wechsel setzt eine benannte Fachprüfung in docs/rollen.md
// voraus und läuft über einen Pull Request.

export type Stage = "test" | "public";

export const STAGE: Stage = "test";

/** Welche Regeln das Regelpaket aufnimmt: im Build je nach Stufe, im Dev-Server alles. */
export function bundleMode(prod: boolean): "build" | "dev" {
  return prod && STAGE === "public" ? "build" : "dev";
}
