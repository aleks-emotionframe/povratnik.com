# Designsystem

Version 1.2, 13.09.2026. Verbindliche Gestaltungsgrundlage.

`prototyp.html` im Wurzelverzeichnis ist die erste Referenzansicht für Farbe,
Typografie, Raster und Zustandsdarstellung. **Er ist ausdrücklich keine Codebasis.**
Es handelt sich um eine Einzeldatei mit per JavaScript umgeschalteten Ansichten, also
das Gegenteil der Vorgabe aus CLAUDE.md 2.6, wonach Informationsseiten serverseitig
gerendert und ohne JavaScript lesbar sein müssen. Übernommen werden die
Gestaltungsentscheidungen, nicht die Umsetzung.

---

## 1. Haltung

Swiss International Style als Grundlage, ein Element aus datendichter technischer
Gestaltung geborgt. Die Seite muss gleichzeitig einem Ministerium Seriosität und einer
Familie in Buenos Aires Orientierung geben. Beides entsteht aus sichtbarer Struktur und
Nachweisbarkeit, nicht aus Atmosphäre.

Das gestalterische Erkennungsmerkmal ist der Datenstand: Quelle, Prüfdatum und Zustand
sind gestaltete Bestandteile jeder Information, und «unbekannt» ist ein sichtbarer
Zustand statt einer Lücke.

Ausgeschlossen: zentrierter Aufmacher mit Etikett darüber, drei gleichrangige
Feature-Kacheln mit Symbol oben, farbige Akzentränder an Karten, Sonnenuntergangsfotos
mit Segelbooten.

---

## 2. Tokens

| Rolle | Wert |
|---|---|
| Papier | `oklch(99.2% 0.002 25)` |
| Fläche | `oklch(97.2% 0.004 25)` |
| Tinte | `oklch(21% 0.012 240)` |
| Tinte weich | `oklch(43% 0.012 240)` |
| Gedämpft | `oklch(56% 0.010 240)` |
| Linie | `oklch(89% 0.006 25)` |
| Linie stark | `oklch(58% 0.012 25)` |
| Akzent | `oklch(48% 0.152 22)` |
| Zustand offen (Programm) | `oklch(45% 0.105 155)` auf `oklch(96% 0.024 155)` |
| Zustand angekündigt (Programm) | `oklch(45% 0.090 250)` auf `oklch(96% 0.020 250)` |
| Zustand geschlossen (Programm) | `oklch(47% 0.020 240)` auf `oklch(95% 0.004 240)` |
| Zustand unbekannt (Fachwert) | `oklch(50% 0.030 85)` auf `oklch(96% 0.030 85)` |

Alle tatsächlich verwendeten Paarungen erreichen mindestens AA. Linie stark wird als
Rand von Bedienelementen eingesetzt und erreicht 3:1 gegen Papier.

**Typografie:** eine neutrale Groteske für Display und Text, dazu eine dicktengleiche
Schrift für Metadaten, Beträge und Fristen. Keine Webfonts, Systemstack: Die Zielgruppe
sitzt an schwachen Verbindungen. Zeilenlänge im Lauftext höchstens 70 Zeichen.

**Raster:** zwölf Spalten, grosszügiger Weissraum, linksbündig. Struktur entsteht durch
Raster und Abstand, nicht durch Rahmen und Farbe.

**Rhythmus:** Bänder mit wechselnder Dichte statt gleichförmiger Abschnitte. Der
Aufmacher ist asymmetrisch.

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
