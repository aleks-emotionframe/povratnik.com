# Designsystem

Version 2.1, 15.09.2026. Verbindliche Gestaltungsgrundlage. Ersetzt Version 1.2.

Änderung in 2.1: Das provisorische Logo ersetzt die Wortmarke mit Schachbrett
(Abschnitt 2), und der Aufmacher der Startseite trägt das Suchfeld aus dem
Inhaltskonzept, Abschnitt 3.

Änderung in 2.0 (Entscheid der Produktverantwortung vom 14.09.2026): Die Gestaltung
folgt dem Vorbild Schweizer Regionalbanken (akb.ch, valiant.ch, shkb.ch). Massgeblich
sind dort: eine dunkle Markenfarbe mit einer helleren Akzentfarbe derselben Familie,
grosse Fotografie im Aufmacher, eine geometrische Groteske für Titel, weisse Karten
auf hellen Flächen, ein Kopf mit klarer Hauptnavigation und einer hervorgehobenen
Handlung, Schnelleinstiege als Chips, ein Kontaktband vor dem Fuss. Die
Zustandsdarstellung aus Version 1 bleibt unverändert, weil sie der fachliche Kern ist.

`prototyp.html` im Wurzelverzeichnis ist seit Version 2.0 nur noch Referenz für die
Zustandsdarstellung, nicht mehr für Farbe und Typografie. **Er ist keine Codebasis.**

---

## 1. Haltung

Seriös wie eine Bank, verständlich wie ein guter Schalterbeamter. Die Seite muss
gleichzeitig einem Ministerium Seriosität und einer Familie in Buenos Aires
Orientierung geben. Vertrauen entsteht aus sichtbarer Struktur, dokumentarischen
Fotografien von Menschen und Orten und aus Nachweisbarkeit: Quelle, Prüfdatum und
Zustand sind gestaltete Bestandteile jeder Information, und «unbekannt» ist ein
sichtbarer Zustand statt einer Lücke.

Ausgeschlossen bleiben: Etiketten über Titeln, Zahlenstreifen mit Kennzahlen,
farbige Akzentränder an Karten, Sonnenuntergänge mit Segelbooten, erfundene Werte
für reale Orte.

---

## 2. Tokens

| Rolle | Wert |
|---|---|
| Papier | `#fff` |
| Fläche | `oklch(96.5% 0.004 80)` warmes Hellgrau |
| Fläche blau | `oklch(96% 0.015 240)` Karten und Chips auf Markenflächen |
| Marke | `oklch(28% 0.09 262)` Nachtblau: Aufmacher, Fuss, Kontaktband |
| Marke tief | `oklch(22% 0.08 262)` |
| Tinte | `oklch(24% 0.06 262)` Titel und Lauftext |
| Tinte weich | `oklch(40% 0.03 262)` |
| Gedämpft | `oklch(52% 0.02 262)` |
| Linie | `oklch(90% 0.005 262)` |
| Linie stark | `oklch(60% 0.02 262)` |
| Akzent | `oklch(50% 0.16 255)` Blau: Links, primäre Schaltflächen |
| Akzent tief | `oklch(42% 0.15 255)` |
| Akzent hell | `oklch(72% 0.13 230)` Links auf dunklem Grund |
| Zustände | unverändert aus Version 1.2, siehe Abschnitt 4 |

Alle tatsächlich verwendeten Paarungen erreichen mindestens AA.

**Typografie:** Montserrat 600, selbst ausgeliefert als woff2 (Skill webfonts, nur
diese eine Stärke, Zeichensätze latin und latin-ext für kroatische Amtsbegriffe), für
Titel, Navigation und Schaltflächen. Lauftext im Systemstack (Segoe UI, Roboto,
Helvetica), damit die Startressourcen im Budget bleiben. Metadaten, Beträge und Fristen
dicktengleich im Systemstack. Zeilenlänge im Lauftext höchstens 70 Zeichen.

**Logo:** provisorisch die Datei `apps/web/src/assets/povratnik-logo.webp` (blaue
Bildmarke mit Haus im P, Schriftzug in Schwarz, Alpha-Kanal). Im Kopf 34 Pixel hoch
auf Papier, im Fuss 30 Pixel hoch und per CSS-Filter vollständig weiss; es gibt nur
diese eine Datei. Der Schriftzug sagt derzeit «.CH», die Website läuft unter
povratnik.com; die endgültige Fassung ist eine Entscheidung der Produktverantwortung.
Rot kommt nirgends mehr vor.

**Raster:** zwölf Spalten, Breite bis 1320 Pixel, linksbündig. Karten weiss mit
8 Pixel Radius auf hellen Flächen, ohne Schatten, mit dünner Linie. Schaltflächen mit
6 Pixel Radius, gefüllt in Akzent, auf dunklem Grund weiss.

**Rhythmus:** Bänder wechseln zwischen Papier, Fläche und Marke. Der Aufmacher ist
zweigeteilt: Markenfläche mit Titel links, Fotografie rechts, auf schmalen Geräten
untereinander. Auf der Startseite steht unter dem Titel ein Suchfeld; es führt zur
Suchseite, ohne den Suchbegriff in die Adresse oder an den Server zu schreiben.

**Fotografie:** dokumentarisch wirkende Bilder von Menschen und Orten, natürliches
Licht, gedeckte Farben, kein Stock-Lächeln. Jedes Bild als WebP in mehreren Breiten,
mit fester Breite und Höhe, das Aufmacherbild vorgeladen.

---

## 3. Seitentypen

Jeder Typ hat eine festgelegte Struktur:

1. **Startseite** Nutzenversprechen und Ortssuche, drei Wege, Abhängigkeitskette,
   laufende Fristen, Zustandserklärung, Erfahrungsberichte, Einstiege nach
   Lebenssituation
2. **Rubrikseite** Einstieg, typische Fragen, Themenliste mit Tiefenkennzeichnung
3. **Themenseite** die feste Maske aus dem Inhaltskonzept, Abschnitt 4.2
4. **Verfahrensseite** Voraussetzungen, Ablauf, Unterlagen, Fristen, Stelle
5. **Ortsprofil** die Abschnitte aus dem Inhaltskonzept, Abschnitt 5.1
6. **Vergleich** Rohinformation nebeneinander, ohne Gesamtnote
7. **Leistungsdatenbank** filterbare Liste mit denselben Feldern
8. **Frageansicht** eine Hauptfrage je Ansicht, Haushaltsleiste, Erklärung wozu
9. **Abschlussplan** Ausgangslage, Weg, nächste Schritte, Fahrplan, Offenes, Kontakte

---

## 4. Zustände in der Oberfläche

Das wichtigste gestalterische Prinzip. Immer unterscheidbar, immer mit Text, nie nur
mit Farbe. Die Vokabulare sind in `datenmodell.md` Abschnitt 1.1 definiert: Vokabular B
beschreibt ein Programm, Vokabular A einen einzelnen Fachwert.

| Vokabular | Zustand | Darstellung |
|---|---|---|
| B Programm | offen | grüne Marke mit Wortlaut «offen» |
| B Programm | angekündigt | blaue Marke mit Wortlaut «angekündigt» |
| B Programm | geschlossen | graue Marke mit Wortlaut «geschlossen» |
| B Programm | ausgeschöpft | graue Marke mit Wortlaut «ausgeschöpft» |
| B Programm | unbestätigt | gelbe Marke mit Wortlaut «unbestätigt» |
| B Programm | Budget unbekannt | gelbe Marke mit Wortlaut «Budget unbekannt» |
| A Fachwert | unbekannt | eigener Textstil mit Kreissymbol, nie leere Zelle |
| A Fachwert | nicht erhoben | wie unbekannt, mit Zusatz «so lässt es sich klären» |
| A Fachwert | veraltet | Wert sichtbar, mit Stand und Hinweis, dass die aktuelle Höhe ungeklärt ist |

Ein Ort mit geringer Datentiefe darf nie wie ein Ort ohne Angebote aussehen. Die
Datentiefe wird als eigener Balken angezeigt.

**Datenstand-Zeile** unter jeder Fachinformation: Quelle, Prüfdatum, Antragszeitraum,
dicktengleich gesetzt, an immer derselben Position.

---

## 5. Formulare und Fragen

Eine Hauptfrage je Ansicht, darunter eine kurze Erklärung, wozu die Angabe gebraucht
wird. Fachbegriffe werden in Alltagssprache erläutert und nicht vorausgesetzt: Wer
nicht weiss, was ein reglementierter Beruf ist, muss es an Ort und Stelle erfahren.

«Weiss ich nicht» ist eine sichtbare, gleichwertige Antwortoption und nie ein
Ausschluss. Die Haushaltsleiste zeigt jederzeit, für welche Person die aktuelle Frage
gilt. Gemeinsame Angaben lassen sich ausdrücklich übernehmen, nie stillschweigend.

Fortschritt ist sichtbar. Nach dem Einstieg entsteht sofort ein brauchbares
Zwischenergebnis. Weitere Fragen werden mit dem Nutzen begründet, den sie
freischalten, etwa: «Ob dieses Programm für Sie infrage kommt, klären zwölf weitere
Fragen.»

Jedes Ergebnis trägt eine Erklärung «Warum wird mir das angezeigt?», die die
verwendeten Angaben und die Quelle nennt.

---

## 6. Mobil

Mobil zuerst. Karte und Liste sind auf schmalen Geräten umschaltbar, die Liste ist
vollwertig. Filter erscheinen in einer eigenen Fläche. Berührungsziele mindestens 44
Pixel bei primären Aktionen. Kritische Fristen bleiben immer sichtbar und werden nie
eingeklappt.
