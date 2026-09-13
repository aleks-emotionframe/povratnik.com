# Inhaltskonzept

## Leben in Kroatien: Was konkret auf die Website kommt

Ausarbeitung zu Kapitel 9 des Strategiekonzepts. Version 1.1, Stand 13.09.2026.
Dieses Dokument beschreibt die Inhalte, nicht die Gestaltung. Wie die Karte im Detail
aussieht, welche Geodaten verwendet werden und wie die Filter visuell aufgebaut sind,
wird separat definiert.

---

## 0. Das Grundprinzip

Ein Fakt wird einmal gepflegt und erscheint in mehreren Ansichten. Die Antragsfrist
für eine Gemeindeförderung steht nicht dreimal im System, sondern einmal, und taucht
im Ortsprofil, in der Leistungsübersicht und in der persönlichen Checkliste auf. Wenn
sich die Frist ändert, ändert sie sich überall.

Daraus folgt die Gliederung der Website. Die drei Bereiche sind keine drei getrennten
Inhaltsbestände, sondern drei Zugänge zum selben Bestand:

| Bereich | Die Frage des Nutzers | Der Zugang |
|---|---|---|
| Wissen | Was gilt für mich? | nach Thema |
| Orte | Wo passt mein Alltag? | nach Raum |
| Mein Umzug | Was mache ich als Nächstes? | nach Zeit und Reihenfolge |

Alles Weitere, also Blog, Anlaufstellen, Partner, Zahlen, stützt diese drei Zugänge.
Nichts steht für sich allein.

---

## 1. Der Prozess, den wir zeigen

Das ist die inhaltliche Kernleistung. Behördenseiten erklären jeweils ihren eigenen
Ausschnitt. Niemand erklärt, in welcher Reihenfolge die Ausschnitte zusammengehören
und was wovon abhängt. Genau das nehmen wir dem Leser ab.

### 1.1 Die Abhängigkeitskette

Der rote Faden der ganzen Website ist eine einzige Erkenntnis: Fast alles hängt an
vier Schlüsseln, und zwar in dieser Reihenfolge.

```
        STATUS                 OIB               ANMELDUNG            VERSICHERUNG
   Wer bin ich rechtlich?  Steuernummer      Wohnsitz gemeldet      Krankenversicherung
           │                     │                   │                      │
           ▼                     ▼                   ▼                      ▼
   entscheidet über:      ermöglicht:         löst aus:              ermöglicht:
   Aufenthaltsweg         Bankkonto           Fristen                Arztbesuch
   Arbeitszugang          Mietvertrag         Steuerbefreiung        Schuleinschreibung
   Förderfähigkeit        jeden Antrag        Förderansprüche        Betreuungsplatz
   Schulzugang            Arbeitsvertrag      Wahlrecht              Medikamente
```

Vor dem Status ist nichts entscheidbar. Ohne OIB ist fast nichts beantragbar. Die
Anmeldung ist bei mehreren Förderungen das massgebende Datum, nicht die Ankunft. Die
Versicherung hat eine Lücke, wenn sie nicht vorher geplant wurde.

Diese Kette wird auf der Startseite als Grafik gezeigt, in jeder Themenrubrik als
Verortung wiederholt («Sie sind hier: Schritt 2 von 4») und ist die Struktur des
persönlichen Fahrplans.

### 1.2 Die fünf Phasen

Quer über alle Themen gliedert sich der Weg in fünf Phasen. Sie sind die oberste
Ebene jeder Checkliste.

| Phase | Zeitfenster | Was hier entschieden wird |
|---|---|---|
| Orientieren | 12 bis 6 Monate vorher | Ist es machbar? Welcher Statusweg? Welcher Ort? Reicht das Geld? |
| Vorbereiten | 9 bis 2 Monate vorher | Dokumente, Aufenthalt, Versicherung, Schule, Wohnung, Herkunftsland |
| Umziehen | 4 Wochen vorher bis Ankunft | Transport, Übergangsdeckung, Anreise, erste Termine |
| Ankommen | erste 8 Wochen | Anmeldung, Versicherung, Arbeit, Schule, Alltag |
| Bleiben | Monat 3 bis 24 | Verlängerungen, Förderpflichten, Sprache, Anschluss |

Die fünfte Phase ist die, die alle anderen Anbieter weglassen. Sie ist inhaltlich die
wichtigste, weil dort die Rückkehr scheitert, nicht bei der Anmeldung.

### 1.3 Was parallel geht und was nicht

Eine reine lineare Liste wäre falsch. Die Website macht deshalb sichtbar:

- **Parallel möglich:** Dokumente beschaffen, Orte vergleichen, Schule anfragen,
  Sprache lernen, Wohnungssuche.
- **Zwingend nacheinander:** Status klären, dann Aufenthalt, dann Arbeit, dann
  Versicherung. Original, dann Apostille, dann Übersetzung.
- **Reihenfolgefalle:** Manche Förderungen verlangen die Antragstellung vor der
  Gründung oder innerhalb weniger Tage nach der Anmeldung. Wer zuerst handelt und
  dann beantragt, verliert den Anspruch. Diese Fälle bekommen eine eigene
  Warnkennzeichnung im gesamten Bestand.

---

## 2. Die Sitemap

```
STARTSEITE
│
├── WISSEN
│   ├── Übersicht: 12 Rubriken
│   ├── Rubrikseite (12x)
│   ├── Themenseite (ca. 20 in voller Tiefe, ca. 60 als Kurzfassung)
│   ├── Nach Herkunftsland (Länderseiten)
│   ├── Nach Lebenssituation (Einstiege: Familie, Rentner, Gründer, Student, allein)
│   └── Glossar
│
├── ORTE ENTDECKEN
│   ├── Karte und Liste mit Filtern
│   ├── Ortsprofil
│   ├── Regionenseite (21 Gespanschaften)
│   ├── Leistungsdatenbank (alle Förderungen, filterbar, ohne Kartenumweg)
│   └── Ortsvergleich
│
├── MEIN UMZUG
│   ├── Fragenpfad
│   ├── Persönlicher Fahrplan mit Checklisten
│   ├── Dokumentenliste nach Herkunftsland
│   ├── Kostenrechner
│   └── Export als PDF
│
├── ERFAHRUNGEN UND AKTUELLES
│   ├── Rückkehrgeschichten
│   ├── Praxisleitfäden
│   ├── Was sich geändert hat (Änderungsmeldungen)
│   └── Fragen aus der Community
│
├── ANLAUFSTELLEN
│   ├── Behördenverzeichnis Kroatien
│   ├── Konsulate und Vertretungen weltweit
│   ├── Kommunale Willkommensstellen
│   └── Vereine und Diaspora-Netzwerke
│
├── FACHPARTNER
│   ├── Verzeichnis nach Fachgebiet und Sprache
│   └── Partnerprofil
│
├── ZAHLEN UND FAKTEN
│   ├── Rückkehr und Zuwanderung in Zahlen
│   ├── Löhne, Kosten, Wohnen
│   └── Rückkehrerbericht (halbjährlich)
│
└── ÜBER UNS
    ├── Auftrag und Unabhängigkeit
    ├── Redaktionsgrundsätze und Quellenhierarchie
    ├── Fehler melden
    ├── Gemeinde eintragen
    ├── Kontakt
    └── Impressum, Datenschutz, Barrierefreiheit
```

---

## 3. Die Startseite

Die Startseite hat eine Aufgabe: den Besucher innerhalb von zehn Sekunden auf einen
der drei Wege bringen, ohne ihn vorher zu einer Statusentscheidung zu zwingen.

Inhalte von oben nach unten:

1. **Nutzenversprechen und Ortssuche.** Ein Satz, ein Suchfeld. Kein Werbetext.
2. **Die drei Wege** als gleichwertige, aber unterschiedlich gewichtete Einstiege.
3. **Die Abhängigkeitskette** als Grafik mit vier Schlüsseln. Das ist der
   Aha-Moment und der Grund, warum jemand bleibt.
4. **Was gerade läuft.** Offene Fristen und aktuelle Massnahmen, national und
   kommunal, mit Zustand und Prüfdatum. Dieser Block ist der Grund für
   Wiederbesuche.
5. **Warum Beträge allein nichts sagen.** Kurze Erklärung der Zustände und der vier
   Zeitangaben. Das ist unsere Glaubwürdigkeitserklärung in drei Sätzen.
6. **Zwei bis drei Erfahrungsberichte** als menschlicher Anker.
7. **Einstiege nach Lebenssituation** für alle, die weder Thema noch Ort im Kopf
   haben: «Ich komme mit Familie», «Ich möchte gründen», «Ich bin Rentner», «Ich
   habe keinen kroatischen Pass».

---

## 4. Bereich 1: Wissen

### 4.1 Die zwölf Rubriken und was darin steht

| Nr | Rubrik | Themen, die enthalten sein müssen |
|---|---|---|
| 01 | Status und Staatsangehörigkeit | Abstammung, Einbürgerung über Auswandererregelung, Aufenthalt für Auswanderer, EU-Freizügigkeit, Arbeitsaufenthalt für Drittstaaten, digitaler Nomade, Familiennachzug, Verlängerung, doppelte Staatsbürgerschaft |
| 02 | Dokumente und Behörden | OIB, Personenstandsurkunden, Abstammungskette über Generationen, Apostille, beglaubigte Übersetzung, Namensabweichungen und Schreibweisen, Matrikel- und Pfarrbücher, Domovnica, Personalausweis, e-Bürger-Zugang |
| 03 | Das bisherige Wohnland verlassen | Abmeldung, Steuerabschluss, Versicherungsende, Kündigung von Verträgen, Rentenunterlagen sichern, Schulzeugnisse anfordern, Bankkonto, Vollmachten |
| 04 | Arbeit und Qualifikation | Arbeitsmarkt, Stellensuche, Arbeitsvertrag verstehen, brutto und netto, Anerkennung akademischer Abschlüsse, reglementierte Berufe, Arbeitsrechte, Arbeitssuche des Partners, Sprache im Beruf |
| 05 | Gründen und selbständig arbeiten | Rechtsformen im Vergleich, Pauschalgewerbe, Buchhaltungspflichten, Beiträge, Genehmigungen, Reihenfolge gegenüber Förderungen, elektronische Rechnung, laufende Pflichten |
| 06 | Steuern, Geld und Pension | Steuerliche Ansässigkeit, Doppelbesteuerung, fünfjährige Lohnsteuerbefreiung, Auslandseinkünfte, Auslandsrenten, Rentenanrechnung, Sozialversicherungsabkommen, Bankkonto, Geldtransfer |
| 07 | Gesundheit und Pflege | Versicherungsbeginn je Grundlage, Übergangsdeckung, Zusatzversicherung, Hausarzt und Kinderarzt finden, Medikamente, Schwangerschaft, chronische Erkrankung, Pflege, Barrierefreiheit |
| 08 | Kinder, Schule und Ausbildung | Kindergarten, Einschreibung, Schulbezirk, Zeugnisanerkennung, Sprachförderung, besonderer Förderbedarf, Kosten, Berufsausbildung, Studium, Stipendien |
| 09 | Wohnen und Regionen | Dauerhafte Miete, saisonale Verfügbarkeit, Kaution, Nebenkosten, Kaufprüfung, Kauf durch Ausländer, Grundbuch, geerbtes Familienland, ungeklärte Miteigentümer, Legalisierung, Bau, kommunaler Wohnraum |
| 10 | Sprache und Gemeinschaft | Kurse online und vor Ort, Stipendien, Sprachniveaus, Alltagssprache, Vereine, Kirche, Sport, Mentoring, Anschluss für Partner und Kinder |
| 11 | Umzug und Mobilität | Hausrat, Zoll und Übersiedlungsgut, Fahrzeugeinfuhr, Führerscheinumschreibung, Haustiere, Transportunternehmen, Anreise, Strom, Wasser, Internet, Telefon |
| 12 | Leistungen und Förderung | Staatliche, regionale und kommunale Leistungen, Familie, Wohnen, Bildung, Mobilität, Gründung, Anspruch, Nachweise, Kumulation, Bindungen, Rückzahlungspflichten |

Zwei Tiefenstufen: Etwa zwanzig Themen werden vollständig ausgearbeitet, das sind
die, an denen Menschen tatsächlich scheitern oder an denen Geld hängt. Der Rest
bekommt eine geprüfte Kurzfassung mit Einstieg, Zuständigkeit und Direktlink. Beide
Stufen sind für den Leser erkennbar gekennzeichnet.

### 4.2 Die feste Maske jeder Themenseite

Jede Themenseite ist gleich aufgebaut. Das ist der eigentliche Produktvorteil: Nach
der zweiten Seite weiss der Leser, wo er suchen muss.

```
┌─────────────────────────────────────────────────────────┐
│ KURZE ANTWORT            in zwei bis drei Sätzen         │
│ GILT FÜR                 Zielgruppe, ausdrücklich        │
│ GILT NICHT FÜR           die häufigste Verwechslung      │
│ ZUSTÄNDIG                Behörde oder Stelle             │
│ STAND                    Prüfdatum, Quelle, Zustand      │
├─────────────────────────────────────────────────────────┤
│ VORAUSSETZUNGEN          als Liste, jede prüfbar         │
│ ABLAUF                   nummerierte Schritte            │
│ UNTERLAGEN               was mitzubringen ist            │
│ DAUER UND KOSTEN         soweit belegt, sonst unbekannt  │
│ FRISTEN                  Art der Frist, Auslöser         │
├─────────────────────────────────────────────────────────┤
│ HÄUFIGER IRRTUM          der Fehler, den viele machen    │
│ WAS HIER NICHT           was eine Fachperson entscheidet │
│   ENTSCHIEDEN WIRD                                       │
│ VORHER NÖTIG             Verweis auf abhängige Themen    │
│ DANACH FOLGT             was als Nächstes ansteht        │
│ PASSENDE ORTE            Verknüpfung in die Karte        │
│ ANSPRECHSTELLEN          Behörde, Konsulat, Fachpartner  │
│ ORIGINALQUELLE           Link, Datum, Herausgeber        │
│ FEHLER MELDEN            immer an derselben Stelle       │
└─────────────────────────────────────────────────────────┘
```

Zwei Felder aus dieser Maske gibt es sonst nirgends, und sie sind der Grund, warum
die Seite eine Last abnimmt: «Häufiger Irrtum» und «Was hier nicht entschieden wird».
Das erste verhindert Fehler, das zweite verhindert falsches Vertrauen.

### 4.3 Zwei zusätzliche Zugänge zum selben Wissen

**Nach Herkunftsland.** Der kroatische Prozess und die Ausreiseanforderungen aus
Argentinien sind zwei verschiedene Dinge und werden getrennt dargestellt. Jede
Länderseite enthält: die zuständige Vertretung, die Dokumentenkette mit
Apostillestelle, die Besonderheiten bei Sozialversicherung und Doppelbesteuerung, die
Abmeldepflichten, realistische Laufzeiten und den Kennzeichnungsgrad («vollständig
geprüft», «Grundlagen vorhanden», «noch im Aufbau»).

**Nach Lebenssituation.** Dieselben Themen, kuratiert als Pfad: Familie mit
schulpflichtigen Kindern, Alleinstehende, Paare ohne Kinder, Rentner, Gründer,
Studierende, Menschen mit Pflegebedarf, Alleinerziehende. Kein neuer Inhalt, eine
andere Reihenfolge.

---

## 5. Bereich 2: Orte entdecken

### 5.1 Was in einem Ortsprofil steht

| Abschnitt | Inhalt | Prüfregel |
|---|---|---|
| Überblick | Gemeinde, Gespanschaft, Lage, Einwohner, Entwicklungsindex, Kurzbeschreibung des Alltags | keine unbelegten Superlative |
| Leistungen der Gemeinde | jede Massnahme mit Zielgruppe, Betrag oder Berechnungsart, Bedingungen, Frist, Budgetstatus, Originalausschreibung | vier Zeitangaben, ein Zustand |
| Familie und Bildung | Kindergarten, Grundschule, weiterführende Schule, Sprachförderung, Kosten | Kapazität getrennt und nur mit aktuellem Nachweis |
| Gesundheit | Hausarzt, Kinderarzt, Apotheke, nächste Klinik, Entfernung | Aufnahme neuer Patienten nur mit Bestätigung |
| Wohnen | dauerhafte Miete, Preisniveau mit Datum, kommunaler Wohnraum, Bauland | Inserate und Durchschnittswerte getrennt ausweisen |
| Arbeit | Branchen vor Ort, Pendelziele und Fahrzeiten, grosse Arbeitgeber | Fahrzeit ist keine Luftlinie |
| Alltag und Anschluss | Internet, öffentlicher Verkehr, Sprachkurse, Vereine, Kirche, Einkauf | Saison und Öffnungszeiten berücksichtigen |
| Erreichbares Umfeld | Leistungen in Nachbargemeinden, die faktisch zählen | räumliche Zuordnung und Zuständigkeit getrennt speichern |
| Ankommen | zuständiges Büro, Funktion, Sprachen, Antwortweg | benannter Kontakt nur bei bestätigter Leistung |
| Veränderungen | Projekte als angekündigt, beschlossen, finanziert, im Bau, in Betrieb | Ankündigung ist kein Zustand |
| Datentiefe | wie vollständig dieser Ort erfasst ist | ein leerer Ort darf nicht wie ein Ort ohne Angebote aussehen |

### 5.2 Die Leistungsdatenbank

Alle Förderungen, national, regional und kommunal, auch ohne Karte durchsuchbar.
Filter nach Lebensbereich, Zielgruppe, Status, Frist und Region. Jeder Eintrag trägt
dieselben Felder wie im Ortsprofil. Diese Ansicht ist für jemanden gedacht, der weiss,
was er sucht, aber noch nicht wo.

### 5.3 Der Vergleich

Zwei bis drei Orte nebeneinander, Rohinformation ohne Gesamtnote. Ausdrücklich kein
Ranking, weil ein Gesamtwert immer die Gewichtung des Anbieters durchsetzt und nicht
die des Nutzers. Was fehlt, steht als «unbekannt» und nicht als leere Zelle.

### 5.4 Regionenseiten

Je Gespanschaft eine Seite mit dem, was für die Ortswahl zählt: Lebensrealität statt
Tourismus. Arbeitsmarkt, Versorgung, Erreichbarkeit, Preisniveau, Schul- und
Klinikdichte, Verbindungen, regionale Programme. Plus ein ehrlicher Abschnitt zu den
Nachteilen der Region.

---

## 6. Bereich 3: Mein Umzug

### 6.1 Der Fragenpfad

Sechs Fragen, alle mit der gültigen Antwort «weiss ich noch nicht». Sie entsprechen
dem kurzen Einstieg Q01 bis Q09 in `wizard-recherche.md`; Details und Antwortoptionen
in `wizard-konzept.md` Abschnitt 2.2.

1. Wo stehen Sie gerade? (erkunden, konkret planen, bereits in Kroatien)
2. Wer zieht mit? (Haushalt, nicht nur Einzelperson)
3. Wo lebt jede Person heute?
4. Welche Staatsangehörigkeiten hat jede Person, und besteht ein Bezug zu Kroatien?
5. Wann soll der Umzug stattfinden?
6. Wovon leben Sie in Kroatien?

Gefragt wird ausschliesslich, was die Ausgabe verändert. Staatsangehörigkeiten sind
Mehrfachauswahl, und gefragt wird nach der Staatsangehörigkeit, nicht nach dem Pass.
Unklarer Status führt nie zum Ausschluss, sondern zu einer Klärungsaufgabe.

### 6.2 Die Checklisten, die der Nutzer bekommt

Der Fahrplan ist keine einzelne Liste, sondern ein Satz zusammenhängender Listen.
Das ist die Antwort auf die Frage, welche Checkliste der Nutzer braucht.

**A. Der Fahrplan nach Phasen.** Die Hauptliste, gegliedert nach den fünf Phasen.
Jede Aufgabe trägt: Zweck in einem Satz, verantwortliche Person im Haushalt,
benötigte Unterlagen, vorausgesetzte Aufgaben, Frist und deren Auslöser, zuständige
Stelle, Originalquelle, Status.

**B. Die Dokumentenliste nach Herkunftsland.** Was zu beschaffen ist, wo, in welcher
Reihenfolge, mit welcher Beglaubigung, in welcher Übersetzung, mit realistischer
Dauer. Für Südamerika der wichtigste Einzelbestandteil der ganzen Website.

**C. Die Haushaltsliste.** Pro Person: Status, Versicherungsgrundlage, Dokumente,
Schule oder Arbeit, Sprache. Partner und Kinder können unterschiedliche Wege haben,
und genau das übersehen alle bestehenden Checklisten.

**D. Die Fristenliste.** Alles Datumsgebundene an einem Ort, mit klarer optischer
Unterscheidung von vier Fristarten: gesetzliche Frist, Förderfrist, empfohlene
Vorlaufzeit, selbst gesetzte Erinnerung. Ein unbestätigter Termin löst niemals einen
amtlich wirkenden Countdown aus.

**E. Die Ankommensliste für die ersten acht Wochen.** Anmeldung, Versicherung, Konto,
Schule, Arzt, Strom, Internet, Führerschein, Fahrzeug. Kleinteilig, abhakbar,
druckbar.

**F. Die Bleibeliste für Monat drei bis vierundzwanzig.** Verlängerungen,
Förderbindungen, Sprachniveau, Anschluss der Familie, Steuererklärung im ersten
vollen Jahr. Diese Liste existiert sonst nirgends.

**G. Die Kostenaufstellung.** Einmalige Kosten (Dokumente, Übersetzungen, Umzug,
Kaution, Fahrzeug) und laufende Kosten (Miete, Nebenkosten, Versicherung, Betreuung,
Mobilität), mit eigenen Beträgen ergänzbar. Einmalige Zuschüsse werden nicht so
verrechnet, als würden sie das Monatseinkommen dauerhaft erhöhen.

**H. Die Klärungsliste.** Alles, was offen ist, weil eine Behörde oder Fachperson
entscheiden muss. Diese Liste ist bewusst sichtbar und nicht versteckt: Sie zeigt dem
Nutzer, was er noch nicht weiss, statt ihm Sicherheit vorzutäuschen.

### 6.3 Ausgabe und Datenschutz

Alles läuft im Browser, ohne Konto und ohne Übertragung. Ausgabe als PDF zum
Ausdrucken und Mitnehmen zum Behördentermin, mit kroatischen Originalbegriffen neben
den übersetzten Bezeichnungen. Ein Konto wird erst dann angeboten, wenn jemand
geräteübergreifend speichern oder Erinnerungen erhalten will, und auch dann ohne
Dokumentenablage.

---

## 7. Erfahrungen und Aktuelles

Vier Formate, klar voneinander getrennt, damit Erfahrung nie mit Rechtslage
verwechselt wird.

**Rückkehrgeschichten.** Personen mit Herkunftsland, Zielort, Jahr, Haushalt und
Ausgangslage. Immer mit Datum und dem Hinweis auf den Erfahrungscharakter. Bewusst
auch Geschichten, die nicht funktioniert haben, und Rückkehr ins alte Land. Das ist
inhaltlich unbequem und genau deshalb glaubwürdig.

**Praxisleitfäden.** Längere, ausgearbeitete Wege für wiederkehrende Konstellationen:
aus Argentinien mit Kindern, aus Deutschland als Rentner, aus der Schweiz mit
Gründungsabsicht. Verbindet Themen, Orte und Checkliste zu einer Erzählung.

**Was sich geändert hat.** Die Änderungsmeldungen. Jede Meldung ist mit der dauerhaft
gepflegten Themenseite verknüpft, damit alte Artikel keine parallele Regelwelt
erzeugen. Dieses Format trägt den Newsletter.

**Fragen aus der Community.** Reale Fragen, redaktionell beantwortet, mit Quelle.
Wächst organisch und deckt genau die Lücken auf, die wir sonst nicht sehen.

Was wir bewusst nicht machen: allgemeine Kroatien-Nachrichten, Sport, Politik,
Tourismus. Das Themenfeld bleibt eng, sonst verwässert die Autorität.

---

## 8. Anlaufstellen

Ein Verzeichnis, das dauerhaft Funktionen und Büros nennt statt einzelner politischer
Personen.

- **Behörden in Kroatien:** Ministerium für Demografie und Einwanderung, MUP und
  Polizeiverwaltungen, Steuerverwaltung, Krankenkasse, Rentenversicherung,
  Arbeitsvermittlung, Anerkennungsstelle, Grundbuchämter. Je Eintrag: Zuständigkeit,
  Kanal, bestätigte Sprachen, was man dort erledigen kann, was nicht.
- **Konsulate und Vertretungen weltweit,** sortiert nach Herkunftsland, mit dem, was
  dort tatsächlich möglich ist.
- **Kommunale Willkommensstellen,** soweit vorhanden.
- **Vereine und Diaspora-Netzwerke** nach Land und Stadt.

Jeder Eintrag trägt ein Prüfdatum. Eine nicht erreichbare Stelle bekommt einen
Ersatzweg statt einer toten Telefonnummer.

---

## 9. Fachpartner

Verzeichnis nach Fachgebiet, Region und Sprache: Anwälte für Staatsangehörigkeit und
Immobilien, Steuerberatung, Buchhaltung, gerichtlich beeidigte Übersetzer, Notare,
Immobilien, Umzug und Zoll, Versicherung, Sprachschulen, Relocation.

Jedes Profil nennt Leistung, räumliche Zuständigkeit, Sprachen, Preisstruktur oder
Angebotsweg, verantwortlichen Anbieter und die Grenzen der Leistung. Drei Merkmale
werden strikt getrennt ausgewiesen: Identität geprüft, Berufszulassung geprüft,
bezahltes Profil. Ein bezahltes Profil erzeugt niemals eine bessere fachliche
Bewertung oder eine höhere Platzierung. Kontaktdaten gehen erst auf ausdrücklichen
Wunsch heraus, mit sichtbarem Empfänger und Zweck.

---

## 10. Zahlen und Fakten

Der Bereich, der uns gegenüber Ministerium und Medien zitierfähig macht.

- **Rückkehr und Zuwanderung:** Zuzüge und Wegzüge, Anteil kroatischer
  Staatsbürger, Herkunftsländer, geförderte Fälle. Immer mit Quelle, Zeitraum und der
  ausdrücklichen Unterscheidung der Messgrössen. Geförderte Gründer, Zuzüge,
  Rückkehrer und Geburten sind vier verschiedene Zahlen und werden nie vermischt.
- **Löhne, Kosten, Wohnen:** Durchschnitt und Median getrennt, brutto und netto
  getrennt, nach Branche und Region, mit Datum.
- **Der Rückkehrerbericht,** halbjährlich: anonymisierte, aggregierte Auswertung
  unserer eigenen Nachfrage. Aus welchen Ländern kommt Interesse, für welche
  Regionen, in welcher Lebenssituation, an welcher Prozessstelle bricht es ab,
  welche Frage wird am häufigsten gestellt. Mindestfallzahlen, damit in kleinen
  Gemeinden niemand erkennbar wird.

Der Bericht ist inhaltlich das stärkste Angebot an den Staat, weil diese Daten sonst
niemand hat.

---

## 11. Über uns und Vertrauen

- **Auftrag und Unabhängigkeit:** wer dahintersteht, wie finanziert wird, wer keinen
  Einfluss auf Inhalte hat.
- **Redaktionsgrundsätze:** Quellenhierarchie, Prüfzyklen, wie Widersprüche
  aufgelöst werden, wie Korrekturen dokumentiert werden.
- **Fehler melden:** an derselben Stelle auf jeder Inhaltsseite, nicht versteckt im
  Kontaktformular.
- **Gemeinde eintragen** und **Fachpartner werden:** eigene Einstiege.
- **Impressum, Datenschutz, Barrierefreiheitserklärung.**
- **Haftungsausschluss:** allgemeine Information, keine Rechts-, Steuer- oder
  Finanzberatung, im Fussbereich jeder Seite.

---

## 12. Was auf jeder Inhaltsseite steht

Diese sechs Elemente sind überall vorhanden und immer an derselben Position. Sie
sind der Unterschied zwischen einer Website und einer Institution.

1. Quelle mit Herausgeber und Datum
2. Letzte fachliche Prüfung mit Prüfdatum
3. Zustand: offen, geschlossen, angekündigt, ausgeschöpft, unbestätigt
4. Zuständige Stelle
5. Der nächste sinnvolle Schritt
6. Fehler melden

Dazu die Zustandslogik im ganzen Bestand: «nicht vorhanden», «nicht zutreffend»,
«nicht erhoben», «unbekannt» und «veraltet» sind fünf verschiedene Aussagen. Eine
Null ist ein bestätigter Wert und kein Ersatz für eine fehlende Angabe.

---

## 13. Was wann gebaut wird

Die verbindliche Reihenfolge ist M0 bis M7 in `../CLAUDE.md` Abschnitt 7. Die
Inhaltsbausteine dieses Dokuments ordnen sich so ein:

| Modul | Inhaltliche Bausteine |
|---|---|
| M2 Pilot | ein vollständiger Weg: ein Frageablauf, ein geprüfter Regelsatz, ein Ortsprofil, ein Plan mit Checkliste, ein PDF |
| M4 Website | Startseite mit Abhängigkeitskette, alle zwölf Rubriken als Einstieg, zwanzig Themen in voller Tiefe, übrige Themen als geprüfte Kurzfassung, Anlaufstellen, Glossar, Fehler melden, erste Erfahrungsberichte |
| M5 Orte | landesweiter Ortsindex mit sichtbarer Datentiefe, vollständige Profile der Pilotgemeinden, Leistungsdatenbank, Vergleich |
| M6 Wizard | Fragenpfad vollständig, Checklisten A bis F, Dokumentenliste für zwei Herkunftsländer, Abdeckungsmatrix |
| M7 Ausbau | weitere Herkunftsländer, Regionenseiten, Partnerverzeichnis, Änderungsbenachrichtigungen, kommunaler Pflegezugang, erster Rückkehrerbericht |

Nur mit eigener Freigabe nach M7: Kostenaufstellung und Simulation, Merkliste und
gespeicherte Pläne, abgestimmte Verfahren mit Behörden, Antragsvorbereitung,
Statusabfrage. Bis dahin funktioniert alles ohne staatlichen Zugang.

Bewusst gar nicht: persönliche Dokumentenablage, native App, offener KI-Chat, direkte
Behördenanträge, Bewertungen oder Ranglisten von Gemeinden.

---

## 14. Die Sprachen

Kroatisch, Englisch, Spanisch, Deutsch. Portugiesisch folgt, sobald die Pflege
gesichert ist. Spanisch ist keine dritte Priorität, sondern gehört in die erste
vollständige Freigabe: Die Nachfrage aus Argentinien, Chile, Peru und Bolivien ist
belegt, und es gibt für diese Gruppe heute kein verlässliches Angebot in ihrer
Sprache. Das ist die am besten belegte Lücke im gesamten Markt.

Sprachfassungen werden getrennt geprüft und als veraltet markiert, wenn sich die
Rechtsgrundlage geändert hat. Eine nicht übersetzte Seite wird als solche
gekennzeichnet und nicht maschinell durchgereicht. Kroatische Originalbegriffe
bleiben überall sichtbar, weil der Nutzer sie am Schalter braucht.
