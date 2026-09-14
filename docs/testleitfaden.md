# Testleitfaden Kurzcheck

Version 1.0, 14.09.2026. Für den Test mit Testpersonen nach CLAUDE.md Abschnitt 7 (M2:
«Testpersonen verstehen ihre nächsten Schritte»). Wer testet, entscheidet die
Produktverantwortung; der Leitfaden braucht keine Namen.

Wichtig vorab: Die Website läuft mit **synthetischen Beispielregeln**. Getestet wird
nicht, ob der Inhalt stimmt (das kann er heute nicht), sondern ob Fragen, Ablauf und
Plan verstanden werden. Das steht auch als gelbes Band auf der Seite.

---

## 1. Ablauf einer Testsitzung (30 bis 40 Minuten)

1. **Ohne Einführung starten.** Adresse geben: https://www.povratnik.com. Nichts erklären.
   Beobachten, ob die Person den Kurzcheck findet und startet.
2. **Laut denken lassen.** Die Person soll sagen, was sie liest, was sie erwartet, wo
   sie zögert. Nicht helfen, ausser sie steckt länger als eine Minute fest; dann den
   Punkt notieren und weiterhelfen.
3. **Eigene Lage eingeben.** Die Person beantwortet die Fragen für ihren echten
   Haushalt. Antworten bleiben im Browser; nichts wird übertragen. Wer das nicht will,
   nimmt eines der Profile aus Abschnitt 3.
4. **Plan lesen lassen.** Danach die drei Fragen aus Abschnitt 2 stellen.
5. **Drucken.** «Als PDF drucken» ausprobieren, Ergebnis kurz anschauen.
6. **Mobil.** Mindestens eine Sitzung auf dem Mobiltelefon der Testperson, nicht am
   Laptop des Testleiters. Die Pilotgruppe kommt mit dem Telefon.

## 2. Die drei Fragen nach dem Plan

1. «Was wäre Ihr nächster Schritt, wenn das echte Regeln wären?» Erwartet: Die Person
   nennt einen der bis zu drei nächsten Schritte, nicht etwas aus dem Fahrplan darunter.
2. «Was ist bei Ihnen noch offen, und warum?» Erwartet: Die Person versteht die Liste
   «Was noch offen ist» als fehlende Angabe oder fachliche Klärung, nicht als Absage.
3. «Hat die Seite Ihnen etwas zugesagt?» Erwartet: Nein. Wenn die Person glaubt, sie
   habe einen Anspruch bestätigt bekommen, ist das ein Fehler der Texte, nicht der
   Person.

## 3. Profile, falls die eigene Lage nicht eingegeben werden soll

Aus `wizard-konzept.md` Abschnitt 4, gekürzt:

| Profil | Antworten |
|---|---|
| A, Lucía | plane konkret; mit Partner und Kind; Argentinien; Andere Staatsangehörigkeit, Grosseltern oder frühere Vorfahren kroatisch; 6 bis 12 Monate; Einkommen noch offen; Partner: Andere, kein Bezug |
| D, Ivan | plane konkret; mit Partnerin; Kanada; Kroatisch, kein Bezug; später oder unklar; Rente; Partnerin: Andere, Partner mit kroatischem Bezug, Einkommen noch offen |
| E, Sofía | erkunde noch; allein; Chile; Staatsangehörigkeit weiss ich nicht, Grosseltern kroatisch; später oder unklar; Einkommen noch offen |

Bei Profil E muss der Plan nur aus Klärungen bestehen und darf nirgends «nicht
berechtigt» oder Ähnliches sagen.

## 4. Was notiert wird

Je Sitzung ein kurzes Protokoll, ohne Namen der Testperson:

- Gerät und Verbindung (Telefon, Laptop; WLAN, Mobilfunk)
- Wo die Person gestockt hat, mit dem Wortlaut der Frage
- Welche Antwortoption gefehlt hat
- Antworten auf die drei Fragen aus Abschnitt 2, sinngemäss
- Was die Person als Erstes gesucht hätte (Krankenkasse, Wohnung, Schule)
- Druck: hat das PDF gereicht, um es mitzunehmen

Protokolle kommen nach `docs/tests/` als `YYYY-MM-DD-sitzung-N.md`. Erkenntnisse, die
den Fragenpfad ändern, werden in `wizard-konzept.md` eingearbeitet, bevor Code
geändert wird (Dokument zuerst, dann Code).

## 5. Was der Test nicht prüft

Rechtliche Richtigkeit (Fachprüfung), Ladezeit unter Drosselung (`betrieb.md` 2, eigenes
Messverfahren), Barrierefreiheit mit Screenreader (`betrieb.md` 3, eigene Prüfung).
