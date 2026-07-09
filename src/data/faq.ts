// Gemeinsame FAQ-Einträge, wiederverwendbar auf Homepage, Segment-Seiten und im Ratgeber.
// Formuliert aus Kundensicht: die Fragen, die vor einer Anfrage wirklich im Kopf sind.

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
}

export const faqEntries: FaqEntry[] = [
  // Allgemein / Privatkunden
  {
    id: "was-kostet-es",
    question: "Was kostet mich das am Ende wirklich?",
    answer:
      "Sie zahlen den angegebenen Festpreis – keine Stundensätze, die weiterlaufen. Neue Geräte kommen nur dazu, wenn sie wirklich sinnvoll sind, und immer erst nach Ihrer Zustimmung. Eine eventuelle Anfahrtspauschale nennen wir Ihnen transparent vor der Terminbestätigung.",
  },
  {
    id: "check-garantie",
    question: "Was, wenn der WLAN-Check keine verbesserungsfähige Ursache findet?",
    answer:
      "Dann zahlen Sie statt 99 € nur 29 € Servicepauschale – das sagen wir Ihnen so klar zu. Und falls sich vor Ort direkt eine Lösung ergibt: Wird aus dem Check das WLAN-Komplettpaket, zahlen Sie nicht 99 € + 199 €, sondern 199 € gesamt.",
  },
  {
    id: "anfahrt",
    question: "Kommt noch eine Anfahrt dazu?",
    answer:
      "Im Kerngebiet rund um Senftenberg und Großräschen ist die Anfahrt inklusive. Außerhalb gilt eine faire Entfernungspauschale, die Sie vor der Terminbestätigung erfahren – nie hinterher. Mit dem PLZ-Check auf der Einsatzgebiet-Seite sehen Sie sofort eine Einschätzung.",
  },
  {
    id: "termin-wie-schnell",
    question: "Wie schnell bekomme ich einen Termin?",
    answer:
      "Nach Ihrer Anfrage melden wir uns schnellstmöglich mit einem konkreten Terminvorschlag. Wenn es dringend ist, schreiben Sie es einfach dazu – oft lässt sich kurzfristig etwas einrichten.",
  },
  {
    id: "vorbereitung",
    question: "Muss ich für den Termin etwas vorbereiten?",
    answer:
      "Nein, nichts zwingend. Hilfreich sind die Zugangsdaten zum Router (oft auf einem Aufkleber am Gerät oder in den Anbieter-Unterlagen). Falls Sie sie nicht finden: kein Problem, vieles können wir trotzdem prüfen.",
  },
  {
    id: "kein-routerzugang",
    question: "Ich habe kein Routerpasswort – geht trotzdem etwas?",
    answer:
      "Ja. Messen, prüfen und die Ursache eingrenzen geht auch ohne Zugriff. Nur für Änderungen am Router selbst brauchen wir das Passwort. Ein Zurücksetzen des Routers machen wir grundsätzlich nur nach Ihrer ausdrücklichen Zustimmung.",
  },
  {
    id: "problem-nicht-loesbar",
    question: "Was ist, wenn sich mein Problem nicht sofort lösen lässt?",
    answer:
      "Dann bekommen Sie eine ehrliche Einschätzung: was die Ursache ist, welche Lösung sinnvoll wäre und was sie kosten würde. Sie entscheiden dann in Ruhe – wir verkaufen Ihnen nichts, was Sie nicht brauchen.",
  },
  {
    id: "hardware-im-preis",
    question: "Sind neue Geräte im Preis enthalten?",
    answer:
      "Nein, Hardware wird separat berechnet – aber nur, wenn sie wirklich nötig ist, und immer transparent nach Absprache. Viele Probleme lassen sich ohne neue Geräte lösen, etwa durch besseren Standort oder richtige Einstellungen.",
  },
  {
    id: "vorhandene-geraete",
    question: "Nutzen Sie meine vorhandenen Geräte weiter?",
    answer:
      "Ja, wenn sie technisch sinnvoll und stabil sind. Was schon da ist und funktioniert, wird eingebunden statt ersetzt. Nur wenn ein altes Gerät mehr Probleme verursacht als löst, empfehlen wir ehrlich einen Wechsel.",
  },
  {
    id: "neue-hardware-pflicht",
    question: "Muss ich direkt neue Geräte kaufen?",
    answer:
      "Nein. Erst wird geprüft und gemessen, was vorhanden ist. Sehr oft liegt die Lösung in besserer Platzierung oder richtiger Einrichtung – ganz ohne Neukauf.",
  },
  {
    id: "telefon-einrichten",
    question: "Kann WLANklar auch ein weiteres Telefon im Haus einrichten?",
    answer:
      "Ja. Wenn Ihre vorhandene Router- oder Telefontechnik dafür geeignet ist (z. B. per DECT, wenn die vorhandene Technik es unterstützt), kann WLANklar ein zusätzliches schnurloses Handgerät einrichten und vor Ort testen. Das ist besonders praktisch für Schlafzimmer, Büro oder Obergeschoss. Hardware ist bei Bedarf separat.",
  },
  {
    id: "nachbetreuung",
    question: "Was ist, wenn nach dem Termin noch Fragen auftauchen?",
    answer:
      "7 Tage kurze Rückfragen zur eingerichteten Lösung sind inklusive. So können Sie in Ruhe testen, ob alles zuverlässig läuft. Neue Geräte oder neue Probleme sind dann ein neuer Auftrag – das sagen wir aber vorher klar.",
  },
  {
    id: "perfektes-wlan",
    question: "Habe ich danach garantiert perfektes WLAN in jedem Raum?",
    answer:
      "Ehrliche Antwort: Das kann seriös niemand garantieren. Wir messen vor Ort, erklären die Ursache und setzen die sinnvollste Lösung um. In manchen Häusern braucht wirklich stabile Abdeckung ein LAN-Kabel oder zusätzliche Hardware – das erfahren Sie von uns vorher, nicht hinterher.",
  },
  {
    id: "elektronikmarkt-vergleich",
    question: "Warum nicht einfach der Einrichtungsservice vom Elektronikmarkt?",
    answer:
      "Für eine reine Geräte-Ersteinrichtung kann der günstiger sein. WLANklar lohnt sich, wenn Ihr WLAN trotz Router, Repeater oder schnellem Anschluss nicht zuverlässig läuft: Wir messen vor Ort, finden die tatsächliche Ursache – Anschluss, Router, Signal, Repeater, Kabel oder Endgerät – und lösen sie passend für Ihr Zuhause, Ihre Ferienwohnung oder Ihr kleines Büro.",
  },

  // Ferienwohnungen & Monteurzimmer (Inhaber-Sicht)
  {
    id: "fewo-lohnt-sich",
    question: "Lohnt sich professionelles Gäste-WLAN für meine Unterkunft überhaupt?",
    answer:
      "WLAN ist einer der häufigsten Gründe für Gäste-Nachrichten und für Punktabzug in Bewertungen – obwohl die Unterkunft selbst top ist. Ein sauber eingerichtetes Gäste-WLAN mit QR-Code bedeutet: weniger Rückfragen, professioneller erster Eindruck bei der Anreise und ein Risiko weniger bei den Bewertungen.",
  },
  {
    id: "fewo-gaeste-probleme",
    question: "Was ist, wenn Gäste trotzdem Fragen zum WLAN haben?",
    answer:
      "Dafür bekommen Sie eine kurze Gästeanleitung und auf Wunsch eine Notfallkarte mit den wichtigsten Schritten – das fängt die typischen Fragen ab, bevor sie bei Ihnen landen. Und 7 Tage nach der Einrichtung sind kurze Rückfragen an uns inklusive.",
  },
  {
    id: "fewo-anwesenheit",
    question: "Muss ich beim Termin selbst vor Ort sein?",
    answer:
      "Nicht unbedingt. Nach Absprache geht der Termin auch mit Schlüsselübergabe oder zwischen zwei Anreisen – gerade für Vermieter, die nicht am Ort wohnen, ist das oft die praktischste Lösung. Die Dokumentation bekommen Sie danach digital.",
  },
  {
    id: "fewo-netztrennung",
    question: "Können Gäste auf mein privates Netzwerk zugreifen?",
    answer:
      "Nach der Einrichtung nicht mehr. Das Gäste-WLAN wird sauber von Ihrem privaten Netz getrennt – Gäste kommen ins Internet, aber nicht an Ihre eigenen Geräte, Kameras oder Daten.",
  },

  // Kleine Büros, Praxen & Studios
  {
    id: "buero-projekte",
    question: "Machen Sie auch mehr als WLAN und Netzwerk?",
    answer:
      "Unser Fokus liegt auf WLAN, Gästezugang und einfachen Netzwerkthemen – das machen wir richtig. Kleinere Projekte darüber hinaus sind nach individueller Absprache durchaus möglich: Sprechen Sie uns einfach an, wir sagen ehrlich, ob es zu uns passt.",
  },
  {
    id: "buero-netto",
    question: "Sind die Preise netto oder brutto?",
    answer:
      "Die Gewerbepreise auf dieser Seite verstehen sich netto, zuzüglich Mehrwertsteuer. Sie erhalten selbstverständlich eine ordentliche Rechnung für Ihre Buchhaltung.",
  },
  {
    id: "buero-termin",
    question: "Geht ein Termin auch außerhalb unserer Öffnungszeiten?",
    answer:
      "Ja, nach Absprache auch vor Öffnung oder nach Feierabend – damit Ihr Betrieb ungestört weiterläuft und keine Kunden im Laden stehen, während am Netzwerk gearbeitet wird.",
  },

  // Technik-Hilfe zuhause
  {
    id: "technik-jeden-computer",
    question: "Repariert WLANklar jeden Computer?",
    answer:
      "Nein. WLANklar hilft bei ausgewählten, klar abgrenzbaren Technikproblemen zuhause. Bei Hardwaredefekten, Displaybruch, Mainboard-Schäden oder professioneller Datenrettung ist eine spezialisierte Werkstatt die bessere Wahl.",
  },
  {
    id: "technik-laptop-schneller",
    question: "Kann ein alter Laptop wirklich wieder schneller werden?",
    answer:
      "Manchmal ja. Häufig bringen SSD, mehr RAM oder eine saubere Neueinrichtung viel. Ob sich das lohnt, hängt vom Gerät ab. WLANklar prüft das und gibt eine ehrliche Empfehlung.",
  },
  {
    id: "technik-datenuebernahme",
    question: "Übernimmt WLANklar auch Daten vom alten auf den neuen Laptop?",
    answer:
      "Ja, soweit die Daten zugänglich sind und das alte Gerät noch funktioniert. Professionelle Datenrettung bei defekten Datenträgern ist nicht Teil des Angebots.",
  },
  {
    id: "technik-windows-neu",
    question: "Richten Sie auch Windows neu ein?",
    answer:
      "Ja, nach vorheriger Absprache. Wichtig ist vorher zu klären, welche Daten gesichert werden sollen und welche Programme oder Zugänge später wieder benötigt werden.",
  },
  {
    id: "technik-drucker",
    question: "Helfen Sie bei Druckern?",
    answer:
      "Ja, wenn es um die Einbindung ins WLAN oder Heimnetz, Treiber/App und einfache Funktionstests geht. Sehr alte oder defekte Drucker können jedoch wirtschaftlich wenig sinnvoll sein.",
  },
  {
    id: "technik-kaufberatung",
    question: "Kann ich auch Kaufberatung buchen?",
    answer:
      "Ja. WLANklar hilft bei der Auswahl von Laptop, Router, Drucker oder Zubehör, damit Sie kein unpassendes Gerät kaufen.",
  },
  {
    id: "technik-senioren",
    question: "Ist das auch für Senioren geeignet?",
    answer:
      "Ja. Viele Technikthemen werden bewusst ruhig und verständlich erklärt – zum Beispiel neues Gerät einrichten, Fotos sichern, E-Mail, Drucker oder einfache Backup-Lösungen.",
  },
  {
    id: "technik-bezahlung",
    question: "Wie wird bezahlt?",
    answer:
      "Privatkunden zahlen bequem direkt vor Ort per Karte, Smartphone oder bar. Die Rechnung erhalten Sie digital.",
  },
];

export function getFaqEntries(ids: string[]): FaqEntry[] {
  return ids
    .map((id) => faqEntries.find((entry) => entry.id === id))
    .filter((entry): entry is FaqEntry => Boolean(entry));
}
