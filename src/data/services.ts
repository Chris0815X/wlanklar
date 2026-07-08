// Typisierter Angebotskatalog mit stabilen IDs.
// Einzige Quelle für Preise/Beschreibungen: PricingGrid, Quiz-Logik und Ratgeber-Verlinkung
// referenzieren dieselben Einträge statt Preise als Strings zu duplizieren.

export type Segment = "privat" | "ferienwohnung" | "buero" | "schnell";

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
