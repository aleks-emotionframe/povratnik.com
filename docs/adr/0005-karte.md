# ADR-0005: Karte ohne Fremdserver

Status: **entschieden am 14.09.2026 durch die Produktverantwortung** (Auftrag «Sprache,
dann Karten»). Betrifft `inhaltskonzept.md` Abschnitt 5, `betrieb.md` Abschnitt 2
(Budget Karte 600 KB) und die Datenschutzerklärung («keine Verbindung zu Dritten»).

---

## Kontext

Die Datenschutzerklärung sagt zu, dass beim Aufruf einer Seite keine Verbindung zu
Dritten entsteht. Gängige Karten laden Kacheln von einem Kartenserver (OpenStreetMap,
Mapbox, Google), womit die IP-Adresse jedes Besuchers dorthin geht. Ein eigener
Kachelserver wäre ein zusätzlicher Betriebsdienst mit Speicher- und Pflegeaufwand,
den das Projekt vor M5 nicht trägt.

Die Karte hat in diesem Produkt eine Übersichtsfunktion: Orte im Raum finden, nach
Region eingrenzen, zum Ortsprofil springen. Strassenkarten-Detail ist nicht nötig; die
Liste ist ohnehin die vollwertige Ansicht (inhaltskonzept.md 6, Mobil).

## Optionen

1. **Kartenserver eines Anbieters.** Verworfen: Fremdverbindung, widerspricht der
   Datenschutzerklärung und dem Grundsatz «Inhalt vor Interaktion».
2. **Eigener Kachelserver.** Verworfen für jetzt: Betriebsaufwand vor M5 nicht
   gerechtfertigt; bleibt Option, wenn Detailkarten je Ort gebraucht werden.
3. **Eigenes SVG aus gemeinfreien Grenzdaten.** Gewählt: Gespanschaften aus Natural
   Earth 10m Admin-1 (gemeinfrei), vereinfacht und projiziert, rund 20 KB, inline im
   HTML, ohne JavaScript lesbar, Orte als Punkte aus Länge und Breite.

## Entscheidung

`scripts/map-croatia.mjs` erzeugt aus dem Natural-Earth-Datensatz die Datei
`apps/web/src/data/hr-counties.json` (21 Gespanschaften, Projektion mit
Breitengradkorrektur). Die Komponente `MapHr.astro` rendert sie als SVG; Orte werden
aus Länge und Breite in denselben Raum projiziert. Die Karte lädt keine Ressource von
einem anderen Host. Die Liste bleibt die vollwertige Ansicht; auf schmalen Geräten
ist die Karte einklappbar, kritische Angaben stehen nie nur in der Karte.

Natural Earth führt Požeško-slavonska fälschlich als zweites Brodsko-posavska; das
Skript korrigiert das über die Lage und benennt alle Gespanschaften amtlich.

## Konsequenzen

- Auf der Teststufe sind die eingezeichneten Orte fiktiv und entsprechend
  beschriftet; ihre Lage dient nur der Darstellung.
- Detailkarten je Ort (Schulen, Ärzte, Wege) sind nicht Teil dieser Entscheidung und
  brauchen bei Bedarf einen eigenen Entscheid (Option 2).
- Regionenseiten je Gespanschaft (inhaltskonzept.md 5.4) bekommen dieselbe Karte mit
  hervorgehobener Gespanschaft.
