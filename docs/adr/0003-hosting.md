# ADR-0003: Hosting für Website, Node-Dienste und Datenbank

Status: **entschieden am 14.09.2026, Option A.** Vorgelegt von der technischen
Verantwortung, Entscheidung durch die Produktverantwortung an sie delegiert, mit dem
Auftrag, bei Unsicherheit die Optionen vorzulegen. Betrifft CLAUDE.md Abschnitt 8 (Hosting EU, Node-fähig, Entscheidung in M2),
`betrieb.md` Abschnitt 1 und 4, ADR-0001, ADR-0002.

---

## Kontext

Die Website ist statisch erzeugt (Astro), der Wizard läuft im Browser. Was der
Betrieb heute braucht, ist ein Ort, der statische Dateien ausliefert. Was er ab M2b-2
braucht: einen Node-Prozess für serverseitig gerenderte Seiten (Suche, Ortsprofile)
und PostgreSQL mit PostGIS für Orte, Geometrie und Leistungen (ADR-0001). Ab M3 kommt
die Redaktionsoberfläche mit Anmeldung dazu.

Anforderungen, nicht verhandelbar:

1. Standort und Vertragspartner in der EU (CLAUDE.md 8). Ein US-Anbieter mit
   EU-Rechenzentrum erfüllt das nicht.
2. Statische Auslieferung heute, Node und PostgreSQL mit PostGIS ohne Anbieterwechsel
   später.
3. Sicherung und **erprobte** Wiederherstellung vor dem ersten Pilot (`betrieb.md` 1).
4. Zugriff nur per Schlüssel, getrennte Zugänge für technische Verantwortung und
   Vertretung.
5. Kosten, die ein Zweierteam ohne Förderung trägt.

Nicht entscheidend heute: Skalierung. Die Zielgruppe ist klein, die Seiten sind
leicht (Budget 150 KB je Informationsseite).

## Optionen

Preise werden hier bewusst nicht als Zahlen festgeschrieben: Die Anbieterseiten nennen
sie nur in Detailansichten, und sie ändern sich. Grössenordnung nach Drittquellen vom
14.09.2026 (siehe unten): Option A im einstelligen bis niedrigen zweistelligen
Eurobereich pro Monat, Option B und C mit Managed-Datenbank im mittleren zweistelligen
Bereich. **Vor Vertragsabschluss auf der Anbieterseite prüfen.**

**A: Hetzner Cloud (Deutschland oder Finnland), alles selbst betrieben.**
Ein kleiner Cloud-Server, darauf Caddy oder nginx für die statische Site, ein
Node-Prozess als Systemdienst, PostgreSQL mit PostGIS aus den Distributionspaketen.
Sicherung per täglichem `pg_dump` und Dateiabgleich auf eine Storage Box, zusätzlich
die Server-Snapshots des Anbieters. Standorte Falkenstein, Nürnberg, Helsinki.

- erfüllt 1 bis 5; günstigste Option
- Betrieb liegt vollständig bei der technischen Verantwortung: Updates, Sicherung,
  Wiederherstellung, Härtung. Das ist Arbeitszeit, keine Rechnung.
- Ein Ausfall betrifft alles zugleich; für den Pilot vertretbar.

**B: Scaleway (Paris, Amsterdam, Warschau), Managed PostgreSQL.**
Statische Site und Node als Serverless Container oder auf einer kleinen Instance,
Datenbank als Managed Database for PostgreSQL mit PostGIS als verfügbarer Erweiterung,
automatische Sicherungen und Snapshots eingeschlossen (Anbieterseite, 14.09.2026).

- erfüllt 1 bis 5; Sicherung der Datenbank ist Anbieterleistung, die Wiederherstellung
  muss trotzdem einmal geprobt werden
- höhere Fixkosten, die schon vor M2b-2 anfallen, wenn die Datenbank früh angelegt wird
- weniger Betriebsarbeit; bei Managed-Datenbank kein Root-Zugriff, was für Erweiterungen
  reicht, solange PostGIS dabei ist

**C: OVHcloud (Frankreich, Deutschland), VPS plus Public Cloud Database.**
Mittelweg: VPS für Site und Node, Datenbank als Managed-Dienst. Angebot und
Konsolen sind umfangreicher als nötig; für ein Zweierteam mehr Einarbeitung als A,
ohne den Einfachheitsvorteil von B.

**Ausgeschlossen mit Begründung.** GitHub Pages, Vercel, Netlify, Cloudflare Pages:
US-Vertragspartner, Anforderung 1 nicht erfüllt, auch wenn die Auslieferung aus der EU
erfolgt. Infomaniak (Schweiz): fachlich passend, aber CLAUDE.md 8 sagt EU; die
Produktverantwortung müsste die Vorgabe auf «EU oder Schweiz» erweitern, bevor diese
Option zählt.

## Entscheidung

Option A für den Pilot. Begründung: Die Last ist klein, das Team kann einen Server
betreiben, und die Sicherung wird ohnehin selbst erprobt, weil `betrieb.md` 1 eine
durchgeführte Wiederherstellung verlangt, nicht eine konfigurierte. Die Kosten bleiben
im Bereich, den das Projekt ohne Förderung trägt.

Wechselpunkt: Sobald die Redaktion (M3) schreibend auf die Datenbank zugreift und
mehrere Personen davon abhängen, wird die Datenbank zu einem Managed-Angebot (B oder
C) verschoben. Der Rest bleibt. Das ist ein Umzug einer Datenbank, kein Umbau.

## Konsequenzen

Was die Empfehlung teuer macht, ausdrücklich:

- Betriebszeit der technischen Verantwortung für Updates, Sicherung, Wiederherstellung
  und Härtung. Benannte Verantwortung und Vertretung nach `betrieb.md` 1 sind
  Voraussetzung, nicht Folge.
- Ein einzelner Server ist ein einzelner Ausfallpunkt. Vor dem ersten öffentlichen
  Pilot muss die Wiederherstellung auf einem frischen Server aus der Sicherung
  tatsächlich durchgeführt und protokolliert sein.
- Keine Anbieter-Sicherung für die Datenbank; `pg_dump` und Storage Box sind selbst
  einzurichten und zu überwachen.

Was sie spart: laufende Kosten, Abhängigkeit von Anbieter-Konsolen, Einarbeitung.

Nach der Entscheidung zu erledigen: Datenschutzseite ergänzen (Anbieter, Standort,
Protokolle), Server-Protokollierung nach `betrieb.md` 4 minimal halten,
Zugriffsschlüssel und Vertretung eintragen, Wiederherstellung proben und in
`betrieb.md` protokollieren.

Prüfpunkt: nach M2b-2, mit den ersten echten Betriebsstunden, Kosten und Aufwand
erneut vorlegen.

## Quellen, Stand 14.09.2026

- Hetzner Cloud, Standorte: https://www.hetzner.com/cloud/
- Scaleway Managed Database for PostgreSQL, PostGIS, Regionen, Sicherung:
  https://www.scaleway.com/en/database/
- Grössenordnung der Preise (Drittquellen, nicht verbindlich):
  https://hoststack.dev/blog/managed-postgresql-europe-buyers-guide und
  https://sliplane.io/blog/5-cheap-ways-to-host-postgres
