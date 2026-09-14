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

## 7. Auslieferung nach ADR-0003

Checkliste für die statische Website auf dem bestehenden Hostpoint-Konto. Jeder Punkt
wird mit Datum und Person abgehakt, sobald erledigt. Bis dahin ist kein Schritt
erledigt, auch wenn er «vorbereitet» ist.

| Schritt | Inhalt | Erledigt |
|---|---|---|
| 1 Zugang | Hostpoint-Konto auf die Betreiberin, zweite Person mit Zugriff (Vertretung), Zwei-Faktor-Anmeldung im Control Panel | Konto vorhanden (Emotionframe GmbH); Vertretung und Zwei-Faktor offen |
| 2 Domain | Domain auf das Hosting, TLS-Zertifikat aktiv, Weiterleitung von http auf https | 14.09.2026, technische Verantwortung: www.povratnik.com eingerichtet, https aktiv, Weiterleitung per .htaccess |
| 3 SSH | SSH-Zugang mit Schlüssel, eigener Deploy-Schlüssel nur für das Zielverzeichnis der Website | 14.09.2026: Schlüssel `povratnik-deploy-ci-2026-09`, per `rrsync` auf `www/povratnik.com` beschränkt; privater Teil nur als GitHub-Secret `HOSTPOINT_SSH_KEY` und auf dem Rechner der technischen Verantwortung |
| 4 Deploy | Build in der CI (`npm run build`), Übertragung von `apps/web/dist` per `rsync` über SSH; Job `deploy` in `.github/workflows/validate.yml`, läuft nur nach grünem `validate` und nur von `main` | 14.09.2026, technische Verantwortung: erster erfolgreicher Lauf (Actions 34838439031), Seite unter https://www.povratnik.com erreichbar, 404 und https-Weiterleitung geprüft |
| 5 Ausfallzustand | Fehlerseite 404 als statische Datei, Wizard-Seite zeigt ohne JavaScript den definierten Hinweis | 14.09.2026: `404.html` per `.htaccess`; 500 liegt beim Anbieter |
| 6 Protokolle | Zugriffsprotokoll bei Hostpoint auf das Minimum, Aufbewahrung nach Anbieter prüfen und auf der Datenschutzseite nennen; kein Endpunkt für Wizard-Antworten | offen |
| 7 Sicherung | Quelle ist das Repository; Build reproduzierbar. Zusätzlich: GitHub-Repository regelmässig lokal spiegeln (`git clone --mirror`), einmal aus dem Spiegel neu bauen und ausliefern, protokollieren | offen |
| 8 Datenschutzseite | Anbieter Hostpoint AG, Standort Schweiz, Protokolle und Aufbewahrung in `apps/web/src/pages/datenschutz.astro` eintragen | Anbieter und Standort eingetragen; Aufbewahrung der Protokolle offen (beim Anbieter erfragen) |
| 9 Fehlerkontakt | Adresse einrichten, in Impressum und Datenschutz eintragen, Sofortweg nach `redaktionsdurchlauf.md` 2 bekannt | offen: Postfach kontakt@povratnik.com bei Hostpoint anlegen, dann eintragen |

**Ab M2b-2, sobald das Ortsprofil die Datenbank braucht:** eigener Server nach
ADR-0003 (PostgreSQL mit PostGIS, Node-Dienst, tägliches `pg_dump`, geprobte
Wiederherstellung). Die Checkliste dafür wird dann hier ergänzt.
