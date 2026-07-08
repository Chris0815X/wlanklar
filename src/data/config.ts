// Zentrale Konfiguration: Marke, Kontakt, Regionen.
// Ersetzt das alte wlanklar_site/config.js. Vor Veröffentlichung Platzhalter füllen.

export const siteConfig = {
  brandName: "WLANklar",
  contactName: "Christopher",
  phone: "",
  phoneDisplay: "[Telefonnummer]",
  whatsappNumber: "",
  email: "",
  regionPrimary: "Lausitz",
  regionSecondary: "Spreewald",
  region: "Lausitz & Spreewald",
  googleMapsReviewLink: "",
  bookingLink: "",
  cityExamples: [
    "Senftenberg",
    "Großkoschen",
    "Geierswalde",
    "Hoyerswerda",
    "Großräschen",
    "Lauchhammer",
    "Schwarzheide",
    "Lauta",
    "Ruhland",
    "Elsterheide",
    "Vetschau",
    "Raddusch",
    "Burg im Spreewald",
    "Lübbenau",
    "Lehde",
    "Leipe",
    "Straupitz",
    "Lübben",
    "Schlepzig",
  ],
} as const;

interface TrackingConfig {
  enabled: boolean;
  debug: boolean;
  requireConsentForExternalTags: boolean;
  forwardToDataLayer: boolean;
  attributionParams: string[];
  clickIdParams: string[];
}

export const trackingConfig: TrackingConfig = {
  enabled: true,
  debug: false,
  requireConsentForExternalTags: true,
  forwardToDataLayer: false,
  attributionParams: ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"],
  clickIdParams: ["gclid", "gbraid", "wbraid", "fbclid", "msclkid"],
};
