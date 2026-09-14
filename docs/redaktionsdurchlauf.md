# Redaktionsdurchlauf

Version 1.0, 14.09.2026. Verbindlicher Ablauf für jede Änderung an einer Regel, einer
Aufgabe, einem Verfahren oder einem Kalender, von der Quelle bis zur Veröffentlichung
und zurück. Rollen nach `rollen.md`, Grenzen nach `../CLAUDE.md` Abschnitt 4 und 6,
Zustände nach `datenmodell.md` 2.4. Solange die Redaktionsoberfläche (M3) fehlt, läuft
der Durchlauf über Dateien und Pull Requests auf GitHub.

Grundsatz: Eine Fassung wird nie überschrieben. Jede Änderung ist eine neue Fassung
mit eigenem Gültigkeitsfenster, eigener Quelle und eigener Freigabe. Die alte Fassung
bleibt für historische Ereignisse auswertbar.

---

## 1. Ablauf einer Änderung

| Schritt | Wer | Was | Nachweis |
|---|---|---|---|
| 1 Anlass | Änderungswächter, Prüfzyklus (`review.next_check`), Fehlerkontakt oder Fachredaktion | Quelle hat sich geändert, Prüfdatum ist fällig oder eine Meldung liegt vor | Eintrag im Quellenregister (`changelog`) |
| 2 Neue Fassung | Fachredaktion | Datei `<id>.<n+1>.yaml` anlegen, nie die alte ändern. Pflicht: `validity.valid_from` mit Stichtag, `supersedes` und in der alten Fassung `superseded_by` gegenseitig, `valid_until` der alten Fassung auf den Vortag, `transitional` mit Übergangsregel oder `null`, Quelle mit Fundstelle und `checked`, `approval.state: in_review`, `publication.state: unpublished` | Diff im Pull Request |
| 3 Lokale Prüfung | Fachredaktion oder technische Verantwortung | `npm run validate` und `npm test`. Abnahmefälle in `content/tests/` ergänzen: Tag vor dem Stichtag, Stichtag, Tag danach | grüne Läufe |
| 4 Pull Request | Fachredaktion | Vorlage ausfüllen, Art «fachlich kritisch», Fassung, Ereignis und Quelle nennen | PR |
| 5 CI | automatisch | Typprüfung, Build, Tests, Validierung. Der Validator lehnt unvollständige Fassungen ab: fehlende Quelle, fehlendes `trigger`, überlappende Gültigkeit, gebrochene Fassungskette | Status-Check `validate` grün |
| 6 Technisches Review | Technisches Review | Struktur, Fassungskette, Tests. Keine rechtliche Prüfung | GitHub-Review «approved» |
| 7 Fachfreigabe | Fachprüfung Recht und Steuern | liest die Fassung gegen die Quelle und bestätigt schriftlich. Danach `approval.state: approved`, `reviewer` mit Name und Funktion, `approved_at` mit Datum. Der Commit wird von der Fachprüfung im PR bestätigt | Eintrag in der Datei plus GitHub-Review der Fachprüfung |
| 8 Veröffentlichung | Technisches Review | `publication.state: published` im selben PR, Merge in `main`. Kein Selbstmerge. Der Validator lässt `published` ohne `approved` und ohne Quelle nicht zu | Merge |
| 9 Auslieferung | automatisch | Build der Website nimmt nur Fassungen mit `synthetic: false`, `approved` und `published` in das Regelpaket auf; ein Test durchsucht das Build-Ergebnis | CI |

Was heute noch fehlt und den Ablauf ergänzt, sobald es da ist: der Übertragungsschritt
in die Datenbank bei jeder Freigabe (ADR-0001, ab M2b-2), die Redaktionsoberfläche,
die Schritte 2 bis 4 hinter Formularen verbirgt (M3), und der Branch-Schutz auf
`main` (Pull Request und Status-Check erforderlich).

---

## 2. Rücknahme einer falschen Fachausgabe

Sofortweg nach `betrieb.md` Abschnitt 1. Ziel: die falsche Ausgabe verschwindet
innerhalb von Stunden, nicht Tagen.

1. Der Fehlerkontakt setzt in der betroffenen Fassung `publication.state: withdrawn`
   und ergänzt im Quellenregister einen `changelog`-Eintrag mit Grund und Datum.
2. Pull Request mit Art «Rücknahme». **Selbstmerge ist hier ausdrücklich erlaubt**,
   weil eine Rücknahme nur Ausgaben entfernt und nichts Neues behauptet. Engine und
   Build werten `withdrawn` nie aus, auch nicht für historische Ereignisse.
3. Nach dem Merge: Build und Auslieferung, Kontrolle, dass die Ausgabe weg ist.
4. Wiederfreigabe ausschliesslich über eine neue Fassung nach Abschnitt 1, Schritt 2
   bis 8. Die zurückgezogene Fassung bleibt als Nachweis im Bestand.

Die Rücknahme muss vor der ersten Veröffentlichung einmal geprobt sein
(`betrieb.md` 1). Protokoll der Probe: Abschnitt 5.

---

## 3. Kalender, Aufgaben, Verfahren

Derselbe Ablauf. Besonderheiten:

- **Kalender** (`content/calendars/`) sind nicht nach Fassung benannt; Jahre werden in
  derselben Datei ergänzt. Bewegliche Feiertage werden je Jahr als Datum eingetragen,
  es gibt keinen Ostercode. Prüfzyklus halbjährlich, damit das nächste Jahr vor dem
  Jahreswechsel vorliegt.
- **Aufgaben und Verfahren** tragen keine Fristen; Fristen stehen in der Regel, die
  die Aufgabe erzeugt. Ändert sich nur der Text einer Aufgabe, ist das ein reversibles
  Detail (Autor selbst, dokumentiert im PR). Ändert sich Zuständigkeit, Voraussetzung
  oder Unterlagenliste, ist es fachlich kritisch.
- **Ergebnistexte** in `content/i18n/` dürfen nie mehr behaupten als der Zustand der
  Regel. Der Regeltext wird nur bei `matches` angezeigt; alle anderen Zustände
  bekommen den generischen Text. Ein Texttest im Abnahmefall (`forbidden_texts`)
  sichert das.

---

## 4. Protokoll des Probelaufs

Durchgeführt am 14.09.2026 mit einer synthetischen Regel, damit der Weg belegt ist,
bevor eine echte Regel ihn geht. Ergebnis je Schritt:

| Schritt | Ergebnis |
|---|---|
| 1 Anlass | fiktiv: «Beispielgesetz ändert die Frist ab 01.01.2027» |
| 2 Neue Fassung | `content/rules/example-address-report.3.yaml`, gültig ab 2027-01-01, 50 Tage, `supersedes: example-address-report@2`; Fassung 2 mit `superseded_by` und `valid_until: 2026-12-31`, `transitional` gesetzt |
| 3 Lokale Prüfung | Validator grün; neuer Abnahmefall `t14-cutoff-version-3` (Einreise 2027-01-01 → Fassung 3, Frist 2027-02-22); bestehende Stichtagsfälle unverändert grün |
| 4 Pull Request | siehe Link unten |
| 5 CI | grün |
| 6 Technisches Review | formal, Rolle noch nicht benannt |
| 7 Fachfreigabe | nicht möglich, Rolle unbesetzt. Fassung bleibt `in_review`; synthetische Fassungen dürfen nie `approved` werden, der Validator erzwingt das |
| 8 Veröffentlichung | nicht möglich, wie 7. Merge in den Arbeitsbranch als Beleg für die Schritte 2 bis 6 |
| 9 Auslieferung | Build-Test bestätigt: keine synthetische Fassung im Build |

Pull Request: https://github.com/aleks-emotionframe/povratnik.com/pull/3 (CI grün, gemerged in den Arbeitsbranch von M2b-1).

Offen nach dem Probelauf: Rollen benennen (`rollen.md`), Branch-Schutz aktivieren
(auf dem kostenlosen GitHub-Plan für private Repositories nicht verfügbar; Repository
öffentlich stellen oder GitHub Pro, Entscheidung der Betreiberin).

---

## 5. Protokoll der Rücknahme-Probe

Durchgeführt am 14.09.2026 mit der fiktiven Fassung 3 aus Abschnitt 4.

| Schritt | Ergebnis |
|---|---|
| 1 Sperre | `example-address-report.3.yaml`: `publication.state: withdrawn`; Eintrag im Quellenregister `example-source` mit fiktivem Grund |
| 2 Pull Request | Art «Rücknahme», Selbstmerge nach Abschnitt 2 erlaubt; Link unten |
| 3 Wirkung | Abnahmefall `t14-withdrawn-version`: Einreise 2027-01-01 liefert kein Ergebnis, kein Rückfall auf Fassung 2 (deren Fenster endet 2026-12-31). Bundle-Test: Dev-Modus enthält die zurückgezogene Fassung nicht. Build-Test: `dist/` ohne die Fassung |
| 4 Wiederfreigabe | nicht durchgeführt; sie wäre eine neue Fassung 4 nach Abschnitt 1, Schritt 2 bis 8 |

Gemessene Zeit von der Sperre bis zum grünen CI-Lauf: siehe PR. Was in echt
dazukommt: Build und Auslieferung auf den Server, Kontrolle im Browser.

Pull Request: https://github.com/aleks-emotionframe/povratnik.com/pull/5. Von der Sperre bis zum grünen CI-Lauf rund zwei Minuten (CI 36 Sekunden).
