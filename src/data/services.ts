// Typisierter Angebotskatalog mit stabilen IDs.
// Einzige Quelle für Preise/Beschreibungen: PricingGrid, Quiz-Logik und Ratgeber-Verlinkung
// referenzieren dieselben Einträge statt Preise als Strings zu duplizieren.
import { techHelpPrices } from "./config";

export type Segment = "privat" | "ferienwohnung" | "buero" | "schnell" | "technik";

export interface Service {
  id: string;
  segment: Segment;
  name: string;
  price: number;
  priceFrom: boolean;
  priceSuffix?: string; // z. B. "zzgl. Hardware"
  tagline: string;
  includes: string[];
  featured?: boolean;
  /** Hervorgehobener Hinweis auf der Preis-Karte, z. B. Anrechnung auf ein Folgepaket. */
  upsellNote?: string;
  /** Risiko-Umkehr / Zusage, direkt auf der Preis-Karte sichtbar. */
  guaranteeNote?: string;
  /** Klare Leistungsgrenze fuer kompakte Einzelleistungen. */
  scopeNote?: string;
}

export const services: Service[] = [
  {
    id: "wlan-check",
    segment: "privat",
    name: "WLAN-Check & Soforthilfe",
    price: 99,
    priceFrom: false,
    tagline: "Wir finden die Ursache, beheben einfache Probleme direkt und zeigen Ihnen den nächsten sinnvollen Schritt.",
    includes: [
      "Geschwindigkeit direkt am Router messen",
      "WLAN in Problemräumen testen",
      "Repeater, Mesh oder Powerline prüfen",
      "Direkt inklusive: Routerstandort optimieren und falsche Einstellungen korrigieren",
      "Klare Empfehlung: günstig, solide oder langfristig",
    ],
    upsellNote: "Wird daraus direkt das WLAN-Komplettpaket, zahlen Sie nicht 99 € + 199 €, sondern 199 € gesamt.",
    guaranteeNote:
      "Können wir weder eine nachvollziehbare Ursache feststellen noch eine konkrete sinnvolle Handlungsempfehlung geben, zahlen Sie statt 99 € nur 29 € Servicepauschale.",
  },
  {
    id: "wlan-soforthilfe",
    segment: "privat",
    name: "WLAN-Komplettpaket",
    price: 199,
    priceFrom: false,
    priceSuffix: "zzgl. Hardware",
    tagline: "Analyse plus komplette Optimierung – in einem Termin.",
    includes: [
      "Alles aus dem WLAN-Check & Soforthilfe",
      "Router, Repeater oder Mesh sinnvoll einrichten",
      "WLAN-Namen, Gastnetz oder Frequenzbänder optimieren",
      "Wichtige Geräte verbinden",
      "Vorher-/Nachher-Test mit messbarem Ergebnis",
    ],
    featured: true,
  },
  {
    id: "stabiles-heimnetz",
    segment: "privat",
    name: "Stabiles Heimnetz",
    price: 499,
    priceFrom: true,
    priceSuffix: "zzgl. Hardware",
    tagline: "Für Häuser, mehrere Etagen, Homeoffice oder größere WLAN-Probleme.",
    includes: [
      "Heimnetz-Konzept",
      "Access Point, Mesh oder LAN-Brücke einrichten",
      "Bessere WLAN-Abdeckung planen",
      "Wichtige Geräte priorisieren",
      "Einfache Dokumentation",
    ],
  },
  {
    id: "router-basis",
    segment: "schnell",
    name: "Router-Einrichtung",
    price: 69,
    priceFrom: false,
    priceSuffix: "zzgl. ggf. Anfahrt",
    tagline: "Neuer Router angekommen? Wir richten ihn sauber und sicher ein.",
    includes: [
      "Anschließen und Ersteinrichtung von Internet, WLAN und ggf. Telefonie",
      "Aktuelle Updates und sichere Passwörter",
      "Bis zu 3 Geräte verbinden",
      "Kurze Einweisung, damit Sie alles Wichtige kennen",
    ],
    scopeNote:
      "Der Preis gilt für einen vorhandenen kompatiblen Router und bis zu 45 Minuten vor Ort. Anschluss, Zugangsdaten oder Provider-App müssen verfügbar sein. Bis zu drei Geräte sind inklusive.",
  },
  {
    id: "repeater-basis",
    segment: "schnell",
    name: "Repeater-Einrichtung",
    price: 69,
    priceFrom: false,
    priceSuffix: "zzgl. ggf. Anfahrt",
    tagline: "Ihr Repeater wird dort platziert, wo er wirklich hilft – verbunden und getestet.",
    includes: [],
    scopeNote:
      "Der Preis gilt für einen vorhandenen kompatiblen Repeater und bis zu 45 Minuten vor Ort. Weitere Repeater, Mesh-Geräte oder eine vollständige Abdeckungsanalyse sind nicht enthalten.",
  },
  {
    id: "smart-tv",
    segment: "schnell",
    name: "Smart-TV verbinden & Streaming prüfen",
    price: 69,
    priceFrom: false,
    priceSuffix: "zzgl. ggf. Anfahrt",
    tagline: "Fernseher oder Streaming-Gerät ins Netzwerk bringen und die wichtigsten Funktionen testen.",
    includes: [
      "Ein Smart-TV oder Streaming-Gerät",
      "Mit vorhandenem WLAN oder LAN verbinden",
      "Softwarestand kurz prüfen",
      "Bis zu zwei vorhandene Streaming-Apps anmelden, wenn die Zugangsdaten vorliegen",
      "Kurzer Wiedergabetest",
    ],
    scopeNote:
      "Der Preis gilt für ein Gerät und bis zu 45 Minuten vor Ort. Kontozugangsdaten müssen vorhanden sein.",
  },
  {
    id: "telefon-handgeraet",
    segment: "schnell",
    name: "Weiteres Telefon im Haus einrichten",
    price: 49,
    priceFrom: true,
    priceSuffix: "als Zusatzleistung",
    tagline:
      "Ob Schlafzimmer, Büro oder Obergeschoss: WLANklar prüft, ob Ihre vorhandene Router- oder Telefontechnik ein zusätzliches schnurloses Handgerät unterstützt, richtet es ein und testet die Verbindung vor Ort.",
    includes: ["Als Zusatz zu Router-, WLAN- oder Heimnetz-Terminen buchbar. Hardware bei Bedarf separat."],
  },
  {
    id: "gastgeber-check",
    segment: "ferienwohnung",
    name: "Gastgeber-Check & Soforthilfe",
    price: 199,
    priceFrom: false,
    tagline: "Prüfen, einfache Probleme direkt verbessern und ein nutzbares Ergebnis erhalten.",
    includes: [
      "WLAN in den relevanten Gästebereichen messen",
      "Router, Repeater und Gäste-WLAN prüfen",
      "Einfache Einstellungen direkt korrigieren",
      "Vorhandenes Gäste-WLAN optimieren oder mit geeigneter vorhandener Technik einrichten",
      "Einen digitalen WLAN-QR-Code erstellen",
      "Einen Smart-TV oder ein Streaming-Gerät kurz prüfen",
      "Kurze digitale Zusammenfassung für den Vermieter",
    ],
    upsellNote:
      "Wird daraus direkt Gäste-WLAN Komfort, zahlen Sie nicht 199 € + 699 €, sondern ab 699 € gesamt zuzüglich gegebenenfalls benötigter Hardware.",
    scopeNote:
      "Der Preis gilt für ein Objekt und bis zu 90 Minuten vor Ort mit vorhandener kompatibler Technik. Neue Hardware und umfangreichere Änderungen werden vorab besprochen.",
  },
  {
    id: "gaeste-wlan-komfort",
    segment: "ferienwohnung",
    name: "Gäste-WLAN Komfort",
    price: 699,
    priceFrom: true,
    priceSuffix: "zzgl. Hardware",
    tagline: "Gäste-WLAN, QR-Code und Smart-TV professionell eingerichtet.",
    includes: [
      "Gäste-WLAN einrichten",
      "WLAN-QR-Code erstellen",
      "Router/Repeater/Mesh optimieren",
      "Smart-TV prüfen",
      "Kurze Gästeanleitung",
      "Vermieter-Dokumentation",
      "Optional: gedrucktes Gäste-WLAN-Set mit laminierten Karten (ab 79 €)",
    ],
    featured: true,
  },
  {
    id: "saisonstart-check",
    segment: "ferienwohnung",
    name: "Saisonstart-Check",
    price: 199,
    priceFrom: false,
    priceSuffix: "pro Objekt",
    tagline: "Bereits eingerichtete Technik vor der nächsten Saison prüfen und aktualisieren.",
    includes: [
      "WLAN in den relevanten Gästebereichen messen",
      "Router, Repeater und Gäste-WLAN auf Funktion prüfen",
      "WLAN-QR-Code und Zugangsdaten kontrollieren",
      "Einen Smart-TV oder ein Streaming-Gerät kurz testen",
      "Vorhandene Gästeanleitung und Vermieter-Dokumentation aktualisieren",
      "Einfache Korrekturen an vorhandener Technik direkt durchführen",
      "Klare Empfehlung bei größerem Handlungsbedarf",
    ],
    scopeNote:
      "Gedacht für grundsätzlich eingerichtete Unterkünfte. Der Preis gilt pro Objekt für bis zu 90 Minuten vor Ort. Neue Hardware, erstmalige Einrichtung und umfangreichere Änderungen werden vorab besprochen. Für mehrere Objekte erstellen wir ein gemeinsames Angebot.",
  },
  {
    id: "gaeste-wlan-set",
    segment: "ferienwohnung",
    name: "Gäste-WLAN-Set mit gedruckten Karten",
    price: 79,
    priceFrom: true,
    tagline: "Optionale gedruckte oder laminierte Karten mit WLAN-QR-Code.",
    includes: [],
  },
  {
    id: "buero-check",
    segment: "buero",
    name: "Büro-WLAN-Check & Soforthilfe",
    price: 199,
    priceFrom: false,
    priceSuffix: "inkl. MwSt.",
    tagline: "Prüfen, einfache Netzwerkprobleme direkt lösen und den nächsten Schritt festlegen.",
    includes: [
      "Router, WLAN-Abdeckung und Kunden-WLAN prüfen",
      "Einfache WLAN- und Routereinstellungen direkt korrigieren",
      "Vorhandenes Kunden-WLAN mit geeigneter Technik optimieren oder einrichten",
      "Einen Drucker, Scanner oder ein Arbeitsplatzgerät nach Möglichkeit wieder verbinden",
      "Netzwerkverbindung eines Kartenterminals eingrenzen",
      "Kurze Vorher-/Nachher-Prüfung",
      "Klare Handlungsempfehlung mit Kostenrahmen",
    ],
    upsellNote:
      "Wird daraus direkt das Büro-WLAN Setup, zahlen Sie nicht 199 € + 599 €, sondern ab 599 € gesamt zuzüglich gegebenenfalls benötigter Hardware.",
    scopeNote:
      "Der Preis gilt für einen kleinen Standort und bis zu 90 Minuten vor Ort. Fehler in Kassen-, Zahlungs-, Termin- oder Branchensoftware sowie vollständige Firmen-IT sind nicht enthalten.",
  },
  {
    id: "buero-setup",
    segment: "buero",
    name: "Büro-WLAN Setup",
    price: 599,
    priceFrom: true,
    priceSuffix: "inkl. MwSt., zzgl. Hardware",
    tagline: "Umsetzung der Empfehlungen aus dem Büro-WLAN-Check & Soforthilfe.",
    includes: [
      "WLAN, Gästezugang und Router optimieren",
      "Drucker/Scanner einbinden",
      "Arbeitsplatzgeräte verbinden",
      "Einfache Dokumentation",
      "Basis-Sicherheitsprüfung",
    ],
    featured: true,
  },
  {
    id: "technik-check",
    segment: "technik",
    name: "Technik-Check zuhause",
    price: techHelpPrices.technikCheckFrom,
    priceFrom: true,
    tagline: "Für alle, die nicht sicher sind, ob sich Reparatur, Aufrüstung oder Neukauf lohnt.",
    includes: [
      "Gerät und Problem kurz prüfen",
      "sinnvolle Optionen erklären",
      "Aufwand und mögliche Kosten einschätzen",
      "Empfehlung: aufrüsten, neu einrichten oder ersetzen",
    ],
  },
  {
    id: "windows-11-check",
    segment: "technik",
    name: "Windows-11-Check",
    price: techHelpPrices.windows11CheckFrom,
    priceFrom: true,
    tagline: "Prüfung, ob Ihr PC oder Laptop für Windows 11 geeignet ist oder ob eine Aufrüstung sinnvoller wäre.",
    includes: [
      "Systemzustand prüfen",
      "Upgrade-Möglichkeit einschätzen",
      "Sicherheits- und Update-Situation erklären",
      "Empfehlung für Upgrade, Aufrüstung oder Neukauf",
    ],
  },
  {
    id: "laptop-schneller",
    segment: "technik",
    name: "Laptop wieder schneller machen",
    price: techHelpPrices.laptopUpgradeWorkFrom,
    priceFrom: true,
    priceSuffix: "plus Hardware",
    tagline:
      "Wenn ein älterer Laptop langsam geworden ist, prüfen wir, ob SSD, RAM oder eine saubere Neueinrichtung sinnvoll sind.",
    includes: [
      "Zustand einschätzen",
      "Aufrüstbarkeit prüfen",
      "SSD/RAM-Empfehlung",
      "Arbeitsleistung für Aufrüstung nach Absprache",
      "Hardware separat",
    ],
  },
  {
    id: "windows-neu-einrichten",
    segment: "technik",
    name: "Windows neu einrichten",
    price: techHelpPrices.windowsSetupFrom,
    priceFrom: true,
    tagline:
      "Wenn Windows träge, unübersichtlich oder fehleranfällig geworden ist, kann eine saubere Neueinrichtung sinnvoll sein.",
    includes: [
      "Vorbereitung nach Absprache",
      "Windows neu einrichten",
      "wichtige Updates",
      "Grundprogramme",
      "WLAN/Drucker nach Möglichkeit anbinden",
      "Datenübernahme optional",
    ],
  },
  {
    id: "neues-geraet-startklar",
    segment: "technik",
    name: "Neues Gerät startklar machen",
    price: techHelpPrices.newDeviceSetupFrom,
    priceFrom: true,
    tagline: "Neuer Laptop oder PC? WLANklar richtet die wichtigsten Dinge ein, damit Sie direkt sinnvoll starten können.",
    includes: [
      "Benutzerkonto",
      "WLAN",
      "Updates",
      "Browser",
      "E-Mail",
      "Drucker nach Möglichkeit",
      "kurze Erklärung",
    ],
  },
  {
    id: "datenuebernahme-fotos",
    segment: "technik",
    name: "Datenübernahme & Fotos sortieren",
    price: techHelpPrices.dataTransferFrom,
    priceFrom: true,
    tagline:
      "Dokumente, Fotos oder wichtige Dateien vom alten auf das neue Gerät übertragen – soweit technisch möglich und sinnvoll.",
    includes: [
      "Datenbestand prüfen",
      "Übertragung nach Absprache",
      "einfache Ordnerstruktur",
      "Fotos/Dokumente verständlich sortieren",
      "keine professionelle Datenrettung defekter Datenträger",
    ],
  },
  {
    id: "backup-einrichten",
    segment: "technik",
    name: "Backup verständlich einrichten",
    price: techHelpPrices.backupSetupFrom,
    priceFrom: true,
    tagline: "Damit wichtige Fotos und Dokumente nicht nur auf einem Gerät liegen.",
    includes: [
      "einfache Backup-Strategie erklären",
      "externe Festplatte oder Cloud-Grundstruktur",
      "Sicherung wichtiger Ordner einrichten",
      "kurze Anleitung für den Alltag",
    ],
  },
  {
    id: "drucker-scanner-netzwerk",
    segment: "technik",
    name: "Drucker oder Scanner ins Netzwerk bringen",
    price: techHelpPrices.printerSetupFrom,
    priceFrom: true,
    priceSuffix: "als Zusatzleistung",
    tagline: "Wenn Drucker oder Scanner nicht zuverlässig mit Laptop, PC oder WLAN zusammenarbeiten.",
    includes: [
      "Verbindung prüfen",
      "Gerät ins Netzwerk einbinden, wenn möglich",
      "Treiber/App prüfen",
      "Testdruck oder Scan",
      "besonders sinnvoll als Zusatz zu WLAN- oder Heimnetzterminen",
    ],
  },
  {
    id: "technik-kaufberatung",
    segment: "technik",
    name: "Technik-Kaufberatung",
    price: techHelpPrices.purchaseAdviceFrom,
    priceFrom: true,
    tagline: "Neuer Laptop, Router, Drucker oder Zubehör? WLANklar hilft bei der Auswahl, ohne Verkaufsdruck.",
    includes: [
      "Bedarf klären",
      "passende Geräteklasse empfehlen",
      "Fehlkäufe vermeiden",
      "auf Wunsch Einkaufsliste oder konkrete Empfehlung",
    ],
  },
];

export function getService(id: string): Service | undefined {
  return services.find((service) => service.id === id);
}

export function servicesBySegment(segment: Segment): Service[] {
  return services.filter((service) => service.segment === segment);
}

export const zusatzzeit = {
  privat15Min: 25,
  gewerblich15Min: 35,
} as const;
