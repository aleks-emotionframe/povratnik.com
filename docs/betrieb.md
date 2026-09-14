# Betrieb

Version 1.2, 14.09.2026. Was vor der ersten öffentlichen Veröffentlichung
funktionieren muss, und wie Qualität gemessen wird.

---

## 1. Vor dem ersten Pilot verbindlich

| Bereich | Anforderung |
|---|---|
| Rücknahme einer falschen Regel | Sofortige Sperre der betroffenen Ausgabe durch eine benannte Person, Korrektur, nachvollziehbare Wiederfreigabe. Einmal erprobt, bevor öffentlich. Ablauf in `redaktionsdurchlauf.md` Abschnitt 2. |
| Sicherung | Inhalte, Regeln, Quellen, Freigaben, Betriebsdaten. Wiederherstellung tatsächlich durchgeführt, nicht nur konfiguriert. |
| Zugriff | Rollen getrennt, starke Anmeldung für Redaktion und Gemeindezugang, dokumentierter Umgang mit kompromittierten Konten. |
| Updates | Benannte Verantwortung für Abhängigkeiten und Sicherheitsaktualisierungen. |
| Fehlerkontakt | Erreichbar, erste Sichtung binnen zwei Werktagen, Sofortweg für falsche Fristen. |
| Datenrechte | Nutzungsrechte für Gemeindedaten und Kartengrundlagen schriftlich geklärt. Eine Quellenangabe ist keine Nutzungslizenz. |

---

## 2. Messprofil Leistung

Ein Budget ohne Messverfahren ist keine Vorgabe. Verbindlich:

**Messbedingungen:** mobiles Mittelklassegerät, gedrosselte Verbindung entsprechend
langsamem Mobilfunk, leerer Cache, fünf Messläufe, Median zählt.

**Messpunkt:** Zeit bis der Hauptinhalt sichtbar und lesbar ist, nicht bis zum
vollständigen Laden.

**Budget je Seitentyp, komprimiert übertragen, alle Startressourcen zusammen
einschliesslich HTML, CSS, Schriften, Bilder:**

| Seitentyp | Budget | Zeit bis sichtbarer Inhalt |
|---|---|---|
| Informationsseite, Ortsprofil | 150 KB | 2,5 s |
| Suche und Liste | 250 KB | 3,0 s |
| Karte | 600 KB | 4,0 s |
| Wizard einschliesslich Regelpaket | 500 KB | 3,5 s |
| PDF-Erzeugung | zusätzlich 400 KB, erst auf Aktion geladen | nicht blockierend |

Keine pauschale Ausnahme ohne Obergrenze. Überschreitung bedeutet: keine Auslieferung.

---

## 3. Barrierefreiheit

Ziel WCAG 2.2 AA. Automatisierte Prüfung ist Voraussetzung, aber keine Freigabe:
zusätzlich Tastaturbedienung, Prüfung mit Screenreader und eine menschliche
Nutzungsprüfung. Die Karte hat immer eine gleichwertige Listenansicht. Status wird
immer auch als Text ausgegeben, nie nur als Farbe.

Mehrsprachige Gestaltung wird eigens geprüft: lange Amtsbezeichnungen, unterschiedliche
Textlängen, Sprachwechsel im Layout.

---

## 4. Datenschutz nach Bereichen

Die pauschale Aussage «keine Personendaten» ist falsch, sobald Redaktions- und
Gemeindekonten existieren. Vier getrennte Bereiche:

| Bereich | Regel |
|---|---|
| Wizard-Antworten | Ausschliesslich lokale Auswertung, keine Übermittlung. Keine Antwortwerte in URLs, Telemetrie, Fehlerberichten oder Suchanfragen. Kein Endpunkt, der sie entgegennimmt. |
| Technischer Betrieb | Erforderliche Datenarten, Zwecke, Zugriffsrechte und Löschfristen dokumentiert. |
| Redaktion und Gemeinde | Benannte Konten und Rollen, getrennt vom anonymen Nutzerbereich. |
| Statistik | Nur die Ereignisse aus der Positivliste in Abschnitt 4.1, Mindestfallzahlen je Auswertungszelle, keine Rekonstruktion von Haushaltsprofilen aus seltenen Kombinationen. |

### 4.1 Positivliste erlaubter Ereignisse

Der Rückkehrerbericht braucht Nachfragedaten, CLAUDE.md 2.5 verbietet Antwortwerte in
der Telemetrie. Beides geht zusammen, wenn ausschliesslich die folgenden Ereignisse
erhoben werden. Alles, was nicht auf dieser Liste steht, wird nicht erhoben. Die Liste
wird nur durch eine eigene Entscheidung erweitert, nicht durch Implementierung.

| Ereignis | Übertragene Angabe | Nicht übertragen |
|---|---|---|
| Wizard begonnen | Zeitstempel gerundet auf den Tag, Sprachfassung | nichts sonst |
| Abbruch | Nummer der zuletzt gezeigten Frage | die Antwort auf diese Frage |
| Wizard abgeschlossen | Zeitstempel, Anzahl beantworteter Fragen | Antwortwerte |
| Route erzeugt | Routenkennung R0 bis R7, ohne Personenbezug | Staatsangehörigkeit, Herkunftsland, Haushaltszusammensetzung |
| Klärung erzeugt | Kennung der Klärungsaufgabe | warum sie entstanden ist |
| Themenseite gelesen | Seitenkennung, Sprachfassung | Herkunft des Aufrufs aus dem Wizard |
| Fehler gemeldet | Seiten- oder Regelkennung, Freitext des Nutzers | das Haushaltsprofil, auch nicht anteilig |

**Regeln für jede dieser Erhebungen.** Kein Identifikator, keine Sitzungskennung über
Seiten hinweg, keine Kombination mehrerer Ereignisse zu einem Pfad einer einzelnen
Person. Auswertung nur aggregiert mit Mindestfallzahl je Zelle. Aus «Abbruch bei Frage
17» darf nie rekonstruierbar werden, wer abgebrochen hat oder was er geantwortet hat.

**Was das für den Rückkehrerbericht bedeutet.** Er kann sagen, an welcher Frage
abgebrochen wird und welche Routen und Klärungen wie oft entstehen. Er kann nicht
sagen, aus welchem Land die Abbrecher kamen oder welche Statuskombination sie hatten,
weil das Antwortwerte wären. Diese Einschränkung ist beabsichtigt. Wer sie aufheben
will, braucht eine eigene Rechtsgrundlage und eine Einwilligung, keine
Implementierungsentscheidung.

**PDF:** Der Download erfolgt auf Wunsch. Der Hinweis, dass die Datei auf gemeinsam
genutzten Geräten sichtbar bleibt, gehört in die Oberfläche.

**Abnahme:** Netzwerkverkehr beim Ausfüllen, Filtern und PDF-Erstellen wird untersucht
und das Ergebnis dokumentiert.

**Gespeicherte Pläne** und ein Export mit Wiederimport sind neue Speicherfunktionen
und derzeit nicht freigegeben. Vorbedingung ist eine Datenschutz-Folgenabschätzung,
weil dann Abstammung über Generationen, Familienbeziehungen, Sorgerechtsfragen,
Einkommen und ein Gesundheitsindikator zusammenkommen. Diese Abschätzung ersetzt nicht
die Prüfung des bereits laufenden Dienstes.

**Dauerhaft ausgeschlossen:** Nutzung persönlicher Migrationsprofile für politische
oder kommerzielle Zielgruppenwerbung.

---

## 5. Abdeckung sichtbar machen

Weltweiter Zugang darf nicht als weltweit vollständige Einzelfallprüfung verstanden
werden. Eine Abdeckungsmatrix zeigt je Land und Personengruppe: vollständig geprüft,
Grundlagen vorhanden, noch im Aufbau.

Ein nicht abgedeckter Fall führt nie zu einem negativen Ergebnis. Wissen, zuständige
Stelle und ein konkreter Klärungsschritt bleiben zugänglich.

---

## 6. Wirtschaftliche Leitplanken

Kerninformationen, Karte, Vergleich und Wizard bleiben kostenlos. Bezahlt werden
Pflege, Übersetzung und eine eigene Willkommensoberfläche für Gemeinden sowie
gekennzeichnete Fachpartnerprofile. Eine nicht zahlende Gemeinde wird nicht künstlich
unvollständig gehalten.

Der Pflegeaufwand je Gemeinde wird im Pilot über vier Wochen real gemessen. Preis und
Paketumfang werden daraus abgeleitet, nicht umgekehrt.

---

## 7. Server-Einrichtung nach ADR-0003

Checkliste für den ersten Server bei Hetzner Cloud. Reihenfolge ist verbindlich;
jeder Punkt wird mit Datum und Person in diesem Abschnitt abgehakt, sobald erledigt.
Bis dahin ist kein Schritt erledigt, auch wenn er «vorbereitet» ist.

| Schritt | Inhalt | Erledigt |
|---|---|---|
| 1 Konto | Hetzner-Konto auf die Betreiberin, Zahlungsmittel, Zwei-Faktor-Anmeldung, zweite Person mit Zugriff (Vertretung) | offen |
| 2 Server | kleinster Cloud-Server, Standort Falkenstein oder Nürnberg, aktuelles Ubuntu LTS, nur SSH-Schlüssel, kein Passwort, Root-Anmeldung aus | offen |
| 3 Grundhärtung | `unattended-upgrades` an, Firewall nur 22, 80, 443, `fail2ban` für SSH, eigener Nutzer mit `sudo` | offen |
| 4 Auslieferung | Caddy als Webserver mit automatischem Zertifikat, `apps/web/dist` als Wurzel, Domain auf die Server-Adresse | offen |
| 5 Deploy | Build in der CI, Übertragung per `rsync` über SSH mit eigenem Deploy-Schlüssel (nur Lesen des Repos, nur Schreiben ins Zielverzeichnis). Erst einrichten, wenn 1 bis 4 stehen | offen |
| 6 Datenbank | ab M2b-2: PostgreSQL und PostGIS aus den Ubuntu-Paketen, nur lokal erreichbar, eigene Rolle je Dienst | offen |
| 7 Sicherung | täglich `pg_dump` plus Kopie von `content/` und Konfiguration auf eine Hetzner Storage Box (SFTP), 30 Tage Vorhaltung, zusätzlich wöchentlicher Server-Snapshot | offen |
| 8 Wiederherstellung | einmal auf einem frischen Server aus der Sicherung wiederherstellen, Zeit messen, hier protokollieren. Ohne diesen Eintrag kein Pilot (Abschnitt 1) | offen |
| 9 Protokolle | Caddy-Zugriffsprotokoll ohne IP-Adressen oder mit gekürzten Adressen, Aufbewahrung 14 Tage; kein Zugriff auf Wizard-Antworten, weil es keinen Endpunkt gibt | offen |
| 10 Datenschutzseite | Anbieter, Standort, Protokolle und Aufbewahrung in `apps/web/src/pages/datenschutz.astro` eintragen | offen |
| 11 Fehlerkontakt | Adresse einrichten, in Impressum und Datenschutz eintragen, Sofortweg nach `redaktionsdurchlauf.md` 2 bekannt | offen |

Was hier bewusst fehlt: Docker, Kubernetes, ein zweiter Server. Für den Pilot ist ein
Server mit geprobter Wiederherstellung sicherer als zwei ohne.
