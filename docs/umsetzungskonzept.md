# Umsetzungskonzept Entwicklung

## Leben in Kroatien: Architektur, Datenmodell, Etappen und Abnahme

Version 1.1, Stand 13.09.2026. Ergänzt das Strategiekonzept, das Inhaltskonzept und
die Wizard-Recherche. Dieses Dokument beschreibt, wie gebaut wird. Es ist so
verfasst, dass es auch als Grundlage für eine Ausschreibung dient.

---

## 1. Was gebaut wird und was nicht

**Gegenstand:** Eine mehrsprachige, redaktionell gepflegte Informationsplattform mit
Ortsdatenbank, Leistungsdatenbank und einem regelbasierten Wizard, der aus den
Angaben eines Haushalts einen persönlichen Plan ableitet.

**Ausdrücklich nicht Gegenstand der ersten Ausbaustufen:** Anbindung an staatliche
Antragsverfahren, elektronische Identifikation, Dokumentenablage, native Apps,
offener KI-Chat, automatische Anspruchsbescheide.

**Die architektonisch wichtigste Entscheidung:** Rechtsregeln sind Daten, nicht Code.
Sie werden redaktionell gepflegt, versioniert und freigegeben. Wenn sich eine
Meldefrist ändert, ändert ein Redakteur einen Datensatz und nicht ein Entwickler eine
Codezeile. Alles Weitere folgt daraus.

---

## 2. Sieben Architekturprinzipien

**2.1 Eine Wahrheit, viele Ansichten.** Jeder Fakt wird einmal gespeichert. Themenseite,
Ortsprofil, Vergleich, Leistungsdatenbank und Wizard lesen dieselben Objekte. Es gibt
keine redaktionelle Kopie eines Betrags in einem Fliesstext.

**2.2 Regeln als versionierte Daten.** Jede Regel hat Kennung, Fassung,
Gültigkeitszeitraum, Bedingungen, Quellen, Ergebnistext, Freigabestatus und
verantwortliche Person. Die Auswertung ist generisch.

**2.3 Zustände statt Lücken.** Auf Datenbankebene wird zwischen «nicht vorhanden»,
«nicht zutreffend», «nicht erhoben», «unbekannt» und «veraltet» unterschieden. Ein
NULL-Wert ist kein zulässiger Inhalt für ein Fachfeld.

**2.4 Datensparsamkeit als Architektur, nicht als Hinweis.** Der Wizard läuft in den
ersten Stufen vollständig im Browser. Es gibt keinen Endpunkt, der Antworten
entgegennimmt. Was technisch nicht existiert, kann nicht missbraucht werden.

**2.5 Inhalt vor Interaktion.** Jede Informationsseite ist eine normale, serverseitig
gerenderte Seite: auffindbar, teilbar, druckbar, ohne JavaScript lesbar. Nur Wizard,
Karte und Filter sind interaktive Inseln.

**2.6 Leicht genug für schlechte Verbindungen.** Die Zielgruppe sitzt in Südamerika am
Telefon. Budget je Informationsseite: unter 150 Kilobyte übertragen, unter 2,5
Sekunden bis zum sichtbaren Inhalt bei simuliertem 3G.

**2.7 Exportierbar bleiben.** Alle Inhalte und Regeln müssen jederzeit vollständig als
strukturierte Daten exportierbar sein. Kein Anbieter darf den Bestand einschliessen.

---

## 3. Systemkomponenten

| Komponente | Aufgabe | Nutzer |
|---|---|---|
| Datenbank | abgeleiteter Abfrageindex für Orte, Suche und Geometrie; Quelle nur für grosse Ortsbestände, siehe ADR-0001 | System |
| Redaktionsoberfläche | Pflege, Übersetzung, Prüfzyklen, Freigabe, Änderungsverlauf | Redaktion |
| Regelwerk | Bedingungen, Aufgaben, Abhängigkeiten, Fristregeln, Versionen | Redaktion, Fachprüfung |
| Website | öffentliche Seiten, Suche, Karte, Ortsprofile, Vergleich | Besucher |
| Wizard | Fragenpfad, Auswertung im Browser, Plan, PDF | Besucher |
| Gemeindezugang | Fakten bestätigen, Korrekturen melden, eigene Angaben pflegen | Gemeinden |
| Auswertung | anonyme, aggregierte Pfadstatistik | Betrieb, Rückkehrerbericht |
| Änderungswächter | prüft Quellseiten auf Änderungen, erzeugt Prüfaufgaben | Redaktion |

---

## 4. Technologie

### 4.1 Empfehlung

| Schicht | Empfehlung | Begründung |
|---|---|---|
| Datenbank | PostgreSQL mit PostGIS | Quelle für Orte, Geometrie, Einrichtungen und Leistungen; für Regeln und Inhalte ein aus dem Repository erzeugter Leseindex (ADR-0001). Räumliche Abfragen für die Karte, Volltextsuche mit Sprachunterstützung, ein System statt drei |
| Redaktion | Oberfläche, die für Regeln und Inhalte YAML-Dateien schreibt und Pull Requests erzeugt, für Ortsdaten direkt in die Datenbank | Das Repository bleibt die Wahrheit für Regeln und Inhalte, die Oberfläche verbirgt den Unterschied. Kein proprietäres Inhaltsformat |
| Website | serverseitig gerendertes Framework mit statischer Auslieferung, wo möglich | Informationsseiten sind statisch und damit schnell und billig. Interaktives nur dort, wo nötig |
| Interaktive Inseln | schlanke Komponentenbibliothek, nur auf Karte, Filter und Wizard geladen | Eine Themenseite lädt kein Framework mit |
| Karte | Vektorkacheln mit lizenzierten Geodaten, Bibliothek austauschbar | Gemeindegrenzen und stabile Kennungen sind wichtiger als die Kartenbibliothek |
| Suche | zunächst Volltextsuche der Datenbank, später eigener Suchdienst | Mehrsprachigkeit und Synonyme sind das Problem, nicht die Geschwindigkeit |
| PDF | Erzeugung im Browser | kein Serverdienst, der persönliche Daten sieht |
| Hosting | EU, vorzugsweise Kroatien oder Deutschland | Datenschutz, Latenz, Argumentation gegenüber Behörden |

### 4.2 Was nicht verhandelbar ist

Die Datenbank gehört euch, die Regeln liegen als Daten vor, die Inhalte sind
exportierbar, die Seiten funktionieren ohne JavaScript, gehostet wird in der EU. Die
konkrete Wahl von Framework und CMS ist austauschbar und sollte mit dem
Umsetzungspartner entschieden werden. Wer eine Lösung vorschlägt, die eines dieser
fünf Kriterien verletzt, hat die falsche Lösung vorgeschlagen.

---

## 5. Datenmodell

### 5.1 Kernobjekte

**Ort.** Stabile Kennung (amtlicher Gemeindeschlüssel), Name mit Schreibvarianten,
Ebene (Siedlung, Gemeinde, Stadt, Gespanschaft), übergeordnete Einheit, Geometrie,
Entwicklungsindex, Datentiefe, Datenlizenz des Geodatensatzes.

**Einrichtung.** Typ, Ort, Adresse, Koordinaten, Träger, Kontakt, Sprachen,
Barrierefreiheit. Kapazität ist bewusst kein Feld der Einrichtung, sondern ein
eigenes zeitbezogenes Objekt mit Bestätigungsdatum und Quelle.

**Leistung.** Anbieter (Staat, Gespanschaft, Gemeinde), räumlicher Geltungsbereich,
Zielgruppe, Bedingungen als strukturierte Kriterien, Betrag oder Berechnungsart,
Antragszeitraum, Budgetstatus, Bindungen, Rückzahlungspflichten, Ausschreibungsversion.

**Verfahren.** Zuständige Stelle, Voraussetzungen, Schritte, Formulare, Fristregel,
gültige Fassung.

**Aufgabe.** Titel als Handlung, Zweck, Phase, betroffene Person, Voraussetzungen,
Unterlagen, zuständige Stelle, Fristart, Fristauslöser, Dauer, Kosten,
Abschlussnachweis, Folgeaufgaben, Regelversion.

**Regel.** Kennung, Fassung, gültig ab und bis, Bedingungen, Ausnahmen, Ergebnis,
Quellen, Freigabestatus, Prüfer.

**Quelle.** URL, Titel, Herausgeber, Veröffentlichungsdatum, Abrufdatum, Prüfdatum,
Prüfer, Weiterverwendungsrecht, Änderungsverlauf.

**Inhaltsseite.** Typ, Sprache, Fassung, Status je Sprache, verknüpfte Objekte,
Prüfzyklus.

### 5.2 Drei Modellierungsentscheidungen, die später nicht mehr korrigierbar sind

**Zeit ist ein Attribut jeder Regel, kein Feld an der Seite.** Jede Regel speichert
sechs Zeitangaben: Veröffentlichung, Inkrafttreten, Ausserkrafttreten,
Antragszeitraum, Prüfdatum der Redaktion und die Verknüpfung zu Vorgänger- und
Nachfolgefassung. Erst dadurch kann das System sagen: «Für Ihre Meldung gilt die seit
Juni 2026 geänderte Frist.» Wer Zeit nachträglich einbaut, baut neu.

**Die Person ist die Planungseinheit, der Haushalt die Klammer.** Jedes
Haushaltsmitglied hat eigene Staatsangehörigkeiten, Dokumente, Aufenthaltsoptionen und
Versicherungsgrundlagen. Beziehungen zwischen Personen sind eigene Objekte mit
Rechtsart, Gültigkeit und Nachweisstatus. Ein Modell mit einer Hauptperson und
Anhängseln bildet gemischte Familien nicht ab und ist der häufigste Konstruktionsfehler
in vergleichbaren Systemen.

**Jede Prüftatsache kennt ihre Herkunft.** Ein Wert wird gespeichert mit Angabe, ob
er Selbstauskunft, Dokument oder fachlich geprüft ist, mit Erfassungsdatum und
Gültigkeit. Widersprüche zwischen Selbstauskunft und Dokument werden abgebildet,
nicht überschrieben.

### 5.3 Mehrsprachigkeit

Übersetzung ist eine Eigenschaft des Inhalts, nicht eine Schicht darüber. Jede
Sprachfassung hat eigenen Status, eigene Fassung und eigenes Prüfdatum. Ändert sich
die Rechtsgrundlage, werden alle Sprachfassungen als prüfbedürftig markiert, und die
nicht geprüften werden als solche ausgewiesen statt stillschweigend weiterbenutzt.
Kroatische Originalbegriffe sind ein eigenes Feld und werden nie übersetzt, weil der
Nutzer sie am Schalter braucht.

---

## 6. Das Regelwerk

### 6.1 Ablauf einer Auswertung

1. Der Wizard sammelt Antworten im Browser.
2. Das freigegebene Regelwerk wird als kompaktes Datenpaket ausgeliefert.
3. Die Auswertung läuft lokal. Jede Regel prüft ihre Bedingungen gegen die Antworten.
4. Ergebnis je Regel: trifft zu, trifft nicht zu, Bedingung fehlt, unklar.
5. Aus den zutreffenden Regeln entstehen Routen, Aufgaben und Klärungen.
6. Abhängigkeiten bestimmen die Reihenfolge und markieren blockierte Aufgaben.
7. Fristen werden nur berechnet, wenn das auslösende Ereignis bestätigt ist.

Es wird nie serverseitig ausgewertet, solange keine Speicherung existiert. Das ist
zugleich der Datenschutz und die Ausfallsicherheit.

### 6.2 Vier Zustandsdimensionen

Jede Route und jede Leistung führt vier unabhängige Zustände. Sie werden getrennt
gespeichert und getrennt angezeigt. Die Kennungen stehen in `datenmodell.md`
Abschnitt 1.1 als Vokabular C.

| Dimension | Werte |
|---|---|
| Sachverhalt | Selbstauskunft, Dokument vorhanden, fachlich geprüft, widersprüchlich, unbekannt |
| Eignung nach Regeln | nach Angaben passend, Bedingung fehlt, unklar, nicht geprüft |
| Verfahren | nicht begonnen, vorbereitbar, einreichbar, eingereicht, entschieden, Folgehandlung offen |
| Programm | offen, geschlossen, angekündigt, Budget unbekannt, örtliche Verfügbarkeit unbekannt |

Ohne diese Trennung entsteht die gefährlichste Fehlaussage des ganzen Systems: dass
eine ungeprüfte Voraussetzung als erfüllt gilt.

### 6.3 Freigabe

Eine Regel ist bis zur Freigabe Entwurf und wird öffentlich nicht ausgewertet. Die
Freigabe erfolgt durch eine benannte fachlich verantwortliche Person, bei
rechtsrelevanten Regeln durch eine kroatische Fachperson. Die Freigabe wird mit
Person, Datum und Fassung protokolliert.

---

## 7. Redaktionssystem

Der teuerste Dauerposten ist nicht die Entwicklung, sondern die Pflege. Das System
muss dafür gebaut sein.

**Arbeitsablauf:** Änderung erkennen, Originalquelle prüfen, betroffene Regeln und
Seiten bestimmen, fachlich einordnen, Widersprüche klären, Sprachfassungen abgleichen,
freigeben, betroffene Ansichten aktualisieren, Prüfung protokollieren.

**Prüfzyklen im System hinterlegt:** offene Förderaufrufe wöchentlich während der
Laufzeit, Aufenthalt und Steuer und Versicherung monatlich, kommunale Massnahmen
quartalsweise, Kontakte halbjährlich. Ein verpasster Prüftermin erzeugt automatisch
eine Warnung, ein abgelaufener Antragszeitraum setzt den Zustand automatisch auf
geschlossen.

**Änderungswächter:** Ein Dienst prüft die hinterlegten Quellseiten regelmässig auf
Veränderung und erzeugt eine Prüfaufgabe. Er entscheidet nichts, er weckt nur die
Redaktion.

**Fehler melden:** Auf jeder Inhaltsseite an derselben Stelle. Eingehende Meldungen
landen in derselben Warteschlange wie die Prüfaufgaben. Erste Sichtung binnen zwei
Werktagen, für falsche Fristen ein Sofortweg. Bei kritischen Widersprüchen wird die
betroffene Detailausgabe vorübergehend durch eine Klärungsaufgabe ersetzt, statt sie
zu löschen oder stehen zu lassen.

**Gemeindezugang:** Rollenabhängig, kann Angaben vorschlagen und bestätigen, aber
nicht selbst freigeben. Redaktion entscheidet nach denselben Regeln für zahlende und
nicht zahlende Gemeinden.

---

## 8. Datenschutz und Sicherheit

**M0 bis M7:** keine Personendaten von Besuchern. Kein Nutzerkonto, kein
Formularendpunkt für Wizard-Antworten, keine Übertragung. Analytik ohne Cookies und
nur nach der Positivliste in `betrieb.md` Abschnitt 4.1, Systemschriften ohne
Webfonts, keine externen Skripte. Redaktions- und Gemeindekonten sind Personendaten
und in `betrieb.md` Abschnitt 4 getrennt geregelt. Datenschutzerklärung, Impressum
und Verarbeitungsverzeichnis ab dem ersten Tag, in allen Sprachen.

**Gespeicherte Pläne, nach M7 und nur mit eigener Freigabe:** Hier ändert sich die Rechtslage grundlegend. Die
Daten umfassen dann Abstammung über Generationen, Familienbeziehungen,
Sorgerechtsverhältnisse, Einkommen und einen Gesundheitsindikator. Diese Kombination
löst eine Datenschutz-Folgenabschätzung aus. Sie ist Vorbedingung der Entwicklung,
nicht deren Begleitung. Zusätzlich nötig: Rechtsgrundlage je Verarbeitungszweck,
rollengetrennter Zugriff innerhalb eines Haushalts, Verschlüsselung ruhender Daten,
Zugriffsprotokoll, definierte Löschfristen, Vorfallprozess, Auftragsverarbeitungsverträge.

**Dauerhaft ausgeschlossen:** Nutzung persönlicher Migrationsprofile für politische
oder kommerzielle Zielgruppenwerbung. Diese Zusage gehört in die Redaktionsgrundsätze
und in die Verträge, nicht nur in die Datenschutzerklärung.

**Auswertung:** Nur anonyme, aggregierte Pfadstatistik mit Mindestfallzahlen je
Auswertungszelle. Ohne Identifikatoren, ohne Rückrechenbarkeit auf einzelne Haushalte
in kleinen Gemeinden.

---

## 9. Qualitätssicherung

### 9.1 Die Abnahmefälle sind automatisierte Tests

Die 18 Testfälle aus der Wizard-Recherche werden als maschinell ausführbare Tests
hinterlegt. Nach jeder Regeländerung laufen sie automatisch. Ein Test schlägt fehl,
wenn eine unklare Voraussetzung als erfüllt gilt, eine notwendige Person fehlt oder
eine abgelaufene Regelfassung als aktuell ausgegeben wird. Das ist der wichtigste
Einzelmechanismus des ganzen Systems, weil er die fachliche Richtigkeit dauerhaft
absichert und nicht nur einmal bei der Abnahme.

### 9.2 Weitere Prüfungen

| Ebene | Prüfung | Schwelle |
|---|---|---|
| Regeln | Abnahmefälle, Fristberechnung, Fassungswahl | alle bestanden, sonst kein Deployment |
| Daten | Pflichtfelder, Quellen, Prüfdatum, Zustände | keine veröffentlichte Regel ohne Quelle und Verantwortlichen |
| Barrierefreiheit | WCAG 2.2 AA, Tastatur, Kontrast, Karte mit Listenalternative | angestrebter Standard, extern geprüft vor Freigabe |
| Performance | Seitengewicht, Ladezeit bei simuliertem 3G | unter 150 KB, unter 2,5 s bis sichtbarer Inhalt |
| Sprache | fachliche und sprachliche Prüfung kritischer Inhalte | keine maschinelle Übersetzung ohne Prüfung |
| Nutzertest | definierte Aufgaben, gemessen wird Verständnis des nächsten Schritts | mindestens acht von zehn Testpersonen lösen die Kernaufgabe |

Nutzertests müssen Personen mit geringerer Sprach- und Digitalkompetenz enthalten,
sonst messen sie das Falsche.

---

## 10. Etappen

Die verbindliche Reihenfolge steht in `../CLAUDE.md` Abschnitt 7 als M0 bis M7. Sie
gilt bei Abweichung. Die folgende Tabelle nennt dieselben Module mit den fachlichen
Abnahmekriterien.

| Modul | Ergebnis | Abnahme |
|---|---|---|
| M0 Grundlage | Datenlizenz des MDU-Bestands schriftlich, Geodatenlizenz, Fachprüfer benannt, Pilotgemeinden zugesagt, Redaktionsperson gefunden, ADR zur Technologiewahl | Ohne Datenlizenz und ohne Fachprüfer wird nicht entwickelt |
| M1 Machbarkeitsnachweis | Regelformat, Auswertung, Fristberechnung, Fassungswahl an wenigen freigegebenen Regeln | Stichtags- und Konflikttests grün |
| M2 Durchgängiger Pilot | ein Haushalt, ein Frageablauf, ein geprüfter Regelsatz, ein Ortsprofil, ein Plan, ein PDF, ein Redaktionsdurchlauf | Testpersonen verstehen ihre nächsten Schritte, Redaktion kann eine Änderung freigeben |
| M3 Redaktion | Oberfläche für Regeln und Inhalte, erzeugt Pull Requests, Prüfzyklen, Freigabe | eine Regel lässt sich ohne Git ändern, prüfen und veröffentlichen |
| M4 Website | Seitentypen, Navigation, Suche, Mehrsprachigkeit, Glossar, zwanzig Themen in voller Tiefe | Performance- und Barrierefreiheitsschwellen erreicht |
| M5 Orte | Karte, Filter, Ortsprofile, Vergleich, Leistungsdatenbank, landesweiter Index mit sichtbarer Datentiefe | Datenlücken sind vom Fehlen eines Angebots unterscheidbar |
| M6 Wizard vollständig | Kurzcheck und ausführlicher Check, Checklisten, Abdeckungsmatrix | die 18 Abnahmefälle grün, Nutzertest bestanden |
| M7 Ausbau | weitere Länder, Sprachen, Gemeinden, anonyme Auswertung | gemessener Pflegeaufwand je Gemeinde liegt vor |

Nach M7 und nur mit eigener Freigabe: gespeicherte Pläne, Erinnerungen, Simulation,
Kostenrechner, abgestimmte Verfahren mit Behörden. Die Simulation setzt lizenzierte
regionale Lohn-, Miet- und Lebenshaltungsdaten voraus; mit geschätzten Regionalwerten
wäre sie schlechter als keine. Gespeicherte Pläne setzen eine abgeschlossene
Datenschutz-Folgenabschätzung voraus.

Betrieb läuft mit, nicht hinterher. Die Anforderungen aus `betrieb.md` Abschnitt 1
müssen vor der ersten öffentlichen Veröffentlichung erfüllt sein.

Ein ausgewerteter Pilot ist bei verfügbarem Team und geklärten Daten in etwa neun bis
zwölf Monaten realistisch. Das ist eine Planungsannahme, keine Zusage.

---

## 11. Rollen

| Rolle | Aufgabe | Auslastung im Aufbau |
|---|---|---|
| Produktverantwortung | Entscheidungen, Partner, Priorisierung | dauerhaft, hoch |
| Kroatischsprachige Fachredaktion | Regeln und Inhalte pflegen, Behördenkontakt | die kritische Ressource, dauerhaft |
| Fachprüfung Recht und Steuern | Freigabe rechtsrelevanter Regeln | punktuell, aber unverzichtbar |
| Entwicklung | Architektur, Umsetzung, Betrieb | hoch im Aufbau, sinkend |
| Design und UX | System, Oberfläche, Nutzertests | hoch im Aufbau, dann punktuell |
| Datenpflege | Orte, Leistungen, Erhebung, Import | dauerhaft, skaliert mit Gemeindezahl |
| Übersetzung | Sprachfassungen, fachliche Prüfung | dauerhaft, skaliert mit Sprachen |

Die kroatischsprachige Fachredaktion ist die Ressource, an der das Projekt steht oder
fällt. Sie muss vor Entwicklungsbeginn gefunden sein, nicht danach. Entwicklung lässt
sich einkaufen, dieses Profil kaum.

---

## 12. Technische Risiken

| Risiko | Wirkung | Gegenmassnahme |
|---|---|---|
| Datenlizenz des kommunalen Bestands ungeklärt | Karte und Leistungsdatenbank nicht aufbaubar | Etappe 0, schriftliche Klärung vor Entwicklungsbeginn |
| Regeln wandern in den Code | jede Rechtsänderung wird ein Entwicklungsauftrag | Regeln als Daten, Abnahmekriterium in Etappe 1 |
| Zeitmodell zu spät eingebaut | keine korrekte Fassungswahl, Neubau nötig | Zeitattribute von Anfang an im Datenmodell |
| Pflegeaufwand übersteigt Erlös | Betrieb nicht tragfähig | Aufwand je Gemeinde in Etappe 4 messen, Preis daraus ableiten |
| Fachprüfung nicht verfügbar | Regeln bleiben Entwurf, Wizard unbrauchbar | Etappe 0, Prüfer vertraglich binden |
| Übersetzung veraltet unbemerkt | falsche Auskunft in Fremdsprache | Sprachfassung mit eigenem Status, Markierung als prüfbedürftig |
| Kapazitätsdaten werden Pflichtfeld | Pflege unmöglich, Daten veralten | Kapazität als eigenes zeitbezogenes Objekt, ohne Nachweis keine Aussage |
| Frontend zu schwer | Zielgruppe in Südamerika erreicht die Seite nicht | Performancebudget als Deployment-Bedingung |

---

## Anhang: Tonfall in den Redaktionsgrundsätzen

Der Optimismus der Plattform entsteht aus dem Werkzeug, nicht aus dem Inhalt. Wer
nach zwanzig Minuten einen Plan vor sich hat, auf dem steht, was diese Woche
erledigbar ist, fühlt sich gut, weil aus einem Berg eine Liste geworden ist. Diese
Erleichterung muss nicht erzeugt werden, nur nicht verschüttet.

| Statt | Besser | Warum |
|---|---|---|
| Voraussetzungen nicht erfüllt | Das können wir mit Ihren bisherigen Angaben noch nicht beurteilen. Diese Frage klärt es. | beides ehrlich, eines lähmt |
| Achtung, schwieriger Prozess | Dieser Schritt dauert erfahrungsgemäss am längsten. Sie können ihn schon jetzt beginnen. | benennt dasselbe und gibt eine Handlung |
| 23 offene Aufgaben | 23 Schritte, drei davon können Sie diese Woche erledigen | Handlungsfähigkeit statt Last |
| Kroatien bietet attraktive Förderungen | Für Ihren Fall kommen drei Programme in Frage. Hier sind die Bedingungen. | kein Versprechen, mehr Nutzen |
| Keine Angabe | noch nicht erhoben, so lässt es sich klären | eine Lücke wird zu einem Schritt |

Verbindliche Regeln: Jeder Bericht stellt bis zu drei Aufgaben voran, die ohne
Behördenentscheid erledigbar sind, und füllt nicht auf drei auf, wenn nur eine
sinnvoll ist. Keine Superlative ohne Beleg. Kein Weglassen
unangenehmer Fakten, wo Geld oder Zeit davon abhängen. Was leichter ist als erwartet,
wird aktiv benannt, weil viele Hürden überschätzen. Erfahrungsberichte enthalten auch
gescheiterte Versuche und zweite Anläufe.

Die Positionierung lautet: Wir nehmen Ihnen die Recherche ab, damit Sie entscheiden
können. Der Optimismus steckt im zweiten Teil des Satzes.
