# Rollen

Version 1.0, 13.09.2026. Rollen sind Funktionen und müssen benannt sein (CLAUDE.md
Abschnitt 6). Produktverantwortung, technische Verantwortung und Fachfreigabe werden
getrennt besetzt. Eine Prüfung durch ein KI-System ersetzt keine qualifizierte
unabhängige Fachperson.

Platzhalter in spitzen Klammern werden durch die Produktverantwortung ausgefüllt.

---

## Besetzung

| Rolle | Aufgabe | Person | Seit | Vertretung |
|---|---|---|---|---|
| Produktverantwortung | Entscheidungen, Priorisierung, Partner, Freigabe von Produktentscheidungen und ADRs | <Name> | <Datum> | <Name oder offen> |
| Technische Verantwortung | Architektur, Umsetzung, Betrieb, Sicherheitsaktualisierungen, Sicherung und Wiederherstellung | <Name> | <Datum> | <Name oder offen> |
| Technisches Review | Zweites Augenpaar für Code und Datenstruktur. Erkennt technische Fehler, ist nicht zur rechtlichen Prüfung befähigt | <Name> | <Datum> | <Name oder offen> |
| Fachprüfung Recht und Steuern | Namentliche Freigabe jeder produktiv geladenen Rechtsregel. Kroatische Fachperson, nicht intern besetzbar | offen | | |
| Kroatischsprachige Fachredaktion | Regeln und Inhalte pflegen, Quellen prüfen, Behördenkontakt | offen | | |
| Fehlerkontakt | Erste Sichtung von Fehlermeldungen binnen zwei Werktagen, Sofortweg bei falschen Fristen | <Name> | <Datum> | <Name oder offen> |

---

## Was aus den offenen Rollen folgt

Solange die Fachprüfung nicht besetzt ist, bleibt jede Rechtsregel im Zustand
`approval.state: draft` oder `in_review`. Der Validator lässt `published` ohne
`approved` nicht zu, und `approved` braucht einen Namen im Feld `reviewer`. Damit ist
die Regel strukturell erzwungen: Ohne benannte Fachperson gibt es keine
veröffentlichte Rechtsregel.

Die Fachredaktion ist die Dauerressource, an der das Projekt steht oder fällt
(`umsetzungskonzept.md` Abschnitt 11). Sie muss vor M2 gefunden sein.

---

## Wer gibt was frei

| Änderung | Freigabe durch |
|---|---|
| Fachlich kritisch (Anspruch, Frist, Route, Abhängigkeit) | technisches Review und Fachprüfung, kein Selbstmerge |
| Sicherheitsrelevant | technisches Review |
| Reversibles Detail in Oberfläche oder Text | Autor selbst, dokumentiert im Pull Request |
| Neue wesentliche Produktentscheidung | Produktverantwortung, als ADR oder Änderung in `docs/` |
| Rücknahme einer falschen Fachausgabe | Fehlerkontakt sofort per `publication.state: withdrawn`, Selbstmerge nur dafür erlaubt (`redaktionsdurchlauf.md` 2), Wiederfreigabe durch Fachprüfung |
