## Art der Änderung

Genau eine ankreuzen (CLAUDE.md Abschnitt 6):

- [ ] Fachlich kritisch (Anspruch, Frist, Route, Abhängigkeit): Spezifikation, Tests zuerst, technisches Review und unabhängige Fachfreigabe. Kein Selbstmerge.
- [ ] Sicherheitsrelevant: Risiko dokumentiert, Tests, technisches Review.
- [ ] Reversibles Detail in Oberfläche oder Text.
- [ ] Neue wesentliche Produktentscheidung: Optionen und Folgen vorgelegt, Entscheidung durch Produktverantwortung.
- [ ] Unabhängige Teilaufgabe, Schnittstellen geklärt.

## Was ändert sich

<!-- Zwei bis fünf Sätze. Bei Regeln: welche Fassung, welches Ereignis, welche Quelle. -->

## Definition of Done

- [ ] Spezifikation vorhanden (bei kritischen Änderungen)
- [ ] `npm test` und `npm run validate` grün
- [ ] Abnahmefälle in `content/tests/` grün (ab M1)
- [ ] Performancebudget eingehalten (ab M4, `docs/betrieb.md` Abschnitt 2)
- [ ] Barrierefreiheit geprüft (ab M4)
- [ ] Keine Fachwerte ausserhalb von `content/` und Testfixtures
- [ ] Review durch die zuständige Rolle (`docs/rollen.md`)
- [ ] ADR in `docs/adr/`, falls Architekturentscheid
- [ ] Dokumentation in `docs/` aktualisiert

## Fachfreigabe

<!-- Nur bei fachlich kritisch: Name der Fachprüfung, Datum, Fassung. Ohne Eintrag kein Merge. -->
