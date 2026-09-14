# ADR-0004: Teststufe vor der ersten Fachfreigabe

Status: **entschieden am 14.09.2026 durch die Produktverantwortung.** Betrifft
CLAUDE.md Abschnitt 4 (seit 2.3), `rollen.md`, `betrieb.md` Abschnitt 4, den Build-Test
in `apps/web/test/build.test.ts`.

---

## Kontext

CLAUDE.md Abschnitt 4 verlangt: Nicht fachlich freigegebene Regeln werden öffentlich
nie ausgewertet. Die Fachprüfung Recht und Steuern ist unbesetzt (`rollen.md`). Damit
gibt es keine freigegebene Regel, und die gebaute Website zeigt im Kurzcheck «keine
freigegebene Regel» statt eines Plans. Das Portal lässt sich so weder ausgiebig testen
noch beurteilen.

Die Produktverantwortung will das Portal vollständig sehen und testen können, bevor es
jemand ausserhalb des Teams bekommt. Der Link wird bis zur Fertigstellung nicht
herausgegeben.

## Optionen

1. **Beispielregeln als freigegeben markieren.** Verworfen: Das fälscht den
   Freigabestatus in den Daten, und der Validator verlangt zu Recht einen Namen.
2. **Umgebungsschalter beim Build.** Verworfen: CLAUDE.md schliesst
   Umgebungsschalter aus, weil ein falsch gesetzter Schalter unbemerkt eine falsche
   Fachausgabe ausliefert.
3. **Teststufe als Konstante im Code, an genau einer Stelle, mit Kennzeichnung auf
   jeder Seite und einem Test, der die Kennzeichnung erzwingt.** Gewählt.

## Entscheidung

Es gibt zwei Stufen, festgelegt in `apps/web/src/lib/stage.ts`:

- `test`: Der Kurzcheck wertet alle nicht zurückgezogenen Regeln aus, auch
  synthetische und nicht freigegebene. Jede Seite trägt `data-stage="test"`, die
  Kopfleiste «Teststufe», `robots: noindex, nofollow`, und der Kurzcheck zeigt das
  Band «Synthetische Beispielregeln». Die Fachprüfung ist in `rollen.md` als
  Platzhalter geführt.
- `public`: Der Kurzcheck wertet nur freigegebene, veröffentlichte, nicht
  synthetische Regeln aus. Der Build-Test lehnt jede synthetische Regel und jeden
  Entwurf im Ausgabeverzeichnis ab.

Der Build-Test prüft je Stufe das Passende: in `test` die Kennzeichnung auf jeder
Seite, in `public` das Fehlen jeder Beispielregel. Der Wechsel auf `public` ist eine
Änderung dieser einen Konstante in einem Pull Request und setzt voraus, dass
`rollen.md` eine benannte Fachprüfung führt.

## Konsequenzen

- Das Portal ist auf der Teststufe vollständig bedienbar, mit erkennbar erfundenen
  Regeln. Kein Ergebnis der Teststufe ist eine Aussage über die tatsächliche Lage.
- Der Link darf auf der Teststufe nicht an Kundinnen, Gemeinden oder Testpersonen
  ausserhalb des Teams gehen. Für den Pilot mit echten Testpersonen (M2) braucht es
  die erste Fachfreigabe und die Stufe `public`.
- Abschnitt 2.5 (Antworten bleiben lokal) und alle übrigen Grenzen gelten auf beiden
  Stufen unverändert.
