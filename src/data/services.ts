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
}

export const services: Service[] = [
  {
    id: "wlan-check",
    segment: "privat",
    name: "WLAN-Check vor Ort",
    price: 99,
    priceFrom: false,
    tagline: "Wir finden die Ursache – und beheben einfache Probleme direkt mit.",
    includes: [
      "Geschwindigkeit direkt am Router messen",
      "WLAN in Problemräumen testen",
      "Repeater, Mesh oder Powerline prüfen",
      "Direkt inklusive: Routerstandort optimieren und falsche Einstellungen korrigieren",
      "Klare Empfehlung: günstig, solide oder langfristig",
    ],
    upsellNote: "Wird daraus direkt das WLAN-Komplettpaket, zahlen Sie nicht 99 € + 199 €, sondern 199 € gesamt.",
    guaranteeNote:
      "Finden wir keine Ursache, die sich sinnvoll verbessern lässt, zahlen Sie statt 99 € nur 29 € Servicepauschale.",
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
      "Alles aus dem WLAN-Check",
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
  },
  {
    id: "smart-tv",
    segment: "schnell",
    name: "Smart-TV & Streaming",
    price: 69,
    priceFrom: false,
    priceSuffix: "zzgl. ggf. Anfahrt",
    tagline: "Fernseher rundum startklar – mehr als nur ins WLAN bringen.",
    includes: [
      "Stabil ins Netzwerk einbinden (WLAN oder Kabel)",
      "Streaming-Apps einrichten und Konten anmelden",
      "Sender sortieren und Software aktualisieren",
      "Ruckler beim Streaming prüfen und beheben",
    ],
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
    name: "Gastgeber-Check",
    price: 199,
    priceFrom: false,
    tagline: "Der Rundum-Check für Ihre Unterkunft.",
    includes: [
      "WLAN in der Unterkunft messen",
      "Router/Repeater prüfen",
      "Gäste-WLAN-Situation prüfen",
      "Smart-TV/Streaming kurz testen",
      "WLAN-Code und Gästeinfos prüfen",
      "Google-/Website-Kurzcheck",
    ],
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
    price: 349,
    priceFrom: true,
    priceSuffix: "pro Objekt/Jahr",
    tagline: "Jährlicher Check vor Saisonstart.",
    includes: [
      "WLAN-Test vor Saisonstart",
      "Smart-TV prüfen",
      "QR-Codes prüfen",
      "Digitale Gästeinfos aktualisieren",
    ],
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
    name: "Büro-WLAN-Check",
    price: 169,
    priceFrom: false,
    priceSuffix: "zzgl. MwSt.",
    tagline: "Pragmatische Bestandsaufnahme für kleine Betriebe.",
    includes: [
      "Router und WLAN prüfen",
      "Arbeitsplätze testen",
      "Drucker/Scanner kurz prüfen",
      "Gäste-WLAN prüfen",
      "Klare Handlungsempfehlung mit Kostenrahmen",
    ],
  },
  {
    id: "buero-setup",
    segment: "buero",
    name: "Büro-WLAN Setup",
    price: 599,
    priceFrom: true,
    priceSuffix: "zzgl. Hardware & MwSt.",
    tagline: "Umsetzung der Empfehlungen aus dem Büro-WLAN-Check.",
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
