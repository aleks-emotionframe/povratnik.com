# Wizard-Konzept

## Mein Weg nach Kroatien: Fragenpfad, Verzweigungslogik und persönliche Zusammenfassung

Ergänzung zum Inhaltskonzept, Bereich 3. Version 1.3, Stand 14.09.2026. Änderungen in
1.3 (M2a): Antwortoptionen von Frage 4 an das Vokabular angeglichen, Zusatzfragen für
bereits Eingereiste in 2.2, Abbildung auf Fakten in `datenmodell.md` Abschnitt 3.

---

## 1. Warum der Wizard der Kern ist

Ein Informationsportal beantwortet Fragen, die jemand stellen kann. Der Wizard
beantwortet die Frage, die er nicht stellen kann, weil er nicht weiss, dass es sie
gibt.

Die Argentinierin der vierten Generation sucht nach «Krankenkasse Kroatien», weil das
die Frage ist, die sie kennt. Ihr eigentliches Problem ist, dass sie ohne geklärten
Status weder Krankenkasse noch Arbeitsvertrag noch Schulanmeldung erreichen wird, und
dass die Beschaffung der Urkunden ihrer Urgrosseltern acht Monate dauern kann. Diese
Reihenfolge sieht sie nirgends. Sie wird sie auch nicht finden, weil sie nicht weiss,
wonach sie suchen müsste.

Der Wizard kehrt die Richtung um. Statt zu warten, bis jemand die richtige Frage
stellt, stellt er sechs Fragen und leitet daraus ab, welche Fragen für diese Person
überhaupt relevant sind. Das ist die Last, die wir abnehmen.

---

## 2. Der Fragenpfad

### 2.1 Grundregeln

- Gefragt wird ausschliesslich, was die Ausgabe verändert. Jede Frage muss mindestens
  eine Aufgabe hinzufügen, entfernen oder ändern. Fragen, die nur Statistik erzeugen,
  gehören nicht hinein.
- «Weiss ich noch nicht» ist bei jeder Frage eine gültige Antwort und führt nie zum
  Ausschluss, sondern zu einer Klärungsaufgabe.
- Kein Konto, keine Registrierung, keine Übertragung. Alles läuft im Browser.
- Abbrechen ist jederzeit möglich, jede Teilantwort erzeugt bereits ein Teilergebnis.
- Der Nutzer sieht immer, wie viele Fragen noch kommen. Sechs ist eine Zahl, die man
  beantwortet. Zwanzig ist eine Zahl, bei der man abbricht.

### 2.2 Die sechs Hauptfragen des Kurzchecks

Der Kurzcheck entspricht dem kurzen Einstieg Q01 bis Q09 in `wizard-recherche.md`
Abschnitt 13. Drei davon sind keine eigenen Frageschritte: Q01 (Sprache) ist der
Sprachwechsel der Seite, Q06 (Bezug zu Kroatien) wird mit Q05 in einer Ansicht
gestellt, Q09 (Zielort) ist ein Angebot nach dem ersten Ergebnis. Bleiben sechs
Schritte, in dieser Reihenfolge.

**Frage 1: Wo stehen Sie gerade?** (Q02)
Ich erkunde noch / Ich plane konkret / Ich bin bereits in Kroatien

Wer bereits eingereist ist, bekommt zuerst laufende Fristen und den aktuellen Status
geprüft, nicht die Vorbereitung.

**Frage 2: Wer zieht mit?** (Q03)
Ich allein / mit Partnerin oder Partner / mit Partner und Kindern / allein mit
Kindern / weitere Personen

Erzeugt eine Personenkarte je Mitglied und die Beziehungen dazwischen. Alle folgenden
Fragen werden je Person gestellt; die Haushaltsleiste zeigt, wer gerade gemeint ist.
Gemeinsame Angaben lassen sich ausdrücklich übernehmen, nie stillschweigend.

**Frage 3: Wo lebt jede Person heute?** (Q04)
Land, je Person. Argentinien, Chile, Deutschland, Schweiz, Österreich und Kanada als
Direktwahl, alle anderen Länder über eine Liste.

Bestimmt Dokumentenweg, Apostille, Übersetzung, Sozialversicherungsabkommen,
Doppelbesteuerung und Abmeldepflichten. Je Person, weil ein Haushalt schon vor dem
Umzug getrennt leben kann.

**Frage 4: Welche Staatsangehörigkeiten hat jede Person, und besteht ein Bezug zu
Kroatien?** (Q05 und Q06)
Staatsangehörigkeiten als Mehrfachauswahl: Kroatisch / EU oder EWR / Schweiz / Andere
/ Staatenlos / Weiss ich nicht. Dazu der Bezug: Ein Elternteil kroatisch / Grosseltern
oder frühere Vorfahren kroatisch / Früher selbst in Kroatien gelebt / Partnerin oder
Partner mit kroatischem Bezug / Kein Bezug / Unklar

Entschieden am 14.09.2026 durch die Produktverantwortung: «EU, EWR oder Schweiz» wird
in zwei Optionen getrennt, weil das Vokabular `eea_citizen` und `ch_citizen`
unterscheidet und Regeln sich auf genau einen davon beziehen können. Aus demselben Grund
werden Eltern (`parent`) und frühere Vorfahren (`ancestor`) getrennt gefragt.

Das ist die wichtigste Frage der ganzen Website. Sie entscheidet über Aufenthalt,
Arbeitszugang, Förderfähigkeit und die Dauer der Vorbereitung. Gefragt wird nach der
Staatsangehörigkeit, nicht nach dem Pass: Ein Pass ist ein Dokument, und sein Fehlen
oder Ablauf beweist keine fehlende Staatsangehörigkeit. Ob ein gültiger Pass vorliegt,
klärt erst der ausführliche Check bei den Dokumenten (Q10). Mehrere
Staatsangehörigkeiten sind der Normalfall in dieser Zielgruppe, deshalb keine
Einfachauswahl.

**Frage 5: Wann soll der Umzug stattfinden?** (Q07)
In bis zu 6 Monaten / in 6 bis 12 Monaten / später oder unklar, bei Bedarf je Person
abweichend

Bestimmt nicht den Inhalt, sondern die Dringlichkeitsreihenfolge und die Warnung,
wenn der Zeitplan und die realistische Dauer der Dokumentenbeschaffung nicht
zusammenpassen. Ein gemeinsamer Termin ist ein Szenario, kein Datum.

**Frage 6: Wovon leben Sie in Kroatien?** (Q08)
Anstellung in Kroatien / eigene Tätigkeit oder Gründung / Arbeit für einen
Arbeitgeber im Ausland / Rente oder Vermögen / Studium / noch offen

Nach Frage 6 erscheint das erste Ergebnis: mögliche Wege je Person, die wichtigsten
offenen Fragen, Themen für die Ortswahl. Erst hier wird der Zielort angeboten (Q09);
der Plan funktioniert auch ohne Ortswahl.

**Zusatzfragen nur bei «Ich bin bereits in Kroatien».** Je Person werden dann der
Aufenthaltsstatus in Kroatien (Vokabular, mit «weiss ich nicht») und das Einreisedatum
(Datum oder «weiss ich nicht») gefragt. Ohne diese beiden Angaben lässt sich keine
Regel mit Aufenthaltsbezug auswerten und keine Frist berechnen. Wer noch nicht
eingereist ist, hat bekanntermassen keinen Status in Kroatien und noch kein
Einreisedatum; das wird nicht gefragt, sondern gesetzt.

### 2.3 Vertiefende Fragen, die nur bei Bedarf erscheinen

Sie erscheinen erst nach der Zusammenfassung, als Angebot zur Verfeinerung, nicht als
Pflicht im Hauptpfad.

| Erscheint wenn | Frage | Wirkt auf |
|---|---|---|
| Bezug über Vorfahren, kein belegter Status | Über welchen Vorfahren läuft die Abstammung, und liegen dessen Urkunden vor? | Dauer, Reihenfolge, Fachpartner |
| Kroatisch angegeben, Beleg unklar | Welche Belege gibt es: Domovnica, Registereintrag, alter Pass, Entscheidung? | Feststellung oder Erwerb, Registerbestätigung |
| Kinder im Haushalt | Wie alt sind die Kinder, und sprechen sie Kroatisch? | Schule, Sprachförderung, Zeitplan |
| Gründung geplant | In welcher Branche, und haben Sie bereits gegründet? | Förderfähigkeit, Reihenfolgefalle |
| Zielort bekannt | Welche Gemeinde? | kommunale Leistungen im Plan |
| Immobilie geplant | Kauf, Miete oder geerbtes Familieneigentum? | Grundbuch, Erbschaft, Kaufgenehmigung |
| Rente | Aus welchem System, und läuft sie bereits? | Rentenanrechnung, Besteuerung |
| Reglementierter Beruf | Welcher Beruf? | Anerkennung als eigener Vorschritt |
| Pflegebedarf | Besteht laufender medizinischer Bedarf? | Versorgung am Zielort, Übergangsdeckung |

---

## 3. Die Statusgabelung

Die Antwort auf Frage 4 erzeugt je Person fünf grundsätzlich verschiedene Wege. Das
ist der Punkt, an dem sich der Wizard von jeder Checkliste im Markt unterscheidet.
Die Gabelung läuft je Person, nicht je Haushalt: Partnerin und Kind können in
verschiedenen Ästen landen, und der Plan führt beide zusammen.

```
            Staatsangehörigkeiten und Bezug zu Kroatien, je Person
                                    │
   ┌───────────────┬────────────────┼────────────────┬──────────────────┐
   │               │                │                │                  │
 kroatisch,     kein kroat.     EU, EWR oder    andere, kein      unbekannt
 belegt         Status, aber    Schweiz         Bezug             oder unklar
                Bezug
   │               │                │                │                  │
 R0             C4 und R2       R1              R3 bis R7         Klärung
 kurzer Weg     längster Weg    mittlerer Weg   Arbeits-, Fami-   zuerst
   │               │                │           lien-, Nomaden-      │
   ▼               ▼                ▼           oder Sonderweg       ▼
 Meldung,       Wahl zwischen   Registrierung        │            welche Belege
 Versicherung,  Einbürgerung    beim MUP nach        ▼            gibt es, wer
 Steuer und     und Aufenthalt  drei Monaten    Titel vor der     stellt sie fest
 Familie        für Auswanderer                 Einreise nötig
 trotzdem       Urkundenkette
 prüfen         über Generationen
```

Zwei Regeln aus `wizard-recherche.md` Abschnitt 14 bestimmen die Einordnung: Bei
mehreren Staatsangehörigkeiten zählt die günstigste zuerst, eine EWR- oder Schweizer
Staatsangehörigkeit führt auch neben einem weiteren Pass zu R1 (L04). Wer «kroatisch»
angibt, aber keinen Beleg nennt, landet nicht in R0, sondern in der Klärung C1 bis C3
(L02): Feststellung einer bestehenden Staatsangehörigkeit ist etwas anderes als ihr
Erwerb.

Die Website sagt an dieser Stelle ausdrücklich, was sie nicht kann: Ob ein konkreter
Abstammungsnachweis ausreicht, entscheidet die zuständige Behörde. Der Wizard zeigt
den Weg, nicht das Ergebnis.

---

## 4. Fünf Fallprofile

So sieht der Unterschied in der Praxis aus. Diese Profile dienen intern als
Testfälle für die Regeln und können öffentlich als Beispielwege gezeigt werden.

### Fall A: Lucía, 32, Buenos Aires, Urgrosseltern aus Dalmatien

Kein kroatischer Pass, Partner ohne kroatischen Bezug, ein Kind im Schulalter,
Einkommen noch offen, Umzug in etwa zwölf Monaten.

**Was ihren Weg prägt:** Der Status ist offen, und die Dokumentenkette über vier
Generationen ist der längste Einzelschritt. Ihr Partner hat einen völlig anderen Weg
als sie, weil er keinen kroatischen Bezug hat. Das Kind braucht Zeugnisanerkennung
und Sprachförderung vor dem Schuljahresbeginn.

**Der erste Schritt, den sie sieht:** Prüfen lassen, ob die Abstammungskette
vollständig belegbar ist. Nicht die Krankenkasse, nach der sie gesucht hat.

**Was ihr erspart bleibt:** Monate der Recherche in der falschen Reihenfolge, und die
verbreitete Annahme, dass kroatische Vorfahren automatisch einen Anspruch erzeugen.

### Fall B: Marko, 41, Stuttgart, kroatischer Pass

Partnerin ebenfalls kroatischer Pass, zwei Kinder, will sich selbständig machen,
Umzug in fünf Monaten.

**Was seinen Weg prägt:** Der Status ist geklärt, sein Weg ist kurz. Entscheidend sind
für ihn zwei Dinge: die Reihenfolge zwischen Förderantrag und Gründung, weil ein
Fehler hier den Anspruch kostet, und die fünfjährige Lohnsteuerbefreiung, die für ihn
möglicherweise gar nicht greift, weil sie Einkünfte aus nichtselbständiger Arbeit
betrifft.

**Der wertvollste Hinweis für ihn:** Eine Warnung zur Reihenfolge und eine ehrliche
Einordnung, welche der beworbenen Vorteile bei Selbständigkeit nicht gelten.

### Fall C: Anna, 29, Wien, keine kroatischen Wurzeln

EU-Bürgerin, allein, Arbeit für einen österreichischen Arbeitgeber aus Kroatien
heraus, Umzug in drei Monaten.

**Was ihren Weg prägt:** Aufenthalt ist unkompliziert. Ihr eigentliches Risiko ist
steuerlich: Ansässigkeit, Doppelbesteuerung und Sozialversicherungspflicht bei Arbeit
für einen ausländischen Arbeitgeber, was auch ihren Arbeitgeber betrifft und
rückwirkend wirkt.

**Was sie nirgends sonst findet:** Dass dieser Punkt vor dem Umzug geklärt gehört und
nicht danach.

### Fall D: Ivan, 58, Toronto, kroatischer Pass, Rentner

Partnerin ohne kroatischen Pass, keine Kinder im Haushalt, lebt von einer kanadischen
Rente, Umzug offen.

**Was seinen Weg prägt:** Seine Partnerin hat einen anderen Weg als er. Die Rente
betrifft Anrechnung, Besteuerung und das Sozialversicherungsabkommen mit Kanada. Die
Krankenversicherung folgt bei ihm nicht aus einer Anstellung, das ist der Punkt, an
dem es Lücken gibt. Rückkehrerförderungen für Arbeit und Gründung gelten für ihn
nicht, und das sagt der Plan offen.

### Fall E: Sofía, 26, Santiago de Chile, Status unklar

Weiss nicht, ob ihre Grossmutter die Staatsbürgerschaft hatte. Allein, Umzug später
oder unklar.

**Was ihren Weg prägt:** Der Plan besteht fast ausschliesslich aus Klärungsaufgaben,
und das ist richtig so. Er zeigt ihr, welche drei Auskünfte sie braucht, bevor
irgendetwas anderes planbar ist, und welche Stelle sie dafür kontaktiert.

**Die wichtigste Leistung:** Ihr die Gewissheit zu nehmen, dass sie schon planen
könnte, und ihr stattdessen drei konkrete, erledigbare Schritte zu geben.

---

## 5. Wie die Regeln funktionieren

Kein Entscheidungsbaum mit hundert Ästen, sondern Aufgaben mit Bedingungen. Jede
Aufgabe kennt die Antwortkombinationen, bei denen sie erscheint.

Jede Aufgabe trägt fest:

| Feld | Inhalt |
|---|---|
| Titel | die Handlung, nicht das Thema |
| Zweck | ein Satz, warum das nötig ist |
| Phase | Orientieren, Vorbereiten, Umziehen, Ankommen, Bleiben |
| Betrifft | welches Haushaltsmitglied |
| Voraussetzung | welche Aufgabe vorher erledigt sein muss |
| Unterlagen | was mitzubringen ist |
| Zuständige Stelle | mit Kontaktweg und bestätigter Sprache |
| Fristart | gesetzlich, Förderfrist, empfohlene Vorlaufzeit, eigene Erinnerung |
| Fristauslöser | wodurch die Frist startet, nicht nur ein Datum |
| Dauer | realistische Erfahrungswerte, soweit belegt |
| Kosten | soweit belegt, sonst «unbekannt» |
| Quelle und Prüfdatum | wie überall im System |
| Regelversion | damit gespeicherte Pläne bei Änderungen markierbar sind |
| Weiterführend | Verweis auf die Themenseite mit der vollen Erklärung |

Zwei Sonderzustände sind zentral:

**Blockiert.** Die Aufgabe ist sichtbar, aber noch nicht angehbar, weil eine
Voraussetzung fehlt. Sie wird nicht versteckt, sondern mit dem Hinweis gezeigt, was
zuerst passieren muss. Der Nutzer soll sehen, was auf ihn zukommt.

**Zu prüfen.** Über den Ausgang entscheidet eine Behörde oder Fachperson. Die Aufgabe
sagt das offen und nennt die Stelle, statt ein Ergebnis zu behaupten.

---

## 6. Die persönliche Zusammenfassung

Das Ergebnis des Wizards. Sie hat sieben Teile, in dieser Reihenfolge.

**1. Ihre Ausgangslage in drei Sätzen.**
Die Antworten in Klartext zurückgespiegelt, damit der Nutzer prüfen kann, ob wir ihn
richtig verstanden haben. Mit der Möglichkeit, jede Antwort direkt zu ändern.

**2. Ihr Weg in einem Bild.**
Die Abhängigkeitskette, aber nur mit seinen Stationen. Sichtbar wird: Wie lang der Weg
ist, wo er beginnt, wo die Engstelle liegt.

**3. Was für Sie anders ist als für andere.**
Der wichtigste Absatz der ganzen Ausgabe. Zwei bis vier Sätze, die benennen, was
seinen Fall vom Standardfall unterscheidet. Für Lucía: der offene Status und der
abweichende Weg ihres Partners. Für Marko: dass die Steuerbefreiung bei
Selbständigkeit möglicherweise nicht greift. Das ist die Stelle, an der jemand merkt,
dass hier nicht dieselbe Seite für alle steht.

**4. Die nächsten Schritte, bis zu drei.**
Nicht zwanzig Aufgaben, sondern höchstens drei. Alles andere ist darunter, aber oben
steht, was diese Woche erledigbar ist. Mit Stelle, Kontaktweg und Unterlagen. Ist nur
ein Schritt sinnvoll, steht dort einer; es wird nicht auf drei aufgefüllt.

**5. Ihr vollständiger Fahrplan.**
Nach den fünf Phasen, mit allen Aufgaben, Abhängigkeiten und Fristarten. Aufklappbar,
damit die Länge nicht erschlägt.

**6. Was noch offen ist.**
Die Klärungsliste. Jede Aufgabe, deren Ausgang eine Behörde oder Fachperson
entscheidet, mit der zuständigen Stelle. Diese Liste wird bewusst nicht versteckt.

**7. Wer Ihnen weiterhilft.**
Behörden und Konsulate für seinen Fall und sein Herkunftsland, kommunale Stellen für
seinen Zielort, passende Fachpartner nach Fachgebiet und Sprache. Getrennt nach
öffentlich und kommerziell, immer erkennbar.

### Format und Ausgabe

Als Seite im Browser, als PDF zum Ausdrucken und Mitnehmen, und als
Terminvorbereitung: eine Kurzfassung mit den kroatischen Originalbegriffen neben den
übersetzten, damit der Nutzer am Schalter die richtigen Wörter hat. Wer fünf
Behördentermine in einem fremden Land vor sich hat, braucht genau das.

Kein Konto nötig. Wer den Stand mitnehmen will, nimmt das PDF. Ein Link mit kodierten
Antworten ist ausdrücklich ausgeschlossen: Antwortwerte gehören nie in eine URL, weil
sie dort in Verläufen, Protokollen und Weiterleitungen landen. Ein Export mit
Wiederimport wäre eine eigene Speicherfunktion und ist nicht freigegeben.

---

## 7. Was der Wizard ausdrücklich nicht tut

- Er entscheidet keinen Anspruch. Wo eine Behörde entscheidet, steht «zu prüfen».
- Er berechnet keine Förderhöhe für den Einzelfall. Er zeigt, welche Programme in
  Frage kommen und welche Bedingungen zu prüfen sind.
- Er ersetzt keine Rechts- oder Steuerberatung und sagt das an den Stellen, an denen
  es darauf ankommt, im Klartext statt im Fussbereich.
- Er sammelt keine Personendaten und speichert nichts auf einem Server.
- Er stellt keine Frage, deren Antwort die Ausgabe nicht verändert.

---

## 8. Warum das für den Staat interessant ist

Der Wizard erzeugt, ganz ohne Personendaten, genau die Information, die der
Verwaltung heute fehlt: an welcher Stelle Menschen abbrechen, welche
Statuskombination am häufigsten unklar ist, aus welchen Ländern die Nachfrage kommt,
welche Klärungsfrage am häufigsten offen bleibt.

Ausgewertet werden ausschliesslich anonyme, aggregierte Pfade mit Mindestfallzahlen.
Daraus wird der halbjährliche Rückkehrerbericht. Wenn wir belegen können, dass
tausend Menschen an derselben Stelle abbrechen, ist das ein Verwaltungsbefund und kein
Werbematerial.

---

## 9. Betrieb und Pflege

Die Regeln sind Redaktionsgegenstand, nicht Software. Jede Aufgabe hat einen
verantwortlichen Redakteur, eine Regelversion und ein Prüfdatum. Bei einer
Gesetzesänderung wird die betroffene Aufgabe angepasst und jeder Plan, der auf der
alten Version beruht, beim nächsten Aufruf als prüfbedürftig markiert.

Die fünf Fallprofile aus Kapitel 4 dienen als Testfälle: Nach jeder Regeländerung
werden sie durchgespielt, und das Ergebnis muss fachlich weiterhin stimmen. Vor der
Veröffentlichung muss jeder Fall einmal von einer kroatischen Fachperson gegengelesen
sein. Ein falscher Fahrplan ist schädlicher als gar keiner, weil ihm geglaubt wird.
