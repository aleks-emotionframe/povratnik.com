# ADR-0003: Hosting für Website, Node-Dienste und Datenbank

Status: **entschieden am 14.09.2026 durch die Produktverantwortung.** Ersetzt die
erste Fassung vom selben Tag, die Hetzner empfahl, ohne das bestehende
Hostpoint-Konto zu kennen. Betrifft CLAUDE.md Abschnitt 8 (seit 2.2: «EU oder
Schweiz»), `betrieb.md` Abschnitt 1, 4 und 7, ADR-0001, ADR-0002.

---

## Kontext

Die Website ist statisch erzeugt (Astro), der Wizard läuft im Browser. Was der
Betrieb heute braucht, ist ein Ort, der statische Dateien ausliefert. Was er ab M2b-2
braucht: einen Node-Prozess für serverseitig gerenderte Seiten (Suche, Ortsprofile)
und PostgreSQL mit PostGIS für Orte, Geometrie und Leistungen (ADR-0001). Ab M3 kommt
die Redaktionsoberfläche mit Anmeldung dazu.

Die Betreiberin hat ein bestehendes Webhosting-Konto bei Hostpoint (Schweiz). Die
erste Fassung dieses ADR kannte es nicht und schloss Schweizer Anbieter wegen der
damaligen Vorgabe «Hosting in der EU» aus. Die Produktverantwortung hat die Vorgabe
auf «EU oder Schweiz» erweitert: Die Schweiz hat einen Angemessenheitsbeschluss der
EU, das DSG gilt, und Schweizer Nutzer sind eine benannte Zielgruppe.

Anforderungen, nicht verhandelbar:

1. Standort und Vertragspartner in der EU oder der Schweiz.
2. Statische Auslieferung heute; Node und PostgreSQL mit PostGIS, sobald das
   Ortsprofil sie braucht.
3. Sicherung und **erprobte** Wiederherstellung vor dem ersten Pilot (`betrieb.md` 1).
4. Zugriff nur per Schlüssel, getrennte Zugänge für technische Verantwortung und
   Vertretung.
5. Kosten, die ein Zweierteam ohne Förderung trägt.

## Was Hostpoint kann und was nicht

Geprüft am 14.09.2026 auf https://www.hostpoint.ch/en/webhosting/webhosting.html:

- Webhosting-Tarife (Standard, Smart, Business): SSH und SFTP in allen Tarifen,
  Datenbanken ausschliesslich MariaDB, kein PostgreSQL, kein Node.js. Server in
  Glattbrugg ZH.
- Node.js nur auf dem Managed Flex Server; PostgreSQL wird auch dort nicht genannt.

Für die heutige Website reicht jeder Webhosting-Tarif. Für Ortsprofil und Suche
(PostgreSQL mit PostGIS nach ADR-0001) reicht Hostpoint nicht.

## Optionen für die spätere Datenbank

Erst zu entscheiden, wenn Datenlizenz und Ortsdaten vorliegen (M2b-2). Zur Auswahl:

**A: Kleiner Cloud-Server bei Hetzner (Deutschland oder Finnland)** für PostgreSQL
mit PostGIS und den Node-Dienst, statische Site bleibt auf Hostpoint. Günstig,
Betrieb (Updates, Sicherung, Wiederherstellung) bei der technischen Verantwortung.

**B: Managed PostgreSQL bei Scaleway (Paris, Amsterdam, Warschau)**, PostGIS als
Erweiterung verfügbar, Sicherung eingeschlossen. Weniger Betrieb, höhere Fixkosten.

**C: Datenbankwahl in ADR-0001 überdenken** (MariaDB mit räumlichen Funktionen auf
Hostpoint). Nur, wenn A und B ausfallen; räumliche Abfragen und mehrsprachige
Volltextsuche sind in PostgreSQL deutlich besser abgedeckt.

Ausgeschlossen: US-Plattformen (GitHub Pages, Vercel, Netlify, Cloudflare Pages) als
Vertragspartner, Anforderung 1.

## Entscheidung

1. **Statische Website auf dem bestehenden Hostpoint-Konto.** Keine Zusatzkosten.
   Auslieferung des Build-Ergebnisses `apps/web/dist` per SFTP oder `rsync` über
   SSH aus der CI, Details in `betrieb.md` 7.
2. **Datenbank- und Node-Hosting wird in M2b-2 entschieden**, wenn das Ortsprofil sie
   tatsächlich braucht. Bis dahin entstehen keine Kosten. Empfehlung dann: Option A,
   solange nur die technische Verantwortung auf die Datenbank zugreift; Option B ab M3.

## Konsequenzen

- Zwei Anbieter, sobald die Datenbank kommt: Site in der Schweiz, Datenbank in der
  EU. Das ist zulässig und muss auf der Datenschutzseite je Bereich stehen.
- Sicherung der statischen Site ist trivial (das Repository ist die Quelle, der Build
  ist reproduzierbar). Die Sicherungspflicht nach `betrieb.md` 1 betrifft heute nur
  das Repository und später die Datenbank.
- Hostpoint-Zugang und Vertretung nach `betrieb.md` 1 eintragen; SSH-Schlüssel statt
  Passwort, soweit der Tarif das zulässt.
- Kein Node auf Hostpoint: serverseitig gerenderte Seiten (Suche, Ortsprofile) laufen
  später auf dem Datenbank-Server, nicht auf Hostpoint. Die statischen Seiten bleiben,
  wo sie sind.

Prüfpunkt: bei M2b-2, wenn die Datenbank ansteht.

## Quellen, Stand 14.09.2026

- Hostpoint Webhosting: https://www.hostpoint.ch/en/webhosting/webhosting.html
- Hetzner Cloud, Standorte: https://www.hetzner.com/cloud/
- Scaleway Managed Database for PostgreSQL, PostGIS, Regionen, Sicherung:
  https://www.scaleway.com/en/database/
